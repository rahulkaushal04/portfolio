# Portfolio redesign: direction contract, tech decisions, plan

Status: DRAFT v2 (themes changed), awaiting approval. No product code has been written.

## 0. What exists (facts that stay)

- Vanilla HTML/CSS/ES modules, no build step, deployed to GitHub Pages from repo root (`.github/workflows/deploy.yml` uploads `.`).
- Pages: `index.html`, `projects.html`, `contributions.html`, `404.html` (self-contained). All content renders from `data/*.json` via `assets/js/*.js`.
- Kept untouched: all copy and facts, JSON data, JSON-LD, meta/OG/canonical, sitemap, robots, resume PDF link, Formspree form and validation, easter eggs, availability banner, back-to-top.
- Replaced: every CSS file, section markup, and the visual role of `particles.js`, `cursor.js`, `animations.js`. The current look (dark navy, blue accent, Inter/Space Grotesk, card grids, particles) is the anti-reference.

## 1. Direction contract

**Thesis.** One engineer, five worlds. The site is one document whose world is swapped by a token set, and the swap is the signature: it changes type, ground, edges, motion, ornament and ambient behaviour, not just colour. It refuses the generic hero + three cards + glass layout.

**Subject idea.** Rahul ships deployment software that installs and updates edge appliances, so the page performs a *rollout*: on load the name "boots" in the idiom of the active world, and switching theme plays a short transition (View Transitions API where supported, instant swap otherwise). Experience reads as a rollout log, not a card timeline.

**Shared layout (all themes).**
- 12-column grid, one pair of equal outer margins (clamp 16 to 48px), left-aligned, asymmetry inside the grid.
- Hero: name set at 11 to 14vw across the full width, role/company line and one primary action under it, portrait as an offset secondary element.
- About: narrow sticky statement column plus wide body column.
- Skills: grouped inline lists with the existing icons as marks. No icon cards.
- Experience: vertical rollout log, newest first. The 32.5% install-time result (real, from `experience.json`) is the one large number.
- Patent: one wide document-style entry.
- Projects: two large alternating entries with big thumbnails. No card grid.
- Contributions: dense list of repo, PR title, status.
- Contact: big email link plus the existing form. Footer: name returns at full width.
- Spacing: 4px base, steps 4/8/12/16/24/32/48/72/112/168; section gap `clamp(96px, 14vw, 200px)` times a per-theme `--density` (0.85 to 1.15).
- Type: fluid scale, at most 5 visible sizes; body 17 to 18px / 1.55; line length under 70ch.

**Rejected defaults:** purple/indigo gradients, glass cards, hero + three feature cards, Inter on white, eyebrow labels over every heading, 01/02/03 markers on non-sequences, one radius and one soft shadow everywhere, particles as wallpaper.

**IP rule for the three franchise-inspired worlds.** Inspired by mood, palette, typography class and ornament language only. All art is original CSS/SVG/canvas drawn for this site. No logos, characters, screenshots, ripped sprites, game fonts or quotations; no Straw Hat Jolly Roger, no Hollow Knight mask. Section names and every fact stay unchanged; theme flavour lives only in decoration, the theme names, and small microcopy such as the theme-switch toast.

## 2. The five worlds

All are CSS custom properties on `html[data-theme]`; components reference tokens only. Token groups: `--c-*` colour roles, `--ff-display/--ff-body`, `--radius-*`, `--edge`, `--shadow-*`, `--dur-*`, `--ease`, `--density`, `--ornament` (divider/corner SVG set), plus `--ambient` and `--cursor-style` read by JS.

