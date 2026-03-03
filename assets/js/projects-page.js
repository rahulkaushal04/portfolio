// projects-page.js - Full projects listing page with search and category filtering.
// Standalone entry point for projects.html.

import { initAnimations } from './animations.js';
import { initCursor }     from './cursor.js';

/* ── State ─────────────────────────────────────────── */
let allProjects = [];
let activeCat   = 'all';
let searchTerm  = '';

/* ── DOM refs (set in init) ────────────────────────── */
let grid, emptyState, countEl, searchInput, catContainer, clearBtn;

const STATUS_LABELS = {
  stable:     'Stable Release',
  beta:       'Beta',
  alpha:      'Alpha',
  wip:        'In Progress',
  'no-release': 'No Release Yet',
};

/* ── Card HTML (mirrors projects.js) ───────────────── */
function cardHTML(project) {
  const featuredClass = project.featured ? ' featured' : '';
  const categories = project.categories.join(' ');
  const tags = project.tags.map((t) => `<span class="tag-chip">${t}</span>`).join('');

  const statusBadge = project.status
    ? `<span class="projects__card-status" data-status="${project.status}">${STATUS_LABELS[project.status] ?? project.status}</span>`
    : '';

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
        ${statusBadge}
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

/* ── Tilt effect ───────────────────────────────────── */
function applyTilt() {
  grid.querySelectorAll('.projects__card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateX = ((y - midY) / midY) * -4;
      const rotateY = ((x - midX) / midX) *  4;
      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Fetch ─────────────────────────────────────────── */
async function fetchProjects() {
  try {
    const res = await fetch('data/projects.json');
    return await res.json();
  } catch {
    console.warn('[projects-page] Failed to load projects.json');
    return [];
  }
}

/* ── Filtering logic ───────────────────────────────── */
function getFiltered() {
  return allProjects.filter((p) => {
    const matchesCat =
      activeCat === 'all' ||
      (p.categories || []).some((c) => c.toLowerCase() === activeCat);

    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(searchTerm));

    return matchesCat && matchesSearch;
  });
}

/* ── Render ────────────────────────────────────────── */
function render() {
  const filtered = getFiltered();

  // Update count
  const total = allProjects.length;
  const shown = filtered.length;
  countEl.textContent =
    shown === total
      ? `${total} project${total !== 1 ? 's' : ''}`
      : `${shown} of ${total} project${total !== 1 ? 's' : ''}`;

  // Toggle empty state
  const isEmpty = filtered.length === 0;
  emptyState.hidden = !isEmpty;
  grid.hidden = isEmpty;

  if (!isEmpty) {
    // Featured first
    const sorted = [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));
    grid.innerHTML = sorted.map(cardHTML).join('');
    applyTilt();
    if (window.__reObserveReveals) window.__reObserveReveals();
  }
}

/* ── Collect unique categories & build filter buttons ── */
function buildCatFilters() {
  const catSet = new Set();
  allProjects.forEach((p) => (p.categories || []).forEach((c) => catSet.add(c)));

  const sorted = [...catSet].sort();
  const btns = sorted
    .map((c) => `<button class="projects-page__cat-btn" data-cat="${c}">${c}</button>`)
    .join('');

  catContainer.innerHTML =
    `<button class="projects-page__cat-btn active" data-cat="all">All</button>` + btns;
}

/* ── Event Handlers ────────────────────────────────── */
function onCatClick(e) {
  const btn = e.target.closest('.projects-page__cat-btn');
  if (!btn) return;

  activeCat = btn.dataset.cat;
  catContainer.querySelectorAll('.projects-page__cat-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.cat === activeCat);
  });
  render();
}

function onSearchInput(e) {
  searchTerm = e.target.value.trim().toLowerCase();
  render();
}

function onClearFilters() {
  activeCat = 'all';
  searchTerm = '';
  searchInput.value = '';
  catContainer.querySelectorAll('.projects-page__cat-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.cat === 'all');
  });
  render();
}

/* ── Scroll-progress bar ───────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
}

/* ── Back to top ───────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Footer year ───────────────────────────────────── */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = String(new Date().getFullYear());
}

/* ── Init ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  grid         = document.getElementById('projectsGrid');
  emptyState   = document.getElementById('projectsEmpty');
  countEl      = document.getElementById('projectCount');
  searchInput  = document.getElementById('projectSearch');
  catContainer = document.getElementById('projectCatFilters');
  clearBtn     = document.getElementById('projectsClearFilters');

  // Init shared modules
  initAnimations();
  initCursor();
  initScrollProgress();
  initBackToTop();
  setFooterYear();

  // Load projects
  allProjects = await fetchProjects();
  buildCatFilters();
  render();

  // Bind events
  catContainer.addEventListener('click', onCatClick);
  searchInput.addEventListener('input', onSearchInput);
  if (clearBtn) clearBtn.addEventListener('click', onClearFilters);
});
