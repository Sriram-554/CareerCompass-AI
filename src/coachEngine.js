function unique(items) {
  return [...new Set(items.filter(Boolean))]
}

function buildWhyFit(student, career) {
  const parts = []
  if (career.matchedSkills?.length) {
    parts.push(
      `you already have ${career.matchedSkills.join(', ')}`
    )
  }
  if (career.matchedInterests?.length) {
    parts.push(`your interest in ${career.matchedInterests.join(' and ')}`)
  }
  if (career.preferenceMatch) {
    parts.push(`your stated preference for ${student.preference}`)
  }
  if (student.branch) {
    parts.push(`your ${student.branch} background`)
  }

  if (parts.length === 0) {
    return `${career.title} is worth exploring as a structured way to turn curiosity into job-ready skills.`
  }

  if (parts.length === 1) {
    return `${career.title} fits because of ${parts[0]}.`
  }

  const last = parts.pop()
  return `${career.title} fits because of ${parts.join(', ')}, and ${last}.`
}

function buildThirtyDayPlan(student, career) {
  const missing = career.missingSkills?.length
    ? career.missingSkills.slice(0, 2)
    : ['core fundamentals']
  const year = (student.year || '').toLowerCase()
  const intensity =
    year.includes('1') || year.includes('2')
      ? 'focus on foundations and consistency'
      : 'balance depth with portfolio-ready output'

  return [
    {
      week: 'Week 1',
      focus: `Strengthen ${missing[0]}`,
      actions: [
        `Study ${missing[0]} for 45–60 minutes daily`,
        'Take short notes and build 3 tiny practice examples',
        `Review how ${missing[0]} is used in ${career.title} roles`,
      ],
    },
    {
      week: 'Week 2',
      focus: missing[1] ? `Add ${missing[1]}` : 'Apply fundamentals',
      actions: [
        missing[1]
          ? `Learn the basics of ${missing[1]} with one guided tutorial`
          : 'Revisit weak topics from week 1',
        'Build one mini exercise every 2 days',
        'Write a short weekly reflection: what improved, what is still unclear',
      ],
    },
    {
      week: 'Week 3',
      focus: 'Project start',
      actions: [
        `Start a beginner ${career.title} project you can finish in 10–14 days`,
        'Break the project into small checkpoints',
        'Share progress with a friend or peer for accountability',
      ],
    },
    {
      week: 'Week 4',
      focus: 'Polish and portfolio',
      actions: [
        'Finish the mini project and document it on GitHub',
        'Write a 5-line summary of the problem, approach, and result',
        `Plan the next roadmap stage for ${career.title} and ${intensity}`,
      ],
    },
  ]
}

function buildProjects(career) {
  const defaults = {
    'Machine Learning Engineer': [
      'Student performance predictor with clean metrics',
      'Image classifier deployed with a simple Streamlit UI',
      'End-to-end notebook + GitHub README case study',
    ],
    'Web Developer': [
      'Responsive portfolio website',
      'Full-stack notes or task app',
      'Deployed dashboard with authentication basics',
    ],
    'Data Analyst': [
      'Exploratory analysis on a public dataset',
      'SQL + dashboard case study',
      'Business insights report with clear visuals',
    ],
    'Cybersecurity Analyst': [
      'Network traffic analysis report',
      'Security checklist for a sample web app',
      'Log review walkthrough with findings',
    ],
    'Cloud Engineer': [
      'Static site deployment on cloud storage',
      'Containerized app with basic monitoring notes',
      'Architecture diagram + cost-aware design writeup',
    ],
    'DevOps Engineer': [
      'CI pipeline for a sample app',
      'Dockerized service with compose setup',
      'Automation script + runbook documentation',
    ],
    'Mobile App Developer': [
      'Notes or habit tracker app',
      'Student utility app with local storage',
      'Polished UI app published to GitHub with screenshots',
    ],
    'Research Scientist': [
      'Paper reproduction mini-study',
      'Experiment log with clear hypothesis and results',
      'Short research presentation deck',
    ],
  }

  return defaults[career.title] || [
    `Beginner project for ${career.title}`,
    `Intermediate portfolio project for ${career.title}`,
    `Documented case study for ${career.title}`,
  ]
}

export function generateCoachPlan(student, career) {
  if (!career) return null

  return {
    careerTitle: career.title,
    headline: `Your personalized plan for ${career.title}`,
    whyFit: buildWhyFit(student, career),
    focusSkills: unique([
      ...(career.missingSkills || []).slice(0, 3),
      ...(career.matchedSkills || []).slice(0, 2),
    ]).slice(0, 4),
    thirtyDayPlan: buildThirtyDayPlan(student, career),
    projects: buildProjects(career),
    nextMove:
      (career.missingSkills && career.missingSkills[0]) ||
      'the first stage of your roadmap',
  }
}

export function generateCoachPlans(student, recommendations = []) {
  return recommendations.slice(0, 3).map(career =>
    generateCoachPlan(student, career)
  )
}
