/* ──────────────────────────────────────────────────────────
   utils.js — Shared utilities (imported by multiple modules)
   ────────────────────────────────────────────────────────── */

/**
 * Show a toast notification.
 * @param {string} message  — text to display
 * @param {'success'|'error'} [type='success'] — toast variant
 * @param {number} [duration=3000] — ms before auto-dismiss
 */
export function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;

  container.appendChild(toast);

  // Trigger entrance animation
  requestAnimationFrame(() => toast.classList.add('visible'));

  setTimeout(() => {
    toast.classList.remove('visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    // Safety net: remove after 500 ms even if transitionend doesn't fire
    setTimeout(() => toast.remove(), 500);
  }, duration);
}
