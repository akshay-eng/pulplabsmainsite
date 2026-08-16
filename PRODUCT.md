# PulpLabs — product context

## What this is

The marketing site for PulpLabs, an AI consultancy and engineering firm. Six people. The site
exists to get a qualified buyer into a thirty-minute discovery conversation.

**Register: brand.** This is a marketing site, so the design *is* the product. There is no app
behind it beyond the blog CMS.

## The positioning line that governs everything

> PulpLabs is a firm you hire, not a product you buy.

This is the single test every page, section and sentence has to pass. The site has historically
failed it by presenting itself as an AI platform: a scrolling wall of branded module names, a
live-looking telemetry dashboard, inventory counts of "accelerators in production", and a
one-axis navigation built around what the thing is rather than who it serves.

### What a firm leads with

| Firms lead with | Products lead with |
|---|---|
| Who we serve (industries) | What the thing does (features) |
| Named people and their credentials | Screenshots and demos |
| Client work with quantified outcomes | Usage metrics and dashboards |
| Point of view (insights, research) | Changelogs and roadmaps |
| "Scoped from discovery" | Pricing tiers |
| Partner and platform accreditation | Integrations directory |

### Structural rule: two axes

A services firm navigates on **capabilities × industries**. Both axes are first-class. This is
the clearest structural signal that separates a consultancy from a vendor, and it is drawn from
the reference sites below.

## Users

**Primary.** Enterprise IT and operations leaders (director level and up) evaluating whether to
bring in outside help for AI. They are risk-averse, have usually been burned by a stalled pilot,
and are scanning for evidence that you have done this before in their sector.

**Secondary.** Owners and operators of small businesses (roughly 5 to 50 people) who want a
specific workflow fixed and need to know it will be live in weeks, not quarters.

Both arrive sceptical. Neither wants a demo. Both want to know who they would actually be
working with.

## Voice

Plain, direct, unhedged. Short declaratives. Willing to say no in public: "If AI does not help
your case, we tell you in the discovery call rather than selling you a pilot that stalls."

Numbers over adjectives. Never claim what cannot be evidenced. The existing copy does this well
and should be preserved.

House style uses em dashes freely. Keep that voice consistent rather than converting existing
copy.

## Honesty constraints

These are hard rules, not preferences. The site is for a real company.

- **No invented clients.** Two real client names exist: Power & Pack Solutions and Urban
  Ethnographers. Do not add logos or names beyond what is real.
- **No fabricated people.** The roster is placeholder until real names are supplied. The current
  treatment names the role and says "name pending", which is honest. Keep that shape.
- **No fake live data.** Anything that looks like a live feed must be one. This is why the
  "Live estate telemetry" panel was removed: the figures were hardcoded.
- **Only claim sectors actually served.** Manufacturing, research, IT operations, professional
  services and small business are grounded. A fourteen-vertical grid on a six-person firm is not.
- **Accreditation is real** (Anthropic, OpenAI, Microsoft, IBM) and can be shown as such.

## Anti-references

Avoid the AI-platform launch page: hero product demo, SKU marquee, live metrics dashboard,
feature grid of identical cards, "trusted by" logo wall, pricing tiers.

## References

techmahindra.com and wipro.com, for structure rather than aesthetics. What to take:

- Capabilities and Industries as co-equal navigation pillars
- Insights as a nav-level credibility engine, carrying case studies and research
- Client work surfaced high, with named clients and quantified outcomes
- A partner and platform ecosystem band as third-party validation
- No pricing, no product marquee, no live dashboard anywhere on either site

What **not** to take: their density. Both sites carry thousands of case studies and analyst
reports. PulpLabs has a handful. Surfaces must look deliberate at low volume rather than like
empty grids waiting to be filled.

## Design system

Dark. The "void" system in `src/styles/void.css`, rendered by `src/views/void/*`. Near-black
ground with grain and grid textures, a single restrained warm accent, mono labels, large display
type, generous negative space.

The scene: a director reading this on a laptop between meetings, deciding in ninety seconds
whether these people are serious. Dark reads as engineered and considered here; the previous
light "fruit" system read as a startup pitch.

Colour strategy is **restrained** — tinted neutrals plus one accent. Do not reintroduce the
five-fruit palette from the legacy system.

**Dead code:** `src/views/*.jsx` and `src/views/apple/*` are unused. Every marketing route
renders `src/views/void/*`. `/blog` still loads the legacy light stylesheets and is the last
surface not yet converted.
