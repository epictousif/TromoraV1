"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type AuthUser = {
  id?: string
  name?: string
  email?: string
}

export type AuthContextType = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (args: { token: string; user?: AuthUser }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = "trimora_token"
const USER_KEY = "trimora_user"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // bootstrap from localStorage
  useEffect(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY)
      const u = localStorage.getItem(USER_KEY)
      if (t) setToken(t)
      if (u) setUser(JSON.parse(u))
    } catch {}
    setLoading(false)
  }, [])

  // If we have a token, fetch profile from backend (keeps details in sync)
  useEffect(() => {
    async function fetchMe() {
      if (!token) return
      try {
        const res = await fetch("https://tromora-v1.vercel.app/api/v1/user/me", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          const u: AuthUser = { id: data.id, name: data.name, email: data.email }
          setUser(u)
          try { localStorage.setItem(USER_KEY, JSON.stringify(u)) } catch {}
        }
      } catch {}
    }
    fetchMe()
  }, [token])

  const login = useCallback((args: { token: string; user?: AuthUser }) => {
    setToken(args.token)
    if (args.user) setUser(args.user)
    try {
      localStorage.setItem(TOKEN_KEY, args.token)
      if (args.user) localStorage.setItem(USER_KEY, JSON.stringify(args.user))
    } catch {}
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch {}
  }, [])

  const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
