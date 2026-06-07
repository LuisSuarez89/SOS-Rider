// Alerts module
window.onAlertSent = (data) => {
  Alerts.handleAlertResponse(data);
};

const Alerts = (() => {
  function sendAlert(alias) {
    const url = `${GOOGLE_APPS_SCRIPT_URL}?alias=${encodeURIComponent(alias)}&lat=${Geolocation.getLatitude()}&lon=${Geolocation.getLongitude()}&accuracy=${Geolocation.getAccuracy()}&token=${encodeURIComponent(TOKEN)}&callback=onAlertSent`;

    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);

    setTimeout(() => UI.showSuccessScreen(alias), ALERT_TIMEOUT);
  }

  function handleAlertResponse(data) {
    // Response already handled by showSuccessScreen timeout
    // but this allows for early response if the API calls back
  }

  return {
    sendAlert,
    handleAlertResponse
  };
})();
