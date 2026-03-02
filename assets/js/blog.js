// blog.js - Fetches post data from blogs.json and renders blog cards into the grid.

let grid;

/**
 * Builds the HTML string for a single blog card.
 * @param {Object} post - Normalised post object from blogs.json
 * @param {number} index - 0-based position; index 0 gets the "latest" class
 * @returns {string}
 */
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

/**
 * Loads posts from blogs.json. Returns an empty array on failure.
 * @returns {Promise<Object[]>}
 */
async function fetchPosts() {
  try {
    const res = await fetch('data/blogs.json');
    return await res.json();
  } catch {
    console.warn('[blog] Failed to load blogs.json');
    return [];
  }
}

function renderPosts(posts) {
  if (!grid || posts.length === 0) return;
  grid.innerHTML = posts.map(cardHTML).join('');
}

export async function initBlog() {
  grid = document.getElementById('blogGrid');
  if (!grid) return;

  const posts = await fetchPosts();
  renderPosts(posts);

  // Tell the scroll-reveal observer about the newly injected cards
  if (window.__reObserveReveals) {
    window.__reObserveReveals();
  }
}
