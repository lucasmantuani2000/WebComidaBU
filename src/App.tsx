import {
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
} from 'lucide-react'

import { CATEGORIES, MOCK_BUSINESSES } from './data'

export default function App() {
  const verifiedCount = MOCK_BUSINESSES.filter((b) => b.verified).length
  const pendingCount = MOCK_BUSINESSES.length - verifiedCount

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-8 antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header de Smoke Test */}
        <header className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center ring-8 ring-amber-500/5 shrink-0">
                <UtensilsCrossed className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 mb-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>Bella Unión, Artigas, Uruguay</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Comida BU
                </h1>
                <p className="text-sm text-slate-500">
                  Guía Gastronómica Digital — Modelo de Dominio y Mocks Verificados
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-medium px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>TypeScript & Mocks Activos</span>
            </div>
          </div>

          {/* Métricas del Smoke Test */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>Comercios Mocks</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">{MOCK_BUSINESSES.length}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Categorías</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">{CATEGORIES.length}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verificados</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{verifiedCount}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 text-amber-600 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Por Verificar</span>
              </div>
              <p className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</p>
            </div>
          </div>
        </header>

        {/* Categorías Registradas */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>Categorías del Dominio ({CATEGORIES.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
              >
                <span>{cat.name}</span>
                <span className="text-slate-400 font-mono text-[10px]">({cat.slug})</span>
              </span>
            ))}
          </div>
        </section>

        {/* Listado de Negocios Mock */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-600" />
              <span>Locales Relevados de Bella Unión</span>
            </h2>
            <span className="text-xs text-slate-400">Datos reales comprobados</span>
          </div>

          <div className="divide-y divide-slate-100">
            {MOCK_BUSINESSES.map((business) => (
              <article key={business.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-slate-900">{business.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">({business.slug})</span>
                    {business.priceRange && (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {business.priceRange}
                      </span>
                    )}
                  </div>

                  <div>
                    {business.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Pendiente de verificación
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600">{business.description}</p>

                {/* Categorías */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-medium text-slate-400">Categorías:</span>
                  {business.categories.map((catSlug) => (
                    <span
                      key={catSlug}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]"
                    >
                      {catSlug}
                    </span>
                  ))}
                </div>

                {/* Regla clave: Offering */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                  <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                    Ofrece (Offering):
                  </span>
                  {business.offering.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded-full bg-amber-100/60 text-amber-900 text-[11px] font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Datos de contacto y ubicación */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                  {business.location.address && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {business.location.address}
                    </span>
                  )}
                  {business.contact.whatsapp && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <Phone className="w-3 h-3" />
                      WhatsApp: {business.contact.whatsapp}
                    </span>
                  )}
                  {business.contact.phone && !business.contact.whatsapp && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      Tel: {business.contact.phone}
                    </span>
                  )}
                  {business.contact.instagram && (
                    <span className="inline-flex items-center gap-1 text-pink-700">
                      <AtSign className="w-3 h-3" />@{business.contact.instagram}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Footer de Estado */}
        <footer className="text-center text-xs text-slate-400 flex items-center justify-center gap-2 py-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Comida BU — Modelo de datos tipado y verificado en TypeScript</span>
        </footer>
      </div>
    </main>
  )
}
