import { useState, useMemo } from 'react'
import type { Business } from '../types'
import {
  Compass,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Bike,
  ShoppingBag,
  Store,
  ShieldCheck,
  RotateCcw,
  UtensilsCrossed,
} from 'lucide-react'
import { CATEGORIES, MOCK_BUSINESSES } from '../data'
import { BusinessCard } from '../components/common'
import { normalizeText } from '../utils'
import { BusinessDetail } from './BusinessDetail'

type SortOption = 'destacados' | 'nombre-asc' | 'nombre-desc' | 'rating-desc' | 'reviews-desc'

interface ExploreProps {
  selectedBusinessId?: string | null
  onSelectBusiness?: (id: string | null) => void
}

export function Explore({
  selectedBusinessId: propSelectedId,
  onSelectBusiness: propOnSelect,
}: ExploreProps = {}) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [filterDelivery, setFilterDelivery] = useState(false)
  const [filterTakeout, setFilterTakeout] = useState(false)
  const [filterDineIn, setFilterDineIn] = useState(false)
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('destacados')

  // Soporta control de selección interno o externo
  const selectedBusinessId = propSelectedId !== undefined ? propSelectedId : internalSelectedId
  const setSelectedBusinessId = propOnSelect || setInternalSelectedId

  // Comercio seleccionado para detalle
  const selectedBusiness = useMemo(() => {
    if (!selectedBusinessId) return null
    return (
      MOCK_BUSINESSES.find(
        (b) => b.id === selectedBusinessId || b.slug === selectedBusinessId
      ) || null
    )
  }, [selectedBusinessId])

  // Filtrado y ordenamiento combinado en tiempo real
  const filteredAndSortedBusinesses = useMemo(() => {
    const normQuery = normalizeText(searchQuery)

    // 1. Filtrado
    const filtered = MOCK_BUSINESSES.filter((business) => {
      // Filtro por categoría seleccionada
      if (selectedCategory !== 'todos') {
        if (!business.categories.includes(selectedCategory)) {
          return false
        }
      }

      // Filtros por modalidad de servicio
      if (filterDelivery && !business.services.delivery) return false
      if (filterTakeout && !business.services.takeout) return false
      if (filterDineIn && !business.services.dineIn) return false

      // Filtro por estado de verificación
      if (filterVerifiedOnly && !business.verified) return false

      // Búsqueda textual reactiva (nombre, categorías, offering y descripción)
      if (normQuery) {
        const matchName = normalizeText(business.name).includes(normQuery)
        const matchCat = business.categories.some((cat) => normalizeText(cat).includes(normQuery))
        const matchOffering = business.offering.some((dish) =>
          normalizeText(dish).includes(normQuery)
        )
        const matchDesc = normalizeText(business.description).includes(normQuery)

        if (!matchName && !matchCat && !matchOffering && !matchDesc) {
          return false
        }
      }

      return true
    })

    // 2. Ordenamiento
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nombre-asc':
          return a.name.localeCompare(b.name)
        case 'nombre-desc':
          return b.name.localeCompare(a.name)
        case 'rating-desc':
          if (b.rating !== a.rating) return b.rating - a.rating
          return a.name.localeCompare(b.name)
        case 'reviews-desc':
          if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount
          return a.name.localeCompare(b.name)
        case 'destacados':
        default:
          if (a.verified !== b.verified) return a.verified ? -1 : 1
          return a.name.localeCompare(b.name)
      }
    })
  }, [
    searchQuery,
    selectedCategory,
    filterDelivery,
    filterTakeout,
    filterDineIn,
    filterVerifiedOnly,
    sortBy,
  ])

  // Contabilizador de filtros activos
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== 'todos') count++
    if (filterDelivery) count++
    if (filterTakeout) count++
    if (filterDineIn) count++
    if (filterVerifiedOnly) count++
    if (searchQuery.trim() !== '') count++
    if (sortBy !== 'destacados') count++
    return count
  }, [
    selectedCategory,
    filterDelivery,
    filterTakeout,
    filterDineIn,
    filterVerifiedOnly,
    searchQuery,
    sortBy,
  ])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('todos')
    setFilterDelivery(false)
    setFilterTakeout(false)
    setFilterDineIn(false)
    setFilterVerifiedOnly(false)
    setSortBy('destacados')
  }

  const handleSelect = (business: Business) => {
    setSelectedBusinessId(business.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setSelectedBusinessId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Si hay un comercio seleccionado, mostramos la ficha de detalle
  if (selectedBusinessId) {
    return <BusinessDetail business={selectedBusiness} onBack={handleBack} />
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Encabezado de Sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center ring-8 ring-amber-500/5 shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explorar Locales
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Directorio gastronómico completo con filtros avanzados de Bella Unión
            </p>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 text-xs font-semibold transition cursor-pointer self-start sm:self-auto border border-slate-200/60 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar filtros ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Barra de Búsqueda Principal */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por local, plato (ej: chivitos, fainá) o especialidad..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm font-medium shadow-xs focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Limpiar texto de búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Panel de Controles y Filtros */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Fila 1: Selectores de Categoría y Criterio de Orden */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Selector de Categorías */}
          <div className="space-y-1.5">
            <label
              htmlFor="category-select"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>Categoría</span>
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition cursor-pointer"
            >
              <option value="todos">Todas las categorías ({MOCK_BUSINESSES.length})</option>
              {CATEGORIES.map((cat) => {
                const count = MOCK_BUSINESSES.filter((b) => b.categories.includes(cat.slug)).length
                return (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({count})
                  </option>
                )
              })}
            </select>
          </div>

          {/* Selector de Criterio de Orden */}
          <div className="space-y-1.5">
            <label
              htmlFor="sort-select"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
              <span>Ordenar por</span>
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition cursor-pointer"
            >
              <option value="destacados">Destacados (Verificados primero)</option>
              <option value="nombre-asc">Nombre: A a la Z</option>
              <option value="nombre-desc">Nombre: Z a la A</option>
              <option value="rating-desc">Mayor valoración</option>
              <option value="reviews-desc">Más opiniones</option>
            </select>
          </div>
        </div>

        {/* Fila 2: Chips de Modalidad de Servicio y Verificación */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Filtrar por servicios y estado
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Delivery */}
            <button
              type="button"
              onClick={() => setFilterDelivery(!filterDelivery)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterDelivery
                  ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Con Delivery</span>
            </button>

            {/* Toggle Retiro / Para llevar */}
            <button
              type="button"
              onClick={() => setFilterTakeout(!filterTakeout)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterTakeout
                  ? 'bg-amber-600 text-white shadow-xs shadow-amber-600/30'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Para llevar (Retiro)</span>
            </button>

            {/* Toggle En el local */}
            <button
              type="button"
              onClick={() => setFilterDineIn(!filterDineIn)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterDineIn
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/30'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Comer en el local</span>
            </button>

            {/* Toggle Solo Verificados */}
            <button
              type="button"
              onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterVerifiedOnly
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Solo verificados</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de Resultados y Contador */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800">
            {filteredAndSortedBusinesses.length === 1
              ? '1 lugar disponible'
              : `${filteredAndSortedBusinesses.length} lugares disponibles`}
          </span>
          {activeFilterCount > 0 && (
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              {activeFilterCount} filtros activos
            </span>
          )}
        </div>

        <span className="text-xs text-slate-400">Bella Unión, Artigas</span>
      </div>

      {/* Grid de Comercios o Empty State */}
      {filteredAndSortedBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredAndSortedBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} onSelect={handleSelect} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
            <UtensilsCrossed className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              No encontramos locales con esos criterios
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              Probá desmarcando algún filtro de servicio o buscando con otro término gastronómico.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpiar todos los filtros</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
