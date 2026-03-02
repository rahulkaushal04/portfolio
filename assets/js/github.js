// github.js - Fetches the user's most recently pushed public repos and renders mini cards.
// GitHub's public API does not expose pinned repos, so we sort by pushed date as a close proxy.

const GITHUB_USER = 'rahulkaushal04';
const API_BASE = 'https://api.github.com';
const MAX_REPOS = 6;

let container;

// Language dot colors matching GitHub's own palette.
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  Java:       '#b07219',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Rust:       '#dea584',
  Go:         '#00ADD8',
  Shell:      '#89e051',
  Ruby:       '#701516',
  PHP:        '#4F5D95',
  C:          '#555555',
  'C++':      '#f34b7d',
  'C#':       '#178600',
  Kotlin:     '#A97BFF',
  Swift:      '#F05138',
  Dart:       '#00B4AB',
  Vue:        '#41b883',
  SCSS:       '#c6538c',
  Dockerfile: '#384d54',
};

/**
 * @param {Object} repo - GitHub API repo object
 * @returns {string}
 */
function repoCardHTML(repo) {
  const lang = repo.language || '';
  const dotColor = LANG_COLORS[lang] || 'var(--clr-text-muted)';
  const stars = repo.stargazers_count;
  const forks = repo.forks_count;

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

async function fetchRepos() {
  try {
    const res = await fetch(
      `${API_BASE}/users/${GITHUB_USER}/repos?sort=pushed&per_page=${MAX_REPOS}&type=owner`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const repos = await res.json();

    // Forks and the profile-readme repo are not worth showing
    return repos.filter((r) => !r.fork && r.name !== GITHUB_USER);
  } catch (err) {
    console.warn('[github] Failed to fetch repos:', err.message);
    return [];
  }
}

function renderRepos(repos) {
  if (!container || repos.length === 0) return;

  const heading = `
    <h3 class="section-subtitle" style="grid-column:1/-1;margin-bottom:var(--sp-2);">
      Open Source on GitHub
    </h3>`;

  container.innerHTML = heading + repos.map(repoCardHTML).join('');

  // Tell the scroll-reveal observer about the newly injected cards
  if (window.__reObserveReveals) {
    window.__reObserveReveals();
  }
}

export async function initGitHub() {
  container = document.getElementById('githubRepos');
  if (!container) return;

  const repos = await fetchRepos();
  renderRepos(repos);
}
