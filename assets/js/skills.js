/* ──────────────────────────────────────────────────────────
   skills.js — Fetch, Render & Filter Skill Cards
   ────────────────────────────────────────────────────────── */

/** @type {HTMLElement|null} */
let grid;

/** @type {HTMLElement|null} */
let filtersContainer;

/** @type {Object[]} */
let skills = [];

/* ── Icon Resolution ─────────────────────────────────── */

/**
 * Convert a skill name to a filename slug.
 * e.g. "LangChain" → "langchain", "GitHub Actions" → "github-actions"
 * @param {string} name
 * @returns {string}
 */
function nameToSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Global onerror handler for skill icon images.
 * Resolution order (auto-detect):  slug.svg → slug.png → devicon → placeholder
 * Resolution order (explicit iconImage field): iconImage → devicon → placeholder
 *
 * @param {HTMLImageElement} img
 */
window.__skillIconFallback = function (img) {
  // If this was an svg auto-detect attempt, try png next
  if (img.dataset.step === '0' && !img.dataset.explicit) {
    img.dataset.step = '1';
    img.src = `assets/images/skills/${img.dataset.slug}.png`;
    return;
  }

  // Hide the failed image and reveal the devicon <i> fallback
  img.style.display = 'none';
  const deviconEl = img.nextElementSibling;
  if (deviconEl) {
    deviconEl.style.display = '';

    // Last resort: if devicon class is unknown devicon will render nothing,
    // so swap to the placeholder image after a brief check
    deviconEl.addEventListener('animationend', () => {}, { once: true });
    setTimeout(() => {
      if (deviconEl.offsetWidth === 0) {
        deviconEl.style.display = 'none';
        const ph = document.createElement('img');
        ph.src = 'assets/images/skills/_placeholder.svg';
        ph.className = 'skills__custom-icon skills__icon-placeholder';
        ph.alt = '';
        deviconEl.insertAdjacentElement('afterend', ph);
      }
    }, 200);
  }
};

/* ── Render ──────────────────────────────────────────── */

/**
 * Build HTML for a single skill card.
 *
 * Icon resolution priority:
 *  1. Explicit `iconImage` field in skills.json  → assets/images/skills/{iconImage}
 *  2. Auto-detect                                → assets/images/skills/{slug}.svg
 *  3. Auto-detect fallback                       → assets/images/skills/{slug}.png
 *  4. Devicon class (`icon` field)
 *  5. Placeholder  (_placeholder.svg)
 *
 * @param {Object} skill
 * @returns {string}
 */
function cardHTML(skill) {
  const learningBadge = skill.learning
    ? '<span class="skills__badge-learning">Learning</span>'
    : '';

  const slug    = nameToSlug(skill.name);
  const imgSrc  = skill.iconImage
    ? `assets/images/skills/${skill.iconImage}`
    : `assets/images/skills/${slug}.svg`;
  const explicit  = skill.iconImage ? 'data-explicit="1"' : '';
  const sizeStyle = skill.iconSize
    ? `style="width:${skill.iconSize}px;height:${skill.iconSize}px"`
    : '';

  return `
    <div class="skills__card reveal"
         data-category="${skill.category}"
         title="${skill.name}">
      <span class="skills__card-icon">
        <img src="${imgSrc}"
             class="skills__custom-icon"
             alt="${skill.name} icon"
             data-slug="${slug}"
             data-step="0"
             ${explicit}
             ${sizeStyle}
             onerror="window.__skillIconFallback(this)"
             loading="lazy">
        <i class="${skill.icon} colored" style="display:none" aria-hidden="true"></i>
      </span>
      <span class="skills__card-name">${skill.name}</span>
      ${learningBadge}
      <span class="skills__card-tooltip">${skill.name}</span>
    </div>`;
}

/**
 * Render all skill cards into the grid.
 */
function renderSkills() {
  if (!grid) return;
  grid.innerHTML = skills.map(cardHTML).join('');
}

/* ── Filter Logic ────────────────────────────────────── */

/**
 * Filter cards with a fade-out / fade-in animation.
 * @param {string} category — 'all' or a category slug
 */
function filterSkills(category) {
  if (!grid) return;

  const cards = grid.querySelectorAll('.skills__card');

  cards.forEach((card) => {
    const match =
      category === 'all' || card.dataset.category === category;

    if (!match) {
      // Fade out
      card.classList.add('fade-out');
      card.classList.remove('fade-in');
    } else {
      // Fade in (start invisible, then animate)
      card.classList.remove('fade-out');
      card.classList.add('fade-in');
      card.style.display = '';
    }
  });

  // After the fade-out duration, hide non-matching cards
  setTimeout(() => {
    cards.forEach((card) => {
      if (card.classList.contains('fade-out')) {
        card.style.display = 'none';
      }
    });
  }, 300);
}

/**
 * Attach click handlers to filter buttons.
 */
function initFilterTabs() {
  if (!filtersContainer) return;

  const buttons = filtersContainer.querySelectorAll('.skills__filter-btn');

  filtersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.skills__filter-btn');
    if (!btn) return;

    // Update active state
    buttons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    filterSkills(btn.dataset.category);
  });
}

/* ── Vanilla Tilt for Skill Cards ─────────────────────── */

function applySkillTilt() {
  if (!grid) return;
  const cards = grid.querySelectorAll('.skills__card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateX = ((y - midY) / midY) * -6; // max ±6 deg
      const rotateY = ((x - midX) / midX) * 6;

      card.style.transform =
        `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Init ────────────────────────────────────────────── */

export async function initSkills() {
  grid             = document.getElementById('skillsGrid');
  filtersContainer = document.getElementById('skillFilters');

  if (!grid) return;

  try {
    const res  = await fetch('data/skills.json');
    skills     = await res.json();
  } catch {
    console.warn('[skills] Failed to load skills.json');
    return;
  }

  renderSkills();
  applySkillTilt();
  initFilterTabs();

  // Re-observe newly rendered cards for scroll-reveal
  if (window.__reObserveReveals) {
    window.__reObserveReveals();
  }
}
