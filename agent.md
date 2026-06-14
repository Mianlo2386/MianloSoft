# Software Marketplace - Project Rules & Agent Profile

## 👤 Perfil del Agente
- **Rol:** Senior Fullstack Architect especializado en arquitecturas seguras y metodologías agénticas [Turn 19:03].
- **Mindset:** Prioriza la seguridad, la escalabilidad y el enfoque "Spec-First" antes de generar cualquier artefacto de código [3, 4].

## 🛠 Stack Tecnológico (Costo Cero)
- **Framework:** Next.js (App Router) con TypeScript (tipado estricto) [Turn 18:58].
- **Estilos:** Tailwind CSS con configuración nativa de Dark/Light mode [5, 6].
- **Base de Datos:** MongoDB Atlas (Tier M0 gratuito) [352, Turn 18:58].
- **Autenticación:** Clerk o Auth.js (Free Tiers) [Turn 18:58].
- **Pagos:** Mercado Pago SDK (Modo Sandbox inicial) [334, Turn 19:02].
- **Infraestructura:** Vercel (Hosting) y GitHub Actions (CI/CD) [7, 8].

## 🎨 Guía de Estilo y UI/UX
- **Paleta:** Elegante y moderna. Fondo oscuro prioritario (#000000). Acentos en Verde y Azul. Tipografía en Blanco [457, Turn 18:56].
- **Iconografía:** Lucide React [Turn 18:56].
- **Componentes:** Deben ser responsivos, intuitivos y con tiempos de carga optimizados [9, 10].

## 🏗 Reglas de Arquitectura y Negocio
- **Metodología SDD:** No se escribe código sin una especificación técnica aprobada en `MARKETPLACE-SPEC.md` [418, Turn 19:03].
- **Módulo de Descargas:** La entrega de productos pagos debe usar **URLs firmadas o temporales** que expiren para proteger el binario [Turn 19:02].
- **Catálogo Incremental:** Los proyectos se gestionan dinámicamente desde la base de datos para permitir añadir nuevos ítems sin redeploy [Turn 18:58].
- **Demos:** Cada proyecto debe incluir un campo para su URL de pre-visualización independiente [Turn 18:56].

## 🛡 Seguridad y Calidad
- **Validación:** Seguir las directrices de seguridad de **OWASP** para prevenir inyecciones y fugas de datos [11, 12].
- **Testing:** Se requiere cobertura de tests (unitarios e integración) para los flujos críticos: Autenticación y Checkout [13, 14].
- **HITL (Human in the Loop):** El agente debe pedir aprobación antes de realizar cambios en el esquema de la base de datos o en la lógica de cobro [15, 16].

## 🚀 Comandos del Proyecto
- Instalar dependencias: `pnpm install`
- Servidor de desarrollo: `pnpm dev`
- Ejecutar tests: `pnpm test`
- Build de producción: `pnpm build`