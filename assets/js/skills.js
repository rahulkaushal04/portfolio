// Skills render as labelled groups rather than one flat grid behind filter
// tabs. The old version declared role="tab"/role="tabpanel" without
// aria-controls, roving tabindex or arrow-key handling, so screen readers
// announced a tab interface that did not behave like one. Grouping also
// lets each cluster carry a line of context, which a logo cannot.

let container;
let groups = [];

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function iconHTML(item) {
  const src  = `assets/images/skills/${item.icon}`;
  const size = item.iconSize
    ? ` style="width:${item.iconSize}px;height:${item.iconSize}px"`
   : '';

  // Icons are self-hosted now. The previous build probed for a local .svg,
  // then a .png, then fell back to a devicon webfont class, which cost two
  // 404s per skill and pulled a 127KB stylesheet off a CDN pinned to @latest.
  return `<img src="${src}" class="skills__icon" alt=""${size}
               width="40" height="40" loading="lazy" decoding="async">`;
}

function itemHTML(item) {
  return `
    <li class="skills__item">
      <span class="skills__item-icon">${iconHTML(item)}</span>
      <span class="skills__item-name">${escapeHTML(item.name)}</span>
    </li>`;
}

function groupHTML(group) {
  return `
    <section class="skills__group reveal" aria-labelledby="skillgroup-${group.id}">
      <div class="skills__group-head">
        <h3 class="skills__group-title" id="skillgroup-${group.id}">${escapeHTML(group.label)}</h3>
        <p class="skills__group-note">${escapeHTML(group.note)}</p>
      </div>
      <ul class="skills__list">${group.items.map(itemHTML).join('')}</ul>
    </section>`;
}

export async function initSkills() {
  container = document.getElementById('skillsGroups');
  if (!container) return;

  try {
    const res = await fetch('data/skills.json');
    groups    = await res.json();
  } catch {
    console.warn('[skills] Failed to load skills.json');
    return;
  }

  container.innerHTML = groups.map(groupHTML).join('');

  if (window.__reObserveReveals) window.__reObserveReveals();
}
