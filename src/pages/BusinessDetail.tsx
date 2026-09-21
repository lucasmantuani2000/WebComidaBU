import { useState, useMemo } from 'react'
import type { Business } from '../types'
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  AtSign,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bike,
  ShoppingBag,
  Store,
  Star,
  UtensilsCrossed,
  ShieldCheck,
  Flag,
  Share2,
  Check,
  PenSquare,
  Plus,
  X,
} from 'lucide-react'
import { ReviewCard, AuthModal } from '../components/common'
import { useAuth, useReviews } from '../context'

export interface BusinessDetailProps {
  business: Business | null | undefined
  onBack: () => void
}

export function BusinessDetail({ business, onBack }: BusinessDetailProps) {
  const { currentUser, isAuthenticated } = useAuth()
  const { reviews, addReview } = useReviews()
  const [imgError, setImgError] = useState(false)
  const [copied, setCopied] = useState(false)

  // Estado del modal de autenticación si es espectador
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Estado del modal de nueva reseña desde el detalle
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [formProduct, setFormProduct] = useState('')
  const [formRating, setFormRating] = useState(5)
  const [formHoverRating, setFormHoverRating] = useState(0)
  const [formUserName, setFormUserName] = useState('')
  const [formComment, setFormComment] = useState('')
  const [showToast, setShowToast] = useState(false)

  // Reseñas asociadas a este negocio específico
  const businessReviews = useMemo(() => {
    if (!business) return []
    return reviews.filter((r) => r.businessId === business.id)
  }, [reviews, business])

  // Puntuación media calculada en base a las opiniones reales
  const computedRating = useMemo(() => {
    if (businessReviews.length === 0) return business?.rating || 0
    const sum = businessReviews.reduce((acc, r) => acc + r.rating, 0)
    return parseFloat((sum / businessReviews.length).toFixed(1))
  }, [businessReviews, business?.rating])

  // Manejo de estado si el negocio no existe
  if (!business) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Comercio no encontrado</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            El local gastronómico que estás buscando no existe o fue deshabilitado temporalmente.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Inicio</span>
          </button>
        </div>
      </div>
    )
  }

  // Normalización del número de WhatsApp (+598 uruguayo)
  const getWhatsAppUrl = (rawNumber: string): string => {
    const digits = rawNumber.replace(/\D/g, '')
    const formatted = digits.startsWith('0')
      ? `598${digits.slice(1)}`
      : digits.startsWith('598')
      ? digits
      : `598${digits}`
    const greeting = encodeURIComponent(
      `¡Hola ${business.name}! Los encontré en Comida BU y quisiera hacerles una consulta...`
    )
    return `https://wa.me/${formatted}?text=${greeting}`
  }

  // Enlace a Google Maps para la dirección física
  const getGoogleMapsUrl = (): string => {
    const query = `${business.name}, ${business.location.address}, Bella Unión, Artigas, Uruguay`
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  }

  // Compartir local
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenReviewModal = () => {
    if (isAuthenticated) {
      setIsReviewModalOpen(true)
      if (currentUser?.name) {
        setFormUserName(currentUser.name)
      }
    } else {
      setIsAuthModalOpen(true)
    }
  }

  // Enviar reseña directamente desde la ficha
  const handleSubmitDetailReview = (e: React.FormEvent) => {
    e.preventDefault()
    const authorName = currentUser?.name || formUserName.trim()
    if (!formProduct.trim() || !authorName || !formComment.trim()) return

    addReview({
      businessId: business.id,
      businessName: business.name,
      userId: currentUser?.id,
      userName: authorName,
      userAvatar: currentUser?.avatar,
      productConsumed: formProduct.trim(),
      rating: formRating,
      comment: formComment.trim(),
    })

    setFormProduct('')
    setFormUserName('')
    setFormComment('')
    setFormRating(5)
    setIsReviewModalOpen(false)

    setShowToast(true)
    setTimeout(() => setShowToast(false), 4500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Toast de confirmación */}
      {showToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-500 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-sm">¡Opinión publicada!</span>
            Tu reseña sobre {business.name} se ha sumado a la comunidad.
          </div>
        </div>
      )}

      {/* Barra de navegación superior con botón Volver */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:text-amber-600 hover:bg-amber-50/50 hover:border-amber-200 font-semibold text-xs sm:text-sm transition cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al listado</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 font-medium text-xs transition cursor-pointer shadow-xs"
          title="Copiar enlace"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">¡Enlace copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Compartir</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Portada con Fotografía Principal */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200/80 h-64 sm:h-80 md:h-96">
        {!imgError && business.coverImage ? (
          <img
            src={business.coverImage}
            alt={business.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-white">
            <UtensilsCrossed className="w-16 h-16 opacity-80" />
            <span className="text-lg font-bold mt-2">{business.name}</span>
          </div>
        )}

        {/* Gradiente dramático para legibilidad de títulos */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent pointer-events-none" />

        {/* Badges superiores sobre la portada */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {business.verified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verificado</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-600 text-white shadow-md backdrop-blur-md">
                <AlertCircle className="w-4 h-4" />
                <span>Por verificar</span>
              </span>
            )}
          </div>

          {business.priceRange && (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-white/95 text-slate-900 shadow-md backdrop-blur-md">
              {business.priceRange}
            </span>
          )}
        </div>

        {/* Título y metadatos en la base de la portada */}
        <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {business.categories.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-amber-200 border border-white/20"
              >
                {cat}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {business.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-2xl leading-relaxed">
            {business.description}
          </p>
        </div>
      </div>

      {/* Barra de Acciones de Contacto Rápido (Mobile-First) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* WhatsApp Principal */}
        {business.contact.whatsapp ? (
          <a
            href={getWhatsAppUrl(business.contact.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm transition shadow-md shadow-emerald-600/20"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Pedir por WhatsApp ({business.contact.whatsapp})</span>
          </a>
        ) : (
          <div className="flex-1 py-3 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-xl">
            WhatsApp no disponible para este comercio
          </div>
        )}

        {/* Llamada Telefónica Directa */}
        {business.contact.phone && (
          <a
            href={`tel:${business.contact.phone}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold text-sm transition shadow-xs"
            title={`Llamar a ${business.contact.phone}`}
          >
            <Phone className="w-4 h-4" />
            <span>Llamar ({business.contact.phone})</span>
          </a>
        )}

        {/* Perfil de Instagram */}
        {business.contact.instagram && (
          <a
            href={`https://instagram.com/${business.contact.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-700 hover:text-pink-600 font-semibold text-sm transition active:scale-[0.98]"
            title={`Instagram @${business.contact.instagram}`}
          >
            <AtSign className="w-4 h-4 text-pink-600" />
            <span>@{business.contact.instagram}</span>
          </a>
        )}
      </div>

      {/* Grilla con Información Detallada y Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna Principal (2 columnas): Qué ofrece + Horarios + Reseñas Reales */}
        <div className="md:col-span-2 space-y-6">
          {/* Especialidades y Platos (Offering) */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <UtensilsCrossed className="w-5 h-5 text-amber-600" />
              <h2>¿Qué ofrece este lugar? (Especialidades)</h2>
            </div>

            <p className="text-xs text-slate-500">
              Platos principales, minutas y comidas destacadas disponibles para pedir o degustar:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {business.offering.map((dish) => (
                <div
                  key={dish}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-950 font-semibold text-xs sm:text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{dish}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Modalidades de Servicio */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              Modalidades de atención
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  business.services.delivery
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    business.services.delivery
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs">Delivery</div>
                  <div className="text-[10px]">
                    {business.services.delivery ? 'A domicilio disponible' : 'No disponible'}
                  </div>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  business.services.takeout
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    business.services.takeout
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs">Para llevar</div>
                  <div className="text-[10px]">
                    {business.services.takeout ? 'Retiro en el local' : 'No disponible'}
                  </div>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  business.services.dineIn
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    business.services.dineIn
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs">En el local</div>
                  <div className="text-[10px]">
                    {business.services.dineIn ? 'Salón / Mesas' : 'Solo delivery/retiro'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Horarios de Atención */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <h2>Horarios de atención</h2>
            </div>

            {business.schedule ? (
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Días habilitados:</span>
                  <span>{business.schedule.days.join(', ')}</span>
                </div>
                {business.schedule.openTime && business.schedule.closeTime && (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Horario:</span>
                    <span>
                      {business.schedule.openTime} a {business.schedule.closeTime} hs
                    </span>
                  </div>
                )}
                {business.schedule.notes && (
                  <p className="text-xs text-slate-500 italic pt-1">{business.schedule.notes}</p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800 block mb-0.5">
                    Horario no especificado de forma fija
                  </span>
                  Consultá la disponibilidad del día directamente a través de WhatsApp.
                </div>
                {business.contact.whatsapp && (
                  <a
                    href={getWhatsAppUrl(business.contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Consultar horario</span>
                  </a>
                )}
              </div>
            )}
          </section>

          {/* Sección de Reseñas Reales Conectadas */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-slate-900 font-bold text-base">Opiniones de la comunidad</h2>
              </div>
              <button
                type="button"
                onClick={handleOpenReviewModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs transition cursor-pointer"
              >
                <PenSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Escribir opinión</span>
              </button>
            </div>

            {/* Cabecera de puntuación */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-3xl font-black text-slate-900">
                {computedRating > 0 ? computedRating.toFixed(1) : 'Nuevo'}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(computedRating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {businessReviews.length > 0
                    ? `${businessReviews.length} ${businessReviews.length === 1 ? 'opinión verificada' : 'opiniones verificadas'} de comensales`
                    : 'Aún no cuenta con opiniones registradas'}
                </div>
              </div>
            </div>

            {/* Listado de Reseñas de este Comercio */}
            <div className="space-y-3 pt-1">
              {businessReviews.length > 0 ? (
                businessReviews.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} showBusinessName={false} />
                ))
              ) : (
                <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Sé el primero en dejar una opinión sobre {business.name}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                      Contale a tus vecinos qué plato probaste y qué tal estuvo la atención.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenReviewModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Dejar una opinión</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Columna Lateral (1 columna): Ubicación, Verificación y Reporte */}
        <div className="space-y-6">
          {/* Ubicación y Mapa */}
          <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <h3>Ubicación física</h3>
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="font-semibold text-slate-800">{business.location.address}</div>
              {business.location.neighborhood && (
                <div>Barrio / Zona: {business.location.neighborhood}</div>
              )}
              <div className="text-slate-400">Bella Unión, Artigas, Uruguay</div>
            </div>

            <a
              href={getGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition border border-blue-200/60 shadow-xs"
            >
              <span>Ver en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </section>

          {/* Bloque de Verificación Oficial */}
          <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verificación de datos</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {business.verified
                ? 'Los datos de este local (teléfono, dirección física y oferta gastronómica) fueron confirmados y verificados para Bella Unión.'
                : 'Este comercio fue registrado por el equipo y se encuentra en etapa de validación telefónica y de ubicación.'}
            </p>
          </section>

          {/* Enlace para Reportar Error */}
          <div className="text-center pt-2">
            <a
              href={`https://wa.me/59891818350?text=${encodeURIComponent(
                `Hola Comida BU, quisiera informar una corrección en los datos de "${business.name}" (ID: ${business.id}): `
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-600 transition"
            >
              <Flag className="w-3 h-3 text-slate-400" />
              <span>¿Datos incorrectos? Informar un error</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal de Nueva Reseña desde el Detalle */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Opinión sobre {business.name}
                </h3>
                <p className="text-xs text-slate-500">Compartí qué consumiste y tu experiencia</p>
              </div>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDetailReview} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label htmlFor="detail-product-input" className="font-bold text-slate-700 block">
                  ¿Qué consumiste o pediste? <span className="text-amber-600 font-semibold">(Plato específico)</span>
                </label>
                <input
                  id="detail-product-input"
                  type="text"
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  placeholder="Ej: Pizza de cuatro quesos, Chivito completo..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 block">Calificación:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      onMouseEnter={() => setFormHoverRating(star)}
                      onMouseLeave={() => setFormHoverRating(0)}
                      className="p-1 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (formHoverRating || formRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-amber-800 text-sm ml-2">
                    {formHoverRating || formRating} de 5 estrellas
                  </span>
                </div>
              </div>

              {/* Identidad del Usuario Autenticado o Campo de Nombre */}
              {currentUser ? (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider block">
                        Opinando como
                      </span>
                      <span className="font-bold text-slate-900 text-xs">{currentUser.name}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Vecino Identificado
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <label htmlFor="detail-user-input" className="font-bold text-slate-700 block">
                    Tu nombre:
                  </label>
                  <input
                    id="detail-user-input"
                    type="text"
                    value={formUserName}
                    onChange={(e) => setFormUserName(e.target.value)}
                    placeholder="Ej: Laura Martínez"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="detail-comment-input" className="font-bold text-slate-700 block">
                  Tu comentario:
                </label>
                <textarea
                  id="detail-comment-input"
                  rows={3}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Contanos sobre la comida, la atención y el tiempo de espera..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Autenticación si intenta opinar como espectador */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsReviewModalOpen(true)
        }}
        title="Iniciar Sesión para Opinar"
        subtitle={`Iniciá sesión o registrate para compartir tu experiencia sobre ${business.name}.`}
      />
    </div>
  )
}
