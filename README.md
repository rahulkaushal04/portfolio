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
│   ├── js/                 # ES modules; retro.js builds the desktop
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

## Retro desktop

The home page is a 90s desktop. Icons, the Start menu and the taskbar open each section in a draggable window with working minimize, maximize and close. The Welcome window opens first, and a link such as `#experience` opens that window instead.

- `assets/js/retro.js` builds the desktop. It moves each section's real content into a window, so the contact form and other behaviour keep working, and builds the explorer (Experience), installer wizard (Projects) and inbox (Open source) from `data/*.json`.
- `assets/js/theme.js` loads the desktop and plays the one-time BIOS intro (any key skips it). It is skipped under `prefers-reduced-motion`.
- `assets/css/tokens.css` holds the Retro colour, type and spacing tokens. `base.css` has the components and `themes.css` the desktop, windows and taskbar.
- `projects.html`, `contributions.html` and `404.html` use the same Retro styling without the desktop.
- `node scripts/contrast.mjs` checks the Retro token pairs against WCAG AA. Run it after editing `tokens.css`.

## Conventions worth keeping

- **Tokens, not colours.** If a colour is not in `tokens.css`, it does not belong in a component.
- **- **Interactive elements are at least 44px tall.**
- **The first screen enters by CSS animation only**, so LCP never waits for JavaScript.
- **No animation runs unconditionally.** Ambient loops pause when the tab is hidden, and
  everything honours `prefers-reduced-motion`.
- **Long unbroken strings wrap** (`overflow-wrap: anywhere`) and grid children set
  `min-width: 0`. Break-test new data with very long repo names and titles.

## Features

- Responsive, mobile first
- Scroll reveal via IntersectionObserver, with a fallback sweep for fast scrolls
- A working 90s desktop: windows, taskbar, Start menu and a BIOS intro
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
