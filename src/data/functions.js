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
      'Where our accelerators are strongest, because it is where we have run the most. All four are deployed inside your estate against the ITSM and CMDB you already run, so your data never leaves your boundary for us to operate them.',
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
      'Capacity is people, so the return comes from taking low-value hours off senior staff: the proposal that starts from a blank page, the contract reread for the fourth time.',
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
