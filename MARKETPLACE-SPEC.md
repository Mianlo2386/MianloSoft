# MARKETPLACE-SPEC
## Master Architecture Document

### 1. Visión General del Proyecto
Plataforma profesional diseñada para la comercialización y distribución de proyectos de software. La infraestructura estará optimizada para operar con costo inicial nulo (Tier gratuito), garantizando al mismo tiempo escalabilidad, seguridad en la distribución de activos digitales y una experiencia de usuario (UX) premium.

### 2. Stack Tecnológico & Infraestructura (Costo Cero Inicial)
*   **Frontend / Framework:** Next.js (o React vía Vite), alojado en **Vercel** (Capa gratuita).
*   **Estilos y UI:** **Tailwind CSS** para utilidades responsivas, **Lucide Icons** para iconografía. Soporte nativo Dark/Light Mode.
*   **Base de Datos y Backend:** **Supabase** (PostgreSQL) o **MongoDB Atlas** (Capa gratuita) para gestión de usuarios, productos y órdenes.
*   **Pagos:** **Mercado Pago API** (Modo Sandbox para simulación).
*   **Almacenamiento (Archivos de Software):** AWS S3 (Free Tier), Cloudinary o Supabase Storage (para manejo de URLs firmadas).

### 3. Requerimientos Funcionales & Diseño

#### 3.1 Catálogo Dinámico
*   **Estructura de Datos (Metadatos):** Nombre, Descripción, Versión, Precio, Link de Demo, y URLs de las imágenes de previsualización.
*   **Gestión:** Ingesta de proyectos de forma incremental mediante un archivo de configuración JSON o a través de un panel de administración protegido.

#### 3.2 Demos en Vivo
*   Cada proyecto incluirá un enlace a una instancia funcional e independiente, permitiendo a los usuarios interactuar con el producto antes de la compra.

#### 3.3 Sistema de Descarga Segura (Anti-Piratería)
*   **Mecanismo:** El software de pago no será accesible mediante enlaces directos estáticos.
*   **Implementación:** Se generarán **URLs firmadas (Signed URLs) o temporales** utilizando el proveedor de almacenamiento (ej. Supabase Storage o AWS S3).
*   **Expiración:** El enlace expirará automáticamente (ej. 15-30 minutos) después de haber sido generado para mitigar la distribución no autorizada.

#### 3.4 Sistema de Pagos (Mercado Pago)
*   **Integración:** Checkout Pro / API de Mercado Pago en **modo Sandbox**.
*   **Flujo:**
    1. El usuario inicia el proceso de compra.
    2. Se genera la preferencia de pago y se redirige/muestra el checkout simulado.
    3. Una vez aprobada la transacción, Mercado Pago emite un **Webhook** al backend.
    4. El backend valida el webhook, registra la orden como "Pagada" y dispara la generación y envío del enlace de descarga segura al usuario.

#### 3.5 Estilo Visual Moderno
*   **Tema Principal:** Oscuro por defecto (Fondo: `#000000`).
*   **Paleta de Colores:** Acentos vibrantes en tonos **Verde** y **Azul** para llamadas a la acción (CTAs) y estados de éxito. Tipografía principal en color **Blanco** para contraste óptimo.
*   **Modo Claro/Oscuro:** Soporte nativo para alternar la preferencia del usuario, priorizando la estética moderna y elegante del tema oscuro.

---

### 4. Especificaciones Técnicas Detalladas

#### 4.1 Esquema de Base de Datos
El siguiente modelo relacional (adaptable a NoSQL si se opta por MongoDB) describe las entidades principales:

*   **Users (Usuarios/Compradores)**
    *   `id` (UUID, PK)
    *   `email` (String, Unique)
    *   `created_at` (Timestamp)
    *   `auth_provider` (String - ej. Google, GitHub, Email)

*   **Products (Proyectos/Catálogo)**
    *   `id` (UUID, PK)
    *   `name` (String)
    *   `description` (Text)
    *   `version` (String)
    *   `price` (Decimal)
    *   `demo_url` (String)
    *   `file_path` (String - Ruta interna del bucket seguro)
    *   `is_active` (Boolean)

*   **Orders (Órdenes de Compra)**
    *   `id` (UUID, PK)
    *   `user_id` (UUID, FK -> Users.id)
    *   `product_id` (UUID, FK -> Products.id)
    *   `status` (Enum: 'PENDING', 'COMPLETED', 'FAILED')
    *   `payment_id` (String - ID de Mercado Pago)
    *   `created_at` (Timestamp)
    *   `download_url` (String - Temporal/Opcional para caché del estado)

#### 4.2 Flujo de Autenticación
1.  **Registro/Login:** El usuario se autentica (vía Email/Password o OAuth usando Supabase Auth/NextAuth).
2.  **Dashboard de Usuario:** Una vez autenticado, el usuario tiene acceso a una ruta protegida (`/dashboard` o `/mis-compras`).
3.  **Historial de Descargas:** El sistema consulta la tabla `Orders` filtrando por `user_id` y `status = 'COMPLETED'`.
4.  **Generación Bajo Demanda:** Al hacer clic en "Descargar" en un ítem comprado, el backend valida la orden y genera una *nueva URL firmada* al vuelo, asegurando que los enlaces antiguos no puedan ser reutilizados de manera indefinida.

#### 4.3 Pipeline de CI/CD (GitHub Actions)
La automatización del despliegue y las revisiones de seguridad estarán definidas en flujos de trabajo de GitHub (`.github/workflows/`):

1.  **Trigger:** Push a la rama `main` o apertura de un Pull Request.
2.  **Fase 1: Preparación y Linting:**
    *   Instalación de dependencias (npm/yarn/pnpm).
    *   Ejecución de Linter (ESLint) y chequeos de formato (Prettier).
3.  **Fase 2: Revisiones de Seguridad (SecOps):**
    *   Escaneo de vulnerabilidades en dependencias (`npm audit` o `Snyk`).
    *   Escaneo de credenciales expuestas (ej. `TruffleHog` o `Gitleaks`) para evitar subidas de secretos al repositorio.
4.  **Fase 3: Build & Test:**
    *   Construcción de la aplicación web (`build`).
    *   Ejecución de tests unitarios/integración (si aplican).
5.  **Fase 4: Despliegue Automático (Deploy):**
    *   Si es PR: Despliegue en entorno de Preview en Vercel (URL efímera).
    *   Si es `main`: Despliegue directo al entorno de Producción en Vercel.

---
*Documento generado siguiendo lineamientos de Spec-Driven Development. Esta es la Fuente de Verdad para los sub-agentes de desarrollo.*
