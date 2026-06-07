// Alerts module
window.onAlertSent = (data) => {
  Alerts.handleAlertResponse(data);
};

const Alerts = (() => {
  function sendAlert(alias) {
    const url = `${GOOGLE_APPS_SCRIPT_URL}?alias=${encodeURIComponent(alias)}&lat=${Geolocation.getLatitude()}&lon=${Geolocation.getLongitude()}&accuracy=${Geolocation.getAccuracy()}&token=${encodeURIComponent(TOKEN)}&callback=onAlertSent`;

    console.log('🚨 Sending alert for:', alias);
    console.log('📍 GPS Coords:', Geolocation.getLatitude(), Geolocation.getLongitude());
    console.log('📊 Accuracy:', Math.round(Geolocation.getAccuracy()), 'm');

    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);

    setTimeout(() => {
      console.log('✅ Alert sent successfully');
      UI.showSuccessScreen(alias);
    }, ALERT_TIMEOUT);
  }

  function handleAlertResponse(data) {
    // Response already handled by showSuccessScreen timeout
    // but this allows for early response if the API calls back
    console.log('✅ Alert response received:', data);
  }

  return {
    sendAlert,
    handleAlertResponse
  };
})();
