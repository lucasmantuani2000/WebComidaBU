import { createContext, useContext } from 'react'
import type { User } from '../types'

export interface AuthContextType {
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, name?: string) => Promise<void>
  register: (name: string, email: string) => Promise<void>
  logout: () => void
  loginAsDemoUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider')
  }
  return context
}
