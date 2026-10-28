const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

const POST = 'BIOS v2.3\nCPU: Go-486 DX2, 66 MHz\nMemory test: 640K OK\nDetecting appliance ...... OK\nMounting data/*.json ...... OK\nLoading desktop ...\n\nPress any key to skip';

function playBoot() {
  if (reduced.matches) return;
  const el = document.createElement('div');
  el.id = 'boot';
  el.className = 'boot boot--retro';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<pre class="boot__post">${POST}</pre>`;
  document.body.appendChild(el);

  const done = () => {
    el.classList.add('boot--out');
    setTimeout(() => el.remove(), 450);
    removeEventListener('keydown', done);
    clearTimeout(timer);
  };
  const timer = setTimeout(done, 3200);
  addEventListener('keydown', done, { once: true });
  el.addEventListener('pointerdown', done, { once: true });
}

export function initTheme() {
  if (!document.getElementById('hero')) {
    root.classList.add('rk-plain');
    return;
  }

  import('./retro.js').then((m) => m.enableRetro()).catch(() => root.classList.add('rk-plain'));

  try {
    if (!sessionStorage.getItem('rk-booted')) {
      sessionStorage.setItem('rk-booted', '1');
      playBoot();
    }
  } catch {
  }
}
