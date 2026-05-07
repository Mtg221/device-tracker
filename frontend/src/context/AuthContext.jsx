import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('de_token')
    if (!token) { setLoading(false); return }
    apiFetch('/auth/me')
      .then(user => setCurrentUser(user))
      .catch(() => localStorage.removeItem('de_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('de_token', data.token)
    setCurrentUser(data.user)
    return data.user
  }

  const register = async (name, email, password) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    localStorage.setItem('de_token', data.token)
    setCurrentUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('de_token')
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)