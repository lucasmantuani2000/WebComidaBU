import { useState, useEffect, type ReactNode } from 'react'
import { FavoritesContext } from './favorites-context'

const FAVORITES_STORAGE_KEY = 'comidabu_favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed.filter((id): id is string => typeof id === 'string')
        }
      }
    } catch (e) {
      console.error('Error al recuperar favoritos de localStorage:', e)
    }
    return []
  })

  // Sincronizar en localStorage cada vez que cambien los favoritos
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    } catch (e) {
      console.error('Error al guardar favoritos en localStorage:', e)
    }
  }, [favorites])

  const isFavorite = (businessId: string): boolean => {
    return favorites.includes(businessId)
  }

  const toggleFavorite = (businessId: string): void => {
    setFavorites((prev) =>
      prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId]
    )
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
