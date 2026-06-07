# SOS Rider Colombia - Arquitectura Modular

## 📁 Estructura del Proyecto

```
SOS-Rider/
├── index.html                 # HTML limpio (solo estructura)
├── css/                       # Estilos modularizados
│   ├── variables.css          # Variables CSS (colores, sombras, espacios)
│   ├── base.css               # Estilos base y tipografía
│   ├── layout.css             # Sistema de layouts, grillas, screens
│   ├── components.css         # Estilos de botones, modales, cards
│   ├── animations.css         # Keyframes y transiciones
│   └── landing.css            # Estilos específicos de landing page
├── js/                        # Módulos JavaScript
│   ├── constants.js           # Constantes, URLs, selectores DOM
│   ├── geolocation.js         # Lógica de GPS y ubicación
│   ├── ui.js                  # Gestión de pantallas y UI
│   ├── alerts.js              # Envío de alertas
│   ├── animations.js          # Animaciones y observadores
│   └── app.js                 # Coordinador principal
└── README.md                  # Este archivo
```

## 🎯 Responsabilidades por Archivo

### CSS

**variables.css**
- Paleta de colores (:root)
- Sombras, espaciados y tokens de diseño

**base.css**
- Reset CSS y normalización
- Estilos globales (body, h1, h2, p)
- Tipografía y fuentes

**layout.css**
- Sistema de screens (visible/invisible)
- Componente card
- Modal overlay
- Success screen
- Responsive utilities

**components.css**
- Botón SOS (circular, animado)
- Botones CTA y registro
- Botón Maps
- Botones modales (cancelar/enviar)

**animations.css**
- @keyframes pulse (botón SOS)
- @keyframes spin (spinner)
- @keyframes heroPulse (emoji hero)
- @keyframes arrowPulse (flechas demo)

**landing.css**
- Layout del hero
- Secciones landing
- Grid de cards/stats
- Phone mockups
- Estilos de demo flow

### JavaScript

**constants.js**
- `TOKEN`: Token para autenticación con Google Apps Script
- `GOOGLE_APPS_SCRIPT_URL`: URL del webhook
- `ALERT_TIMEOUT`: Timeout de espera de respuesta (10s)
- `selectors`: Objeto con selectores CSS para DOM elements

**geolocation.js**
- `setAlias(alias)`: Guarda el alias del piloto
- `startGPS()`: Inicia la obtención del GPS
- `getLatitude()`, `getLongitude()`, `getAccuracy()`: Getters

**ui.js** (IIFE Pattern)
- `showScreen(screenId)`: Muestra una pantalla específica
- `showMainScreen(alias)`: Muestra pantalla principal con alias y precisión
- `showGpsError(err)`: Muestra error de geolocalización
- `showSuccessScreen(alias)`: Muestra pantalla de éxito con detalles
- `openConfirmModal()`: Abre modal de confirmación
- `closeConfirmModal()`: Cierra modal

**alerts.js** (IIFE Pattern)
- `sendAlert(alias)`: Envía alerta a Google Apps Script
- `handleAlertResponse(data)`: Callback JSONP
- Global: `window.onAlertSent()` para respuesta del servidor

**animations.js** (IIFE Pattern)
- `animateCountUp(element)`: Anima números hasta un target
- `initCountUpObserver()`: Observer para animar stats al scroll
- `initSmoothScroll()`: Scroll suave del botón CTA

**app.js** (IIFE Pattern)
- `setupEventListeners()`: Configura event listeners principales
- `init()`: Inicialización de la aplicación
- Determina flujo inicial (landing vs GPS)

## 🔄 Flujo de Ejecución

1. **Carga de página**
   - Cargar CSS (variables → base → layout → components → animations → landing)
   - Cargar JS (constants → geolocation → ui → alerts → animations → app)

2. **Sin alias en URL** (`?`)
   - Mostrar landing page
   - Iniciar observers para count-up de stats
   - Listener en botón CTA para scroll suave

3. **Con alias en URL** (`?alias=Juan`)
   - Mostrar pantalla GPS
   - Solicitar geolocalización
   - Cuando llega GPS → mostrar pantalla SOS

4. **Click en botón SOS**
   - Abrir modal de confirmación
   - User confirma → enviar alerta a Google Apps Script
   - Esperar respuesta o timeout (10s)
   - Mostrar pantalla de éxito con detalles

## ✨ Ventajas de la Arquitectura Modular

✅ **Separación de responsabilidades** - Cada módulo tiene una función clara
✅ **Fácil de mantener** - Encontrar y actualizar código rápidamente
✅ **Reutilizable** - Los módulos pueden usarse en otras secciones
✅ **Testeable** - Cada módulo puede testearse independientemente
✅ **Escalable** - Agregar nuevas funcionalidades sin afectar código existente
✅ **Legible** - Código limpio y bien organizado

## 🔧 Cómo Extender el Proyecto

### Agregar nueva animación
1. Crear @keyframes en `css/animations.css`
2. Aplicar a clase en el CSS correspondiente

### Agregar nuevo módulo JavaScript
1. Crear archivo en `js/nuevo-modulo.js`
2. Seguir patrón IIFE para encapsulación
3. Exportar métodos públicos necesarios
4. Cargar en `index.html` en orden correcto

### Agregar nueva pantalla
1. Agregar HTML en `index.html` con clase `screen` e ID único
2. Crear estilos en CSS correspondiente
3. Usar `UI.showScreen()` para mostrarla

## 📝 Patrones Usados

- **IIFE (Immediately Invoked Function Expression)**: Para encapsular módulos y evitar contaminación del scope global
- **Módular Pattern**: Cada responsabilidad en su propio archivo
- **Selector Pattern**: Constantes centralizadas para selectores DOM
- **Observer Pattern**: IntersectionObserver para animaciones en scroll

## 🚀 Próximos Pasos

- Considerar agregar un build system (Vite/Webpack) para minificación
- Agregar testing unitario con Jest
- Implementar linting con ESLint
- Considerar TypeScript para mejor type safety
