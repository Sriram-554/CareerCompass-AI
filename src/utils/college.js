import { supabase, isSupabaseConfigured } from '../lib/supabase'

const LOCAL_COLLEGE_CODES = {
  DEMO2026: 'Demo College',
  SIH2026: 'Smart India Hackathon Cohort',
  CAMPUS2026: 'Campus Pilot Program',
}

export async function resolveCollegeCode(rawCode) {
  const code = (rawCode || '').trim().toUpperCase()
  if (!code) {
    return { ok: true, code: '', collegeName: '' }
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('college_codes')
      .select('code, college_name, active')
      .eq('code', code)
      .maybeSingle()

    if (!error && data) {
      if (!data.active) {
        return { ok: false, error: 'This college code is inactive.' }
      }
      return {
        ok: true,
        code: data.code,
        collegeName: data.college_name,
      }
    }
  }

  if (LOCAL_COLLEGE_CODES[code]) {
    return {
      ok: true,
      code,
      collegeName: LOCAL_COLLEGE_CODES[code],
    }
  }

  return {
    ok: false,
    error: 'Invalid college invite code. Leave it blank or ask your faculty for a valid code.',
  }
}
