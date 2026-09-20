import type { TabType } from '../../types'
import { UtensilsCrossed, MapPin, User, Compass, Home, Map, MessageSquare } from 'lucide-react'

interface HeaderProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const DESKTOP_NAV_ITEMS: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'explorar', label: 'Explorar', icon: Compass },
  { id: 'mapa', label: 'Mapa', icon: Map },
  { id: 'resenas', label: 'Reseñas', icon: MessageSquare },
]

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e isotipo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onTabChange('inicio')}
              className="flex items-center gap-2.5 text-left group transition focus:outline-none cursor-pointer"
              aria-label="Ir al inicio de Comida BU"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 leading-tight block">
                  Comida <span className="text-amber-600">BU</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                  Bella Unión, Artigas
                </span>
              </div>
            </button>

            {/* Ubicación visible en mobile compacto */}
            <div className="sm:hidden flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-full">
              <MapPin className="w-2.5 h-2.5 text-amber-600 shrink-0" />
              <span>Bella Unión</span>
            </div>
          </div>

          {/* Navegación Desktop (>= 768px) */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
            {DESKTOP_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Botón de Perfil / Cuenta */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onTabChange('perfil')}
              className={`flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'perfil'
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
              aria-label="Acceder al perfil"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Mi Cuenta</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
