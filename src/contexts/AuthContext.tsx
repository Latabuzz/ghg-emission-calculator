'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// User credentials (in production, this should be in a secure backend)
const VALID_USER = {
  username: 'kompis',
  password: 'kompis123'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (username: string, password: string): boolean => {
    if (username === VALID_USER.username && password === VALID_USER.password) {
      setIsAuthenticated(true)
      localStorage.setItem('isAuthenticated', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
