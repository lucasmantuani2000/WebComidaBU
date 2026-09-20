import type { TabType } from '../../types'
import { Home, Compass, Map, MessageSquare, User } from 'lucide-react'

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const BOTTOM_NAV_ITEMS: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'explorar', label: 'Explorar', icon: Compass },
  { id: 'mapa', label: 'Mapa', icon: Map },
  { id: 'resenas', label: 'Reseñas', icon: MessageSquare },
  { id: 'perfil', label: 'Perfil', icon: User },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-lg shadow-slate-900/5 transition-all"
      aria-label="Navegación inferior móvil"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className="group relative flex flex-col items-center justify-center h-full w-full focus:outline-none transition-transform active:scale-95 cursor-pointer"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Contenedor del ícono con pill activa */}
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-600 scale-105'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'stroke-[2.5px] text-amber-600' : 'stroke-[1.75px]'
                  }`}
                />
              </div>

              {/* Etiqueta textual concisa */}
              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-all duration-200 ${
                  isActive
                    ? 'font-bold text-amber-600 scale-100'
                    : 'font-medium text-slate-500 group-hover:text-slate-700'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
