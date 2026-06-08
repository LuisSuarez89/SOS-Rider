// App module - Main coordinator
const App = (() => {
  function logDebugInfo() {
    // Log useful debugging info for troubleshooting
    const isHttps = window.location.protocol === 'https:';
    const hasGeolocation = !!navigator.geolocation;
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    console.log('🚀 SOS Rider - Debug Info');
    console.log('HTTPS:', isHttps ? '✅ Yes' : '❌ No (GPS will not work)');
    console.log('Geolocation API:', hasGeolocation ? '✅ Available' : '❌ Not available');
    console.log('Platform:', isIOS ? '📱 iOS' : '🤖 Android/Other');
    console.log('User Agent:', userAgent);
  }

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
    logDebugInfo();
    
    const params = new URLSearchParams(window.location.search);
    const alias = params.get('alias');

    // Initialize event listeners
    setupEventListeners();

    // Render configurable contact/social links
    UI.renderContactLinks();

    // Initialize landing page animations
    Animations.initSmoothScroll();
    Animations.initCountUpObserver();

    // Determine initial screen
    if (!alias) {
      UI.showScreen(SCREEN_LANDING);
    } else {
      console.log('📍 Starting GPS for alias:', alias);
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