| | 1 Retro | 2 Professional (default) | 3 Hallownest (Hollow Knight + Silksong) | 4 Lands Between (Dark Souls + Elden Ring) | 5 Grand Line (One Piece) |
|---|---|---|---|---|---|
| Idea | 90s desktop OS | Runbook: calm, text-first | Cold cavern, one lantern, a red silk thread | Ash, ember and a distant golden tree | Treasure map and comic panels |
| Tone | light | light and dark, follows OS | dark | dark | light |
| Ground / ink | desktop teal `#0E7C86`, window grey `#C9C9C9`, ink `#000` | light `#F3F5F4` / `#121614`; dark `#0F1311` / `#E6EBE7` | `#070A12` / `#E9EEF2` bone | `#0C0A08` / `#D8CDB4` ash | map parchment `#F2E3BF`, sea `#0B3C6B`, ink `#14110F` |
| Accent | navy title bars `#000080`, red `#C00000` | deep teal-green `#0B6B5B` (dark `#5FD3B0`) | soul blue `#8FD3FF`, Silksong silk red `#D1304A` | grace gold `#C9A24B`, bonfire ember `#D9622B` | straw yellow `#F2B632`, sail red `#D7263D` |
| Display / body | Pixelify Sans / system Verdana stack | Young Serif / Hanken Grotesk | Cinzel / Spectral | IM Fell English SC / EB Garamond | Bangers / Nunito |
| Edge / radius | 0, 2px outset/inset bevel, title-bar windows | 6px, hairlines only where they encode structure | thin pale line, soft corners, drawn SVG filigree dividers | double gold frame, corner brackets, 0 radius | thick black outline, comic panels, speech-bubble callouts |
| Shadow | hard 2px offset | none at rest | soft soul glow on focus/hover | warm ember glow on hover | hard offset ink shadow |
| Motion | `steps(4)`, blink, instant states | 180ms ease-out, 8px rise once | slow 700ms fades, floating motes | slow 900ms bloom, heavy easing | 220ms springy bounce, wave wipe |
| Boot moment | BIOS POST lines, then the window opens | name fades in, nothing else | dark screen, lantern light reveals the name | black, a bonfire lights, name blooms gold | sail-in wave wipe, name pops in a panel |
| Ambient | flat dotted desktop | isometric rack figure answers the pointer | drifting soul motes; silk-red thread draws down the page as scroll progress | rising embers on canvas | slow SVG waves and clouds |
| Cursor | native, pixel hover states | native | lantern halo that follows the pointer | ember trail | small compass pointer |
| Flavour touch | window titles use real section names | none | scroll thread, filigree | Contributions styled as a lit-bonfire list | Contributions as a "Wanted" poster, Contact as "Join the crew" |

Notes:
- Professional has light and dark modes. First visit follows `prefers-color-scheme`; the theme menu shows five worlds and Professional offers a light/dark flip. The other four are fixed-tone.
- Contrast: every text/UI pair in every world must be AA (4.5:1 text, 3:1 large text and UI). Enforced by a script that reads the token files.
- Reduced motion: no boot sequence, no ambient animation, no transitions beyond colour. Content is fully visible without JS.
- Font weight caution: Bangers and Pixelify are display-only (headings, buttons); body text always uses the readable face.

## 3. Theme system mechanics

- Inline pre-paint script in every `<head>` (about 500 bytes): read `localStorage` (try/catch), else `prefers-color-scheme`; set `data-theme`/`data-mode`, update `<meta name="theme-color">`, and inject only that theme's font `<link>`. No flash.
- Navbar toggle: a real button opening a menu of five options (`aria-checked`, arrow keys, Esc), persisted in `localStorage` in try/catch.
- Switch: preload the target theme's fonts, then apply inside `document.startViewTransition` if present. Fallback fonts use `size-adjust`/`ascent-override` to keep layout shift near zero.
- All theme CSS ships together in `themes.css` plus `themes/<name>.css` for structural extras (bevels, frames, panels), so switching never fetches CSS.
- JS reads tokens to pick ambient and cursor behaviour and attaches/detaches on theme change. Only one ambient loop runs at a time.

## 4. Tech decisions on the four projects (revised for the new themes)

| Project | Decision | Reason |
|---|---|---|
| react-three-fiber | **Skip** | React renderer; the site is vanilla with no build. React + three.js (about 150 KB+ gz) fails the budget. None of the five worlds needs 3D. |
| shadergradient | **Skip** | Built on R3F/three/React. Backgrounds here are CSS, SVG or a small 2D canvas. |
| liquid-glass-js | **Skip** | It needs html2canvas (about 45 KB gz), has been idle since June 2025, and no remaining theme is glass-based. |
| liquid-logo | **Skip** | It is a tool, not a package, and a liquid-metal monogram fits none of the new worlds. |
| hairline-create | **Use selectively (to be verified)** | One cursor-reactive isometric line figure of a stacked appliance/rack in the Professional hero, matching his edge-appliance work. Package size and license get checked first in its task; fallback is a static SVG. |

