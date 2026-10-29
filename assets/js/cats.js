const G = 1500;
const GRID_W = 26;
const GRID_H = 24;

const PALETTE = {
  orange: { body: '#e8892b', dark: '#b8601b', light: '#fbe6bf', ear: '#f4a9a0', eye: '#20140a', nose: '#e46a6a', rim: '#f3a95a' },
  black: { body: '#1d1d25', dark: '#0f0f15', light: '#3a3a48', ear: '#7a5668', eye: '#a6ec6c', nose: '#8a5a6a', rim: '#56566c' },
};

const BASE = {
  orange: { walk: 54, run: 170, acc: 210, dec: 480, scale: [4, 3], bat: 0.8 },
  black: { walk: 96, run: 270, acc: 420, dec: 800, scale: [3, 2], bat: 1.15 },
};

const HEART = ['.#.#.', '#####', '.###.', '..#..'];
const ZED = ['###', '..#', '.#.', '###'];
const LEVEL = { curl: 0, lie: 1, back: 1, sit: 2, groom: 2, lick: 2, yawn: 2, swat: 2, pet: 2, stretch: 2, walk: 3, crouch: 3, land: 3, hiss: 3, jump: 3, fall: 3, held: 3 };

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sign = (v) => (v < 0 ? -1 : 1);
const pick = (weights) => {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  return Object.keys(weights).find((k) => (r -= weights[k]) < 0) || Object.keys(weights)[0];
};

