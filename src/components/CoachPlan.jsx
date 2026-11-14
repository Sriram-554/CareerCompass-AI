function CoachPlan({ plan, loading = false, source = 'guided' }) {
  const isAi = source === 'llm' || plan?.source === 'llm'

  if (loading && !plan) {
    return (
      <section className="coach-plan coach-plan-loading">
        <div className="coach-plan-header">
          <div className="coach-title-row">
            <span>AI CAREER COACH</span>
            <em className="coach-source loading">Generating with AI...</em>
          </div>
          <h2>Building your personalized plan</h2>
          <p>Analyzing your skills, interests, and target career.</p>
          <div className="coach-skeleton-lines">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </section>
    )
  }

  if (!plan) return null

  return (
    <section className={`coach-plan ${isAi ? 'coach-plan-ai' : 'coach-plan-guided'}`}>
      <div className="coach-plan-header">
        <div className="coach-title-row">
          <span>AI CAREER COACH</span>
          <em className={`coach-source ${isAi ? 'ai' : 'guided'}`}>
            {loading
              ? 'Updating with AI...'
              : isAi
                ? 'Generated with AI'
                : 'Guided plan (offline fallback)'}
          </em>
        </div>
        <h2>{plan.headline}</h2>
        <p>{plan.whyFit}</p>
        {!isAi && !loading && (
          <p className="coach-fallback-note">
            This is the built-in guided plan. On the live site with Groq configured,
            this section upgrades to AI-generated coaching.
          </p>
        )}
      </div>

      <div className="coach-grid">
        <div className="coach-card">
          <h3>Focus skills</h3>
          <div className="coach-tags">
            {plan.focusSkills?.map(skill => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>

        <div className="coach-card">
          <h3>Next move</h3>
          <p>
            Start with <strong>{plan.nextMove}</strong> this week.
          </p>
        </div>
      </div>

      <div className="coach-card">
        <h3>30-day plan</h3>
        <div className="coach-weeks">
          {plan.thirtyDayPlan?.map(week => (
            <div key={week.week} className="coach-week">
              <strong>
                {week.week}: {week.focus}
              </strong>
              <ul>
                {week.actions?.map(action => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="coach-card">
        <h3>Project ideas</h3>
        <ul className="coach-projects">
          {plan.projects?.map(project => (
            <li key={project}>{project}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default CoachPlan
