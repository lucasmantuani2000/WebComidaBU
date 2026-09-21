import { useState } from 'react'
import type { Business } from '../../types'
import {
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  AtSign,
  Bike,
  Store,
  ShoppingBag,
  UtensilsCrossed,
  MessageCircle,
  ChevronRight,
  Heart,
} from 'lucide-react'
import { useFavorites } from '../../context'

interface BusinessCardProps {
  business: Business
  onSelect?: (business: Business) => void
}

export function BusinessCard({ business, onSelect }: BusinessCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFav = isFavorite(business.id)
  const [imgError, setImgError] = useState(false)


  // Normalización del número de WhatsApp uruguayo para enlace wa.me
  const getWhatsAppUrl = (rawNumber: string): string => {
    const digits = rawNumber.replace(/\D/g, '')
    const formatted = digits.startsWith('0')
      ? `598${digits.slice(1)}`
      : digits.startsWith('598')
      ? digits
      : `598${digits}`
    const greeting = encodeURIComponent(
      `¡Hola ${business.name}! Los encontré en Comida BU y quisiera consultarles...`
    )
    return `https://wa.me/${formatted}?text=${greeting}`
  }

  const handleCardClick = () => {
    onSelect?.(business)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
      aria-label={`Ver ficha completa de ${business.name}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-400/80 transition-all duration-300 hover:scale-[1.01] cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
    >
      {/* Portada / Media */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {!imgError && business.coverImage ? (
          <img
            src={business.coverImage}
            alt={business.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 text-amber-700">
            <UtensilsCrossed className="w-10 h-10 opacity-70" />
            <span className="text-xs font-semibold mt-1 opacity-80">{business.name}</span>
          </div>
        )}

        {/* Gradiente de superposición sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/20 pointer-events-none" />

        {/* Badge de verificación superior izquierdo */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {business.verified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600/90 text-white backdrop-blur-md shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verificado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-600/85 text-white backdrop-blur-md shadow-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              Por verificar
            </span>
          )}
        </div>

        {/* Acciones y rango de precio superior derecho */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {business.priceRange && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-slate-800 backdrop-blur-md shadow-xs">
              {business.priceRange}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(business.id)
            }}
            onKeyDown={(e) => e.stopPropagation()}
            aria-label={isFav ? `Quitar ${business.name} de favoritos` : `Guardar ${business.name} en favoritos`}
            title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-xs cursor-pointer active:scale-90 ${
              isFav
                ? 'bg-white text-rose-500 hover:bg-rose-50'
                : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all duration-200 ${
                isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
          </button>
        </div>


        {/* Modalidades de servicio sobre la imagen */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5 flex-wrap">
          {business.services.delivery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-white backdrop-blur-md">
              <Bike className="w-3 h-3 text-amber-400" />
              Delivery
            </span>
          )}
          {business.services.takeout && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-white backdrop-blur-md">
              <ShoppingBag className="w-3 h-3 text-amber-400" />
              Retiro
            </span>
          )}
          {business.services.dineIn && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-white backdrop-blur-md">
              <Store className="w-3 h-3 text-amber-400" />
              En el local
            </span>
          )}
        </div>
      </div>

      {/* Contenido / Información */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Categorías y CTA sutil */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              {business.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/60"
                >
                  {cat}
                </span>
              ))}
            </div>

            <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Ver ficha</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Nombre y descripción */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              {business.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {business.description}
            </p>
          </div>

          {/* Regla clave: Offering (Qué ofrece) */}
          <div className="pt-1">
            <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <UtensilsCrossed className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Platos destacados:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {business.offering.map((dish) => (
                <span
                  key={dish}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 group-hover:bg-amber-100/70 group-hover:text-amber-900 transition-colors"
                >
                  {dish}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ubicación y Canales de Contacto Directo */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          {business.location.address && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{business.location.address}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-0.5">
            {/* Botón WhatsApp prioritario si existe (con stopPropagation) */}
            {business.contact.whatsapp ? (
              <a
                href={getWhatsAppUrl(business.contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
                aria-label={`Pedir por WhatsApp a ${business.name}`}
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>Pedir por WhatsApp</span>
              </a>
            ) : business.contact.phone ? (
              <a
                href={`tel:${business.contact.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
                aria-label={`Llamar a ${business.name}`}
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Llamar ({business.contact.phone})</span>
              </a>
            ) : (
              <div className="flex-1 py-2 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-xl">
                Atención en el local
              </div>
            )}

            {/* Enlace Instagram si existe (con stopPropagation) */}
            {business.contact.instagram && (
              <a
                href={`https://instagram.com/${business.contact.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50 transition active:scale-95 shrink-0 cursor-pointer"
                aria-label={`Instagram de ${business.name}`}
                title={`@${business.contact.instagram}`}
              >
                <AtSign className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
