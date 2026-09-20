import type { ReactNode } from 'react'
import type { TabType } from '../../types'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'

interface LayoutProps {
  children: ReactNode
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  showFooter?: boolean
}

export function Layout({
  children,
  activeTab,
  onTabChange,
  showFooter = true,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
      {/* Cabecera sticky superior con navegación desktop */}
      <Header activeTab={activeTab} onTabChange={onTabChange} />

      {/* Contenedor principal con padding inferior en mobile para no ser tapado por el BottomNav */}
      <main className="flex-1 w-full pb-20 md:pb-8">
        {children}
      </main>

      {/* Footer visible en el flujo documental */}
      {showFooter && <Footer onTabChange={onTabChange} />}

      {/* Barra de navegación inferior fija estilo App nativa (Solo mobile < 768px) */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
