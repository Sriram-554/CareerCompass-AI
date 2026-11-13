import { useState } from 'react'

function buildShareText(firstName, recommendations, collegeName) {
  const lines = [
    `${firstName}'s CareerCompass AI results`,
    collegeName ? `College: ${collegeName}` : null,
    '',
    'Top career matches:',
    ...recommendations.slice(0, 3).map(
      (career, index) =>
        `${index + 1}. ${career.title} (${career.score}% match)`
    ),
    '',
    'Explore your path: https://career-compass-ai-ochre-rho.vercel.app',
  ].filter(Boolean)

  return lines.join('\n')
}

function ShareResults({ firstName, recommendations, collegeName }) {
  const [status, setStatus] = useState('')
  const text = buildShareText(firstName, recommendations, collegeName)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('Copied results to clipboard')
    } catch {
      setStatus('Could not copy automatically. Select and copy the text below.')
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My CareerCompass AI results',
          text,
        })
        setStatus('Share sheet opened')
        return
      } catch {
        // user cancelled or share failed; fall back to copy
      }
    }
    handleCopy()
  }

  return (
    <section className="share-card">
      <div>
        <span>SHARE YOUR RESULTS</span>
        <h3>Show your top career matches</h3>
        <p>
          Copy a summary or share it with friends, mentors, or your class group.
        </p>
      </div>

      <pre className="share-preview">{text}</pre>

      <div className="share-actions">
        <button type="button" className="roadmap-button" onClick={handleShare}>
          Share
        </button>
        <button type="button" className="secondary-action" onClick={handleCopy}>
          Copy text
        </button>
      </div>

      {status && <p className="share-status">{status}</p>}
    </section>
  )
}

export default ShareResults
