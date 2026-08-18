let navbar;
let scrollProgress;
let hamburger;
let mobileMenu;
let backdrop;
let navLinks;
let mobileLinks;
let sectionIds;
let sectionEls;

let lastFocused = null;

const SCROLL_THRESHOLD = 80;
const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct = docHeight > 0 ? (scrollTop / docHeight) * 100: 0;
  if (scrollProgress) scrollProgress.style.width = `${scrollPct}%`;
}

function handleNavbarScroll() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
}

function onSectionIntersect(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    setActiveLink(entry.target.id);
  });
}

function setActiveLink(id) {
  const href = `#${id}`;
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === href;
    link.classList.toggle('active', isActive);
    // aria-current is what a screen reader actually announces; the class
    // alone is invisible to assistive tech.
    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  mobileLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === href);
  });
}

function isMenuOpen() {
  return mobileMenu.classList.contains('open');
}

/* Everything outside the panel is marked inert while it is open, so Tab
   cannot walk into the links sitting behind the overlay. */
function setOutsideInert(on) {
  [...document.body.children].forEach((el) => {
    if (el === mobileMenu || el === backdrop) return;
    if (on) {
      el.setAttribute('inert', '');
    } else {
      el.removeAttribute('inert');
    }
  });
}

function openMobileMenu() {
  lastFocused = document.activeElement;

  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  mobileMenu.removeAttribute('aria-hidden');
  if (backdrop) backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  setOutsideInert(true);

  const first = mobileMenu.querySelector(FOCUSABLE);
  if (first) first.focus();
}

function closeMobileMenu() {
  if (!mobileMenu) return;

  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';

  setOutsideInert(false);

  // Return focus to whatever opened the menu rather than dropping it on <body>.
  const target = (lastFocused && lastFocused !== document.body && document.contains(lastFocused))
    ? lastFocused
   : hamburger;
  if (target) target.focus();
  lastFocused = null;
}

function toggleMobileMenu() {
  if (isMenuOpen()) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function trapFocus(e) {
  if (e.key !== 'Tab' || !isMenuOpen()) return;

  const items = [...mobileMenu.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
  if (items.length === 0) return;

  const first = items[0];
  const last = items[items.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

export function initNavbar() {
  navbar         = document.getElementById('navbar');
  scrollProgress = document.getElementById('scrollProgress');
  hamburger      = document.getElementById('navHamburger');
  mobileMenu     = document.getElementById('mobileMenu');
  backdrop       = document.getElementById('navBackdrop');
  navLinks       = document.querySelectorAll('.navbar__link');
  mobileLinks    = document.querySelectorAll('.navbar__mobile-link');

  sectionIds = Array.from(navLinks).map((a) => a.getAttribute('href').replace('#', ''));
  sectionEls = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    handleNavbarScroll();
  }, { passive: true });

  updateScrollProgress();
  handleNavbarScroll();

  if (sectionEls.length > 0) {
    const observer = new IntersectionObserver(onSectionIntersect, {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    });
    sectionEls.forEach((el) => observer.observe(el));
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);

    mobileMenu.querySelectorAll('[data-close-menu]').forEach((el) => {
      el.addEventListener('click', closeMobileMenu);
    });

    mobileLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

    if (backdrop) backdrop.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen()) closeMobileMenu();
    });

    document.addEventListener('keydown', trapFocus);

    // Resizing past the breakpoint with the menu open would otherwise leave
    // the body scroll-locked and the rest of the page inert.
    window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
      if (e.matches && isMenuOpen()) closeMobileMenu();
    });
  }
}
