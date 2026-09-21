import { useState } from 'react'
import { X, LogIn, UserPlus, Mail, User as UserIcon, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context'

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialMode?: 'login' | 'register'
  title?: string
  subtitle?: string
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  title,
  subtitle,
}: AuthModalProps) {
  const { login, register, loginAsDemoUser } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

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

    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await login(trimmedEmail, trimmedName || undefined)
      } else {
        await register(trimmedName, trimmedEmail)
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error al procesar tu solicitud.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsSubmitting(true)
    try {
      await loginAsDemoUser()
      onSuccess?.()
      onClose()
    } finally {
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
                  ? 'Ingresá a tu cuenta para calificar y dejar opiniones en Comida BU.'
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

        {/* Pestañas de Alternancia */}
        <div className="flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setError(null)
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

        {/* Mensaje de Error */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{mode === 'login' ? 'Ingresar a mi cuenta' : 'Crear mi cuenta'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Separador con botón de usuario Demo */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400 font-medium">o acceso rápido</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isSubmitting}
          className="w-full py-2.5 px-3 rounded-2xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Probar con usuario demo: Martín Silva</span>
        </button>

        {/* Pie con opción de continuar como espectador */}
        <div className="pt-2 text-center">
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
