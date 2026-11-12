import { useState, useEffect } from 'react'
import './Assessment.css'
import { generateRecommendations } from './recommendationEngine'
import { getRoadmap } from './roadmapData'

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

  // Store completed topics for different careers
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

  // Save progress whenever it changes
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

  // Calculate total topics in the selected career roadmap
  const totalTopics = selectedRoadmap
    ? selectedRoadmap.stages.reduce(
        (total, stage) => total + stage.topics.length,
        0
      )
    : 0

  // Get completed topics for the selected career
  const roadmapTopics = selectedRoadmap
    ? selectedRoadmap.stages.flatMap(stage => stage.topics)
    : []

  const completedTopics = selectedRoadmap
    ? progressByCareer[selectedRoadmap.title] || []
    : []

  const completedCount = roadmapTopics.filter(topic =>
    completedTopics.includes(topic)
  ).length

  // Calculate completion percentage
  const progressPercentage =
    totalTopics === 0
      ? 0
      : Math.round((completedCount / totalTopics) * 100)

  const skillsList = [
    'Python', 'Java', 'C', 'C++',
    'HTML/CSS', 'JavaScript', 'SQL',
    'Machine Learning'
  ]

  const interestsList = [
    'Artificial Intelligence',
    'Web Development',
    'Data Science',
    'Cybersecurity',
    'Cloud Computing',
    'App Development'
  ]

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function handleSelection(event, category) {
    const { value, checked } = event.target

    setFormData((previous) => ({
      ...previous,
      [category]: checked
        ? [...previous[category], value]
        : previous[category].filter(item => item !== value)
    }))

    if (formErrors[category]) {
      setFormErrors(prev => ({ ...prev, [category]: '' }))
    }
  }

  function validateForm() {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.'
    }
    if (!formData.branch.trim()) {
      errors.branch = 'Please enter your branch or specialization.'
    }
    if (!formData.year) {
      errors.year = 'Please select your current year.'
    }
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

    if (!validateForm()) {
      return
    }

    const results = generateRecommendations(formData)
    setRecommendations(results)
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

  if (selectedRoadmap) {
    return (
      <div className="assessment-page">
        <header className="assessment-header">
          <h2>✦ CareerCompass<span>AI</span></h2>
          {onBack && (
            <button type="button" className="header-link" onClick={onBack}>
              Back to Home
            </button>
          )}
        </header>

        <div className="assessment-container">
          <div className="assessment-heading">
            <span>YOUR PERSONALIZED LEARNING JOURNEY</span>
            <h1>{selectedRoadmap.title}</h1>
            <p>
              Your estimated learning duration: {selectedRoadmap.duration}
            </p>

            <div className="progress-card">
              <div className="progress-info">
                <strong>Your Learning Progress</strong>
                <strong>{progressPercentage}%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <p>
                {completedCount} of {totalTopics} topics completed
              </p>
            </div>
          </div>

          <div className="roadmap-stages">
            {selectedRoadmap.stages.map((stage, index) => (
              <div className="roadmap-stage" key={stage.title}>
                <span className="stage-number">
                  STEP {index + 1}
                </span>

                <h2>{stage.title}</h2>
                <span className="stage-duration">{stage.duration}</span>

                <h4>Topics to Learn</h4>

                <ul className="topic-list">
                  {stage.topics.map(topic => (
                    <li key={topic}>
                      <label className="topic-item">
                        <input
                          type="checkbox"
                          checked={(progressByCareer[selectedRoadmap.title] || []).includes(topic)}
                          onChange={() => {
                            setProgressByCareer(previous => {
                              const career = selectedRoadmap.title
                              const completed = previous[career] || []

                              const updated = completed.includes(topic)
                                ? completed.filter(item => item !== topic)
                                : [...completed, topic]

                              return {
                                ...previous,
                                [career]: updated
                              }
                            })
                          }}
                        />
                        <span>{topic}</span>
                      </label>
                    </li>
                  ))}
                </ul>

                <h4>Technologies and Tools</h4>
                <div className="roadmap-tags">
                  {stage.tools.map(tool => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>

                <h4>Practical Project</h4>
                <p>{stage.project}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="assessment-submit"
            onClick={() => setSelectedRoadmap(null)}
          >
            ← Back to Career Recommendations
          </button>
        </div>
      </div>
    )
  }

  if (recommendations) {
    const firstName = formData.name.trim().split(' ')[0] || 'there'

    return (
      <div className="assessment-page">
        <header className="assessment-header">
          <h2>✦ CareerCompass<span>AI</span></h2>
          {onBack && (
            <button type="button" className="header-link" onClick={onBack}>
              Back to Home
            </button>
          )}
        </header>

        <div className="assessment-container">
          <div className="assessment-heading">
            <span>YOUR CAREER DISCOVERY RESULTS</span>
            <h1>Hi {firstName}, here are your career matches!</h1>
            <p>
              Based on your skills, interests and career preferences,
              here are your recommended career paths.
            </p>
          </div>

          {roadmapMessage && (
            <div className="form-error-banner" role="alert">
              {roadmapMessage}
            </div>
          )}

          <div className="results-list">
            {recommendations.slice(0, 3).map((career, index) => (
              <div className="result-card" key={career.title}>
                <span className="result-rank">
                  #{index + 1} Recommended Career
                </span>

                <h2>{career.title}</h2>

                <p>{career.description}</p>

                <div className="match-score">
                  <strong>Match score: {career.score}%</strong>
                  <div className="score-track">
                    <div
                      className="score-fill"
                      style={{ width: `${career.score}%` }}
                    ></div>
                  </div>
                </div>

                <p className="match-explanation">
                  {career.matchedSkills.length > 0 ||
                  career.matchedInterests.length > 0 ||
                  career.preferenceMatch
                    ? `Your profile matches this career through ${
                        career.matchedSkills.length
                      } skill(s), ${
                        career.matchedInterests.length
                      } interest(s)${
                        career.preferenceMatch
                          ? ', and your career preference'
                          : ''
                      }.`
                    : 'Explore this career to discover whether it interests you.'}
                </p>

                <h4>Matching Skills</h4>
                <p>
                  {career.matchedSkills.join(', ') || 'No direct skill matches yet'}
                </p>

                <h4>Matching Interests</h4>
                <p>
                  {career.matchedInterests.join(', ') || 'Explore this field further'}
                </p>

                {career.preferenceMatch && (
                  <span className="preference-match">
                    ✓ Matches your career preference
                  </span>
                )}

                <button
                  type="button"
                  className="roadmap-button"
                  onClick={() => handleViewRoadmap(career.title)}
                >
                  View Learning Roadmap →
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="assessment-submit"
            onClick={() => {
              setRecommendations(null)
              setRoadmapMessage('')
            }}
          >
            Edit My Assessment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="assessment-page">

      <header className="assessment-header">
        <h2>✦ CareerCompass<span>AI</span></h2>
        {onBack ? (
          <button type="button" className="header-link" onClick={onBack}>
            Back to Home
          </button>
        ) : (
          <a href="/">Back to Home</a>
        )}
      </header>

      <div className="assessment-container">

        <div className="assessment-heading">
          <span>CAREER DISCOVERY</span>
          <h1>Let's Understand You Better.</h1>
          <p>
            Share your details, skills and interests
            to begin your personalized career journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          <section className="form-section">
            <h2>01. Personal Information</h2>

            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={!!formErrors.name}
              aria-describedby={formErrors.name ? 'name-error' : undefined}
            />
            {formErrors.name && (
              <p id="name-error" className="field-error" role="alert">
                {formErrors.name}
              </p>
            )}
          </section>

          <section className="form-section">
            <h2>02. Education Details</h2>

            <label htmlFor="degree">Degree</label>
            <select
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
            >
              <option>B.Tech</option>
              <option>B.E</option>
              <option>B.Sc</option>
              <option>BCA</option>
              <option>MCA</option>
              <option>M.Tech</option>
              <option>Other</option>
            </select>

            <label htmlFor="branch">Branch / Specialization</label>
            <input
              id="branch"
              type="text"
              name="branch"
              placeholder="Example: CSE - AI & ML"
              value={formData.branch}
              onChange={handleChange}
              aria-invalid={!!formErrors.branch}
              aria-describedby={formErrors.branch ? 'branch-error' : undefined}
            />
            {formErrors.branch && (
              <p id="branch-error" className="field-error" role="alert">
                {formErrors.branch}
              </p>
            )}

            <label htmlFor="year">Current Year</label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              aria-invalid={!!formErrors.year}
              aria-describedby={formErrors.year ? 'year-error' : undefined}
            >
              <option value="">Select your year</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
              <option>Graduate</option>
            </select>
            {formErrors.year && (
              <p id="year-error" className="field-error" role="alert">
                {formErrors.year}
              </p>
            )}
          </section>

          <section className="form-section">
            <h2>03. Technical Skills</h2>
            <p>Select all the skills you currently know.</p>

            <div className="selection-grid">
              {skillsList.map(skill => (
                <label className="selection-option" key={skill}>
                  <input
                    type="checkbox"
                    value={skill}
                    checked={formData.skills.includes(skill)}
                    onChange={(event) =>
                      handleSelection(event, 'skills')
                    }
                  />
                  {skill}
                </label>
              ))}
            </div>
            {formErrors.skills && (
              <p className="field-error" role="alert">
                {formErrors.skills}
              </p>
            )}
          </section>

          <section className="form-section">
            <h2>04. Areas of Interest</h2>
            <p>Select the fields you are interested in exploring.</p>

            <div className="selection-grid">
              {interestsList.map(interest => (
                <label className="selection-option" key={interest}>
                  <input
                    type="checkbox"
                    value={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={(event) =>
                      handleSelection(event, 'interests')
                    }
                  />
                  {interest}
                </label>
              ))}
            </div>
            {formErrors.interests && (
              <p className="field-error" role="alert">
                {formErrors.interests}
              </p>
            )}
          </section>

          <section className="form-section">
            <h2>05. Career Preference</h2>

            <label htmlFor="preference">What kind of career interests you most?</label>

            <select
              id="preference"
              name="preference"
              value={formData.preference}
              onChange={handleChange}
              aria-invalid={!!formErrors.preference}
              aria-describedby={formErrors.preference ? 'preference-error' : undefined}
            >
              <option value="">Choose your preference</option>
              <option>Software Development</option>
              <option>AI and Machine Learning</option>
              <option>Data Science</option>
              <option>Cybersecurity</option>
              <option>Research and Higher Studies</option>
              <option>Not Sure Yet</option>
            </select>
            {formErrors.preference && (
              <p id="preference-error" className="field-error" role="alert">
                {formErrors.preference}
              </p>
            )}
          </section>

          <button type="submit" className="assessment-submit">
            Submit Assessment →
          </button>

        </form>
      </div>
    </div>
  )
}

export default Assessment
