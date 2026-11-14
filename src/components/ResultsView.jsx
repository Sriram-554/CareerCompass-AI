import { useEffect, useState } from 'react'
import CoachPlan from './CoachPlan'
import ShareResults from './ShareResults'
import { generateCoachPlan } from '../coachEngine'
import { fetchCoachPlan } from '../utils/llmCoach'
import { buildRankingExplanation } from '../recommendationEngine'

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
  const rankingExplanation = buildRankingExplanation(recommendations, formData)
  const [activeTab, setActiveTab] = useState('matches')
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

      <div className="results-summary-card">
        <div>
          <strong>Top match: {topCareer?.title}</strong>
          <p>{topCareer ? `${topCareer.score}% fit` : 'No matches yet'}</p>
        </div>
        <div className="summary-chips">
          {recommendations.slice(0, 3).map((career, index) => (
            <span key={career.title}>
              #{index + 1} {career.title}
            </span>
          ))}
        </div>
      </div>

      {rankingExplanation && (
        <div className="ranking-explanation">
          <strong>Why this ranking?</strong>
          <p>{rankingExplanation}</p>
        </div>
      )}

      {roadmapMessage && (
        <div className="form-error-banner" role="alert">
          {roadmapMessage}
        </div>
      )}

      <div className="results-tabs" role="tablist" aria-label="Results sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'matches'}
          className={activeTab === 'matches' ? 'active' : ''}
          onClick={() => setActiveTab('matches')}
        >
          Matches
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'plan'}
          className={activeTab === 'plan' ? 'active' : ''}
          onClick={() => setActiveTab('plan')}
        >
          Plan
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'share'}
          className={activeTab === 'share' ? 'active' : ''}
          onClick={() => setActiveTab('share')}
        >
          Share
        </button>
      </div>

      {activeTab === 'plan' && (
        <CoachPlan
          plan={coachPlan}
          loading={coachLoading}
          source={coachSource}
        />
      )}

      {activeTab === 'matches' && (
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

              <h4>
                {career.missingSkills.length > 0
                  ? 'Skills to Build Next'
                  : 'Advanced Next Steps'}
              </h4>
              <p>
                {career.missingSkills.length > 0
                  ? career.missingSkills.join(', ')
                  : career.advancedNextSkills?.length
                    ? career.advancedNextSkills.join(', ')
                    : 'Focus on portfolio depth, system design, and interview readiness.'}
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
      )}

      {activeTab === 'share' && (
        <ShareResults
          firstName={firstName}
          recommendations={recommendations}
          collegeName={collegeName}
        />
      )}

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
