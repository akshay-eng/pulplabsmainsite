import { coveredBy } from './functions'

/* The concrete things we ship, one level below the five practice areas.
 *
 * Each has its own page, so the copy here is the whole story: what it does,
 * what it plugs into, what you get, and what it will not do. That last field
 * is deliberate — a capability page that only lists strengths reads as a
 * brochure, and the limits are what a technical buyer is actually scanning
 * for. */

export const capabilities = [
  {
    slug: 'incident-intelligence',
    fn: 'it-operations',
    status: 'production',
    parent: 'accelerators',
    parentLabel: 'Enterprise accelerators',
    name: 'Incident Intelligence',
    tagline: 'Triage that opens with context, not a blank search box.',
    metric: ['MTTR', '−38%'],
    body:
      'Incident Intelligence reads your live queue, correlates a new incident against everything similar that has happened before, and hands the first responder a summary with the likely cause and the runbook attached. It does not close tickets and it does not act on infrastructure — it removes the twenty minutes of searching that happens before anyone starts fixing anything.',
    inputs: ['ServiceNow / Jira Service Management', 'Your CMDB', 'Historical incident records', 'Runbook library'],
    outputs: ['Correlated incident summary', 'Suggested remediation with sources', 'Confidence score per suggestion'],
    limits: 'It suggests; a human commits. Nothing is auto-resolved and nothing touches infrastructure directly.',
  },
  {
    slug: 'change-copilot',
    fn: 'it-operations',
    status: 'production',
    parent: 'accelerators',
    parentLabel: 'Enterprise accelerators',
    name: 'Change Copilot',
    tagline: 'Change records drafted against your own CAB rules.',
    metric: ['Review time', '−61%'],
    body:
      'Change Copilot drafts the change record — implementation plan, rollback plan, risk assessment and affected CIs — from the ticket and the CMDB, scored against the rules your CAB actually applies. Reviewers get something to correct rather than something to write.',
    inputs: ['Change request', 'CMDB relationships', 'Your CAB policy', 'Previous approved changes'],
    outputs: ['Drafted change record', 'Risk score with reasoning', 'Rollback plan', 'Affected-CI list'],
    limits: 'It never approves its own change. The CAB decision stays with the CAB.',
  },
  {
    slug: 'patch-orchestrator',
    fn: 'it-operations',
    status: 'production',
    parent: 'accelerators',
    parentLabel: 'Enterprise accelerators',
    name: 'Patch Orchestrator',
    tagline: 'Vendor advisories mapped to your real estate.',
    metric: ['Windows hit', '100%'],
    body:
      'Patch Orchestrator reads vendor advisories, works out which of them actually apply to the estate you have, and sequences the rollout around your maintenance windows and dependency order — with the rollback path defined before anything ships.',
    inputs: ['Vendor advisories', 'CMDB / asset inventory', 'Maintenance windows', 'Dependency graph'],
    outputs: ['Applicability assessment', 'Sequenced rollout plan', 'Rollback path per wave'],
    limits: 'It plans and sequences. Execution runs through your existing tooling and your existing approvals.',
  },
  {
    slug: 'agent-migration',
    fn: 'it-operations',
    status: 'production',
    parent: 'accelerators',
    parentLabel: 'Enterprise accelerators',
    name: 'Agent Migration',
    tagline: 'RPA onto modern runtimes with the audit trail intact.',
    metric: ['Audit breaks', '0'],
    body:
      'Legacy bots and RPA flows are auditable because they are deterministic. Swap in an agent naively and that property disappears. Agent Migration ports the flow, preserves the behaviour, and keeps the trail — logging inputs, plan and tool calls rather than just outcomes, with every irreversible action behind an approval.',
    inputs: ['Existing RPA flows', 'Audit requirements', 'Target runtime', 'Test cases from live history'],
    outputs: ['Ported flow', 'Behavioural parity report', 'Full decision trail', 'Approval gates on writes'],
    limits: 'If a flow cannot keep its audit properties after porting, we say so and leave it where it is.',
  },
  {
    slug: 'lead-engine',
    fn: 'sales',
    status: 'production',
    parent: 'small-business',
    parentLabel: 'Small business systems',
    name: 'Lead Engine',
    tagline: 'Enquiries answered and qualified around the clock.',
    metric: ['Response', '< 2 min'],
    body:
      'Enquiries arrive at all hours across the website, email and WhatsApp. Lead Engine answers immediately, asks the qualifying questions you would ask, and hands your team a brief instead of a name — so nothing goes quiet overnight waiting for someone to open the inbox.',
    inputs: ['Website form', 'Shared inbox', 'WhatsApp', 'Your qualifying criteria'],
    outputs: ['Immediate acknowledgement', 'Qualified brief', 'CRM record', 'Routing to the right person'],
    limits: 'It never quotes or commits on your behalf. Anything binding waits for a human.',
  },
  {
    slug: 'support-desk',
    fn: 'support',
    status: 'production',
    parent: 'small-business',
    parentLabel: 'Small business systems',
    name: 'Support Desk',
    tagline: 'First-line resolution, with escalation you define.',
    metric: ['Handled solo', '62%'],
    body:
      'Support Desk answers from your own documentation and past tickets, resolves what it can, and escalates on the rules you set rather than on a confidence threshold nobody can explain. Every answer carries its sources so a human can check the work.',
    inputs: ['Your documentation', 'Past ticket history', 'Escalation rules'],
    outputs: ['Answered tickets with sources', 'Escalations with context attached', 'Gaps in your documentation'],
    limits: 'Refunds, account changes and anything contractual escalate every time, regardless of confidence.',
  },
  {
    slug: 'marketing-studio',
    fn: 'marketing',
    status: 'production',
    parent: 'small-business',
    parentLabel: 'Small business systems',
    name: 'Marketing Studio',
    tagline: 'Campaign drafting against your own positioning.',
    metric: ['Draft time', '−70%'],
    body:
      'Marketing Studio drafts campaigns, landing copy and email sequences from your positioning and your past work — not from a generic template. Everything arrives as a draft for a human to edit, which is the only way it stays in your voice.',
    inputs: ['Your positioning', 'Past campaigns', 'Product and pricing facts', 'Brand voice'],
    outputs: ['Campaign drafts', 'Landing and email copy', 'Variants for testing'],
    limits: 'Nothing publishes itself. It writes; you approve.',
  },
  {
    slug: 'social-autopilot',
    fn: 'marketing',
    status: 'production',
    parent: 'small-business',
    parentLabel: 'Small business systems',
    name: 'Social Autopilot',
    tagline: 'Scheduled, on-brand, always reviewable.',
    metric: ['Review step', 'Always'],
    body:
      'Social Autopilot plans and drafts a schedule from what you have actually shipped, keeps it in your voice, and queues it for review. It is the least glamorous of these systems and the one that most reliably gets abandoned when it posts something nobody checked — so it never does.',
    inputs: ['Release notes and updates', 'Brand voice', 'Posting cadence'],
    outputs: ['Drafted schedule', 'Per-platform variants', 'Review queue'],
    limits: 'Every post waits in a queue for a human. There is no fully automatic mode.',
  },
]

