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
├── pages/          Home, Services, Team, Blog
└── styles/         global.css — design tokens + all component styles
```

Content is separated from markup on purpose: to change a service blurb, a team member or a blog
post, edit the matching file in `src/data/` — no JSX changes needed.

## Design system

Tokens live at the top of [`src/styles/global.css`](src/styles/global.css) as CSS custom properties.

**Colour** — tangerine `#FF6B1A` leads. Watermelon `#F0384B`, lemon `#FFC93C`, strawberry `#FF5C93`
and kiwi `#7BC043` rotate as section accents: one fruit per section, never three at once outside the
logo and the CTA gradient.

**Type** — Bricolage Grotesque for anything loud, DM Sans for anything read, JetBrains Mono for
labels and metadata.

**Radii** — 100px pills for actions, 22px for cards, 16px for media, 11px for icon tiles.

**Ink on colour, never white** — tangerine and lemon are too light for white text; use `#1F1710`.

## Notes before this goes live

- The contact and newsletter forms validate and acknowledge locally. Point `ContactForm` and
  `NewsletterForm` at a real endpoint before launch.
- Team names, bios, photos and social links in `src/data/team.js` are placeholders.
- Blog posts and case-study images are placeholders; post links point at `#`.
- Routing uses `BrowserRouter`, so a static host needs an SPA rewrite. `public/_redirects` covers
  Netlify; Vercel and friends need the equivalent rule.
