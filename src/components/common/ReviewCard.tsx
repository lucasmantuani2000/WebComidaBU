import type { Review } from '../../types'
import { Star, CheckCircle2, UtensilsCrossed, Store, ChevronRight } from 'lucide-react'

interface ReviewCardProps {
  review: Review
  onSelectBusiness?: (businessId: string) => void
  showBusinessName?: boolean
}

export function ReviewCard({
  review,
  onSelectBusiness,
  showBusinessName = true,
}: ReviewCardProps) {
  // Generar iniciales para el avatar en caso de no tener imagen
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <article className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300/80 transition-all space-y-3.5">
      {/* Cabecera del Usuario y Valoración */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar / Iniciales */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            {review.userAvatar ? (
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              getInitials(review.userName)
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                {review.userName}
              </h4>
              {review.verifiedVisit && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Consumo verificado</span>
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">{review.date}</span>
          </div>
        </div>

        {/* Estrellas de Calificación */}
        <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
              }`}
            />
          ))}
          <span className="ml-1 text-xs font-bold text-amber-800">{review.rating}.0</span>
        </div>
      </div>

      {/* Regla Clave: Qué consumió el usuario */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/70 rounded-xl px-3.5 py-2 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
          <UtensilsCrossed className="w-3.5 h-3.5" />
        </div>
        <div className="text-xs">
          <span className="font-semibold text-amber-800">Consumió: </span>
          <span className="font-bold text-amber-950">{review.productConsumed}</span>
        </div>
      </div>

      {/* Comentario del usuario */}
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {review.comment}
      </p>

      {/* Comercio Asociado (con botón para abrir detalle) */}
      {showBusinessName && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSelectBusiness?.(review.businessId)}
            className="group/btn inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 transition cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{review.businessName}</span>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          <span className="text-[11px] text-slate-400 font-medium">Bella Unión</span>
        </div>
      )}
    </article>
  )
}
