# Real LLM Coach Setup (Groq)

CareerCompass generates coach plans with a real LLM through a secure Vercel API route.

- Frontend calls `/api/coach`
- API key stays on the server (never in the browser)
- If the key is missing or the API fails, the app falls back to the guided rule-based plan

## 1. Create a free Groq key

1. Open [https://console.groq.com](https://console.groq.com)
2. Sign up / log in
3. Create an API key
4. Copy it

## 2. Add the key in Vercel

Vercel project → **Settings → Environment Variables**

| Name | Value |
|------|--------|
| `GROQ_API_KEY` | your Groq API key |

Optional:

| Name | Value |
|------|--------|
| `LLM_MODEL` | `openai/gpt-oss-20b` (default on Groq free tier) |

> Note (Nov 2026): `llama-3.1-8b-instant` is enterprise-only on Groq.
> Free/developer projects should use `openai/gpt-oss-20b`.

Save for **Production** (and Preview if you want).

## 3. Redeploy

Deployments → latest → **Redeploy**

## 4. Test

1. Open the live site
2. Complete an assessment
3. On results, the coach card should show **Generated with AI**

If the key is missing or the model fails, it shows **Guided plan** instead (still works).

## Local development note

`/api/coach` runs on Vercel serverless.

- On localhost, the app usually uses the guided fallback unless you run `vercel dev`
- Production is where the LLM path matters most

## OpenAI alternative

If you prefer OpenAI instead of Groq:

- Set `OPENAI_API_KEY` in Vercel
- Do not set `GROQ_API_KEY`
- Optional: `LLM_MODEL=gpt-4o-mini`
