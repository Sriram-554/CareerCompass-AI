
const careerPaths = [
  {
    title: 'Machine Learning Engineer',
    skills: ['Python', 'Machine Learning'],
    interests: ['Artificial Intelligence', 'Data Science'],
    preference: 'AI and Machine Learning',
    description: 'Build intelligent systems that learn from data and make predictions.',
  },
  {
    title: 'Web Developer',
    skills: ['HTML/CSS', 'JavaScript'],
    interests: ['Web Development'],
    preference: 'Software Development',
    description: 'Build websites and interactive web applications.',
  },
  {
    title: 'Data Analyst',
    skills: ['Python', 'SQL'],
    interests: ['Data Science'],
    preference: 'Data Science',
    description: 'Analyze data and discover useful patterns to support decisions.',
  },
  {
    title: 'Cybersecurity Analyst',
    skills: ['C', 'Python'],
    interests: ['Cybersecurity'],
    preference: 'Cybersecurity',
    description: 'Help organizations protect their systems and information.',
  },
  {
    title: 'Cloud Engineer',
    skills: ['Python', 'Java'],
    interests: ['Cloud Computing'],
    preference: 'Software Development',
    description: 'Work with cloud infrastructure and scalable applications.',
  },
  {
    title: 'Mobile App Developer',
    skills: ['Java'],
    interests: ['App Development'],
    preference: 'Software Development',
    description: 'Design and develop applications for mobile devices.',
  },
  {
    title: 'Research Scientist',
    skills: ['Python', 'Machine Learning'],
    interests: ['Artificial Intelligence', 'Data Science'],
    preference: 'Research and Higher Studies',
    description: 'Explore new technologies and develop innovative solutions through research.',
  },
]

export function generateRecommendations(student) {
  const studentSkills = student?.skills || []
  const studentInterests = student?.interests || []

  const results = careerPaths.map((career) => {
    const matchedSkills = career.skills.filter(skill =>
      studentSkills.includes(skill)
    )

    const matchedInterests = career.interests.filter(interest =>
      studentInterests.includes(interest)
    )

    const preferenceMatch =
      student?.preference === career.preference

    const skillScore =
      (matchedSkills.length / career.skills.length) * 40

    const interestScore =
      (matchedInterests.length / career.interests.length) * 40

    const preferenceScore = preferenceMatch ? 20 : 0

    const score = Math.round(
      skillScore + interestScore + preferenceScore
    )

    return {
      title: career.title,
      description: career.description,
      score,
      matchedSkills,
      matchedInterests,
      preferenceMatch,
    }
  })

  return results.sort((a, b) => b.score - a.score)
}
