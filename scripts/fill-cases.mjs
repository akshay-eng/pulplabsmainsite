import Database from 'better-sqlite3'
const db = new Database(process.env.DATABASE_PATH || '.data/pulplabs.db')

/* Fuller placeholder bodies so the detail pages read as real pages rather
   than a stub. Still placeholder — the figures are the ones already published
   on the site; nothing new is claimed. */
const BODIES = {
  'quotes-in-minutes-not-days': `Power & Pack Solutions make custom packaging for food and industrial clients. Twelve people, a catalogue in the thousands, and a pricing model with enough exceptions that only two people in the building could quote confidently.

## The problem

Enquiries arrived at all hours through three channels — the website form, a shared inbox and WhatsApp. A quote took about two days to leave the building, and anything landing after five was answered the next morning at the earliest.

The cost was not the quoting itself. It was the enquiries that went quiet while waiting.

> "Quotes that took our team two days now go out in twenty minutes. The PulpLabs team understood our pricing rules better than some of our own hires."

## What we looked at first

Discovery ran for a week. We sat with the two people who did the quoting and wrote down what they actually checked — not the documented process, the real one. That surfaced three things nobody had written down:

- Volume breaks were applied inconsistently between the two quoters
- Around a fifth of enquiries were for products not in the catalogue at all
- The slowest step was not pricing, it was chasing the customer for a missing dimension

## What we built

A quoting assistant connected to the product catalogue and the pricing rules, plus a support agent on WhatsApp and the website.

- **Catalogue and rules, not a chatbot.** The assistant reads the same pricing tables the team uses. When a rule changes, it changes in one place.
- **The missing-information problem first.** Before quoting, it checks whether it has everything, and asks for what is missing while the customer is still in the conversation.
- **A human approval step.** No quote leaves without someone signing it off. That was a condition from the first meeting and it has not changed.

## What we evaluated

Before it touched a live enquiry we scored it against 180 historical quotes with known outcomes. Two rounds of prompt changes helped the common cases and quietly broke the volume-break edge cases — which is exactly the failure the harness exists to catch.

## What changed

| | Before | After |
| --- | --- | --- |
| Quote turnaround | ~2 days | ~20 minutes |
| Enquiries handled without a human | — | 62% |
| Time returned to the team | — | ~9 hrs/week |

Out-of-hours enquiries now get a response immediately rather than the following morning.

_Placeholder body copy — edit this in the admin before launch._`,

  'from-transcripts-to-themes-overnight': `Urban Ethnographers run qualitative research studies for public sector and consumer clients. Small team, deep method, and a bottleneck everyone in qualitative research will recognise.

## The problem

Thematic coding. Every study generated dozens of hours of field recordings, and turning those into coded, clustered themes was the slowest part of the work by a wide margin.

The team was not looking to automate the thinking. They were looking to stop spending their best hours tagging.

> "Our researchers stopped tagging transcripts and started interpreting them. The coding framework is still ours — the machine just keeps up with it now."

## The line we drew

The framework is the research. That belongs to the researchers and always did. What we automated was the mechanical application of a framework that already existed.

- **Automated:** transcription, first-pass coding against the existing framework, clustering
- **Not automated:** designing the framework, interpretation, anything that goes in front of a client

## What we built

Field recordings transcribe, code and cluster themselves against the team's own framework. Every coded segment links back to the timestamp it came from, so a researcher can always check the machine's work against the tape.

## What we evaluated

We took three completed studies where the team already had hand-coded results, and scored the system against them. Agreement on the well-defined codes was high. On the ambiguous ones it was not — which was useful, because those turned out to be codes the team disagreed on internally too.

## What changed

| | Before | After |
| --- | --- | --- |
| Manual coding effort | baseline | 70% less |
| Interviews per study | baseline | 3× |
| Time to a draft insight deck | ~1 week | 1 day |

_Placeholder body copy — edit this in the admin before launch._`,
}

const stmt = db.prepare(`UPDATE case_studies SET body=?, updated_at=datetime('now') WHERE slug=?`)
let n = 0
for (const [slug, body] of Object.entries(BODIES)) n += stmt.run(body, slug).changes
console.log(`✓ filled ${n} case study bodies`)
