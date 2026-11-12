function RoadmapView({
  roadmap,
  progressPercentage,
  completedCount,
  totalTopics,
  completedTopics,
  onToggleTopic,
  onBackToResults,
}) {
  return (
    <>
      <div className="assessment-heading">
        <span>YOUR PERSONALIZED LEARNING JOURNEY</span>
        <h1>{roadmap.title}</h1>
        <p>Your estimated learning duration: {roadmap.duration}</p>

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
        {roadmap.stages.map((stage, index) => (
          <div className="roadmap-stage" key={stage.title}>
            <span className="stage-number">STEP {index + 1}</span>
            <h2>{stage.title}</h2>
            <span className="stage-duration">{stage.duration}</span>

            <h4>Topics to Learn</h4>
            <ul className="topic-list">
              {stage.topics.map(topic => (
                <li key={topic}>
                  <label className="topic-item">
                    <input
                      type="checkbox"
                      checked={completedTopics.includes(topic)}
                      onChange={() => onToggleTopic(topic)}
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
        onClick={onBackToResults}
      >
        ← Back to Career Recommendations
      </button>
    </>
  )
}

export default RoadmapView
