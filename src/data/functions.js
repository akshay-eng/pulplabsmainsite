/* The function taxonomy — a second way into the same catalogue.
 *
 * Practice areas (advisory, accelerators, small business, enablement, managed)
 * answer "how do I engage you". This answers "I run IT operations and my
 * incident queue is a mess", which is how people actually arrive. Neither
 * replaces the other; a solution appears under exactly one function and
 * exactly one practice area, and both routes land on the same detail page.
 *
 * Deliberately NOT industry. Industry buckets — banking, healthcare, retail —
 * imply domain expertise that needs case studies behind it, and with this many
 * solutions most buckets would sit empty or get padded. Function is what we
 * actually sell.
 *
 * `status` is load-bearing and must stay honest:
 *   'production'  — an accelerator running in a client estate today
 *   'scope'       — we have built this shape before; each one is scoped and
 *                   built to your systems rather than installed
 * Never promote something to 'production' that is not.
 */

export const functions = [
  {
    id: 'it-operations',
    name: 'IT Operations',
    tag: 'Incident, change, patch and automation',
    blurb:
      'Where our accelerators are strongest, because it is where we have run the most. All four are deployed inside your estate against the ITSM and CMDB you already run — your data never leaves your boundary for us to operate them.',
  },
  {
    id: 'sales',
    name: 'Sales',
    tag: 'Enquiry handling, proposals, pipeline',
    blurb:
      'The unglamorous end of revenue work: nothing sitting unanswered overnight, proposals that start from your last win rather than a blank page, and a straight read on which deals have gone quiet.',
  },
  {
    id: 'support',
    name: 'Customer Support',
    tag: 'First-line resolution and escalation',
    blurb:
      'Answering from your own material with the sources attached, escalating on rules you set rather than a confidence threshold nobody can explain, and telling you which questions your documentation keeps failing to answer.',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    tag: 'Campaigns, scheduling, content upkeep',
    blurb:
      'Drafting against your own positioning and your own past work, never a generic template. Everything arrives as a draft for a human to edit, which is the only way it stays in your voice.',
  },
  {
    id: 'finance',
    name: 'Finance & Back office',
    tag: 'Reconciliation, contracts, expenses',
    blurb:
      'High-volume matching and extraction where the work is exacting, repetitive and currently done by someone far too senior for it. Every one of these keeps a human on the exceptions.',
  },
  {
    id: 'data',
    name: 'Data & Reporting',
    tag: 'Recurring reports, variance, quality',
    blurb:
      'The reports that get rebuilt by hand every month, the "why did this number move" question that eats an analyst’s afternoon, and the upstream breakage nobody notices until a board pack is wrong.',
  },
]

export const getFunction = (id) => functions.find((f) => f.id === id)
