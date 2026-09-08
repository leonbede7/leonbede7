# Visual asset provenance

Created for the September 2026 portfolio redesign. Concept artwork is AI-generated using the built-in image generation tool. It is not a photograph of Leon, his family, the dealership or its inventory. Product screenshots are separately identified below.

## Reference and production record

Five separate section references were generated and visually inspected before implementation. Their prompt briefs are summarized here, rather than represented as verbatim generation logs:

| Section        | Prompt brief                                                                                                                                                                                                | Generated source                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Opening        | Cinematic graphite editorial portfolio. A sculptural winding road with a single red trace, large warm-white two-line headline, sparse navigation and clear left-side space.                                 | `exec-3e4d28a9-c352-4080-9a03-2f01c415136d.png` |
| Galerija       | A silver vehicle in a dark studio, oversized dealership headline, red visual continuity and a composition connecting the business to product screens. Reference interface details are not product evidence. | `exec-adbb2460-5169-45fd-90e5-7aaaf5eb04a4.png` |
| AI evaluation  | A machined metal aperture with loose red strands entering and orderly strands leaving, large editorial headline and a clearly separated evaluation result.                                                  | `exec-978a3cf9-3160-4c3b-8c63-80e40f3efda2.png` |
| Personal story | A tactile steering-wheel close-up with red stitching, a wide headline and a generous editorial column for Leon's actual story.                                                                              | `exec-96b7c9f6-77c6-42aa-92c7-33de8a487c7d.png` |
| Contact        | A sculptural red road on graphite, large restrained closing typography and direct contact links.                                                                                                            | `exec-554f276b-e9b1-4832-99e9-475e23f172fc.png` |

Three clean production assets were generated separately. Briefs:

- Road: edit the opening reference to remove all typography and interface elements, retaining the dark sculptural S-shaped road, red trace and negative space. Source `exec-5adc664c-e00f-493f-a4d0-cbe31e840e44.png`.
- Vehicle: an unbranded silver European SUV photographed as a studio concept on graphite, with a red light trace, no captions or interface. Source `exec-fae84303-4224-4fb1-a901-342f3b11dce4.png`.
- Wheel: a close-up of a charcoal steering wheel with tactile leather and red stitching, with no text or invented documentary context. Source `exec-7d521430-ac64-4c5a-844c-f48745e9d607.png`.

The original production PNGs are retained locally in ignored `local-data/art-originals/`. Delivery files in `site/assets/` are WebP variants at 768 and 1536 pixels. Sharp performs resizing and compression only. Layout, typography and product UI remain real HTML and CSS.

## Product evidence

Screenshots captured from public, unauthenticated pages on 8 September 2026:

- `catalog.webp`: https://automobili-galerija.hr/ponuda
- `trade-in.webp`: https://automobili-galerija.hr/otkup
- `pagewright.webp`: https://leonbede7.github.io/pagewright/

The smaller `-768.webp` variants are responsive exports of the same screenshots. These are snapshots, not live stock data. No private CRM view or customer record is included. The catalog and trade-in images link to their actual public pages.

`social.jpg` is a browser capture of the implemented opening, used for link previews. It is not a flattened website implementation.

## Code-generated visuals and type

The interactive aperture and closing road are original Three.js geometry in `src/scenes.js`. The static fallbacks and vehicle-record diagram are inline SVG. No external 3D model or stock asset is loaded.

Manrope Latin variable font is self-hosted from `@fontsource-variable/manrope`. Its license is included in `site/assets/manrope-license.txt`. Bundled JavaScript retains dependency license notices.