/* Nine more, added so every function has something under it. These are shapes
 * we have built before rather than shrink-wrapped accelerators — each is
 * scoped and built against your systems, which is what `status: 'scope'`
 * means. That distinction is the difference between a catalogue and a
 * promise, so it must never be blurred to make a grid look fuller. */
export const buildToScope = [
  {
    slug: 'proposal-builder',
    fn: 'sales',
    status: 'scope',
    parent: 'small-business',
    parentLabel: 'Small business systems',
    name: 'Proposal Builder',
    tagline: 'Proposals that start from your last win, not a blank page.',
    metric: ['Draft time', '−64%'],
    body:
      'Proposal Builder drafts scope, timeline and commercials from the deals you have already won, your rate card and the clauses your legal team has already approved. It will not invent a price and it will not agree a term — it assembles the first version so the person who knows the client spends their time on the parts that are actually specific to them.',
    inputs: ['Won proposals and SOWs', 'Rate card', 'Approved contract clauses', 'CRM opportunity record'],
    outputs: ['Drafted scope, timeline and commercials', 'Margin check against policy', 'Source reference per section'],
    limits: 'It drafts from precedent. Pricing decisions, discounts and any non-standard term go to a human every time.',
  },
  {
    slug: 'pipeline-review',
    fn: 'sales',
    status: 'scope',
    parent: 'small-business',
    parentLabel: 'Small business systems',
    name: 'Pipeline Review',
    tagline: 'Which deals have gone quiet, and why.',
    metric: ['Stale deals caught', '3×'],
    body:
      'Pipeline Review reads activity rather than stage. A deal sitting in Proposal with no contact for three weeks and a champion who has changed jobs is a different risk from one that moved yesterday, and a stage field does not know the difference. It flags the ones worth a call and says what triggered the flag.',
    inputs: ['CRM opportunities and activity', 'Email and calendar metadata', 'Your own risk rules'],
    outputs: ['Ranked at-risk list', 'The specific signal behind each flag', 'Weekly digest for the pipeline review'],
    limits: 'It flags and explains. It does not contact anyone, change a stage, or forecast a number on your behalf.',
  },
  {
    slug: 'knowledge-gap',
    fn: 'support',
    status: 'scope',
    parent: 'small-business',
    parentLabel: 'Small business systems',
    name: 'Knowledge Gap Finder',
    tagline: 'The questions your documentation keeps failing.',
    metric: ['Deflection', '+18pts'],
    body:
      'Every support team has a handful of questions that get asked constantly and answered from memory. Knowledge Gap Finder mines your ticket history for exactly those, ranks them by volume and handling time, and drafts the article that would have deflected them — for a human to check and publish.',
    inputs: ['Ticket history', 'Existing documentation', 'Search logs where you have them'],
    outputs: ['Ranked list of undocumented questions', 'Drafted articles for review', 'Volume and handling-time evidence per gap'],
    limits: 'Nothing publishes itself. Drafts go into your normal review process like any other content.',
  },
  {
    slug: 'voice-triage',
    fn: 'support',
    status: 'scope',
    parent: 'small-business',
    parentLabel: 'Small business systems',
    name: 'Voice Triage',
    tagline: 'Calls summarised and routed before anyone picks up.',
    metric: ['Transfers', '−41%'],
    body:
      'Voice Triage transcribes the call, works out what the person actually wants, checks whether the account is verified, and routes it with a summary attached. The point is not to replace the agent — it is that the agent opens with context instead of asking the caller to repeat themselves for the third time.',
    inputs: ['Call audio or transcripts', 'Account records', 'Your routing rules'],
    outputs: ['Transcript and summary', 'Intent and sentiment', 'Routing with context attached'],
    limits: 'It does not hold the conversation. Anything transactional waits for a person, and recording consent is your policy to set.',
  },
  {
    slug: 'content-refresh',
    fn: 'marketing',
    status: 'scope',
    parent: 'small-business',
    parentLabel: 'Small business systems',
    name: 'Content Refresh',
    tagline: 'Finds what has gone stale before a customer does.',
    metric: ['Stale pages', '−72%'],
    body:
      'Content Refresh cross-references what you have published against what has actually changed — pricing, product, policy — and surfaces the pages that now say something untrue. It drafts the correction and points at the source that contradicts the current copy.',
    inputs: ['Published site and help content', 'Release notes and pricing changes', 'Traffic data'],
    outputs: ['Ranked stale-content list', 'The specific contradiction, cited', 'Drafted edits for review'],
    limits: 'It proposes edits. Nothing goes live without your normal approval.',
  },
  {
    slug: 'invoice-recon',
    fn: 'finance',
    status: 'scope',
    parent: 'accelerators',
    parentLabel: 'Enterprise accelerators',
    name: 'Invoice Reconciliation',
    tagline: 'Matching at volume, exceptions to a human.',
    metric: ['Auto-matched', '94%'],
    body:
      'Invoice Reconciliation matches invoices to purchase orders and receipts, handles the ordinary cases silently, and puts everything else in front of a person with the variance already worked out. The value is not the 94% it clears — it is that the 6% arrives explained.',
    inputs: ['Invoices', 'Purchase orders and receipts', 'Your tolerance thresholds', 'ERP or accounting system'],
    outputs: ['Matched and posted routine items', 'Exception queue with the variance quantified', 'Full audit trail per decision'],
    limits: 'Nothing is paid automatically. Approval to release funds stays entirely with your finance team.',
  },
  {
    slug: 'contract-review',
    fn: 'finance',
    status: 'scope',
    parent: 'accelerators',
    parentLabel: 'Enterprise accelerators',
    name: 'Contract Review',
    tagline: 'Obligations and dates, extracted and tracked.',
    metric: ['Missed renewals', '0'],
    body:
      'Contract Review reads the agreements you already hold and pulls out what you are committed to — notice periods, auto-renewal dates, liability caps, data-residency terms — each with a clause reference so a lawyer can check the work in seconds rather than rereading the document.',
    inputs: ['Executed contracts', 'Your clause taxonomy', 'Renewal calendar'],
    outputs: ['Extracted obligations with clause references', 'Renewal and notice-date calendar', 'Deviation flags against your standard terms'],
    limits: 'It is not legal advice and it does not approve anything. Extraction supports your counsel; it does not replace them.',
  },
  {
    slug: 'report-assembly',
    fn: 'data',
    status: 'scope',
    parent: 'accelerators',
    parentLabel: 'Enterprise accelerators',
    name: 'Report Assembly',
    tagline: 'The monthly pack, drafted before you open it.',
    metric: ['Prep time', '−78%'],
    body:
      'Report Assembly builds the recurring pack from your warehouse on schedule — the same figures, the same layout, with the commentary drafted from what actually changed. An analyst still owns it; they start from a draft with the numbers already tied out instead of rebuilding it from scratch every month.',
    inputs: ['Data warehouse tables', 'Last period’s pack', 'Targets and budget', 'Your report template'],
    outputs: ['Assembled draft on schedule', 'Commentary tied to specific movements', 'Reconciliation against source'],
    limits: 'It never circulates a pack. A named owner reviews and releases every edition.',
  },
  {
    slug: 'metric-explainer',
    fn: 'data',
    status: 'scope',
    parent: 'accelerators',
    parentLabel: 'Enterprise accelerators',
    name: 'Metric Explainer',
    tagline: 'Why the number moved, decomposed.',
    metric: ['Time to answer', '< 5 min'],
    body:
      'Someone asks why revenue is down and an analyst loses an afternoon. Metric Explainer decomposes the movement into its contributing parts — mix, timing, one-offs, genuine growth — and shows the arithmetic, so the answer can be checked rather than believed.',
    inputs: ['Warehouse metric definitions', 'Dimensional breakdowns', 'Known one-off events'],
    outputs: ['Decomposition of the movement', 'The arithmetic, shown', 'Residual it cannot explain, stated plainly'],
    limits: 'It decomposes what the data supports and names the unexplained remainder rather than inventing a story for it.',
  },
]

/* One list for the routes and lookups; the split above is only for authoring. */
export const allSolutions = [...capabilities, ...buildToScope]

/* Accepts a category id from data/functions.js or one of the finer-grained
 * `fn` values still carried on each solution. Production accelerators sort
 * first: a category whose built systems are buried under scoped ones reads as
 * a wish list. */
export const byFunction = (fn) => {
  const ids = coveredBy(fn)
  return allSolutions
    .filter((c) => ids.includes(c.fn))
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'production' ? -1 : 1))
}
export const getSolution = (slug) => allSolutions.find((c) => c.slug === slug)

export const byParent = (parent) => capabilities.filter((c) => c.parent === parent)
export const getCapability = (slug) => allSolutions.find((c) => c.slug === slug)
