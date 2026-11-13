import { supabase, isSupabaseConfigured } from '../lib/supabase'

export async function loadCloudProfile(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('Failed to load cloud profile:', error.message)
    return null
  }

  if (!data) return null

  return {
    name: data.name || '',
    degree: data.degree || 'B.Tech',
    branch: data.branch || '',
    year: data.year || '',
    skills: data.skills || [],
    interests: data.interests || [],
    preference: data.preference || '',
    collegeCode: data.college_code || '',
    collegeName: data.college_name || '',
  }
}

export async function saveCloudProfile(userId, formData) {
  if (!isSupabaseConfigured || !supabase || !userId) return

  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    name: formData.name || '',
    degree: formData.degree || 'B.Tech',
    branch: formData.branch || '',
    year: formData.year || '',
    skills: formData.skills || [],
    interests: formData.interests || [],
    preference: formData.preference || '',
    college_code: formData.collegeCode || '',
    college_name: formData.collegeName || '',
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Failed to save cloud profile:', error.message)
  }
}

export async function loadCloudProgress(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return {}

  const { data, error } = await supabase
    .from('learning_progress')
    .select('career_title, completed_topics')
    .eq('user_id', userId)

  if (error) {
    console.error('Failed to load cloud progress:', error.message)
    return {}
  }

  const result = {}
  for (const row of data || []) {
    result[row.career_title] = row.completed_topics || []
  }
  return result
}

export async function saveCloudProgress(userId, progressByCareer) {
  if (!isSupabaseConfigured || !supabase || !userId) return

  const rows = Object.entries(progressByCareer || {}).map(
    ([careerTitle, topics]) => ({
      user_id: userId,
      career_title: careerTitle,
      completed_topics: topics || [],
      updated_at: new Date().toISOString(),
    })
  )

  if (rows.length === 0) return

  const { error } = await supabase
    .from('learning_progress')
    .upsert(rows, { onConflict: 'user_id,career_title' })

  if (error) {
    console.error('Failed to save cloud progress:', error.message)
  }
}
