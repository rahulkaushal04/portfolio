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
├── blog.html               # Blog listing page
├── projects.html           # Projects listing page
├── contributions.html      # Contributions page
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/                # Modular stylesheets (BEM naming)
│   ├── js/                 # ES Modules (section-specific + utilities)
│   ├── fonts/
│   └── images/             # blogs/, companies/, icons/, projects/, skills/
├── data/                   # JSON data files (decoupled content)
│   │                       # meta, skills, experience, projects, blogs, contributions
└── resume/
```

## Features

- **Dark theme** with CSS custom properties
- **Responsive design** - mobile-first layout
- **Multi-page** - dedicated pages for blog, projects, and contributions
- **Scroll-reveal animations** using Intersection Observer
- **Canvas particle system** on the hero section
- **Custom cursor** on desktop
- **Scroll progress bar**
- **Filterable grids** for skills and projects
- **JSON-driven content** - update data files without touching HTML
- **Easter eggs** hidden throughout the site
  - Konami code (↑↑↓↓←→←→BA) → confetti burst
  - Type "matrix" → Matrix rain effect
  - Click the logo 5× rapidly → secret message
  - Hold D + L → disco mode
- **SEO-ready** - Open Graph tags, JSON-LD structured data, sitemap
- **Accessible** - semantic HTML, ARIA attributes, keyboard-friendly
- **No dependencies** - zero `node_modules`, loads fast

## License

&copy; Rahul Kaushal. All rights reserved.