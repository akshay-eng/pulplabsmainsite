# pulplabs.ai

Marketing site and blog for PulpLabs — an AI consultancy and engineering firm. Next.js (App Router)
with a SQLite-backed blog, an admin CMS and a REST API.

## Pages

The site is navigated on two axes — **capabilities × industries** — which is the structural
difference between a consultancy and a product. See [PRODUCT.md](PRODUCT.md) for the positioning
that governs this.

| Route                    | Page       | What's on it                                                                       |
| ------------------------ | ---------- | ---------------------------------------------------------------------------------- |
| `/`                      | Home       | Hero, trust strip, accreditation row, industries grid, client work, engagement steps, voices, insights |
| `/services`              | Capabilities | Five practices as an accordion, each cross-linked to the sectors it has been used in |
| `/industries`            | Industries | Index of the four sectors we have delivered in                                     |
| `/industries/[sector]`   | Sector     | What we see, what we do there, the client outcome, and the capabilities behind it   |
| `/case-studies`          | Work       | Case-study index. Falls back to an honest empty state with attributed outcomes      |
| `/case-studies/[slug]`   | Case study | Server-rendered write-up with metrics, related work, full SEO metadata              |
| `/about`                 | About      | Engagement model, principles, roster, accreditation                                 |
| `/contact`               | Contact    | Form, ending in a pre-filled `mailto:`                                              |
| `/blog`                  | Insights   | Post index from the database, category and tag filters, newsletter                  |
| `/blog/[slug]`           | Post       | Server-rendered article, table of contents, related posts, full SEO metadata        |
| `/admin`                 | CMS        | Sign-in, post list, markdown editor. Gated by middleware, `noindex`                 |

`/team` is a permanent redirect to `/about` — the roster moved there to sit with the engagement
model and the accreditation.

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
├── components/
│   ├── void/       Nav, Footer, NextPage, LoopVideo — the live chrome
│   └── apple/      Chevron and Reveal are still used; the rest is dead
├── data/           Page content — capabilities, industries, firm, team, blog
├── app/            Routes: marketing pages, /blog, /admin, /api, sitemap, robots, feed
├── lib/            db.js, posts.js, cases.js, markdown.js, auth.js, llm.js, assistant.js
├── views/
│   └── void/       Home, Services, Industries, Industry, Work, About, Contact — LIVE
└── styles/         void.css (live) + ai-dock.css, loaded in app/layout.jsx
```

`views/` rather than `pages/` on purpose: `pages/` is reserved by Next and these components would
be picked up as Pages Router routes.

**Three design systems exist; only one is live.** Every marketing route renders `views/void/*`
against `styles/void.css`. `views/*.jsx` (the "fruit" system) and `views/apple/*` are dead code
kept for reference, along with `global.css`, `refined.css`, `components.css` and `apple.css`.
`/blog` is the last route still loading the legacy light stylesheets — converting it to void is
the outstanding piece of the dark redesign.

Content is separated from markup on purpose: to change a practice blurb, a sector, a team member
or a blog post, edit the matching file in `src/data/` — no JSX changes needed. `capabilities.js`
and `industries.js` cross-reference each other by id, which is what makes the two axes navigable
in both directions.

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

## Assistant

The dock is backed by an LLM through `POST /api/assistant` — currently Groq running
`openai/gpt-oss-120b`. The key is read only in [`src/lib/llm.js`](src/lib/llm.js), which
is `server-only`, so it is never sent to the browser.

The module is named for the job, not the vendor: this has already moved from xAI to Groq
once, and both speak the OpenAI chat/completions shape, so switching again is
`LLM_BASE_URL` + `LLM_MODEL` + a key. (Groq is the inference provider at groq.com, keys
start `gsk_`. Grok is xAI's model, keys start `xai-`. Different companies.)

`gpt-oss` is a **reasoning** model, which has two consequences the code handles:
`max_completion_tokens` covers reasoning *and* the answer, so a low cap returns an empty
`content`; and the trace comes back in `message.reasoning`, which is deliberately dropped
— it is the model's scratchpad, not something a visitor should read.

The route is public and unauthenticated, because it powers the site chat. That makes it
a paid API anyone can call, so it is rate limited to 12 messages per IP per minute and
capped at 1000 characters per message. The limiter is in-memory, which is fine while
`fly.toml` pins one always-on machine; past that it needs to move to SQLite or Redis.

If the model is unreachable — no credits, bad key, wrong model name, timeout — the route
falls back to the local intent matcher in [`src/lib/assistant.js`](src/lib/assistant.js)
and the dock answers from the site's own content. The real cause is logged server-side
and never returned to the browser. The booking flow stays deterministic and never touches
the model.

```bash
GROQ_API_KEY=...                              # required for live answers
LLM_BASE_URL=https://api.groq.com/openai/v1   # any OpenAI-compatible provider
LLM_MODEL=openai/gpt-oss-120b
LLM_REASONING_EFFORT=low                      # low suits simple grounded lookups
```

## Notes before this goes live

- The contact and newsletter forms validate and acknowledge locally. Point `ContactForm` and
  `NewsletterForm` at a real endpoint before launch.
- The assistant dock cannot actually book anything — see "Assistant dock" above.
- **No case studies are published.** `/case-studies` renders an honest empty state that points at
  the two attributed client outcomes on the industry pages. Seed real work through `/admin/cases`
  and the index, the home page and the sitemap all pick it up automatically.
- Team names, bios, photos and social links in `src/data/team.js` are placeholders. The roster on
  `/about` says "name pending" rather than inventing six people.
- The seeded blog posts are stubs — the originals were titles and excerpts only. Rewrite them in
  the admin.
- `/blog` still loads the legacy light stylesheets, so Insights jars against the dark site.
- Set `NEXT_PUBLIC_SITE_URL` in production, or every canonical URL, OG tag, sitemap entry and RSS
  link will point at localhost.
