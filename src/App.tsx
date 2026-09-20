import { UtensilsCrossed, CheckCircle2, MapPin, Sparkles } from 'lucide-react'

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased text-slate-800">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 text-center transition-all">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 mb-6 ring-8 ring-amber-500/5">
          <UtensilsCrossed className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600 mb-3">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span>Bella Unión, Artigas, Uruguay</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Comida BU
        </h1>

        <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
          Guía Gastronómica de Bella Unión - Entorno Base Inicializado
        </p>

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-left">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Stack verificado y operativo</span>
          </div>
          <ul className="text-xs text-emerald-700 space-y-1.5 pl-6 list-disc">
            <li>React 19 + TypeScript en modo estricto</li>
            <li>Tailwind CSS con compilación en tiempo real</li>
            <li>Iconografía Lucide React cargada</li>
            <li>Configuración de SPA y despliegue lista</li>
          </ul>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Vite + React + Tailwind
          </span>
          <span className="font-mono">v0.1.0-dev</span>
        </div>
      </div>
    </main>
  )
}

