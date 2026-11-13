import { getRoadmapExtras } from '../roadmapResources'

function RoadmapView({
  roadmap,
  progressPercentage,
  completedCount,
  totalTopics,
  completedTopics,
  onToggleTopic,
  onToggleStage,
  onExport,
  onBackToResults,
}) {
  const extras = getRoadmapExtras(roadmap.title)

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

          <div className="roadmap-actions no-print">
            <button type="button" className="secondary-action" onClick={onExport}>
              Export Checklist
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={() => window.print()}
            >
              Print Roadmap
            </button>
          </div>
        </div>
      </div>

      {(extras.resources?.length > 0 || extras.checkpoint) && (
        <div className="roadmap-extras">
          {extras.checkpoint && (
            <div className="checkpoint-box">
              <strong>Stage checkpoint</strong>
              <p>{extras.checkpoint}</p>
            </div>
          )}

          {extras.resources?.length > 0 && (
            <div className="resources-box">
              <strong>Free resources</strong>
              <ul>
                {extras.resources.map(resource => (
                  <li key={resource.url}>
                    <a href={resource.url} target="_blank" rel="noreferrer">
                      {resource.title}
                    </a>
                    <span>{resource.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="roadmap-stages">
        {roadmap.stages.map((stage, index) => {
          const stageCompletedCount = stage.topics.filter(topic =>
            completedTopics.includes(topic)
          ).length
          const stageComplete = stageCompletedCount === stage.topics.length
          const stagePercent = Math.round(
            (stageCompletedCount / stage.topics.length) * 100
          )

          return (
            <div
              className={`roadmap-stage ${stageComplete ? 'stage-complete' : ''}`}
              key={stage.title}
            >
              <div className="stage-header">
                <div>
                  <span className="stage-number">STEP {index + 1}</span>
                  <h2>{stage.title}</h2>
                  <span className="stage-duration">{stage.duration}</span>
                </div>
                <div className="stage-progress-meta">
                  <strong>{stagePercent}%</strong>
                  <span>
                    {stageCompletedCount}/{stage.topics.length} topics
                  </span>
                </div>
              </div>

              <div className="stage-actions no-print">
                <button
                  type="button"
                  className="stage-action-button"
                  onClick={() => onToggleStage(stage.topics, true)}
                  disabled={stageComplete}
                >
                  Mark step complete
                </button>
                <button
                  type="button"
                  className="stage-action-button subtle"
                  onClick={() => onToggleStage(stage.topics, false)}
                  disabled={stageCompletedCount === 0}
                >
                  Reset step
                </button>
              </div>

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
          )
        })}
      </div>

      <button
        type="button"
        className="assessment-submit no-print"
        onClick={onBackToResults}
      >
        ← Back to Career Recommendations
      </button>
    </>
  )
}

export default RoadmapView
