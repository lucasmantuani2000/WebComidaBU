import { useState } from 'react'
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../context'

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialMode?: 'login' | 'register'
  title?: string
  subtitle?: string
}

function translateAuthError(err: unknown): string {
  if (!err) return 'Ocurrió un error al procesar tu solicitud.'
  const message = err instanceof Error ? err.message : String(err)
  const lower = message.toLowerCase()

  if (lower.includes('invalid login credentials') || lower.includes('invalid_grant')) {
    return 'Correo electrónico o contraseña incorrectos.'
  }
  if (lower.includes('email not confirmed')) {
    return 'Debés confirmar tu correo electrónico antes de ingresar. Por favor revisá tu casilla de correo.'
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'Ya existe una cuenta registrada con este correo electrónico. Probá iniciar sesión.'
  }
  if (lower.includes('at least 6 characters') || lower.includes('password should be')) {
    return 'La contraseña debe tener al menos 6 caracteres.'
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Demasiados intentos seguidos. Por favor aguardá unos minutos y volvé a intentar.'
  }
  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return 'Error de conexión al servidor de autenticación. Verificá tu conexión a internet.'
  }
  return message
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  title,
  subtitle,
}: AuthModalProps) {
  const { login, register, loginAsDemoUser, loginWithGoogle, isSupabaseConfigured } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfoMessage(null)

    const trimmedEmail = email.trim()
    const trimmedName = name.trim()

    if (!trimmedEmail) {
      setError('Por favor ingresá tu correo electrónico.')
      return
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Por favor ingresá un correo electrónico válido.')
      return
    }

    if (mode === 'register' && !trimmedName) {
      setError('Por favor ingresá tu nombre y apellido.')
      return
    }

    if (!password) {
      setError('Por favor ingresá tu contraseña.')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await login(trimmedEmail, password)
      } else {
        await register(trimmedName, trimmedEmail, password)
        setInfoMessage('¡Cuenta creada con éxito! Bienvenido a Comida BU.')
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('[AuthModal] Error en autenticación:', err)
      setError(translateAuthError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    setError(null)
    setInfoMessage(null)
    setIsSubmitting(true)
    try {
      await loginAsDemoUser()
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error(err)
      setError('No se pudo acceder con el usuario demo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setInfoMessage(null)
    setIsSubmitting(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      console.error(err)
      setError(translateAuthError(err))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-xl text-slate-900 leading-tight">
              {title || (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {subtitle ||
                (mode === 'login'
                  ? 'Ingresá con tu cuenta para calificar comercios y dejar opiniones en Comida BU.'
                  : 'Registrate con tu nombre y correo para unirte a la comunidad local.')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de Alternancia: Iniciar Sesión / Crear Cuenta */}
        <div className="flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setError(null)
              setInfoMessage(null)
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register')
              setError(null)
              setInfoMessage(null)
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear Cuenta</span>
          </button>
        </div>

        {/* Feedback de error amigable */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        {/* Feedback informativo */}
        {infoMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            {infoMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div className="space-y-1">
              <label htmlFor="auth-name" className="font-bold text-slate-700 block">
                Nombre y Apellido
              </label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Laura Martínez"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                  required={mode === 'register'}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="auth-email" className="font-bold text-slate-700 block">
              Correo Electrónico
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="auth-password" className="font-bold text-slate-700 block">
                Contraseña
              </label>
              <span className="text-[10px] text-slate-400">Mínimo 6 caracteres</span>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                required
                minLength={6}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
          >
            <span>
              {isSubmitting
                ? mode === 'login'
                  ? 'Iniciando sesión...'
                  : 'Creando cuenta...'
                : mode === 'login'
                ? 'Ingresar a mi cuenta'
                : 'Crear mi cuenta'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Acceso con Google si Supabase está configurado */}
        {isSupabaseConfigured && (
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>
        )}

        {/* Separador con botón de usuario Demo */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400 font-medium">o acceso rápido de prueba</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isSubmitting}
          className="w-full py-2.5 px-3 rounded-2xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Ingresar como usuario de prueba (Martín Silva)</span>
        </button>

        {/* Pie con opción de continuar como espectador */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            Continuar navegando como espectador
          </button>
        </div>
      </div>
    </div>
  )
}
