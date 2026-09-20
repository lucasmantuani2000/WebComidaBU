export type PriceRange = '$' | '$$' | '$$$' | null

export type BusinessStatus = 'active' | 'pending_verification' | 'inactive'

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description?: string
}

export interface BusinessLocation {
  address: string
  neighborhood?: string | null
  city: string
  department: string
  latitude?: number | null
  longitude?: number | null
}

export interface BusinessContact {
  phone?: string | null
  whatsapp?: string | null
  instagram?: string | null
  facebook?: string | null
  website?: string | null
}

export interface BusinessServices {
  delivery: boolean
  takeout: boolean
  dineIn: boolean
}

export interface BusinessSchedule {
  days: string[]
  openTime?: string | null
  closeTime?: string | null
  notes?: string | null
}

export interface Business {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string
  gallery: string[]
  categories: string[]
  /**
   * Lista de comidas/platos específicos que ofrece.
   * Regla clave: permite búsquedas precisas de lo que la gente quiere comer
   * (ej: ['Hamburguesas', 'Papas fritas', 'Chivitos', 'Pizzas'])
   */
  offering: string[]
  location: BusinessLocation
  contact: BusinessContact
  services: BusinessServices
  schedule?: BusinessSchedule | null
  priceRange: PriceRange
  rating: number
  reviewCount: number
  verified: boolean
  status: BusinessStatus
}