export function drawCat(ctx, kind, pose, t, dir, s, extra = {}) {
  const P = PALETTE[kind];
  const orange = kind === 'orange';
  ctx.imageSmoothingEnabled = false;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, GRID_W * s, GRID_H * s);
  ctx.setTransform(s * dir, 0, 0, s, dir < 0 ? GRID_W * s : 0, 8 * s);
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const es = extra.eyes || 'open';
  const [lx, ly] = extra.look || [0, 0];
  const lineC = orange ? P.dark : P.light;
  const tall = orange ? 1 : 2;
  const eye = (x, y, state = es) => {
    if (state === 'closed') R(x - 1, y + (tall > 1 ? 1 : 0), 2, 1, lineC);
    else if (state === 'half') R(x, y + (tall > 1 ? 1 : 0), 1, 1, P.eye);
    else R(x + lx, y + ly, 1, tall, P.eye);
  };
  const stripes = (xs, y, h) => { if (orange) xs.forEach((x) => R(x, y, 1, h, P.dark)); };
  const blink = (t % 4.3) < 0.14 && es === 'open' ? 'closed' : es;

  const sitting = (o = {}) => {
    const hy = o.hy || 0;
    const wag = Math.round(Math.sin(t * 2.2));
    const twitch = (t % 6.2) < 0.16 ? 1 : 0;
    R(3, 15, 9, 1, P.body); R(2, 14, 1, 2, P.body); R(2 + wag, 12, 1, 3, P.body); if (orange) R(2 + wag, 12, 1, 1, P.dark);
    R(5, 9, 8, 6, P.body); R(6, 8, 6, 1, P.body); if (!orange) R(6, 8, 6, 1, P.rim);
    R(10, 5, 5, 10, P.body); R(5, 15, 4, 1, P.light);
    R(11, 1 + hy, 7, 6, P.body); R(12, hy, 5, 1, P.body);
    R(11, -1 + hy, 2, 3, P.body); R(16, -1 + hy + twitch, 2, 3 - twitch, P.body); R(12, hy, 1, 1, P.ear); R(16, hy + twitch, 1, 1, P.ear);
    R(16, 4 + hy, 2, 2, P.light); R(18, 4 + hy, 1, 1, P.nose);
    stripes([6, 8], 9, 3); if (orange) { R(14, 1 + hy, 1, 2, P.dark); R(13, 3 + hy, 1, 1, P.dark); }
    R(13, 9, 3, 6, P.body); R(13, 15, 3, 1, P.light);
    if (o.bliss) { R(15, 3 + hy, 1, 1, P.eye); R(14, 4 + hy, 1, 1, P.eye); R(16, 4 + hy, 1, 1, P.eye); }
    else eye(15, 3 + hy, o.eyes || blink);
    if (o.mouth) { R(17, 5 + hy, 2, 2, '#2b0d10'); R(17, 6 + hy, 1, 1, '#e0707a'); }
    if (o.tongue) R(18, 5 + hy, 1, 1, '#ee7d8a');
    if (o.paw != null) { const up = o.paw; R(15, 4 - up, 2, 4, P.light); R(15, 3 - up, 2, 1, P.body); }
    if (o.arm != null) { const e = Math.round(o.arm * 6); R(14, 8, 2 + e, 2, P.body); R(15 + e, 8, 2, 2, P.light); }
  };

  const crouch = (wig) => {
    const w = Math.round(Math.sin(t * 30) * wig);
    R(0, 10, 4, 1, P.body); R(3 + w, 9, 3, 4, P.body); R(4, 10, 12, 4, P.body);
    R(15, 9, 6, 4, P.body); R(15, 7, 2, 3, P.body); R(19, 7, 2, 3, P.body); R(16, 8, 1, 1, P.ear);
    R(19, 11, 2, 2, P.light); eye(18, 10);
    R(5, 14, 2, 2, P.body); R(8, 14, 2, 2, P.body); R(14, 14, 3, 2, P.body); R(17, 14, 3, 2, P.light);
    stripes([7, 10], 10, 3);
  };

  if (pose === 'walk') {
    const s1 = Math.round(Math.sin(t * 5)), s2 = Math.round(Math.sin(t * 5 + 1) * 1.5);
    [[3, 9], [2, 8], [2, 7], [3 + s1, 6], [3 + s2, 5]].forEach(([x, y]) => R(x, y, 1, 1, P.body));
    R(4, 8, 12, 5, P.body); R(5, 7, 10, 1, P.body); R(6, 12, 8, 1, P.light);
    if (!orange) R(5, 7, 10, 1, P.rim);
    stripes([7, 10, 13], 7, 3);
    R(15, 5, 6, 5, P.body); R(16, 4, 4, 1, P.body);
    R(15, 2, 2, 3, P.body); R(19, 2, 2, 3, P.body); R(16, 3, 1, 1, P.ear); R(19, 3, 1, 1, P.ear);
    R(19, 8, 2, 2, P.light); R(21, 8, 1, 1, P.nose);
    if (orange) R(16, 6, 1, 1, P.dark);
    eye(18, 6);
    [[5, 0], [7, Math.PI], [12, Math.PI], [14, 0]].forEach(([x, ph]) => {
      const len = 3 - (Math.sin(t * 14 + ph) > 0.5 ? 1 : 0);
      R(x, 13, 2, len, P.body); R(x, 12 + len, 2, 1, P.light);
    });
  } else if (pose === 'sit') sitting();
  else if (pose === 'groom') sitting({ paw: Math.floor(t * 4) % 2 });
  else if (pose === 'pet') sitting({ bliss: true });
  else if (pose === 'lick') sitting({ hy: 2, tongue: Math.floor(t * 5) % 2 === 0, eyes: 'closed' });
  else if (pose === 'yawn') sitting({ mouth: true, eyes: 'closed' });
  else if (pose === 'swat') sitting({ arm: extra.arm || 0 });
  else if (pose === 'lie') {
    const wag = Math.round(Math.sin(t * 1.6));
    R(1, 13, 3, 3, P.body); R(1, 12 + wag, 1, 1, orange ? P.dark : P.body);
    R(4, 10, 13, 6, P.body); R(5, 9, 11, 1, P.body); if (!orange) R(5, 9, 11, 1, P.rim);
    stripes([6, 9, 12], 10, 3);
    R(15, 14, 5, 2, P.body); R(18, 15, 3, 1, P.light);
    R(14, 6, 7, 6, P.body); R(15, 5, 5, 1, P.body);
    R(14, 4, 2, 3, P.body); R(19, 4, 2, 3, P.body); R(15, 5, 1, 1, P.ear); R(19, 5, 1, 1, P.ear);
    R(19, 9, 2, 2, P.light); R(21, 9, 1, 1, P.nose);
    if (orange) R(15, 8, 1, 1, P.dark);
    eye(17, 7, blink);
  } else if (pose === 'curl') {
    const b = Math.round((Math.sin(t * 1.8) + 1) / 2);
    const tw = (t % 6.5) < 0.3 ? 1 : 0;
    R(3, 10 + b, 16, 6 - b, P.body); R(5, 9 + b, 12, 1, P.body); if (!orange) R(5, 9 + b, 12, 1, P.rim);
    R(14, 11, 6, 5, P.body); R(15, 9, 2, 2, P.body); R(18, 9 + tw, 2, 2 - tw, P.body); R(16, 9, 1, 1, P.ear);
    R(2, 13, 3, 3, P.body); R(4, 15, 14, 1, orange ? P.dark : P.light);
    eye(17, 13, 'closed'); R(19, 14, 1, 1, P.nose);
    stripes([6, 9, 12], 10 + b, 3);
  } else if (pose === 'stretch') {
    const k = Math.round(Math.sin(t * 3));
    R(1, 3 + k, 1, 5, P.body);
    R(3, 7, 5, 5, P.body); R(2, 12, 2, 4, P.body); R(5, 12, 2, 4, P.body);
    R(7, 8, 5, 4, P.body); R(11, 10, 5, 4, P.body);
    R(15, 12, 5, 4, P.body); R(15, 10, 2, 2, P.body); R(18, 10, 2, 2, P.body);
    R(11, 14, 8, 2, P.body); R(17, 14, 3, 2, P.light);
    R(19, 14, 2, 2, P.light); R(21, 14, 1, 1, P.nose); eye(17, 13, 'closed');
    stripes([5, 8], 8, 3);
  } else if (pose === 'crouch') crouch(1);
  else if (pose === 'land') crouch(0);
  else if (pose === 'jump') {
    R(0, 8, 5, 1, P.body); R(5, 7, 11, 4, P.body); R(6, 6, 9, 1, P.body);
    R(16, 5, 6, 4, P.body); R(16, 3, 2, 2, P.body); R(20, 3, 2, 2, P.body); R(17, 4, 1, 1, P.ear);
    R(20, 7, 2, 2, P.light); eye(19, 6, 'open');
    R(16, 10, 5, 1, P.body); R(19, 11, 3, 1, P.light); R(1, 10, 5, 1, P.body); R(3, 11, 3, 1, P.light);
    stripes([8, 11], 6, 3);
  } else if (pose === 'fall') {
    R(3, 1, 1, 5, P.body); R(4, 6, 1, 1, P.body);
    R(5, 5, 11, 5, P.body); R(6, 4, 9, 1, P.body);
    R(15, 2, 6, 5, P.body); R(15, 0, 2, 3, P.body); R(19, 0, 2, 3, P.body); R(16, 1, 1, 1, P.ear);
    R(19, 5, 2, 2, P.light); eye(18, 3, 'open');
    [[5, 11], [8, 11], [12, 10], [14, 11]].forEach(([x, y], i) => R(x + (i % 2 ? 1 : -1), y, 2, 4, P.body));
    stripes([7, 10, 13], 5, 3);
  } else if (pose === 'held') {
    const sw = Math.round(Math.sin(t * 4) * 1.5);
    R(10, 0, 6, 5, P.body); R(10, -2, 2, 3, P.body); R(14, -2, 2, 3, P.body); R(11, -1, 1, 1, P.ear);
    R(14, 2, 2, 2, P.light); eye(13, 2, 'open');
    R(9, 5, 6, 8, P.body); stripes([10, 12], 5, 3);
    R(9, 13, 2, 3, P.body); R(13, 13, 2, 3, P.body); R(8 + sw, 13, 2, 2, P.light);
    R(7 + sw, 12, 1, 5, P.body); R(6 + sw, 16, 1, 2, P.body);
  } else if (pose === 'hiss') {
    R(1, 2, 2, 8, P.body); R(0, 1, 1, 2, P.body);
    R(5, 10, 2, 6, P.body); R(8, 10, 2, 6, P.body); R(12, 10, 2, 6, P.body); R(14, 10, 2, 6, P.body);
    R(5, 6, 10, 5, P.body); R(7, 4, 6, 2, P.body);
    [[6, 5], [8, 3], [10, 3], [12, 4], [14, 5]].forEach(([x, y]) => R(x, y, 1, 1, orange ? P.rim : P.light));
    R(15, 7, 6, 5, P.body); R(15, 6, 2, 1, P.body); R(19, 6, 2, 1, P.body);
    R(19, 10, 2, 2, P.light); R(20, 10, 2, 1, '#2b0d10'); R(20, 9, 1, 1, '#ffffff');
    eye(18, 8, 'open'); stripes([7, 10, 13], 6, 3);
  } else if (pose === 'back') {
    const k = Math.floor(t * 9) % 2;
    R(1, 14, 3, 1, P.body);
    R(4, 12, 14, 4, P.body); R(5, 12, 12, 2, P.light); if (!orange) R(5, 12, 12, 1, P.rim);
    R(5, 9 + k, 1, 3, P.body); R(8, 9 + (1 - k), 1, 3, P.body); R(14, 9 + k, 1, 3, P.body); R(17, 9 + (1 - k), 1, 3, P.body);
    R(17, 11, 5, 5, P.body); R(17, 10, 2, 2, P.body); R(20, 10, 2, 2, P.body);
    R(19, 14, 2, 2, P.light); R(20, 15, 2, 1, '#2b0d10');
    eye(19, 12, 'open'); stripes([7, 10, 13], 12, 3);
  }

  if (extra.heart != null) {
    const y = -6 - extra.heart * 4;
    ctx.globalAlpha = 1 - extra.heart * 0.8;
    HEART.forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') R(13 + i, y + j, 1, 1, '#e0404f'); }));
    ctx.globalAlpha = 1;
  }
  if (pose === 'curl') {
    [0, 0.5].forEach((o, k) => {
      const f = (t * 0.4 + o) % 1;
      ctx.globalAlpha = 1 - f;
      ZED.forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') R(19 + k * 3 + i, 5 - f * 6 + j - k * 2, 1, 1, '#eafcff'); }));
      ctx.globalAlpha = 1;
    });
  }
}

