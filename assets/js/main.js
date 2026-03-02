/* ──────────────────────────────────────────────────────────
   main.js — App Bootstrapper
   Imports every module and fires init functions in the
   correct order once the DOM is ready.
   ────────────────────────────────────────────────────────── */

/* ── Core modules (Phase 5) ──────────────────────────── */
import { initNavbar }     from './navbar.js';
import { initTypewriter } from './typewriter.js';
import { initAnimations } from './animations.js';

/* ── Section modules (Phase 6) ────────────────────────── */
import { initSkills }      from './skills.js';
import { initExperience }  from './experience.js';
import { initProjects }    from './projects.js';
import { initBlog }     from './blog.js';
import { initGitHub }   from './github.js';
import { initContact }  from './contact.js';

/* ── Polish modules (Phase 7) ─────────────────────────── */
import { initParticles }  from './particles.js';
import { initCursor }     from './cursor.js';
import { initEasterEggs } from './easter-eggs.js';

/* ── Helpers ─────────────────────────────────────────── */

/**
 * Show/hide the back-to-top button based on scroll position.
 */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const SHOW_AFTER = 600; // px

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > SHOW_AFTER);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Set footer year to the current year.
 */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = String(new Date().getFullYear());
}

/**
 * Intercept clicks on anchor links and smooth-scroll to the target.
 * Uses event delegation on the document so it covers all anchor links
 * including those injected later by JS.
 */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return; // skip bare "#"

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
}

/**
 * Fetch meta.json and populate "Last updated" resume badges.
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
    // Silently keep the static fallback text
  }
}

// showToast lives in utils.js to avoid circular imports

/* ── Bootstrap ───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  /* ── Phase 5: Core ───────────────────────────────── */
  initNavbar();
  initTypewriter();
  initAnimations();

  /* ── Phase 6: Sections ──────────────────────────────── */
  initSkills();
  initExperience();
  initProjects();
  initBlog();
  // initGitHub();  // TODO: re-enable when GitHub repos section is ready to show
  initContact();

  /* ── Phase 7: Polish ─────────────────────────────── */
  initParticles();
  initCursor();
  initEasterEggs();

  /* ── Global helpers ──────────────────────────────── */
  initBackToTop();
  setFooterYear();
  initSmoothScroll();
  initResumeUpdated();
});
