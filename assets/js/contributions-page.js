// contributions-page.js - Full contributions listing page with search and repo filtering.
// Standalone entry point for contributions.html.

import { initAnimations } from './animations.js';
import { initCursor }     from './cursor.js';

/* ── State ─────────────────────────────────────────── */
let allContributions = [];
let activeRepo       = 'all';
let searchTerm       = '';

/* ── DOM refs (set in init) ────────────────────────── */
let grid, statsContainer, emptyState, countEl, searchInput, repoContainer, clearBtn;

/**
 * Formats a date string (YYYY-MM-DD) into "Nov 2025".
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Returns unique repo count.
 */
function uniqueRepos(contribs) {
  return new Set(contribs.map((c) => c.repo));
}

/* ── Stats Row ─────────────────────────────────────── */
function renderStats() {
  if (!statsContainer) return;

  const totalPRs  = allContributions.length;
  const totalRepos = uniqueRepos(allContributions).size;

  statsContainer.innerHTML = `
    <div class="contributions__stat reveal">
      <span class="contributions__stat-number">${totalPRs}</span>
      <span class="contributions__stat-label">PRs</span>
    </div>
    <div class="contributions__stat reveal">
      <span class="contributions__stat-number">${totalRepos}</span>
      <span class="contributions__stat-label">Repositories</span>
    </div>
  `;
}

/* ── Card HTML (mirrors contributions.js) ──────────── */
function cardHTML(contribution) {
  const tags = contribution.tags
    .map((t) => `<span class="tag-chip">${t}</span>`)
    .join('');

  const dateLabel = contribution.mergedDate
    ? formatDate(contribution.mergedDate)
    : '';

  return `
    <article class="contributions__card reveal" data-repo="${contribution.repo}">
      <div class="contributions__card-header">
        <span class="contributions__repo">
          <svg class="contributions__repo-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="18" r="3"></circle>
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="18" cy="6" r="3"></circle>
            <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
            <path d="M12 12v3"></path>
          </svg>
          ${contribution.repo}
        </span>
        ${contribution.status === 'open' ? `
        <span class="contributions__open-badge">
          <svg class="contributions__merged-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="18" cy="18" r="3"></circle>
            <circle cx="6" cy="6" r="3"></circle>
            <path d="M6 9v12"></path>
            <path d="M18 9V6"></path>
            <circle cx="18" cy="6" r="3"></circle>
          </svg>
          Open
        </span>` : `
        <span class="contributions__merged-badge">
          <svg class="contributions__merged-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="18" cy="18" r="3"></circle>
            <circle cx="6" cy="6" r="3"></circle>
            <path d="M6 21V9a9 9 0 0 0 9 9"></path>
          </svg>
          Merged
        </span>`}
      </div>

      <h3 class="contributions__pr-title">
        <a href="${contribution.prUrl}" target="_blank" rel="noopener noreferrer"
           class="contributions__pr-link">
          ${contribution.prTitle}
          <svg class="contributions__external-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </h3>

      <p class="contributions__description">${contribution.description}</p>

      <div class="contributions__card-footer">
        <div class="contributions__tags">${tags}</div>
        ${dateLabel ? `<span class="contributions__date">${dateLabel}</span>` : ''}
      </div>
    </article>`;
}

/* ── Fetch ─────────────────────────────────────────── */
async function fetchContributions() {
  try {
    const res = await fetch('data/contributions.json');
    return await res.json();
  } catch {
    console.warn('[contributions-page] Failed to load contributions.json');
    return [];
  }
}

/* ── Filtering logic ───────────────────────────────── */
function getFiltered() {
  return allContributions.filter((c) => {
    const matchesRepo =
      activeRepo === 'all' || c.repo === activeRepo;

    const matchesSearch =
      searchTerm === '' ||
      c.prTitle.toLowerCase().includes(searchTerm) ||
      c.description.toLowerCase().includes(searchTerm) ||
      c.repo.toLowerCase().includes(searchTerm) ||
      (c.tags || []).some((t) => t.toLowerCase().includes(searchTerm));

    return matchesRepo && matchesSearch;
  });
}

/* ── Render ────────────────────────────────────────── */
function render() {
  const filtered = getFiltered();

  // Update count
  const total = allContributions.length;
  const shown = filtered.length;
  countEl.textContent =
    shown === total
      ? `${total} contribution${total !== 1 ? 's' : ''}`
      : `${shown} of ${total} contribution${total !== 1 ? 's' : ''}`;

  // Toggle empty state
  const isEmpty = filtered.length === 0;
  emptyState.hidden = !isEmpty;
  grid.hidden = isEmpty;

  if (!isEmpty) {
    // Sort by date descending
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.mergedDate) - new Date(a.mergedDate)
    );
    grid.innerHTML = sorted.map(cardHTML).join('');
    if (window.__reObserveReveals) window.__reObserveReveals();
  }
}

/* ── Build repo filter buttons ─────────────────────── */
function buildRepoFilters() {
  const repos = [...uniqueRepos(allContributions)].sort();
  const btns = repos
    .map((r) => `<button class="contributions-page__repo-btn" data-repo="${r}">${r}</button>`)
    .join('');

  repoContainer.innerHTML =
    `<button class="contributions-page__repo-btn active" data-repo="all">All</button>` + btns;
}

/* ── Event Handlers ────────────────────────────────── */
function onRepoClick(e) {
  const btn = e.target.closest('.contributions-page__repo-btn');
  if (!btn) return;

  activeRepo = btn.dataset.repo;
  repoContainer.querySelectorAll('.contributions-page__repo-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.repo === activeRepo);
  });
  render();
}

function onSearchInput(e) {
  searchTerm = e.target.value.trim().toLowerCase();
  render();
}

function onClearFilters() {
  activeRepo = 'all';
  searchTerm = '';
  searchInput.value = '';
  repoContainer.querySelectorAll('.contributions-page__repo-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.repo === 'all');
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
  grid           = document.getElementById('contributionsGrid');
  statsContainer = document.getElementById('contributionsStats');
  emptyState     = document.getElementById('contributionsEmpty');
  countEl        = document.getElementById('contributionCount');
  searchInput    = document.getElementById('contributionSearch');
  repoContainer  = document.getElementById('contributionRepoFilters');
  clearBtn       = document.getElementById('contributionsClearFilters');

  // Init shared modules
  initAnimations();
  initCursor();
  initScrollProgress();
  initBackToTop();
  setFooterYear();

  // Load contributions
  allContributions = await fetchContributions();
  renderStats();
  buildRepoFilters();
  render();

  // Bind events
  repoContainer.addEventListener('click', onRepoClick);
  searchInput.addEventListener('input', onSearchInput);
  if (clearBtn) clearBtn.addEventListener('click', onClearFilters);
});
