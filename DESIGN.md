# A road through the work

## Galerija case-study extension

The standalone `/work/galerija/` page preserves the portfolio's graphite, ivory, vermilion and self-hosted Manrope. Reading this as a product case study for hiring managers: an editorial extension of the existing portfolio, using native HTML and CSS. DESIGN_VARIANCE 6, MOTION_INTENSITY 1, VISUAL_DENSITY 4. The page concentrates on reading and inspectable product evidence; its disclosures work without JavaScript.

The existing homepage already covers the story and core decisions, but its detailed case-study link left the portfolio for Markdown. The extension keeps that written source available and adds a direct reading path with public catalog and trade-in screenshots. Existing routes, navigation labels and anchor IDs remain intact. All corners are square; borders group the conceptual data flow and access boundary. No new imagery, animation dependency or private admin mockup is introduced. Screenshots retain capture dates and provenance.

Validation: narrow and desktop layouts, no-JavaScript navigation, disclosure keyboard operation, image loading, automated accessibility checks and existing portfolio regression coverage. Business outcomes remain unmeasured, and the conceptual diagram is labeled separately from product screenshots.

## Brief and evidence

Full visual overhaul requested on 8 September 2026. The original light portfolio was readable and fast but treated three projects as a list. The new composition makes Automobili Galerija the main story, relates Intake Eval to the validation questions that arose from it, and keeps Pagewright as a smaller design experiment. Existing URLs and the Work, About and Contact anchors remain.

Leon supplied the personal story: his father owns a dealership and passed on his love of cars; as a programming student, Leon saw AI's potential; building Galerija became a practical education in design, functionality, CRM and security. His pride is that the project addresses a real business need. Do not invent quantified impact, independent coding authorship or family photographs.

## Art direction

Deep graphite, warm white, one vermilion trace. Manrope variable grotesk with wide display lines. The road is first physical, then a data flow, then a question of trust. DESIGN_VARIANCE 8, MOTION_INTENSITY 8, VISUAL_DENSITY 3. The full-page dark world is an intentional cinematic direction for this overhaul.

Five image references were generated before implementation: opening road, Galerija, personal story, AI evaluation, closing contact. They establish 48-64px desktop insets, 90-140px display type, full-bleed depth, sparse links, and open content rather than nested cards. Final product evidence always uses actual public screenshots, not the invented UI in the reference image.

Signature components: layered image crop frames, a product UI panel stack, an off-grid editorial story, and a 3D ribbon closing composition. Motion language: pinned narrative progression and cinematic fade-through. No scroll hijacking, no fake loading screen, no sound or decorative counters.

## Scene extraction

- Opening: type in the upper left over a winding road. Keep the main text and CTA visible on a 1366x768 laptop. Move the landscape slowly with scroll; give the red trace restrained motion.
- Personal story: tactile steering-wheel artwork paired with Leon's actual account. Sparse copy with sentence-level reveals, always readable without JavaScript.
- Galerija: silver vehicle concept introduces the domain, then an animated central-record map explains the product; real catalog and trade-in screenshots establish evidence. The longest and most substantial chapter.
- Intake Eval: a machined aperture with red strands visualizes the validation boundary. A real, local two-policy interaction demonstrates the routing failure, with the 20-case result clearly qualified.
- Contact: a red 3D road ribbon closes the motif. Large short type and direct LinkedIn/GitHub links.

## Progressive enhancement and quality

All content and links render in HTML. GSAP loads as a deferred local module. Reduced-motion users get the full readable story without pins or parallax. A visible motion toggle provides the same fallback. Three.js loads only near its scene, caps pixel density and pauses outside the viewport or a hidden document. The 3D scene has a still fallback. Mobile gets deliberate stacked layouts and a lighter composition, not a scaled-down desktop pin.

Images have responsive WebP variants and explicit dimensions. Font is self-hosted and subset to Latin. No credentialed API requests are made by the portfolio. Check real browser behavior, mobile, keyboard, contrast, disabled JavaScript, reduced motion, missing WebGL and public subpath hosting. Record Lighthouse as lab evidence only.

## Official references

- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://threejs.org/manual/en/responsive.html
- https://threejs.org/manual/en/rendering-on-demand.html

Generated visuals use the built-in image generation tool. Prompts and source filenames are recorded in ASSETS.md. They are concept artwork, not documentary photography or product screenshots.
