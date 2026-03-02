/* ──────────────────────────────────────────────────────────
   contact.js — Form Validation, Formspree Submit & Email Copy
   ────────────────────────────────────────────────────────── */

import { showToast } from './utils.js';

/** @type {HTMLFormElement|null} */
let form;

/** @type {HTMLButtonElement|null} */
let submitBtn;

/* ── Validation Rules ────────────────────────────────── */

const VALIDATORS = {
  name: {
    /** @param {string} v */
    test: (v) => v.trim().length >= 2,
    message: 'Name must be at least 2 characters.',
  },
  email: {
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: 'Please enter a valid email address.',
  },
  message: {
    test: (v) => v.trim().length >= 10,
    message: 'Message must be at least 10 characters.',
  },
};

/* ── Helpers ─────────────────────────────────────────── */

/**
 * Validate one field and show/clear its inline error.
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 * @returns {boolean}
 */
function validateField(input) {
  const name      = input.name;              // "name" | "email" | "message"
  const rule      = VALIDATORS[name];
  if (!rule) return true;

  const errorSpan = document.getElementById(`${name}Error`);
  const isValid   = rule.test(input.value);

  if (!isValid) {
    input.classList.add('error');
    if (errorSpan) errorSpan.textContent = rule.message;
  } else {
    input.classList.remove('error');
    if (errorSpan) errorSpan.textContent = '';
  }

  return isValid;
}

/**
 * Validate all fields in the form.
 * @returns {boolean}
 */
function validateAll() {
  const inputs = form.querySelectorAll('.contact__input');
  let allValid = true;

  inputs.forEach((input) => {
    if (!validateField(input)) allValid = false;
  });

  return allValid;
}

/* ── Submit Button State Machine ─────────────────────── */

function setButtonState(state) {
  if (!submitBtn) return;

  submitBtn.classList.remove('loading', 'success');
  submitBtn.disabled = false;

  switch (state) {
    case 'loading':
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      break;
    case 'success':
      submitBtn.classList.add('success');
      submitBtn.disabled = true;
      // Reset after 2.5 s
      setTimeout(() => setButtonState('idle'), 2500);
      break;
    case 'idle':
    default:
      break;
  }
}

/* ── Formspree Submission ────────────────────────────── */

async function handleSubmit(e) {
  e.preventDefault();
  if (!validateAll()) return;

  setButtonState('loading');

  const formData = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method:  'POST',
      body:    formData,
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      setButtonState('success');
      showToast('Message sent! I\u2019ll get back to you soon.', 'success');
      form.reset();
      // Clear any leftover error states
      form.querySelectorAll('.contact__input').forEach((input) => {
        input.classList.remove('error');
      });
      form.querySelectorAll('.contact__error').forEach((span) => {
        span.textContent = '';
      });
    } else {
      throw new Error(`Formspree returned ${res.status}`);
    }
  } catch (err) {
    setButtonState('idle');
    showToast('Something went wrong. Please try again.', 'error');
    console.warn('[contact] Submit error:', err.message);
  }
}



/* ── Real-time Blur Validation ───────────────────────── */

function initBlurValidation() {
  if (!form) return;

  form.querySelectorAll('.contact__input').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));

    // Clear error on input (once user starts correcting)
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
}

/* ── Init ────────────────────────────────────────────── */

export function initContact() {
  form      = document.getElementById('contactForm');
  submitBtn = document.getElementById('contactSubmit');

  if (form) {
    form.addEventListener('submit', handleSubmit);
    initBlurValidation();
  }

}
