# Joshua Barrera — Portfolio

A fast, dependency-free personal portfolio built with plain HTML, CSS, and JavaScript.
Live at **https://sphinxss.github.io/**

## Features

- Dark/cyan design with a real light mode (saved to `localStorage`)
- Responsive layout from 320px up
- Six-project carousel with live demos and source links: arrow keys, swipe, dots, autoplay with a pause control, and `inert` off-screen slides
- Contact form powered by FormSubmit, with native validation, loading/success/error states, a spam honeypot, and a direct-email fallback
- Copy-to-clipboard email button with a fallback
- Scroll-reveal animations that respect `prefers-reduced-motion`
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
- **Links** (GitHub, LinkedIn, X, email) appear in the hero and footer.
- **Contact form** posts to `https://formsubmit.co/ajax/joshuabarrera659@gmail.com`; the endpoint lives in `data-endpoint` on `#contactForm` (and the non-JS `action` fallback).
- To add a project screenshot, replace the CSS mockup inside `.project-visual` with an `<img>`.
- If you add or remove slides, update the `06` in `#slideTotal` — or leave it, since JavaScript recalculates it.

### Contact form activation

FormSubmit requires a one-time activation click for a new recipient. The activation email is sent to `joshuabarrera659@gmail.com` the first time the form is submitted. Until that link is clicked, the form shows a direct-email fallback; after activation, messages are delivered normally.

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
