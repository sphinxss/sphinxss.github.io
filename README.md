# Joshua Barrera — Portfolio

A fast, dependency-free personal portfolio built with plain HTML, CSS, and JavaScript.
Live at **https://sphinxss.github.io/**

## Features

- Dark/cyan design with a real light mode (saved to `localStorage`)
- Responsive layout from 320px up
- Accessible project carousel: arrow keys, swipe, dots, autoplay with a pause control, and `inert` off-screen slides
- Scroll-reveal animations that respect `prefers-reduced-motion`
- Copy-to-clipboard email button with a fallback
- SEO metadata, Open Graph image, JSON-LD person data, and an SVG favicon
- No build step, no frameworks, no trackers

## Structure

```
index.html        Markup and content
styles.css        All styling and responsive rules
script.js         Theme, navigation, carousel, small interactions
assets/           Headshot, favicon, social preview image
404.html          Custom not-found page
.nojekyll         Tells GitHub Pages to serve files as-is
```

## Local preview

```powershell
cd C:\Users\admin\portfolio
python -m http.server 8080
```

Then open http://localhost:8080.

## Editing content

- **Projects** live in `index.html` inside `#carouselTrack`. Each `.project-slide` is one slide; the carousel auto-detects the count.
- **Skills** are the three `.skill-card` blocks in `#skills`.
- **Links** (GitHub, LinkedIn, X, email) appear in the hero, contact section, and footer.
- To add a project screenshot, replace the CSS mockup inside `.project-visual` with an `<img>`.
- If you add or remove slides, update the `04` in `#slideTotal` — or leave it, since JavaScript recalculates it.

## Publishing to GitHub Pages

This repo is named `sphinxss.github.io`, so GitHub Pages serves it at the domain root.

```powershell
git add .
git commit -m "Update portfolio"
git push
```

Changes usually go live within a minute.

## License

Personal project — content and likeness © Joshua Barrera. Code is free to learn from.
