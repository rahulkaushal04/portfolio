export function initAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal(el, obs) {
    const delay = parseInt(el.dataset.delay, 10) || 0;

    el.classList.add('is-animating');

    if (delay > 0) {
      setTimeout(() => el.classList.add('visible'), delay * 100);
    } else {
      el.classList.add('visible');
    }

    if (obs) obs.unobserve(el);

    el.addEventListener('transitionend', () => {
      el.classList.remove('is-animating');
    }, { once: true });

    // transitionend never fires if the element was already at its end state.
    setTimeout(() => el.classList.remove('is-animating'), 900);
  }

  const observer = reducedMotion
    ? null
    : new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target, obs);
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

  // Lets dynamic modules register freshly injected .reveal elements.
  window.__reObserveReveals = observeAll;

  // A fast scroll can carry an element across the viewport between observer
  // checks, so it never fires and the element stays hidden. Sweep for those.
  if (!reducedMotion) {
    let ticking = false;

    function sweep() {
      ticking = false;
      const stillHidden = document.querySelectorAll('.reveal:not(.visible)');
      if (stillHidden.length === 0) {
        window.removeEventListener('scroll', onScroll);
        return;
      }
      stillHidden.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const pastThreshold = rect.top < window.innerHeight - 60 * (1 - 0.15);
        if (pastThreshold) reveal(el, observer);
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sweep);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }
}
