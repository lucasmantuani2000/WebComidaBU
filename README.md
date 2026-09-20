# Comida BU - Guía Gastronómica de Bella Unión

Guía gastronómica digital para la ciudad de Bella Unión, Artigas, Uruguay.

## 🛠️ Stack Tecnológico

- **Framework:** [React 19](https://react.dev/)
- **Empaquetador y Entorno de Desarrollo:** [Vite](https://vite.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Despliegue:** [Netlify](https://www.netlify.com/) (soporte SPA configurado con `public/_redirects`)

## 📁 Estructura del Proyecto

```text
src/
├── assets/             # Recursos estáticos locales (imágenes, SVGs)
├── components/
│   ├── common/         # Componentes UI reutilizables y atómicos
│   └── layout/         # Componentes de estructura global (Header, Footer, Nav)
├── pages/              # Vistas principales de la aplicación
├── services/           # Clientes API y lógica de comunicación
├── types/              # Definiciones e interfaces de TypeScript
├── utils/              # Funciones auxiliares y formateadores
├── App.tsx             # Componente raíz (Smoke test inicial)
├── index.css           # Configuración y directivas base de Tailwind CSS
└── main.tsx            # Punto de entrada de la aplicación
```

## 🚀 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local.
- `npm run build`: Compila los tipos de TypeScript y genera el bundle optimizado en `dist/`.
- `npm run preview`: Previsualiza localmente la versión compilada en `dist/`.
- `npm run lint`: Ejecuta el análisis estático de código con Oxlint.

