/* The second navigation axis: who we serve, alongside what we do.
   A services firm navigates on capabilities × industries — that pairing is the
   clearest structural difference between a consultancy and a vendor.

   Four sectors, not fourteen. Every one here is somewhere PulpLabs has actually
   worked, and two carry a named client. Listing a grid of verticals a six-person
   firm has never touched is the fastest way to read as a brochure.

   `proof: null` is deliberate and load-bearing — the industry page renders an
   honest "no published work yet" line rather than a fabricated metric. See
   PRODUCT.md for the honesty constraints these follow. */

export const industries = [
  {
    slug: 'it-operations',
    name: 'IT operations',
    kicker: 'Enterprise IT & service management',
    title: 'The queue does not get shorter on its own.',
    lede:
      'Incident, change and patch work scales with the estate, not with headcount. We build inside your ITSM and CMDB so what we deploy sees the same data your team does, and stays behind your boundary.',
    pressures: [
      ['Triage eats the first hour', 'A responder opens a ticket with no context and rebuilds the picture by hand, on every incident, every time.'],
      ['Change risk is judged from memory', 'CAB decisions lean on who remembers the last failure rather than on what the change record actually shows.'],
      ['Advisories outrun the estate map', 'Vendor patches arrive faster than anyone can work out which of your systems they touch, and which window they fit.'],
    ],
    work: [
      ['Incident Intelligence', 'Triage, correlation and suggested remediation against your live queue.'],
      ['Change Copilot', 'Risk scoring and change-record drafting against your own CAB rules.'],
      ['Patch Orchestrator', 'Sequencing with rollback paths, planned around your maintenance windows.'],
      ['Agent Migration', 'RPA and legacy bots onto modern runtimes with the audit trail intact.'],
    ],
    capabilities: ['accelerators', 'managed', 'advisory'],
    proof: null,
  },

  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    kicker: 'Manufacturing & industrial',
    title: 'Quoting is where the week goes.',
    lede:
      'Configured products, pricing rules that live in one person’s head, and enquiries that arrive after everyone has gone home. The bottleneck is rarely the factory.',
    pressures: [
      ['Quotes need the one person who knows', 'Pricing rules are real but undocumented, so every enquiry queues behind the same colleague.'],
      ['Enquiries die overnight', 'Questions that arrive out of hours wait until morning. A share of them do not wait at all.'],
      ['The catalogue is a system, the rules are not', 'Product data is structured. How to apply it to a specific job is institutional knowledge.'],
    ],
    work: [
      ['Quoting assistant', 'Your catalogue and pricing rules, applied consistently and shown with its working.'],
      ['Always-on enquiry handling', 'First-line answers on the website and WhatsApp, escalating to a human on anything unusual.'],
      ['Rules capture', 'The discovery phase writes down the pricing logic, which is worth having whatever gets built.'],
    ],
    capabilities: ['small-business', 'advisory', 'managed'],
    proof: {
      client: 'Power & Pack Solutions',
      outcomes: [
        ['4×', 'faster quote turnaround'],
        ['62%', 'enquiries handled without a person'],
        ['9 hrs', 'returned per week'],
      ],
    },
  },

  {
    slug: 'research',
    name: 'Research & insight',
    kicker: 'Qualitative research',
    title: 'Coding transcripts is not research.',
    lede:
      'Qualitative teams spend their most expensive hours tagging rather than interpreting. The framework they tag against is the actual asset, and it should stay theirs.',
    pressures: [
      ['Coding scales with fieldwork', 'Twice the interviews means twice the tagging, and consistency depends entirely on the framework.'],
      ['Off-the-shelf tools impose a taxonomy', 'Which replaces the one part of the method the team should own outright.'],
      ['Insight arrives after the decision', 'By the time themes are clustered and written up, the question has often already been answered.'],
    ],
    work: [
      ['Transcription and coding', 'Against the team’s own framework, not a vendor’s categories.'],
      ['Theme clustering', 'Grouped and evidenced back to the source passage, so a researcher can check the reasoning.'],
      ['Draft synthesis', 'A starting document for interpretation, never a finished conclusion.'],
    ],
    capabilities: ['advisory', 'managed'],
    proof: {
      client: 'Urban Ethnographers',
      outcomes: [
        ['70%', 'less manual coding'],
        ['3×', 'interviews per study'],
        ['1 day', 'to a draft insight deck'],
      ],
    },
  },

  {
    slug: 'small-business',
    name: 'Small business',
    kicker: 'Owner-operated & small teams',
    title: 'Live in about four weeks.',
    lede:
      'Growth and operations systems for teams without an IT department. Every one keeps a human approval step you control: nothing sends or commits on your behalf unless you decide it should.',
    pressures: [
      ['Enquiries arrive out of hours', 'And the response time you can offer is the one you can staff.'],
      ['Marketing is whoever has time', 'So it happens in bursts, and stops entirely in a busy month.'],
      ['Nobody owns the follow-up', 'Leads are not lost at the top of the funnel so much as quietly dropped halfway down.'],
    ],
    work: [
      ['Lead Engine', 'Enquiries answered and qualified around the clock.'],
      ['Support Desk', 'First-line resolution with an escalation path you define.'],
      ['Marketing Studio', 'Campaign drafting against your own positioning.'],
      ['Social Autopilot', 'Scheduled and on-brand, always reviewable before it goes out.'],
    ],
    capabilities: ['small-business', 'enablement', 'managed'],
    proof: null,
  },
]

export function getIndustry(slug) {
  return industries.find((i) => i.slug === slug) ?? null
}
