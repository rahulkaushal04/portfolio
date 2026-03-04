// easter-eggs.js - Hidden fun stuff for curious visitors.
// 1. Konami code → confetti burst
// 2. Type "matrix" → Matrix rain effect
// 3. Click logo 5× rapidly → "YOU FOUND ME" banner
// 4. Hold D + L → disco hue-rotate for 2 s

// ─────────────────────────────────────────────────────────
//  KONAMI CODE
// ─────────────────────────────────────────────────────────
const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

let konamiIndex = 0;

async function loadConfetti() {
  if (window.confetti) return window.confetti;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
    script.onload = () => resolve(window.confetti);
    script.onerror = () => reject(new Error('Failed to load confetti'));
    document.head.appendChild(script);
  });
}

async function fireConfetti() {
  try {
    const confetti = await loadConfetti();

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#4F8EF7', '#00D4AA', '#7C3AED', '#F59E0B', '#EF4444'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4F8EF7', '#00D4AA'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#7C3AED', '#F59E0B'],
      });
    }, 250);
  } catch {
    // Confetti failed to load
  }
}

function initKonami() {
  document.addEventListener('keydown', (e) => {
    const expected = KONAMI[konamiIndex];

    if (e.key === expected || e.key.toLowerCase() === expected) {
      konamiIndex++;

      if (konamiIndex === KONAMI.length) {
        konamiIndex = 0;
        fireConfetti();
      }
    } else {
      konamiIndex = 0;
    }
  });
}

// ─────────────────────────────────────────────────────────
//  MATRIX RAIN — type "matrix" anywhere on the page
// ─────────────────────────────────────────────────────────
const MATRIX_WORD = 'matrix';
let matrixBuffer = '';
let matrixActive = false;

function startMatrixRain() {
  if (matrixActive) return;
  matrixActive = true;

  const canvas = document.createElement('canvas');
  canvas.className = 'matrix-rain-canvas';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array.from({ length: columns }, () => Math.random() * -50 | 0);

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

  let frame;
  const startTime = performance.now();
  const DURATION = 4000;       // total visible time
  const FADE_OUT = 1500;       // last 1.5 s fades out
  let fadingOut = false;

  function draw(now) {
    const elapsed = now - startTime;

    // Start CSS opacity fade-out once we enter the fade window
    if (!fadingOut && elapsed >= DURATION - FADE_OUT) {
      fadingOut = true;
      canvas.style.opacity = '0';
    }

    // Remove canvas after CSS transition completes
    if (elapsed >= DURATION) {
      cancelAnimationFrame(frame);
      // Wait for the CSS opacity transition to finish before removing
      canvas.addEventListener('transitionend', () => {
        canvas.remove();
        matrixActive = false;
      }, { once: true });
      // Fallback if transitionend doesn't fire
      setTimeout(() => { canvas.remove(); matrixActive = false; }, FADE_OUT + 200);
      return;
    }

    // Semi-transparent black to create trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;

    // Stop spawning new drops during the fade-out window
    const spawning = elapsed < DURATION - FADE_OUT;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.random() * chars.length | 0];

      const brightness = Math.random() > 0.9 ? '#fff' : '#0f0';
      ctx.fillStyle = brightness;
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975 && spawning) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    frame = requestAnimationFrame(draw);
  }

  frame = requestAnimationFrame(draw);
}

function initMatrixRain() {
  document.addEventListener('keydown', (e) => {
    // Ignore if user is typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    matrixBuffer += e.key.toLowerCase();

    // Keep buffer trimmed to the length of the trigger word
    if (matrixBuffer.length > MATRIX_WORD.length) {
      matrixBuffer = matrixBuffer.slice(-MATRIX_WORD.length);
    }

    if (matrixBuffer === MATRIX_WORD) {
      matrixBuffer = '';
      startMatrixRain();
    }
  });
}

// ─────────────────────────────────────────────────────────
//  HIRE ME MODE — click the logo 5× rapidly
// ─────────────────────────────────────────────────────────
function initHireMe() {
  const logo = document.querySelector('.navbar__logo');
  if (!logo) return;

  let clickCount = 0;
  let clickTimer = null;
  const CLICKS_NEEDED = 5;
  const CLICK_WINDOW = 2000; // must click 5× within 2 s

  logo.addEventListener('click', (e) => {
    clickCount++;

    // Reset timer on each click
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, CLICK_WINDOW);

    if (clickCount >= CLICKS_NEEDED) {
      clickCount = 0;
      clearTimeout(clickTimer);
      e.preventDefault();
      launchHireMeBanner();
    }
  });
}

function launchHireMeBanner() {
  // Don't stack banners
  if (document.querySelector('.hire-me-banner')) return;

  const banner = document.createElement('div');
  banner.className = 'hire-me-banner';
  banner.innerHTML = '<span class="hire-me-banner__text">YOU FOUND ME</span>';
  document.body.appendChild(banner);

  // Remove after animation ends (~4 s)
  banner.addEventListener('animationend', () => banner.remove());
  setTimeout(() => banner.remove(), 5000); // fallback cleanup
}

// ─────────────────────────────────────────────────────────
//  DISCO MODE — hold D + L simultaneously
// ─────────────────────────────────────────────────────────
function initDisco() {
  const keysDown = new Set();
  let discoActive = false;

  function startDisco() {
    if (discoActive) return;
    discoActive = true;

    const root = document.documentElement;
    let hue = 0;
    const STEP = 30;          // degrees per tick
    const INTERVAL = 80;      // ms between ticks
    const DURATION = 2000;    // total disco time

    // Apply transition so the hue changes feel smooth
    root.style.transition = 'filter 80ms linear';
    root.style.filter = `hue-rotate(${hue}deg)`;

    const tick = setInterval(() => {
      hue = (hue + STEP) % 360;
      root.style.filter = `hue-rotate(${hue}deg)`;
    }, INTERVAL);

    // Settle back after DURATION
    setTimeout(() => {
      clearInterval(tick);
      // Smooth return to normal
      root.style.transition = 'filter 400ms ease-out';
      root.style.filter = '';

      // Clean up inline styles after transition
      setTimeout(() => {
        root.style.transition = '';
        root.style.filter = '';
        discoActive = false;
      }, 450);
    }, DURATION);
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    keysDown.add(e.key.toLowerCase());

    if (keysDown.has('d') && keysDown.has('l')) {
      startDisco();
    }
  });

  document.addEventListener('keyup', (e) => {
    keysDown.delete(e.key.toLowerCase());
  });
}

// ─────────────────────────────────────────────────────────
//  CONSOLE MESSAGE
// ─────────────────────────────────────────────────────────
function printConsoleMessage() {
  const styles = [
    'color: #4F8EF7',
    'font-size: 16px',
    'font-weight: bold',
    'font-family: "Inter", system-ui, sans-serif',
    'padding: 8px 0',
  ].join(';');

  const subtitleStyles = [
    'color: #A0AEC0',
    'font-size: 12px',
    'font-family: "Inter", system-ui, sans-serif',
  ].join(';');

  console.log(
    '%cHey, fellow developer!%c\n' +
    "%cCurious how this site works? It's all vanilla HTML, CSS & JS - no frameworks.\n" +
    'Check out the source: https://github.com/rahulkaushal04/portfolio\n' +
    'Try the Konami code for a surprise! up up down down left right left right B A\n' +
    'Type "matrix" for another one',
    styles,
    '',
    subtitleStyles
  );
}

// ─────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────
export function initEasterEggs() {
  initKonami();
  initMatrixRain();
  initHireMe();
  initDisco();
  printConsoleMessage();
}
