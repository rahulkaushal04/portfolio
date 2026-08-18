let canvas;
let ctx;
let particles = [];

let width  = 0;
let height = 0;
let animId = 0;

const mouse = { x: -9999, y: -9999 };

let accent = '#4F8EF7';
let running = false;

// The accent colour was read with getComputedStyle on every frame "so it
// responds to theme changes". There is no theme switcher, so that was a
// forced style recalculation 60 times a second for a constant.
function readAccent() {
  accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--clr-accent').trim() || '#4F8EF7';
}

// Connection drawing is O(n^2): 80 particles is 3,160 distance checks per
// frame, which is a lot of work to hand a phone for a background texture.
const PARTICLE_COUNT_DESKTOP = 64;
const PARTICLE_COUNT_MOBILE  = 28;
const CONNECT_DIST   = 140;
const MOUSE_RADIUS   = 180;
const MOUSE_FORCE    = 0.04;
const BASE_SPEED     = 0.3;
const PARTICLE_R_MIN = 1.2;
const PARTICLE_R_MAX = 2.4;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: randomBetween(-BASE_SPEED, BASE_SPEED),
    vy: randomBetween(-BASE_SPEED, BASE_SPEED),
    r: randomBetween(PARTICLE_R_MIN, PARTICLE_R_MAX),
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

function tick() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    const dx   = p.x - mouse.x;
    const dy   = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MOUSE_RADIUS && dist > 0) {
      const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    p.x += p.vx;
    p.y += p.vy;

    // Light damping keeps velocity from growing unbounded
    p.vx *= 0.99;
    p.vy *= 0.99;

    if (p.x < -10)         p.x = width  + 10;
    if (p.x > width  + 10) p.x = -10;
    if (p.y < -10)         p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.6;
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q   = particles[j];
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

function start() {
  if (running) return;
  running = true;
  animId = requestAnimationFrame(tick);
}

function stop() {
  if (!running) return;
  running = false;
  cancelAnimationFrame(animId);
}

export function initParticles() {
  canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  readAccent();
  resize();

  const count = window.matchMedia('(max-width: 768px)').matches
    ? PARTICLE_COUNT_MOBILE
   : PARTICLE_COUNT_DESKTOP;

  for (let i = 0; i < count; i++) {
    particles.push(createParticle());
  }

  // Track mouse position relative to the hero section, not the whole page
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

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      // Re-clamp any particles that landed outside the new canvas bounds
      particles.forEach((p) => {
        if (p.x > width)  p.x = Math.random() * width;
        if (p.y > height) p.y = Math.random() * height;
      });
    }, 200);
  });

  // The loop used to run forever, including when the hero was a full page
  // out of view and when the tab was in the background.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? start(): stop()));
  }, { threshold: 0 });
  io.observe(hero);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else if (hero.getBoundingClientRect().bottom > 0) {
      start();
    }
  });

  start();
}
