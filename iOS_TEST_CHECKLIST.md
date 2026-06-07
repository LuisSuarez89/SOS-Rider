# ✅ Checklist de Testing en iPhone - iOS

## 🧪 Instrucciones de Testing

### Paso 1: Acceder al sitio en iPhone
1. Abre el **Safari** en tu iPhone (⚠️ DEBE ser Safari, no Chrome)
2. Navega a tu dominio de GitHub Pages (ej: `https://tuusuario.github.io/SOS-Rider`)
3. El sitio debe cargar rápidamente y verse responsive

### Paso 2: Testear landing page
- [ ] La página de inicio se ve bien (logo, textos, botones)
- [ ] Los botones son clickeables
- [ ] El diseño es responsive (no hay texto cortado)
- [ ] Los emojis se ven correctamente

### Paso 3: Testear con un alias (generar QR)
1. Abre tu sitio con un alias: `https://tuusuario.github.io/SOS-Rider/?alias=TUOMBREO`
   - Reemplaza `TUUSUARIO` con tu usuario GitHub
   - Reemplaza `TUOMBREO` con un alias válido
2. El sitio debe mostrar la pantalla "Obteniendo ubicación GPS..."

### Paso 4: Verificar permiso de GPS (⭐ CRÍTICO)
- [ ] **Safari muestra popup**: "¿Permitir que 'xx' acceda a tu ubicación?"
  - Si NO aparece popup → El sitio NO está en HTTPS (pero GitHub Pages sí está)
  - Si NO aparece popup → Intenta desde incógnito o limpia cookies

- [ ] Selecciona **"Permitir"**
  - El sitio debe obtener coordenadas y mostrar precisión GPS
  - Ej: "Precisión GPS: ±15m"

### Paso 5: Testear pantalla SOS
Una vez con GPS obtenido, deberías ver:
- [ ] Tu alias en grande
- [ ] Precisión GPS mostrada
- [ ] Botón "🚨 ENVIAR ALERTA SOS" está clickeable

### Paso 6: Testear envío de alerta
1. Toca el botón "🚨 ENVIAR ALERTA SOS"
2. Se debe mostrar modal de confirmación
3. Selecciona "SÍ, ENVIAR ALERTA"
4. Deberías ver pantalla de éxito con:
   - [ ] Hora exacta de la alerta
   - [ ] Precisión GPS
   - [ ] Confirmación de WhatsApp, SMS, Email
   - [ ] Botón para ver ubicación en Google Maps

### Paso 7: Testear reintentos de GPS (si falla permiso)
1. En un nuevo test, selecciona **"Denegar"** en el popup de GPS
2. Deberías ver error con mensajes claros:
   - [ ] Mensaje de error específico
   - [ ] Botón "Reintentar" visible
   - [ ] El contador muestra intento 1 de 3
3. Toca "Reintentar" hasta 3 veces
4. Después de 3 intentos, el botón desaparece

### Paso 8: Testear desde QR real
1. Imprime o muestra un QR que apunte a: `?alias=TUOMBREO`
2. Abre la app de **Cámara** en iPhone
3. Apunta a tu QR
4. Toca la notificación que aparece arriba
5. Debe abrir Safari con tu sitio
6. Sigue desde **Paso 3**

## 🐛 Troubleshooting

### "Obteniendo ubicación GPS..." queda atrapado
**Causa**: Permiso no otorgado o GPS desactivado

**Solución**:
1. Abre **Configuración → Privacidad → Localización**
2. Asegúrate que Localización esté **ON**
3. Scroll down → Busca **Safari**
4. Cambiar a **"Permitir"**
5. Vuelve a cargar el QR en Safari

### No aparece popup de permiso de GPS
**Causa**: Sitio no está en HTTPS (pero GitHub Pages sí está)

**Solución**:
1. Verifica que la URL comienza con `https://`
2. Limpia cookies: Safari → Menú → Preferencias → Privacidad → Quitar datos
3. Intenta en ventana privada
4. Recarga la página (Pull down to refresh)

### Precisión GPS es muy mala
**Causa**: Normal en interiores. GPS funciona mejor afuera.

**Solución**:
- Abre el QR en un lugar abierto (calle, parque)
- GPS de iPhone puede tardar 10-15 segundos en interiores
- La precisión mejora después de 30 segundos

### Alerta no se envía
**Causa**: Problema con API de Google Apps Script

**Solución**:
1. Verifica que tienes internet (Wi-Fi o datos)
2. Verifica que tu alias existe en la base de datos
3. Abre consola de Safari (Mac: Safari → Menú → Elementos) para ver errores

## 📊 Resumen de cambios

Los siguientes cambios se hicieron para compatibilidad iOS:

1. ✅ **Meta tags de Apple** → Mejor integración con iOS
2. ✅ **Manejo de errores GPS** → Mensajes claros por tipo de error
3. ✅ **Sistema de reintentos** → Hasta 3 intentos para permisos fallidos
4. ✅ **HTTPS requerido** → Ya tienes GitHub Pages con HTTPS

## 🆘 Si todo falla

1. **Documenta el error exacto** que ves en pantalla
2. **Abre Safari → Menú → Elementos** (si conectas iPhone a Mac)
3. **Busca errores en rojo** en la consola
4. **Copia el error** y reporta

---

**Última verificación**: Cambios deployados en commit `2606965`
