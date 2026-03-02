// projects.js - Fetches projects.json and renders filterable, tilt-on-hover project cards.

let grid;
let filtersContainer;
let projects = [];

/**
 * Builds the HTML string for a single project card.
 * @param {Object} project
 * @returns {string}
 */
function cardHTML(project) {
  const featuredClass = project.featured ? ' featured' : '';
  const categories = project.categories.join(' ');
  const tags = project.tags.map((t) => `<span class="tag-chip">${t}</span>`).join('');

  // Only render action buttons for non-empty URLs
  let actions = '';
  if (project.liveUrl) {
    actions += `
      <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer"
         class="projects__card-link" aria-label="Live demo of ${project.title}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
        Live
      </a>`;
  }
  if (project.githubUrl) {
    actions += `
      <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"
         class="projects__card-link" aria-label="GitHub repo for ${project.title}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
             fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57
          0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015
          1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925
          0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135
          3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805
          5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0
          24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        Code
      </a>`;
  }

  return `
    <article class="projects__card reveal${featuredClass}"
             data-categories="${categories}">
      <div class="projects__card-img-wrapper">
        <img src="${project.thumbnail}"
             alt="${project.title} screenshot"
             class="projects__card-img"
             loading="lazy" width="680" height="383">
        <div class="projects__card-overlay">
          <span class="projects__card-overlay-text">${project.description}</span>
        </div>
      </div>
      <div class="projects__card-body">
        <h3 class="projects__card-title">${project.title}</h3>
        <p class="projects__card-description">${project.description}</p>
        <div class="projects__card-tags">${tags}</div>
        <div class="projects__card-actions">${actions}</div>
      </div>
    </article>`;
}

function renderProjects() {
  if (!grid) return;

  // Featured cards always appear first
  const sorted = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

  grid.innerHTML = sorted.map(cardHTML).join('');
  applyTilt();
}

function applyTilt() {
  grid.querySelectorAll('.projects__card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateX = ((y - midY) / midY) * -4; // max +-4 deg
      const rotateY = ((x - midX) / midX) *  4;

      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function filterProjects(category) {
  if (!grid) return;

  const cards = grid.querySelectorAll('.projects__card');

  cards.forEach((card) => {
    const cats  = card.dataset.categories.split(' ');
    const match = category === 'all' || cats.includes(category);

    if (!match) {
      card.classList.add('filter-fade-out');
      card.classList.remove('filter-fade-in');
    } else {
      card.classList.remove('filter-fade-out', 'filter-hidden');
      card.classList.add('filter-fade-in');
    }
  });

  // Physically hide non-matching cards after the CSS transition completes
  setTimeout(() => {
    cards.forEach((card) => {
      if (card.classList.contains('filter-fade-out')) card.classList.add('filter-hidden');
    });
  }, 300);
}

function initFilterTabs() {
  if (!filtersContainer) return;

  const buttons = filtersContainer.querySelectorAll('.projects__filter-btn');

  filtersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.projects__filter-btn');
    if (!btn) return;

    buttons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    filterProjects(btn.dataset.category);
  });
}

export async function initProjects() {
  grid             = document.getElementById('projectsGrid');
  filtersContainer = document.getElementById('projectFilters');

  if (!grid) return;

  try {
    const res = await fetch('data/projects.json');
    projects  = await res.json();
  } catch {
    console.warn('[projects] Failed to load projects.json');
    return;
  }

  renderProjects();
  initFilterTabs();

  // Tell the scroll-reveal observer about the newly injected cards
  if (window.__reObserveReveals) {
    window.__reObserveReveals();
  }
}
