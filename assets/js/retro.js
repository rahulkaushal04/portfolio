
const ICONS = {
  monitor: '<rect x="3" y="4" width="26" height="19" fill="#dcdcdc" stroke="#000" stroke-width="1.6"/><rect x="6" y="7" width="20" height="13" fill="#0e3b6f"/><path d="M6 7h20v3H6z" fill="#1f6fd0"/><path d="M8 12h9M8 15h12M8 18h6" stroke="#9fe3ff" stroke-width="1.6"/><path d="M12 23h8l1 4H11z" fill="#b5b5b5" stroke="#000" stroke-width="1.4"/><path d="M8 28h16" stroke="#000" stroke-width="2"/><path d="M4 5h24" stroke="#fff" stroke-width="1"/>',
  note: '<rect x="6" y="4" width="21" height="25" fill="#fff6a8" stroke="#000" stroke-width="1.6"/><path d="M6 9h21" stroke="#e0b800" stroke-width="1.6"/><path d="M10 14h13M10 18h13M10 22h9" stroke="#3a6ea5" stroke-width="1.4"/><g fill="#555" stroke="#000" stroke-width="1"><rect x="3" y="7" width="6" height="3"/><rect x="3" y="13" width="6" height="3"/><rect x="3" y="19" width="6" height="3"/><rect x="3" y="25" width="6" height="3"/></g>',
  chip: '<g stroke="#000" stroke-width="1.4"><path d="M10 3v4M14 3v4M18 3v4M22 3v4M10 25v4M14 25v4M18 25v4M22 25v4M3 10h4M3 14h4M3 18h4M3 22h4M25 10h4M25 14h4M25 18h4M25 22h4" fill="none"/></g><path d="M10 3v4M14 3v4M18 3v4M22 3v4M10 25v4M14 25v4M18 25v4M22 25v4M3 10h4M3 14h4M3 18h4M3 22h4M25 10h4M25 14h4M25 18h4M25 22h4" stroke="#f2c94c" stroke-width="2" fill="none"/><rect x="6" y="6" width="20" height="20" fill="#1c4d35" stroke="#000" stroke-width="1.6"/><rect x="9" y="9" width="14" height="14" fill="#2f7d57"/><path d="M9 9h14" stroke="#7ad9a4" stroke-width="1.4"/><circle cx="12" cy="12" r="1.5" fill="#000"/><path d="M14 16h6M14 19h4" stroke="#bff0d4" stroke-width="1.4"/>',
  setup: '<path d="M4 4h24v24H4z" fill="#c0c0c0" stroke="#000" stroke-width="1.6"/><path d="M4 4h24v5H4z" fill="#000080"/><circle cx="16" cy="19" r="7.5" fill="#e8e8f0" stroke="#000" stroke-width="1.4"/><circle cx="16" cy="19" r="2.2" fill="#c0c0c0" stroke="#000" stroke-width="1.2"/><path d="M10.5 16.5a6.5 6.5 0 0 1 6-3" stroke="#4aa3df" stroke-width="1.6" fill="none"/><path d="M21.5 22a6.5 6.5 0 0 1-5 2.5" stroke="#d6342b" stroke-width="1.6" fill="none"/>',
  folder: '<path d="M2 7h11l3 3h14v18H2z" fill="#d9a520" stroke="#000" stroke-width="1.6" stroke-linejoin="round"/><path d="M2 12h28v16H2z" fill="#f6d55c" stroke="#000" stroke-width="1.6" stroke-linejoin="round"/><path d="M3.5 13.5h25" stroke="#fff3b0" stroke-width="1.4"/><path d="M3 27h26" stroke="#b9861a" stroke-width="1.4"/>',
  briefcase: '<path d="M11 9V6h10v3" fill="none" stroke="#000" stroke-width="1.8"/><rect x="3" y="9" width="26" height="18" fill="#a8622b" stroke="#000" stroke-width="1.6"/><path d="M3 9h26v7H3z" fill="#c98342"/><path d="M3 16h26" stroke="#000" stroke-width="1.6"/><rect x="13" y="14" width="6" height="5" fill="#f2c94c" stroke="#000" stroke-width="1.4"/><path d="M4.5 10.5h23" stroke="#e8b27a" stroke-width="1.2"/>',
  cert: '<rect x="3" y="5" width="26" height="19" fill="#fff8e0" stroke="#000" stroke-width="1.6"/><rect x="6" y="8" width="20" height="13" fill="none" stroke="#b9861a" stroke-width="1.2"/><path d="M9 12h14M9 15h10" stroke="#3a6ea5" stroke-width="1.5"/><circle cx="23" cy="20" r="4" fill="#d6342b" stroke="#000" stroke-width="1.4"/><path d="M21 23l-1 6 3-2 3 2-1-6" fill="#d6342b" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/>',
  globe: '<circle cx="16" cy="16" r="13" fill="#1d6fd1" stroke="#000" stroke-width="1.6"/><path d="M8 9c3-2 6-1 7 1s-1 4-3 4-3 3-1 5-2 3-4 0-3-8 1-10zM19 6c3 0 6 2 8 6-2 1-3 0-4 2s-4 1-4-2 0-5 0-6zM18 20c3-1 7 0 8 2-2 4-6 5-8 4s-1-5 0-6z" fill="#3fae58"/><path d="M6 8c3-3 8-5 13-4" stroke="#bfe3ff" stroke-width="1.4" fill="none"/><circle cx="16" cy="16" r="13" fill="none" stroke="#000" stroke-width="1.6"/>',
  mail: '<rect x="3" y="7" width="26" height="19" fill="#fdfdfd" stroke="#000" stroke-width="1.6"/><path d="M3 8l13 10L29 8" fill="#d8e6f7" stroke="#000" stroke-width="1.6" stroke-linejoin="round"/><rect x="21" y="10" width="6" height="5" fill="#d6342b" stroke="#000" stroke-width="1.2"/><path d="M3 25l9-8M29 25l-9-8" stroke="#8a8a8a" stroke-width="1.2"/>',
  pdf: '<path d="M6 2h14l7 7v21H6z" fill="#fff" stroke="#000" stroke-width="1.6" stroke-linejoin="round"/><path d="M20 2v7h7" fill="#d4d4d4" stroke="#000" stroke-width="1.6" stroke-linejoin="round"/><rect x="6" y="15" width="21" height="8" fill="#d6342b" stroke="#000" stroke-width="1.4"/><path d="M9 19h3M14 17v4M14 17h2.5a1.2 1.2 0 010 2.4H14M20 17h-2v4h2" stroke="#fff" stroke-width="1.2" fill="none"/><path d="M10 26h13" stroke="#8a8a8a" stroke-width="1.4"/>',
};
const icon = (name) => `<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const getJSON = (f) => fetch(`data/${f}`).then((r) => r.json()).catch(() => []);

let built = false;

const WINDOWS = [
  ['hero', 'Welcome', 'welcome.exe', 'monitor', [800, 640]],
  ['about', 'About', 'about.txt', 'note', [720, 560]],
  ['skills', 'Skills', 'skills.ini', 'chip', [780, 600]],
  ['experience', 'Experience', 'experience.log', 'briefcase', [960, 640]],
  ['patent', 'Patent', 'patent.pdf', 'cert', [780, 640]],
  ['projects', 'Projects', 'setup.exe', 'setup', [860, 680]],
  ['contributions', 'Open source', 'open_source', 'globe', [860, 620]],
  ['contact', 'Contact', 'new_message', 'mail', [740, 640]],
];

let desk = null;
const MOBILE = () => innerWidth < 700;

function wallpaper() {
  const cols = 160, rows = 90;
  const rect = (x, y, w, h, f, o = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o < 1 ? ` opacity="${o}"` : ''}/>`;
  const bands = ['#06424c', '#08505a', '#0a5f69', '#0d6f79', '#118089', '#18919a', '#25a2a8', '#3bb3b5', '#5cc4c0', '#86d6cd'];
  let sky = '';
  bands.forEach((c, i) => { sky += rect(0, i * 6, cols, 7, c); });
  const star = (x, y) => rect(x, y, 1, 1, '#d9fbff', 0.8);
  const stars = [[8, 3], [22, 9], [37, 4], [51, 12], [66, 6], [83, 3], [97, 10], [118, 5], [137, 11], [151, 4], [29, 16], [74, 18], [126, 17]].map(([x, y]) => star(x, y)).join('');
  const cloud = (x, y, u, o) => ['..####..', '.######.', '########', '.######.'].map((row, j) => [...row].map((c, i) => (c === '#' ? rect(x + i * u, y + j * u, u, u, '#eafcff', o) : '')).join('')).join('');
  const ridge = (base, amp, seed, fill, snow) => {
    let r = '';
    for (let x = 0; x < cols; x += 2) {
      const h = Math.round(base + amp * Math.sin((x + seed) / 13) + amp * 0.55 * Math.sin((x + seed) / 5.1) + amp * 0.3 * Math.sin((x + seed) / 2.7));
      r += rect(x, rows - h, 2, h, fill);
      if (snow && h > snow) r += rect(x, rows - h, 2, Math.min(3, h - snow), '#e6fbff');
    }
    return r;
  };
  const pine = (x, y, h, f) => {
    let r = rect(x, y - 2, 1, 3, '#052b30');
    for (let i = 0; i < h; i++) r += rect(x - Math.ceil((h - i) / 2) + 1, y - 2 - i * 2, Math.ceil((h - i) / 2) * 2 - 1, 2, f);
    return r;
  };
  const pines = [[6, 6], [11, 8], [16, 5], [24, 7], [124, 7], [131, 9], [138, 6], [147, 8], [154, 5]].map(([x, h], i) => pine(x, rows - 18 + (i % 3), h, i % 2 ? '#063e45' : '#05353b')).join('');
  let water = rect(0, rows - 11, cols, 11, '#063a42');
  for (let i = 0; i < 9; i++) water += rect(14 + i * 17, rows - 8 + (i % 3) * 3, 6 + (i % 4) * 2, 1, '#8fe3dc', 0.45);
  return `<svg viewBox="0 0 ${cols} ${rows}" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${sky}${stars}${cloud(20, 14, 3, 0.7)}${cloud(88, 26, 2, 0.55)}${cloud(122, 12, 3, 0.6)}${ridge(30, 11, 0, '#0b4651', 36)}${ridge(21, 8, 40, '#0a5c63')}${ridge(14, 5, 90, '#074049')}${pines}${water}</svg>`;
}

