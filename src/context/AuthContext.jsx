import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Try to refresh session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true })
        if (data.success) {
          setToken(data.data.token)
          setUser(data.data.user)
        }
      } catch {
        // No valid refresh token — not logged in
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // Auto-attach Authorization header
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      config.withCredentials = true
      return config
    })

    const resInterceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config
        if (error.response?.status === 401 && !original._retried) {
          original._retried = true
          try {
            const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true })
            if (data.success) {
              setToken(data.data.token)
              setUser(data.data.user)
              original.headers.Authorization = `Bearer ${data.data.token}`
              return axios(original)
            }
          } catch {
            setToken(null)
            setUser(null)
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(reqInterceptor)
      axios.interceptors.response.eject(resInterceptor)
    }
  }, [token])

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    if (data.success) {
      setToken(data.data.token)
      setUser(data.data.user)
    }
    return data
  }, [])

  const register = useCallback(async (name, email, password, phone = '') => {
    const { data } = await axios.post('/api/auth/register', { name, email, password, phone })
    if (data.success) {
      setToken(data.data.token)
      setUser(data.data.user)
    }
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true })
    } finally {
      setToken(null)
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
