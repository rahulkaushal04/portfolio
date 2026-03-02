// cursor.js - Custom dot cursor that smoothly trails the mouse on desktop.
// Scales up over interactive elements. Skipped entirely on touch devices.

let dot;

let mouseX = 0;
let mouseY = 0;

// dotX/dotY lag behind the mouse; the gap closes each frame via lerp.
let dotX = 0;
let dotY = 0;

// Interpolation factor: lower value = more lag, higher = snappier.
const LERP = 0.15;

let isActive = false;

function animate() {
  if (!dot) return;

  dotX += (mouseX - dotX) * LERP;
  dotY += (mouseY - dotY) * LERP;

  dot.style.transform = `translate(${dotX}px, ${dotY}px)`;

  requestAnimationFrame(animate);
}

// Adds/removes the enlarged state when the pointer moves over interactive elements.
function initHoverDetection() {
  const selector = 'a, button, [role="button"], input, textarea, select, label';

  document.addEventListener('pointerover', (e) => {
    if (e.target.closest(selector)) dot?.classList.add('cursor-hover');
  });

  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(selector)) dot?.classList.remove('cursor-hover');
  });
}

export function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  dot = document.getElementById('cursorDot');
  if (!dot) return;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isActive) {
      isActive = true;
      dot.classList.add('visible');
    }
  });

  // Hide the dot when the pointer leaves the browser window
  document.addEventListener('mouseleave', () => {
    dot.classList.remove('visible');
    isActive = false;
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.add('visible');
    isActive = true;
  });

  initHoverDetection();
  requestAnimationFrame(animate);
}
