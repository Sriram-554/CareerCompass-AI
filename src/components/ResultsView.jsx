import { useEffect, useState } from 'react'
import CoachPlan from './CoachPlan'
import ShareResults from './ShareResults'
import { generateCoachPlan } from '../coachEngine'
import { fetchCoachPlan } from '../utils/llmCoach'

function ResultsView({
  firstName,
  formData,
  recommendations,
  roadmapMessage,
  collegeName,
  onViewRoadmap,
  onEditAssessment,
  onStartOver,
}) {
  const topCareer = recommendations[0]
  const [coachPlan, setCoachPlan] = useState(() =>
    topCareer ? generateCoachPlan(formData, topCareer) : null
  )
  const [coachLoading, setCoachLoading] = useState(Boolean(topCareer))
  const [coachSource, setCoachSource] = useState('guided')

  useEffect(() => {
    let cancelled = false

    async function loadCoach() {
      if (!topCareer) {
        setCoachPlan(null)
        setCoachLoading(false)
        return
      }

      setCoachLoading(true)
      const result = await fetchCoachPlan(formData, topCareer)
      if (cancelled) return

      setCoachPlan(result.plan)
      setCoachSource(result.source || result.plan?.source || 'guided')
      setCoachLoading(false)
    }

    loadCoach()
    return () => {
      cancelled = true
    }
  }, [formData, topCareer])

  return (
    <>
      <div className="assessment-heading">
        <span>YOUR CAREER DISCOVERY RESULTS</span>
        <h1>Hi {firstName}, here are your career matches!</h1>
        <p>
          Based on your skills, interests, branch, and preferences,
          here are your recommended career paths.
        </p>
        {collegeName && (
          <p className="college-badge">College mode: {collegeName}</p>
        )}
      </div>

      {roadmapMessage && (
        <div className="form-error-banner" role="alert">
          {roadmapMessage}
        </div>
      )}

      <CoachPlan
        plan={coachPlan}
        loading={coachLoading}
        source={coachSource}
      />

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

            <p className="match-explanation">{career.whyMatch}</p>

            <h4>Matching Skills</h4>
            <p>
              {career.matchedSkills.join(', ') || 'No direct skill matches yet'}
            </p>

            <h4>Skills to Build Next</h4>
            <p>
              {career.missingSkills.length > 0
                ? career.missingSkills.join(', ')
                : 'You already cover the core skills for this path.'}
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
              onClick={() => onViewRoadmap(career.title)}
            >
              View Learning Roadmap →
            </button>
          </div>
        ))}
      </div>

      <ShareResults
        firstName={firstName}
        recommendations={recommendations}
        collegeName={collegeName}
      />

      <div className="results-actions">
        <button
          type="button"
          className="assessment-submit"
          onClick={onEditAssessment}
        >
          Edit My Assessment
        </button>
        <button
          type="button"
          className="secondary-action full-width"
          onClick={onStartOver}
        >
          Start Over
        </button>
      </div>
    </>
  )
}

export default ResultsView
