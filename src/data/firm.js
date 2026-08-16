/* Firm-level content: how we engage, what we will not trade, who we are
   accredited by, and the roster. Lifted out of views/void/Home.jsx and
   views/void/Team.jsx so the same content can appear on /about, /industries
   and the home page without being written three times. */

export const engagementSteps = [
  ['Discover', 'A structured audit of the workflow, the data behind it, and what a win would measurably look like.'],
  ['Scope & propose', 'A fixed scope, timeline and estimate built from your requirement — not a rate card.'],
  ['Build & evaluate', 'Weekly increments, with evaluation gates before anything touches production.'],
  ['Hand over', 'Your code, your documentation, your trained team — with managed ops if you want it.'],
]

export const principles = [
  ['We say no', 'If AI does not help your case, we tell you in the discovery call rather than selling you a pilot that stalls.'],
  ['We evaluate first', 'Nothing reaches a production queue without being scored against your own historical cases.'],
  ['We hand over', 'Your code, your documentation, your trained team. Staying on is your option, not a dependency we engineer in.'],
]

/* Formal accreditation, and only that. The wider ecosystem we build against is
   described in prose on /about rather than implied by a logo wall. */
export const alliances = [
  ['Claude architects', 'Anthropic'],
  ['OpenAI practitioners', 'OpenAI'],
  ['Copilot Studio', 'Microsoft'],
  ['watsonx Orchestrate', 'IBM'],
]

export const voices = [
  [
    'Quotes that took our team two days now go out in twenty minutes. The PulpLabs team understood our pricing rules better than some of our own hires.',
    'Name Surname',
    'Director, Power & Pack Solutions',
  ],
  [
    'Our researchers stopped tagging transcripts and started interpreting them. The coding framework is still ours — the machine just keeps up with it now.',
    'Name Surname',
    'Principal, Urban Ethnographers',
  ],
]

/* Names are placeholders in data/team.js. Each entry carries the role, the
   discipline and a real description of the work, and the card says plainly that
   the name is pending. A fabricated roster is the one thing on this site that
   would actually mislead someone. */
export const roster = [
  {
    role: 'Founder & AI architect',
    disc: 'Architecture',
    b: 'Owns the shape of every engagement — what gets built, what gets refused, and where the evaluation gates sit.',
  },
  {
    role: 'Delivery lead',
    disc: 'Delivery',
    b: 'Runs the week-by-week increments and the handover. The person who tells you when a scope has moved.',
  },
  {
    role: 'ML engineer',
    disc: 'Modelling',
    b: 'Builds and scores the evaluation harnesses. Decides when a model is good enough to touch a live queue.',
  },
  {
    role: 'Platform engineer',
    disc: 'Infrastructure',
    b: 'Deploys inside your estate and wires into your ITSM and CMDB without opening a hole in your boundary.',
  },
  {
    role: 'Enablement instructor',
    disc: 'Enablement',
    b: 'Runs the briefings and bootcamps on your workflows. Certified across all four platforms.',
  },
  {
    role: 'Growth & partnerships',
    disc: 'Commercial',
    b: 'Scoping, discovery and the honest conversation about whether the thing you asked for is the thing you need.',
  },
]
