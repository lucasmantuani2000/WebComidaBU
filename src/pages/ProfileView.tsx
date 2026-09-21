import { useState, useMemo } from 'react'
import type { TabType } from '../types'
import {
  User as UserIcon,
  Mail,
  Calendar,
  LogOut,
  Star,
  MessageSquare,
  Store,
  Sparkles,
  ShieldCheck,
  Heart,
  HeartOff,
  UtensilsCrossed,
  ArrowRight,
  LogIn,
  UserPlus,
} from 'lucide-react'
import { useAuth, useReviews, useFavorites, useBusinesses } from '../context'
import { ReviewCard, BusinessCard, AuthModal } from '../components/common'
import { normalizeText } from '../utils'
import { BusinessDetail } from './BusinessDetail'



export interface ProfileViewProps {
  onNavigateToTab?: (tab: TabType) => void
  onSelectBusiness?: (id: string | null) => void
}

export function ProfileView({ onNavigateToTab, onSelectBusiness: propOnSelectBusiness }: ProfileViewProps) {
  const { currentUser, isAuthenticated, logout, loginAsDemoUser } = useAuth()
  const { reviews } = useReviews()
  const { favorites, favoritesCount } = useFavorites()
  const { businesses } = useBusinesses()

  // Pestaña activa dentro del perfil: 'resenas' | 'favoritos'
  const [activeProfileTab, setActiveProfileTab] = useState<'resenas' | 'favoritos'>('resenas')

  // Estado para el modal de autenticación si se invoca desde el perfil de invitado
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // Estado de confirmación de cierre de sesión
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Control de selección de negocio para la Ficha de Detalle
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null)

  const handleSelectBusiness = (id: string | null) => {
    if (propOnSelectBusiness) {
      propOnSelectBusiness(id)
    } else {
      setSelectedBusinessId(id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const selectedBusiness = useMemo(() => {
    if (!selectedBusinessId) return null
    return (
      businesses.find(
        (b) => b.id === selectedBusinessId || b.slug === selectedBusinessId
      ) || null
    )
  }, [selectedBusinessId, businesses])

  // Reseñas del usuario actual
  const userReviews = useMemo(() => {
    if (!currentUser) return []
    return reviews.filter(
      (r) =>
        (r.userId && r.userId === currentUser.id) ||
        normalizeText(r.userName) === normalizeText(currentUser.name)
    )
  }, [reviews, currentUser])

  // Comercios marcados como favoritos
  const favoriteBusinesses = useMemo(() => {
    return businesses.filter((b) => favorites.includes(b.id))
  }, [businesses, favorites])


  // Métricas del usuario
  const userStats = useMemo(() => {
    const total = userReviews.length
    if (total === 0) {
      return { total: 0, average: '0.0', uniquePlaces: 0 }
    }
    const sum = userReviews.reduce((acc, r) => acc + r.rating, 0)
    const average = (sum / total).toFixed(1)
    const uniquePlaces = new Set(userReviews.map((r) => r.businessId)).size
    return { total, average, uniquePlaces }
  }, [userReviews])

  // Obtener iniciales para el avatar
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  // Si hay un negocio seleccionado desde una reseña o tarjeta de favoritos, mostramos la ficha de detalle
  if (selectedBusinessId && selectedBusiness) {
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

  // Renderizado común del selector de pestañas (Mis Reseñas / Lugares Guardados)
  const renderTabSwitcher = () => (
    <div className="flex items-center gap-2 border-b border-slate-200/80 pb-px">
      <button
        type="button"
        onClick={() => setActiveProfileTab('resenas')}
        className={`flex items-center gap-2 py-3 px-4 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition cursor-pointer ${
          activeProfileTab === 'resenas'
            ? 'border-amber-600 text-amber-600'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        <span>Mis Reseñas</span>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
            activeProfileTab === 'resenas'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {userReviews.length}
        </span>
      </button>

      <button
        type="button"
        onClick={() => setActiveProfileTab('favoritos')}
        className={`flex items-center gap-2 py-3 px-4 sm:px-5 font-bold text-xs sm:text-sm border-b-2 transition cursor-pointer ${
          activeProfileTab === 'favoritos'
            ? 'border-rose-500 text-rose-600'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        }`}
      >
        <Heart
          className={`w-4 h-4 ${
            activeProfileTab === 'favoritos' ? 'fill-rose-500 text-rose-500' : ''
          }`}
        />
        <span>Lugares Guardados</span>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
            activeProfileTab === 'favoritos'
              ? 'bg-rose-100 text-rose-800'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {favoritesCount}
        </span>
      </button>
    </div>
  )

  // Renderizado común de la sección de Favoritos
  const renderFavoritesSection = () => (
    <section className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Lugares Guardados
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {favoritesCount} {favoritesCount === 1 ? 'comercio guardado' : 'comercios guardados'}
        </span>
      </div>

      {favoriteBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {favoriteBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onSelect={(b) => handleSelectBusiness(b.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State elegante de Favoritos */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 text-center space-y-4 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto ring-8 ring-rose-500/10">
            <HeartOff className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Aún no guardaste lugares favoritos
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Guardá tus carritos, pizzerías y restós preferidos tocando el corazón en las tarjetas o en la ficha de detalle.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigateToTab?.('explorar')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm transition cursor-pointer shadow-xs"
            >
              <Store className="w-4 h-4" />
              <span>Explorar comercios</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab?.('inicio')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <span>Ir al Inicio</span>
            </button>
          </div>
        </div>
      )}
    </section>
  )

  // --- VISTA 1: MODO ESPECTADOR (Invitado no autenticado) ---
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Banner Hero para Invitados */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-amber-500/15 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto shadow-inner ring-8 ring-white/10">
            <UserIcon className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Modo Espectador Activo</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tu Espacio Gastronómico en Bella Unión
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Podés explorar locales, menús y mapa libremente. Al iniciar sesión vas a poder calificar tus platos favoritos y participar en la comunidad.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login')
                setIsAuthModalOpen(true)
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-amber-600" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register')
                setIsAuthModalOpen(true)
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-700/60 hover:bg-amber-700/80 text-white font-bold text-sm border border-white/20 transition active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <UserPlus className="w-4 h-4 text-amber-200" />
              <span>Crear Cuenta</span>
            </button>
          </div>
        </div>

        {/* Acceso rápido de prueba */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>¿Querés probar las funciones de usuario ahora mismo?</span>
          </div>
          <div>
            <button
              type="button"
              onClick={loginAsDemoUser}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <span>Ingresar como usuario de prueba (Martín Silva)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Control de pestañas interno */}
        {renderTabSwitcher()}

        {/* Contenido según la pestaña activa */}
        {activeProfileTab === 'favoritos' ? (
          renderFavoritesSection()
        ) : (
          /* Tarjetas de Beneficios en pestaña Reseñas para invitados */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Opiná sobre platos</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Contá qué pediste, qué tal estuvo la porción y ayudá a otros vecinos a elegir qué comer.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Consumo Verificado</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tus opiniones llevan la insignia de consumo local, aportando confianza y valor a la comunidad.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Apoyo a Locales</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dale visibilidad a carritos, pizzerías, restós y rotiserías de los diferentes barrios de Bella Unión.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Autenticación */}
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    )
  }

  // --- VISTA 2: USUARIO AUTENTICADO ---
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Cabecera del Perfil */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Avatar estilizado con gradiente */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md shadow-amber-500/20 shrink-0">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                getInitials(currentUser.name)
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {currentUser.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Vecino Verificado</span>
                </span>
                {currentUser.id === 'usr-martin-silva' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                    <span>Modo Demo</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <span>Cuenta Supabase</span>
                  </span>
                )}
              </div>


              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Miembro desde {currentUser.createdAt}
                </span>
              </div>
            </div>
          </div>

          {/* Botón Cerrar Sesión */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-600 font-semibold text-xs transition cursor-pointer self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Confirmación sutil de Logout */}
        {showLogoutConfirm && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="text-xs text-amber-900">
              <strong className="block text-sm">¿Confirmás cerrar tu sesión?</strong>
              Podrás seguir navegando por Bella Unión en modo espectador.
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout()
                  setShowLogoutConfirm(false)
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer transition shadow-xs"
              >
                Sí, cerrar sesión
              </button>

            </div>
          </div>
        )}

        {/* Métricas de Actividad del Usuario */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-200/60">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Opiniones
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{userStats.total}</div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-200/60">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Guardados
            </div>
            <div className="text-2xl font-black text-rose-600 mt-1 flex items-center justify-center gap-1">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <span>{favoritesCount}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-200/60">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Promedio dado
            </div>
            <div className="text-2xl font-black text-amber-600 mt-1 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span>{userStats.average}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control de Pestañas: Mis Reseñas / Lugares Guardados */}
      {renderTabSwitcher()}

      {/* Contenido según Pestaña seleccionada */}
      {activeProfileTab === 'favoritos' ? (
        renderFavoritesSection()
      ) : (
        /* Sección "Mis Reseñas" */
        <section className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Mis Opiniones y Calificaciones
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {userReviews.length} {userReviews.length === 1 ? 'publicación' : 'publicaciones'}
            </span>
          </div>

          {userReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userReviews.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  review={rev}
                  showBusinessName={true}
                  onSelectBusiness={handleSelectBusiness}
                />
              ))}
            </div>
          ) : (
            /* Estado Vacío de Reseñas Propias */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto ring-6 ring-amber-500/5">
                <UtensilsCrossed className="w-7 h-7" />
              </div>

              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-900">
                  Aún no compartiste ninguna opinión
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ¿Fuiste a comer o pediste delivery recientemente en Bella Unión? Contale a la comunidad qué plato probaste.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => onNavigateToTab?.('explorar')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Explorar locales</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToTab?.('resenas')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ver feed de opiniones</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
