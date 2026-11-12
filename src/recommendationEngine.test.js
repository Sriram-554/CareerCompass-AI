
import { describe, it, expect } from 'vitest'
import { generateRecommendations } from './recommendationEngine'

describe('Career Recommendation Engine', () => {
  it('should recommend Machine Learning Engineer with a 100% match', () => {
    const student = {
      skills: ['Python', 'Machine Learning'],
      interests: ['Artificial Intelligence', 'Data Science'],
      preference: 'AI and Machine Learning',
    }

    const results = generateRecommendations(student)

    expect(results[0].title).toBe('Machine Learning Engineer')
    expect(results[0].score).toBe(100)
  })

  it('should return recommendations in descending score order', () => {
    const student = {
      skills: ['Python', 'Machine Learning'],
      interests: ['Artificial Intelligence', 'Data Science'],
      preference: 'AI and Machine Learning',
    }

    const results = generateRecommendations(student)

    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(
        results[i + 1].score
      )
    }
  })

  it('should handle an empty student profile', () => {
    const results = generateRecommendations({})

    expect(results.length).toBe(7)
    expect(results.every(career => career.score === 0)).toBe(true)
  })

  it('should handle missing student fields', () => {
    const results = generateRecommendations({})

    expect(results).toHaveLength(7)
    expect(results[0].score).toBe(0)
  })

  it('should correctly identify matched skills and interests', () => {
    const student = {
      skills: ['Python'],
      interests: ['Data Science'],
      preference: 'Data Science',
    }

    const results = generateRecommendations(student)

    const dataAnalyst = results.find(
      career => career.title === 'Data Analyst'
    )

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
    expect(mlCareer.score).toBe(20)
  })

})
