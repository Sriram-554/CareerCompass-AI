import { describe, it, expect } from 'vitest'
import { generateRecommendations } from './recommendationEngine'

describe('Career Recommendation Engine', () => {
  it('should recommend Machine Learning Engineer highly for a strong AI profile', () => {
    const student = {
      skills: ['Python', 'Machine Learning', 'SQL'],
      interests: ['Artificial Intelligence', 'Data Science'],
      preference: 'AI and Machine Learning',
      branch: 'CSE - AI & ML',
      year: '3rd Year',
    }

    const results = generateRecommendations(student)

    expect(results[0].title).toBe('Machine Learning Engineer')
    expect(results[0].score).toBeGreaterThanOrEqual(90)
  })

  it('should return recommendations in descending score order', () => {
    const student = {
      skills: ['Python', 'Machine Learning'],
      interests: ['Artificial Intelligence', 'Data Science'],
      preference: 'AI and Machine Learning',
    }

    const results = generateRecommendations(student)

    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score)
    }
  })

  it('should handle an empty student profile', () => {
    const results = generateRecommendations({})

    expect(results.length).toBe(7)
    expect(results.every(career => career.score === 0)).toBe(true)
  })

  it('should correctly identify matched skills and interests', () => {
    const student = {
      skills: ['Python'],
      interests: ['Data Science'],
      preference: 'Data Science',
    }

    const results = generateRecommendations(student)
    const dataAnalyst = results.find(career => career.title === 'Data Analyst')

    expect(dataAnalyst.matchedSkills).toContain('Python')
    expect(dataAnalyst.matchedInterests).toContain('Data Science')
  })

  it('should identify a matching career preference', () => {
    const student = {
      skills: [],
      interests: [],
      preference: 'AI and Machine Learning',
    }

    const results = generateRecommendations(student)
    const mlCareer = results.find(
      career => career.title === 'Machine Learning Engineer'
    )

    expect(mlCareer.preferenceMatch).toBe(true)
    expect(mlCareer.score).toBe(15)
  })

  it('should report missing skills as skill gaps', () => {
    const student = {
      skills: ['Python'],
      interests: ['Data Science'],
      preference: 'Data Science',
    }

    const results = generateRecommendations(student)
    const dataAnalyst = results.find(career => career.title === 'Data Analyst')

    expect(dataAnalyst.missingSkills).toEqual(
      expect.arrayContaining(['SQL', 'Excel'])
    )
    expect(dataAnalyst.missingSkills).not.toContain('Python')
  })

  it('should boost score when branch keywords match', () => {
    const withoutBranch = generateRecommendations({
      skills: ['Python'],
      interests: ['Artificial Intelligence'],
      preference: 'AI and Machine Learning',
    })

    const withBranch = generateRecommendations({
      skills: ['Python'],
      interests: ['Artificial Intelligence'],
      preference: 'AI and Machine Learning',
      branch: 'B.Tech CSE AI & ML',
    })

    const mlWithout = withoutBranch.find(
      career => career.title === 'Machine Learning Engineer'
    )
    const mlWith = withBranch.find(
      career => career.title === 'Machine Learning Engineer'
    )

    expect(mlWith.score).toBeGreaterThan(mlWithout.score)
    expect(mlWith.branchBoost).toBeGreaterThan(0)
  })

  it('should provide a whyMatch explanation', () => {
    const results = generateRecommendations({
      skills: ['Python'],
      interests: ['Data Science'],
      preference: 'Data Science',
      branch: 'Data Science',
    })

    const dataAnalyst = results.find(career => career.title === 'Data Analyst')
    expect(dataAnalyst.whyMatch.toLowerCase()).toContain('matching')
  })
})
