/* ──────────────────────────────────────────────────────────
   animations.js — Scroll-Reveal with Intersection Observer
   ────────────────────────────────────────────────────────── */

/**
 * Initialise scroll-reveal animations.
 *
 * Every element with the `.reveal` class starts hidden (via CSS
 * `opacity: 0; transform: translateY(24px)`). When it scrolls into
 * view, the `.visible` class is added, triggering its entrance
 * animation.
 *
 * Staggered delays are supported via the `data-delay` attribute
 * (e.g. `data-delay="1"` → 100 ms offset). Direction variants
 * `.reveal-left`, `.reveal-right`, `.reveal-scale` are handled
 * purely in CSS — this module only toggles `.visible`.
 *
 * If the user has `prefers-reduced-motion: reduce` enabled, all
 * reveal elements are made visible immediately without animation.
 */

/* ── Reduced-motion shortcut ─────────────────────────── */

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ── Observer Setup ──────────────────────────────────── */

export function initAnimations() {
  const reducedMotion = prefersReducedMotion();

  const observer = reducedMotion
    ? null
    : new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el    = entry.target;
            const delay = parseInt(el.dataset.delay, 10) || 0;

            if (delay > 0) {
              setTimeout(() => el.classList.add('visible'), delay * 100);
            } else {
              el.classList.add('visible');
            }

            // Once revealed, stop observing (one-shot animation)
            obs.unobserve(el);
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -60px 0px',
        }
      );

  /** Observe all current `.reveal` elements. */
  function observeAll() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    reveals.forEach((el) => {
      if (reducedMotion) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  }

  observeAll();

  /**
   * Expose a global helper so dynamically-rendered modules
   * (skills, projects, blog, github) can ask us to observe
   * their freshly injected `.reveal` elements.
   */
  window.__reObserveReveals = observeAll;
}
