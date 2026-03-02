/* ──────────────────────────────────────────────────────────
   navbar.js — Sticky Nav, Active Link, Hamburger, Scroll Progress
   ────────────────────────────────────────────────────────── */

/** @type {HTMLElement}   */ let navbar;
/** @type {HTMLElement}   */ let scrollProgress;
/** @type {HTMLElement}   */ let hamburger;
/** @type {HTMLElement}   */ let mobileMenu;
/** @type {NodeListOf<HTMLAnchorElement>} */ let navLinks;
/** @type {NodeListOf<HTMLAnchorElement>} */ let mobileLinks;
/** @type {string[]}      */ let sectionIds;
/** @type {HTMLElement[]}  */ let sectionEls;

const SCROLL_THRESHOLD = 80;  // px before frosted-glass kicks in

/* ── Scroll Progress Bar ─────────────────────────────── */

function updateScrollProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${scrollPct}%`;
  }
}

/* ── Frosted-glass on Scroll ─────────────────────────── */

function handleNavbarScroll() {
  if (!navbar) return;
  if (window.scrollY > SCROLL_THRESHOLD) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* ── Active Section Highlighting ─────────────────────── */

/** Intersection Observer callback */
function onSectionIntersect(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const id = entry.target.id;
    setActiveLink(id);
  });
}

/**
 * Highlight the nav link whose href matches the given section id.
 * @param {string} id — section id (e.g. "about")
 */
function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
  mobileLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}

/* ── Mobile Menu ─────────────────────────────────────── */

function toggleMobileMenu() {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!isOpen));
  hamburger.classList.toggle('open', !isOpen);
  mobileMenu.classList.toggle('open', !isOpen);
  mobileMenu.setAttribute('aria-hidden', String(isOpen));
  document.body.style.overflow = !isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ── Initialisation ──────────────────────────────────── */

export function initNavbar() {
  navbar         = document.getElementById('navbar');
  scrollProgress = document.getElementById('scrollProgress');
  hamburger      = document.getElementById('navHamburger');
  mobileMenu     = document.getElementById('mobileMenu');
  navLinks       = document.querySelectorAll('.navbar__link');
  mobileLinks    = document.querySelectorAll('.navbar__mobile-link');

  // Gather section IDs from the desktop nav links
  sectionIds = Array.from(navLinks).map((a) =>
    a.getAttribute('href').replace('#', '')
  );
  sectionEls = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  /* ── Scroll listeners (passive for performance) ──── */
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    handleNavbarScroll();
  }, { passive: true });

  // Run once on load so state is correct if the page is already scrolled
  updateScrollProgress();
  handleNavbarScroll();

  /* ── Intersection Observer for active section ────── */
  if (sectionEls.length > 0) {
    const observer = new IntersectionObserver(onSectionIntersect, {
      rootMargin: '-40% 0px -55% 0px', // centre sweet-spot
      threshold: 0,
    });
    sectionEls.forEach((el) => observer.observe(el));
  }

  /* ── Hamburger toggle ────────────────────────────── */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close when any mobile link is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }
}
