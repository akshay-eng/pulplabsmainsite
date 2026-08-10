import {
  IconAdvisory,
  IconAccelerators,
  IconSmallBusiness,
  IconEnablement,
  IconManagedOps,
  IconIncident,
  IconChange,
  IconPatch,
  IconMigration,
} from '../components/icons'

const TAG_TANGERINE = { background: '#FFF0DF', borderColor: '#FFD9B0', color: '#8A5A2B' }
const TAG_WATERMELON = { background: '#FFE1E4', borderColor: '#FFC2C8', color: '#A82233' }
const TAG_LEMON = { background: '#FFF6D6', borderColor: '#F2DD9B', color: '#8A6D00' }
const TAG_STRAWBERRY = { background: '#FFE9F2', borderColor: '#FFC7DD', color: '#B02A5F' }
const TAG_KIWI = { background: '#EFF8E3', borderColor: '#CDE8A9', color: '#4F7A1D' }

export const catalogue = [
  {
    code: 'C.01',
    icon: IconAdvisory,
    title: 'Advisory & strategy',
    body: "Where AI pays back in your organisation — and where it doesn't. We map your workflows, data and constraints before anyone writes code.",
    tags: ['AI readiness assessment', 'Use-case discovery', 'Adoption roadmap', 'Governance & risk framework'],
    tagStyle: TAG_TANGERINE,
    codeColor: '#D9520F',
    blob: '#FFEBD9',
    shadow: 'rgba(255,107,26,.12)',
  },
  {
    code: 'C.02',
    icon: IconAccelerators,
    title: 'Enterprise accelerators',
    body: 'Pre-built, production-tested accelerators for IT operations — deployed inside your estate and integrated with your ITSM and CMDB.',
    tags: ['Incident Intelligence', 'Change Copilot', 'Patch Orchestrator', 'Agent Migration'],
    tagStyle: TAG_WATERMELON,
    codeColor: '#C42B3D',
    blob: '#FFE1E4',
    shadow: 'rgba(240,56,75,.14)',
  },
  {
    code: 'C.03',
    icon: IconSmallBusiness,
    title: 'Small business solutions',
    body: 'Growth and operations systems for small teams — live in about four weeks, tuned monthly, and always with a human approval step you keep.',
    tags: ['Lead Engine', 'Support Desk', 'Marketing Studio', 'Social Autopilot'],
    tagStyle: TAG_LEMON,
    codeColor: '#A87B00',
    blob: '#FFF3C4',
    shadow: 'rgba(255,201,60,.3)',
  },
  {
    code: 'C.04',
    icon: IconEnablement,
    title: 'Enablement & workshops',
    body: 'Certified instructors across Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate — running programmes on your workflows and your data.',
    tags: ['Executive briefing · half day', 'Builder bootcamp · 2 days', 'Embedded enablement · 6 weeks'],
    tagStyle: TAG_STRAWBERRY,
    codeColor: '#D63A75',
    blob: '#FFE4EE',
    shadow: 'rgba(255,92,147,.18)',
  },
  {
    code: 'C.05',
    icon: IconManagedOps,
    title: 'Managed AI operations',
    body: 'After handover, we can keep running what we built: monitoring, evaluation, drift detection and monthly tuning against your live data.',
    tags: ['Monitoring & alerting', 'Evaluation & drift reports', 'Monthly tuning', 'Model & cost optimisation'],
    tagStyle: TAG_KIWI,
    codeColor: '#4F8A1D',
    blob: '#EAF6DC',
    shadow: 'rgba(123,192,67,.25)',
  },
]

export const accelerators = [
  {
    icon: IconIncident,
    title: 'Incident Intelligence',
    body: 'Triages, correlates and summarises incidents the moment they open — and drafts the RCA before the bridge call fills up.',
  },
  {
    icon: IconChange,
    title: 'Change Copilot',
    body: 'Risk-scores every change request against past failures, then writes the implementation, test and rollback plan for review.',
  },
  {
    icon: IconPatch,
    title: 'Patch Orchestrator',
    body: 'Reads vendor advisories, maps them to your real estate, and sequences the rollout around your maintenance windows.',
  },
  {
    icon: IconMigration,
    title: 'Agent Migration',
    body: 'Moves legacy bots, RPA flows and first-generation agents onto modern LLM runtimes — behaviour preserved, cost reduced.',
  },
]

export const caseStudies = [
  {
    client: 'Power & Pack Solutions · manufacturing',
    title: 'Quotes in minutes, not days',
    body: 'We connected their product catalogue and pricing rules to an AI quoting assistant, and put a support agent on WhatsApp and the website so enquiries stop dying overnight.',
    metrics: [
      { figure: '4×', caption: 'faster quote turnaround' },
      { figure: '62%', caption: 'enquiries handled solo' },
      { figure: '9 hrs', caption: 'returned per week' },
    ],
    accent: '#FF6B1A',
    artBg: '#FFF3E4',
    artDots: 'rgba(255,107,26,.22)',
    artBlob: '#FFE3C6',
    artBlobPos: { right: -30, bottom: -46, width: 170, height: 170 },
    caption: '[ photo: packaging line ]',
    captionColor: '#B07A45',
    kickerColor: '#A2540F',
  },
  {
    client: 'Urban Ethnographers · research',
    title: 'From transcripts to themes overnight',
    body: "Field recordings now transcribe, code and cluster themselves against the team's own framework — researchers spend their time on interpretation instead of tagging.",
    metrics: [
      { figure: '70%', caption: 'less manual coding' },
      { figure: '3×', caption: 'interviews per study' },
      { figure: '1 day', caption: 'to a draft insight deck' },
    ],
    accent: '#F0384B',
    artBg: '#FFE1E4',
    artDots: 'rgba(240,56,75,.2)',
    artBlob: '#FFD3D8',
    artBlobPos: { left: -34, top: -40, width: 150, height: 150 },
    caption: '[ photo: field research ]',
    captionColor: '#A82233',
    kickerColor: '#C42B3D',
  },
]