function ballFrame(n) {
  const g = 11, c = document.createElement('canvas');
  c.width = c.height = g;
  const x = c.getContext('2d');
  const a = (n * Math.PI) / 8;
  for (let j = 0; j < g; j++) {
    for (let i = 0; i < g; i++) {
      const dx = i - 5, dy = j - 5, d = dx * dx + dy * dy;
      if (d > 25) continue;
      const u = dx * Math.cos(a) + dy * Math.sin(a);
      let col = Math.floor(u + 10) % 4 === 0 ? '#ff9a8f' : '#d6342b';
      if (d > 14 && dy > 0) col = col === '#ff9a8f' ? '#e0605a' : '#a3231d';
      if (dx <= -1 && dy <= -2 && d < 14) col = '#ffd6d0';
      x.fillStyle = col;
      x.fillRect(i, j, 1, 1);
    }
  }
  return c;
}

class Cat {
  constructor(kind, scale) {
    this.kind = kind;
    this.b = BASE[kind];
    this.s = scale;
    this.t = Math.random() * 10;
    this.gait = 0;
    this.pose = 'sit';
    this.eyes = 'open';
    this.look = [0, 0];
    this.arm = 0;
    this.heart = null;
    this.heartAt = -9;
    this.face = Math.random() < 0.5 ? 1 : -1;
    this.mode = 'ground';
    this.x = 0; this.y = 0; this.vx = 0; this.vy = 0; this.sp = 0; this.want = 0;
    this.on = null; this.rel = 0;
    this.queue = []; this.step = null;
    this.jump = null;
    this.dropOK = false;
    this.petT = 0;
    this.shake = false;
    this.syncId = '';
    this.asleep = 1; this.total = 2;
    this.sig = '';
    this.el = document.createElement('div');
    this.el.className = `rk-cat rk-cat--${kind}`;
    this.el.setAttribute('aria-hidden', 'true');
    this.canvas = document.createElement('canvas');
    this.canvas.width = GRID_W * scale; this.canvas.height = GRID_H * scale;
    this.el.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  get w() { return GRID_W * this.s; }
  get h() { return GRID_H * this.s; }
  get idle() { return !this.step && !this.queue.length; }
  get free() { return this.mode === 'ground' && (this.step ? this.step.fill : true) && this.queue.every((x) => x.fill || x.bridge); }
}

let world = null;
let timeScale = 1;

function surfaces(floorY, headroom) {
  const out = [{ el: null, top: floorY, l: 0, r: innerWidth, left: 0 }];
  document.querySelectorAll('.rk-win').forEach((el) => {
    if (el.hidden || el.classList.contains('rk-win--max') || el.classList.contains('rk-win--min-anim') || el.classList.contains('rk-win--restore-anim')) return;
    const r = el.getBoundingClientRect();
    if (r.width < 120 || r.top < headroom || r.top > floorY - 40) return;
    out.push({ el, top: r.top, l: r.left + 8, r: r.right - 8, left: r.left });
  });
  return out;
}

function mount(still) {
  if (world) return world;
  const layer = document.createElement('div');
  layer.className = 'rk-cats';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const small = innerWidth < 700;
  const O = new Cat('orange', BASE.orange.scale[small ? 1 : 0]);
  const B = new Cat('black', BASE.black.scale[small ? 1 : 0]);
  const cats = [O, B];
  const otherOf = (c) => (c === O ? B : O);

  const yarn = document.createElement('canvas');
  yarn.className = 'rk-yarn';
  yarn.width = innerWidth; yarn.height = innerHeight;
  layer.appendChild(yarn);
  const yctx = yarn.getContext('2d');
  const frames = Array.from({ length: 8 }, (_, i) => ballFrame(i));
  const ball = { on: false, air: true, el: null, x: 0, y: 0, vx: 0, vy: 0, rot: 0, trail: [], held: false, leaving: false, attach: null, r: 11, lastTrail: null };

  cats.forEach((c) => layer.appendChild(c.el));

  const taskbar = () => document.querySelector('.rk-taskbar');
  const floorY = () => (taskbar() ? taskbar().getBoundingClientRect().top : innerHeight - 44);
  const headroom = () => Math.max(O.h, B.h) * 0.72;
  O.x = innerWidth * 0.58; B.x = innerWidth * 0.36;
  cats.forEach((c) => { c.y = floorY(); });

  const pointer = { x: -1, y: -1, t: 0 };
  const onMove = (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = performance.now(); };
  addEventListener('pointermove', onMove, { passive: true });
  const cursorRecent = () => pointer.x >= 0 && performance.now() - pointer.t < 6000;

  const surfOf = (c, S) => (c.on ? S.find((s) => s.el === c.on) || S[0] : S[0]);
  const lookAt = (c, tx, ty) => [clamp(Math.round((tx - c.x) * c.face / 60), -1, 1), clamp(Math.round((ty - (c.y - c.h * 0.6)) / 90), -1, 1)];

  /* ───────── pose bridging: every change walks the ladder, never jumps ───────── */
  const beat = (pose, dur, o = {}) => ({ k: 'pose', pose, dur, ...o });
  const bridge = (from, to) => {
    const a = LEVEL[from] ?? 2, b = LEVEL[to] ?? 2, out = [];
    if (a === b) return out;
    if (b > a) {
      if (a === 0 && to !== 'lie') out.push(beat('lie', 0.55, { eyes: 'half' }));
      if (a <= 1 && b >= 2) { if (a === 0) out.push(beat('stretch', 1.1)); out.push(beat('sit', a === 0 ? 0.25 : 0.3)); }
    } else {
      if (a === 3 && b <= 1) out.push(beat('sit', 0.3));
      if (a >= 2 && b === 0) out.push(beat('lie', 0.5));
    }
    return out;
  };
  const enqueue = (c, steps) => {
    let prev = c.queue.length ? c.queue[c.queue.length - 1].endPose || c.pose : (c.step && c.step.endPose) || c.pose;
    steps.filter(Boolean).forEach((st) => {
      const target = st.k === 'pose' ? st.pose : ['walk', 'follow', 'flee', 'yarn', 'leap', 'hop', 'drop'].includes(st.k) ? 'walk' : null;
      if (target) { bridge(prev, target).forEach((x) => c.queue.push({ ...x, endPose: x.pose, bridge: true })); prev = target; st.endPose = target; }
      c.queue.push(st);
    });
  };

  const walk = (x, run) => ({ k: 'walk', x, run });
  const sit = (dur, o) => beat('sit', dur, o);
  const wait = (dur) => ({ k: 'wait', dur });
  const face = (dir) => ({ k: 'face', dir });
  const faceCat = (who) => ({ k: 'face', who });
  const drop = () => ({ k: 'drop' });
  const sync = (id) => ({ k: 'sync', id });

  /* ───────── physics helpers ───────── */
  const land = (c, s) => {
    c.mode = 'ground'; c.vx = c.vy = 0; c.sp = 0; c.jump = null; c.step = null;
    c.y = s.top; c.on = s.el; c.rel = c.x - (s.el ? s.left : 0);
    c.queue.unshift({ k: 'pose', pose: 'land', dur: 0.2 });
  };
  const tryLeap = (c, S, only) => {
    const cand = S.filter((s) => s.el !== c.on && s.top <= c.y + 10 && c.y - s.top <= 800 && (!only || s.el === only));
    if (!cand.length) return false;
    const near = cand.map((s) => { const tx = clamp(c.x, s.l + 24, s.r - 24); return { s, tx, d: Math.abs(tx - c.x) + (c.y - s.top) * 0.3 }; }).filter((o) => Math.abs(o.tx - c.x) < 300).sort((a, b) => a.d - b.d)[0];
    if (!near) return false;
    const T = 0.6 + Math.max(0, c.y - near.s.top) / 1000;
    c.jump = { s: near.s, tx: near.tx, T, t: 0 };
    c.vy = (near.s.top - c.y) / T - 0.5 * G * T;
    c.vx = (near.tx - c.x) / T;
    c.mode = 'air'; c.face = c.vx >= 0 ? 1 : -1; c.on = null; c.step = null;
    return true;
  };
  const startFall = (c, vx, vy) => { c.mode = 'air'; c.vx = vx; c.vy = vy; c.jump = null; c.on = null; c.step = null; c.sp = 0; };

  /* ───────── the yarn ball ───────── */
  const spawnBall = () => {
    const fromLeft = Math.random() < 0.5;
    const fl = floorY();
    Object.assign(ball, { on: true, air: true, el: null, x: fromLeft ? -20 : innerWidth + 20, y: fl - 20, vx: fromLeft ? rand(360, 480) : -rand(360, 480), vy: -160, rot: 0, trail: [{ x: fromLeft ? -40 : innerWidth + 40, y: fl }], held: false, leaving: false, attach: null });
  };
  const sendBallAway = () => { if (ball.on && !ball.leaving) { ball.leaving = true; ball.attach = null; ball.air = true; ball.vx = (ball.x < innerWidth / 2 ? -1 : 1) * 620; ball.vy = -200; } };
  const batBall = (from, power) => {
    const d = sign(ball.x - from.x);
    ball.vx += d * power; ball.vy = -rand(90, 230); ball.air = true; ball.el = null; ball.attach = null;
  };

  const updateBall = (dt, S) => {
    if (!ball.on) return;
    if (ball.held) return;
    if (ball.attach) {
      const c = ball.attach;
      ball.x = c.x + c.face * 30; ball.y = c.y; ball.vx = ball.vy = 0; ball.air = false; ball.el = c.on;
      return;
    }
    if (ball.air) {
      const py = ball.y;
      ball.vy += G * dt; ball.x += ball.vx * dt; ball.y += ball.vy * dt;
      if (ball.vy > 0) {
        const hit = S.filter((s) => ball.x >= s.l && ball.x <= s.r && py <= s.top + 3 && ball.y >= s.top).sort((a, b) => a.top - b.top)[0];
        if (hit) {
          ball.y = hit.top;
          if (ball.vy > 170) { ball.vy = -ball.vy * 0.46; ball.vx *= 0.88; }
          else { ball.vy = 0; ball.air = false; ball.el = hit.el; ball.rel = ball.x - (hit.el ? hit.left : 0); }
        }
      }
    } else {
      const sf = S.find((s) => s.el === ball.el);
      if (!sf) { ball.air = true; return; }
      ball.vx *= Math.max(0, 1 - 0.85 * dt);
      if (Math.abs(ball.vx) < 4) ball.vx = 0;
      ball.rel += ball.vx * dt;
      ball.x = (ball.el ? sf.left : 0) + ball.rel; ball.y = sf.top;
      if (ball.x < sf.l - 4 || ball.x > sf.r + 4) { if (ball.el) ball.air = true; }
    }
    if (!ball.leaving) {
      if (ball.x < 12) { ball.x = 12; ball.vx = Math.abs(ball.vx) * 0.6; if (!ball.air) ball.rel = ball.x - (ball.el ? S.find((s) => s.el === ball.el).left : 0); }
      if (ball.x > innerWidth - 12) { ball.x = innerWidth - 12; ball.vx = -Math.abs(ball.vx) * 0.6; if (!ball.air) ball.rel = ball.x - (ball.el ? S.find((s) => s.el === ball.el).left : 0); }
    } else if (ball.x < -50 || ball.x > innerWidth + 50) { ball.on = false; ball.trail = []; yctx.clearRect(0, 0, yarn.width, yarn.height); return; }
    ball.rot += ball.vx * dt / 8;
    const lt = ball.trail[ball.trail.length - 1];
    if (!lt || Math.hypot(ball.x - lt.x, ball.y - lt.y) > 7) { ball.trail.push({ x: ball.x, y: ball.y }); if (ball.trail.length > 70) ball.trail.shift(); }
  };

  const drawBall = () => {
    if (yarn.width !== innerWidth || yarn.height !== innerHeight) { yarn.width = innerWidth; yarn.height = innerHeight; }
    yctx.clearRect(0, 0, yarn.width, yarn.height);
    if (!ball.on) return;
    yctx.imageSmoothingEnabled = false;
    yctx.strokeStyle = '#e8483f'; yctx.lineWidth = 2; yctx.lineJoin = 'round'; yctx.lineCap = 'round';
    yctx.beginPath();
    ball.trail.forEach((p, i) => { const jx = Math.sin(i * 1.7) * 1.4; if (i === 0) yctx.moveTo(p.x, p.y - 2 + jx); else yctx.lineTo(p.x, p.y - 2 + jx); });
    yctx.lineTo(ball.x, ball.y - 2); yctx.stroke();
    const f = frames[((Math.floor(ball.rot) % 8) + 8) % 8];
    yctx.drawImage(f, Math.round(ball.x - 11), Math.round(ball.y - 22), 22, 22);
  };

  /* ───────── pick up / pet / throw ───────── */
  let held = null;
  const hitCat = (e) => cats.find((c) => {
    const r = c.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left) / c.s), y = Math.floor((e.clientY - r.top) / c.s);
    if (x < 0 || y < 0 || x >= GRID_W || y >= GRID_H) return false;
    return c.ctx.getImageData(x * c.s, y * c.s, 1, 1).data[3] > 0;
  });
  const hitBall = (e) => ball.on && Math.hypot(e.clientX - ball.x, e.clientY - (ball.y - 11)) < 16;
  const startHold = (e) => {
    if (e.button > 0) return;
    const c = hitCat(e);
    const target = c || (hitBall(e) ? ball : null);
    if (!target) return;
    e.preventDefault(); e.stopPropagation();
    held = { target, sx: e.clientX, sy: e.clientY, moved: false, samples: [] };
  };
  addEventListener('pointerdown', startHold, true);
  const hover = (e) => { document.documentElement.style.cursor = held ? 'grabbing' : hitCat(e) || hitBall(e) ? 'grab' : ''; };
  addEventListener('pointermove', hover, { passive: true });
  const holdMove = (e) => {
    if (!held) return;
    const tg = held.target;
    if (!held.moved && Math.hypot(e.clientX - held.sx, e.clientY - held.sy) > 6) {
      held.moved = true;
      if (tg === ball) { ball.held = true; ball.attach = null; ball.leaving = false; }
      else { tg.mode = 'held'; tg.on = null; tg.jump = null; tg.step = null; tg.queue = []; tg.petT = 0; tg.pose = 'held'; tg.eyes = 'open'; }
    }
    if (held.moved) {
      if (tg === ball) { ball.x = e.clientX; ball.y = e.clientY + 8; } else { tg.x = e.clientX; tg.y = e.clientY + tg.h * 0.55; }
      held.samples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (held.samples.length > 5) held.samples.shift();
    }
  };
  const holdEnd = () => {
    if (!held) return;
    const { target: tg, moved, samples } = held;
    held = null;
    if (!moved) {
      if (tg === ball) return;
      tg.petT = 1.7; tg.heartAt = tg.t;
      return;
    }
    const a = samples[0], b = samples[samples.length - 1];
    const dt = Math.max(0.016, (b.t - a.t) / 1000);
    const vx = clamp((b.x - a.x) / dt, -900, 900), vy = clamp((b.y - a.y) / dt, -700, 400);
    if (tg === ball) { ball.held = false; ball.air = true; ball.el = null; ball.vx = vx; ball.vy = vy; }
    else startFall(tg, clamp(vx, -500, 500), clamp(vy, -500, 300));
  };
  addEventListener('pointermove', holdMove);
  addEventListener('pointerup', holdEnd);
  addEventListener('pointercancel', holdEnd);

  /* ───────── step runner ───────── */
  const setWalkPose = (c) => { const p = Math.abs(c.sp) > 10 ? 'walk' : 'sit'; if (c.pose !== p) { c.pose = p; c.poseT = 0; } c.eyes = 'open'; c.look = [0, 0]; };
  const heartTick = (c, st, interval) => { if (interval && (st.t % interval) < 0.04 && c.t - c.heartAt > interval - 0.2) c.heartAt = c.t; };

  const STEP = {
    pose(c, st, dt) {
      if (st.t === undefined) {
        st.t = 0; c.pose = st.pose; c.poseT = 0; c.eyes = st.eyes || (st.pose === 'curl' ? 'closed' : 'open'); c.shake = !!st.shake; c.arm = 0;
        if (st.dir != null) c.face = st.dir;
        if (st.who) c.face = sign(otherOf(c).x - c.x);
      }
      st.t += dt; c.want = 0;
      if (st.watch) { const tg = st.watch === 'ball' && ball.on ? [ball.x, ball.y - 20] : cursorRecent() ? [pointer.x, pointer.y] : null; c.look = tg ? lookAt(c, tg[0], tg[1]) : [0, 0]; if (tg && st.watch !== 'ball' && Math.abs(tg[0] - c.x) > 50 && (st.t % 1.5) < dt) c.face = sign(tg[0] - c.x); } else c.look = [0, 0];
      if (st.pose === 'swat') c.arm = Math.sin(clamp(st.t / st.dur, 0, 1) * Math.PI);
      heartTick(c, st, st.hearts);
      if (st.eyesAt && st.t > st.eyesAt) c.eyes = st.eyesTo || 'open';
      const done = st.t >= st.dur;
      if (done) { c.shake = false; c.arm = 0; }
      return done;
    },
    wait(c, st, dt) { st.t = (st.t || 0) + dt; c.want = 0; setWalkPose(c); return st.t >= st.dur; },
    face(c, st, dt) { st.t = (st.t || 0) + dt; c.want = 0; setWalkPose(c); if (st.t === dt) c.face = st.who ? sign(otherOf(c).x - c.x) : st.dir; return st.t >= 0.14; },
    walk(c, st, dt, S) {
      st.t = (st.t || 0) + dt;
      const sf = surfOf(c, S);
      const x = st.x === 'center' ? (sf.l + sf.r) / 2 : st.x;
      const tx = clamp(x, sf.l + 12, sf.r - 12), dx = tx - c.x, dist = Math.abs(dx);
      const v = c.b[st.run ? 'run' : 'walk'] * (st.mul || 1);
      c.want = Math.sign(dx) * Math.min(v, Math.sqrt(2 * c.b.dec * dist));
      setWalkPose(c);
      return (dist < 6 && Math.abs(c.sp) < 25) || st.t > 25;
    },
    follow(c, st, dt, S) {
      st.t = (st.t || 0) + dt;
      const o = otherOf(c), sf = surfOf(c, S);
      const tx = clamp(o.x - Math.sign(o.x - c.x) * st.gap, sf.l + 12, sf.r - 12), dx = tx - c.x, dist = Math.abs(dx);
      const v = c.b[st.run ? 'run' : 'walk'];
      c.want = Math.sign(dx) * Math.min(v, Math.sqrt(2 * c.b.dec * dist) + 18);
      setWalkPose(c);
      return st.t >= st.dur || (st.until === 'near' && Math.abs(o.x - c.x) <= st.gap + 14 && Math.abs(c.sp) < 90);
    },
    flee(c, st, dt, S) {
      st.t = (st.t || 0) + dt;
      const o = otherOf(c), sf = surfOf(c, S);
      const away = -Math.sign(o.x - c.x) || 1;
      const atEdge = (away < 0 && c.x < sf.l + 40) || (away > 0 && c.x > sf.r - 40);
      c.want = atEdge ? 0 : away * c.b.run; setWalkPose(c);
      return st.t >= st.dur || (atEdge && Math.abs(c.sp) < 30);
    },
    sync(c, st, dt) {
      st.t = (st.t || 0) + dt; c.syncId = st.id; c.want = 0; setWalkPose(c);
      const o = otherOf(c);
      if (Math.abs(o.x - c.x) > 30 && Math.abs(c.sp) < 20 && c.pose === 'sit') c.face = sign(o.x - c.x);
      return o.syncId === st.id || st.t > 7;
    },
    act(c, st) { st.fn(c, otherOf(c)); return true; },
    drop(c, st, dt, S) {
      if (!c.on) return true;
      const sf = surfOf(c, S);
      c.dropOK = true; c.want = ((c.x - sf.l) < (sf.r - c.x) ? -1 : 1) * c.b.walk; setWalkPose(c);
      return false;
    },
    leap(c, st, dt, S) {
      st.t = (st.t || 0) + dt; c.want = 0;
      if (st.t < 0.02) {
        const ok = S.some((s) => s.el !== c.on && s.top <= c.y + 10 && c.y - s.top <= 800 && Math.abs(clamp(c.x, s.l + 24, s.r - 24) - c.x) < 300);
        if (!ok) return true;
        c.pose = 'crouch'; c.poseT = 0;
      }
      if (st.t >= 0.34) { if (!tryLeap(c, S)) return true; return 'switched'; }
      return false;
    },
    hop(c, st, dt) {
      st.t = (st.t || 0) + dt; c.want = 0;
      if (st.t < 0.02) { c.pose = 'crouch'; c.poseT = 0; c.face = sign(otherOf(c).x - c.x); }
      if (st.t >= 0.28) {
        const o = otherOf(c), tx = o.x - sign(o.x - c.x) * st.gap, T = 0.4;
        startFall(c, (tx - c.x) / T, -0.5 * G * T); c.face = sign(tx - c.x);
        return 'switched';
      }
      return false;
    },
    yarn(c, st, dt, S) {
      st.t = (st.t || 0) + dt;
      if (!ball.on || ball.leaving || st.t >= st.dur) { if (ball.attach === c) ball.attach = null; return true; }
      const sf = surfOf(c, S);
      st.ph = st.ph || 'seek'; st.n = st.n || 0;
      if (ball.attach === c) {
        c.want = 0; c.pose = 'crouch'; c.eyes = 'open';
        st.hold = (st.hold || 0) + dt;
        if (st.hold > 1.9) { c.face = c.face; ball.attach = null; ball.vx = c.face * 300; ball.vy = -170; ball.air = true; ball.el = null; st.ph = 'seek'; st.hold = 0; c.pose = 'sit'; }
        return false;
      }
      if (!ball.air && ball.el !== c.on) {
        if (ball.el === null) { c.dropOK = true; c.want = ((c.x - sf.l) < (sf.r - c.x) ? -1 : 1) * c.b.walk; setWalkPose(c); return false; }
        if (!tryLeap(c, S, ball.el)) return true;
        return 'switched';
      }
      if (st.ph === 'seek') {
        const moving = Math.abs(ball.vx) > 90 || ball.air;
        const bd = st.bd || (st.bd = ball.x < innerWidth / 2 ? 1 : -1);
        const tx = moving ? ball.x + ball.vx * 0.25 : ball.x - bd * 40;
        const dx = clamp(tx, sf.l + 12, sf.r - 12) - c.x, dist = Math.abs(dx);
        const v = c.b[moving && dist > 120 ? 'run' : 'walk'];
        c.want = Math.sign(dx) * Math.min(v, Math.sqrt(2 * c.b.dec * dist));
        setWalkPose(c);
        if (Math.abs(c.sp) < 14) c.face = sign(ball.x - c.x);
        if (!moving && dist < 14 && !ball.air) {
          if (st.n >= 2 && !st.held && Math.random() < 0.3 && Math.abs(ball.x - c.x) < 60) { st.held = true; ball.attach = c; c.face = sign(ball.x - c.x); return false; }
          st.ph = 'stalk'; st.pt = 0; st.pd = rand(0.35, 0.8); st.bd = 0; c.pose = 'crouch'; c.poseT = 0;
        }
        return false;
      }
      if (st.ph === 'stalk') {
        c.want = 0; c.pose = 'crouch'; c.face = sign(ball.x - c.x); st.pt += dt;
        if (st.pt >= st.pd) { st.ph = 'bat'; st.pt = 0; st.hit = false; c.pose = 'swat'; c.poseT = 0; }
        return false;
      }
      c.want = 0; c.pose = 'swat'; st.pt += dt; c.arm = Math.sin(clamp(st.pt / 0.3, 0, 1) * Math.PI);
      if (!st.hit && st.pt > 0.1) { st.hit = true; st.n++; if (Math.abs(ball.x - c.x) < 90) batBall(c, rand(180, 440) * c.b.bat); }
      if (st.pt >= 0.3) { st.ph = 'seek'; c.arm = 0; }
      return false;
    },
  };

  /* ───────── solo behaviour ───────── */
  const spotNear = (c, S, span = 350) => {
    const sf = surfOf(c, S), o = otherOf(c);
    for (let i = 0; i < 8; i += 1) {
      const x = clamp(c.x + rand(-span, span), sf.l + 30, sf.r - 30);
      if (Math.abs(x - o.x) > 70 || o.on !== c.on) return x;
    }
    return c.x;
  };
  const soloActivity = (c, S) => {
    const orange = c.kind === 'orange';
    const k = pick(orange ? { explore: 0.22, watch: 0.22, groom: 0.16, loaf: 0.24, stretch: 0.08, hop: 0.08 } : { explore: 0.2, watch: 0.14, groom: 0.08, loaf: 0.1, stretch: 0.06, hop: 0.14, zoomies: 0.14, cursor: 0.14 });
    const W = innerWidth;
    if (k === 'explore') return [walk(spotNear(c, S)), sit(rand(1.2, 3.5), { watch: true })];
    if (k === 'watch') return [sit(rand(3, 7), { watch: true })];
    if (k === 'groom') return [sit(0.3), beat('groom', rand(2.4, 4))];
    if (k === 'loaf') return [beat('lie', rand(5, 10), { watch: true })];
    if (k === 'stretch') return [beat('stretch', 1.3), beat('yawn', 1.2), sit(1)];
    if (k === 'hop') return S.length > 1 ? [{ k: 'leap' }, sit(rand(3, 6), { watch: true })] : [walk(spotNear(c, S))];
    if (k === 'zoomies') return [walk(rand(80, W - 80), true), beat('crouch', 0.5), walk(rand(80, W - 80), true), walk(rand(80, W - 80), true), sit(rand(1.5, 3))];
    if (k === 'cursor') return cursorRecent() ? [walk(pointer.x, true), sit(rand(2, 3.5), { watch: true })] : [walk(spotNear(c, S))];
    return [sit(2)];
  };
  const soloFor = (c, S, total) => {
    const steps = [];
    let sum = 0;
    while (sum < total) { const s = soloActivity(c, S).map((x) => ({ ...x, fill: true })); steps.push(...s); sum += s.reduce((a, b) => a + (b.dur || 3), 0); }
    return steps;
  };

  /* ───────── scenes ───────── */
  let sceneN = 0;
  const dir = { scene: '', last: '', lastPair: '' };
  const mx = (pad = 260) => rand(pad, Math.max(pad + 10, innerWidth - pad));
  const napSpot = (c, x, d, f, o = {}) => [drop(), walk(x), face(f), beat('curl', d, o)];

  const PAIR = {
    sideBySide(id) {
      const f = Math.random() < 0.5 ? 1 : -1, x = mx(), d = rand(8, 13);
      enqueue(O, [drop(), walk(x), face(f), sync(id), sit(d, { watch: true }), Math.random() < 0.5 ? beat('lie', rand(4, 7)) : null]);
      enqueue(B, [drop(), walk(x - f * 62), face(f), sync(id), sit(d + rand(-1, 1), { watch: true }), beat('lie', rand(3, 6))]);
    },
    groom(id) {
      const x = mx(), d = rand(4.5, 6.5), f = Math.random() < 0.5 ? 1 : -1;
      enqueue(B, [drop(), walk(x), face(-f), sync(id), beat('pet', d, { hearts: 2.2 }), Math.random() < 0.4 ? beat('lick', rand(2, 3)) : sit(1.5)]);
      enqueue(O, [drop(), walk(x - f * 52), face(f), sync(id), beat('lick', d, { hearts: 2.6 }), sit(1.2), beat('groom', rand(2, 3.5))]);
    },
    wrestle(id) {
      const x = mx(), d = rand(2.4, 3.4), blackLoses = Math.random() < 0.7;
      const flee = (c) => ({ k: 'flee', dur: 1.1 });
      enqueue(O, [drop(), walk(x - 38), face(1), sync(id + 'a'), beat('crouch', 0.5), sync(id + 'b'), beat('back', d, { shake: true }), blackLoses ? sit(1.6) : flee(O), sit(rand(2, 3.5)), beat('groom', 2.5)]);
      enqueue(B, [drop(), walk(x + 38), face(-1), sync(id + 'a'), beat('crouch', 0.5), sync(id + 'b'), beat('back', d, { shake: true }), blackLoses ? flee(B) : sit(1.6), sit(rand(2, 3.5)), beat('lie', rand(3, 5))]);
    },
    chase(id) {
      const bChases = Math.random() < 0.65, [R, C] = bChases ? [O, B] : [B, O], x = mx(240);
      const p = () => rand(120, innerWidth - 120);
      enqueue(R, [drop(), walk(x), sit(0.8, { who: true }), sync(id), walk(p(), true), walk(p(), true), walk(p(), true), walk(x, true), sync(id + 'e'), sit(0.6), beat('back', 2.2, { shake: true }), sit(rand(2.5, 4)), beat('lie', rand(3, 5))]);
      enqueue(C, [drop(), walk(x + (Math.random() < 0.5 ? -150 : 150)), beat('crouch', 0.9), sync(id), { k: 'follow', gap: 36, dur: 9, run: true, until: 'near' }, sync(id + 'e'), beat('crouch', 0.3), beat('back', 2.2, { shake: true }), sit(rand(2.5, 4)), beat('groom', 2.5)]);
    },
    spat(id) {
      const x = mx(300), f = Math.random() < 0.5 ? 1 : -1;
      if (Math.random() < 0.6) {
        enqueue(O, [drop(), walk(x), face(-f), beat('lie', 2.4, { watch: true }), sync(id), beat('hiss', 1.1), beat('swat', 0.4), { k: 'follow', gap: 90, dur: 1.5, run: true }, sit(1.4), beat('groom', 3)]);
        enqueue(B, [drop(), walk(x + f * 230), face(-f), beat('crouch', 0.8), { k: 'hop', gap: 52 }, beat('swat', 0.4), sync(id), { k: 'flee', dur: 1.3 }, sit(3, { dir: f }), beat('groom', 2.5)]);
      } else {
        enqueue(O, [drop(), walk(x), face(f), sync(id), beat('hiss', 1.3), beat('swat', 0.4), sit(0.3), beat('swat', 0.4), sync(id + 'e'), walk(x - f * 170), beat('groom', 3), sit(2)]);
        enqueue(B, [drop(), walk(x + f * 96), face(-f), sync(id), beat('hiss', 1.3), sit(0.2), beat('swat', 0.4), sit(0.3), sync(id + 'e'), walk(x + f * 260), sit(3, { dir: f }), beat('lie', 4)]);
      }
    },
    yarn(id) {
      spawnBall();
      enqueue(B, [drop(), { k: 'yarn', dur: rand(15, 22) }, sit(1.2)]);
      enqueue(O, [drop(), sit(rand(2.5, 4.5), { watch: 'ball' }), { k: 'yarn', dur: rand(7, 11) }, beat('lie', rand(3, 5), { watch: 'ball' })]);
    },
  };

  const pickScene = () => {
    const w = { napTogether: 15, napApart: 12, orangeNaps: 22, blackNaps: 18, pair: 33 };
    const ro = O.asleep / O.total, rb = B.asleep / B.total;
    const f = (r) => clamp(1 + 3 * (0.5 - r), 0.3, 3);
    w.napTogether *= (f(ro) + f(rb)) / 2; w.napApart *= (f(ro) + f(rb)) / 2; w.orangeNaps *= f(ro); w.blackNaps *= f(rb);
    w.pair *= clamp(1 + 3 * ((ro + rb) / 2 - 0.5), 0.3, 3);
    if (dir.last) w[dir.last] *= 0.35;
    return pick(w);
  };

  const startScene = (S, name, initial) => {
    const id = `s${++sceneN}`;
    dir.last = name === dir.last ? '' : name; dir.scene = name;
    const dur = rand(28, 48);
    const sleepNow = (c, x, f) => { if (initial) { c.pose = 'curl'; c.eyes = 'closed'; c.x = x; c.face = f; } };
    if (name === 'napTogether') {
      const x = mx(), f = Math.random() < 0.5 ? 1 : -1;
      sleepNow(O, x, f); sleepNow(B, x - f * 56, f);
      enqueue(O, [...napSpot(O, x, dur, f, { hearts: 11 })]);
      enqueue(B, [...napSpot(B, x - f * 56, dur + rand(-3, 6), f)]);
    } else if (name === 'napApart') {
      const x1 = mx(300), x2 = clamp(x1 + (Math.random() < 0.5 ? -1 : 1) * rand(380, 600), 160, innerWidth - 160);
      sleepNow(O, x1, 1); sleepNow(B, x2, -1);
      enqueue(O, napSpot(O, x1, dur, 1));
      const onWin = S.length > 1 && Math.random() < 0.4 && !initial;
      enqueue(B, onWin ? [{ k: 'leap' }, walk('center'), face(-1), beat('curl', dur)] : napSpot(B, x2, dur + rand(-4, 4), -1));
    } else if (name === 'orangeNaps') {
      const x = mx(), f = Math.random() < 0.5 ? 1 : -1;
      sleepNow(O, x, f);
      enqueue(O, napSpot(O, x, dur, f));
      enqueue(B, soloFor(B, S, dur));
    } else if (name === 'blackNaps') {
      const x = mx(), f = Math.random() < 0.5 ? 1 : -1;
      sleepNow(B, x, f);
      enqueue(B, napSpot(B, x, dur - rand(0, 8), f));
      enqueue(O, soloFor(O, S, dur));
    } else {
      const k = PAIR[name] ? name : pick({ sideBySide: 14, groom: 12, chase: 16, wrestle: 14, spat: 14, yarn: 30, ...(dir.lastPair ? { [dir.lastPair]: 0.0001 } : {}) });
      dir.lastPair = k; dir.scene = k;
      PAIR[k](id);
    }
  };

  const director = (S) => {
    if (still) return;
    if (O.free && B.free) {
      cats.forEach((c) => { if (c.step && c.step.fill) c.step = null; c.queue = []; c.dropOK = false; });
      if (ball.on && !ball.leaving) sendBallAway();
      startScene(S, pickScene(), false);
    }
  };
  if (!still) {
    startScene(surfaces(floorY(), headroom()), pick({ orangeNaps: 40, napTogether: 25, pair: 35 }), true);
    cats.forEach((c) => { c.y = floorY(); });
  } else { O.pose = 'curl'; O.eyes = 'closed'; B.pose = 'sit'; O.x = innerWidth * 0.55; B.x = innerWidth * 0.4; }

  /* ───────── per-cat update ───────── */
  const update = (c, dt, S) => {
    c.t += dt; c.poseT += dt;
    const asleep = c.pose === 'curl' && c.eyes === 'closed';
    c.total += dt; if (asleep) c.asleep += dt;
    if (c.mode === 'held') { c.pose = 'held'; return; }
    if (c.mode === 'air') {
      const prevY = c.y;
      c.pose = c.vy < -80 ? 'jump' : 'fall'; c.eyes = 'open'; c.look = [0, 0];
      c.vy += G * dt;
      if (c.jump) {
        c.jump.t += dt;
        if (c.jump.t >= c.jump.T) {
          const target = S.find((s) => s.el === c.jump.s.el);
          if (target && Math.abs(c.x - c.jump.tx) < 60 && Math.abs(c.y - target.top) < 70) { c.x = c.jump.tx; land(c, target); return; }
          c.jump = null;
        }
      }
      c.x += c.vx * dt; c.y += c.vy * dt;
      c.x = clamp(c.x, 20, innerWidth - 20);
      if (c.vy > 0) {
        const hit = S.filter((s) => c.x >= s.l && c.x <= s.r && prevY <= s.top + 4 && c.y >= s.top).sort((a, b) => a.top - b.top)[0];
        if (hit) { land(c, hit); return; }
      }
      if (c.y >= S[0].top) { c.y = S[0].top; land(c, S[0]); }
      return;
    }

    let sf = S[0];
    if (c.on) {
      const found = S.find((s) => s.el === c.on);
      if (!found) { c.queue = []; startFall(c, (Math.random() - 0.5) * 120, -120); return; }
      sf = found;
      c.x = clamp(sf.left + c.rel, sf.l, sf.r); c.y = sf.top;
    } else c.y = S[0].top;

    c.want = 0;
    if (c.petT > 0) {
      c.petT -= dt;
      if (c.pose === 'curl') { c.heart = clamp((c.t - c.heartAt) / 1.4, 0, 1); if (c.heart >= 1) c.heart = null; }
      else { c.pose = 'pet'; c.eyes = 'open'; c.heart = clamp((c.t - c.heartAt) / 1.4, 0, 1); }
      c.sp *= 0.8;
    } else {
      if (!c.step) {
        c.step = c.queue.shift() || null;
        if (!c.step && !otherOf(c).free) { enqueue(c, soloActivity(c, S).map((x) => ({ ...x, fill: true }))); c.step = c.queue.shift(); }
      }
      if (c.step) {
        const r = STEP[c.step.k](c, c.step, dt, S);
        if (r === 'switched') return;
        if (r) { c.step = null; c.dropOK = c.step && c.step.k === 'drop' ? c.dropOK : false; if (!c.step) c.dropOK = false; }
      } else { if (c.pose !== 'sit' && c.pose !== 'curl' && c.pose !== 'lie') { c.pose = 'sit'; } }
      if (c.pose === 'sit' && c.step === null && !c.idle) c.look = [0, 0];
      if (c.heartAt > c.t - 1.4 && c.pose !== 'curl' && !['pet', 'lick'].includes(c.pose)) c.heart = null;
      else c.heart = c.t - c.heartAt < 1.4 ? clamp((c.t - c.heartAt) / 1.4, 0, 1) : null;
    }

    const a = c.b.acc * (Math.abs(c.want) > Math.abs(c.sp) ? 1 : c.b.dec / c.b.acc * 0.55);
    c.sp += clamp(c.want - c.sp, -a * dt, a * dt);
    if (Math.abs(c.sp) > 8 && c.want !== 0) c.face = sign(c.sp);
    c.x += c.sp * dt;
    const lo = sf.l + 6, hi = sf.r - 6;
    if (c.x < lo || c.x > hi) {
      c.x = clamp(c.x, lo, hi);
      if (c.on && c.dropOK) { startFall(c, Math.sign(c.sp || (c.x < (sf.l + sf.r) / 2 ? -1 : 1)) * 70, -90); return; }
      c.sp = 0;
    }
    c.gait += dt * (0.5 + Math.abs(c.sp) / 95);
    if (c.on) c.rel = c.x - sf.left;
  };

  /* ───────── frame ───────── */
  let raf = 0, last = 0;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016) * timeScale;
    last = now;
    const fl = floorY();
    const S = surfaces(fl, headroom());
    director(S);
    for (let i = 0; i < Math.max(1, Math.round(timeScale)); i += 1) {
      const d = dt / Math.max(1, Math.round(timeScale));
      cats.forEach((c) => update(c, still ? 0 : d, S));
      updateBall(d, S);
    }
    cats.forEach((c) => {
      if (c.mode === 'ground' && !c.on) c.y = fl;
      const jx = c.shake ? Math.round(Math.sin(c.t * 45) * 2.2) : 0;
      c.el.style.transform = `translate3d(${Math.round(c.x - c.w / 2 + jx)}px, ${Math.round(c.y - c.h)}px, 0)`;
      const tt = c.pose === 'walk' ? c.gait : c.t;
      const idx = c.pose === 'walk' ? Math.floor(c.gait * 10) : c.pose === 'curl' ? Math.floor(c.t * 4) : Math.floor(c.t * 8);
      const sig = `${c.pose}|${c.face}|${idx}|${c.eyes}|${c.look}|${c.heart == null ? '-' : Math.round(c.heart * 10)}|${Math.round(c.arm * 6)}`;
      if (sig !== c.sig) { c.sig = sig; drawCat(c.ctx, c.kind, c.pose, tt, c.face, c.s, { eyes: c.eyes, look: c.look, heart: c.heart, arm: c.arm }); }
    });
    drawBall();
    raf = requestAnimationFrame(frame);
  };
  const run = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const halt = () => { cancelAnimationFrame(raf); raf = 0; };
  const onVis = () => (document.hidden ? halt() : run());
  document.addEventListener('visibilitychange', onVis);
  run();

  world = {
    cats, layer, ball, startScene: (name) => { cats.forEach((c) => { c.queue = []; c.step = null; c.dropOK = false; }); if (ball.on) sendBallAway(); startScene(surfaces(floorY(), headroom()), name, false); }, dir,
    destroy() {
      halt();
      removeEventListener('pointermove', onMove);
      removeEventListener('pointermove', hover);
      removeEventListener('pointerdown', startHold, true);
      removeEventListener('pointermove', holdMove);
      removeEventListener('pointerup', holdEnd);
      removeEventListener('pointercancel', holdEnd);
      document.removeEventListener('visibilitychange', onVis);
      document.documentElement.style.cursor = '';
      layer.remove();
      world = null;
    },
  };
  return world;
}

export function startCats() {
  if (world) return world;
  const saveData = navigator.connection?.saveData;
  const weak = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  if (saveData || weak) return null;
  return mount(matchMedia('(prefers-reduced-motion: reduce)').matches);
}

export function stopCats() { world?.destroy(); }
export function catsOn() { return !!world; }
export function setTimeScale(n) { timeScale = n; }
export function forceScene(name) { world?.startScene(name); }

export function catState() {
  return world ? world.cats.map((c) => ({ kind: c.kind, pose: c.pose, eyes: c.eyes, mode: c.mode, x: Math.round(c.x), y: Math.round(c.y), sp: Math.round(c.sp), onWindow: !!c.on, scale: c.s, asleep: +(c.asleep / c.total).toFixed(2), step: c.step ? c.step.k : null, queued: c.queue.length })) : [];
}
export function sceneName() { return world ? world.dir.scene : ''; }
export function ballState() { return world ? { on: world.ball.on, x: Math.round(world.ball.x), y: Math.round(world.ball.y), air: world.ball.air } : null; }