function buildGadgets(root) {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const cells = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<b>${d}</b>`).join('')
    + '<i></i>'.repeat(first)
    + Array.from({ length: days }, (_, i) => `<span${i + 1 === now.getDate() ? ' class="is-today"' : ''}>${i + 1}</span>`).join('');
  const el = document.createElement('div');
  el.className = 'rk-widgets';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<div class="rk-wall">${wallpaper()}</div>
    <section class="rk-gadget rk-gadget--cal"><h2>${now.toLocaleDateString([], { month: 'long', year: 'numeric' })}</h2><div class="rk-cal">${cells}</div></section>`;
  root.prepend(el);
}

function buildSaver() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const saver = document.createElement('div');
  saver.className = 'rk-saver';
  saver.hidden = true;
  saver.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas');
  saver.appendChild(canvas);
  document.body.appendChild(saver);
  const ctx = canvas.getContext('2d');
  const TRAIL = ['#ffffff', '#d9fbff', '#7fdcd6', '#3fa8ae'];
  let stars = [], W = 0, H = 0, raf = 0, last = 0, timer;

  const reset = (s, spread) => {
    s.x = (Math.random() - 0.5) * W * 2;
    s.y = (Math.random() - 0.5) * H * 2;
    s.z = spread ? Math.random() * W : W;
    s.pz = s.z;
  };
  const size = () => {
    W = canvas.width = Math.ceil(innerWidth / 3);
    H = canvas.height = Math.ceil(innerHeight / 3);
    stars = Array.from({ length: 360 }, () => { const s = {}; reset(s, true); return s; });
  };
  const frame = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;
    ctx.fillStyle = 'rgba(2, 8, 14, 0.55)';
    ctx.fillRect(0, 0, W, H);
    const speed = W * 0.28 * dt;
    for (const s of stars) {
      s.pz = s.z;
      s.z -= speed;
      if (s.z < 1) { reset(s, false); continue; }
      const x = (s.x / s.z) * (W / 2) + W / 2, y = (s.y / s.z) * (H / 2) + H / 2;
      const px = (s.x / s.pz) * (W / 2) + W / 2, py = (s.y / s.pz) * (H / 2) + H / 2;
      if (x < 0 || x >= W || y < 0 || y >= H) { reset(s, false); continue; }
      const near = 1 - s.z / W;
      ctx.fillStyle = TRAIL[Math.min(3, Math.floor((1 - near) * 4))];
      const len = Math.max(1, Math.round(near * 3));
      ctx.fillRect(Math.round(Math.min(x, px)), Math.round(Math.min(y, py)), Math.max(1, Math.abs(Math.round(x - px))) , Math.max(1, Math.round(near * 3)));
      if (near > 0.8) ctx.fillRect(Math.round(x), Math.round(y) - len, 1, len * 2);
    }
    raf = requestAnimationFrame(frame);
  };
  const start = () => { size(); ctx.fillStyle = '#02080e'; ctx.fillRect(0, 0, W, H); last = performance.now(); raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  const wake = () => {
    if (!saver.hidden) { saver.hidden = true; stop(); }
    clearTimeout(timer);
    timer = setTimeout(() => { if (document.hidden) return; saver.hidden = false; start(); }, 60000);
  };
  const evs = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'];
  evs.forEach((e) => document.addEventListener(e, wake, { passive: true }));
  wake();
  return () => { clearTimeout(timer); stop(); evs.forEach((e) => document.removeEventListener(e, wake)); saver.remove(); };
}

