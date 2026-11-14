# CareerCompass AI

A student-focused career guidance web app that helps you discover tech career paths from your skills and interests, then gives you a practical learning plan and roadmap to get there.

**Live demo:** [https://career-compass-ai-ochre-rho.vercel.app](https://career-compass-ai-ochre-rho.vercel.app)

---

## What this project is

CareerCompass AI is a full-stack **career discovery product for college students** (especially in India / tech tracks).

It is **not** only a static landing page. Students can:

1. Take a structured assessment
2. Get ranked career matches with clear reasons
3. Receive a personalized coach plan (AI-generated on production)
4. Follow stage-by-stage roadmaps with free resources
5. Track progress, optionally with an account that syncs to the cloud

---

## What it can do

### Career discovery
- Multi-step assessment (education, skills, interests, preference)
- Optional **college invite code** (`DEMO2026`, `SIH2026`, `CAMPUS2026`)
- Ranked recommendations across 8 careers
- Match scores, skill gaps, and **“Why this ranking?”** explanation
- **Advanced next steps** when core skills are already covered

### AI career coach
- Personalized plan for the top match
- Why-fit narrative, focus skills, 30-day plan, project ideas
- Production uses a real LLM via secure Vercel API + Groq
- Automatic **guided fallback** if the LLM is unavailable
- Clear badges: **Generated with AI** vs **Guided plan**

### Learning roadmaps
- Stage-based roadmaps with topics, tools, and projects
- Free resources (docs, courses, YouTube)
- Checkpoints, topic/stage progress tracking
- Export checklist + print-friendly view

### Accounts & sync
- Guest mode: profile + progress saved in **browser localStorage only**
- Logged-in mode: same data synced to **Supabase** (cloud)
- Auth UI: sign up, log in, account menu, logout feedback

### Product UX
- Unified **dark theme** across landing + app
- Results tabs: **Matches / Plan / Share**
- Shareable results summary (copy / native share)
- Mobile-friendly layout and touch targets

---

## Supported careers

- Machine Learning Engineer
- Web Developer
- Data Analyst
- Cybersecurity Analyst
- Cloud Engineer
- DevOps Engineer
- Mobile App Developer
- Research Scientist

---

## Tech stack

| Layer | Tech |
|------|------|
| Frontend | React 19 + Vite |
| Styling | Custom CSS (dark theme, responsive) |
| Recommendation engine | Rule-based scoring (skills, interests, preference, branch, year) |
| Coach | Guided engine + optional LLM (`/api/coach`) |
| Auth & database | Supabase (Auth + Postgres + RLS) |
| Hosting | Vercel |
| Tests | Vitest (recommendation engine) |

---

## Project structure

```text
api/
  coach.js                 # Vercel serverless LLM coach endpoint
src/
  App.jsx                  # Landing page
  Assessment.jsx           # Form → results → roadmap flow
  recommendationEngine.js  # Career scoring + ranking explanation
  coachEngine.js           # Guided coach plans
  roadmapData.js           # Career roadmaps
  roadmapResources.js      # Free resources + checkpoints
  components/
    AssessmentForm.jsx
    ResultsView.jsx        # Tabs: Matches / Plan / Share
    RoadmapView.jsx
    CoachPlan.jsx
    ShareResults.jsx
    AuthButton.jsx / AuthModal.jsx
  context/AuthContext.jsx
  lib/supabase.js
  utils/
    storage.js             # localStorage + export
    cloudSync.js           # Supabase profile/progress sync
    college.js             # Invite code validation
    llmCoach.js            # Client call to /api/coach
supabase/
  schema.sql               # profiles, progress, college_codes + RLS
```

---

## Getting started (local)

```bash
git clone https://github.com/Sriram-554/CareerCompass-AI.git
cd CareerCompass-AI
npm install
npm run dev
```

Open the local URL (usually `http://localhost:5173`).

### Scripts

```bash
npm run dev       # development server
npm run build     # production build
npm run preview   # preview production build
npm test          # unit tests
```

### Optional local env

Copy `.env.example` to `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Notes:
- Without Supabase env vars, the app still works in **guest mode**
- LLM coach on localhost usually uses the **guided fallback** unless you run `vercel dev` with `GROQ_API_KEY`

More detail:
- `BACKEND_SETUP.md` — Supabase auth + tables
- `LLM_SETUP.md` — Groq / AI coach setup
- `DOMAIN_SETUP.md` — custom domain on Vercel

---

## How recommendations work

The engine scores each career using weighted signals:

- Skills match (~40%)
- Interests match (~35%)
- Career preference (~15%)
- Branch relevance + year boost

Outputs include:
- ranked list with match %
- matched / missing skills
- advanced next steps when basics are already covered
- plain-language why-match and ranking explanation

This is **explainable rule-based logic**, not a black-box ML model. The separate **AI coach** layer can generate richer natural-language plans on top of those results.

---

## Data & privacy (current behavior)

| Mode | What is stored | Where |
|------|----------------|-------|
| Guest | Assessment + roadmap progress | Browser `localStorage` only |
| Logged in | Same data synced to account | Supabase (user-scoped via RLS) |

Guests do **not** write to the cloud. Login is required for cross-device sync.

---

## Deployment

- Hosted on **Vercel**
- Production: https://career-compass-ai-ochre-rho.vercel.app
- Pushes to `main` auto-redeploy

Required production env vars (Vercel):

| Variable | Purpose |
|----------|--------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `GROQ_API_KEY` | LLM coach (server-only) |
| `LLM_MODEL` | Optional; default `openai/gpt-oss-20b` |

---

## Current status

This is a **working product prototype** suitable for:
- student portfolio demos
- classroom / hackathon pilots (college codes)
- further productization (custom domain, more careers, faculty dashboard)

### Done
- Assessment + scoring + roadmaps
- Progress tracking + export
- Auth + cloud sync
- AI coach API + fallback
- College invite codes
- Share results
- Dark unified UI + mobile polish

### Optional next upgrades
- Custom domain
- Faculty dashboard for college codes / analytics
- Deeper roadmap content per stage
- More automated tests beyond the recommendation engine

---

## License

Intended for learning, demos, and portfolio use.
