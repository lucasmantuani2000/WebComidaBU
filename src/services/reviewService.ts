import { supabase, isSupabaseConfigured } from './supabase'
import type { Review } from '../types'
import { MOCK_REVIEWS } from '../data'

export interface ReviewRow {
  id: string
  business_id: string
  business_name: string
  user_id?: string | null
  user_name: string
  user_avatar?: string | null
  product_consumed: string
  rating: number
  comment: string
  date?: string | null
  verified_visit?: boolean | null
  created_at?: string | null
}

const LOCAL_STORAGE_KEY = 'comidabu_reviews'

/**
 * Convierte una fila de reseña de Supabase (snake_case)
 * a la interfaz Review del frontend.
 */
export function mapRowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    businessId: row.business_id,
    businessName: row.business_name,
    userId: row.user_id || undefined,
    userName: row.user_name,
    userAvatar: row.user_avatar || undefined,
    productConsumed: row.product_consumed,
    rating: Number(row.rating),
    comment: row.comment,
    date: row.date || 'Recién',
    verifiedVisit: Boolean(row.verified_visit ?? true),
  }
}

/**
 * Carga reseñas desde localStorage para soporte offline / fallback.
 */
function getLocalReviews(): Review[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('[reviewService] Error leyendo localStorage:', e)
  }
  return MOCK_REVIEWS
}

/**
 * Obtiene todas las reseñas comunitarias.
 * Intenta consultar Supabase; si falla o no está configurado,
 * realiza un fallback a localStorage y MOCK_REVIEWS.
 */
export async function getReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured) {
    return getLocalReviews()
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('[reviewService] Falló consulta en Supabase, usando fallback local:', error.message)
      return getLocalReviews()
    }

    if (!data || data.length === 0) {
      return getLocalReviews()
    }

    const mapped = (data as ReviewRow[]).map(mapRowToReview)

    // Sincronizar en localStorage para redundancia
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped))
    } catch {
      // Ignorar límite de storage
    }

    return mapped
  } catch (err) {
    console.error('[reviewService] Excepción consultando Supabase:', err)
    return getLocalReviews()
  }
}

/**
 * Obtiene las reseñas asociadas a un comercio gastronómico particular.
 */
export async function getReviewsByBusiness(businessId: string): Promise<Review[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        return (data as ReviewRow[]).map(mapRowToReview)
      }
    } catch (err) {
      console.warn('[reviewService] Error consultando reseñas por comercio:', err)
    }
  }

  // Fallback filtrando del pool local
  const allReviews = getLocalReviews()
  return allReviews.filter((r) => r.businessId === businessId)
}

/**
 * Inserta una nueva reseña en Supabase.
 * Si Supabase no está configurado o falla la petición (ej. tabla pendiente de creación o error de red),
 * persiste la reseña en localStorage y devuelve el objeto para garantizar una experiencia fluida sin bloqueos.
 */
export async function createReview(reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> {
  const localId = `rev-${Date.now()}`
  const fallbackReview: Review = {
    ...reviewData,
    id: localId,
    date: 'Recién',
    verifiedVisit: true,
  }

  if (isSupabaseConfigured) {
    try {
      const rowToInsert: Partial<ReviewRow> = {
        id: localId,
        business_id: reviewData.businessId,
        business_name: reviewData.businessName,
        user_id: reviewData.userId || null,
        user_name: reviewData.userName,
        user_avatar: reviewData.userAvatar || null,
        product_consumed: reviewData.productConsumed,
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: 'Recién',
        verified_visit: true,
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert([rowToInsert])
        .select()
        .single()

      if (error) {
        console.warn('[reviewService] Falló inserción en Supabase, guardando localmente:', error.message)
      } else if (data) {
        return mapRowToReview(data as ReviewRow)
      }
    } catch (err) {
      console.error('[reviewService] Excepción al guardar reseña en Supabase:', err)
    }
  }

  // Guardar en localStorage para persistencia local
  try {
    const current = getLocalReviews()
    const updated = [fallbackReview, ...current]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error('[reviewService] Error al actualizar localStorage:', e)
  }

  return fallbackReview
}
