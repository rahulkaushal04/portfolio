// contributions.js - Fetches contributions.json and renders open-source PR cards.

let grid;
let statsContainer;
let contributions = [];

/**
 * Formats a date string (YYYY-MM-DD) into a human-readable form like "Nov 2025".
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Returns the unique set of repos contributed to.
 */
function uniqueRepos(contribs) {
  return new Set(contribs.map((c) => c.repo));
}

/**
 * Builds the stats row HTML showing total PRs merged and repos contributed to.
 */
function renderStats() {
  if (!statsContainer) return;

  const totalPRs   = contributions.length;
  const totalRepos  = uniqueRepos(contributions).size;

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

/**
 * Builds the HTML string for a single contribution card.
 */
function cardHTML(contribution) {
  const tags = contribution.tags
    .map((t) => `<span class="tag-chip">${t}</span>`)
    .join('');

  const dateLabel = contribution.mergedDate
    ? formatDate(contribution.mergedDate)
    : '';

  return `
    <article class="contributions__card reveal">
      <!-- Header: repo + merged badge -->
      <div class="contributions__card-header">
        <span class="contributions__repo">
          <!-- Git fork / repo icon -->
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
          <!-- Git PR icon -->
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
          <!-- Git merge icon -->
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

      <!-- PR title as link -->
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

      <!-- Description -->
      <p class="contributions__description">${contribution.description}</p>

      <!-- Footer: tags + date -->
      <div class="contributions__card-footer">
        <div class="contributions__tags">${tags}</div>
        ${dateLabel ? `<span class="contributions__date">${dateLabel}</span>` : ''}
      </div>
    </article>`;
}

/**
 * Renders contribution cards into the grid.
 * On homepage, shows only the first 3 (most recent). Full page shows all.
 */
function renderContributions() {
  if (!grid) return;

  // Sort by date descending (most recent first)
  const sorted = [...contributions].sort(
    (a, b) => new Date(b.mergedDate) - new Date(a.mergedDate)
  );

  // On homepage, limit to 3 cards
  const isHomepage = !document.querySelector('.contributions-page__hero');
  const toShow = isHomepage ? sorted.slice(0, 3) : sorted;

  grid.innerHTML = toShow.map(cardHTML).join('');
}

/**
 * Initialises the contributions section.
 * Called from main.js after DOMContentLoaded.
 */
export async function initContributions() {
  grid           = document.getElementById('contributionsGrid');
  statsContainer = document.getElementById('contributionsStats');

  if (!grid) return;

  try {
    const res    = await fetch('data/contributions.json');
    contributions = await res.json();
  } catch {
    console.warn('[contributions] Failed to load contributions.json');
    return;
  }

  renderStats();
  renderContributions();

  // Tell the scroll-reveal observer about the newly injected cards
  if (window.__reObserveReveals) {
    window.__reObserveReveals();
  }
}
