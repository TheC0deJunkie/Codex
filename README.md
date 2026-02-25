# Logo Vectorizer Pro (Next.js)

A modern React + Next.js web app that converts uploaded logo images into scalable SVG output directly in the browser.

## Features

- Upload PNG, JPEG, WEBP, or SVG logo files.
- Uses `imagetracerjs` to generate vector output.
- Tuning controls for:
  - Preset strategy (Logo, Posterized, Curvy)
  - Number of colors
  - Path detail
  - Line threshold
  - Corner threshold
- Side-by-side preview for original and vector output.
- SVG file download.
- Basic output metrics (path count + file size).

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
