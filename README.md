# Rahul Kaushal - Portfolio

Personal portfolio site. Vanilla HTML, CSS and JavaScript. No framework, no build step,
no `node_modules`.

**Live:** [rahulkaushal04.github.io/portfolio](https://rahulkaushal04.github.io/portfolio)

---

## Tech stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Markup    | HTML5, semantic elements                      |
| Styling   | CSS3 (custom properties, grid, BEM)           |
| Scripting | Vanilla JavaScript (ES modules)               |
| Hosting   | GitHub Pages                                  |
| Forms     | Formspree                                     |
| Icons     | Self-hosted SVG and WebP, inline SVG          |

## Structure

```
├── index.html              # Homepage
├── 404.html                # Fully self-contained, no external assets
├── projects.html           # Project listing
├── contributions.html      # Open source listing
├── robots.txt / sitemap.xml
├── assets/
│   ├── css/                # tokens.css (themes), base.css (components), themes.css (per-world extras)
│   ├── js/                 # ES modules; theme.js owns the switcher, ambient layer and cursor
│   └── images/             # companies/, projects/, skills/
├── data/                   # meta, skills, experience, projects, contributions
└── resume/
```

## Content lives in `data/`

Every section renders from JSON. To update the site, edit the data file, not the markup.

| File                 | Drives                                                     |
|----------------------|------------------------------------------------------------|
| `meta.json`          | Reference only. Nothing reads it yet; the head and hero are in the markup |
| `skills.json`        | Skill groups. Each group has a `label`, a `note`, `items`  |
| `experience.json`    | Roles. Consecutive entries at one company are auto-grouped |
| `projects.json`      | Project cards                                              |
| `contributions.json` | Merged pull requests                                       |

The `<noscript>` fallbacks in `index.html` are generated from these same files, so
they need regenerating whenever the data changes substantially.

### Adding a skill

Drop the icon in `assets/images/skills/` and add an entry to the relevant group:

```json
{ "name": "Polars", "icon": "polars.svg" }
```

Add `"iconSize": 60` when an icon is drawn small inside its own viewBox.

### Adding a project

Append to `projects.json`. Set `"featured": true` to surface it on the homepage,
which shows the first two featured entries. The search and filter toolbar on
`projects.html` stays hidden until there are at least six projects, since filtering
two items is noise.

## Themes

Five worlds share one document: **Professional** (default, light and dark), **Retro**,
**Hallownest**, **Lands Between** and **Grand Line**. The three game and anime worlds take
mood, palette and ornament only; all art is original CSS and SVG.

- Every world is a block of CSS custom properties in `assets/css/tokens.css`, selected by
  `html[data-theme]` (Professional also uses `data-mode`). Components in `base.css` read
  tokens and never hardcode colour. `themes.css` holds what tokens cannot express
  (window chrome, frames, bands, boot overlays).
- An inline script in each `<head>` applies the saved theme (`localStorage`, in try/catch)
  or the system light/dark preference on the first visit, before first paint, and loads
  only that theme's fonts.
- `assets/js/theme.js` runs the navbar switcher, the View Transitions swap, the canvas
  ambient layer (motes in Hallownest, embers in Lands Between), the cursor effects and the
  one-time boot overlay. All of it is skipped under `prefers-reduced-motion`, `saveData`,
  or very low CPU or memory.
- `node scripts/contrast.mjs` checks every text/UI token pair against WCAG AA in every
  world. Run it after touching `tokens.css`.
- To add a world: add a token block, an option in the switcher markup (three pages), its
  font URL and theme-color in the inline script, and any structure in `themes.css`.

## Conventions worth keeping

- **Tokens, not colours.** If a colour is not in `tokens.css`, it does not belong in a component.
- **`--accent` is text-safe on `--bg` and `--surface`; `--accent-ink` is the text colour on a
  filled accent. `--line` is decorative; `--line-strong` is for controls (3:1).**
- **Interactive elements are at least 44px tall.**
- **The first screen enters by CSS animation only**, so LCP never waits for JavaScript.
- **No animation runs unconditionally.** Ambient loops pause when the tab is hidden, and
  everything honours `prefers-reduced-motion`.
- **Long unbroken strings wrap** (`overflow-wrap: anywhere`) and grid children set
  `min-width: 0`. Break-test new data with very long repo names and titles.

## Features

- Responsive, mobile first
- Scroll reveal via IntersectionObserver, with a fallback sweep for fast scrolls
- Five switchable design worlds with a saved choice and no flash on load
- Per-world ambient layer and cursor, disabled under reduced motion
- Full keyboard support: skip link, focus trap in the mobile menu, visible focus rings
- Open Graph and Twitter cards, JSON-LD `Person` schema, sitemap
- Easter eggs, code-split and loaded only on the first plausible keystroke
  - Konami code, type "matrix", hold D + L, click the logo five times

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## License

&copy; Rahul Kaushal. All rights reserved.
