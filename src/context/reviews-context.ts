import { createContext, useContext } from 'react'
import type { Review } from '../types'

export interface ReviewsContextType {
  reviews: Review[]
  addReview: (reviewData: Omit<Review, 'id' | 'date'>) => Review
  getReviewsByBusiness: (businessId: string) => Review[]
}

export const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

export function useReviews(): ReviewsContextType {
  const context = useContext(ReviewsContext)
  if (!context) {
    throw new Error('useReviews debe utilizarse dentro de un ReviewsProvider')
  }
  return context
}
