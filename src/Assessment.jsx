import { useState, useEffect } from 'react'
import './Assessment.css'
import { generateRecommendations } from './recommendationEngine'
import { getRoadmap } from './roadmapData'
import AssessmentForm from './components/AssessmentForm'
import ResultsView from './components/ResultsView'
import RoadmapView from './components/RoadmapView'

function Assessment({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    degree: 'B.Tech',
    branch: '',
    year: '',
    skills: [],
    interests: [],
    preference: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [recommendations, setRecommendations] = useState(null)
  const [selectedRoadmap, setSelectedRoadmap] = useState(null)
  const [roadmapMessage, setRoadmapMessage] = useState('')

  const [progressByCareer, setProgressByCareer] = useState(() => {
    try {
      const savedProgress = localStorage.getItem('careerCompassProgress')
      if (!savedProgress) return {}

      const parsedProgress = JSON.parse(savedProgress)
      if (
        !parsedProgress ||
        typeof parsedProgress !== 'object' ||
        Array.isArray(parsedProgress)
      ) {
        return {}
      }

      return Object.fromEntries(
        Object.entries(parsedProgress).filter(
          ([career, topics]) =>
            typeof career === 'string' &&
            Array.isArray(topics) &&
            topics.every(topic => typeof topic === 'string')
        )
      )
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(
        'careerCompassProgress',
        JSON.stringify(progressByCareer)
      )
    } catch (error) {
      console.error('Unable to save learning progress:', error)
    }
  }, [progressByCareer])

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

  function handleSubmit(event) {
    event.preventDefault()
    if (!validateForm()) return
    setRecommendations(generateRecommendations(formData))
    setRoadmapMessage('')
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

  const header = (
    <header className="assessment-header">
      <h2>
        ✦ CareerCompass<span>AI</span>
      </h2>
      {onBack ? (
        <button type="button" className="header-link" onClick={onBack}>
          Back to Home
        </button>
      ) : (
        <a href="/">Back to Home</a>
      )}
    </header>
  )

  if (selectedRoadmap) {
    return (
      <div className="assessment-page">
        {header}
        <div className="assessment-container">
          <RoadmapView
            roadmap={selectedRoadmap}
            progressPercentage={progressPercentage}
            completedCount={completedCount}
            totalTopics={totalTopics}
            completedTopics={completedTopics}
            onToggleTopic={handleToggleTopic}
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
          <ResultsView
            firstName={firstName}
            recommendations={recommendations}
            roadmapMessage={roadmapMessage}
            onViewRoadmap={handleViewRoadmap}
            onEditAssessment={() => {
              setRecommendations(null)
              setRoadmapMessage('')
            }}
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
