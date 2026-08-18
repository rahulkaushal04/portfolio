import { initNavbar }     from './navbar.js';
import { initAnimations } from './animations.js';

import { initSkills }     from './skills.js';
import { initExperience } from './experience.js';
import { initProjects }       from './projects.js';
import { initContributions } from './contributions.js';
import { initBlog }           from './blog.js';
import { initContact }    from './contact.js';

import { initParticles }  from './particles.js';
import { initCursor }     from './cursor.js';

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const SHOW_AFTER = 600;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > SHOW_AFTER);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = String(new Date().getFullYear());
}

function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAnimations();

  initSkills();
  initExperience();
  initProjects();
  initContributions();
  initBlog();
  initContact();

  initParticles();
  initCursor();

  initBackToTop();
  setFooterYear();
  initSmoothScroll();

  loadEasterEggsOnDemand();
});

function loadEasterEggsOnDemand() {
  const triggerKeys = new Set(['ArrowUp', 'm', 'M', 'd', 'D', 'b', 'B']);

  const onKey = (e) => {
    if (!triggerKeys.has(e.key)) return;
    window.removeEventListener('keydown', onKey);

    import('./easter-eggs.js')
      .then(({ initEasterEggs }) => {
        initEasterEggs();
        // Replay the keystroke that triggered the load.
        window.dispatchEvent(new KeyboardEvent('keydown', { key: e.key }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: e.key }));
      })
      .catch(() => {});
  };

  window.addEventListener('keydown', onKey);
}
