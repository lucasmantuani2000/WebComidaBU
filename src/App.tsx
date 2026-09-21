import { useState } from 'react'
import type { TabType } from './types'
import { Layout } from './components/layout'
import { Home, Explore, MapView, ReviewsView, ProfileView } from './pages'
import { AuthProvider, ReviewsProvider } from './context'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('inicio')

  return (
    <AuthProvider>
      <ReviewsProvider>
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Pestaña Inicio: Experiencia Home de Descubrimiento */}
            {activeTab === 'inicio' && <Home />}

            {/* Pestaña Explorar: Directorio Avanzado con Filtros y Ordenamiento */}
            {activeTab === 'explorar' && <Explore />}

            {/* Pestaña Mapa: Visualización Geográfica Interactiva en Bella Unión */}
            {activeTab === 'mapa' && <MapView />}

            {/* Pestaña Reseñas: Feed Comunitario con Filtro por Producto */}
            {activeTab === 'resenas' && <ReviewsView />}

            {/* Pestaña Perfil: Modo Espectador vs Usuario Autenticado y Mis Reseñas */}
            {activeTab === 'perfil' && <ProfileView onNavigateToTab={setActiveTab} />}
          </div>
        </Layout>
      </ReviewsProvider>
    </AuthProvider>
  )
}
