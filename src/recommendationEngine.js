const careerPaths = [
  {
    title: 'Machine Learning Engineer',
    skills: ['Python', 'Machine Learning', 'SQL'],
    advancedSkills: ['Deep Learning', 'MLOps', 'Model Deployment', 'Feature Engineering'],
    interests: ['Artificial Intelligence', 'Data Science'],
    preference: 'AI and Machine Learning',
    branchKeywords: ['ai', 'ml', 'machine learning', 'data science', 'cse', 'cs', 'computer'],
    description: 'Build intelligent systems that learn from data and make predictions.',
  },
  {
    title: 'Web Developer',
    skills: ['HTML/CSS', 'JavaScript', 'React'],
    advancedSkills: ['TypeScript', 'Node.js', 'Testing', 'System Design'],
    interests: ['Web Development'],
    preference: 'Software Development',
    branchKeywords: ['cse', 'cs', 'it', 'computer', 'software', 'information'],
    description: 'Build websites and interactive web applications.',
  },
  {
    title: 'Data Analyst',
    skills: ['Python', 'SQL', 'Excel'],
    advancedSkills: ['Statistics', 'Dashboarding', 'Business Storytelling', 'A/B Testing'],
    interests: ['Data Science'],
    preference: 'Data Science',
    branchKeywords: ['data', 'statistics', 'math', 'analytics', 'cse', 'cs'],
    description: 'Analyze data and discover useful patterns to support decisions.',
  },
  {
    title: 'Cybersecurity Analyst',
    skills: ['Python', 'Networking', 'Linux'],
    advancedSkills: ['Threat Analysis', 'SIEM', 'Cloud Security', 'Incident Response'],
    interests: ['Cybersecurity'],
    preference: 'Cybersecurity',
    branchKeywords: ['cyber', 'security', 'network', 'cse', 'it'],
    description: 'Help organizations protect their systems and information.',
  },
  {
    title: 'Cloud Engineer',
    skills: ['Python', 'Linux', 'Docker'],
    advancedSkills: ['Kubernetes', 'Infrastructure as Code', 'Observability', 'Cost Optimization'],
    interests: ['Cloud Computing'],
    preference: 'Software Development',
    branchKeywords: ['cloud', 'devops', 'cse', 'it', 'computer'],
    description: 'Work with cloud infrastructure and scalable applications.',
  },
  {
    title: 'DevOps Engineer',
    skills: ['Linux', 'Docker', 'Python'],
    advancedSkills: ['CI/CD', 'Kubernetes', 'Monitoring', 'Infrastructure as Code'],
    interests: ['DevOps', 'Cloud Computing'],
    preference: 'Software Development',
    branchKeywords: ['devops', 'cloud', 'sre', 'cse', 'it', 'computer'],
    description: 'Automate software delivery pipelines and keep systems reliable at scale.',
  },
  {
    title: 'Mobile App Developer',
    skills: ['Java', 'Kotlin', 'JavaScript'],
    advancedSkills: ['Jetpack Compose', 'App Architecture', 'Performance', 'Play Store Release'],
    interests: ['App Development'],
    preference: 'Software Development',
    branchKeywords: ['mobile', 'android', 'cse', 'cs', 'it'],
    description: 'Design and develop applications for mobile devices.',
  },
  {
    title: 'Research Scientist',
    skills: ['Python', 'Machine Learning', 'Mathematics'],
    advancedSkills: ['Paper Writing', 'Experiment Design', 'Literature Review', 'Reproducibility'],
    interests: ['Artificial Intelligence', 'Data Science'],
    preference: 'Research and Higher Studies',
    branchKeywords: ['research', 'ai', 'ml', 'science', 'math', 'physics'],
    description: 'Explore new technologies and develop innovative solutions through research.',
  },
]

function normalize(text) {
  return (text || '').toLowerCase().trim()
}

function branchMatchScore(branch, keywords) {
  const value = normalize(branch)
  if (!value || !keywords?.length) return 0

  const hits = keywords.filter(keyword => value.includes(keyword))
  if (hits.length === 0) return 0
  if (hits.length >= 2) return 10
  return 6
}

function yearBoost(year) {
  const value = normalize(year)
  if (value.includes('3') || value.includes('4') || value.includes('graduate')) {
    return 4
  }
  if (value.includes('2')) {
    return 2
  }
  return 0
}

