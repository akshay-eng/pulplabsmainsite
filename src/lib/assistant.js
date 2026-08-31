/* ==========================================================================
   PulpLabs assistant — knowledge, intent routing and the booking flow.

   Answers come from the model behind /api/assistant. This file keeps a local
   intent matcher too, used for two things:

     1. Fallback. If the model is unreachable, out of credits or rate limited,
        the dock answers from the site's own content instead of erroring.
     2. The booking flow, which stays deterministic on purpose — collecting a
        name and email is not a job for a language model.

   The API key is read only in src/lib/llm.js, which is server-only. Nothing in
   this file ever sees it.

   These answers are written by hand and so they can drift from the catalogue,
   which is exactly what happened once already. Keep them broad: the specifics
   belong in src/lib/knowledge.js, which is generated from src/data and cannot
   go stale. If you add a solution, you do not need to touch this file.
   ========================================================================== */

export const BOOKING_EMAIL = 'hello@pulplabs.ai'

/* --------------------------------------------------------------------------
   Knowledge entries. `patterns` are matched as whole words where short, so
   "ai" doesn't fire on "said" and "ops" doesn't fire on "options".
   -------------------------------------------------------------------------- */
const KNOWLEDGE = [
  {
    id: 'services',
    patterns: ['service', 'services', 'offer', 'offering', 'what do you do', 'practice', 'capabilities', 'help with'],
    answer:
      'We work across four practice areas:\n\n' +
      '**Systems we build**: accelerators for IT operations and growth systems for smaller teams. Same practice, sized to the estate, and deployed inside your boundary rather than as hosted SaaS.\n' +
      '**Advisory & strategy**: four weeks, four artefacts, one answer on where AI pays back and where it does not.\n' +
      '**Enablement & workshops**: certified instruction on your own workflows and data, in three fixed lengths plus custom.\n' +
      '**Managed operations**: we run what we build, monitoring behaviour rather than uptime.',
    chips: ['What products do you have?', 'How does an engagement start?', 'Book a call'],
    action: { type: 'navigate', to: '/services', label: 'See the catalogue' },
  },
  {
    id: 'products',
    patterns: ['product', 'products', 'evals', 'eval', 'devops copilot', 'observability', 'monitoring platform', 'flagship'],
    answer:
      'Two products carry our name:\n\n' +
      '**Evals**: agent and model observability judged on behaviour rather than uptime. It tracks answer quality against a held-out set, refusal and escalation rates, retrieval hit rate, latency and cost, and gates prompt or model changes in CI. It reports; it will not tune or roll back on its own.\n' +
      '**DevOps Copilot**: pipeline and release work, wired into the toolchain you already run.\n\n' +
      'Each has its own page under Services.',
    chips: ['Tell me about accelerators', 'Book a technical call'],
    action: { type: 'navigate', to: '/services/evals', label: 'Open Evals' },
  },
  {
    id: 'accelerators',
    patterns: ['accelerator', 'accelerators', 'incident', 'change copilot', 'patch', 'migration', 'itsm', 'cmdb', 'it operations', 'itops'],
    answer:
      'The IT operations accelerators run inside your estate rather than as hosted SaaS:\n\n' +
      '**Incident Intelligence**: triage, correlation and suggested remediation on your live queue.\n' +
      '**Change Copilot**: risk scoring and change-record drafting against your CAB rules.\n' +
      '**Patch Orchestrator**: patch sequencing with rollback paths.\n' +
      '**Agent Migration**: moving RPA flows to agents without breaking your audit trail.\n\n' +
      'Each reads your data where it already lives, through the ITSM and CMDB you own.',
    chips: ['What products do you have?', 'Book a technical call'],
    action: { type: 'navigate', to: '/services/for/it-operations', label: 'IT operations solutions' },
  },
  {
    id: 'catalogue',
    patterns: ['catalogue', 'catalog', 'browse', 'full list', 'all solutions', 'use case', 'use cases',
      'industry', 'industries', 'sector', 'function', 'department',
      'bank', 'banking', 'financial services', 'insurance', 'hospital', 'hospitals', 'healthcare', 'clinical',
      'manufacturing', 'factory', 'retail', 'ecommerce', 'e-commerce', 'public sector', 'government',
      'professional services', 'law firm', 'work with'],
    answer:
      'The catalogue runs to nineteen solutions and you can come at it from either direction.\n\n' +
      'By **function**: IT operations, sales, customer support, marketing, finance and back office, data and reporting.\n' +
      'By **industry**: financial services, healthcare and life sciences, manufacturing, retail, professional services and public sector. Read those as where the work lands rather than as claimed domain expertise. The solutions underneath are the same ones; what changes is the constraint around them.\n\n' +
      'Each solution has its own page with what it takes in, what it puts out, and what it will not do.',
    chips: ['What products do you have?', 'Book a call'],
    action: { type: 'navigate', to: '/services', label: 'Browse the catalogue' },
  },
  {
    id: 'smallbiz',
    patterns: ['small business', 'small team', 'startup', 'smb', 'lead engine', 'support desk', 'marketing studio', 'social autopilot'],
    answer:
      'For smaller teams the same practice comes sized down: **Lead Engine**, **Support Desk**, **Marketing Studio**, **Social Autopilot** and a handful of others across finance, data and support.\n\n' +
      'Typical shape is live in about four weeks, tuned monthly, and every one of them keeps a human approval step you control. ' +
      'Nothing sends or commits on your behalf unless you decide it should.',
    chips: ['What does that cost?', 'Book a call'],
  },
  {
    id: 'enablement',
    patterns: ['workshop', 'workshops', 'training', 'enablement', 'bootcamp', 'briefing', 'teach', 'upskill', 'course', 'curriculum'],
    answer:
      'Three fixed lengths, all run on your workflows and your data rather than generic exercises:\n\n' +
      '**One day** (6 hours): an executive briefing for the people who approve the budget, ending with one working artefact.\n' +
      '**Three days** (3 × 6 hours): hands-on for the people who ship. Agents, tools and evaluation.\n' +
      '**One week** (5 × 6 hours): embedded alongside your team, taking one workflow into production.\n\n' +
      'Platforms: **Claude**, **Codex & ChatGPT**, **Copilot**, **Gemini** and **watsonx Orchestrate**. On-site, online or hybrid. ' +
      'A custom cohort is there for mixed platforms, a regulated estate, or roles that need separate tracks.',
    chips: ['See platforms and curricula', 'Book an enablement call'],
    action: { type: 'navigate', to: '/services/enablement', label: 'See platforms and curricula' },
  },
  {
    id: 'process',
    patterns: ['process', 'engagement', 'how do you work', 'get started', 'start', 'steps', 'timeline', 'how long'],
    answer:
      'Four steps:\n\n' +
      '**1 · Discover**: your workflows, data and constraints.\n' +
      '**2 · Scope & propose**: a written scope with success criteria before any build.\n' +
      '**3 · Build & evaluate**: we run task-level evals before anything touches a production queue.\n' +
      '**4 · Hand over**: documentation, training and the option for us to keep running it.\n\n' +
      'The evaluation step is the one people skip. It\'s the reason incident bots ship confident and wrong.',
    chips: ['Book a scoping call', 'What do you charge?'],
  },
  {
    id: 'team',
    patterns: ['team', 'who are you', 'people', 'founder', 'staff', 'certified', 'certification', 'credentials'],
    answer:
      'A small team of AI architects, delivery leads and ML engineers, formally accredited on: ' +
      '**Claude**, **OpenAI**, **Copilot Studio** and **IBM watsonx Orchestrate**, and hands-on with **Gemini**.\n\n' +
      'You can see the full roster on the Team page.',
    chips: ['See the team', 'Are you hiring?'],
    action: { type: 'navigate', to: '/team', label: 'See the team' },
  },
  {
    id: 'careers',
    patterns: ['career', 'careers', 'hiring', 'hire', 'job', 'jobs', 'vacancy', 'vacancies', 'internship', 'intern', 'apply', 'application', 'work for you', 'join', 'recruit'],
    answer:
      'We are taking interns. The open role is an **Application Development Intern**: six months, Bengaluru or remote within India, building with React Native, React, Node and SQL.\n\n' +
      'It is not a shadowing role. You pick up tickets from the same board as everyone else, your pull requests go through the same review, and what you build gets deployed, so we do expect you hands-on from week one.\n\n' +
      'Applying takes a name, a phone number and a CV on the role page. I cannot submit it for you.',
    chips: ['Open the role', 'Tell me about the team'],
    action: { type: 'navigate', to: '/careers', label: 'Open the role' },
  },
  {
    id: 'pricing',
    patterns: [
      'price',
      'pricing',
      'cost',
      'costs',
      'budget',
      'quote',
      'rate',
      'rates',
      'how much',
      'expensive',
      'charge',
      'charges',
      'fee',
      'fees',
      'ballpark',
      'estimate',
      'afford',
      'invoice',
      'retainer',
    ],
    answer:
      'Pricing isn\'t published, because it depends on scope, estate size and whether you want us to run the system afterwards.\n\n' +
      'What I can tell you: engagements start with a **paid discovery** so you get a written scope with success criteria before committing to a build. ' +
      'A small business system and an enterprise accelerator are priced very differently.\n\n' +
      'The fastest way to a real number is a 30-minute scoping call.',
    chips: ['Book a scoping call', 'How does an engagement start?'],
  },
  {
    id: 'results',
    patterns: ['result', 'results', 'roi', 'case study', 'case studies', 'proof', 'evidence', 'outcome', 'reference'],
    answer:
      'There are written case studies on the site from engagements the clients have signed off, and each solution page sets out what that system takes in and what it hands back.\n\n' +
      'For numbers from an engagement close to yours, a call is honestly the better route. We would rather talk through a comparable piece of work than quote an average that means nothing for your estate.',
    chips: ['See case studies', 'Book a call'],
    action: { type: 'navigate', to: '/services', label: 'See case studies' },
  },
  {
    id: 'security',
    patterns: ['security', 'secure', 'data', 'privacy', 'compliance', 'gdpr', 'audit', 'governance', 'risk', 'on-prem', 'onprem', 'residency'],
    answer:
      'Systems are deployed **inside your estate**, not as a multi-tenant SaaS, so your data does not leave your boundary for us to operate them.\n\n' +
      'Advisory engagements include a governance and risk framework written for your risk function, every irreversible action waits for a named human, ' +
      'and the Agent Migration accelerator exists specifically to move RPA flows to agents without breaking your audit trail.\n\n' +
      'For a specific compliance regime, a call with an architect is the right next step.',
    chips: ['Book a technical call', 'Tell me about accelerators'],
  },
  {
    id: 'blog',
    patterns: ['blog', 'article', 'writing', 'post', 'posts', 'read', 'newsletter', 'open source'],
    answer:
      'The blog covers engineering field notes and playbooks. Recent pieces include why incident bots keep guessing and how evals fix it, ' +
      'and migrating RPA flows to agents without breaking audit.',
    chips: ['Read the blog', 'Book a call'],
    action: { type: 'navigate', to: '/blog', label: 'Read the blog' },
  },
  {
    id: 'contact',
    patterns: ['contact', 'email', 'reach', 'phone', 'get in touch', 'talk to', 'speak to', 'human'],
    answer: `You can reach the team at **${BOOKING_EMAIL}**, use the contact form, or I can take your details right here.`,
    chips: ['Book a call', 'Open contact form'],
    action: { type: 'navigate', to: '/contact', label: 'Open contact form' },
  },
]

