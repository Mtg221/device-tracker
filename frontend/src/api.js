const API = import.meta.env.VITE_API_URL || '/api'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('de_token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(API + path, { headers, ...options })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}