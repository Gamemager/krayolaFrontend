# Krayola Store Client (Frontend)

Frontend moderno desarrollado en **Angular 17+** (v21.0.0) utilizando la arquitectura de **Componentes Standalone** para el e-commerce "Krayola Store". Se conecta a una API RESTful para gestionar un catálogo dinámico, carrito de compras persistente y pagos en línea.

## 🛠 Tecnologías y Librerías

*   **Framework:** Angular 17+ (Standalone Components, Signals, Control Flow `@if/@for`).
*   **Lenguaje:** TypeScript v5.9.
*   **Estilos:** Bootstrap 5.3 + SCSS personalizado (Dark Mode Theme).
*   **Manejo de Estado:** RxJS (`BehaviorSubject` para el carrito y autenticación).
*   **HTTP Client:** Angular `HttpClient` + Interceptors.
*   **SSR (Server-Side Rendering):** Habilitado para mejor SEO y rendimiento inicial.

---

## ⚙️ Configuración e Instalación

### 1. Prerrequisitos
*   Node.js (v20+ recomendado).
*   Angular CLI instalado globalmente (`npm install -g @angular/cli`).

### 2. Instalación
```bash
npm install

3. Scripts Disponibles
bash
# Servidor de desarrollo
npm start       # Corre en http://localhost:4200/

# Producción
npm run build   # Genera los archivos en dist/krayola

# Server-Side Rendering
npm run serve:ssr:krayola
🚀 Arquitectura y Funcionalidades
1. Núcleo (src/app/core)
    Contiene la lógica transversal de la aplicación (Singleton Services).

    services/api.service.ts: Cliente HTTP genérico para conectar con el Backend.

    services/auth.ts: Manejo de sesión (Login/Register) y almacenamiento de Tokens. (en construccion)

    services/cart.ts: 
    
        Gestiona el estado global del carrito con BehaviorSubject.

        Persiste datos en LocalStorage.

        Calcula totales y valida stock en tiempo real.

    services/products.ts: Lógica específica para el catálogo.   

    interceptors/: (Opcional) Para adjuntar el Token JWT en cada petición.

    guards/: Protección de rutas (ej. perfil de usuario).

2. Módulos Funcionales (src/app/features)
    Organizado por dominio de negocio (Lazy Loading implícito por rutas).

    auth/: Componentes de Login y Registro.

    shop/:

        Catálogo: Filtrado por categorías (Motos/Relojes) y renderizado con @for.

        Detalle: Vista individual con especificaciones dinámicas y validación de stock.

    cart/: Componente visual (Sidebar/Offcanvas) que muestra los ítems seleccionados.

    home/: Landing page principal con productos destacados.

3. Componentes Compartidos (src/app/shared)
    Reutilizables en toda la aplicación.

    components/toast/: Sistema de notificaciones no intrusivas (reemplazo de alert()).

    components/product-card/: Tarjeta estándar de producto.

    components/ui-button/: Botones estandarizados.

    pipes/currency-format-pipe.ts: Formateo de precios (COP) consistente.

📡 Integración con Pagos (Mercado Pago)
El flujo de pago se gestiona desde el CartService y CartComponent.

Inicio: El usuario hace clic en "Pagar Ahora".

Preferencia: El Frontend envía el carrito al endpoint /api/payments/create_preference.

Redirección: Recibe un ID de preferencia y redirige a mercadopago.com.

Retorno: El usuario vuelve a /pago-exitoso (configurado en Backend).

📂 Estructura de Carpetas
text
src/
├── app/
│   ├── core/                        # Lógica de negocio transversal (Singleton Services)
│   │   ├── guards/                  # Protección de rutas (AuthGuard, AdminGuard)
│   │   ├── interceptors/            # Interceptores HTTP (TokenInterceptor)
│   │   ├── models/                  # Interfaces y Tipos (Product, User, CartItem)
│   │   └── services/
│   │       ├── api.service.ts       # Cliente HTTP Base
│   │       ├── auth.ts              # Servicio de Autenticación
│   │       ├── cart.ts              # Lógica del Carrito (State Management)
│   │       └── products.ts          # Gestión del Catálogo
│   │
│   ├── features/                    # Módulos funcionales (Vistas/Páginas)
│   │   ├── auth/                    # Login y Registro
│   │   ├── cart/                    # Vista del Carrito (posiblemente página completa)
│   │   ├── home/                    # Landing Page
│   │   └── shop/                    # Módulo de Tienda
│   │       ├── product-list/        # Catálogo
│   │       └── product-detail/      # Vista de Producto
│   │
│   ├── layout/                      # Componentes estructurales
│   │   ├── footer/                  # Pie de página
│   │   ├── header/                  # Barra de navegación superior
│   │   └── main-layout/             # Wrapper principal de la app
│   │
│   ├── shared/                      # Componentes UI reutilizables y utilidades
│   │   ├── components/
│   │   │   ├── product-card/        # Tarjeta de producto individual
│   │   │   ├── section-title/       # Títulos estandarizados
│   │   │   ├── toast/               # Notificaciones emergentes
│   │   │   └── ui-button/           # Botones personalizados
│   │   └── pipes/
│   │       └── currency-format-pipe.ts # Formateador de moneda personalizado
│   │
│   ├── app.config.ts                # Configuración de proveedores globales
│   ├── app.routes.ts                # Definición de rutas (Lazy Loading)
│   ├── app.component.ts             # Componente raíz
│   └── app.component.html           # Template raíz
│
├── assets/                          # Recursos estáticos
│   ├── icons/                       # Iconos SVG/PNG
│   ├── images/                      # Imágenes generales de UI
│   └── products/                    # (Opcional) Imágenes locales de productos
│
├── styles.scss                      # Estilos globales y variables SCSS
├── main.ts                          # Punto de entrada de la aplicación
└── index.html                       # HTML base
