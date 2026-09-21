import { useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Business } from '../types'
import { MOCK_BUSINESSES } from '../data'
import { BusinessContext } from './business-context'
import { getBusinesses } from '../services'

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar comercios desde Supabase (con fallback transparente a MOCK_BUSINESSES)
  useEffect(() => {
    let isMounted = true

    async function loadBusinesses() {
      setIsLoading(true)
      try {
        const remoteData = await getBusinesses()
        if (isMounted && remoteData && remoteData.length > 0) {
          setBusinesses(remoteData)
        }
      } catch (err) {
        console.warn('[BusinessProvider] Error cargando comercios:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadBusinesses()

    return () => {
      isMounted = false
    }
  }, [])

  const getBusinessById = useCallback(
    (id: string): Business | undefined => {
      const normalized = id.toLowerCase()
      return businesses.find(
        (b) => b.id.toLowerCase() === normalized || b.slug.toLowerCase() === normalized
      )
    },
    [businesses]
  )

  const getBusinessBySlug = useCallback(
    (slug: string): Business | undefined => {
      return getBusinessById(slug)
    },
    [getBusinessById]
  )

  const reloadBusinesses = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const data = await getBusinesses()
      if (data && data.length > 0) {
        setBusinesses(data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        isLoading,
        getBusinessById,
        getBusinessBySlug,
        reloadBusinesses,
      }}
    >
      {children}
    </BusinessContext.Provider>
  )
}
