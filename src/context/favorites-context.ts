import { createContext, useContext } from 'react'

export interface FavoritesContextType {
  favorites: string[]
  isFavorite: (businessId: string) => boolean
  toggleFavorite: (businessId: string) => void
  favoritesCount: number
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites debe utilizarse dentro de un FavoritesProvider')
  }
  return context
}
