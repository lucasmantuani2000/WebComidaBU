import { supabase, isSupabaseConfigured } from './supabase'
import type {
  Business,
  BusinessLocation,
  BusinessContact,
  BusinessServices,
  BusinessSchedule,
  PriceRange,
  BusinessStatus,
} from '../types'
import { MOCK_BUSINESSES } from '../data'

export interface BusinessRow {
  id: string
  name: string
  slug: string
  description?: string | null
  cover_image?: string | null
  gallery?: string[] | null
  categories?: string[] | null
  offering?: string[] | null
  location?: BusinessLocation | null
  contact?: BusinessContact | null
  services?: BusinessServices | null
  schedule?: BusinessSchedule | null
  price_range?: PriceRange | null
  rating?: number | null
  review_count?: number | null
  verified?: boolean | null
  status?: BusinessStatus | null
  created_at?: string | null
  updated_at?: string | null
}

/**
 * Convierte una fila de la base de datos Supabase (snake_case)
 * al modelo de dominio de TypeScript (camelCase).
 */
export function mapRowToBusiness(row: BusinessRow): Business {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    coverImage: row.cover_image || '',
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    categories: Array.isArray(row.categories) ? row.categories : [],
    offering: Array.isArray(row.offering) ? row.offering : [],
    location: row.location || {
      address: 'Bella Unión',
      city: 'Bella Unión',
      department: 'Artigas',
    },
    contact: row.contact || {},
    services: row.services || {
      delivery: false,
      takeout: false,
      dineIn: false,
    },
    schedule: row.schedule || null,
    priceRange: (row.price_range as PriceRange) || null,
    rating: typeof row.rating === 'number' ? Number(row.rating) : 0,
    reviewCount: typeof row.review_count === 'number' ? row.review_count : 0,
    verified: Boolean(row.verified),
    status: (row.status as BusinessStatus) || 'pending_verification',
  }
}

/**
 * Obtiene el catálogo completo de comercios gastronómicos.
 * Intenta consultar Supabase; si no está configurado o la tabla está vacía/inaccesible,
 * realiza un fallback automático y transparente a MOCK_BUSINESSES.
 */
export async function getBusinesses(): Promise<Business[]> {
  if (!isSupabaseConfigured) {
    return MOCK_BUSINESSES
  }

  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.warn('[businessService] Falló consulta en Supabase, utilizando fallback mock:', error.message)
      return MOCK_BUSINESSES
    }

    if (!data || data.length === 0) {
      console.info('[businessService] Tabla de comercios vacía en Supabase. Usando MOCK_BUSINESSES.')
      return MOCK_BUSINESSES
    }

    return (data as BusinessRow[]).map(mapRowToBusiness)
  } catch (err) {
    console.error('[businessService] Excepción de conexión a Supabase:', err)
    return MOCK_BUSINESSES
  }
}

/**
 * Obtiene un comercio específico por su slug o identificador único.
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const normalizedSlug = slug.trim().toLowerCase()

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .or(`slug.eq.${normalizedSlug},id.eq.${normalizedSlug}`)
        .maybeSingle()

      if (!error && data) {
        return mapRowToBusiness(data as BusinessRow)
      }
    } catch (err) {
      console.warn('[businessService] Error consultando comercio por slug:', err)
    }
  }

  // Fallback a mock local
  const fallback = MOCK_BUSINESSES.find(
    (b) => b.slug.toLowerCase() === normalizedSlug || b.id.toLowerCase() === normalizedSlug
  )
  return fallback || null
}

/**
 * Obtiene un comercio específico por su ID único.
 */
export async function getBusinessById(id: string): Promise<Business | null> {
  return getBusinessBySlug(id)
}
