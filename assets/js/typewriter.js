const TYPE_SPEED   = 100;
const DELETE_SPEED = 60;
const PAUSE_AFTER  = 2000;
const PAUSE_BEFORE = 400;

let el;
let prefixEl;
let roles = [];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;

function article(word) {
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

function updatePrefix() {
  if (prefixEl) prefixEl.textContent = `I'm ${article(roles[roleIdx])} `;
}

function tick() {
  if (!el || roles.length === 0) return;

  const current = roles[roleIdx];

  if (isDeleting) {
    charIdx--;
    el.textContent = current.substring(0, charIdx);

    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      updatePrefix();
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

export async function initTypewriter() {
  el = document.getElementById('typewriter');
  prefixEl = document.getElementById('rolesPrefix');
  if (!el) return;

  try {
    const res  = await fetch('data/meta.json');
    const meta = await res.json();
    if (Array.isArray(meta.roles) && meta.roles.length > 0) {
      roles = meta.roles;
    }
  } catch {
    roles = ['Developer', 'Builder', 'Problem Solver'];
  }

  if (roles.length === 0) {
    roles = ['Developer', 'Builder', 'Problem Solver'];
  }

  updatePrefix();
  tick();
}
