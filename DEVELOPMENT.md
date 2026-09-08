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
