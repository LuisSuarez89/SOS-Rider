// Geolocation module
let lat;
let lon;
let currentAccuracy;
let currentAlias;
let gpsAttempts = 0;
const MAX_GPS_ATTEMPTS = 3;

function setAlias(alias) {
  currentAlias = alias;
}

function getErrorMessage(err) {
  if (!err) return 'Error desconocido de geolocalización';
  
  switch(err.code) {
    case 1: // PERMISSION_DENIED
      return 'Permiso de ubicación denegado. Ve a Configuración > Safari > Ubicación y actívalo.';
    case 2: // POSITION_UNAVAILABLE
      return 'Ubicación no disponible. Intenta en un lugar abierto con mejor señal GPS.';
    case 3: // TIMEOUT
      return 'Timeout obteniendo ubicación. Intenta de nuevo en unos segundos.';
    default:
      return err.message || 'No fue posible obtener la ubicación GPS';
  }
}

function startGPS() {
  if (!navigator.geolocation) {
    UI.showGpsError({ message: 'Geolocalización no soportada por este navegador' });
    return;
  }

  gpsAttempts++;
  
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      currentAccuracy = pos.coords.accuracy;
      gpsAttempts = 0; // Reset attempts on success
      UI.showMainScreen(currentAlias);
    },
    (err) => {
      const errorMsg = getErrorMessage(err);
      
      // Check if it's a permission error on iOS
      const isPermissionError = err && (err.code === 1 || err.code === 2 || err.code === 3);
      
      if (gpsAttempts < MAX_GPS_ATTEMPTS && isPermissionError) {
        // Show error but offer retry
        UI.showGpsError({ 
          message: errorMsg,
          canRetry: true,
          attempts: gpsAttempts
        });
      } else {
        // Final error
        UI.showGpsError({ message: errorMsg });
      }
    },
    { 
      enableHighAccuracy: true, 
      timeout: 15000,
      maximumAge: 0 // Don't use cached location
    }
  );
}

function retryGPS() {
  if (gpsAttempts < MAX_GPS_ATTEMPTS) {
    startGPS();
  }
}

function getLatitude() {
  return lat;
}

function getLongitude() {
  return lon;
}

function getAccuracy() {
  return currentAccuracy;
}

const Geolocation = {
  setAlias,
  startGPS,
  retryGPS,
  getLatitude,
  getLongitude,
  getAccuracy
};
