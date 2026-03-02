/* ──────────────────────────────────────────────────────────
   particles.js — Interactive Particle Mesh on Hero Canvas
   Draws floating particles connected by faint lines.
   Particles drift gently and respond to mouse movement.
   ────────────────────────────────────────────────────────── */

/** @type {HTMLCanvasElement|null} */
let canvas;
/** @type {CanvasRenderingContext2D|null} */
let ctx;
/** @type {{ x: number, y: number, vx: number, vy: number, r: number }[]} */
let particles = [];

let width  = 0;
let height = 0;
let animId = 0;

const mouse = { x: -9999, y: -9999 };

/* ── Config ──────────────────────────────────────────── */
const PARTICLE_COUNT  = 80;
const CONNECT_DIST    = 140;   // px — max distance to draw a line
const MOUSE_RADIUS    = 180;   // px — mouse repulsion radius
const MOUSE_FORCE     = 0.04;  // strength of mouse push
const BASE_SPEED      = 0.3;   // max random drift speed
const PARTICLE_R_MIN  = 1.2;
const PARTICLE_R_MAX  = 2.4;

/* ── Helpers ─────────────────────────────────────────── */

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle() {
  return {
    x:  Math.random() * width,
    y:  Math.random() * height,
    vx: randomBetween(-BASE_SPEED, BASE_SPEED),
    vy: randomBetween(-BASE_SPEED, BASE_SPEED),
    r:  randomBetween(PARTICLE_R_MIN, PARTICLE_R_MAX),
  };
}

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr  = Math.min(window.devicePixelRatio || 1, 2);

  width  = rect.width;
  height = rect.height;

  canvas.width  = width  * dpr;
  canvas.height = height * dpr;
  canvas.style.width  = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* ── Update & Draw ───────────────────────────────────── */

function tick() {
  ctx.clearRect(0, 0, width, height);

  // Accent colour from CSS custom property (adapts to theme)
  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--clr-accent').trim() || '#4F8EF7';

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // ── Mouse repulsion ──
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MOUSE_RADIUS && dist > 0) {
      const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    // ── Move ──
    p.x += p.vx;
    p.y += p.vy;

    // ── Dampen velocity back toward base speed ──
    p.vx *= 0.99;
    p.vy *= 0.99;

    // ── Wrap edges ──
    if (p.x < -10)      p.x = width  + 10;
    if (p.x > width + 10)  p.x = -10;
    if (p.y < -10)      p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    // ── Draw particle dot ──
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.6;
    ctx.fill();

    // ── Connect to nearby particles ──
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const ddx = p.x - q.x;
      const ddy = p.y - q.y;
      const d   = Math.sqrt(ddx * ddx + ddy * ddy);

      if (d < CONNECT_DIST) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.15 * (1 - d / CONNECT_DIST);
        ctx.lineWidth   = 0.7;
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
  animId = requestAnimationFrame(tick);
}

/* ── Init ────────────────────────────────────────────── */

export function initParticles() {
  canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  resize();

  // Create particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  // Mouse tracking (relative to hero section)
  const hero = canvas.closest('.hero') || canvas.parentElement;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  hero.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Re-init on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      // Re-distribute particles that may be out of bounds
      particles.forEach((p) => {
        if (p.x > width)  p.x = Math.random() * width;
        if (p.y > height) p.y = Math.random() * height;
      });
    }, 200);
  });

  // Start loop
  tick();
}
