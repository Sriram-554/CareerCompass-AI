function buildFallbackPlan(student, career) {
  const missing =
    career?.missingSkills?.length > 0
      ? career.missingSkills.filter(Boolean).slice(0, 2)
      : ['core fundamentals']

  const skillOne = missing[0] || 'core fundamentals'
  const skillTwo = missing[1]

  return {
    careerTitle: career?.title || 'Career path',
    headline: `Your personalized plan for ${career?.title || 'your career'}`,
    whyFit:
      career?.whyMatch ||
      'This path aligns with your current profile and is a strong next step to explore.',
    focusSkills: [
      ...(career?.missingSkills || []),
      ...(career?.matchedSkills || []),
    ]
      .filter(Boolean)
      .slice(0, 4),
    thirtyDayPlan: [
      {
        week: 'Week 1',
        focus: `Strengthen ${skillOne}`,
        actions: [
          `Study ${skillOne} daily for 45–60 minutes`,
          'Build 3 tiny practice examples',
          'Write short notes on what is still unclear',
        ],
      },
      {
        week: 'Week 2',
        focus: skillTwo ? `Add ${skillTwo}` : 'Apply fundamentals',
        actions: [
          skillTwo
            ? `Learn the basics of ${skillTwo}`
            : 'Revisit weak topics from week 1',
          'Complete one guided exercise every 2 days',
          'Track progress in a simple checklist',
        ],
      },
      {
        week: 'Week 3',
        focus: 'Project start',
        actions: [
          `Start a beginner project related to ${career?.title || 'this path'}`,
          'Break work into small checkpoints',
          'Share progress with a peer for feedback',
        ],
      },
      {
        week: 'Week 4',
        focus: 'Polish and portfolio',
        actions: [
          'Finish and document the project on GitHub',
          'Write a short problem/approach/result summary',
          'Plan the next roadmap stage',
        ],
      },
    ],
    projects: [
      `Beginner project for ${career?.title || 'this path'}`,
      `Portfolio project for ${career?.title || 'this path'}`,
      `Documented case study for ${career?.title || 'this path'}`,
    ],
    nextMove: skillOne,
    source: 'guided',
  }
}

function extractJson(text) {
  if (!text) return null
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced ? fenced[1] : text
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    return JSON.parse(raw.slice(start, end + 1))
  } catch {
    return null
  }
}

function normalizePlan(parsed, student, career) {
  const fallback = buildFallbackPlan(student, career)
  if (!parsed || typeof parsed !== 'object') return fallback

  return {
    careerTitle: career?.title || fallback.careerTitle,
    headline:
      typeof parsed.headline === 'string' && parsed.headline.trim()
        ? parsed.headline.trim()
        : fallback.headline,
    whyFit:
      typeof parsed.whyFit === 'string' && parsed.whyFit.trim()
        ? parsed.whyFit.trim()
        : fallback.whyFit,
    focusSkills: Array.isArray(parsed.focusSkills)
      ? parsed.focusSkills.map(String).filter(Boolean).slice(0, 6)
      : fallback.focusSkills,
    thirtyDayPlan: Array.isArray(parsed.thirtyDayPlan)
      ? parsed.thirtyDayPlan.slice(0, 4).map((week, index) => ({
          week: week.week || `Week ${index + 1}`,
          focus: week.focus || fallback.thirtyDayPlan[index]?.focus || 'Focus',
          actions: Array.isArray(week.actions)
            ? week.actions.map(String).slice(0, 5)
            : fallback.thirtyDayPlan[index]?.actions || [],
        }))
      : fallback.thirtyDayPlan,
    projects: Array.isArray(parsed.projects)
      ? parsed.projects.map(String).slice(0, 5)
      : fallback.projects,
    nextMove:
      typeof parsed.nextMove === 'string' && parsed.nextMove.trim()
        ? parsed.nextMove.trim()
        : fallback.nextMove,
    source: 'llm',
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const student = req.body?.student || {}
  const career = req.body?.career || {}

  if (!career?.title) {
    return res.status(400).json({ error: 'Career is required' })
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY
  const baseUrl = process.env.GROQ_API_KEY
    ? 'https://api.groq.com/openai/v1'
    : 'https://api.openai.com/v1'
  const model =
    process.env.LLM_MODEL ||
    (process.env.GROQ_API_KEY ? 'llama-3.1-8b-instant' : 'gpt-4o-mini')

  if (!apiKey) {
    return res.status(200).json({
      plan: buildFallbackPlan(student, career),
      note: 'No LLM key configured. Returned guided plan.',
    })
  }

  const prompt = `You are a practical career coach for Indian college students in tech.
Return ONLY valid JSON with this shape:
{
  "headline": string,
  "whyFit": string,
  "focusSkills": string[],
  "thirtyDayPlan": [{"week": string, "focus": string, "actions": string[]}],
  "projects": string[],
  "nextMove": string
}

Rules:
- Be specific to this student and career
- Keep whyFit to 2-3 sentences
- 4 weeks in thirtyDayPlan, 3 actions each
- 3 practical project ideas
- No markdown, no extra commentary

Student profile:
${JSON.stringify(
  {
    name: student.name || '',
    degree: student.degree || '',
    branch: student.branch || '',
    year: student.year || '',
    skills: student.skills || [],
    interests: student.interests || [],
    preference: student.preference || '',
  },
  null,
  2
)}

Top career match:
${JSON.stringify(
  {
    title: career.title,
    score: career.score,
    matchedSkills: career.matchedSkills || [],
    missingSkills: career.missingSkills || [],
    matchedInterests: career.matchedInterests || [],
    preferenceMatch: !!career.preferenceMatch,
    whyMatch: career.whyMatch || '',
  },
  null,
  2
)}`

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        messages: [
          {
            role: 'system',
            content:
              'You generate concise, actionable career coaching plans as pure JSON.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!response.ok) {
      const details = await response.text()
      console.error('LLM API error:', response.status, details)
      return res.status(200).json({
        plan: buildFallbackPlan(student, career),
        note: 'LLM request failed. Returned guided plan.',
      })
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content || ''
    const parsed = extractJson(content)
    const plan = normalizePlan(parsed, student, career)

    return res.status(200).json({ plan })
  } catch (error) {
    console.error('Coach API error:', error)
    return res.status(200).json({
      plan: buildFallbackPlan(student, career),
      note: 'Unexpected error. Returned guided plan.',
    })
  }
}
