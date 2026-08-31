# Image credits

The photographs below are stored locally, resized to 1600 px, stripped of metadata, and encoded as WebP.

- `photos/coding-session.webp` — “Coding together @ NESA by Makers,” photographed by Desola Lanre-Ologun. [Source](https://unsplash.com/photos/kwzWjTnDPLk), [Unsplash License](https://unsplash.com/license).
- `photos/workshop-collaboration.webp` — “Two female coworkers collaborating,” photographed by Surface. [Source](https://unsplash.com/photos/QKml62yu-dA), [Unsplash License](https://unsplash.com/license).

These images illustrate collaborative working practices. They are not photographs of PulpLabs employees or client sites.

## Team avatars

`avatars/member-01.webp` through `avatars/member-06.webp` are AI-generated editorial illustrations of fictional people. They are placeholders and do not depict PulpLabs employees.


## Capability card artwork — `public/void/cards/`

Generated with Gemini (`gemini-3-pro-image`) and Veo (`veo-3.1-fast-generate-preview`).

These are **stylised illustrations of the kind of interface each system produces**, not
screenshots of a shipped product and not screenshots of any customer's environment.

They are populated with **invented but plausible data** — generic ticket and change IDs, made-up
service names, no real company names and no real CVE numbers. Nothing in them is a real metric,
a real incident or a real customer's data, and none of it should be quoted as evidence.

All eight are stills. Motion was tried and dropped: Veo cannot render legible type, so an
animated version could only show blank placeholder bars — which read as an unfinished
wireframe — or invented words that come out misspelled.

`advisory-map.webp` is the same kind of illustration for the advisory practice: a workflow
map and a payback-versus-effort matrix. It replaced a photograph of a meeting, which showed
the setting rather than the deliverable.

## Practice-area photography — `public/void/advisory-strategy.webp`, `enablement-workshops.webp`

AI-generated photographs. **The people shown are not real and are not employees, clients or
workshop attendees.** They illustrate the format of the engagement — a discovery session and a
hands-on workshop — and must not be captioned or presented as documentation of real events.
Replace with genuine photography when it is available.


## Platform logos — `public/logos/`

`claude.webp`, `openai.webp`, `copilot.webp`, `gemini.webp` and `watsonx.webp` are the vendors'
own brand marks, supplied by the site owner. The first four came as Icons8 "Windows 11 Color"
icon files; `watsonx.webp` was supplied separately as an 80px PNG.

**Two things to settle before this goes live:**

1. **Icons8 licensing.** Icons8's free tier requires a visible attribution link back to
   icons8.com wherever the icons appear. If that link is not present on this site, the icons
   need either an Icons8 paid licence or replacement with each vendor's own official brand
   asset. This is unresolved.
2. **Trademark use.** Showing these marks is nominative use — identifying the platforms we
   teach — which is normally fine. It becomes a problem if the layout implies endorsement,
   partnership or certification *by* the vendor. Several of these vendors publish brand
   guidelines with specific rules on clear space, minimum size and permitted contexts; worth
   a read before launch.

The OpenAI mark ships as mid-grey (rgb 97,97,97) and is illegible on an AMOLED background,
so it was repainted white with its alpha preserved. The other three are unmodified.

All five platforms now carry a supplied mark. The drawn abstract fallback remains in
`PlatformMark.jsx` for any platform added later without one — a guessed-at approximation of a
trademark would be worse.


## Client logos — `public/logos/client-*.webp`

All `client-*.webp` marks are the organisations' own logos, supplied by the site owner:
Power & Pack Solutions, Urban Ethnographers, moveForward_, Blue Sea Powertech, Gazet
International, International Business Magazine, SLD, Shrusti Agarbatti, Soul Cirkus and Canvape.

**Check before launch:** Gazet International and International Business Magazine are
publications. If they represent press coverage rather than client engagements, they should not
sit under a heading reading "Trusted by" — see the note in `src/data/clients.js`. Both are shown **unmodified**, on their own
background colour, with the plate behind them in CSS set to match — no knocking out, no
recolouring. A trademark recoloured to fit a palette stops being the trademark, and keying a
near-white ground out of a small raster leaves fringing on every antialiased edge.

Each testimonial takes its accent from the client's brand: `rgb(222, 0, 13)` sampled from the
Power & Pack flame, `rgb(248, 200, 8)` from the Urban Ethnographers ground.

**Size note:** the Power & Pack source is only 143x39 after trimming, so it is rendered at 22px
tall — deliberately smaller than the other. Scaled up it is only a bigger blur. A vector or a
larger raster would let it sit at the same size as the Urban Ethnographers mark.

**Before launch, two things:**

1. Confirm both clients are happy to be named and quoted publicly. Their quotes are currently
   attributed to "Name Surname" and need real names, or explicit permission to stay anonymous.
2. **The moveForward_ and Blue Sea Powertech quotes are DRAFTS.** Those two clients are real and
   the logos are theirs, but the words are ours. Get each confirmed in writing before launch — a
   quote attributed to a named company that they did not say is a fabricated reference, and it is
   worse than an anonymous placeholder precisely because it looks credible.
3. **Two of the six testimonials are anonymous placeholders** — written copy, not real quotes. They are
   marked `placeholder: true` in `src/components/void/Voices.jsx` and render without a logo, with
   only a role and a sector ("Head of IT Operations · Manufacturing · 1,200 staff"). They carry no
   company name and no person's name deliberately, so none can be mistaken for a real reference.
   Do not attach an invented company to one: an attributed testimonial that did not happen is a
   fabricated reference, and it surfaces badly in due diligence.


## Team portraits — `public/avatars/akshay.webp`, `akash.webp`, `justin.webp`

Real photographs of real people, supplied by the site owner. Not generated.

Each was cropped individually rather than positioned with CSS, because the three
originals were framed completely differently: head-and-shoulders landscape, full-body
portrait, and three-quarter. `object-position` can slide a frame around but cannot change
how large a head is inside it, so a shared value could not have matched them. Each crop
places the head at a similar size and eye line inside the same 4:3 frame.

The six `member-0N.webp` files are the AI-generated portraits of fictional people that
previously filled this page. They are no longer referenced and can be deleted once the
roster is settled.
