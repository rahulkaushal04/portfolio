# Rahul Kaushal - Developer Portfolio

Personal portfolio website showcasing my work, skills, and blog. Built with vanilla HTML, CSS, and JavaScript - no frameworks, no build tools.

**Live:** [rahulkaushal04.github.io/portfolio](https://rahulkaushal04.github.io/portfolio)

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Markup      | HTML5, semantic elements            |
| Styling     | CSS3 (custom properties, grid, BEM) |
| Scripting   | Vanilla JavaScript (ES Modules)     |
| Hosting     | GitHub Pages                        |
| Forms       | Formspree                           |
| Icons       | Devicon CDN, inline SVGs            |

## Project Structure

```
├── index.html              # Main entry point
├── 404.html                # Custom 404 page
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/                # Modular stylesheets (BEM naming)
│   │   ├── main.css        # Import aggregator
│   │   ├── variables.css   # Design tokens
│   │   ├── reset.css       # CSS reset
│   │   └── ...             # Section-specific styles
│   ├── js/                 # ES Modules
│   │   ├── main.js         # Entry point, module orchestrator
│   │   ├── animations.js   # Scroll-reveal, intersection observers
│   │   ├── particles.js    # Canvas particle system
│   │   ├── typewriter.js   # Typing animation
│   │   └── ...             # Section-specific logic
│   ├── fonts/
│   └── images/
├── data/                   # JSON data files (decoupled content)
│   ├── meta.json           # Site metadata and socials
│   ├── skills.json         # Skills with categories and icons
│   ├── experience.json     # Work history
│   ├── projects.json       # Project entries
│   └── blogs.json          # Blog posts
└── resume/
```

## Features

- **Dark theme** with CSS custom properties
- **Responsive design** - mobile-first layout
- **Scroll-reveal animations** using Intersection Observer
- **Custom cursor** on desktop
- **Scroll progress bar**
- **Filterable grids** for skills and projects
- **JSON-driven content** - update data files without touching HTML
- **SEO-ready** - Open Graph tags, JSON-LD structured data, sitemap
- **Accessible** - semantic HTML, ARIA attributes, keyboard-friendly
- **No dependencies** - zero `node_modules`, loads fast

## License

&copy; Rahul Kaushal. All rights reserved.