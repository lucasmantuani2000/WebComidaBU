import { useState, type ReactNode } from 'react'
import type { User } from '../types'
import { AuthContext } from './auth-context'

const AUTH_STORAGE_KEY = 'comidabu_user'

const DEMO_USER: User = {
  id: 'usr-martin-silva',
  name: 'Martín Silva',
  email: 'martin.silva@comidabu.uy',
  createdAt: 'Septiembre 2026',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicialización directa y limpia desde localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as User
      }
    } catch (err) {
      console.error('Error al recuperar sesión local:', err)
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)

  // Iniciar sesión con email y opcionalmente nombre
  const login = async (email: string, name?: string): Promise<void> => {
    setIsLoading(true)
    try {
      const trimmedEmail = email.trim().toLowerCase()
      // Si no se provee nombre, derivar un display name amigable del correo
      const defaultName = name?.trim() || trimmedEmail.split('@')[0].replace(/[._-]/g, ' ')
      const formattedName =
        defaultName.charAt(0).toUpperCase() + defaultName.slice(1)

      const user: User = {
        id: `usr-${Date.now()}`,
        name: formattedName,
        email: trimmedEmail,
        createdAt: new Intl.DateTimeFormat('es-UY', {
          month: 'long',
          year: 'numeric',
        }).format(new Date()),
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      setCurrentUser(user)
    } finally {
      setIsLoading(false)
    }
  }

  // Registro de nuevo usuario
  const register = async (name: string, email: string): Promise<void> => {
    setIsLoading(true)
    try {
      const user: User = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Intl.DateTimeFormat('es-UY', {
          month: 'long',
          year: 'numeric',
        }).format(new Date()),
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      setCurrentUser(user)
    } finally {
      setIsLoading(false)
    }
  }

  // Cerrar sesión
  const logout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch (err) {
      console.error('Error al limpiar sesión:', err)
    }
    setCurrentUser(null)
  }

  // Acceso rápido con usuario demo para pruebas ágiles
  const loginAsDemoUser = async (): Promise<void> => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER))
    setCurrentUser(DEMO_USER)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout,
        loginAsDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
