let grid;
let statsContainer;
let contributions = [];

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function uniqueRepos(contribs) {
  return new Set(contribs.map((c) => c.repo));
}

const STATS_MIN_PRS = 6;

function renderStats() {
  if (!statsContainer) return;

  const totalPRs   = contributions.length;
  const totalRepos = uniqueRepos(contributions).size;

  if (totalPRs < STATS_MIN_PRS) {
    statsContainer.innerHTML = '';
    statsContainer.hidden = true;
    return;
  }

  statsContainer.hidden = false;
  statsContainer.innerHTML = `
    <div class="contributions__stat reveal">
      <span class="contributions__stat-number">${totalPRs}</span>
      <span class="contributions__stat-label">Pull requests merged</span>
    </div>
    <div class="contributions__stat reveal">
      <span class="contributions__stat-number">${totalRepos}</span>
      <span class="contributions__stat-label">Repositories</span>
    </div>
  `;
}

function cardHTML(contribution) {
  const tags = contribution.tags
    .map((t) => `<span class="tag-chip">${escapeHTML(t)}</span>`)
    .join('');

  const dateLabel = contribution.mergedDate
    ? formatDate(contribution.mergedDate)
    : '';

  return `
    <article class="contributions__card reveal">
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
          ${escapeHTML(contribution.repo)}
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
        </span>`: `
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
          ${escapeHTML(contribution.prTitle)}
          <svg class="contributions__external-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </h3>

      <p class="contributions__description">${escapeHTML(contribution.description)}</p>

      <div class="contributions__card-footer">
        <div class="contributions__tags">${tags}</div>
        ${dateLabel ? `<span class="contributions__date">${dateLabel}</span>`: ''}
      </div>
    </article>`;
}

function renderContributions() {
  if (!grid) return;

  const sorted = [...contributions].sort(
    (a, b) => new Date(b.mergedDate) - new Date(a.mergedDate)
  );

  const isHomepage = !document.querySelector('.contributions-page__hero');
  const toShow = isHomepage ? sorted.slice(0, 3): sorted;

  grid.innerHTML = toShow.map(cardHTML).join('');
}

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

  if (window.__reObserveReveals) {
    window.__reObserveReveals();
  }
}
