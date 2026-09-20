import type { Review } from '../types'

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    businessId: 'avenida-resto',
    businessName: 'Avenida Restó',
    userName: 'Martín Silva',
    productConsumed: 'Milanesa en dos panes completa con papas fritas',
    rating: 5,
    comment:
      'Excelente porción y súper tierna la carne. Siempre que voy a almorzar al centro la atención es impecable y la comida sale rápida.',
    date: 'Hace 3 días',
    verifiedVisit: true,
  },
  {
    id: 'rev-2',
    businessId: 'pizzeria-cactus',
    businessName: 'Pizzería Cactus',
    userName: 'Lucía Da Rosa',
    productConsumed: 'Muzzarella con panceta y fainá de orilla',
    rating: 5,
    comment:
      'La clásica e inigualable de Bella Unión. Masa crocante, abundante muzza y el fainá bien calentito. Un 10 de 10.',
    date: 'Hace 5 días',
    verifiedVisit: true,
  },
  {
    id: 'rev-3',
    businessId: 'burgers-br',
    businessName: 'Burgers BR',
    userName: 'Facundo Pereira',
    productConsumed: 'Smash Doble Cheddar con bacon y papas rústicas',
    rating: 5,
    comment:
      'Una bomba de sabor. El pan de papa súper suave y la carne con la costra perfecta. El delivery llegó en menos de 25 minutos.',
    date: 'Hace 1 semana',
    verifiedVisit: true,
  },
  {
    id: 'rev-4',
    businessId: 'dolce-vita-cafe',
    businessName: 'Dolce Vita Café',
    userName: 'Mariana Gómez',
    productConsumed: 'Café capuchino y porción de tarta de frutillas',
    rating: 4,
    comment:
      'Lugar ideal para merendar frente a la plaza 25 de Agosto. Muy rico café y la pastelería siempre fresca del día.',
    date: 'Hace 1 semana',
    verifiedVisit: true,
  },
  {
    id: 'rev-5',
    businessId: 'chiveteria-la-familia',
    businessName: 'Chivetería La Familia',
    userName: 'Emiliano Morales',
    productConsumed: 'Chivito al pan canadiense completo',
    rating: 5,
    comment:
      'Uno de los mejores chivitos de Bella Unión y de todo el norte. Viene con huevo, panceta, jamón, muzza y una montaña de papas fritas.',
    date: 'Hace 2 semanas',
    verifiedVisit: true,
  },
  {
    id: 'rev-6',
    businessId: 'pizzeria-q-sabor',
    businessName: 'Pizzería Q Sabor',
    userName: 'Camila Pintos',
    productConsumed: 'Pizza cuatro quesos y empanadas de carne',
    rating: 4,
    comment:
      'Pedimos para cenar en familia el sábado; llegó rápido por delivery y bien caliente. Muy recomendable la masa a la piedra.',
    date: 'Hace 2 semanas',
    verifiedVisit: true,
  },
  {
    id: 'rev-7',
    businessId: 'la-chacra',
    businessName: 'La Chacra',
    userName: 'Rodrigo Suárez',
    productConsumed: 'Parrillada completa para dos con asado de tira y achuras',
    rating: 5,
    comment:
      'Carne en su punto justo a las brasas y ensaladas frescas. El ambiente campestre en las afueras de la ciudad es muy tranquilo para ir en familia.',
    date: 'Hace 3 semanas',
    verifiedVisit: true,
  },
  {
    id: 'rev-8',
    businessId: 'la-toscana-pizzeria',
    businessName: 'La Toscana Pizzería',
    userName: 'Sofía Fagúndez',
    productConsumed: 'Calzone napolitano relleno con jamón y muzza',
    rating: 4,
    comment:
      'Masa liviana y relleno muy abundante. Se nota que usan ingredientes caseros de buena calidad.',
    date: 'Hace 3 semanas',
    verifiedVisit: false,
  },
]
