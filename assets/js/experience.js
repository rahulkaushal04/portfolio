const PREVIEW_BULLETS = 3;

let timeline;
let entries = [];

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function itemHTML(entry, index) {
  const bullets   = entry.description;
  const preview   = bullets.slice(0, PREVIEW_BULLETS)
    .map((d) => `<li>${escapeHTML(d)}</li>`).join('');
  const extra     = bullets.slice(PREVIEW_BULLETS)
    .map((d) => `<li class="experience__bullet--extra" hidden>${escapeHTML(d)}</li>`).join('');
  const extraCount = bullets.length - PREVIEW_BULLETS;

  const listId = `experience-bullets-${index}`;

  const toggle = extraCount > 0
    ? `<button class="experience__toggle" type="button"
               aria-expanded="false" aria-controls="${listId}">
         <span class="experience__toggle-label">Show ${extraCount} more</span>
         <svg class="experience__toggle-icon" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
           <polyline points="6 9 12 15 18 9"></polyline>
         </svg>
       </button>`
   : '';

  const tags = entry.tags
    .map((t) => `<span class="tag-chip">${escapeHTML(t)}</span>`).join('');

  const isCurrent = entry.endDate.trim().toLowerCase() === 'present';
  const badge = isCurrent
    ? `<span class="experience__current-badge"><span class="experience__current-dot" aria-hidden="true"></span>Current</span>`
   : '';

  const summary = entry.summary
    ? `<p class="experience__summary">${escapeHTML(entry.summary)}</p>`
   : '';

  return `
    <div class="experience__item reveal${isCurrent ? ' experience__item--current': ''}">
      <div class="experience__card">
        <div class="experience__role-row">
          <h3 class="experience__role">${escapeHTML(entry.role)}</h3>
          ${badge}
        </div>
        <p class="experience__date">
          <time>${escapeHTML(entry.startDate)}</time> to <time>${escapeHTML(entry.endDate)}</time>
        </p>
        ${summary}
        <ul class="experience__description" id="${listId}">${preview}${extra}</ul>
        ${toggle}
        <div class="experience__tags">${tags}</div>
      </div>
    </div>`;
}

/* Consecutive entries at the same employer render under one company header
   with a single logo. Two separate cards each stamped "Honeywell" read as
   two unrelated jobs and hide the fact that it was a promotion. */
function groupByCompany(list) {
  const groups = [];

  list.forEach((entry, index) => {
    const last = groups[groups.length - 1];
    if (last && last.company === entry.company) {
      last.entries.push({ entry, index });
    } else {
      groups.push({ company: entry.company, logo: entry.logo, logoSize: entry.logoSize, entries: [{ entry, index }] });
    }
  });

  return groups;
}

function groupHTML(group) {
  const size = group.logoSize ?? 40;
  const roleCount = group.entries.length;

  const promotion = roleCount > 1
    ? `<span class="experience__promotion">${roleCount} roles</span>`
   : '';

  return `
    <section class="experience__company-group" aria-label="${escapeHTML(group.company)}">
      <div class="experience__company-head reveal">
        <img src="${group.logo}"
             alt="${escapeHTML(group.company)} logo"
             class="experience__logo"
             width="${size}" height="${size}"
             style="width:${size}px"
             loading="lazy"
             onerror="this.style.display='none'">
        ${promotion}
      </div>
      <div class="experience__roles">
        ${group.entries.map(({ entry, index }) => itemHTML(entry, index)).join('')}
      </div>
    </section>`;
}

function handleInteraction(e) {
  const btn = e.target.closest('.experience__toggle');
  if (!btn) return;

  const card   = btn.closest('.experience__card');
  const extras = card.querySelectorAll('.experience__bullet--extra');
  const label  = btn.querySelector('.experience__toggle-label');
  const isOpen = btn.getAttribute('aria-expanded') === 'true';

  extras.forEach((li) => { li.hidden = isOpen; });
  btn.setAttribute('aria-expanded', String(!isOpen));
  btn.classList.toggle('is-expanded', !isOpen);
  label.textContent = isOpen ? `Show ${extras.length} more`: 'Show less';
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

  timeline.innerHTML = groupByCompany(entries).map(groupHTML).join('');
  timeline.addEventListener('click', handleInteraction);

  if (window.__reObserveReveals) window.__reObserveReveals();
}
