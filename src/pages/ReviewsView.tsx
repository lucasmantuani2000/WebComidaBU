import { useState, useMemo } from 'react'
import type { Review } from '../types'
import {
  MessageSquare,
  Star,
  Search,
  X,
  Plus,
  RotateCcw,
  Store,
  CheckCircle2,
  PenSquare,
  Sparkles,
} from 'lucide-react'
import { MOCK_REVIEWS, MOCK_BUSINESSES } from '../data'
import { ReviewCard } from '../components/common'
import { normalizeText } from '../utils'
import { BusinessDetail } from './BusinessDetail'

interface ReviewsViewProps {
  selectedBusinessId?: string | null
  onSelectBusiness?: (id: string | null) => void
}

export function ReviewsView({
  selectedBusinessId: propSelectedId,
  onSelectBusiness: propOnSelect,
}: ReviewsViewProps = {}) {
  // Estado de lista de opiniones en memoria
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [starFilter, setStarFilter] = useState<number | 'all'>('all')

  // Estado del Modal de Nueva Reseña
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formBusinessId, setFormBusinessId] = useState(MOCK_BUSINESSES[0]?.id || '')
  const [formProduct, setFormProduct] = useState('')
  const [formRating, setFormRating] = useState(5)
  const [formHoverRating, setFormHoverRating] = useState(0)
  const [formUserName, setFormUserName] = useState('')
  const [formComment, setFormComment] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  // Control de selección para la Ficha de Detalle
  const selectedBusinessId = propSelectedId !== undefined ? propSelectedId : internalSelectedId
  const setSelectedBusinessId = propOnSelect || setInternalSelectedId

  const selectedBusiness = useMemo(() => {
    if (!selectedBusinessId) return null
    return (
      MOCK_BUSINESSES.find(
        (b) => b.id === selectedBusinessId || b.slug === selectedBusinessId
      ) || null
    )
  }, [selectedBusinessId])

  // Filtrado reactivo en tiempo real con normalizador de texto
  const filteredReviews = useMemo(() => {
    const normQuery = normalizeText(searchQuery)

    return reviews.filter((review) => {
      // Filtro por estrellas
      if (starFilter !== 'all' && review.rating !== starFilter) {
        return false
      }

      // Búsqueda en nombre de local, producto consumido y comentario
      if (normQuery) {
        const matchBusiness = normalizeText(review.businessName).includes(normQuery)
        const matchProduct = normalizeText(review.productConsumed).includes(normQuery)
        const matchComment = normalizeText(review.comment).includes(normQuery)
        const matchUser = normalizeText(review.userName).includes(normQuery)

        if (!matchBusiness && !matchProduct && !matchComment && !matchUser) {
          return false
        }
      }

      return true
    })
  }, [reviews, searchQuery, starFilter])

  // Métricas globales del feed
  const metrics = useMemo(() => {
    const total = reviews.length
    if (total === 0) return { total: 0, average: '0.0', businessesWithReviews: 0 }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    const average = (sum / total).toFixed(1)
    const uniqueBusinesses = new Set(reviews.map((r) => r.businessId)).size
    return { total, average, businessesWithReviews: uniqueBusinesses }
  }, [reviews])

  const handleResetFilters = () => {
    setSearchQuery('')
    setStarFilter('all')
  }

  // Manejo del envío del formulario de nueva reseña
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formProduct.trim() || !formUserName.trim() || !formComment.trim()) {
      return
    }

    const business = MOCK_BUSINESSES.find((b) => b.id === formBusinessId)
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      businessId: formBusinessId,
      businessName: business?.name || 'Local de Bella Unión',
      userName: formUserName.trim(),
      productConsumed: formProduct.trim(),
      rating: formRating,
      comment: formComment.trim(),
      date: 'Recién',
      verifiedVisit: true,
    }

    // Agregar al inicio del feed en memoria
    setReviews([newReview, ...reviews])

    // Limpiar formulario y cerrar modal
    setFormProduct('')
    setFormUserName('')
    setFormComment('')
    setFormRating(5)
    setIsModalOpen(false)

    // Mostrar mensaje de éxito temporal
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 4500)
  }

  // Si hay un comercio seleccionado, abrimos la ficha de detalle
  if (selectedBusinessId) {
    return (
      <BusinessDetail
        business={selectedBusiness}
        onBack={() => {
          setSelectedBusinessId(null)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast / Alerta de confirmación de nueva reseña */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-500 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-sm">¡Opinión compartida!</span>
            Tu experiencia ha sido publicada con éxito en el feed comunitario.
          </div>
        </div>
      )}

      {/* Cabecera Principal y Métricas */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Comunidad Gastronómica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Experiencias en Bella Unión
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Opiniones de vecinos y visitantes sobre locales, platos específicos y la atención en la ciudad.
          </p>
        </div>

        {/* Botón Escribir Reseña */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-800 font-bold text-sm shadow-md transition active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <PenSquare className="w-4 h-4 text-amber-600" />
          <span>Escribir reseña</span>
        </button>
      </div>

      {/* Métricas del Feed */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center">
          <div className="text-xs font-medium text-slate-500">Opiniones</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{metrics.total}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center">
          <div className="text-xs font-medium text-slate-500">Promedio general</div>
          <div className="text-2xl font-black text-amber-600 mt-0.5 flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span>{metrics.average}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center">
          <div className="text-xs font-medium text-slate-500">Locales comentados</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{metrics.businessesWithReviews}</div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros de Estrellas */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por local, plato consumido (ej: chivito, milanesa) o autor..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtro de Calificación (Estrellas) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Calificación:
          </span>

          <button
            type="button"
            onClick={() => setStarFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              starFilter === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Todas ({reviews.length})
          </button>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length
            const isSelected = starFilter === stars

            return (
              <button
                key={stars}
                type="button"
                onClick={() => setStarFilter(stars)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{stars}</span>
                <Star className={`w-3 h-3 ${isSelected ? 'fill-white text-white' : 'fill-amber-500 text-amber-500'}`} />
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            )
          })}

          {(searchQuery || starFilter !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-amber-600 transition cursor-pointer whitespace-nowrap ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Feed de Opiniones */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>Opiniones de la Comunidad</span>
          </h2>
          <span className="text-xs text-slate-400">
            {filteredReviews.length} {filteredReviews.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onSelectBusiness={(businessId) => {
                  setSelectedBusinessId(businessId)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 text-center space-y-4 max-w-md mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto ring-6 ring-amber-500/5">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                No encontramos opiniones con ese filtro
              </h3>
              <p className="text-xs text-slate-500">
                Probá buscando por otro plato o restablecé los filtros para ver todas las opiniones.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer filtros</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Modal / Formulario para Agregar Nueva Reseña */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <PenSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Escribir una reseña</h3>
                  <p className="text-xs text-slate-500">Compartí tu experiencia con la comunidad</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Selector de Comercio */}
              <div className="space-y-1">
                <label htmlFor="business-select" className="font-bold text-slate-700 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>¿A qué comercio de Bella Unión visitaste o pediste?</span>
                </label>
                <select
                  id="business-select"
                  value={formBusinessId}
                  onChange={(e) => setFormBusinessId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 cursor-pointer"
                  required
                >
                  {MOCK_BUSINESSES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.location.address})
                    </option>
                  ))}
                </select>
              </div>

              {/* Regla Clave: Producto / Plato consumido */}
              <div className="space-y-1">
                <label htmlFor="product-input" className="font-bold text-slate-700 block">
                  ¿Qué consumiste o pediste? <span className="text-amber-600 font-semibold">(Plato específico)</span>
                </label>
                <input
                  id="product-input"
                  type="text"
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  placeholder="Ej: Chivito canadiense al pan, Pizza cuatro quesos, Smash Doble..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                  required
                />
              </div>

              {/* Selector de Estrellas Interactivo */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 block">Calificación general:</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setFormHoverRating(star)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        className="p-1 text-slate-300 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= (formHoverRating || formRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="font-bold text-amber-800 text-sm ml-1">
                    {formHoverRating || formRating} de 5 estrellas
                  </span>
                </div>
              </div>

              {/* Nombre de Usuario */}
              <div className="space-y-1">
                <label htmlFor="user-input" className="font-bold text-slate-700 block">
                  Tu nombre y apellido:
                </label>
                <input
                  id="user-input"
                  type="text"
                  value={formUserName}
                  onChange={(e) => setFormUserName(e.target.value)}
                  placeholder="Ej: Carlos Rossi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                  required
                />
              </div>

              {/* Comentario / Opinión */}
              <div className="space-y-1">
                <label htmlFor="comment-input" className="font-bold text-slate-700 block">
                  Tu opinión y experiencia:
                </label>
                <textarea
                  id="comment-input"
                  rows={3}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Contanos qué tal estuvo la comida, la rapidez del pedido y la atención..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                  required
                />
              </div>

              {/* Botones de Acción */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer transition shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar opinión</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
