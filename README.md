# SOS Rider Colombia

SOS Rider Colombia es una aplicación web estática para emergencias de motociclistas. Al abrir un enlace o escanear un QR con el alias del piloto, la app solicita la ubicación GPS del teléfono y permite enviar una alerta SOS con latitud, longitud y precisión a los contactos de emergencia registrados.

La aplicación no usa frameworks, dependencias ni proceso de compilación: todo vive en `index.html` y se publica con GitHub Pages.

## Cómo funciona

1. El piloto o acompañante abre el enlace del QR con el parámetro `alias`.
2. La app pide permiso para obtener la ubicación GPS del dispositivo.
3. Cuando el GPS está listo, se muestra el botón rojo **ENVIAR ALERTA SOS**.
4. Antes de enviar, la app solicita confirmación.
5. Al confirmar, se envía la alerta al endpoint de Google Apps Script y se muestra la pantalla de éxito con un enlace para ver la ubicación en Google Maps.

## Registrar un nuevo rider

Registra cada piloto en el formulario de Google configurado para el proyecto:

[Registrar rider en Google Forms](https://forms.google.com/)

Incluye como mínimo:

- Alias único del piloto.
- Nombre del piloto.
- Contactos de emergencia.
- Números de WhatsApp con indicativo de país.

> Reemplaza el enlace anterior por el URL real de tu formulario de registro de SOS Rider Colombia.

## Generar un QR para un rider

Cada QR debe apuntar a la URL pública de GitHub Pages con el alias del piloto:

```text
https://luissuarez89.github.io/SOS-Rider/?alias=ALIAS
```

Ejemplo para un piloto de prueba:

```text
https://luissuarez89.github.io/SOS-Rider/?alias=alias_de_prueba
```

Pasos recomendados:

1. Define un alias corto, único y fácil de identificar.
2. Sustituye `ALIAS` en la URL por el alias real del piloto.
3. Genera el código QR con cualquier generador confiable.
4. Imprime y pega el QR en el casco, moto, carnet o kit de emergencia.
5. Prueba el QR desde un celular antes de entregarlo.

## Activar alertas por WhatsApp con CallMeBot

CallMeBot permite enviar mensajes de WhatsApp desde una URL. Para activar las alertas:

1. Agrega el número oficial de CallMeBot a tus contactos de WhatsApp. Consulta el número y las instrucciones actualizadas en [CallMeBot WhatsApp API](https://www.callmebot.com/blog/free-api-whatsapp-messages/).
2. Envía el mensaje de activación indicado por CallMeBot desde el WhatsApp que recibirá alertas.
3. CallMeBot responderá con una `apikey`.
4. Guarda para cada contacto:
   - Teléfono en formato internacional, por ejemplo `+573001112233`.
   - `apikey` entregada por CallMeBot.
5. Configura el Google Apps Script para que, al recibir `alias`, `lat`, `lon` y `accuracy`, busque los contactos del piloto y llame la URL de CallMeBot con el mensaje de emergencia.

Mensaje sugerido:

```text
🚨 SOS Rider Colombia: emergencia de ALIAS. Ubicación: https://www.google.com/maps?q=LAT,LON Precisión GPS: ±ACCURACY m
```


## Google Apps Script compatible con JSONP

Para que el endpoint de Google Apps Script acepte la llamada JSONP desde la app, usa este `doGet`:

```javascript
function doGet(e) {
  try {
    var payload = {
      alias:    (e.parameter.alias    || "").toString().trim().toLowerCase(),
      lat:      parseFloat(e.parameter.lat)  || 0,
      lon:      parseFloat(e.parameter.lon)  || 0,
      accuracy: parseFloat(e.parameter.accuracy) || null,
    };
    var result = procesarAlerta(payload);
    var callback = e.parameter.callback;
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + result.getContent() + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return result;
  } catch(err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}
```

## Estructura del repositorio

```text
index.html
.github/workflows/deploy.yml
README.md
```

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy.yml` publica el contenido del repositorio en GitHub Pages cuando se hace push a la rama `main`.
