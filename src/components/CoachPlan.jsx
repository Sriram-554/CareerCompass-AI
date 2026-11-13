function CoachPlan({ plan, loading = false, source = 'guided' }) {
  if (loading && !plan) {
    return (
      <section className="coach-plan">
        <div className="coach-plan-header">
          <span>AI CAREER COACH</span>
          <h2>Building your personalized plan...</h2>
          <p>Analyzing your skills, interests, and target career.</p>
        </div>
      </section>
    )
  }

  if (!plan) return null

  const badge =
    source === 'llm' || plan.source === 'llm'
      ? 'Generated with AI'
      : 'Guided plan'

  return (
    <section className="coach-plan">
      <div className="coach-plan-header">
        <div className="coach-title-row">
          <span>AI CAREER COACH</span>
          <em className={`coach-source ${source === 'llm' || plan.source === 'llm' ? 'ai' : 'guided'}`}>
            {loading ? 'Refreshing with AI...' : badge}
          </em>
        </div>
        <h2>{plan.headline}</h2>
        <p>{plan.whyFit}</p>
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
