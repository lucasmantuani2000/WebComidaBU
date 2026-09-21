import { useState, useEffect, type ReactNode } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User } from '../types'
import { AuthContext } from './auth-context'
import { supabase, isSupabaseConfigured } from '../services'

const DEMO_STORAGE_KEY = 'comidabu_demo_user'

const DEMO_USER: User = {
  id: 'usr-martin-silva',
  name: 'Martín Silva',
  email: 'martin.silva@comidabu.uy',
  createdAt: 'Septiembre 2026',
}

function mapSupabaseUser(sbUser: SupabaseUser): User {
  const meta = sbUser.user_metadata || {}
  const rawEmail = sbUser.email || ''
  const defaultName = rawEmail
    ? rawEmail.split('@')[0].replace(/[._-]/g, ' ')
    : 'Vecino'
  const formattedDefaultName =
    defaultName.charAt(0).toUpperCase() + defaultName.slice(1)

  const name = meta.name || meta.full_name || formattedDefaultName

  let createdAtFormatted = 'Reciente'
  if (sbUser.created_at) {
    try {
      const date = new Date(sbUser.created_at)
      createdAtFormatted = new Intl.DateTimeFormat('es-UY', {
        month: 'long',
        year: 'numeric',
      }).format(date)
      createdAtFormatted =
        createdAtFormatted.charAt(0).toUpperCase() + createdAtFormatted.slice(1)
    } catch {
      createdAtFormatted = 'Reciente'
    }
  }

  return {
    id: sbUser.id,
    name,
    email: rawEmail,
    avatar: meta.avatar_url || meta.picture || undefined,
    createdAt: createdAtFormatted,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Si no está configurado Supabase o se usó demo user, cargar demo de inmediato
    try {
      if (localStorage.getItem(DEMO_STORAGE_KEY) === 'true') {
        return DEMO_USER
      }
    } catch {
      // Ignorar error de acceso a storage
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function initSession() {
      try {
        const isDemo = localStorage.getItem(DEMO_STORAGE_KEY) === 'true'

        if (isSupabaseConfigured) {
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error) {
            console.error('[Supabase] Error al consultar sesión:', error)
          }

          if (isMounted) {
            if (session?.user) {
              setCurrentUser(mapSupabaseUser(session.user))
              localStorage.removeItem(DEMO_STORAGE_KEY)
            } else if (isDemo) {
              setCurrentUser(DEMO_USER)
            } else {
              setCurrentUser(null)
            }
          }
        } else if (isDemo && isMounted) {
          setCurrentUser(DEMO_USER)
        }
      } catch (err) {
        console.error('[Supabase] Error inicializando sesión:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initSession()

    let authListener: { subscription: { unsubscribe: () => void } } | null = null

    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setCurrentUser(mapSupabaseUser(session.user))
          localStorage.removeItem(DEMO_STORAGE_KEY)
        } else {
          const isDemo = localStorage.getItem(DEMO_STORAGE_KEY) === 'true'
          if (!isDemo) {
            setCurrentUser(null)
          }
        }
        setIsLoading(false)
      })
      authListener = data
    }

    return () => {
      isMounted = false
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // Iniciar sesión con email y contraseña en Supabase
  const login = async (email: string, password?: string): Promise<void> => {
    setIsLoading(true)
    try {
      if (!isSupabaseConfigured) {
        throw new Error(
          'Supabase no está configurado. Configurá las variables en el archivo .env o usá el botón de usuario demo.'
        )
      }

      if (!password) {
        throw new Error('Por favor ingresá tu contraseña.')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        setCurrentUser(mapSupabaseUser(data.user))
        localStorage.removeItem(DEMO_STORAGE_KEY)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Registro de nuevo usuario en Supabase con metadata
  const register = async (name: string, email: string, password?: string): Promise<void> => {
    setIsLoading(true)
    try {
      if (!isSupabaseConfigured) {
        throw new Error(
          'Supabase no está configurado. Configurá las variables en el archivo .env o usá el botón de usuario demo.'
        )
      }

      if (!password) {
        throw new Error('Por favor ingresá una contraseña.')
      }

      const trimmedName = name.trim()
      const trimmedEmail = email.trim().toLowerCase()

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            name: trimmedName,
            full_name: trimmedName,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        setCurrentUser(mapSupabaseUser(data.user))
        localStorage.removeItem(DEMO_STORAGE_KEY)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Cerrar sesión
  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY)
      if (isSupabaseConfigured) {
        await supabase.auth.signOut()
      }
      setCurrentUser(null)
    } catch (err) {
      console.error('[Supabase] Error al cerrar sesión:', err)
      setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Acceso rápido con usuario demo para pruebas ágiles
  const loginAsDemoUser = async (): Promise<void> => {
    localStorage.setItem(DEMO_STORAGE_KEY, 'true')
    setCurrentUser(DEMO_USER)
  }

  // Inicio de sesión con Google OAuth (opcional)
  const loginWithGoogle = async (): Promise<void> => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase no está configurado. Configurá las variables en el archivo .env para usar Google OAuth.'
      )
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        isSupabaseConfigured,
        login,
        register,
        logout,
        loginAsDemoUser,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
