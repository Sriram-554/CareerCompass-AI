const PROGRESS_KEY = 'careerCompassProgress'
const PROFILE_KEY = 'careerCompassProfile'

export function loadProgress() {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY)
    if (!saved) return {}

    const parsed = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([career, topics]) =>
          typeof career === 'string' &&
          Array.isArray(topics) &&
          topics.every(topic => typeof topic === 'string')
      )
    )
  } catch {
    return {}
  }
}

export function saveProgress(progressByCareer) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressByCareer))
  } catch (error) {
    console.error('Unable to save learning progress:', error)
  }
}

export function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY)
    if (!saved) return null

    const parsed = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object') return null

    const formData = parsed.formData
    if (!formData || typeof formData !== 'object') return null

    return {
      formData: {
        name: formData.name || '',
        degree: formData.degree || 'B.Tech',
        branch: formData.branch || '',
        year: formData.year || '',
        skills: Array.isArray(formData.skills) ? formData.skills : [],
        interests: Array.isArray(formData.interests) ? formData.interests : [],
        preference: formData.preference || '',
      },
      savedAt: parsed.savedAt || null,
    }
  } catch {
    return null
  }
}

export function saveProfile(formData) {
  try {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({
        formData,
        savedAt: new Date().toISOString(),
      })
    )
  } catch (error) {
    console.error('Unable to save assessment profile:', error)
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY)
  } catch (error) {
    console.error('Unable to clear assessment profile:', error)
  }
}

export function exportRoadmapChecklist(roadmap, completedTopics = []) {
  const lines = [
    `# ${roadmap.title} Learning Checklist`,
    '',
    `Estimated duration: ${roadmap.duration}`,
    `Exported: ${new Date().toLocaleString()}`,
    '',
  ]

  roadmap.stages.forEach((stage, index) => {
    lines.push(`## Step ${index + 1}: ${stage.title} (${stage.duration})`)
    lines.push('')
    lines.push('### Topics')
    stage.topics.forEach(topic => {
      const done = completedTopics.includes(topic)
      lines.push(`- [${done ? 'x' : ' '}] ${topic}`)
    })
    lines.push('')
    lines.push(`**Tools:** ${stage.tools.join(', ')}`)
    lines.push(`**Project:** ${stage.project}`)
    lines.push('')
  })

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const safeName = roadmap.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  anchor.href = url
  anchor.download = `${safeName}-checklist.md`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
