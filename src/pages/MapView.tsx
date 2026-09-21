import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Business } from '../types'
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  MessageCircle,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Layers,
} from 'lucide-react'
import { CATEGORIES } from '../data'
import { useBusinesses } from '../context'
import { BusinessDetail } from './BusinessDetail'



// Coordenadas del centro urbano de Bella Unión, Artigas, Uruguay
const BELLA_UNION_CENTER: [number, number] = [-30.276, -57.5997]
const DEFAULT_ZOOM = 15

interface MapViewProps {
  selectedBusinessId?: string | null
  onSelectBusiness?: (id: string | null) => void
}

export function MapView({
  selectedBusinessId: propSelectedId,
  onSelectBusiness: propOnSelect,
}: MapViewProps = {}) {
  const { businesses } = useBusinesses()
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [onlyVerified, setOnlyVerified] = useState(false)

  // Control de selección de local para la ficha de detalle
  const selectedBusinessId = propSelectedId !== undefined ? propSelectedId : internalSelectedId
  const setSelectedBusinessId = propOnSelect || setInternalSelectedId

  const selectedBusiness = useMemo(() => {
    if (!selectedBusinessId) return null
    return (
      businesses.find(
        (b) => b.id === selectedBusinessId || b.slug === selectedBusinessId
      ) || null
    )
  }, [selectedBusinessId, businesses])

  // Filtrar solo negocios que tienen coordenadas válidas dentro del mapa
  const businessesWithCoords = useMemo(() => {
    return businesses.filter(
      (b) =>
        b.location.latitude !== null &&
        b.location.latitude !== undefined &&
        b.location.longitude !== null &&
        b.location.longitude !== undefined
    )
  }, [businesses])


  // Filtrado reactivo según la categoría y verificación seleccionadas
  const visibleBusinesses = useMemo(() => {
    return businessesWithCoords.filter((business) => {
      if (selectedCategory !== 'todos' && !business.categories.includes(selectedCategory)) {
        return false
      }
      if (onlyVerified && !business.verified) {
        return false
      }
      return true
    })
  }, [businessesWithCoords, selectedCategory, onlyVerified])

  // Creador de iconos personalizados con identidad visual Comida BU
  const getCustomMarkerIcon = (business: Business) => {
    return L.divIcon({
      className: 'comida-bu-pin',
      html: `
        <div style="position: relative; width: 38px; height: 38px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35)); cursor: pointer;">
          <div style="
            width: 38px;
            height: 38px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border: 2.5px solid #ffffff;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg style="transform: rotate(45deg); width: 18px; height: 18px; color: #ffffff;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
              <path d="M15 2v20" />
              <path d="M6 2v6a3 3 0 0 0 6 0V2" />
              <path d="M9 2v20" />
            </svg>
          </div>
          ${
            business.verified
              ? `<div style="
                  position: absolute;
                  top: -2px;
                  right: -2px;
                  width: 15px;
                  height: 15px;
                  background: #059669;
                  border: 2px solid #ffffff;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <svg style="width: 8px; height: 8px; color: #ffffff;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>`
              : ''
          }
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -36],
    })
  }

  // Normalización del número de WhatsApp (+598)
  const getWhatsAppUrl = (rawNumber: string, businessName: string): string => {
    const digits = rawNumber.replace(/\D/g, '')
    const formatted = digits.startsWith('0')
      ? `598${digits.slice(1)}`
      : digits.startsWith('598')
      ? digits
      : `598${digits}`
    const greeting = encodeURIComponent(
      `¡Hola ${businessName}! Los encontré en el mapa de Comida BU y quisiera consultarles...`
    )
    return `https://wa.me/${formatted}?text=${greeting}`
  }

  // Si hay un comercio seleccionado, mostramos la ficha de detalle
  if (selectedBusinessId) {
    return (
      <BusinessDetail
        business={selectedBusiness}
        onBack={() => {
          setSelectedBusinessId(null)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    )
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Encabezado y Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center ring-6 ring-amber-500/5 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Mapa Gastronómico
            </h1>
            <p className="text-xs text-slate-500">
              Explorá visualmente los locales de Bella Unión sobre el mapa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{visibleBusinesses.length} locales en el mapa</span>
          </span>
        </div>
      </div>

      {/* Contenedor del Mapa con Barra de Filtros Flotante */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100 h-[calc(100vh-210px)] min-h-[500px] w-full">
        {/* Barra de Filtros Flotante Superior (z-[1000]) */}
        <div className="absolute top-3 left-3 right-3 z-[1000] pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Opción 'Todos' */}
            <button
              type="button"
              onClick={() => setSelectedCategory('todos')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'todos'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Todos ({businessesWithCoords.length})</span>
            </button>

            {/* Toggle Solo Verificados */}
            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                onlyVerified
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verificados</span>
            </button>

            {/* Categorías Principales */}
            {CATEGORIES.map((cat) => {
              const countInMap = businessesWithCoords.filter((b) =>
                b.categories.includes(cat.slug)
              ).length
              if (countInMap === 0) return null

              const isSelected = selectedCategory === cat.slug

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {countInMap}
                  </span>
                </button>
              )
            })}

            {/* Botón para restablecer filtros si hay alguno activo */}
            {(selectedCategory !== 'todos' || onlyVerified) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('todos')
                  setOnlyVerified(false)
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-amber-600 transition cursor-pointer whitespace-nowrap"
                title="Restablecer filtros del mapa"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Instancia del Mapa Leaflet */}
        <MapContainer
          center={BELLA_UNION_CENTER}
          zoom={DEFAULT_ZOOM}
          zoomControl={false}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          {/* Capa de mosaicos OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Control de zoom en la esquina inferior derecha para no tapar filtros */}
          <ZoomControl position="bottomright" />

          {/* Marcadores de los locales gastronómicos */}
          {visibleBusinesses.map((business) => {
            const lat = business.location.latitude!
            const lng = business.location.longitude!

            return (
              <Marker
                key={business.id}
                position={[lat, lng]}
                icon={getCustomMarkerIcon(business)}
              >
                <Popup className="comida-bu-popup" minWidth={240} maxWidth={280}>
                  <div className="p-1 space-y-2 text-slate-800">
                    {/* Cabecera del Popup con nombre y estado */}
                    <div className="flex items-start justify-between gap-1.5 border-b border-slate-100 pb-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">
                          {business.name}
                        </h4>
                        <span className="text-[11px] text-amber-700 font-semibold uppercase tracking-wider">
                          {business.categories.join(' · ')}
                        </span>
                      </div>
                      {business.verified ? (
                        <span
                          className="shrink-0 text-emerald-600 inline-flex items-center"
                          title="Verificado"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span
                          className="shrink-0 text-amber-500 inline-flex items-center"
                          title="En proceso de verificación"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    {/* Dirección */}
                    {business.location.address && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{business.location.address}</span>
                      </div>
                    )}

                    {/* Platos que ofrece */}
                    <div className="flex flex-wrap gap-1">
                      {business.offering.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="text-[10px] font-medium bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Botones de Acción */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                      {business.contact.whatsapp && (
                        <a
                          href={getWhatsAppUrl(business.contact.whatsapp, business.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Pedir por WhatsApp</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedBusinessId(business.id)}
                        className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer"
                      >
                        <span>Ver ficha completa</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>

        {/* Footer flotante en caso de 0 resultados en el mapa */}
        {visibleBusinesses.length === 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200 text-center text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-900">
              No hay locales en el mapa con los filtros seleccionados
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('todos')
                setOnlyVerified(false)
              }}
              className="text-amber-600 font-bold hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Nota sutil de cobertura urbana */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Mapa interactivo con OpenStreetMap</span>
        </span>
        <span>Bella Unión, Artigas · Uruguay</span>
      </div>
    </div>
  )
}
