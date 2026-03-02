/* ──────────────────────────────────────────────────────────
   cursor.js — Custom Dot-Follower Cursor (Desktop Only)

   Creates a smooth-lagging dot that follows the mouse and
   scales up when hovering interactive elements.
   Hidden on touch devices via CSS (hover:none).
   ────────────────────────────────────────────────────────── */

/** @type {HTMLElement|null} */
let dot;

/** Current mouse position */
let mouseX = 0;
let mouseY = 0;

/** Rendered dot position (trails behind with lerp) */
let dotX = 0;
let dotY = 0;

/** Linear interpolation factor — smaller = more lag */
const LERP = 0.15;

/** Whether the dot is actively tracking */
let isActive = false;

/* ── Animation Loop ──────────────────────────────────── */

function animate() {
  if (!dot) return;

  dotX += (mouseX - dotX) * LERP;
  dotY += (mouseY - dotY) * LERP;

  dot.style.transform = `translate(${dotX}px, ${dotY}px)`;

  requestAnimationFrame(animate);
}

/* ── Hover Scaling ───────────────────────────────────── */

/**
 * Track pointer enter / leave on interactive elements
 * and toggle the enlarged cursor state.
 */
function initHoverDetection() {
  const selector = 'a, button, [role="button"], input, textarea, select, label';

  document.addEventListener('pointerover', (e) => {
    if (e.target.closest(selector)) {
      dot?.classList.add('cursor-hover');
    }
  });

  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(selector)) {
      dot?.classList.remove('cursor-hover');
    }
  });
}

/* ── Init ────────────────────────────────────────────── */

export function initCursor() {
  // Skip on touch-only devices
  if (window.matchMedia('(hover: none)').matches) return;

  dot = document.getElementById('cursorDot');
  if (!dot) return;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isActive) {
      isActive = true;
      dot.classList.add('visible');
    }
  });

  // Hide when cursor leaves the window
  document.addEventListener('mouseleave', () => {
    dot.classList.remove('visible');
    isActive = false;
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.add('visible');
    isActive = true;
  });

  initHoverDetection();
  requestAnimationFrame(animate);
}
