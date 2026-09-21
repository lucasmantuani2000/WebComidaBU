import { createContext, useContext } from 'react'
import type { User } from '../types'

export interface AuthContextType {
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isSupabaseConfigured: boolean
  login: (email: string, password?: string) => Promise<void>
  register: (name: string, email: string, password?: string) => Promise<void>
  logout: () => Promise<void>
  loginAsDemoUser: () => Promise<void>
  loginWithGoogle: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider')
  }
  return context
}
