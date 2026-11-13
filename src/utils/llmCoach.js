import { generateCoachPlan } from '../coachEngine'

export async function fetchCoachPlan(student, career) {
  const fallback = generateCoachPlan(student, career)

  if (!career?.title) {
    return { plan: fallback, source: 'guided', note: 'Missing career' }
  }

  try {
    const response = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student, career }),
    })

    if (!response.ok) {
      return {
        plan: { ...fallback, source: 'guided' },
        source: 'guided',
        note: 'Coach API unavailable',
      }
    }

    const data = await response.json()
    if (data?.plan) {
      return {
        plan: data.plan,
        source: data.plan.source || 'llm',
        note: data.note || '',
      }
    }

    return {
      plan: { ...fallback, source: 'guided' },
      source: 'guided',
      note: 'Invalid coach response',
    }
  } catch {
    return {
      plan: { ...fallback, source: 'guided' },
      source: 'guided',
      note: 'Network error — using guided plan',
    }
  }
}
