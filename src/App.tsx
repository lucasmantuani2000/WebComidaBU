import { useState } from 'react'
import type { TabType } from './types'
import { Layout } from './components/layout'
import { Home } from './pages'
import { Compass, Map, MessageSquare, User } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('inicio')

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Pestaña Inicio: Experiencia Home de Descubrimiento */}
        {activeTab === 'inicio' && <Home />}

        {/* Pestaña Explorar */}
        {activeTab === 'explorar' && (
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
              <Compass className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Sección en Desarrollo</span>
              <h2 className="text-2xl font-bold text-slate-900">Explorar Gastronomía</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Próximamente: filtros combinados, ordenamiento por precio o cercanía y vista detallada por tipos de cocina.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('inicio')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Volver a Inicio
              </button>
            </div>
          </section>
        )}

        {/* Pestaña Mapa */}
        {activeTab === 'mapa' && (
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto ring-8 ring-blue-500/5">
              <Map className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Sección en Desarrollo</span>
              <h2 className="text-2xl font-bold text-slate-900">Mapa Gastronómico</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Próximamente: mapa interactivo con la ubicación geográfica de los comercios de Bella Unión y rutas de llegada.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('inicio')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Volver a Inicio
              </button>
            </div>
          </section>
        )}

        {/* Pestaña Reseñas */}
        {activeTab === 'resenas' && (
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto ring-8 ring-purple-500/5">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Sección en Desarrollo</span>
              <h2 className="text-2xl font-bold text-slate-900">Reseñas y Recomendaciones</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Próximamente: opiniones reales de la comunidad, puntuaciones y experiencias compartidas sobre los platos locales.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('inicio')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Volver a Inicio
              </button>
            </div>
          </section>
        )}

        {/* Pestaña Perfil */}
        {activeTab === 'perfil' && (
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Sección en Desarrollo</span>
              <h2 className="text-2xl font-bold text-slate-900">Mi Cuenta & Registro</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Próximamente: favoritos guardados, preferencias y formulario para sumar o verificar un nuevo comercio gastronómico.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('inicio')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Volver a Inicio
              </button>
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}
