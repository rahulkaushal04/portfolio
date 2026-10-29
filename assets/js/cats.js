const G = 1500;
const GRID_W = 26;
const GRID_H = 24;
const LIMIT = 8;

const PALETTE = {
  orange: { body: '#e8892b', dark: '#b8601b', light: '#fbe6bf', ear: '#f4a9a0', eye: '#20140a', nose: '#e46a6a', rim: '#f3a95a' },
  black: { body: '#1d1d25', dark: '#0f0f15', light: '#3a3a48', ear: '#7a5668', eye: '#a6ec6c', nose: '#8a5a6a', rim: '#56566c' },
};

const PROFILE = {
  orange: { speed: 52, scale: [4, 3], weights: { walk: 0.16, sit: 0.28, sleep: 0.36, groom: 0.2 }, sleep: [9, 20], jumpy: 0.0035, dropOff: 0.2 },
  black: { speed: 92, scale: [3, 2], weights: { walk: 0.3, sit: 0.12, sleep: 0.1, groom: 0.08, chase: 0.24, hop: 0.16 }, sleep: [5, 11], jumpy: 0.012, dropOff: 0.45 },
};

const HEART = ['.#.#.', '#####', '.###.', '..#..'];
const ZED = ['###', '..#', '.#.', '###'];

export function drawCat(ctx, kind, pose, t, dir, s, extra = {}) {
  const P = PALETTE[kind];
  const dark = kind === 'orange';
  ctx.imageSmoothingEnabled = false;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, GRID_W * s, GRID_H * s);
  ctx.setTransform(s * dir, 0, 0, s, dir < 0 ? GRID_W * s : 0, 8 * s);
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const eyes = (x, y, w = 1, h = 1) => R(x, y, w, h, P.eye);
  const stripes = (xs, y, h) => { if (dark) xs.forEach((x) => R(x, y, 1, h, P.dark)); };
  const blink = (t % 4.3) < 0.14;

  const walkBody = (lift, tail) => {
    const s1 = Math.round(Math.sin(t * 5)), s2 = Math.round(Math.sin(t * 5 + 1) * 1.5);
    [[3, 9], [2, 8], [2, 7], [3 + s1, 6], [3 + s2, 5]].forEach(([x, y]) => R(x, y, 1, 1, tail ? P.body : P.body));
    R(4, 8, 12, 5, P.body); R(5, 7, 10, 1, P.body); R(6, 12, 8, 1, P.light);
    if (!dark) R(5, 7, 10, 1, P.rim);
    stripes([7, 10, 13], 7, 3);
    R(15, 5, 6, 5, P.body); R(16, 4, 4, 1, P.body);
    R(15, 2, 2, 3, P.body); R(19, 2, 2, 3, P.body); R(16, 3, 1, 1, P.ear); R(19, 3, 1, 1, P.ear);
    R(19, 8, 2, 2, P.light); R(21, 8, 1, 1, P.nose);
    if (kind === 'orange') R(16, 6, 1, 1, P.dark);
    eyes(18, 6, 1, kind === 'black' ? 2 : 1);
    [[5, 0], [7, Math.PI], [12, Math.PI], [14, 0]].forEach(([x, ph]) => {
      const up = lift && Math.sin(t * 14 + ph) > 0.5 ? 1 : 0;
      const len = 3 - up;
      R(x, 13, 2, len, P.body); R(x, 12 + len, 2, 1, P.light);
    });
  };

  if (pose === 'walk') walkBody(true, false);
  else if (pose === 'sit' || pose === 'groom' || pose === 'pet') {
    const wag = Math.round(Math.sin(t * 2.2));
    R(3, 15, 9, 1, P.body); R(2, 14, 1, 2, P.body); R(2 + wag, 12, 1, 3, P.body); if (dark) R(2 + wag, 12, 1, 1, P.dark);
    R(5, 9, 8, 6, P.body); R(6, 8, 6, 1, P.body); if (!dark) R(6, 8, 6, 1, P.rim);
    R(10, 5, 5, 10, P.body); R(5, 15, 4, 1, P.light);
    R(11, 1, 7, 6, P.body); R(12, 0, 5, 1, P.body);
    R(11, -1, 2, 3, P.body); R(16, -1, 2, 3, P.body); R(12, 0, 1, 1, P.ear); R(16, 0, 1, 1, P.ear);
    R(16, 4, 2, 2, P.light); R(18, 4, 1, 1, P.nose);
    stripes([6, 8], 9, 3); if (dark) { R(14, 1, 1, 2, P.dark); R(13, 3, 1, 1, P.dark); }
    R(13, 9, 3, 6, P.body); R(13, 15, 3, 1, P.light);
    if (pose === 'pet') { R(15, 3, 1, 1, P.eye); R(14, 4, 1, 1, P.eye); R(16, 4, 1, 1, P.eye); }
    else if (blink) R(15, 3, 1, 1, P.dark);
    else eyes(15, 3, 1, kind === 'black' ? 2 : 1);
    if (pose === 'groom') { const up = Math.floor(t * 4) % 2; R(15, 4 - up, 2, 4, P.light); R(15, 3 - up, 2, 1, P.body); }
  } else if (pose === 'sleep') {
    const b = Math.round((Math.sin(t * 1.8) + 1) / 2);
    R(3, 10 + b, 16, 6 - b, P.body); R(5, 9 + b, 12, 1, P.body); if (!dark) R(5, 9 + b, 12, 1, P.rim);
    R(14, 11, 6, 5, P.body); R(15, 9, 2, 2, P.body); R(18, 9, 2, 2, P.body); R(16, 9, 1, 1, P.ear);
    R(2, 13, 3, 3, P.body); R(4, 15, 14, 1, dark ? P.dark : P.light);
    R(17, 13, 2, 1, P.dark === P.body ? P.eye : (dark ? P.dark : P.light)); R(19, 14, 1, 1, P.nose);
    stripes([6, 9, 12], 10 + b, 3);
  } else if (pose === 'crouch') {
    const w = Math.round(Math.sin(t * 30));
    R(0, 10, 4, 1, P.body); R(3 + w, 9, 3, 4, P.body); R(4, 10, 12, 4, P.body);
    R(15, 9, 6, 4, P.body); R(15, 7, 2, 3, P.body); R(19, 7, 2, 3, P.body); R(16, 8, 1, 1, P.ear);
    R(19, 11, 2, 2, P.light); eyes(18, 10, 1, 2);
    R(5, 14, 2, 2, P.body); R(8, 14, 2, 2, P.body); R(14, 14, 3, 2, P.body); R(17, 14, 3, 2, P.light);
    stripes([7, 10], 10, 3);
  } else if (pose === 'jump') {
    R(0, 8, 5, 1, P.body); R(5, 7, 11, 4, P.body); R(6, 6, 9, 1, P.body);
    R(16, 5, 6, 4, P.body); R(16, 3, 2, 2, P.body); R(20, 3, 2, 2, P.body); R(17, 4, 1, 1, P.ear);
    R(20, 7, 2, 2, P.light); eyes(19, 6, 1, 2);
    R(16, 10, 5, 1, P.body); R(19, 11, 3, 1, P.light); R(1, 10, 5, 1, P.body); R(3, 11, 3, 1, P.light);
    stripes([8, 11], 6, 3);
  } else if (pose === 'fall') {
    R(3, 1, 1, 5, P.body); R(4, 6, 1, 1, P.body);
    R(5, 5, 11, 5, P.body); R(6, 4, 9, 1, P.body);
    R(15, 2, 6, 5, P.body); R(15, 0, 2, 3, P.body); R(19, 0, 2, 3, P.body); R(16, 1, 1, 1, P.ear);
    R(19, 5, 2, 2, P.light); eyes(18, 3, 1, 2);
    [[5, 11], [8, 11], [12, 10], [14, 11]].forEach(([x, y], i) => R(x + (i % 2 ? 1 : -1), y, 2, 4, P.body));
    stripes([7, 10, 13], 5, 3);
  } else if (pose === 'held') {
    const sw = Math.round(Math.sin(t * 4) * 1.5);
    R(10, 0, 6, 5, P.body); R(10, -2, 2, 3, P.body); R(14, -2, 2, 3, P.body); R(11, -1, 1, 1, P.ear);
    R(14, 2, 2, 2, P.light); eyes(13, 2, 1, 2);
    R(9, 5, 6, 8, P.body); stripes([10, 12], 5, 3);
    R(9, 13, 2, 3, P.body); R(13, 13, 2, 3, P.body); R(8 + sw, 13, 2, 2, P.light);
    R(7 + sw, 12, 1, 5, P.body); R(6 + sw, 16, 1, 2, P.body);
  }

  if (extra.heart != null) {
    const y = -6 - extra.heart * 4;
    ctx.globalAlpha = 1 - extra.heart * 0.8;
    HEART.forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') R(13 + i, y + j, 1, 1, '#e0404f'); }));
    ctx.globalAlpha = 1;
  }
  if (pose === 'sleep') {
    [0, 0.5].forEach((o, k) => {
      const f = ((t * 0.4 + o) % 1);
      ctx.globalAlpha = 1 - f;
      ZED.forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') R(19 + k * 3 + i, 5 - f * 6 + j - k * 2, 1, 1, '#eafcff'); }));
      ctx.globalAlpha = 1;
    });
  }
}

