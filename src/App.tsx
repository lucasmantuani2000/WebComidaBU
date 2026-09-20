import { useState } from 'react'
import type { TabType } from './types'
import { Layout } from './components/layout'
import { CATEGORIES, MOCK_BUSINESSES } from './data'
import {
  Compass,
  Map,
  MessageSquare,
  User,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  AtSign,
  Sparkles,
  Layers,
  Store,
  Tag,
  ArrowRight,
} from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('inicio')

  const verifiedCount = MOCK_BUSINESSES.filter((b) => b.verified).length
  const pendingCount = MOCK_BUSINESSES.length - verifiedCount

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Renderizado condicional según la pestaña activa */}
        {activeTab === 'inicio' && (
          <div className="space-y-6">
            {/* Banner de bienvenida / Estado operativo */}
            <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-10 text-white shadow-lg shadow-amber-500/15 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Layout & Navegación Responsive Activos</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  ¿Qué vas a comer hoy en Bella Unión?
                </h1>
                <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
                  Tu guía gastronómica local para encontrar hamburguesas, pizzas, chivitos, minutas y más en un solo lugar.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('explorar')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-amber-700 font-bold text-xs sm:text-sm hover:bg-amber-50 transition shadow-xs cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explorar Locales</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('mapa')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700/60 hover:bg-amber-700/80 text-white font-semibold text-xs sm:text-sm transition backdrop-blur-sm cursor-pointer"
                  >
                    <Map className="w-4 h-4" />
                    <span>Ver en el Mapa</span>
                  </button>
                </div>
              </div>

              {/* Decoración gráfica de fondo */}
              <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
                <UtensilsCrossed className="w-64 h-64 text-white" />
              </div>
            </div>

            {/* Métricas de conexión de datos mock */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Comercios Activos</span>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-1.5">{MOCK_BUSINESSES.length}</p>
                <span className="text-[11px] text-slate-400">Relevados en Bella Unión</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Categorías</span>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-1.5">{CATEGORIES.length}</p>
                <span className="text-[11px] text-slate-400">Variedades gastronómicas</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verificados</span>
                </div>
                <p className="text-2xl font-black text-emerald-700 mt-1.5">{verifiedCount}</p>
                <span className="text-[11px] text-emerald-600/80">Datos confirmados</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>Por Verificar</span>
                </div>
                <p className="text-2xl font-black text-amber-700 mt-1.5">{pendingCount}</p>
                <span className="text-[11px] text-amber-600/80">En proceso de revisión</span>
              </div>
            </div>

            {/* Categorías Rápidas */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Categorías Principales</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('explorar')}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver todas</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveTab('explorar')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-amber-500/10 hover:text-amber-700 transition cursor-pointer text-slate-700 border border-slate-200/60"
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Listado de Locales (Muestra de integración de datos mock) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-amber-600" />
                    <span>Locales de Bella Unión Conectados</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Modelo de datos y campo "offering" funcionando en la interfaz base
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {MOCK_BUSINESSES.length} locales
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_BUSINESSES.map((business) => (
                  <article
                    key={business.id}
                    className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-amber-300/80 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{business.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{business.description}</p>
                      </div>
                      {business.verified ? (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Verificado
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          Pendiente
                        </span>
                      )}
                    </div>

                    {/* Offering Tags */}
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                        Ofrece:
                      </span>
                      {business.offering.map((item) => (
                        <span
                          key={item}
                          className="text-[10px] font-medium bg-white border border-slate-200/80 text-slate-700 px-2 py-0.5 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Datos de contacto */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      {business.location.address && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {business.location.address}
                        </span>
                      )}
                      {business.contact.whatsapp && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <Phone className="w-3 h-3 shrink-0" />
                          WhatsApp: {business.contact.whatsapp}
                        </span>
                      )}
                      {business.contact.phone && !business.contact.whatsapp && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          Tel: {business.contact.phone}
                        </span>
                      )}
                      {business.contact.instagram && (
                        <span className="inline-flex items-center gap-1 text-pink-700">
                          <AtSign className="w-3 h-3 shrink-0" />@{business.contact.instagram}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder: Explorar */}
        {activeTab === 'explorar' && (
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
              <Compass className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Sección Activa</span>
              <h2 className="text-2xl font-bold text-slate-900">Explorar Gastronomía</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Búsqueda avanzada de platos, filtros por categoría y listado completo de locales de Bella Unión. (Estructura lista para la siguiente fase).
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

        {/* Placeholder: Mapa */}
        {activeTab === 'mapa' && (
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto ring-8 ring-blue-500/5">
              <Map className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Sección Activa</span>
              <h2 className="text-2xl font-bold text-slate-900">Mapa Gastronómico</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Visualización geográfica e interactiva de los puntos gastronómicos de Bella Unión y zonas cercanas.
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

        {/* Placeholder: Reseñas */}
        {activeTab === 'resenas' && (
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto ring-8 ring-purple-500/5">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Sección Activa</span>
              <h2 className="text-2xl font-bold text-slate-900">Reseñas y Recomendaciones</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Opiniones auténticas y experiencias gastronómicas compartidas por vecinos y visitantes.
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

        {/* Placeholder: Perfil */}
        {activeTab === 'perfil' && (
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Sección Activa</span>
              <h2 className="text-2xl font-bold text-slate-900">Mi Cuenta & Registro</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Gestión de favoritos, preferencias y registro/verificación de locales gastronómicos en Bella Unión.
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