Net new dependencies: **none**. Fonts stay on Google Fonts as today, loaded per theme. Particles/embers/motes use one small shared 2D canvas, capped on mobile, paused off screen and when the tab is hidden, and replaced by a static treatment on weak devices (`hardwareConcurrency <= 4`, `deviceMemory <= 4`, `saveData`) or reduced motion.

## 5. Plan

"5T" means verified in all five worlds at 375, 768 and 1440.

**T1. Foundations.** `tokens.css`, `themes.css`, base/reset, grid, type scale, pre-paint script, font loader, contrast script.
Accept: no flash on reload in 5T under CPU throttle; `node scripts/contrast.mjs` passes every token pair; grep finds no hardcoded colour outside token files.

**T2. Theme switcher and navbar.** Menu, persistence, view-transition swap, mobile menu, resume button, skip link.
Accept: keyboard operable, visible focus in 5T, saved theme restored, disabled localStorage does not break, theme switch causes CLS under 0.02.

**T3. Hero + boot moments.** Name, role line, portrait, CTA, socials, five boot sequences, Professional hairline figure.
Accept: 5T; reduced motion shows the final state instantly; ambient pieces lazy-load and pause off screen; static fallback verified by forcing `saveData`.

**T4. About + Skills.** Accept: 5T; data from `skills.json`; no card grids.

**T5. Experience + Patent.** Rollout log, the 32.5% figure, patent entry. Accept: 5T; every line of `experience.json` rendered; long text wraps without overflow.

**T6. Projects + Contributions** (home sections and standalone pages). Accept: 5T; listing filters still work; thumbnails have width/height; Wanted-poster and bonfire-list treatments are decorative only and keep the same data.

**T7. Contact + footer + 404.** Accept: errors announced via `aria-live`; success and error states in every world; 404 stays self-contained.

**T8. Ambient and cursor layer.** Rewrite `particles.js`, `cursor.js`, `animations.js` around tokens (motes, embers, waves, halo, trail, compass, silk-thread progress). Accept: zero cost when off; capped on mobile; paused when hidden.

**T9. Pages and SEO parity.** Apply to `projects.html`, `contributions.html`; keep meta, JSON-LD, canonical; update sitemap `lastmod` only. Accept: `<head>` diff shows only the theme script and font changes.

**T10. Verify and fix.** Screenshots of 5 themes x 375/768/1440; `design:design-critique` per theme; `design:accessibility-review`; `break-ui`; `agent-skills:webperf`; Lighthouse (target 90+ performance, 100 accessibility); `impeccable-finish-reviewer` against section 1. Fix, re-check.

**T11. Docs.** README theme section; `PRODUCT.md`/`DESIGN.md` via impeccable's documenter. No commit.

## 6. Decisions I made for you (change any)

1. Professional is the default, with light/dark following the OS on first visit; the other four are single-tone.
2. Hollow Knight and Silksong are merged into one world, as are Dark Souls and Elden Ring (two worlds from four sources). If you want four separate worlds, say so.
3. All four pages get the redesign.
4. Easter eggs, availability banner, back-to-top and scroll progress stay (restyled per world).
5. Franchise worlds use original art only (see IP rule); section names and facts never change.
6. Fonts stay on Google Fonts, active theme only.
7. `docs/redesign/` sits in the Pages deploy root, so it would be published if committed.

## 7. Known risks

- Five worlds is five times the visual QA surface; contrast and break-ui run per theme.
- Franchise-inspired styling carries mild IP-adjacent risk; mitigated by original art only and no marks. It is a personal, non-commercial site.
- Font swaps on theme change can shift layout; measured in T2.
- Dark Souls/Elden Ring and Hallownest are both dark and serif-led; they must differ by ornament, ambient and motion, not just palette. The finish review checks this explicitly.

## 8. Build outcome (deviations from this plan)

- hairline-create: the npm package is 844 KB unpacked, so it was **not** used. The Professional hero figure is a hand-drawn isometric SVG in the same style (about 2 KB) with a small pointer-lean script.
- The 32.5% install-time number is not pulled out as a large numeral. It stays in the role text; extracting it would mean parsing prose.
- The boot overlay plays once per session on the first load only (not on every theme switch), per the accessibility review.
- Added a "Reduce motion" switch in the theme panel (persisted) beside the Professional dark-mode switch.
- Fonts are still Google Fonts per theme; self-hosting plus metric-matched fallbacks (the performance audit's top item) is not done.
