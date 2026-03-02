/* ──────────────────────────────────────────────────────────
   github.js — Fetch Pinned / Starred Repos & Render Mini Cards
   ────────────────────────────────────────────────────────── */

const GITHUB_USER = 'rahulkaushal04';
const API_BASE    = 'https://api.github.com';
const MAX_REPOS   = 6;

/** @type {HTMLElement|null} */
let container;

/* ── Language Colours (top 20) ───────────────────────── */

const LANG_COLORS = {
  JavaScript:  '#f1e05a',
  TypeScript:  '#3178c6',
  Python:      '#3572A5',
  Java:        '#b07219',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  Rust:        '#dea584',
  Go:          '#00ADD8',
  Shell:       '#89e051',
  Ruby:        '#701516',
  PHP:         '#4F5D95',
  C:           '#555555',
  'C++':       '#f34b7d',
  'C#':        '#178600',
  Kotlin:      '#A97BFF',
  Swift:       '#F05138',
  Dart:        '#00B4AB',
  Vue:         '#41b883',
  SCSS:        '#c6538c',
  Dockerfile:  '#384d54',
};

/* ── Repo Card Markup ────────────────────────────────── */

/**
 * @param {Object} repo — GitHub API repo object
 * @returns {string}
 */
function repoCardHTML(repo) {
  const lang     = repo.language || '';
  const dotColor = LANG_COLORS[lang] || 'var(--clr-text-muted)';
  const stars    = repo.stargazers_count;
  const forks    = repo.forks_count;

  const langBadge = lang
    ? `<span class="projects__repo-lang">
         <span class="projects__repo-lang-dot" style="background:${dotColor}"></span>
         ${lang}
       </span>`
    : '';

  return `
    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
       class="projects__repo-card reveal" aria-label="${repo.name} on GitHub">
      <h4 class="projects__repo-name">${repo.name}</h4>
      <p class="projects__repo-desc">${repo.description || 'No description provided.'}</p>
      <div class="projects__repo-meta">
        ${langBadge}
        <span title="Stars">⭐ ${stars}</span>
        <span title="Forks">🍴 ${forks}</span>
      </div>
    </a>`;
}

/* ── Fetch Repos ─────────────────────────────────────── */

/**
 * GitHub REST API doesn't expose "pinned" repos directly on the
 * public endpoint, so we fetch the user's repos sorted by most
 * recently pushed and pick the top N.  If the user pins repos,
 * they tend to be their most active — this is a good proxy.
 */
async function fetchRepos() {
  try {
    const res = await fetch(
      `${API_BASE}/users/${GITHUB_USER}/repos?sort=pushed&per_page=${MAX_REPOS}&type=owner`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    );

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const repos = await res.json();

    // Filter out forks and profile-readme repos
    return repos.filter(
      (r) => !r.fork && r.name !== GITHUB_USER
    );
  } catch (err) {
    console.warn('[github] Failed to fetch repos:', err.message);
    return [];
  }
}

/* ── Render ──────────────────────────────────────────── */

function renderRepos(repos) {
  if (!container || repos.length === 0) return;

  const heading = `
    <h3 class="section-subtitle" style="grid-column:1/-1;margin-bottom:var(--sp-2);">
      Open Source on GitHub
    </h3>`;

  container.innerHTML = heading + repos.map(repoCardHTML).join('');

  // Re-observe newly rendered cards for scroll-reveal
  if (window.__reObserveReveals) {
    window.__reObserveReveals();
  }
}

/* ── Init ────────────────────────────────────────────── */

export async function initGitHub() {
  container = document.getElementById('githubRepos');
  if (!container) return;

  const repos = await fetchRepos();
  renderRepos(repos);
}
