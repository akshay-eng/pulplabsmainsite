# pulplabs.ai

Marketing site for PulpLabs — an AI consultancy and engineering firm. Built in React with Vite,
ported from the "PulpLabs UI mockup" design comps.

## Pages

| Route       | Page     | What's on it                                                                                       |
| ----------- | -------- | -------------------------------------------------------------------------------------------------- |
| `/`         | Home     | Hero, trusted-by strip, practice-area preview, engagement steps, testimonials, enablement, contact |
| `/services` | Services | Five-area catalogue, enterprise accelerators, case studies, CTA                                     |
| `/team`     | Team     | Six-person roster, platform certifications, CTA                                                     |
| `/blog`     | Blog     | Featured post, post list, open-source panel, newsletter                                             |

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the production build
```

## Layout

```
src/
├── components/     Navbar, footers, logo, icons, forms, shared bits
├── data/           Page content — copy, colours and metrics live here, not in JSX
├── lib/            motion.js (reveals, parallax, counters), assistant.js
├── pages/          Home, Services, Team, Blog
└── styles/         global.css → refined.css → components.css → ai-dock.css
```

Content is separated from markup on purpose: to change a service blurb, a team member or a blog
post, edit the matching file in `src/data/` — no JSX changes needed.

Stylesheets load in that order and each layer builds on the one before, so `refined.css` can
override `global.css` without specificity hacks. Tokens live at the top of the first two.

## Assistant dock

`AIDock` is mounted once in `App.jsx`, outside `<Routes>`, so its transcript survives navigation.
It has three states — composer bar, open panel, and minimised to a dot — persisted to
`sessionStorage`.

**It has no backend.** Answers come from a local intent matcher in
[`src/lib/assistant.js`](src/lib/assistant.js) over the same content in `src/data/` that the pages
render, and the booking flow ends in a pre-filled `mailto:` rather than a calendar. `askAssistant()`
is the single seam — swap its body for a `fetch` to your own server route to put a real model behind
it. Call the model from that route, never from the browser: a client-side API key is readable by
every visitor.

## 3D hero

The hero centrepiece is a WebGL shader (`HeroCore.jsx`) lazy-loaded behind `requestIdleCallback`, so
it ships as a separate ~221KB gzip chunk that only `/` requests. `HeroStage.jsx` probes for WebGL and
respects `prefers-reduced-motion`, falling back to a pure-CSS orb.

three / @react-three/fiber / @react-three/drei are pinned to an older line **on purpose** — fiber v9
and drei v10 both require React 19. They move as a set; upgrading means React 18 → 19 first.

## Design system

Tokens live at the top of [`src/styles/global.css`](src/styles/global.css) as CSS custom properties.

**Colour** — tangerine `#FF6B1A` leads. Watermelon `#F0384B`, lemon `#FFC93C`, strawberry `#FF5C93`
and kiwi `#7BC043` rotate as section accents: one fruit per section, never three at once outside the
logo and the CTA gradient.

**Type** — Bricolage Grotesque for anything loud, DM Sans for anything read, JetBrains Mono for
labels and metadata.

**Radii** — 100px pills for actions, 22px for cards, 16px for media, 11px for icon tiles.

**Ink on colour, never white** — tangerine and lemon are too light for white text; use `#1F1710`.

## Artwork

The hero backdrop and the four supporting images in `public/art/` were generated with Gemini 3 Pro
Image. [`scripts/generate-hero-bg.mjs`](scripts/generate-hero-bg.mjs) holds the hero prompt and is
runnable with `GKEY=<api-key> node scripts/generate-hero-bg.mjs` — note `imageSize: '4K'`, which is
what makes the difference between a sharp result and a soft one.

The art is deliberately abstract rather than photoreal. A realistic "packaging line" photo on a case
study would imply it documents that client's actual facility; stylised art carries the subject
without claiming to be evidence. For the same reason there are no generated team photos — faces on
a team page read as real employees.

## Notes before this goes live

- The contact and newsletter forms validate and acknowledge locally. Point `ContactForm` and
  `NewsletterForm` at a real endpoint before launch.
- The assistant dock cannot actually book anything — see "Assistant dock" above.
- The telemetry panel is headed "Live estate telemetry"; the figures are static values from
  `src/pages/Home.jsx`, not a live feed. Reword if that framing overstates it.
- Team names, bios, photos and social links in `src/data/team.js` are placeholders.
- Blog posts and case-study copy are placeholders; post links point at `#`.
- Routing uses `BrowserRouter`, so a static host needs an SPA rewrite. `public/_redirects` covers
  Netlify; Vercel and friends need the equivalent rule.
