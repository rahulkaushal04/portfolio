import { showToast } from './utils.js';

const NAMES = {
  professional: 'Professional',
  retro: 'Retro',
  hallownest: 'Hallownest',
  souls: 'Lands Between',
  grandline: 'Grand Line',
};
const DISPLAY_FAMILY = {
  professional: 'Young Serif',
  retro: 'Pixelify Sans',
  hallownest: 'Cinzel',
  souls: 'IM Fell English SC',
  grandline: 'Bangers',
};

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
};

// Weak devices and data-savers get the static look.
function lowPower() {
  const n = navigator;
  return reduced.matches
    || root.getAttribute('data-motion') === 'off'
    || n.connection?.saveData
    || (n.hardwareConcurrency && n.hardwareConcurrency <= 2)
    || (n.deviceMemory && n.deviceMemory <= 2);
}

const token = (name) => getComputedStyle(root).getPropertyValue(name).trim().replace(/^["']|["']$/g, '');

/* ───────────── ambient canvas (motes / embers) ───────────── */

let canvas, ctx, raf = 0, parts = [], kind = 'none', W = 0, H = 0, dpr = 1, trailOn = false, lastT = 0;
const pointer = { x: -1, y: -1, moved: 0 };

function resizeCanvas() {
  dpr = Math.min(devicePixelRatio || 1, 1.5);
  W = innerWidth; H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawn(initial) {
  if (kind === 'motes') {
    return { x: Math.random() * W, y: initial ? Math.random() * H : H + 10, r: 1 + Math.random() * 2, vy: -(0.08 + Math.random() * 0.22), vx: (Math.random() - 0.5) * 0.12, a: 0.35 + Math.random() * 0.5, ph: Math.random() * 6.28 };
  }
  return { x: Math.random() * W, y: initial ? Math.random() * H : H + 10, r: 0.8 + Math.random() * 1.8, vy: -(0.35 + Math.random() * 0.9), vx: (Math.random() - 0.5) * 0.3, a: 0.4 + Math.random() * 0.6, ph: Math.random() * 6.28, life: 1 };
}

function tick(t) {
  raf = requestAnimationFrame(tick);
  if (t - lastT < 33) return; // ~30fps is plenty for drifting specks
  lastT = t;
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  const color = kind === 'motes' ? ambientRGB.motes : ambientRGB.embers;
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.y += p.vy; p.x += p.vx + Math.sin(t / 900 + p.ph) * 0.15;
    if (p.trail) { p.life -= 0.02; p.a = p.life; if (p.life <= 0) { parts.splice(i, 1); continue; } }
    else if (p.y < -10) { parts[i] = spawn(false); continue; }
    ctx.fillStyle = `rgba(${color},${Math.max(p.a, 0)})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
  }
  if (trailOn && pointer.moved) {
    pointer.moved = 0;
    for (let k = 0; k < 2; k++) {
      parts.push({ x: pointer.x + (Math.random() - 0.5) * 6, y: pointer.y, r: 0.8 + Math.random() * 1.6, vy: -(0.3 + Math.random() * 0.7), vx: (Math.random() - 0.5) * 0.6, a: 1, life: 1, ph: Math.random() * 6.28, trail: true });
    }
  }
}

const ambientRGB = { motes: '143,211,255', embers: '224,112,47' };
function hexToRgb(h) { const n = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)).join(','); }

function stopAmbient() {
  cancelAnimationFrame(raf); raf = 0; parts = [];
  root.removeAttribute('data-ambient');
  ctx?.clearRect(0, 0, W, H);
}

function startAmbient() {
  stopAmbient();
  kind = token('--ambient');
  if (kind !== 'motes' && kind !== 'embers') return;
  if (lowPower() || document.hidden) return;
  trailOn = token('--cursor-kind') === 'trail';
  ambientRGB.motes = hexToRgb(token('--accent'));
  ambientRGB.embers = hexToRgb(token('--pop'));
  resizeCanvas();
  const n = (innerWidth < 700 ? 14 : 30);
  parts = Array.from({ length: n }, () => spawn(true));
  root.setAttribute('data-ambient', 'on');
  raf = requestAnimationFrame(tick);
}

/* ───────────── cursor ───────────── */

let halo, hx = 0, hy = 0, hraf = 0, haloOn = false;
function haloLoop() {
  hx += (pointer.x - hx) * 0.16; hy += (pointer.y - hy) * 0.16;
  halo.style.transform = `translate(${hx}px, ${hy}px) translate(-50%, -50%)`;
  hraf = Math.hypot(pointer.x - hx, pointer.y - hy) < 0.5 ? 0 : requestAnimationFrame(haloLoop);
}
function startCursor() {
  cancelAnimationFrame(hraf); hraf = 0; haloOn = false;
  const k = token('--cursor-kind');
  root.setAttribute('data-cursor', finePointer.matches && !lowPower() ? k : 'native');
  if (k === 'halo' && finePointer.matches && !lowPower() && halo) {
    halo.style.display = 'block';
    haloOn = true;
    hraf = requestAnimationFrame(haloLoop);
  } else if (halo) {
    halo.style.display = 'none';
  }
}

/* ───────────── boot moment ───────────── */

const BOOT = {
  retro: '<pre class="boot__post">BIOS v2.3\nCPU: Go-486 DX2, 66 MHz\nMemory test: 640K OK\nDetecting appliance ...... OK\nMounting data/*.json ...... OK\nLoading desktop ...\n\nPress any key to skip</pre>',
  hallownest: '<span class="boot__light"></span>',
  souls: '<span class="boot__fire"><i></i><i></i><i></i></span>',
  grandline: '<span class="boot__wave"></span>',
};

function playBoot(theme) {
  if (reduced.matches || root.getAttribute('data-motion') === 'off' || !BOOT[theme]) return;
  document.getElementById('boot')?.remove();
  const el = document.createElement('div');
  el.id = 'boot';
  el.className = `boot boot--${theme}`;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = BOOT[theme];
  document.body.appendChild(el);
  const done = () => { el.classList.add('boot--out'); setTimeout(() => el.remove(), 450); cleanup(); };
  const cleanup = () => { removeEventListener('keydown', done); el.removeEventListener('pointerdown', done); clearTimeout(timer); };
  const timer = setTimeout(done, theme === 'retro' ? 3200 : 1500);
  addEventListener('keydown', done, { once: true });
  el.addEventListener('pointerdown', done, { once: true });
}

/* ───────────── theme state ───────────── */

function current() {
  const theme = root.getAttribute('data-theme');
  return { theme, mode: root.getAttribute('data-mode') };
}

function paint(theme, mode) {
  root.setAttribute('data-theme', theme);
  if (theme === 'professional') root.setAttribute('data-mode', mode); else root.removeAttribute('data-mode');
  const key = theme === 'professional' && mode === 'dark' ? 'professional-dark' : theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', window.__rk?.colors[key] ?? '');
  syncUI();
  startAmbient();
  startCursor();
  if (theme === 'retro') import('./retro.js').then((m) => m.enableRetro()).catch(() => root.classList.add('rk-retro-failed'));
  else import('./retro.js').then((m) => m.disableRetro()).catch(() => {});
}

function syncUI() {
  const { theme, mode } = current();
  document.querySelectorAll('[data-theme-opt]').forEach((b) => {
    const on = b.dataset.themeOpt === theme;
    b.setAttribute('aria-checked', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  const label = document.querySelector('.theme__label');
  document.getElementById('themeBtn')?.setAttribute('aria-label', `Theme: ${NAMES[theme]}`);
  document.getElementById('themeMotion')?.setAttribute('aria-checked', String(root.getAttribute('data-motion') === 'off'));
  const m = document.getElementById('themeMode');
  if (m) { m.hidden = theme !== 'professional'; m.setAttribute('aria-checked', String(mode === 'dark')); }
}

async function loadFonts(theme) {
  const link = document.getElementById('themeFonts');
  const url = window.__rk?.fonts[theme];
  if (link && url && link.getAttribute('href') !== url) {
    await new Promise((res) => { const t = setTimeout(res, 1500); link.onload = () => { clearTimeout(t); res(); }; link.href = url; });
  }
  try { await Promise.race([document.fonts.load(`1em "${DISPLAY_FAMILY[theme]}"`), new Promise((r) => setTimeout(r, 1200))]); } catch { /* font API unavailable */ }
}

function setTheme(theme, mode) {
  const cur = current();
  if (theme === cur.theme && (theme !== 'professional' || mode === cur.mode)) return;
  store.set('rk-theme', theme);
  if (theme === 'professional') store.set('rk-mode', mode);
  // Switch at once. Fonts load in the background; the metric-matched fallbacks keep the swap from jumping.
  const apply = () => paint(theme, mode);
  if (document.startViewTransition && !reduced.matches) document.startViewTransition(apply); else apply();
  loadFonts(theme);
  if (theme !== cur.theme) showToast(`Theme: ${NAMES[theme]}`, 'success', 2500);
}

/* ───────────── switcher UI ───────────── */

function initSwitcher() {
  const btn = document.getElementById('themeBtn');
  const panel = document.getElementById('themePanel');
  if (!btn || !panel) return;
  const opts = () => [...panel.querySelectorAll('[data-theme-opt]')];

  const close = (refocus) => { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (refocus) btn.focus(); };
  const open = () => { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); (opts().find((o) => o.tabIndex === 0) ?? opts()[0]).focus(); };

  btn.addEventListener('click', () => (panel.hidden ? open() : close(false)));
  panel.addEventListener('click', (e) => {
    const o = e.target.closest('[data-theme-opt]');
    if (o) { setTheme(o.dataset.themeOpt, current().mode ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')); close(true); }
  });
  document.getElementById('themeMotion')?.addEventListener('click', () => {
    const off = root.getAttribute('data-motion') !== 'off';
    if (off) root.setAttribute('data-motion', 'off'); else root.removeAttribute('data-motion');
    store.set('rk-motion', off ? 'off' : 'on');
    syncUI(); startAmbient(); startCursor();
  });
  document.getElementById('themeMode')?.addEventListener('click', () => setTheme('professional', current().mode === 'dark' ? 'light' : 'dark'));

  panel.addEventListener('keydown', (e) => {
    const list = opts(); const i = list.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.stopPropagation(); close(true); }
    else if (i >= 0 && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) { e.preventDefault(); list[(i + 1) % list.length].focus(); }
    else if (i >= 0 && (e.key === 'ArrowUp' || e.key === 'ArrowLeft')) { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    else if (e.key === 'Tab') close(true);
  });
  document.addEventListener('pointerdown', (e) => { if (!panel.hidden && !e.target.closest('#themeSwitch')) close(false); });
  syncUI();
}

/* ───────────── hero figure: slabs lean toward the pointer ───────────── */

function initFigure() {
  const fig = document.getElementById('heroFigure');
  if (!fig || !finePointer.matches || reduced.matches) return;
  let queued = false;
  addEventListener('pointermove', (e) => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fig.style.setProperty('--px', ((e.clientX / innerWidth) * 2 - 1).toFixed(2));
      fig.style.setProperty('--py', ((e.clientY / innerHeight) * 2 - 1).toFixed(2));
    });
  }, { passive: true });
}

/* ───────────── scroll progress ───────────── */

function initProgress() {
  const el = document.getElementById('scrollProgress');
  if (!el) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    el.style.setProperty('--p', `${max > 0 ? (scrollY / max) * 100 : 0}%`);
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

export function initTheme() {
  canvas = document.querySelector('#ambient canvas');
  ctx = canvas?.getContext('2d');
  halo = document.getElementById('cursorDot');

  addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.moved = 1; if (haloOn && !hraf) hraf = requestAnimationFrame(haloLoop); }, { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (raf) resizeCanvas(); }, 150); });
  document.addEventListener('visibilitychange', () => (document.hidden ? stopAmbient() : startAmbient()));
  reduced.addEventListener('change', () => { startAmbient(); startCursor(); });

  if (store.get('rk-motion') === 'off') root.setAttribute('data-motion', 'off');
  initSwitcher();
  initProgress();
  initFigure();
  startAmbient();
  startCursor();

  const { theme } = current();
  if (theme === 'retro') import('./retro.js').then((m) => m.enableRetro()).catch(() => root.classList.add('rk-retro-failed'));
  if (document.getElementById('hero')) {
    try { if (!sessionStorage.getItem('rk-booted')) { sessionStorage.setItem('rk-booted', '1'); playBoot(theme); } } catch { /* storage blocked: skip the intro */ }
  }
}
