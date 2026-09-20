export interface Review {
  id: string
  businessId: string
  businessName: string
  userName: string
  userAvatar?: string
  /**
   * Regla clave: Plato, comida o bebida específica que el usuario consumió o pidió.
   * Ej: 'Hamburguesa completa con fritas', 'Pizza cuatro quesos', 'Chivito canadiense'
   */
  productConsumed: string
  rating: number
  comment: string
  date: string
  verifiedVisit?: boolean
}
