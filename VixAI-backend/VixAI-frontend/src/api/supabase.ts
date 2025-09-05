import axios from 'axios'

const ENV = (import.meta as any).env || {}
const SUPABASE_URL = ENV.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = ENV.VITE_SUPABASE_ANON_KEY as string | undefined

export async function sbSelect(table: string, params: Record<string, string> = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return []
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${table}`
  const { data } = await axios.get(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json'
    },
    params: { select: '*', ...params }
  })
  return data
}
