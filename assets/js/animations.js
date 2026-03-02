// animations.js - Scroll-reveal using IntersectionObserver.
// Elements with .reveal start hidden via CSS. Adding .visible triggers the entrance animation.
// data-delay="n" staggers the animation by n * 100ms. Direction variants (.reveal-left etc.) are CSS-only.

/**
 * Sets up scroll-reveal for all .reveal elements on the page.
 * Call once on DOMContentLoaded. Skips animation if the user prefers reduced motion.
 */
export function initAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = reducedMotion
    ? null
    : new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const delay = parseInt(el.dataset.delay, 10) || 0;

            if (delay > 0) {
              setTimeout(() => el.classList.add('visible'), delay * 100);
            } else {
              el.classList.add('visible');
            }

            // One-shot: stop watching once the element has been revealed
            obs.unobserve(el);
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -60px 0px',
        }
      );

  function observeAll() {
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      if (reducedMotion) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  }

  observeAll();

  // Exposed so dynamic modules (skills, projects, blog, github) can
  // register their freshly injected .reveal elements after render.
  window.__reObserveReveals = observeAll;
}
