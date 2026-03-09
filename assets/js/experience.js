// experience.js - Fetches experience.json and renders the timeline cards.

const PREVIEW_BULLETS = 4;
const PREVIEW_TAGS    = 6;

let timeline;
let entries = [];

/**
 * Builds the HTML string for a single timeline card.
 * @param {Object} entry
 * @returns {string}
 */
function itemHTML(entry) {
  // — Description bullets (preview + collapsible extras) ——————————
  const allBullets    = entry.description;
  const previewHTML   = allBullets.slice(0, PREVIEW_BULLETS).map((d) => `<li>${d}</li>`).join('');
  const extraHTML     = allBullets.slice(PREVIEW_BULLETS)
    .map((d) => `<li class="experience__bullet--extra" hidden>${d}</li>`).join('');
  const extraCount    = allBullets.length - PREVIEW_BULLETS;

  const bulletToggle  = extraCount > 0
    ? `<button class="experience__toggle" aria-expanded="false" type="button">
         <span class="experience__toggle-label">Show ${extraCount} more</span>
         <svg class="experience__toggle-icon" width="11" height="11" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
           <polyline points="6 9 12 15 18 9"></polyline>
         </svg>
       </button>`
    : '';

  // — Tags (preview + "+N more" overflow) ————————————————————————
  const allTags       = entry.tags;
  const previewTags   = allTags.slice(0, PREVIEW_TAGS).map((t) => `<span class="tag-chip">${t}</span>`).join('');
  const extraTags     = allTags.slice(PREVIEW_TAGS)
    .map((t) => `<span class="tag-chip experience__tag--extra" hidden>${t}</span>`).join('');
  const tagMore       = allTags.length > PREVIEW_TAGS
    ? `<button class="tag-chip experience__tags-more" type="button" aria-expanded="false">+${allTags.length - PREVIEW_TAGS} more</button>`
    : '';

  const dateRange = `${entry.startDate} - ${entry.endDate}`;

  // logoSize and showCompanyName are optional fields in the JSON with these defaults
  const logoSize = entry.logoSize ?? 40;
  const companyNameHTML = (entry.showCompanyName ?? true)
    ? `<span class="experience__company">${entry.company}</span>`
    : '';

  return `
    <div class="experience__item reveal">
      <div class="experience__card">
        <div class="experience__header">
          <img src="${entry.logo}"
               alt="${entry.company} logo"
               class="experience__logo"
               width="${logoSize}" height="${logoSize}"
               style="width:${logoSize}px;height:${logoSize}px"
               loading="lazy"
               onerror="this.style.display='none'">
          ${companyNameHTML}
        </div>
        <h3 class="experience__role">${entry.role}</h3>
        <p class="experience__date">${dateRange}</p>
        <ul class="experience__description">${previewHTML}${extraHTML}</ul>
        ${bulletToggle}
        <div class="experience__tags">${previewTags}${extraTags}${tagMore}</div>
      </div>
    </div>`;
}

function handleInteraction(e) {
  // — Bullet toggle ——————————————————————————————————————————————
  const bulletBtn = e.target.closest('.experience__toggle');
  if (bulletBtn) {
    const card      = bulletBtn.closest('.experience__card');
    const extras    = card.querySelectorAll('.experience__bullet--extra');
    const label     = bulletBtn.querySelector('.experience__toggle-label');
    const isOpen    = bulletBtn.getAttribute('aria-expanded') === 'true';

    extras.forEach((li) => { li.hidden = isOpen; });
    bulletBtn.setAttribute('aria-expanded', String(!isOpen));
    bulletBtn.classList.toggle('is-expanded', !isOpen);
    label.textContent = isOpen ? `Show ${extras.length} more` : 'Show less';
    return;
  }

  // — Tag overflow toggle ————————————————————————————————————————
  const tagBtn = e.target.closest('.experience__tags-more');
  if (tagBtn) {
    const card   = tagBtn.closest('.experience__card');
    const extras = card.querySelectorAll('.experience__tag--extra');
    const isOpen = tagBtn.getAttribute('aria-expanded') === 'true';

    extras.forEach((tag) => { tag.hidden = isOpen; });
    tagBtn.setAttribute('aria-expanded', String(!isOpen));
    tagBtn.textContent = isOpen ? `+${extras.length} more` : 'less';
    tagBtn.classList.toggle('is-expanded', !isOpen);
  }
}

function renderTimeline() {
  if (!timeline) return;
  timeline.innerHTML = entries.map(itemHTML).join('');
  timeline.addEventListener('click', handleInteraction);
}

export async function initExperience() {
  timeline = document.getElementById('experienceTimeline');
  if (!timeline) return;

  try {
    const res = await fetch('data/experience.json');
    entries = await res.json();
  } catch {
    console.warn('[experience] Failed to load experience.json');
    return;
  }

  renderTimeline();

  // Tell the scroll-reveal observer about the newly injected cards
  if (window.__reObserveReveals) {
    window.__reObserveReveals();
  }
}
