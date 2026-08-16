/* Lifted out of views/void/Services.jsx. The README's convention is that copy
   lives in src/data/ so a blurb can change without touching JSX; the void views
   had drifted from that, and a capabilities × industries matrix is not
   maintainable inline.

   `industries` cross-links each practice to the sectors in data/industries.js,
   which is what makes the two axes navigable in both directions. */

export const capabilities = [
  {
    id: 'advisory',
    n: '01',
    k: 'Advisory & strategy',
    t: 'Find out where AI pays back — and where it does not.',
    b: 'We map your workflows, the data behind them and the constraints around them before anyone writes code. You get a written view of what is worth automating, what is not, and what has to change first.',
    items: [
      ['AI readiness assessment', 'Where you actually are, not where a vendor says you are.'],
      ['Use-case discovery', 'Ranked by payback, not by novelty.'],
      ['Adoption roadmap', 'Sequenced so each phase funds the next.'],
      ['Governance & risk', 'The framework your auditors will ask for.'],
    ],
    industries: ['it-operations', 'manufacturing', 'research'],
  },
  {
    id: 'accelerators',
    n: '02',
    k: 'Enterprise accelerators',
    /* These four are named assets we bring into an engagement, not a product
       line you can buy off the page. The previous copy compared them to
       "multi-tenant SaaS", which framed the offer as software with a different
       hosting model. */
    t: 'Four systems we bring with us, then shape to your estate.',
    b: 'Production-tested starting points rather than a blank page, deployed inside your estate and integrated with the ITSM and CMDB you already run. Your data stays behind your boundary, including while we operate them.',
    items: [
      ['Incident Intelligence', 'Triage, correlation and suggested remediation on your live queue.'],
      ['Change Copilot', 'Risk scoring and change-record drafting against your CAB rules.'],
      ['Patch Orchestrator', 'Sequencing with rollback paths, around your maintenance windows.'],
      ['Agent Migration', 'RPA and legacy bots onto modern runtimes, audit trail intact.'],
    ],
    industries: ['it-operations'],
  },
  {
    id: 'small-business',
    n: '03',
    k: 'Small business systems',
    t: 'Live in about four weeks.',
    b: 'Growth and operations systems for small teams, tuned monthly. Every one keeps a human approval step you control — nothing sends or commits on your behalf unless you decide it should.',
    items: [
      ['Lead Engine', 'Enquiries answered and qualified around the clock.'],
      ['Support Desk', 'First-line resolution with escalation you define.'],
      ['Marketing Studio', 'Campaign drafting against your own positioning.'],
      ['Social Autopilot', 'Scheduled, on-brand, always reviewable.'],
    ],
    industries: ['small-business', 'manufacturing'],
  },
  {
    id: 'enablement',
    n: '04',
    k: 'Enablement & workshops',
    t: 'Capability transfer, not a training day.',
    b: 'Certified instructors across Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate. Every session runs on your workflows and your data. Each cohort leaves with something in production.',
    items: [
      ['Executive briefing', 'Half a day, for the people who approve the budget.'],
      ['Builder bootcamp', 'Two days, hands-on for the people who ship.'],
      ['Embedded enablement', 'Six weeks alongside your team, on live work.'],
    ],
    industries: ['it-operations', 'small-business'],
  },
  {
    id: 'managed',
    n: '05',
    k: 'Managed operations',
    t: 'We run what we build.',
    b: 'Monitoring, evaluation and tuning for as long as you want us. Handover is real — your code, your documentation, your trained team — and staying on is your option, not a dependency we engineer in.',
    items: [
      ['Monitoring & alerting', 'On the behaviour that matters, not just uptime.'],
      ['Evaluation harnesses', 'Re-scored as your estate changes.'],
      ['Model & prompt tuning', 'Regression-checked before it ships.'],
      ['Quarterly review', 'What it saved, in your numbers.'],
    ],
    industries: ['it-operations', 'manufacturing', 'research', 'small-business'],
  },
]

export function getCapability(id) {
  return capabilities.find((c) => c.id === id) ?? null
}
