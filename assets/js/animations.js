export function initAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal(el, obs) {
    const delay = parseInt(el.dataset.delay, 10) || 0;

    if (delay > 0) {
      setTimeout(() => el.classList.add('visible'), delay * 100);
    } else {
      el.classList.add('visible');
    }

    if (obs) obs.unobserve(el);
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

  // Exposed so dynamic modules (skills, projects, blog, github) can
  // register their freshly injected .reveal elements after render.
  window.__reObserveReveals = observeAll;

  // Safety net: a very fast/instant scroll (flick, Page Down, a jump from
  // a hash link) can move an element across the whole viewport within a
  // single check cycle, so the IntersectionObserver never sees it cross
  // the threshold and it stays invisible forever. On scroll, sweep for any
  // .reveal element that's already past where it should have revealed and
  // force it in. Stops listening once nothing is left to catch.
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
