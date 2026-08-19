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
│   ├── css/                # One partial per section, linked from each <head>
│   ├── js/                 # ES modules, one per section
│   └── images/             # companies/, projects/, skills/
├── data/                   # meta, skills, experience, projects, contributions
└── resume/
```

## Content lives in `data/`

Every section renders from JSON. To update the site, edit the data file, not the markup.

| File                 | Drives                                                     |
|----------------------|------------------------------------------------------------|
| `meta.json`          | Name, positioning line, email, socials                     |
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

## Conventions worth keeping

- **CSS partials are `<link>`ed, not `@import`ed.** `@import` serialises the
  downloads behind `main.css`. Order matters: `variables` and `reset` first,
  `main.css` last, since it holds base and utility rules that must win.
- **`--clr-accent` is for text and borders. `--clr-accent-solid` is for filled
  backgrounds.** White text on the lighter accent only reaches 3.2:1.
- **`--clr-border` is decorative. `--clr-border-strong` is for real controls**
  that need 3:1 under WCAG 1.4.11.
- **Interactive elements carry `min-height: 44px`.**
- **`will-change` is applied only while an element is animating**, then removed.
  Leaving it on idle elements held a compositor layer open for every card on the
  page and caused sections to lay out without ever painting.
- **No animation runs unconditionally.** The particle field pauses when the hero
  scrolls out of view and when the tab is hidden, and every animated component
  honours `prefers-reduced-motion`.

## Features

- Responsive, mobile first
- Scroll reveal via IntersectionObserver, with a fallback sweep for fast scrolls
- Canvas particle field in the hero, paused when off-screen
- Custom cursor on pointer devices, disabled under reduced motion
- Native cross-document view transitions
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
