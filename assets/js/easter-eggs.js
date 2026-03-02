// easter-eggs.js - Konami code (up up down down left right left right B A) fires a confetti burst.
// Also prints a styled message in the browser console for curious developers.

// Sequence: up up down down left right left right B A
const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

let konamiIndex = 0;

/**
 * Lazily loads canvas-confetti from CDN on the first trigger
 * so it is not bundled into the main payload.
 * @returns {Promise<Function>}
 */
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

    // Centre burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#4F8EF7', '#00D4AA', '#7C3AED', '#F59E0B', '#EF4444'],
    });

    // Side cannons after a short delay for extra flair
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
    // Confetti failed to load, nothing to do
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
    '%c👋 Hey, fellow developer!%c\n' +
    "%cCurious how this site works? It's all vanilla HTML, CSS & JS - no frameworks.\n" +
    'Check out the source: https://github.com/rahulkaushal04/portfolio\n' +
    'Try the Konami code for a surprise! up up down down left right left right B A',
    styles,
    '',
    subtitleStyles
  );
}

export function initEasterEggs() {
  initKonami();
  printConsoleMessage();
}
