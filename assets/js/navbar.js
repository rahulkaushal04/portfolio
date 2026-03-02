// navbar.js - Sticky nav with scroll progress bar, active section highlighting, and mobile menu.

let navbar;
let scrollProgress;
let hamburger;
let mobileMenu;
let navLinks;
let mobileLinks;
let sectionIds;
let sectionEls;

const SCROLL_THRESHOLD = 80; // px scrolled before the frosted-glass style kicks in

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
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

/**
 * Marks the nav link matching the given section id as active.
 * @param {string} id - Section element id, e.g. "about"
 */
function setActiveLink(id) {
  const href = `#${id}`;
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === href);
  });
  mobileLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === href);
  });
}

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

export function initNavbar() {
  navbar         = document.getElementById('navbar');
  scrollProgress = document.getElementById('scrollProgress');
  hamburger      = document.getElementById('navHamburger');
  mobileMenu     = document.getElementById('mobileMenu');
  navLinks       = document.querySelectorAll('.navbar__link');
  mobileLinks    = document.querySelectorAll('.navbar__mobile-link');

  sectionIds = Array.from(navLinks).map((a) => a.getAttribute('href').replace('#', ''));
  sectionEls = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    handleNavbarScroll();
  }, { passive: true });

  // Run once so the state is correct if the page loads already scrolled
  updateScrollProgress();
  handleNavbarScroll();

  if (sectionEls.length > 0) {
    const observer = new IntersectionObserver(onSectionIntersect, {
      rootMargin: '-40% 0px -55% 0px', // fires when a section reaches the centre of the viewport
      threshold: 0,
    });
    sectionEls.forEach((el) => observer.observe(el));
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
    });
  }
}
