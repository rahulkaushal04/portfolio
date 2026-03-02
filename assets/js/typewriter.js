/* ──────────────────────────────────────────────────────────
   typewriter.js — Animated Role Cycling in Hero
   ────────────────────────────────────────────────────────── */

const TYPE_SPEED   = 100;  // ms per character when typing
const DELETE_SPEED = 60;   // ms per character when deleting
const PAUSE_AFTER  = 2000; // ms to wait after full word is typed
const PAUSE_BEFORE = 400;  // ms to wait after word is deleted

/** @type {HTMLElement|null} */
let el;

/** @type {string[]} */
let roles = [];

/** Current index in the roles array */
let roleIdx = 0;

/** Current character position inside the active role */
let charIdx = 0;

/** Whether we're currently deleting characters */
let isDeleting = false;

/* ── Core Loop ───────────────────────────────────────── */

function tick() {
  if (!el || roles.length === 0) return;

  const current = roles[roleIdx];

  if (isDeleting) {
    charIdx--;
    el.textContent = current.substring(0, charIdx);

    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(tick, PAUSE_BEFORE);
      return;
    }

    setTimeout(tick, DELETE_SPEED);
  } else {
    charIdx++;
    el.textContent = current.substring(0, charIdx);

    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(tick, PAUSE_AFTER);
      return;
    }

    setTimeout(tick, TYPE_SPEED);
  }
}

/* ── Initialisation ──────────────────────────────────── */

/**
 * Fetch roles from meta.json and start the typewriter loop.
 * Falls back to a hardcoded list if the fetch fails.
 */
export async function initTypewriter() {
  el = document.getElementById('typewriter');
  if (!el) return;

  try {
    const res  = await fetch('data/meta.json');
    const meta = await res.json();
    if (Array.isArray(meta.roles) && meta.roles.length > 0) {
      roles = meta.roles;
    }
  } catch {
    // Fallback roles if fetch fails
    roles = ['Developer', 'Builder', 'Problem Solver'];
  }

  if (roles.length === 0) {
    roles = ['Developer', 'Builder', 'Problem Solver'];
  }

  tick();
}
