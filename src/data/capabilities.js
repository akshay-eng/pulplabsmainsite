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

export const byParent = (parent) => capabilities.filter((c) => c.parent === parent)
export const getCapability = (slug) => capabilities.find((c) => c.slug === slug)
