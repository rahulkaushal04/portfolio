// contact.js - Form validation, Formspree submission, and real-time field feedback.

import { showToast } from './utils.js';

let form;
let submitBtn;

// Validation rules keyed by input name attribute.
const VALIDATORS = {
  name: {
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

/**
 * Validates a single field and toggles its inline error message.
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 * @returns {boolean}
 */
function validateField(input) {
  const rule = VALIDATORS[input.name];
  if (!rule) return true;

  const errorSpan = document.getElementById(`${input.name}Error`);
  const isValid = rule.test(input.value);

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
 * Validates all form fields and returns whether the form is ready to submit.
 * @returns {boolean}
 */
function validateAll() {
  let allValid = true;
  form.querySelectorAll('.contact__input').forEach((input) => {
    if (!validateField(input)) allValid = false;
  });
  return allValid;
}

// Accepts 'loading' | 'success' | 'idle' and updates the button appearance accordingly.
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
      setTimeout(() => setButtonState('idle'), 2500);
      break;
    case 'idle':
    default:
      break;
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  if (!validateAll()) return;

  setButtonState('loading');

  const formData = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      setButtonState('success');
      showToast("Message sent! I'll get back to you soon.", 'success');
      form.reset();
      // Clear any leftover error states from before submission
      form.querySelectorAll('.contact__input').forEach((input) => input.classList.remove('error'));
      form.querySelectorAll('.contact__error').forEach((span) => (span.textContent = ''));
    } else {
      throw new Error(`Formspree returned ${res.status}`);
    }
  } catch (err) {
    setButtonState('idle');
    showToast('Something went wrong. Please try again.', 'error');
    console.warn('[contact] Submit error:', err.message);
  }
}

function initBlurValidation() {
  if (!form) return;

  form.querySelectorAll('.contact__input').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));

    // Re-validate on each keystroke once the field is already in an error state
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });
}

export function initContact() {
  form = document.getElementById('contactForm');
  submitBtn = document.getElementById('contactSubmit');

  if (form) {
    form.addEventListener('submit', handleSubmit);
    initBlurValidation();
  }
}
