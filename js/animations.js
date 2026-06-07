// Animations module
const Animations = (() => {
  function animateCountUp(element) {
    const target = Number(element.dataset.target);
    const duration = 1200;
    const startTime = performance.now();

    function updateCount(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    }

    requestAnimationFrame(updateCount);
  }

  function initCountUpObserver() {
    const countUpElements = document.querySelectorAll(selectors.countUpElements);
    const registerSection = document.getElementById(selectors.registerSection.slice(1));
    const statsSection = document.getElementById(selectors.statsSection.slice(1));

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUpElements.forEach(animateCountUp);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    statsObserver.observe(statsSection);
  }

  function initSmoothScroll() {
    const landingCtaButton = document.getElementById(selectors.landingCtaButton.slice(1));
    const registerSection = document.getElementById(selectors.registerSection.slice(1));

    if (landingCtaButton) {
      landingCtaButton.addEventListener('click', () => {
        registerSection.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  return {
    animateCountUp,
    initCountUpObserver,
    initSmoothScroll
  };
})();
