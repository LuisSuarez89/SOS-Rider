# ⚠️ Requisitos para iOS - IMPORTANTE

## 🔒 HTTPS Obligatorio

**iOS Safari requiere HTTPS para acceder a geolocalización.** Esto es un requisito de seguridad de Apple.

### Verificación de HTTPS
```bash
# Verifica que tu sitio está en HTTPS
curl -I https://tu-dominio.com
```

### Si usas localhost para testing
Para testing local en iOS, necesitas:
1. **Certificado SSL autofirmado** (localhost no funciona sin HTTPS)
2. O usar herramientas como `ngrok` que exponen localhost con HTTPS:
   ```bash
   ngrok http 8000
   ```
   Abre en iPhone: `https://xxxxx-xx-xxx-xxx.ngrok.io/?alias=tu_alias`

## 📍 Permiso de Geolocalización en iOS

### Cómo Safari pide el permiso

1. El usuario escanea tu QR desde Safari
2. Al cargar `?alias=xxx`, se solicita ubicación automáticamente
3. Safari muestra popup: "¿Permitir que este sitio acceda a tu ubicación?"
4. El usuario selecciona una opción:
   - "Permitir" → Se obtiene GPS
   - "Denegar" → Muestra error con botón reintentar
   - "Usar Solo Esta Vez" → GPS se obtiene pero es temporal

### Si el usuario rechazó el permiso antes

El usuario debe ir a:
- **Configuración → Safari → Ubicación**
- Encontrar el dominio y cambiar a "Permitir"
- Luego refrescar el QR

## 🧪 Testing en iPhone Real

### Paso 1: Asegurar HTTPS
Tu servidor debe estar en HTTPS. Opciones:
- **Vercel/Netlify** (deployment automático con HTTPS)
- **AWS CloudFront + S3** (HTTPS automático)
- **Heroku** (HTTPS incluido)
- **ngrok** (para testing local)

### Paso 2: Abrir el QR en Safari
1. Escanea tu QR desde la app Cámara o Códigos del iPhone
2. Abre en Safari (no en Chrome o app nativa)
3. Verás el popup pidiendo permiso de ubicación

### Paso 3: Verificar funcionamiento
- ✅ Pide permiso de GPS
- ✅ Muestra precisión GPS después de permitir
- ✅ Botón SOS funciona
- ✅ Alerta se envía exitosamente

## 🐛 Debugging en Safari (iPhone)

### Desde Mac:
1. Conecta iPhone por USB
2. En Mac: Safari → Menú → Preferencias → Pestaña "Avanzadas"
3. Marca "Menú Desarrollador"
4. En iPhone: Abre Inspector Web (Safari → Menú → Elementos)
5. Abre la consola para ver errores JavaScript

### Señales de error comunes:
```javascript
// Verificar en consola:
console.log(navigator.geolocation); // Debe existir
console.log(window.location.protocol); // Debe ser "https:"
```

## ✅ Checklist pre-deployment

- [ ] Sitio está en HTTPS (required para geolocalización)
- [ ] Meta tags de Apple agregados (`apple-mobile-web-app-capable`, etc.)
- [ ] Geolocation.js tiene reintentos para errores de permiso
- [ ] UI.js muestra mensajes de error específicos de iOS
- [ ] Testeado en iPhone real con Safari
- [ ] QR abre correctamente desde cámara
- [ ] GPS se solicita automáticamente
- [ ] Alerta se envía correctamente
- [ ] Página de éxito muestra ubicación en Google Maps

## 📱 Diferencias iOS vs Android

| Aspecto | Android | iOS |
|---------|---------|-----|
| **Protocolo** | HTTP u HTTPS | **HTTPS obligatorio** |
| **Prompt** | Popup nativo | Popup de Safari |
| **Rechazo** | Fácil reintentar | Requiere Configuración |
| **Precisión** | Generalmente excelente | Puede ser más lenta |
| **App web** | Puede instalarse | `apple-mobile-web-app-capable` |

## 🔗 Recursos útiles

- [MDN - Geolocation API Compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [WebKit Safari Geo Permissions](https://webkit.org/blog/3825/safari-geolocation-changes/)
- [Apple iOS Security](https://www.apple.com/business/site-specific-browser/)
