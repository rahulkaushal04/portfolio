// experience.js - Fetches experience.json and renders the timeline cards.

let timeline;
let entries = [];

/**
 * Builds the HTML string for a single timeline card.
 * @param {Object} entry
 * @returns {string}
 */
function itemHTML(entry) {
  const bullets = entry.description.map((d) => `<li>${d}</li>`).join('');
  const tags = entry.tags.map((t) => `<span class="tag-chip">${t}</span>`).join('');

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
        <ul class="experience__description">${bullets}</ul>
        <div class="experience__tags">${tags}</div>
      </div>
    </div>`;
}

function renderTimeline() {
  if (!timeline) return;
  timeline.innerHTML = entries.map(itemHTML).join('');
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
