// skills.js - Fetches skills.json and renders filterable, tilt-on-hover skill cards.
// Icon resolution order: explicit iconImage field -> slug.svg -> slug.png -> devicon -> placeholder.

let grid;
let filtersContainer;
let skills = [];

// Converts a display name to a filename slug, e.g. "GitHub Actions" -> "github-actions".
function nameToSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Global onerror handler injected into each skill icon img.
 * Tries svg -> png, then falls back to a devicon, then a placeholder
 * if the devicon class renders at zero width.
 * @param {HTMLImageElement} img
 */
window.__skillIconFallback = function (img) {
  // First failure on auto-detect: try .png instead of .svg
  if (img.dataset.step === '0' && !img.dataset.explicit) {
    img.dataset.step = '1';
    img.src = `assets/images/skills/${img.dataset.slug}.png`;
    return;
  }

  // Show the devicon <i> that sits right after the <img>
  img.style.display = 'none';
  const deviconEl = img.nextElementSibling;
  if (deviconEl) {
    deviconEl.style.display = '';

    // If the devicon class is unrecognised it renders at zero width; swap in the placeholder
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

/**
 * Builds the HTML string for a single skill card.
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

function renderSkills() {
  if (!grid) return;
  grid.innerHTML = skills.map(cardHTML).join('');
}

/**
 * Shows only cards matching the given category, with a fade transition.
 * @param {string} category - 'all' or a category slug
 */
function filterSkills(category) {
  if (!grid) return;

  const cards = grid.querySelectorAll('.skills__card');

  cards.forEach((card) => {
    const match = category === 'all' || card.dataset.category === category;

    if (!match) {
      card.classList.add('fade-out');
      card.classList.remove('fade-in');
    } else {
      card.classList.remove('fade-out');
      card.classList.add('fade-in');
      card.style.display = '';
    }
  });

  // Physically hide faded-out cards after the transition completes
  setTimeout(() => {
    cards.forEach((card) => {
      if (card.classList.contains('fade-out')) card.style.display = 'none';
    });
  }, 300);
}

function initFilterTabs() {
  if (!filtersContainer) return;

  const buttons = filtersContainer.querySelectorAll('.skills__filter-btn');

  filtersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.skills__filter-btn');
    if (!btn) return;

    buttons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    filterSkills(btn.dataset.category);
  });
}

function applySkillTilt() {
  if (!grid) return;

  grid.querySelectorAll('.skills__card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateX = ((y - midY) / midY) * -6; // max +-6 deg
      const rotateY = ((x - midX) / midX) *  6;

      card.style.transform =
        `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

export async function initSkills() {
  grid             = document.getElementById('skillsGrid');
  filtersContainer = document.getElementById('skillFilters');

  if (!grid) return;

  try {
    const res = await fetch('data/skills.json');
    skills    = await res.json();
  } catch {
    console.warn('[skills] Failed to load skills.json');
    return;
  }

  renderSkills();
  applySkillTilt();
  initFilterTabs();

  // Tell the scroll-reveal observer about the newly injected cards
  if (window.__reObserveReveals) {
    window.__reObserveReveals();
  }
}
