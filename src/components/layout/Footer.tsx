import { UtensilsCrossed, Heart, MapPin } from 'lucide-react'
import type { TabType } from '../../types'

interface FooterProps {
  onTabChange?: (tab: TabType) => void
}

export function Footer({ onTabChange }: FooterProps) {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 mt-auto text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Columna 1: Branding y Propósito */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-900">
                Comida <span className="text-amber-600">BU</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm">
              Tu guía gastronómica digital en Bella Unión, Artigas, Uruguay. Descubrí qué comer, dónde pedir y cómo contactar a tus locales favoritos.
            </p>
            <div className="flex items-center gap-1 text-slate-400 pt-1">
              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Bella Unión · CP 55100</span>
            </div>
          </div>

          {/* Columna 2: Secciones rápidas */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange?.('inicio')}
                  className="hover:text-amber-600 transition cursor-pointer"
                >
                  Inicio y Destacados
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange?.('explorar')}
                  className="hover:text-amber-600 transition cursor-pointer"
                >
                  Explorar Locales
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange?.('mapa')}
                  className="hover:text-amber-600 transition cursor-pointer"
                >
                  Mapa Gastronómico
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange?.('resenas')}
                  className="hover:text-amber-600 transition cursor-pointer"
                >
                  Reseñas y Recomendaciones
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información y Contacto */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
              Comunidad Gastronómica
            </h4>
            <p className="leading-relaxed">
              ¿Tenés un comercio gastronómico en Bella Unión y querés sumarlo o verificar tus datos?
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 font-medium">
                Próximamente: Registro de Comercios
              </span>
            </div>
          </div>
        </div>

        {/* Barra inferior de Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>© {new Date().getFullYear()} Comida BU. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-red-500 fill-red-500" /> para Bella Unión
          </p>
        </div>
      </div>
    </footer>
  )
}
