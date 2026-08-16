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

/* Three categories, not six.
 *
 * The catalogue used to present six departments side by side. Six peers with
 * no hierarchy is a wall: a visitor has to read all of them before knowing
 * which one is theirs, and four of the six held two or three items each. These
 * three are the coarsest split that still tells a reader something — the shape
 * of the work genuinely differs across them, which is what makes it a category
 * rather than a bucket.
 *
 * `covers` lists the finer-grained `fn` values still carried on each solution
 * in capabilities.js. That field stays granular on purpose: it is accurate,
 * and it means the presentation can be re-cut again without touching all
 * seventeen entries. byFunction() and getFunction() both resolve through
 * `covers`, so a legacy id like 'sales' still lands on the right category.
 *
 * `assurances` are the two claims that used to occupy their own full-width
 * sections on the home page — that this runs inside your estate, and that a
 * human holds the approval. They were general statements sitting a long way
 * from anything concrete. Attached to a category they are read at the moment
 * a visitor is looking at the systems they apply to, and each one is worded
 * for that category rather than repeated verbatim.
 */
export const functions = [
  {
    id: 'it-operations',
    name: 'IT & Engineering',
    tag: 'Incident, change, patch and migration',
    covers: ['it-operations'],
    blurb:
      'Where our accelerators are strongest, because it is where we have run the most. All four are deployed inside your estate against the ITSM and CMDB you already run — your data never leaves your boundary for us to operate them.',
    assurances: [
      ['Runs inside your estate', 'Wired to the ITSM, CMDB and identity provider you already run, not a multi-tenant tenant of ours.'],
      ['Nothing irreversible happens on its own', 'The agent proposes with its reasoning shown; a named human commits, and both the action and the approver are logged.'],
    ],
  },
  {
    id: 'revenue-customer',
    name: 'Revenue & Customer',
    tag: 'Enquiries, proposals, support and campaigns',
    covers: ['sales', 'support', 'marketing'],
    blurb:
      'The unglamorous end of revenue and service work: nothing sitting unanswered overnight, proposals that start from your last win rather than a blank page, answers drawn from your own material with the sources attached, and campaign drafts written against your positioning instead of a generic template.',
    assurances: [
      ['It answers from your material', 'Your positioning, your past wins, your documentation — with sources attached, so an answer can be checked rather than trusted.'],
      ['Everything customer-facing is a draft', 'Nothing sends, commits or publishes on your behalf. A person approves, which is the only way it stays in your voice.'],
    ],
  },
  {
    id: 'finance-data',
    name: 'Finance & Data',
    tag: 'Reconciliation, contracts, reporting, variance',
    covers: ['finance', 'data'],
    blurb:
      'High-volume matching and extraction where the work is exacting, repetitive and currently done by someone far too senior for it — plus the reports rebuilt by hand every month and the "why did this number move" question that eats an analyst’s afternoon.',
    assurances: [
      ['Exceptions go to a human', 'The system handles the volume it is certain about and routes everything else to a person, rather than guessing to keep a completion rate up.'],
      ['Every figure keeps its provenance', 'Any number it produces can be traced back to the record it came from, because a finance output nobody can audit is not usable.'],
    ],
  },
]

/* Resolves a category id, and also the legacy per-department ids still carried
 * on each solution — getFunction('sales') returns Revenue & Customer, which is
 * what a breadcrumb built from `solution.fn` needs. */
export const getFunction = (id) =>
  functions.find((f) => f.id === id) || functions.find((f) => f.covers.includes(id))

/** The finer-grained `fn` values a category contains. */
export const coveredBy = (id) => getFunction(id)?.covers ?? [id]

/* Industries.
 *
 * Read these as "where this work lands", not "we are domain experts in your
 * sector". The solutions underneath are the same ones — what changes is the
 * constraint around them: a bank's audit position, a hospital's data rules,
 * a manufacturer's maintenance window. That framing is honest and it is also
 * the part that actually differs, so it is what each page leads with.
 *
 * `solutions` lists slugs already in the catalogue. Nothing sector-specific
 * has been invented to fill a grid. */
export const industries = [
  {
    id: 'financial',
    name: 'Financial services',
    tag: 'Regulated, audited, change-controlled',
    blurb:
      'Nothing ships without an audit trail somebody will be asked to defend. The work here is less about the model and more about proving, afterwards, exactly what it did and who approved it.',
    note: 'Every engagement assumes your risk function reviews before production, not after.',
    solutions: ['incident-intelligence', 'change-copilot', 'agent-migration', 'contract-review', 'invoice-recon', 'report-assembly', 'metric-explainer'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare & life sciences',
    tag: 'Data residency, consent, clinical safety',
    blurb:
      'The constraint is rarely capability, it is where the data may sit and who may see it. We deploy inside your boundary and design the approval step before anything else.',
    note: 'We do not build clinical decision support. Everything here is operational or administrative.',
    solutions: ['incident-intelligence', 'patch-orchestrator', 'support-desk', 'knowledge-gap', 'voice-triage', 'contract-review'],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & industrial',
    tag: 'Maintenance windows, legacy systems, uptime',
    blurb:
      'Estates full of systems older than the people running them, where a change lands in a four-hour window on a Sunday or it does not land at all. Sequencing matters more than speed.',
    note: 'Nothing we build touches OT or control systems. IT estate and back office only.',
    solutions: ['patch-orchestrator', 'change-copilot', 'incident-intelligence', 'agent-migration', 'invoice-recon', 'report-assembly'],
  },
  {
    id: 'retail',
    name: 'Retail & e-commerce',
    tag: 'Volume, seasonality, customer contact',
    blurb:
      'High volume and sharp peaks. The systems that matter are the ones that hold up on the worst day of the year, and the ones that stop a customer waiting overnight for an answer.',
    note: 'Peak-period behaviour is tested before launch, not assumed.',
    solutions: ['support-desk', 'voice-triage', 'lead-engine', 'marketing-studio', 'social-autopilot', 'content-refresh', 'metric-explainer'],
  },
  {
    id: 'professional',
    name: 'Professional services',
    tag: 'Billable time, proposals, contracts',
    blurb:
      'Capacity is people, so the return comes from taking low-value hours off senior staff — the proposal that starts from a blank page, the contract reread for the fourth time.',
    note: 'Anything client-facing keeps a named human owner on the output.',
    solutions: ['proposal-builder', 'pipeline-review', 'contract-review', 'lead-engine', 'report-assembly', 'knowledge-gap'],
  },
  {
    id: 'public',
    name: 'Public sector',
    tag: 'Procurement, transparency, accountability',
    blurb:
      'Decisions have to be explainable to someone who was not in the room, sometimes years later. That rules out a good deal of what is currently marketed as AI, and we will say so early.',
    note: 'Explainability and record-keeping are treated as requirements, not features.',
    solutions: ['incident-intelligence', 'change-copilot', 'support-desk', 'knowledge-gap', 'contract-review', 'invoice-recon'],
  },
]

export const getIndustry = (id) => industries.find((x) => x.id === id)
