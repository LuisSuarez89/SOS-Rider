// App module - Main coordinator
const App = (() => {
  function setupEventListeners() {
    const openConfirmButton = document.getElementById(selectors.openConfirmButton.slice(1));
    const cancelAlertButton = document.getElementById(selectors.cancelAlertButton.slice(1));
    const sendAlertButton = document.getElementById(selectors.sendAlertButton.slice(1));

    openConfirmButton.addEventListener('click', () => UI.openConfirmModal());
    cancelAlertButton.addEventListener('click', () => UI.closeConfirmModal());
    sendAlertButton.addEventListener('click', () => {
      const params = new URLSearchParams(window.location.search);
      const alias = params.get('alias');
      Alerts.sendAlert(alias);
    });
  }

  function init() {
    const params = new URLSearchParams(window.location.search);
    const alias = params.get('alias');

    // Initialize event listeners
    setupEventListeners();

    // Initialize landing page animations
    Animations.initSmoothScroll();
    Animations.initCountUpObserver();

    // Determine initial screen
    if (!alias) {
      UI.showScreen(SCREEN_LANDING);
    } else {
      UI.showScreen(SCREEN_GPS);
      // Pass alias to showMainScreen when GPS is ready
      Geolocation.setAlias(alias);
      Geolocation.startGPS();
    }
  }

  return {
    init
  };
})();

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