class Cat {
  constructor(kind, scale) {
    this.kind = kind;
    this.p = PROFILE[kind];
    this.s = scale;
    this.t = Math.random() * 10;
    this.state = 'sit';
    this.dir = Math.random() < 0.5 ? 1 : -1;
    this.x = 0; this.y = 0; this.vx = 0; this.vy = 0;
    this.on = null; this.rel = 0;
    this.timer = 1 + Math.random() * 2;
    this.goal = null;
    this.heart = null;
    this.sig = '';
    this.jump = null;
    this.follow = null;
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
  get headroom() { return 17 * this.s; }
}

let world = null;

function surfaces(floorY, w, h) {
  const out = [{ el: null, top: floorY, l: 0, r: innerWidth }];
  document.querySelectorAll('.rk-win').forEach((el) => {
    if (el.hidden || el.classList.contains('rk-win--max') || el.classList.contains('rk-win--min-anim') || el.classList.contains('rk-win--restore-anim')) return;
    const r = el.getBoundingClientRect();
    if (r.width < 120 || r.top < h || r.top > floorY - 40) return;
    out.push({ el, top: r.top, l: r.left + 8, r: r.right - 8 });
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
  const cats = [new Cat('orange', PROFILE.orange.scale[small ? 1 : 0]), new Cat('black', PROFILE.black.scale[small ? 1 : 0])];
  cats.forEach((c) => layer.appendChild(c.el));

  const taskbar = () => document.querySelector('.rk-taskbar');
  const floorY = () => (taskbar() ? taskbar().getBoundingClientRect().top : innerHeight - 44);
  cats[0].x = innerWidth * 0.55; cats[1].x = innerWidth * 0.38;
  cats.forEach((c) => { c.y = floorY(); });

  const pointer = { x: -1, y: -1, t: 0, speed: 0 };
  const onMove = (e) => {
    const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
    pointer.speed = Math.hypot(dx, dy);
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = performance.now();
  };
  addEventListener('pointermove', onMove, { passive: true });

  let held = null;
  const hit = (e) => cats.find((c) => {
    const r = c.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left) / c.s), y = Math.floor((e.clientY - r.top) / c.s);
    if (x < 0 || y < 0 || x >= GRID_W || y >= GRID_H) return false;
    return c.ctx.getImageData(x * c.s, y * c.s, 1, 1).data[3] > 0;
  });
  const startHold = (e) => {
    if (e.button > 0) return;
    const c = hit(e);
    if (!c) return;
    e.preventDefault();
    e.stopPropagation();
    held = { c, sx: e.clientX, sy: e.clientY, moved: false, samples: [] };
  };
  addEventListener('pointerdown', startHold, true);
  const hover = (e) => { document.documentElement.style.cursor = held ? 'grabbing' : hit(e) ? 'grab' : ''; };
  addEventListener('pointermove', hover, { passive: true });
  const holdMove = (e) => {
    if (!held) return;
    const c = held.c;
    if (!held.moved && Math.hypot(e.clientX - held.sx, e.clientY - held.sy) > 6) { held.moved = true; c.state = 'held'; c.on = null; c.jump = null; }
    if (held.moved) {
      c.x = e.clientX; c.y = e.clientY + c.h * 0.55;
      held.samples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (held.samples.length > 5) held.samples.shift();
    }
  };
  const holdEnd = () => {
    if (!held) return;
    const { c, moved, samples } = held;
    held = null;
    if (!moved) { c.state = 'pet'; c.timer = 1.6; c.heartT = 0; c.goal = null; return; }
    const a = samples[0], b = samples[samples.length - 1];
    const dt = Math.max(0.016, (b.t - a.t) / 1000);
    c.vx = Math.max(-500, Math.min(500, (b.x - a.x) / dt));
    c.vy = Math.max(-500, Math.min(300, (b.y - a.y) / dt));
    c.state = 'fall';
  };
  addEventListener('pointermove', holdMove);
  addEventListener('pointerup', holdEnd);
  addEventListener('pointercancel', holdEnd);

  const land = (c, s) => {
    c.state = 'sit'; c.timer = 0.4 + Math.random() * 1.5; c.vx = c.vy = 0; c.jump = null;
    c.y = s.top; c.on = s.el; c.rel = c.x - (s.el ? s.l - 8 : 0);
  };

  const pick = (c, S, other) => {
    const w = c.p.weights; let r = Math.random(), k = Object.keys(w).find((key) => (r -= w[key]) < 0) || 'sit';
    if (still) k = Math.random() < 0.5 ? 'sit' : 'sleep';
    const same = other.on === c.on && other.state !== 'held' && other.state !== 'fall' && other.state !== 'jump';
    if (c.kind === 'black' && same && !still && Math.random() < 0.35) { c.follow = other; c.state = 'walk'; c.timer = 6; return; }
    c.follow = null; c.goal = null;
    if (k === 'walk') { c.state = 'walk'; c.dir = Math.random() < 0.5 ? 1 : -1; c.timer = 2 + Math.random() * 3.5; }
    else if (k === 'chase') {
      if (performance.now() - pointer.t < 7000 && pointer.x >= 0) { c.state = 'walk'; c.goal = pointer.x; c.timer = 6; } else { c.state = 'walk'; c.timer = 2.5; c.dir = -c.dir; }
    } else if (k === 'hop') { c.state = 'crouch'; c.timer = 0.7; }
    else if (k === 'sleep') { c.state = 'sleep'; c.timer = c.p.sleep[0] + Math.random() * (c.p.sleep[1] - c.p.sleep[0]); }
    else if (k === 'groom') { c.state = 'groom'; c.timer = 2 + Math.random() * 2.5; }
    else { c.state = 'sit'; c.timer = 2 + Math.random() * 3; }
  };

  const tryLeap = (c, S) => {
    const cand = S.filter((s) => s.el !== c.on && s.top <= c.y + 10 && c.y - s.top <= 800);
    if (!cand.length) return false;
    const near = cand.map((s) => { const tx = Math.max(s.l + 24, Math.min(s.r - 24, c.x)); return { s, tx, d: Math.abs(tx - c.x) + (c.y - s.top) * 0.3 }; }).filter((o) => Math.abs(o.tx - c.x) < 280).sort((a, b) => a.d - b.d)[0];
    if (!near) return false;
    const T = 0.6 + Math.max(0, c.y - near.s.top) / 1000;
    c.jump = { s: near.s, tx: near.tx, T, t: 0, sx: c.x, sy: c.y };
    c.vy = (near.s.top - c.y) / T - 0.5 * G * T;
    c.vx = (near.tx - c.x) / T;
    c.state = 'jump'; c.dir = c.vx >= 0 ? 1 : -1; c.on = null;
    return true;
  };

  const step = (c, dt, S, other) => {
    c.t += dt;
    if (c.state === 'held') return;
    const fl = S[0];
    if (c.state === 'fall' || c.state === 'jump') {
      if (still) { c.state = 'fall'; }
      const prevY = c.y;
      c.vy += G * dt;
      if (c.state === 'jump') {
        c.jump.t += dt;
        if (c.jump.t >= c.jump.T) {
          const target = S.find((s) => s.el === c.jump.s.el) || null;
          if (target && Math.abs(c.x - c.jump.tx) < 60 && Math.abs(c.y - target.top) < 70) { c.x = c.jump.tx; land(c, target); return; }
          c.state = 'fall';
        }
      }
      c.x += c.vx * dt; c.y += c.vy * dt;
      c.x = Math.max(20, Math.min(innerWidth - 20, c.x));
      if (c.vy > 0) {
        const hit = S.filter((s) => c.x >= s.l && c.x <= s.r && prevY <= s.top + 4 && c.y >= s.top).sort((a, b) => a.top - b.top)[0];
        if (hit) { land(c, hit); return; }
      }
      if (c.y >= fl.top) { c.y = fl.top; land(c, fl); }
      return;
    }

    let surf = fl;
    if (c.on) {
      surf = S.find((s) => s.el === c.on);
      if (!surf) { c.state = 'fall'; c.vx = (Math.random() - 0.5) * 120; c.vy = -120; c.on = null; return; }
      c.x = Math.max(surf.l, Math.min(surf.r, surf.l - 8 + c.rel)); c.y = surf.top;
    } else { c.y = fl.top; }

    c.timer -= dt;
    if (c.state === 'pet') { c.heartT = Math.min(1, (c.heartT || 0) + dt / 1.4); if (c.timer <= 0) { c.state = 'sit'; c.timer = 1.5; c.heart = null; } else c.heart = c.heartT; return; }

    if (c.state === 'crouch') {
      if (c.timer <= 0) { if (!tryLeap(c, S)) { c.vy = -520; c.vx = c.dir * 90; c.state = 'fall'; c.on = null; } }
      return;
    }
    if (c.state === 'walk') {
      let goal = c.goal;
      if (c.follow) { goal = c.follow.x - c.follow.dir * 46; }
      if (goal != null) {
        const d = goal - c.x;
        if (Math.abs(d) < 14) {
          c.goal = null;
          if (c.follow) { const o = c.follow; c.follow = null; c.dir = o.x >= c.x ? 1 : -1; if (o.state === 'sleep') { c.state = 'sleep'; c.timer = 6 + Math.random() * 6; } else { c.state = 'sit'; c.timer = 3 + Math.random() * 3; } }
          else { c.state = 'sit'; c.timer = 1.5 + Math.random() * 2; c.dir = pointer.x >= c.x ? 1 : -1; }
          return;
        }
        c.dir = d > 0 ? 1 : -1;
      }
      const sp = c.p.speed * (c.goal != null && c.kind === 'black' ? 1.5 : 1);
      c.x += c.dir * sp * dt;
      const lo = surf.l + 6, hi = surf.r - 6;
      if (c.x < lo || c.x > hi) {
        c.x = Math.max(lo, Math.min(hi, c.x));
        if (surf.el && Math.random() < c.p.dropOff && !still) { c.state = 'fall'; c.vx = c.dir * 60; c.vy = -80; c.on = null; return; }
        c.dir = -c.dir; c.goal = null; c.follow = null;
      }
      if (!still && Math.random() < c.p.jumpy * dt * 60 && tryLeap(c, S)) return;
      if (surf.el) c.rel = c.x - (surf.l - 8);
      if (c.timer <= 0) pick(c, S, other);
      return;
    }
    if (c.timer <= 0) pick(c, S, other);
    if (c.state === 'sit' && pointer.x >= 0 && performance.now() - pointer.t < 5000) c.dir = pointer.x >= c.x ? 1 : -1;
  };

  let raf = 0, last = 0;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    const fl = floorY();
    const S = surfaces(fl, 0, Math.max(...cats.map((c) => c.headroom)));
    cats.forEach((c, i) => {
      step(c, still ? 0.016 * 0 : dt, S, cats[1 - i]);
      if (c.state !== 'held' && !c.on && c.state !== 'fall' && c.state !== 'jump') c.y = fl;
      c.el.style.transform = `translate3d(${Math.round(c.x - c.w / 2)}px, ${Math.round(c.y - c.h)}px, 0)`;
      const pose = c.state === 'groom' && c.kind === 'black' ? 'groom' : c.state;
      const frameIdx = c.state === 'walk' ? Math.floor(c.t * 14) : c.state === 'sleep' ? Math.floor(c.t * 2) : Math.floor(c.t * 6);
      const sig = `${pose}|${c.dir}|${frameIdx}|${c.heart != null ? Math.round(c.heart * 10) : '-'}`;
      if (sig !== c.sig) { c.sig = sig; drawCat(c.ctx, c.kind, pose, c.t, c.dir, c.s, c.heart != null ? { heart: c.heart } : {}); }
    });
    raf = requestAnimationFrame(frame);
  };
  const run = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const halt = () => { cancelAnimationFrame(raf); raf = 0; };
  const onVis = () => (document.hidden ? halt() : run());
  document.addEventListener('visibilitychange', onVis);
  run();

  world = {
    cats, layer,
    destroy() {
      halt();
      removeEventListener('pointermove', onMove);
      removeEventListener('pointermove', hover);
      removeEventListener('pointerdown', startHold, true);
      document.documentElement.style.cursor = '';
      removeEventListener('pointermove', holdMove);
      removeEventListener('pointerup', holdEnd);
      removeEventListener('pointercancel', holdEnd);
      document.removeEventListener('visibilitychange', onVis);
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

export function catState() {
  return world ? world.cats.map((c) => ({ kind: c.kind, state: c.state, x: Math.round(c.x), y: Math.round(c.y), onWindow: !!c.on, scale: c.s })) : [];
}
