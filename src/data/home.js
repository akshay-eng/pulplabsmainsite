import {
  IconAdvisory,
  IconAccelerators,
  IconSmallBusiness,
  IconEnablement,
  IconManagedOps,
} from '../components/icons'

export const practiceAreas = [
  {
    icon: IconAdvisory,
    title: 'Advisory & strategy',
    blurb: 'Readiness audits, use-case discovery, roadmap & governance.',
    accent: '#FF6B1A',
    shadow: 'rgba(255,107,26,.12)',
  },
  {
    icon: IconAccelerators,
    title: 'Enterprise accelerators',
    blurb: 'Incident, change, patch & agent-migration for IT ops.',
    accent: '#F0384B',
    shadow: 'rgba(240,56,75,.14)',
  },
  {
    icon: IconSmallBusiness,
    title: 'Small business solutions',
    blurb: 'Leads, support, marketing & social — live in ~4 weeks.',
    accent: '#FFC93C',
    shadow: 'rgba(255,201,60,.3)',
  },
  {
    icon: IconEnablement,
    title: 'Enablement & workshops',
    blurb: 'Certified instructors, your workflows, your data.',
    accent: '#FF5C93',
    shadow: 'rgba(255,92,147,.18)',
  },
  {
    icon: IconManagedOps,
    title: 'Managed AI operations',
    blurb: 'Monitoring, evals & tuning for as long as you want us.',
    accent: '#7BC043',
    shadow: 'rgba(123,192,67,.25)',
  },
]

/* A process, not four unrelated cards. The old shape carried a different
   pastel background per step (peach / pink / lemon / mint), which read as a
   crayon box; colour is now carried by the rail alone. */
export const engagementSteps = [
  {
    n: 1,
    when: 'Week 0–1',
    title: 'Discover',
    body: 'A structured audit of the workflow, the data behind it, and what a win would measurably look like.',
  },
  {
    n: 2,
    when: 'Week 1–2',
    title: 'Scope & propose',
    body: 'A fixed scope, timeline and estimate built from your requirement — not a rate card.',
  },
  {
    n: 3,
    when: 'Week 2–8',
    title: 'Build & evaluate',
    body: 'Weekly increments, with evaluation gates before anything touches production.',
  },
  {
    n: 4,
    when: 'Ongoing',
    title: 'Hand over',
    body: 'Your code, your documentation, your trained team — with managed ops if you want it.',
  },
]

export const testimonials = [
  {
    quote:
      'Quotes that took our team two days now go out in twenty minutes. The PulpLabs team understood our pricing rules better than some of our own hires.',
    name: 'Name Surname',
    role: 'Director, Power & Pack Solutions',
    accent: '#F0384B',
    wash: '#FFE1E4',
    shadow: 'rgba(240,56,75,.14)',
  },
  {
    quote:
      'Our researchers stopped tagging transcripts and started interpreting them. The coding framework is still ours — the machine just keeps up with it now.',
    name: 'Name Surname',
    role: 'Principal, Urban Ethnographers',
    accent: '#FF5C93',
    avatarInk: '#E0447E',
    wash: '#FFE4EE',
    shadow: 'rgba(255,92,147,.18)',
  },
]

export const enablementFormats = [
  {
    duration: 'HALF DAY',
    name: 'Executive briefing',
    blurb: 'What to fund, what to defer, and what it realistically costs.',
    disc: '#FFEBD9',
    fill: '#FF6B1A',
    fraction: 'quarter',
    durationColor: '#A2540F',
    shadow: 'rgba(255,107,26,.16)',
  },
  {
    duration: '2 DAYS',
    name: 'Builder bootcamp',
    blurb: 'Prompting, tools, agents, evals. Hands on keyboards.',
    disc: '#FFE1E4',
    fill: '#F0384B',
    fraction: 'half',
    durationColor: '#C42B3D',
    shadow: 'rgba(240,56,75,.16)',
  },
  {
    duration: '6 WEEKS',
    name: 'Embedded enablement',
    blurb: 'We sit with your team until two workflows are in production.',
    disc: '#EAF6DC',
    fill: '#7BC043',
    full: true,
    durationColor: '#4F8A1D',
    shadow: 'rgba(123,192,67,.3)',
  },
]

export const platforms = [
  { label: 'Certified Claude architects', border: 'rgba(255,107,26,.3)' },
  { label: 'OpenAI', border: 'rgba(240,56,75,.3)' },
  { label: 'Copilot Studio', border: 'rgba(201,147,10,.4)' },
  { label: 'IBM watsonx Orchestrate', border: 'rgba(123,192,67,.45)' },
]
