# CareerCompass AI

A student-focused career guidance platform that helps you discover career paths aligned with your skills and interests, then gives you a practical learning roadmap to get there.

## Features

- **Career Assessment** — Share your education, skills, interests, and preferences
- **Smart Recommendations** — Ranked career matches with transparent match scores, skill gaps, and plain-language explanations
- **Personalized Roadmaps** — Stage-by-stage learning paths with topics, tools, and projects
- **Progress Tracking** — Mark topics complete; progress is saved in your browser

## Tech Stack

- React 19 + Vite
- Client-side recommendation engine (skills, interests, preference, branch, year)
- localStorage for learning progress

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Other scripts

```bash
npm run build    # production build
npm run preview  # preview production build
npm test         # run unit tests (Vitest)
npm run lint     # Oxlint
```

## How It Works

1. **Know yourself** — Fill in name, degree, branch, year, skills, interests, and career preference.
2. **Discover careers** — The engine scores each career path and shows your top matches with reasons and skill gaps.
3. **Build your future** — Open a learning roadmap, check off topics, and track progress over time.

## Project Structure

```text
src/
├── App.jsx
├── Assessment.jsx              # Orchestrates form → results → roadmap
├── components/
│   ├── AssessmentForm.jsx
│   ├── ResultsView.jsx
│   └── RoadmapView.jsx
├── recommendationEngine.js
├── roadmapData.js
├── App.css / Assessment.css
└── recommendationEngine.test.js
```

## Supported Careers

- Machine Learning Engineer
- Web Developer
- Data Analyst
- Cybersecurity Analyst
- Cloud Engineer
- DevOps Engineer
- Mobile App Developer
- Research Scientist

## Notes

- Recommendations are rule-based (not a trained ML model). Scores are designed to be explainable.
- Progress is stored only in the browser (`localStorage`). Clearing site data resets it.
- This is an early prototype aimed at students exploring tech careers.

## License

Intended for learning and portfolio use.