function mountDesktop() {
  if (desk) return;
  const html = document.documentElement;
  const root = document.createElement('div');
  root.className = 'rk-retro-only rk-desktop';
  root.id = 'rkDesktop';
  root.innerHTML = `<nav class="rk-icons" aria-label="Desktop">${WINDOWS.map(([id, label, , ic]) => `<button type="button" class="rk-icon" data-open="${id}">${icon(ic)}<span>${label}</span></button>`).join('')}
    <a class="rk-icon" href="resume/Rahul_Resume.pdf" target="_blank" rel="noopener noreferrer">${icon('pdf')}<span>Resume</span></a></nav>
    <div class="rk-area" id="rkArea"></div>`;
  const bar = document.createElement('div');
  bar.className = 'rk-retro-only rk-taskbar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Taskbar');
  const startItems = [
    ...WINDOWS.map(([id, label, , ic]) => `<li><button type="button" data-open="${id}">${icon(ic)}<span>${label}</span></button></li>`),
    '<li class="rk-sep" role="separator"></li>',
    `<li><a href="resume/Rahul_Resume.pdf" target="_blank" rel="noopener noreferrer">${icon('pdf')}<span>Resume (PDF)</span></a></li>`,
    `<li><a href="https://github.com/rahulkaushal04" target="_blank" rel="noopener noreferrer">${icon('globe')}<span>GitHub</span></a></li>`,
    `<li><a href="https://www.linkedin.com/in/rahul-kaushal04" target="_blank" rel="noopener noreferrer">${icon('globe')}<span>LinkedIn</span></a></li>`,
    '<li class="rk-sep" role="separator"></li>',
    `<li><button type="button" data-act="closeall">${icon('folder')}<span>Close all windows</span></button></li>`,
  ].join('');
  bar.innerHTML = `<button type="button" class="rk-start" id="rkStart" aria-expanded="false" aria-controls="rkStartMenu"><span class="rk-start__logo" aria-hidden="true"></span>Start</button>
    <div class="rk-tasks" role="toolbar" aria-label="Open windows"></div>
    <div class="rk-tray"><time class="rk-clock" aria-hidden="true"></time></div>
    <div class="rk-startmenu" id="rkStartMenu" hidden><div class="rk-startmenu__side" aria-hidden="true"><span>Desktop</span></div><ul>${startItems}</ul></div>`;
  document.body.append(root, bar);
  html.classList.add('rk-retro-ready');

  const area = root.querySelector('#rkArea');
  const tasks = bar.querySelector('.rk-tasks');
  const tray = bar.querySelector('.rk-tray');

  const wins = new Map();
  let z = 10;
  let cascade = 0;
  WINDOWS.forEach(([id, label, title, ic, size]) => {
    const sec = document.getElementById(id);
    const cont = sec?.querySelector(':scope > .container');
    if (!sec || !cont) return;
    const el = document.createElement('section');
    el.className = 'rk-win';
    el.dataset.win = id;
    el.hidden = true;
    el.tabIndex = -1;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-labelledby', `rkt-${id}`);
    el.innerHTML = `<div class="rk-win__bar">${icon(ic)}<span class="rk-win__title" id="rkt-${id}">${title}</span>
      <button type="button" class="rk-win__btn" data-w="min" aria-label="Minimize ${label}"><i class="rk-g-min"></i></button>
      <button type="button" class="rk-win__btn" data-w="max" aria-label="Maximize ${label}"><i class="rk-g-max"></i></button>
      <button type="button" class="rk-win__btn" data-w="close" aria-label="Close ${label}"><i class="rk-g-close"></i></button></div>
      <div class="rk-win__body" tabindex="0" role="region" aria-label="${label} contents"></div>`;
    el.querySelector('.rk-win__body').appendChild(cont);
    area.appendChild(el);
    wins.set(id, { id, label, el, sec, cont, size, max: false, min: false, open: false, rect: null, task: null, placed: false });
  });

  const areaSize = () => ({ w: area.clientWidth, h: area.clientHeight });
  const clampRect = (w) => {
    const { w: aw, h: ah } = areaSize();
    const width = Math.min(w.rect.w, aw - 8), height = Math.min(w.rect.h, ah - 8);
    w.rect = { w: width, h: height, l: Math.max(0, Math.min(w.rect.l, aw - width)), t: Math.max(0, Math.min(w.rect.t, ah - height)) };
  };
  const applyRect = (w) => { const r = w.rect; Object.assign(w.el.style, { left: `${r.l}px`, top: `${r.t}px`, width: `${r.w}px`, height: `${r.h}px` }); };

  const activate = (w) => {
    wins.forEach((x) => { x.el.classList.toggle('rk-win--active', x === w); if (x.task) x.task.setAttribute('aria-pressed', String(x === w)); });
    if (w) { w.el.style.zIndex = String(++z); }
  };
  const activeWin = () => [...wins.values()].find((x) => x.el.classList.contains('rk-win--active'));
  const topOpen = () => [...wins.values()].filter((x) => x.open && !x.min).sort((a, b) => Number(b.el.style.zIndex) - Number(a.el.style.zIndex))[0];

  const setMax = (w, on) => {
    w.max = on;
    w.el.classList.toggle('rk-win--max', on);
    const b = w.el.querySelector('[data-w="max"]');
    b.setAttribute('aria-label', `${on ? 'Restore' : 'Maximize'} ${w.label}`);
    b.classList.toggle('is-restore', on);
  };

  const open = (id) => {
    const w = wins.get(id);
    if (!w) return;
    if (!w.open) {
      if (!w.placed) {
        const { w: aw, h: ah } = areaSize();
        const iconsW = root.querySelector('.rk-icons').scrollWidth;
        const left = (aw >= 900 ? iconsW + 36 : 12) + (cascade % 6) * 30;
        w.rect = { w: w.size[0], h: w.size[1], l: left, t: 100 + (cascade % 6) * 30 };
        cascade++;
        clampRect(w);
        applyRect(w);
        w.placed = true;
      }
      w.open = true;
      w.el.hidden = false;
      w.task = document.createElement('button');
      w.task.type = 'button';
      w.task.className = 'rk-task';
      w.task.dataset.task = id;
      w.task.setAttribute('aria-label', w.label);
      w.task.innerHTML = `${icon(WINDOWS.find((x) => x[0] === id)[3])}<span>${w.label}</span>`;
      tasks.appendChild(w.task);
      if (MOBILE()) setMax(w, true);
    }
    if (w.min) { w.min = false; w.el.hidden = false; fly(w, 'rk-win--restore-anim'); }
    activate(w);
    w.el.focus({ preventScroll: true });
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fly = (w, cls) => {
    if (reduce.matches || !w.task) return;
    const a = w.el.getBoundingClientRect(), t = w.task.getBoundingClientRect();
    w.el.style.setProperty('--dx', `${t.left + t.width / 2 - (a.left + a.width / 2)}px`);
    w.el.style.setProperty('--dy', `${t.top + t.height / 2 - (a.top + a.height / 2)}px`);
    w.el.classList.add(cls);
    setTimeout(() => w.el.classList.remove(cls), 240);
  };
  const minimize = (w) => {
    w.min = true;
    w.task?.setAttribute('aria-pressed', 'false');
    w.el.classList.remove('rk-win--active');
    fly(w, 'rk-win--min-anim');
    setTimeout(() => { if (w.min) w.el.hidden = true; }, reduce.matches ? 0 : 230);
    const next = topOpen();
    if (next) activate(next);
  };
  const close = (w, refocus = true) => {
    w.open = false; w.min = false; w.el.hidden = true;
    w.el.classList.remove('rk-win--active');
    w.task?.remove(); w.task = null;
    const next = topOpen();
    if (next) activate(next); else if (refocus) root.querySelector(`[data-open="${w.id}"]`)?.focus();
  };

  const startBtn = bar.querySelector('.rk-start');
  const menu = bar.querySelector('.rk-startmenu');
  const closeMenu = (refocus) => { menu.hidden = true; startBtn.setAttribute('aria-expanded', 'false'); if (refocus) startBtn.focus(); };
  const onClick = (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener && (root.contains(opener) || bar.contains(opener))) { closeMenu(false); open(opener.dataset.open); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'closeall') { closeMenu(false); wins.forEach((w) => w.open && close(w, false)); return; }
    if (e.target.closest('.rk-startmenu a')) { closeMenu(false); return; }
    const task = e.target.closest('.rk-task');
    if (task) {
      const w = wins.get(task.dataset.task);
      if (w.min) open(w.id); else if (w.el.classList.contains('rk-win--active')) minimize(w); else open(w.id);
      return;
    }
    const btn = e.target.closest('.rk-win__btn');
    if (btn) {
      const w = [...wins.values()].find((x) => x.el.contains(btn));
      const k = btn.dataset.w;
      if (k === 'min') minimize(w); else if (k === 'close') close(w); else { setMax(w, !w.max); activate(w); }
      return;
    }
    const a = e.target.closest('a[href^="#"]');
    if (a && wins.has(a.getAttribute('href').slice(1))) { e.preventDefault(); e.stopPropagation(); open(a.getAttribute('href').slice(1)); }
  };
  document.addEventListener('click', onClick, true);
  startBtn.addEventListener('click', () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    startBtn.setAttribute('aria-expanded', String(opening));
    if (opening) menu.querySelector('button, a').focus();
  });
  const onKey = (e) => {
    if (e.key === 'Escape' && !menu.hidden) { e.stopPropagation(); closeMenu(true); }
  };
  bar.addEventListener('keydown', onKey);
  const onDown = (e) => {
    if (!menu.hidden && !e.target.closest('.rk-taskbar')) closeMenu(false);
    const winEl = e.target.closest('.rk-win');
    if (winEl && !e.target.closest('.rk-win__btn')) { const w = [...wins.values()].find((x) => x.el === winEl); if (w && !winEl.classList.contains('rk-win--active')) activate(w); }
  };
  document.addEventListener('pointerdown', onDown);

  let drag = null;
  area.addEventListener('pointerdown', (e) => {
    const bar2 = e.target.closest('.rk-win__bar');
    if (!bar2 || e.target.closest('.rk-win__btn')) return;
    const w = [...wins.values()].find((x) => x.el === bar2.parentElement);
    if (!w || w.max || MOBILE()) return;
    drag = { w, dx: e.clientX - w.rect.l, dy: e.clientY - w.rect.t };
    bar2.setPointerCapture(e.pointerId);
  });
  area.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const { w: aw, h: ah } = areaSize();
    const w = drag.w;
    w.rect.l = Math.max(-(w.rect.w - 90), Math.min(e.clientX - drag.dx, aw - 90));
    w.rect.t = Math.max(0, Math.min(e.clientY - drag.dy, ah - 28));
    applyRect(w);
  });
  area.addEventListener('pointerup', () => { drag = null; });
  area.addEventListener('dblclick', (e) => {
    const bar2 = e.target.closest('.rk-win__bar');
    if (!bar2 || e.target.closest('.rk-win__btn')) return;
    const w = [...wins.values()].find((x) => x.el === bar2.parentElement);
    if (w && !MOBILE()) setMax(w, !w.max);
  });
  const ro = new ResizeObserver((entries) => {
    entries.forEach((en) => { const w = [...wins.values()].find((x) => x.el === en.target); if (w && !w.max && w.open) { w.rect.w = en.target.offsetWidth; w.rect.h = en.target.offsetHeight; } });
  });
  wins.forEach((w) => ro.observe(w.el));
  const onResize = () => { wins.forEach((w) => { if (w.open && !w.max) { clampRect(w); applyRect(w); } if (MOBILE() && w.open) setMax(w, true); }); };
  addEventListener('resize', onResize);

  const clock = bar.querySelector('.rk-clock');
  const tick = () => { clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); };
  tick();
  const clockTimer = setInterval(tick, 15000);

  buildGadgets(root);
  const stopSaver = buildSaver();

  import('./cats.js').then((m) => m.startCats()).catch(() => {});

  const hash = location.hash.slice(1);
  open(wins.has(hash) ? hash : 'hero');
  const onHash = () => { const h = location.hash.slice(1); if (wins.has(h)) open(h); };
  addEventListener('hashchange', onHash);

  desk = {
    root, bar, wins,
    cleanup() {
      clearInterval(clockTimer);
      stopSaver();
      import('./cats.js').then((m) => m.stopCats()).catch(() => {});
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointerdown', onDown);
      removeEventListener('resize', onResize);
      removeEventListener('hashchange', onHash);
      ro.disconnect();
      wins.forEach((w) => w.sec.appendChild(w.cont));
      root.remove(); bar.remove();
      html.classList.remove('rk-retro-ready');
    },
  };
}

