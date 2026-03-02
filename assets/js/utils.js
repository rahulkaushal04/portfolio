// utils.js - Shared utilities imported by multiple modules.

/**
 * Shows a toast notification that auto-dismisses after a given duration.
 * @param {string} message
 * @param {'success'|'error'} [type='success']
 * @param {number} [duration=3000] - ms before the toast fades out
 */
export function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));

  setTimeout(() => {
    toast.classList.remove('visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    // Safety net if transitionend never fires
    setTimeout(() => toast.remove(), 500);
  }, duration);
}
