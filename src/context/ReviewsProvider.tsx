import { useState, useEffect, type ReactNode } from 'react'
import type { Review } from '../types'
import { MOCK_REVIEWS } from '../data'
import { ReviewsContext } from './reviews-context'
import { getReviews, createReview } from '../services'

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
  const [isLoading, setIsLoading] = useState(false)

  // Cargar reseñas remotas desde Supabase al montar
  useEffect(() => {
    let isMounted = true

    async function loadRemoteReviews() {
      setIsLoading(true)
      try {
        const data = await getReviews()
        if (isMounted && data && data.length > 0) {
          setReviews(data)
        }
      } catch (err) {
        console.warn('[ReviewsProvider] Error cargando reseñas:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadRemoteReviews()

    return () => {
      isMounted = false
    }
  }, [])

  // Sincronizar en localStorage cada vez que cambien las reseñas
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))
    } catch (e) {
      console.error('Error al guardar reseñas en localStorage:', e)
    }
  }, [reviews])

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>): Review => {
    const tempId = `rev-${Date.now()}`
    const newReview: Review = {
      ...reviewData,
      id: tempId,
      date: 'Recién',
      verifiedVisit: true,
    }

    // Actualización optimista inmediata en la interfaz
    setReviews((prev) => [newReview, ...prev])

    // Sincronización asíncrona con la base de datos Supabase
    void createReview(reviewData).then((savedReview) => {
      if (savedReview && savedReview.id !== tempId) {
        setReviews((prev) =>
          prev.map((r) => (r.id === tempId ? savedReview : r))
        )
      }
    })

    return newReview
  }

  const getReviewsByBusiness = (businessId: string): Review[] => {
    return reviews.filter((r) => r.businessId === businessId)
  }

  const reloadReviews = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const data = await getReviews()
      if (data && data.length > 0) {
        setReviews(data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        isLoading,
        addReview,
        getReviewsByBusiness,
        reloadReviews,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}