async function buildExplorer() {
  const host = document.getElementById('experienceTimeline');
  if (!host) return;
  const entries = await getJSON('experience.json');
  if (!entries.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'rk-retro-only rk-explorer';
  const rows = entries.map((e, i) => {
    const current = e.endDate.trim().toLowerCase() === 'present';
    return `<tr><td><button type="button" class="rk-row" data-i="${i}" aria-current="${i === 0}">${icon('note')}<span>${esc(e.role)}</span></button></td><td>${esc(e.startDate)} to ${esc(e.endDate)}</td><td>${current ? 'Current' : 'Past'}</td></tr>`;
  }).join('');
  wrap.innerHTML = `
    <p class="rk-pathbar">Address: C:\\${esc(entries[0].company)}\\Roles</p>
    <div class="rk-explorer__body">
      <table class="rk-explorer__list"><thead><tr><th scope="col">Name</th><th scope="col">Dates</th><th scope="col">Status</th></tr></thead><tbody>${rows}</tbody></table>
      <article class="rk-explorer__preview" aria-live="polite" tabindex="0" aria-label="Role details"></article>
    </div>
    <p class="rk-statusbar">${entries.length} objects</p>`;
  host.before(wrap);
  const pane = wrap.querySelector('.rk-explorer__preview');
  const show = (i) => {
    const e = entries[i];
    wrap.querySelectorAll('.rk-row').forEach((b) => b.setAttribute('aria-current', String(Number(b.dataset.i) === i)));
    pane.innerHTML = `<h3>${esc(e.role)}</h3><p class="rk-meta">${esc(e.company)} · ${esc(e.startDate)} to ${esc(e.endDate)}</p>
      ${e.summary ? `<p>${esc(e.summary)}</p>` : ''}
      <ul>${(e.description || []).map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
      <p class="rk-meta">${(e.tags || []).map(esc).join(', ')}</p>`;
  };
  wrap.addEventListener('click', (ev) => { const b = ev.target.closest('.rk-row'); if (b) show(Number(b.dataset.i)); });
  show(0);
}

async function buildWizard() {
  const host = document.getElementById('projectsGrid');
  if (!host) return;
  const all = await getJSON('projects.json');
  const list = all.filter((p) => p.featured).slice(0, 2);
  if (!list.length) return;
  const steps = [...list, null];
  const wrap = document.createElement('div');
  wrap.className = 'rk-retro-only rk-wizard';
  wrap.innerHTML = `
    <div class="rk-wizard__side" aria-hidden="true"><span class="rk-wizard__art">${icon('setup')}</span><span class="rk-wizard__name">Setup</span></div>
    <div class="rk-wizard__main" aria-live="polite"></div>
    <div class="rk-wizard__buttons"><button type="button" class="btn" data-act="back">&lt; Back</button><button type="button" class="btn btn-primary" data-act="next">Next &gt;</button><a class="btn" href="projects.html">View all projects</a></div>`;
  host.before(wrap);
  const main = wrap.querySelector('.rk-wizard__main');
  const back = wrap.querySelector('[data-act="back"]');
  const next = wrap.querySelector('[data-act="next"]');
  let i = 0;
  const render = () => {
    const p = steps[i];
    back.disabled = i === 0;
    next.textContent = i === steps.length - 1 ? 'Finish' : 'Next >';
    if (!p) { main.innerHTML = '<h3>Setup complete</h3><p>Those are the featured projects. The full list has everything else.</p>'; return; }
    main.innerHTML = `<p class="rk-meta">Step ${i + 1} of ${steps.length}${p.status ? ' · ' + esc(p.status) : ''}</p><h3>${esc(p.title)}</h3>
      <img src="${esc(p.thumbnail)}" alt="" width="680" height="383" loading="lazy">
      <p>${esc(p.description)}</p><p class="rk-meta">${(p.tags || []).map(esc).join(', ')}</p>
      <p class="rk-links">${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">Live</a>` : ''}${p.githubUrl ? ` <a href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">Code</a>` : ''}</p>`;
  };
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'next' && i === steps.length - 1) { wrap.closest('.rk-win')?.querySelector('[data-w="close"]')?.click(); return; }
    i = Math.max(0, Math.min(steps.length - 1, i + (b.dataset.act === 'next' ? 1 : -1)));
    render();
  });
  render();
}

async function buildInbox() {
  const host = document.getElementById('contributionsGrid');
  if (!host || document.querySelector('.contributions-page__hero')) return;
  const items = (await getJSON('contributions.json')).sort((a, b) => new Date(b.mergedDate) - new Date(a.mergedDate)).slice(0, 5);
  if (!items.length) return;
  const date = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
  const wrap = document.createElement('div');
  wrap.className = 'rk-retro-only rk-inbox';
  wrap.innerHTML = `
    <p class="rk-pathbar">Inbox · ${items.length} messages</p>
    <table class="rk-inbox__list"><thead><tr><th scope="col">From</th><th scope="col">Subject</th><th scope="col">Received</th></tr></thead><tbody>
      ${items.map((c, i) => `<tr><td><button type="button" class="rk-row" data-i="${i}" aria-current="${i === 0}">${icon('mail')}<span>${esc(c.repo)}</span></button></td><td>${esc(c.prTitle)}</td><td>${date(c.mergedDate)}</td></tr>`).join('')}
    </tbody></table>
    <article class="rk-inbox__preview" aria-live="polite" tabindex="0" aria-label="Message"></article>`;
  host.before(wrap);
  const pane = wrap.querySelector('.rk-inbox__preview');
  const show = (i) => {
    const c = items[i];
    wrap.querySelectorAll('.rk-row').forEach((b) => b.setAttribute('aria-current', String(Number(b.dataset.i) === i)));
    pane.innerHTML = `<p class="rk-meta">From: ${esc(c.repo)}<br>Subject: ${esc(c.prTitle)}<br>Status: ${c.status === 'open' ? 'Open' : 'Merged'}${c.mergedDate ? ', ' + date(c.mergedDate) : ''}</p>
      <p>${esc(c.description)}</p><p class="rk-meta">${(c.tags || []).map(esc).join(', ')}</p>
      <p class="rk-links"><a href="${esc(c.prUrl)}" target="_blank" rel="noopener noreferrer">Open pull request</a></p>`;
  };
  wrap.addEventListener('click', (ev) => { const b = ev.target.closest('.rk-row'); if (b) show(Number(b.dataset.i)); });
  show(0);
}

function buildProps() {
  const host = document.querySelector('#about .about__grid');
  if (!host) return;
  const spec = (k) => [...document.querySelectorAll('.hero__spec')].find((e) => e.querySelector('dt')?.textContent === k)?.querySelector('dd')?.textContent;
  const roles = [...document.querySelectorAll('.hero__role')].map((e) => e.textContent);
  const rows = [['Role', roles[0]], ['Company', roles[2]], ['Team', spec('Team')], ['Base', spec('Base')], ['Since', spec('Since')], ['Patent', document.querySelector('.patent__number')?.textContent.trim()]].filter((r) => r[1]);
  const el = document.createElement('aside');
  el.className = 'rk-retro-only rk-props';
  el.setAttribute('aria-label', 'Properties');
  el.innerHTML = `<p class="rk-props__head">${icon('note')}<span>about.txt</span></p><dl>${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
  host.after(el);
}

export function enableRetro() {
  if (!document.getElementById('hero')) { document.documentElement.classList.add('rk-retro-failed'); return; }
  if (!built) {
    built = true;
    buildProps();
    buildExplorer();
    buildWizard();
    buildInbox();
  }
  mountDesktop();
}

