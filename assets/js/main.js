// main.js - Entry point. Imports every module and initialises them after the DOM is ready.

import { initNavbar }     from './navbar.js';
import { initTypewriter } from './typewriter.js';
import { initAnimations } from './animations.js';

import { initSkills }     from './skills.js';
import { initExperience } from './experience.js';
import { initProjects }       from './projects.js';
import { initContributions } from './contributions.js';
import { initBlog }           from './blog.js';
import { initGitHub }     from './github.js';
import { initContact }    from './contact.js';

import { initParticles }  from './particles.js';
import { initCursor }     from './cursor.js';
import { initEasterEggs } from './easter-eggs.js';

// showToast is exported from utils.js and imported directly by modules that need it.

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const SHOW_AFTER = 600; // px scrolled before the button appears

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

// Handles all in-page anchor clicks via delegation, including links injected by JS after load.
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

/**
 * Fetches meta.json and populates .resume-updated elements with the last updated date.
 */
async function initResumeUpdated() {
  try {
    const res  = await fetch('data/meta.json');
    const meta = await res.json();
    const text = `Updated: ${meta.resumeLastUpdated}`;
    document.querySelectorAll('.resume-updated').forEach((el) => {
      el.textContent = text;
    });
  } catch {
    // Keep the static fallback text already in the HTML
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypewriter();
  initAnimations();

  initSkills();
  initExperience();
  initProjects();
  initContributions();
  initBlog();
  // initGitHub();  // TODO: re-enable when the GitHub section is ready
  initContact();

  initParticles();
  initCursor();
  initEasterEggs();

  initBackToTop();
  setFooterYear();
  initSmoothScroll();
  initResumeUpdated();
});
