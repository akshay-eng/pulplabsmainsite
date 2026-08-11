# pulplabs.ai

Marketing site and blog for PulpLabs — an AI consultancy and engineering firm. Next.js (App Router)
with a SQLite-backed blog, an admin CMS and a REST API.

## Pages

| Route       | Page     | What's on it                                                                                       |
| ----------- | -------- | -------------------------------------------------------------------------------------------------- |
| `/`         | Home     | Hero, trusted-by strip, practice-area preview, engagement steps, testimonials, enablement, contact |
| `/services` | Services | Five-area catalogue, enterprise accelerators, case studies, CTA                                     |
| `/team`     | Team     | Six-person roster, platform certifications, CTA                                                     |
| `/blog`     | Blog     | Post index from the database, category and tag filters, newsletter                                 |
| `/blog/[slug]` | Post  | Server-rendered article, table of contents, related posts, full SEO metadata                       |
| `/admin`    | CMS      | Sign-in, post list, markdown editor. Gated by middleware, `noindex`                                 |

## Running it

```bash
npm install
cp .env.example .env.local          # then fill SESSION_SECRET and API_TOKEN
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='at least 12 chars' npm run seed
npm run dev                          # http://localhost:3000
npm run build && npm start           # production build
```

`npm run seed` creates the admin user and imports the starter posts. It is safe to re-run —
the admin is upserted and posts are matched on slug.

## Layout

```
src/
├── components/     Navbar, footers, logo, icons, forms, shared bits
├── data/           Page content — copy, colours and metrics live here, not in JSX
├── app/            Routes: marketing pages, /blog, /admin, /api, sitemap, robots, feed
├── lib/            db.js, posts.js, markdown.js, auth.js, motion.js, assistant.js
├── views/          Home, Services, Team — the marketing page bodies
└── styles/         global → refined → components → blog → ai-dock (load order matters)

`views/` rather than `pages/` on purpose: `pages/` is reserved by Next and these components
would be picked up as Pages Router routes.
```

Content is separated from markup on purpose: to change a service blurb, a team member or a blog
post, edit the matching file in `src/data/` — no JSX changes needed.

Stylesheets load in that order and each layer builds on the one before, so `refined.css` can
override `global.css` without specificity hacks. Tokens live at the top of the first two.

## Assistant dock

`AIDock` is mounted once in the root layout, so its transcript survives navigation. It hides itself
on `/admin` — it is a visitor-facing sales surface, not part of the CMS.
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

The stack is React 19 + `@react-three/fiber@9` + `three@0.169`. `@react-three/drei` is deliberately
**not** installed: nothing imports it and its `react: ^18` peer would pin the whole tree back.

Next 15's package.json advertises `react: "^18.2.0 || ^19.0.0"`, but the App Router serves **React 19**
to client components regardless — on React 18 the hero throws `ReactCurrentOwner is undefined` from
fiber v8. Check what is really running with
`node -e "console.log(typeof require('react').useActionState)"` (React 19 only). three and fiber move
as a set, gated on the React major, and a green `next build` will not catch a mismatch — the failure
is client-side, so load `/` and confirm the canvas mounts.

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
  `src/views/Home.jsx`, not a live feed. Reword if that framing overstates it.
- Team names, bios, photos and social links in `src/data/team.js` are placeholders.
- The seeded blog posts are stubs — the originals were titles and excerpts only. Rewrite them in
  the admin.
- Case-study copy on `/services` is still placeholder.
- Set `NEXT_PUBLIC_SITE_URL` in production, or every canonical URL, OG tag, sitemap entry and RSS
  link will point at localhost.
