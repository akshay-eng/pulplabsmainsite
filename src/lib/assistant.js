/* ==========================================================================
   PulpLabs assistant — knowledge, intent routing and the booking flow.

   Answers come from Grok via /api/assistant. This file keeps a local intent
   matcher too, used for two things:

     1. Fallback. If the model is unreachable, out of credits or rate limited,
        the dock answers from the site's own content instead of erroring.
     2. The booking flow, which stays deterministic on purpose — collecting a
        name and email is not a job for a language model.

   The xAI key lives in XAI_API_KEY and is read only in src/lib/grok.js, which
   is server-only. Nothing in this file ever sees it.
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
      'We work across five practice areas:\n\n' +
      '**Advisory & strategy** — where AI pays back, and where it doesn\'t. Workflow, data and constraint mapping before anyone writes code.\n' +
      '**Enterprise accelerators** — production-tested IT-ops accelerators deployed inside your estate, wired to your ITSM and CMDB.\n' +
      '**Small business solutions** — growth and ops systems live in about four weeks, with a human approval step you keep.\n' +
      '**Enablement & workshops** — certified instructors across Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate.\n' +
      '**Managed AI operations** — we run what we build.',
    chips: ['Tell me about accelerators', 'How does an engagement start?', 'Book a call'],
  },
  {
    id: 'accelerators',
    patterns: ['accelerator', 'accelerators', 'incident', 'change copilot', 'patch', 'migration', 'itsm', 'cmdb'],
    answer:
      'Four systems we bring into an engagement and then shape to your estate — a starting point rather than a blank page, and not something you buy off the page:\n\n' +
      '**Incident Intelligence** — triage, correlation and suggested remediation on your live queue.\n' +
      '**Change Copilot** — risk scoring and change-record drafting against your CAB rules.\n' +
      '**Patch Orchestrator** — patch sequencing with rollback paths.\n' +
      '**Agent Migration** — moving RPA flows to agents without breaking your audit trail.\n\n' +
      'Each integrates with your existing ITSM and CMDB — they read your data where it already lives.',
    chips: ['What results have these produced?', 'Book a technical call'],
  },
  {
    id: 'smallbiz',
    patterns: ['small business', 'small team', 'startup', 'smb', 'lead engine', 'support desk', 'marketing studio', 'social autopilot'],
    answer:
      'For small teams we run four systems: **Lead Engine**, **Support Desk**, **Marketing Studio** and **Social Autopilot**.\n\n' +
      'Typical shape: live in about four weeks, tuned monthly, and every one of them keeps a human approval step that you control. ' +
      'No system sends or commits anything on your behalf unless you decide it should.',
    chips: ['What does that cost?', 'Book a call'],
  },
  {
    id: 'enablement',
    patterns: ['workshop', 'workshops', 'training', 'enablement', 'bootcamp', 'briefing', 'teach', 'upskill', 'course'],
    answer:
      'Three formats, all run on your workflows and your data rather than generic exercises:\n\n' +
      '**Executive briefing** — half a day, for the people who approve the budget.\n' +
      '**Builder bootcamp** — two days, hands-on for the people who ship.\n' +
      '**Embedded enablement** — six weeks alongside your team on live work.\n\n' +
      'Instructors are certified across Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate.',
    chips: ['Book an enablement call', 'Tell me about the team'],
  },
  {
    id: 'process',
    patterns: ['process', 'engagement', 'how do you work', 'get started', 'start', 'steps', 'timeline', 'how long'],
    answer:
      'Four steps:\n\n' +
      '**1 · Discover** — your workflows, data and constraints.\n' +
      '**2 · Scope & propose** — a written scope with success criteria before any build.\n' +
      '**3 · Build & evaluate** — we run task-level evals before anything touches a production queue.\n' +
      '**4 · Hand over** — documentation, training and the option for us to keep running it.\n\n' +
      'The evaluation step is the one people skip. It\'s the reason incident bots ship confident and wrong.',
    chips: ['Book a scoping call', 'What do you charge?'],
  },
  {
    id: 'team',
    patterns: ['team', 'who are you', 'people', 'founder', 'staff', 'certified', 'certification', 'credentials'],
    answer:
      'A six-person team — AI architects, delivery leads and ML engineers — formally accredited on four platforms: ' +
      '**Claude**, **OpenAI**, **Copilot Studio** and **IBM watsonx Orchestrate**.\n\n' +
      'There are no account managers between you and the engineer. The roster, the engagement model and the ' +
      'accreditation are all on the About page.',
    chips: ['See the team', 'Book a call'],
    action: { type: 'navigate', to: '/about', label: 'See the team' },
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
      'Small business systems and enterprise accelerators are priced very differently.\n\n' +
      'The fastest way to a real number is a 30-minute scoping call.',
    chips: ['Book a scoping call', 'How does an engagement start?'],
  },
  {
    id: 'results',
    patterns: ['result', 'results', 'roi', 'case study', 'proof', 'evidence', 'outcome', 'metrics', 'mttr'],
    /* Only outcomes a named client has agreed to. The previous answer cited an
       "MTTR down 38%" figure that came from a hardcoded panel on the home page
       rather than from any engagement, and counted accelerators as if they
       were inventory. */
    answer:
      'Two engagements we can put numbers to:\n\n' +
      '**Power & Pack Solutions** (manufacturing) — quote turnaround **4× faster**, **62%** of enquiries handled ' +
      'without a person, **9 hours** returned per week.\n' +
      '**Urban Ethnographers** (research) — **70%** less manual coding, **3×** the interviews per study, a draft ' +
      'insight deck in **one day**.\n\n' +
      'The long-form write-ups are with those clients for sign-off, so the work page is short for now. Happy to walk ' +
      'through either one properly on a call.',
    chips: ['See client work', 'Book a call'],
    action: { type: 'navigate', to: '/case-studies', label: 'See client work' },
  },
  {
    id: 'industries',
    patterns: ['industry', 'industries', 'sector', 'sectors', 'vertical', 'manufacturing', 'research', 'it operations', 'who do you work with', 'clients'],
    answer:
      'Four sectors, and we only list the ones we have actually shipped in:\n\n' +
      '**IT operations** — incident, change and patch work inside enterprise ITSM and CMDB.\n' +
      '**Manufacturing** — quoting and enquiry handling where pricing rules live in someone\'s head.\n' +
      '**Research & insight** — transcript coding and theme clustering against a team\'s own framework.\n' +
      '**Small business** — leads, support, marketing and social for teams without an IT department.\n\n' +
      'If yours is not on that list it means we have not shipped in it yet, not that we cannot — the method travels ' +
      'further than the sector list does.',
    chips: ['See the industries', 'Book a call'],
    action: { type: 'navigate', to: '/industries', label: 'See the industries' },
  },
  {
    id: 'security',
    patterns: ['security', 'secure', 'data', 'privacy', 'compliance', 'gdpr', 'audit', 'governance', 'risk', 'on-prem', 'onprem'],
    answer:
      'Accelerators are deployed **inside your estate** — your data does not leave your boundary, including while we operate them.\n\n' +
      'Advisory engagements include a governance and risk framework, and the Agent Migration accelerator exists specifically to move RPA flows to agents ' +
      'without breaking your audit trail.\n\n' +
      'For a specific compliance regime, a call with an architect is the right next step.',
    chips: ['Book a technical call', 'Tell me about accelerators'],
  },
  {
    id: 'blog',
    patterns: ['blog', 'article', 'writing', 'post', 'posts', 'read', 'newsletter', 'open source'],
    answer:
      'Insights covers engineering field notes and playbooks — recent pieces include why incident bots keep guessing and how evals fix it, ' +
      'and migrating RPA flows to agents without breaking audit.',
    chips: ['Read the insights', 'Book a call'],
    action: { type: 'navigate', to: '/blog', label: 'Read the insights' },
  },
  {
    id: 'contact',
    patterns: ['contact', 'email', 'reach', 'phone', 'get in touch', 'talk to', 'speak to', 'human'],
    answer: `You can reach the team at **${BOOKING_EMAIL}**, use the contact page, or I can take your details right here.`,
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
        'Hello. I can answer questions about what PulpLabs does — services, accelerators, our process, security posture — or take your details for a call.\n\nWhat would be most useful?',
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
    "I don't have a confident answer to that one — I only answer from what's published on this site, and I'd rather say so than guess.\n\n" +
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
    if (!EMAIL_RE.test(v)) return "That doesn't look like a complete email address — could you check it?"
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
  const subject = encodeURIComponent(`Call request — ${name}`)
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nTopic:\n${topic}\n\n— sent from pulplabs.ai`)
  return {
    reply:
      `Got it, ${name.split(' ')[0]}.\n\n` +
      `**Email** — ${email}\n**Topic** — ${topic}\n\n` +
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
      return { reply: "That's a lot of questions at once — give it a minute and try again.", chips: [] }
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
  'How does an engagement start?',
  'Is my data safe?',
  'Book a call',
]
