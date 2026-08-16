import { LEARN_SITE_URL } from '@/lib/sites'

/* Spotlight — two pieces of writing from PulpLabs Learn, surfaced on the home
 * page and linked across to the Learn site.
 *
 * These are transcriptions of entries that already exist in
 * pulplabs-learn/src/data/field.js. The copy here is the summary as published
 * there; nothing has been rewritten to sound better on a marketing page, and
 * no metric has been added that Learn does not already carry.
 *
 * WHY THESE TWO, AND NOT THE INTERVIEWS
 * Learn holds two interview entries — 'memory-that-lasts' and
 * 'evaluation-first'. Both are `published: null`, and the video on the first is
 * explicitly a third-party sample standing in until a real recording is edited.
 * Learn labels that honestly in place. Promoting either from a home-page
 * spotlight would not survive the same scrutiny, so both are held back until
 * the recordings actually publish. Swap one in here the day that happens.
 *
 * `relatesTo` is the category tab this piece belongs under, so the spotlight
 * and the explorer above it tell the same story rather than two unrelated ones.
 */
export const spotlight = [
  {
    slug: 'quote-turnaround',
    kind: 'Case study',
    title: 'Quote turnaround, from two days to twenty minutes',
    client: 'Power & Pack Solutions',
    sector: 'Manufacturing · Power and packaging',
    summary:
      'A quoting workflow that depended on a handful of people holding the pricing rules in their heads, rebuilt so the rules live in the system and the people review the output.',
    minutes: 6,
    published: '2026-03-04',
    relatesTo: 'revenue-customer',
    art: '/void/spotlight/quote-turnaround.webp',
    href: `${LEARN_SITE_URL}/field/quote-turnaround`,
  },
  {
    slug: 'agent-migration',
    kind: 'Engagement',
    title: 'Agent migration: moving workflows off a platform',
    client: null,
    sector: 'Platform migration',
    summary:
      'Recovering evaluation sets from production traces, translating workflows through a canonical representation, and proving equivalence before any traffic moves.',
    minutes: 6,
    published: '2026-05-20',
    relatesTo: 'it-operations',
    art: '/void/spotlight/agent-migration.webp',
    href: `${LEARN_SITE_URL}/field/agent-migration`,
  },
]

export const LEARN_FIELD_URL = `${LEARN_SITE_URL}/field`
