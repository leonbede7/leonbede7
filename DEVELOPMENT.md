# Portfolio website

The public site lives in `site/`. GitHub Actions checks it before publishing to <https://leonbede7.github.io/leonbede7/>. The root README remains the GitHub profile.

```sh
npm ci
npx playwright install chromium
npm run preview
```

Open <http://127.0.0.1:4318/leonbede7/>. Run `npm test` for responsive layout, light/dark contrast and accessibility, keyboard interaction, no-JavaScript navigation and the missing-page recovery flow.

The site uses native HTML and CSS with no client-side application dependencies. Both project images are screenshots of the public sites, captured on 8 September 2026. They are snapshots, not live inventory or live evaluation results. Screenshot content and case-study claims should be reviewed when the underlying projects change.

The design is a restrained developer portfolio with variance 6/10, motion 2/10 and density 3/10. System fonts avoid font downloads; hover and focus feedback are the only visual transitions. Native details/summary keeps the example explanation accessible without JavaScript. Light/dark tokens follow the visitor's system setting. Actual screenshots were chosen to show the user's work rather than invented product imagery.

Public copy must describe AI assistance accurately and must not imply independently validated model accuracy, production users for Intake Eval, or measured business impact for the dealership product. Do not add an em dash, skill ratings, unverified employment dates or contact information from private records.

Only `site/` is published. Local previews, QA output and private career materials do not belong in that directory.
