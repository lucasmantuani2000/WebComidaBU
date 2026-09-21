import { useState, useEffect, type ReactNode } from 'react'
import type { Review } from '../types'
import { MOCK_REVIEWS } from '../data'
import { ReviewsContext } from './reviews-context'

const REVIEWS_STORAGE_KEY = 'comidabu_reviews'

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (e) {
      console.error('Error al cargar reseñas guardadas:', e)
    }
    return MOCK_REVIEWS
  })

  // Sincronizar en localStorage cada vez que cambien las reseñas
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))
    } catch (e) {
      console.error('Error al guardar reseñas en localStorage:', e)
    }
  }, [reviews])

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>): Review => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Recién',
      verifiedVisit: true,
    }

    setReviews((prev) => [newReview, ...prev])
    return newReview
  }

  const getReviewsByBusiness = (businessId: string): Review[] => {
    return reviews.filter((r) => r.businessId === businessId)
  }

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        addReview,
        getReviewsByBusiness,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}
