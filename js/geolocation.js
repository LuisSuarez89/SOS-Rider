// Geolocation module
let lat;
let lon;
let currentAccuracy;
let currentAlias;

function setAlias(alias) {
  currentAlias = alias;
}

function startGPS() {
  if (!navigator.geolocation) {
    UI.showGpsError({ message: 'Geolocalización no soportada por este navegador' });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      currentAccuracy = pos.coords.accuracy;
      UI.showMainScreen(currentAlias);
    },
    (err) => UI.showGpsError(err),
    { enableHighAccuracy: true, timeout: 15000 }
  );
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
  getLatitude,
  getLongitude,
  getAccuracy
};
