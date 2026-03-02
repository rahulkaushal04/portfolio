/* ──────────────────────────────────────────────────────────
   blog.js — RSS Fetch → Render Blog Cards (with JSON fallback)
   ────────────────────────────────────────────────────────── */

/** @type {HTMLElement|null} */
let grid;



/* ── Card Markup ─────────────────────────────────────── */

/**
 * @param {Object} post — normalised post object
 * @param {number} index — 0-based position (first = latest)
 * @returns {string}
 */
function cardHTML(post, index) {
  const latestClass = index === 0 ? ' latest' : '';

  const tags = (post.tags || [])
    .map((t) => `<span class="tag-chip">${t}</span>`)
    .join('');

  // Format date
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

/* ── Data Normalisation ──────────────────────────────── */

/**
 * Normalise an rss2json item into our internal shape.
 * @param {Object} item — rss2json item
 * @returns {Object}
 */
function normaliseRSSItem(item) {
  // Extract categories from the RSS item (Dev.to puts them in "categories")
  const tags = Array.isArray(item.categories) ? item.categories.slice(0, 4) : [];

  // Estimate read time from word count (rough average 200 wpm)
  const wordCount = (item.description || item.content || '')
    .replace(/<[^>]*>/g, '')
    .split(/\s+/).length;
  const minutes   = Math.max(1, Math.round(wordCount / 200));

  return {
    title:       item.title,
    url:         item.link,
    thumbnail:   item.thumbnail || item.enclosure?.link || `https://picsum.photos/seed/${encodeURIComponent(item.title)}/600/340`,
    publishDate: item.pubDate || item.isoDate || new Date().toISOString(),
    readTime:    `${minutes} min read`,
    tags,
  };
}

/* ── Fetch & Render ──────────────────────────────────── */

/**
 * Try RSS first; on failure fall back to blogs.json.
 * @returns {Object[]}
 */
async function fetchPosts() {
  try {
    const res   = await fetch('data/blogs.json');
    const posts = await res.json();
    return posts;
  } catch {
    console.warn('[blog] Failed to load blog data from blogs.json');
    return [];
  }
}

function renderPosts(posts) {
  if (!grid || posts.length === 0) return;
  grid.innerHTML = posts.map(cardHTML).join('');
}

/* ── Init ────────────────────────────────────────────── */

export async function initBlog() {
  grid = document.getElementById('blogGrid');
  if (!grid) return;

  const posts = await fetchPosts();
  renderPosts(posts);

  // Re-observe newly rendered cards for scroll-reveal
  if (window.__reObserveReveals) {
    window.__reObserveReveals();
  }
}