function buildWhyMatch({ matchedSkills, matchedInterests, preferenceMatch, branchBoost }) {
  const parts = []

  if (matchedSkills.length) {
    parts.push(`${matchedSkills.length} matching skill${matchedSkills.length > 1 ? 's' : ''}`)
  }
  if (matchedInterests.length) {
    parts.push(`${matchedInterests.length} matching interest${matchedInterests.length > 1 ? 's' : ''}`)
  }
  if (preferenceMatch) {
    parts.push('your career preference')
  }
  if (branchBoost > 0) {
    parts.push('your branch background')
  }

  if (parts.length === 0) {
    return 'Explore this career to see if it fits your goals.'
  }

  if (parts.length === 1) {
    return `Strong fit based on ${parts[0]}.`
  }

  const last = parts.pop()
  return `Strong fit based on ${parts.join(', ')}, and ${last}.`
}

export function buildRankingExplanation(recommendations = [], student = {}) {
  const top = recommendations[0]
  const second = recommendations[1]
  if (!top) return ''

  const reasons = []

  if (top.preferenceMatch) {
    reasons.push(`it matches your preference for ${student.preference}`)
  }
  if (top.matchedSkills?.length) {
    reasons.push(`you already have ${top.matchedSkills.join(', ')}`)
  }
  if (top.matchedInterests?.length) {
    reasons.push(`your interests include ${top.matchedInterests.join(' and ')}`)
  }
  if (top.branchBoost > 0 && student.branch) {
    reasons.push(`your ${student.branch} background supports this path`)
  }

  let summary =
    reasons.length > 0
      ? `${top.title} ranked #1 because ${reasons.slice(0, 3).join('; ')}.`
      : `${top.title} ranked #1 based on your overall profile fit.`

  if (second) {
    const gap = top.score - second.score
    summary += ` It scored ${top.score}% vs ${second.title} at ${second.score}%`
    if (gap >= 8) {
      summary += ` — a clear lead.`
    } else if (gap > 0) {
      summary += ` — close, so both are worth exploring.`
    } else {
      summary += `.`
    }

    const extraInterests = (student.interests || []).filter(
      interest => !top.matchedInterests?.includes(interest)
    )
    if (extraInterests.length) {
      summary += ` Your other interests (${extraInterests.join(', ')}) can still become side projects or secondary paths.`
    }
  }

  return summary
}

export function generateRecommendations(student) {
  const studentSkills = student?.skills || []
  const studentInterests = student?.interests || []
  const branch = student?.branch || ''
  const year = student?.year || ''

  const results = careerPaths.map((career) => {
    const matchedSkills = career.skills.filter(skill =>
      studentSkills.includes(skill)
    )

    const missingSkills = career.skills.filter(
      skill => !studentSkills.includes(skill)
    )

    const matchedInterests = career.interests.filter(interest =>
      studentInterests.includes(interest)
    )

    const preferenceMatch = student?.preference === career.preference

    const skillScore =
      career.skills.length === 0
        ? 0
        : (matchedSkills.length / career.skills.length) * 40

    const interestScore =
      career.interests.length === 0
        ? 0
        : (matchedInterests.length / career.interests.length) * 35

    const preferenceScore = preferenceMatch ? 15 : 0
    const branchBoost = branchMatchScore(branch, career.branchKeywords)
    const academicBoost = yearBoost(year)

    const rawScore =
      skillScore + interestScore + preferenceScore + branchBoost + academicBoost

    const score = Math.min(100, Math.round(rawScore))

    const advancedNextSkills =
      missingSkills.length === 0 ? career.advancedSkills || [] : []

    return {
      title: career.title,
      description: career.description,
      score,
      matchedSkills,
      matchedInterests,
      missingSkills,
      advancedNextSkills,
      preferenceMatch,
      branchBoost,
      whyMatch: buildWhyMatch({
        matchedSkills,
        matchedInterests,
        preferenceMatch,
        branchBoost,
      }),
    }
  })

  return results.sort((a, b) => b.score - a.score)
}

export const SKILLS_LIST = [
  'Python',
  'Java',
  'C',
  'C++',
  'HTML/CSS',
  'JavaScript',
  'React',
  'SQL',
  'Excel',
  'Machine Learning',
  'Linux',
  'Networking',
  'Docker',
  'Kotlin',
  'Mathematics',
]

export const INTERESTS_LIST = [
  'Artificial Intelligence',
  'Web Development',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'App Development',
  'DevOps',
  'UI/UX Design',
  'Game Development',
  'Blockchain',
]