const GREETINGS = ['hi', 'hey', 'hello', 'yo', 'howdy', 'good morning', 'good afternoon', 'good evening', 'sup']

/* --------------------------------------------------------------------------
   Matching
   -------------------------------------------------------------------------- */

const normalise = (s) => s.toLowerCase().replace(/[^\w\s'’-]/g, ' ').replace(/\s+/g, ' ').trim()

/** Longer patterns score higher, so "small business" beats a bare "business". */
function scoreEntry(entry, text) {
  let score = 0
  for (const pattern of entry.patterns) {
    if (pattern.includes(' ')) {
      if (text.includes(pattern)) score += pattern.length * 2
    } else {
      // Whole-word only — stops "ai" matching "said", "ops" matching "options".
      if (new RegExp(`\\b${pattern}\\b`).test(text)) score += pattern.length
    }
  }
  return score
}

export function matchIntent(input) {
  const text = normalise(input)
  if (!text) return null

  if (GREETINGS.some((g) => text === g || text.startsWith(`${g} `))) {
    return {
      id: 'greeting',
      answer:
        'Hello. I can answer questions about what PulpLabs does: services, accelerators, our process and security posture. I can also take your details for a call.\n\nWhat would be most useful?',
      chips: ['What services do you offer?', 'How does an engagement start?', 'Book a call'],
    }
  }

  const ranked = KNOWLEDGE.map((entry) => ({ entry, score: scoreEntry(entry, text) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  return ranked.length ? ranked[0].entry : null
}

const FALLBACK = {
  id: 'fallback',
  answer:
    "I don't have a confident answer to that one. I only answer from what's published on this site, and I'd rather say so than guess.\n\n" +
    `A person can give you a proper answer: **${BOOKING_EMAIL}**, or I can take your details for a call.`,
  chips: ['What services do you offer?', 'Book a call'],
}

/* --------------------------------------------------------------------------
   Booking flow — a small state machine.
   `step` advances name → email → topic → done.
   -------------------------------------------------------------------------- */

export const BOOKING_STEPS = ['name', 'email', 'topic']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isBookingIntent(input) {
  const text = normalise(input)
  return /\b(book|schedule|call|meeting|consult|consultation|demo|talk|appointment|calendar)\b/.test(text)
}

export function bookingPrompt(step) {
  switch (step) {
    case 'name':
      return { reply: "Happy to set that up. What's your name?", label: 'Your name' }
    case 'email':
      return { reply: 'Thanks. What email should we use?', label: 'Email address' }
    case 'topic':
      return { reply: 'And roughly what would you like to cover?', label: 'What to cover' }
    default:
      return { reply: '', label: '' }
  }
}

export function validateBookingField(step, value) {
  const v = value.trim()
  if (step === 'name') {
    if (v.length < 2) return 'Could you give me a name with at least two characters?'
    return null
  }
  if (step === 'email') {
    if (!EMAIL_RE.test(v)) return "That doesn't look like a complete email address. Could you check it?"
    return null
  }
  if (step === 'topic') {
    if (v.length < 3) return 'A few more words would help us route it to the right person.'
    return null
  }
  return null
}

/** Builds the confirmation plus a mailto so the request actually goes somewhere. */
export function completeBooking({ name, email, topic }) {
  const subject = encodeURIComponent(`Call request from ${name}`)
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nTopic:\n${topic}\n\nSent from pulplabs.ai`)
  return {
    reply:
      `Got it, ${name.split(' ')[0]}.\n\n` +
      `**Email**: ${email}\n**Topic**: ${topic}\n\n` +
      'One thing to be straight about: this site has no booking backend wired up yet, so I can\'t put it in a calendar myself. ' +
      'Use the button below and it opens a pre-filled email to the team, who reply the same working day.',
    action: {
      type: 'mailto',
      href: `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`,
      label: 'Send this to the team',
    },
    chips: ['What services do you offer?', 'How does an engagement start?'],
  }
}

/* --------------------------------------------------------------------------
   Calls /api/assistant, which talks to Grok server-side. The API key is never
   in this file or anywhere else the browser can read.

   If the route fails for any reason — offline, rate limited, model down — the
   local intent matcher above answers instead, so the dock always says
   something useful rather than showing an error.
   -------------------------------------------------------------------------- */
export async function askAssistant(text, history = []) {
  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history }),
    })

    if (res.status === 429) {
      return { reply: "That's a lot of questions at once. Give it a minute and try again.", chips: [] }
    }

    if (res.ok) {
      const data = await res.json()
      if (data?.reply) return { reply: data.reply, chips: data.chips, action: data.action }
    }
  } catch {
    /* fall through to the local matcher */
  }

  const entry = matchIntent(text) ?? FALLBACK
  return { reply: entry.answer, chips: entry.chips, action: entry.action }
}

export const OPENERS = [
  'What services do you offer?',
  'What products do you have?',
  'How does an engagement start?',
  'Book a call',
]
