import { useState, useMemo } from 'react'
import type { Business } from '../types'
import {
  Search,
  X,
  Sparkles,
  UtensilsCrossed,
  RotateCcw,
  Store,
  Beef,
  Pizza,
  Utensils,
  Flame,
  Zap,
  ShoppingBag,
  Coffee,
  IceCreamCone,
  Croissant,
  CookingPot,
} from 'lucide-react'
import { CATEGORIES, MOCK_BUSINESSES } from '../data'
import { BusinessCard } from '../components/common'
import { normalizeText } from '../utils'
import { BusinessDetail } from './BusinessDetail'

const CATEGORY_ICONS: Record<string, typeof UtensilsCrossed> = {
  Beef,
  Pizza,
  Utensils,
  Flame,
  Zap,
  ShoppingBag,
  UtensilsCrossed,
  Coffee,
  IceCreamCone,
  Croissant,
  CookingPot,
}

interface HomeProps {
  selectedBusinessId?: string | null
  onSelectBusiness?: (id: string | null) => void
}

export function Home({
  selectedBusinessId: propSelectedId,
  onSelectBusiness: propOnSelect,
}: HomeProps = {}) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')

  // Soporta control de estado interno o externo vía props
  const selectedBusinessId = propSelectedId !== undefined ? propSelectedId : internalSelectedId
  const setSelectedBusinessId = propOnSelect || setInternalSelectedId

  // Comercio actualmente seleccionado para la vista de detalle
  const selectedBusiness = useMemo(() => {
    if (!selectedBusinessId) return null
    return (
      MOCK_BUSINESSES.find(
        (b) => b.id === selectedBusinessId || b.slug === selectedBusinessId
      ) || null
    )
  }, [selectedBusinessId])

  // Filtrado reactivo en tiempo real con normalización de tildes y mayúsculas
  const filteredBusinesses = useMemo(() => {
    const normQuery = normalizeText(searchQuery)

    return MOCK_BUSINESSES.filter((business) => {
      // 1. Filtro por categoría seleccionada
      if (selectedCategory !== 'todos') {
        const matchesCategory = business.categories.includes(selectedCategory)
        if (!matchesCategory) return false
      }

      // 2. Filtro por búsqueda textual
      if (!normQuery) return true

      // Coincidencia en nombre del negocio
      if (normalizeText(business.name).includes(normQuery)) return true

      // Coincidencia en categorías asociadas
      if (business.categories.some((cat) => normalizeText(cat).includes(normQuery))) {
        return true
      }

      // REGLA CLAVE: Coincidencia en platos de offering (ej: 'papas fritas', 'calzones', 'chivitos')
      if (business.offering.some((dish) => normalizeText(dish).includes(normQuery))) {
        return true
      }

      // Coincidencia en descripción
      if (normalizeText(business.description).includes(normQuery)) {
        return true
      }

      return false
    })
  }, [searchQuery, selectedCategory])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('todos')
  }

  const handleSelect = (business: Business) => {
    setSelectedBusinessId(business.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setSelectedBusinessId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isFiltering = searchQuery.trim() !== '' || selectedCategory !== 'todos'

  // Si hay un comercio seleccionado, mostramos la Ficha de Detalle completa
  if (selectedBusinessId) {
    return <BusinessDetail business={selectedBusiness} onBack={handleBack} />
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-6 sm:p-10 text-white shadow-xl shadow-amber-500/15">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Guía Gastronómica de Bella Unión</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            ¿Qué tenés ganas de comer hoy?
          </h1>

          <p className="text-amber-100 text-sm sm:text-base leading-relaxed max-w-xl">
            Descubrí los mejores lugares de comida, pizzerías, rotiserías, carritos y restaurantes en Bella Unión.
          </p>

          {/* Buscador Integrado en Hero */}
          <div className="pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscá por local, categoría o plato (ej: papas fritas, pizza, chivito)..."
                className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium shadow-md shadow-black/10 focus:outline-none focus:ring-4 focus:ring-white/40 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Isotipo decorativo de fondo */}
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <UtensilsCrossed className="w-72 h-72 text-white" />
        </div>
      </section>

      {/* Filtros Rápidos de Categorías (Pills con scroll horizontal fluido) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Categorías populares
          </h2>
          {selectedCategory !== 'todos' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('todos')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              Restablecer
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Opción 'Todos' */}
          <button
            type="button"
            onClick={() => setSelectedCategory('todos')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'todos'
                ? 'bg-amber-600 text-white shadow-xs shadow-amber-600/30 scale-100'
                : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Todos</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'todos'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {MOCK_BUSINESSES.length}
            </span>
          </button>

          {/* Categorías Predefinidas */}
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon] || UtensilsCrossed
            const isSelected = selectedCategory === category.slug
            const countForCat = MOCK_BUSINESSES.filter((b) =>
              b.categories.includes(category.slug)
            ).length

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.slug)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs shadow-amber-600/30 scale-100'
                    : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-600'}`} />
                <span>{category.name}</span>
                {countForCat > 0 && (
                  <span
                    className={`ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {countForCat}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Listado de Comercios */}
      <section className="space-y-4">
        {/* Cabecera del Listado con Contador */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-600 shrink-0" />
            <h2 className="text-lg font-bold text-slate-900">
              {selectedCategory === 'todos'
                ? 'Todos los locales'
                : `Locales de ${CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}`}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredBusinesses.length}
            </span>
          </div>

          {isFiltering && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 transition cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        {/* Feedback visual de búsqueda por término */}
        {searchQuery.trim() && (
          <div className="text-xs text-slate-500 bg-amber-50/70 border border-amber-200/60 px-3.5 py-2 rounded-xl flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              Resultados para:{' '}
              <strong className="text-slate-800">"{searchQuery}"</strong> (buscando en nombres, categorías y platos de offering)
            </span>
          </div>
        )}

        {/* Grid de Tarjetas o Empty State */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} onSelect={handleSelect} />
            ))}
          </div>
        ) : (
          /* Estado Vacío Elegante (Empty State) */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
              <UtensilsCrossed className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                No encontramos lugares con esa comida
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                No hay locales que coincidan con{' '}
                {searchQuery ? `"${searchQuery}"` : 'la categoría seleccionada'}. Probá buscando
                otro plato o restablecé los filtros para ver todas las opciones.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restablecer búsqueda</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
