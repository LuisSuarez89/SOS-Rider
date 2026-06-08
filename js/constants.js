// Constants
const TOKEN = "SOS2026RiderCol";
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyL_KxzatZIGboh8DKRWG9CCI94ONHc85mX-B9Bic8YLcAni9cW6Ldc2s16_ae4dADU-A/exec";
const ALERT_TIMEOUT = 10000; // 10 segundos

// Contact/social links
// Add more social channels here using the same shape:
// { name: "Instagram", url: "https://...", icon: "📸", label: "Síguenos en Instagram" }
const CONTACT_LINKS = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/1ECYyoQrKq/",
    icon: "f",
    label: "Visítanos en Facebook"
  }
];

// DOM Selectors
const SCREEN_LANDING = "screen-landing";
const SCREEN_NO_ALIAS = "screen-no-alias";
const SCREEN_GPS = "screen-gps";
const SCREEN_MAIN = "screen-main";
const SCREEN_SUCCESS = "screen-success";

// DOM Elements
const selectors = {
  modal: "#modal-confirm",
  aliasValue: "#alias-value",
  accuracyValue: "#accuracy-value",
  gpsTitle: "#gps-title",
  gpsMessage: "#gps-message",
  openConfirmButton: "#open-confirm",
  cancelAlertButton: "#cancel-alert",
  sendAlertButton: "#send-alert",
  landingCtaButton: "#landing-cta",
  registerSection: "#section-register",
  contactLinksContainer: "#contact-links",
  statsSection: "#landing-stats",
  countUpElements: ".count-up",
  screens: ".screen",
  successScreen: "#screen-success"
};
