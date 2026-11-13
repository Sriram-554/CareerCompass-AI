import { useState, useEffect } from 'react'
import './Assessment.css'
import { generateRecommendations } from './recommendationEngine'
import { getRoadmap } from './roadmapData'
import AssessmentForm from './components/AssessmentForm'
import ResultsView from './components/ResultsView'
import RoadmapView from './components/RoadmapView'
import AuthButton from './components/AuthButton'
import { useAuth } from './context/AuthContext'
import {
  loadProgress,
  saveProgress,
  loadProfile,
  saveProfile,
  clearProfile,
  exportRoadmapChecklist,
} from './utils/storage'
import {
  loadCloudProfile,
  saveCloudProfile,
  loadCloudProgress,
  saveCloudProgress,
} from './utils/cloudSync'
import { resolveCollegeCode } from './utils/college'

const emptyForm = {
  name: '',
  degree: 'B.Tech',
  branch: '',
  year: '',
  skills: [],
  interests: [],
  preference: '',
  collegeCode: '',
  collegeName: '',
}

function Assessment({ onBack }) {
  const { user } = useAuth()
  const savedProfile = loadProfile()

  const [formData, setFormData] = useState({
    ...emptyForm,
    ...(savedProfile?.formData || {}),
  })
  const [formErrors, setFormErrors] = useState({})
  const [recommendations, setRecommendations] = useState(() => {
    if (!savedProfile?.formData) return null
    return generateRecommendations(savedProfile.formData)
  })
  const [selectedRoadmap, setSelectedRoadmap] = useState(null)
  const [roadmapMessage, setRoadmapMessage] = useState('')
  const [hasSavedProfile, setHasSavedProfile] = useState(!!savedProfile)
  const [progressByCareer, setProgressByCareer] = useState(() => loadProgress())
  const [syncNote, setSyncNote] = useState('')

  useEffect(() => {
    saveProgress(progressByCareer)
    if (user?.id) {
      saveCloudProgress(user.id, progressByCareer)
    }
  }, [progressByCareer, user])

  useEffect(() => {
    let cancelled = false

    async function hydrateFromCloud() {
      if (!user?.id) {
        setSyncNote('')
        return
      }

      const [cloudProfile, cloudProgress] = await Promise.all([
        loadCloudProfile(user.id),
        loadCloudProgress(user.id),
      ])

      if (cancelled) return

      if (cloudProfile) {
        setFormData({
          ...emptyForm,
          ...cloudProfile,
        })
        setRecommendations(generateRecommendations(cloudProfile))
        saveProfile(cloudProfile)
        setHasSavedProfile(true)
      }

      if (cloudProgress && Object.keys(cloudProgress).length > 0) {
        setProgressByCareer(previous => ({
          ...previous,
          ...cloudProgress,
        }))
      }

      setSyncNote('Synced with your account')
    }

    hydrateFromCloud()

    return () => {
      cancelled = true
    }
  }, [user])

  const totalTopics = selectedRoadmap
    ? selectedRoadmap.stages.reduce(
        (total, stage) => total + stage.topics.length,
        0
      )
    : 0

  const roadmapTopics = selectedRoadmap
    ? selectedRoadmap.stages.flatMap(stage => stage.topics)
    : []

  const completedTopics = selectedRoadmap
    ? progressByCareer[selectedRoadmap.title] || []
    : []

  const completedCount = roadmapTopics.filter(topic =>
    completedTopics.includes(topic)
  ).length

  const progressPercentage =
    totalTopics === 0
      ? 0
      : Math.round((completedCount / totalTopics) * 100)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function handleSelection(event, category) {
    const { value, checked } = event.target
    setFormData(previous => ({
      ...previous,
      [category]: checked
        ? [...previous[category], value]
        : previous[category].filter(item => item !== value),
    }))
    if (formErrors[category]) {
      setFormErrors(prev => ({ ...prev, [category]: '' }))
    }
  }

  function validateForm() {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Please enter your name.'
    if (!formData.branch.trim()) {
      errors.branch = 'Please enter your branch or specialization.'
    }
    if (!formData.year) errors.year = 'Please select your current year.'
    if (formData.skills.length === 0) {
      errors.skills = 'Select at least one skill.'
    }
    if (formData.interests.length === 0) {
      errors.interests = 'Select at least one area of interest.'
    }
    if (!formData.preference) {
      errors.preference = 'Please choose a career preference.'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validateForm()) return

    const college = await resolveCollegeCode(formData.collegeCode)
    if (!college.ok) {
      setFormErrors(prev => ({
        ...prev,
        collegeCode: college.error,
      }))
      return
    }

    const nextForm = {
      ...formData,
      collegeCode: college.code,
      collegeName: college.collegeName,
    }

    const results = generateRecommendations(nextForm)
    setFormData(nextForm)
    setRecommendations(results)
    setRoadmapMessage('')
    saveProfile(nextForm)
    setHasSavedProfile(true)

    if (user?.id) {
      await saveCloudProfile(user.id, nextForm)
      setSyncNote('Profile saved to your account')
    }
  }

  function handleViewRoadmap(careerTitle) {
    const roadmap = getRoadmap(careerTitle)
    if (!roadmap) {
      setRoadmapMessage(
        `A detailed roadmap for "${careerTitle}" is coming soon. Check back later!`
      )
      return
    }
    setRoadmapMessage('')
    setSelectedRoadmap(roadmap)
  }

  function handleToggleTopic(topic) {
    setProgressByCareer(previous => {
      const career = selectedRoadmap.title
      const completed = previous[career] || []
      const updated = completed.includes(topic)
        ? completed.filter(item => item !== topic)
        : [...completed, topic]
      return { ...previous, [career]: updated }
    })
  }

  function handleToggleStage(stageTopics, markComplete) {
    setProgressByCareer(previous => {
      const career = selectedRoadmap.title
      const completed = previous[career] || []

      if (markComplete) {
        const merged = Array.from(new Set([...completed, ...stageTopics]))
        return { ...previous, [career]: merged }
      }

      return {
        ...previous,
        [career]: completed.filter(topic => !stageTopics.includes(topic)),
      }
    })
  }

  function handleStartOver() {
    clearProfile()
    setFormData(emptyForm)
    setFormErrors({})
    setRecommendations(null)
    setSelectedRoadmap(null)
    setRoadmapMessage('')
    setHasSavedProfile(false)
  }

  const header = (
    <header className="assessment-header">
      <h2>
        ✦ CareerCompass<span>AI</span>
      </h2>
      <div className="header-actions">
        <AuthButton className="header-link" />
        {onBack ? (
          <button type="button" className="header-link" onClick={onBack}>
            Back to Home
          </button>
        ) : (
          <a href="/">Back to Home</a>
        )}
      </div>
    </header>
  )

  if (selectedRoadmap) {
    return (
      <div className="assessment-page">
        {header}
        <div className="assessment-container">
          {syncNote && <p className="sync-note">{syncNote}</p>}
          <RoadmapView
            roadmap={selectedRoadmap}
            progressPercentage={progressPercentage}
            completedCount={completedCount}
            totalTopics={totalTopics}
            completedTopics={completedTopics}
            onToggleTopic={handleToggleTopic}
            onToggleStage={handleToggleStage}
            onExport={() =>
              exportRoadmapChecklist(selectedRoadmap, completedTopics)
            }
            onBackToResults={() => setSelectedRoadmap(null)}
          />
        </div>
      </div>
    )
  }

  if (recommendations) {
    const firstName = formData.name.trim().split(' ')[0] || 'there'
    return (
      <div className="assessment-page">
        {header}
        <div className="assessment-container">
          {syncNote && <p className="sync-note">{syncNote}</p>}
          <ResultsView
            firstName={firstName}
            formData={formData}
            recommendations={recommendations}
            roadmapMessage={roadmapMessage}
            collegeName={formData.collegeName}
            onViewRoadmap={handleViewRoadmap}
            onEditAssessment={() => {
              setRecommendations(null)
              setRoadmapMessage('')
            }}
            onStartOver={handleStartOver}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="assessment-page">
      {header}
      <div className="assessment-container">
        <div className="assessment-heading">
          <span>CAREER DISCOVERY</span>
          <h1>Let's Understand You Better.</h1>
          <p>
            Share your details, skills and interests to begin your personalized
            career journey.
          </p>
        </div>

        {syncNote && <p className="sync-note">{syncNote}</p>}

        {hasSavedProfile && (
          <div className="saved-profile-banner">
            <div>
              <strong>Saved profile found</strong>
              <p>
                Your previous answers are loaded. Submit again to refresh
                recommendations, or start over.
              </p>
            </div>
            <button
              type="button"
              className="secondary-action"
              onClick={handleStartOver}
            >
              Start Over
            </button>
          </div>
        )}

        <AssessmentForm
          formData={formData}
          formErrors={formErrors}
          onChange={handleChange}
          onSelection={handleSelection}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default Assessment
