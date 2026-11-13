# Backend Setup (Supabase)

CareerCompass AI now supports optional accounts and cloud sync using Supabase.

Guests still work with localStorage. Logged-in users sync profile + roadmap progress across devices.

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in / sign up
3. Click **New project**
4. Choose a name (e.g. `careercompass`)
5. Set a database password (save it somewhere safe)
6. Create the project and wait until it is ready

## 2. Get API keys

In Supabase:

**Project Settings → API**

Copy:
- **Project URL**
- **anon public** key

## 3. Add environment variables locally

In the project root, create a file named `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Never commit `.env` (it is already in `.gitignore`).

## 4. Create database tables

In Supabase:

1. Open **SQL Editor**
2. Click **New query**
3. Paste everything from `supabase/schema.sql`
4. Click **Run**

## 5. Auth settings (recommended for student testing)

In Supabase:

**Authentication → Providers → Email**
- Enable Email

For faster local testing, you can temporarily disable email confirmation:

**Authentication → Providers → Email → Confirm email** → off

(Turn confirmation back on for production if you want verified emails.)

## 6. Install and run

```bash
npm install
npm run dev
```

You should see **Log in** in the navbar.

## 7. Deploy backend env to Vercel

In Vercel project settings:

**Settings → Environment Variables**

Add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then redeploy.

Also add your Vercel domain under Supabase:

**Authentication → URL Configuration**
- Site URL: your Vercel URL
- Redirect URLs: your Vercel URL and `http://localhost:5173`

## What gets synced

| Data | Guest | Logged in |
|------|-------|-----------|
| Assessment profile | localStorage | localStorage + Supabase `profiles` |
| Roadmap progress | localStorage | localStorage + Supabase `learning_progress` |

## Security notes

- Only the **anon** key is used in the frontend
- Row Level Security is enabled so users can only access their own rows
- Do not put the service role key in the frontend
