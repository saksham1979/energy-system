# Energy System website

This is a React, TypeScript, Vite, and Tailwind CSS site. It uses the existing HTML pages as preserved content under `legacy-site/` and mounts the tilted-grid RO showcase on the home page.

## Run locally

Install Node.js, then run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Do not open `index.html` directly from File Explorer; Vite must serve the React and TypeScript modules.

## Add images to the home animation

- RO product/model photos: `assets/ro-models/`
- Completed installations/projects: `assets/projects/`

Use `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif` files and descriptive filenames. The app includes these images in the animation automatically. Until photos are added, it uses the existing homepage and Water ATM images.

## Build

Run `npm run build`; production files are written to `dist/`. The build also creates `dist/404.html` so the existing HTML-style page URLs continue working on GitHub Pages. The GitHub Pages base path is enabled automatically in GitHub Actions builds.
