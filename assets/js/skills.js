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
