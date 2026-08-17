import { initAnimations } from './animations.js';
import { initCursor }     from './cursor.js';

let allPosts   = [];
let activeTag  = 'all';
let searchTerm = '';

let grid, emptyState, countEl, searchInput, tagContainer, clearBtn;

function cardHTML(post, index) {
  const latestClass = index === 0 ? ' latest' : '';

  const tags = (post.tags || [])
    .map((t) => `<span class="tag-chip">${t}</span>`)
    .join('');

  const dateStr = new Date(post.publishDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `
    <a href="${post.url}" target="_blank" rel="noopener noreferrer"
       class="blog__card reveal${latestClass}"
       aria-label="Read: ${post.title}">
      <div class="blog__card-img-wrapper">
        <img src="${post.thumbnail}"
             alt="${post.title}"
             class="blog__card-img"
             loading="lazy" width="600" height="340">
      </div>
      <div class="blog__card-body">
        <h3 class="blog__card-title">${post.title}</h3>
        <div class="blog__card-meta">
          <time datetime="${post.publishDate}">${dateStr}</time>
          <span class="blog__card-read-time">${post.readTime}</span>
        </div>
        <div class="blog__card-tags">${tags}</div>
      </div>
    </a>`;
}

async function fetchPosts() {
  try {
    const res = await fetch('data/blogs.json');
    return await res.json();
  } catch {
    console.warn('[blog-page] Failed to load blogs.json');
    return [];
  }
}

function getFilteredPosts() {
  return allPosts.filter((post) => {
    const matchesTag =
      activeTag === 'all' ||
      (post.tags || []).some((t) => t.toLowerCase() === activeTag);

    const matchesSearch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm) ||
      (post.tags || []).some((t) => t.toLowerCase().includes(searchTerm));

    return matchesTag && matchesSearch;
  });
}

function render() {
  const filtered = getFilteredPosts();

  const total = allPosts.length;
  const shown = filtered.length;
  countEl.textContent =
    shown === total
      ? `${total} article${total !== 1 ? 's' : ''}`
      : `${shown} of ${total} article${total !== 1 ? 's' : ''}`;

  const isEmpty = filtered.length === 0;
  emptyState.hidden = !isEmpty;
  grid.hidden = isEmpty;

  if (!isEmpty) {
    grid.innerHTML = filtered.map(cardHTML).join('');
    if (window.__reObserveReveals) window.__reObserveReveals();
  }
}

function buildTagFilters() {
  const tagSet = new Set();
  allPosts.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));

  const sorted = [...tagSet].sort();

  const btns = sorted
    .map((t) => `<button class="blog-page__tag-btn" data-tag="${t}">${t}</button>`)
    .join('');

  tagContainer.innerHTML =
    `<button class="blog-page__tag-btn active" data-tag="all">All</button>` + btns;
}

function onTagClick(e) {
  const btn = e.target.closest('.blog-page__tag-btn');
  if (!btn) return;

  activeTag = btn.dataset.tag;

  tagContainer.querySelectorAll('.blog-page__tag-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.tag === activeTag);
  });

  render();
}

function onSearchInput(e) {
  searchTerm = e.target.value.trim().toLowerCase();
  render();
}

function onClearFilters() {
  activeTag = 'all';
  searchTerm = '';
  searchInput.value = '';

  tagContainer.querySelectorAll('.blog-page__tag-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.tag === 'all');
  });

  render();
}

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

function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded', async () => {
  grid         = document.getElementById('blogGrid');
  emptyState   = document.getElementById('blogEmpty');
  countEl      = document.getElementById('blogCount');
  searchInput  = document.getElementById('blogSearch');
  tagContainer = document.getElementById('blogTagFilters');
  clearBtn     = document.getElementById('blogClearFilters');

  initAnimations();
  initCursor();
  initScrollProgress();
  initBackToTop();
  setFooterYear();

  allPosts = await fetchPosts();

  allPosts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

  buildTagFilters();
  render();

  tagContainer.addEventListener('click', onTagClick);
  searchInput.addEventListener('input', onSearchInput);
  if (clearBtn) clearBtn.addEventListener('click', onClearFilters);
});
