import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL

const supabasePublicKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const SUPABASE_APP_KEY = import.meta.env.VITE_SUPABASE_APP_KEY || 'dormentes-main'

export const supabase = supabaseUrl && supabasePublicKey
  ? createClient(supabaseUrl, supabasePublicKey)
  : null

export function isSupabaseConfigured() {
  return Boolean(supabase)
}

export async function loadAppState() {
  if (!supabase) return { configured: false, data: null, error: null }

  const { data, error } = await supabase
    .from('app_state')
    .select('tracks, selected_track_id, saved_at, updated_at')
    .eq('app_key', SUPABASE_APP_KEY)
    .maybeSingle()

  if (error) return { configured: true, data: null, error }

  return {
    configured: true,
    data: data
      ? {
          tracks: data.tracks,
          selectedTrackId: data.selected_track_id,
          savedAt: data.saved_at,
          updatedAt: data.updated_at
        }
      : null,
    error: null
  }
}

export async function saveAppState({ tracks, selectedTrackId, savedAt }) {
  if (!supabase) return { configured: false, error: null }

  const { error } = await supabase
    .from('app_state')
    .upsert({
      app_key: SUPABASE_APP_KEY,
      tracks,
      selected_track_id: selectedTrackId,
      saved_at: savedAt,
      updated_at: new Date().toISOString()
    }, { onConflict: 'app_key' })

  return { configured: true, error }
}
