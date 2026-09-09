# Portfolio website

The source is in `src/`. The build produces static files in `site/`, published by GitHub Actions to https://leonbede7.github.io/leonbede7/. The root README is also Leon's GitHub profile.

```sh
npm ci
npx playwright install chromium
npm run build
npm run preview
```

Open http://127.0.0.1:4318/leonbede7/. Run `npm test` to rebuild and run the browser checks. CI runs the same checks before publishing.

## How it was made

Leon supplied the project direction, personal history and product context. This redesign was developed with Codex, including art direction, copy editing, generated concept artwork, code and testing. It should be presented as AI-assisted work. [DESIGN.md](DESIGN.md) records the narrative and visual decisions. [ASSETS.md](ASSETS.md) distinguishes artwork from actual product screenshots.

The visual story follows a red road from Leon's family dealership into Galerija's shared vehicle record, then into Intake Eval's validation experiment. Galerija gets three full scenes and four product decisions. Pagewright is a smaller supporting project.

## Implementation

- Semantic HTML and responsive CSS, with a self-hosted Manrope variable font.
- GSAP and ScrollTrigger for text movement, image parallax and stacked project scenes. Pinning requires a sufficiently tall desktop viewport and never pins a chapter taller than the viewport.
- A separately loaded Three.js module creates the aperture and road geometry. It is requested only near a scene, with no external models, textures or runtime CDN.
- 3D rendering is capped near 30 fps and device pixel ratio 1.5. It pauses out of view, in a hidden tab, and when motion is disabled.
- System reduced-motion settings take priority. A visible motion button also persists the visitor's choice locally. Data Saver skips 3D. Static vector compositions survive missing WebGL or context loss.
- HTML remains readable with JavaScript disabled. Project links, navigation and native disclosures continue to work. The recorded policy comparison explains both outcomes without JavaScript.
- Responsive WebP assets, explicit image dimensions, lazy loading below the hero and minified CSS/JavaScript keep the opening light. Three.js is not part of the opening bundle.

The policy interaction uses a recorded synthetic example. It makes no model calls and needs no API key. The five-to-zero result is the published 20-case development comparison, not an independent estimate of model accuracy. Do not imply measured business gains or publish private dealership data.

## Verification and maintenance

Browser tests cover five screen widths, WCAG A/AA automated checks, keyboard navigation, reduced motion, normal animated layouts, persisted pause, no JavaScript, WebGL failure, real 3D loading and pausing, context loss, the recorded policy interaction and 404 recovery. Automated checks supplement visual review; they do not establish full accessibility conformance.

Local Lighthouse reports and section screenshots live in ignored `local-data/`. Lighthouse is a simulated lab run, not field Core Web Vitals. Recheck after changing images, animation timing or dependencies.

Only `site/` is deployed. Keep credentials, local QA reports and private career materials out of that directory. Do not add inflated claims, fake metrics, skill ratings or em dashes.

## Public profile and PDF

The `/profile/` page offers a concise, text-based overview for hiring conversations. It contains project evidence, experience, tools and education, with a one-page PDF download. It loads no JavaScript. Links from the portfolio opening, contact section and GitHub README make it easy to find.

`src/profile.json` is the shared source for the web page and PDF. Education is in progress; no graduation date is assumed. Contact uses Leon's public LinkedIn and GitHub links.

To change the facts, edit the JSON and run `python scripts/build-profile-pdf.py` with ReportLab and pypdf installed. Inspect the exported PDF, then run `npm run build`. The PDF builder records the data and PDF hashes in `src/profile-pdf.json`; the website build rejects a stale or mismatched PDF. JSON uses LF line endings for consistent hashes across Windows and CI. CI verifies the committed PDF and builds the HTML without needing Python.

The browser checks cover the profile at mobile and desktop widths, keyboard access, automated accessibility and actual PDF download with JavaScript disabled. The PDF was separately rendered and checked for a single page, readable text and working link annotations.
# Browser test environment

GitHub Actions runs the full portfolio test suite in the official `mcr.microsoft.com/playwright:v1.63.0-noble` container, matching the pinned `@playwright/test` dependency. The image includes browser binaries and system dependencies; `npm ci` still installs the project's locked packages. Keep the image version aligned when upgrading Playwright. Local testing remains `npm test` with an installed Playwright Chromium browser.

This replaced per-run system-package installation after two 9 September 2026 CI attempts failed on a Google Chrome apt repository hash mismatch before tests could start. Package integrity checks were not disabled and test coverage was not reduced. See the [official Playwright container CI configuration](https://playwright.dev/docs/ci#via-containers).
