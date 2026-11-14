const ALLOWED_ORIGINS = [
  'https://career-compass-ai-ochre-rho.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

const MAX_BODY_CHARS = 12000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 12
const LLM_TIMEOUT_MS = 20_000

// Best-effort in-memory limiter (resets when serverless instance recycles)
const rateBuckets = new Map()

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  const bucket = rateBuckets.get(ip) || { count: 0, start: now }

  if (now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(ip, { count: 1, start: now })
    return false
  }

  bucket.count += 1
  rateBuckets.set(ip, bucket)
  return bucket.count > RATE_LIMIT_MAX
}

function setCors(req, res) {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function isNonEmptyString(value, max = 200) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max
}

function isStringArray(value, maxItems = 30) {
  return (
    Array.isArray(value) &&
    value.length <= maxItems &&
    value.every(item => typeof item === 'string' && item.length <= 80)
  )
}

function validatePayload(body) {
  if (!body || typeof body !== 'object') {
    return 'Request body must be a JSON object'
  }

  const serialized = JSON.stringify(body)
  if (serialized.length > MAX_BODY_CHARS) {
    return 'Request payload is too large'
  }

  const student = body.student
  const career = body.career

  if (!career || typeof career !== 'object') {
    return 'Career object is required'
  }
  if (!isNonEmptyString(career.title, 120)) {
    return 'Career title is required'
  }

  if (student != null && typeof student !== 'object') {
    return 'Student must be an object'
  }

  if (student) {
    if (student.name != null && !isNonEmptyString(String(student.name), 120) && student.name !== '') {
      return 'Invalid student name'
    }
    if (student.skills != null && !isStringArray(student.skills)) {
      return 'Invalid skills list'
    }
    if (student.interests != null && !isStringArray(student.interests)) {
      return 'Invalid interests list'
    }
  }

  return null
}

function buildFallbackPlan(student, career) {
  const missing =
    career?.missingSkills?.length > 0
      ? career.missingSkills.filter(Boolean).slice(0, 2)
      : career?.advancedNextSkills?.length > 0
        ? career.advancedNextSkills.filter(Boolean).slice(0, 2)
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
      ...(career?.advancedNextSkills || []),
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

function isValidWeek(week) {
  return (
    week &&
    typeof week === 'object' &&
    isNonEmptyString(String(week.focus || ''), 160) &&
    Array.isArray(week.actions) &&
    week.actions.filter(action => isNonEmptyString(String(action), 240)).length >= 2
  )
}

function normalizePlan(parsed, student, career) {
  const fallback = buildFallbackPlan(student, career)
  if (!parsed || typeof parsed !== 'object') return fallback

  const weeks = Array.isArray(parsed.thirtyDayPlan)
    ? parsed.thirtyDayPlan.slice(0, 4)
    : []

  // Require a complete 4-week plan; otherwise use fallback weeks.
  const hasCompletePlan =
    weeks.length === 4 && weeks.every(week => isValidWeek(week))

  const thirtyDayPlan = hasCompletePlan
    ? weeks.map((week, index) => ({
        week: isNonEmptyString(String(week.week || ''), 40)
          ? String(week.week).trim()
          : `Week ${index + 1}`,
        focus: String(week.focus).trim(),
        actions: week.actions
          .map(action => String(action).trim())
          .filter(Boolean)
          .slice(0, 5),
      }))
    : fallback.thirtyDayPlan

  const projects = Array.isArray(parsed.projects)
    ? parsed.projects.map(String).map(item => item.trim()).filter(Boolean).slice(0, 5)
    : []

  return {
    careerTitle: career?.title || fallback.careerTitle,
    headline:
      isNonEmptyString(parsed.headline, 180)
        ? parsed.headline.trim()
        : fallback.headline,
    whyFit:
      isNonEmptyString(parsed.whyFit, 600)
        ? parsed.whyFit.trim()
        : fallback.whyFit,
    focusSkills: Array.isArray(parsed.focusSkills)
      ? parsed.focusSkills.map(String).filter(Boolean).slice(0, 6)
      : fallback.focusSkills,
    thirtyDayPlan,
    projects: projects.length >= 2 ? projects : fallback.projects,
    nextMove:
      isNonEmptyString(parsed.nextMove, 160)
        ? parsed.nextMove.trim()
        : fallback.nextMove,
    source: hasCompletePlan ? 'llm' : 'guided',
  }
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export default async function handler(req, res) {
  setCors(req, res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const origin = req.headers.origin
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' })
  }

  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' })
  }

  const validationError = validatePayload(req.body)
  if (validationError) {
    return res.status(400).json({ error: validationError })
  }

  const student = req.body?.student || {}
  const career = req.body?.career || {}

  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY
  const usingGroq = Boolean(process.env.GROQ_API_KEY)
  const baseUrl = usingGroq
    ? 'https://api.groq.com/openai/v1'
    : 'https://api.openai.com/v1'

  const model =
    process.env.LLM_MODEL ||
    (usingGroq ? 'openai/gpt-oss-20b' : 'gpt-4o-mini')

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
- thirtyDayPlan MUST include exactly 4 weeks
- Each week MUST include a focus and at least 3 concrete actions
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
    advancedNextSkills: career.advancedNextSkills || [],
    matchedInterests: career.matchedInterests || [],
    preferenceMatch: !!career.preferenceMatch,
    whyMatch: career.whyMatch || '',
  },
  null,
  2
)}`

  try {
    const response = await fetchWithTimeout(
      `${baseUrl}/chat/completions`,
      {
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
      },
      LLM_TIMEOUT_MS
    )

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
    console.error('Coach API error:', error?.name || error)
    return res.status(200).json({
      plan: buildFallbackPlan(student, career),
      note:
        error?.name === 'AbortError'
          ? 'LLM timed out. Returned guided plan.'
          : 'Unexpected error. Returned guided plan.',
    })
  }
}
