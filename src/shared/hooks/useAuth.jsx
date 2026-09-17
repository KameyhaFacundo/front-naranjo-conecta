import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../../features/auth/api.js'
import { clearToken, getToken, saveToken } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setCargando(false)
      return
    }

    authApi
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCargando(false))
  }, [])

  async function login(credentials) {
    const { user, token } = await authApi.login(credentials)
    saveToken(token)
    setUser(user)
    return user
  }

  async function register(data) {
    const { user, token } = await authApi.register(data)
    saveToken(token)
    setUser(user)
    return user
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      clearToken()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
