export type TabType = 'inicio' | 'explorar' | 'mapa' | 'resenas' | 'perfil'

export interface NavItem {
  id: TabType
  label: string
}
