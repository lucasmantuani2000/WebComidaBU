import { createContext, useContext } from 'react'
import type { Business } from '../types'

export interface BusinessContextType {
  businesses: Business[]
  isLoading: boolean
  getBusinessById: (id: string) => Business | undefined
  getBusinessBySlug: (slug: string) => Business | undefined
  reloadBusinesses: () => Promise<void>
}

export const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function useBusinesses(): BusinessContextType {
  const context = useContext(BusinessContext)
  if (!context) {
    throw new Error('useBusinesses debe utilizarse dentro de un BusinessProvider')
  }
  return context
}
