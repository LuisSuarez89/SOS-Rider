// UI module
const UI = (() => {
  const elements = {
    screens: document.querySelectorAll(selectors.screens),
    modal: document.getElementById(selectors.modal.slice(1)),
    aliasValue: document.getElementById(selectors.aliasValue.slice(1)),
    accuracyValue: document.getElementById(selectors.accuracyValue.slice(1)),
    gpsTitle: document.getElementById(selectors.gpsTitle.slice(1)),
    gpsMessage: document.getElementById(selectors.gpsMessage.slice(1)),
    successScreen: document.getElementById(selectors.successScreen.slice(1)),
    contactLinksContainer: document.getElementById(selectors.contactLinksContainer.slice(1))
  };

  function renderContactLinks() {
    if (!elements.contactLinksContainer || !Array.isArray(CONTACT_LINKS)) {
      return;
    }

    elements.contactLinksContainer.innerHTML = CONTACT_LINKS.map((link) => {
      const channelClass = link.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      return `
        <a class="contact-link contact-link--${channelClass}" href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.label}">
          <span class="contact-link-icon" aria-hidden="true">${link.icon}</span>
          <span>${link.name}</span>
        </a>
      `;
    }).join('');
  }

  function showScreen(screenId) {
    console.log('📺 Showing screen:', screenId);
    elements.screens.forEach((screen) => screen.classList.remove('is-active'));
    document.getElementById(screenId).classList.add('is-active');
  }

  function showMainScreen(alias) {
    const accuracy = Math.round(Geolocation.getAccuracy());
    console.log(`📍 Main screen - Alias: ${alias}, Accuracy: ±${accuracy}m`);
    elements.aliasValue.textContent = alias;
    elements.accuracyValue.textContent = `Precisión GPS: ±${accuracy}m`;
    showScreen(SCREEN_MAIN);
  }

  function showGpsError(err) {
    const detail = err && err.message ? err.message : '';
    const canRetry = err && err.canRetry;
    
    console.log('⚠️ GPS Error screen shown:', detail);
    elements.gpsTitle.textContent = 'No fue posible obtener la ubicación GPS';
    elements.gpsMessage.innerHTML = `
      <div>${detail}</div>
      ${canRetry ? '<div style="margin-top: 16px; font-size: 14px; color: #999;">Intento ' + err.attempts + ' de ' + 3 + '</div>' : ''}
      ${canRetry ? '<button id="gps-retry-btn" class="retry-btn" style="margin-top: 16px; padding: 8px 16px; background: #e63946; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Reintentar</button>' : ''}
    `;
    showScreen(SCREEN_GPS);
    
    if (canRetry) {
      setTimeout(() => {
        const retryBtn = document.getElementById('gps-retry-btn');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            console.log('🔄 User clicked retry button');
            Geolocation.retryGPS();
          });
        }
      }, 100);
    }
  }

  function showSuccessScreen(alias) {
    elements.modal.classList.remove('is-active');
    const mapsUrl = `https://www.google.com/maps?q=${Geolocation.getLatitude()},${Geolocation.getLongitude()}`;
    const accuracy = Math.round(Geolocation.getAccuracy());
    const now = new Date().toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    console.log('✅ Success screen - Alert sent for:', alias);
    elements.successScreen.innerHTML = `
      <div class="success-icon">✅</div>
      <h1>¡Alerta enviada!</h1>
      <p class="success-subtitle">Tus contactos de emergencia han sido notificados</p>

      <div class="success-card">
        <div class="success-row">
          <span class="success-label">⏰ Hora</span>
          <span class="success-value">${now}</span>
        </div>
        <div class="success-row">
          <span class="success-label">📍 Precisión GPS</span>
          <span class="success-value">±${accuracy}m</span>
        </div>
        <div class="success-row">
          <span class="success-label">📲 WhatsApp</span>
          <span class="success-value success-ok">Enviado ✓</span>
        </div>
        <div class="success-row">
          <span class="success-label">💬 SMS</span>
          <span class="success-value success-ok">Enviado ✓</span>
        </div>
        <div class="success-row">
          <span class="success-label">📧 Email</span>
          <span class="success-value success-ok">Enviado ✓</span>
        </div>
        <div class="success-row">
          <span class="success-label">✅ Confirmación</span>
          <span class="success-value success-ok">Enviada a tu celular</span>
        </div>
      </div>

      <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="maps-button">
        📍 Ver mi ubicación en Maps
      </a>

      <p class="success-footer">
        Recibirás un WhatsApp y email de confirmación en tu celular registrado.
      </p>
    `;

    showScreen(SCREEN_SUCCESS);
  }

  function openConfirmModal() {
    console.log('📋 Opening confirmation modal');
    elements.modal.classList.add('is-active');
  }

  function closeConfirmModal() {
    console.log('❌ Closing confirmation modal');
    elements.modal.classList.remove('is-active');
  }

  return {
    showScreen,
    showMainScreen,
    showGpsError,
    showSuccessScreen,
    openConfirmModal,
    closeConfirmModal,
    renderContactLinks
  };
})();
