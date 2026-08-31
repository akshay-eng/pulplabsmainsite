import 'server-only'

/* ==========================================================================
   LLM client for the site assistant. Currently Groq.

   Named for the job rather than the vendor: this has already moved from xAI to
   Groq once, and both speak the OpenAI chat/completions shape, so switching
   again is a base URL, a key and a model name.

   Server-only. GROQ_API_KEY must never reach the browser — anything in
   NEXT_PUBLIC_* or imported by a client component is readable by every
   visitor, and this key bills a real account.

   NOTE (Groq vs Grok): Groq is the inference provider at groq.com and its keys
   start `gsk_`. Grok is xAI's model, keys start `xai-`. Different companies,
   different endpoints — easy to conflate.
   ========================================================================== */

const BASE_URL = process.env.LLM_BASE_URL || 'https://api.groq.com/openai/v1'
const MODEL = process.env.LLM_MODEL || 'openai/gpt-oss-120b'

/* gpt-oss is a reasoning model: it spends tokens thinking before it writes,
   and returns that separately in `message.reasoning`. Two consequences:

   1. `max_completion_tokens` covers reasoning AND the answer. Set it too low
      and reasoning consumes the whole budget, leaving `content` empty — a 20
      token cap returned a blank string in testing.
   2. 'low' effort is right here. These are lookups against a grounded prompt,
      not hard problems, and effort costs latency the visitor waits through. */
const REASONING_EFFORT = process.env.LLM_REASONING_EFFORT || 'low'
const MAX_TOKENS = 1200

const SYSTEM = `You are the assistant on pulplabs.ai, the website of PulpLabs, an AI consultancy and engineering firm.

WHAT PULPLABS DOES, across five practice areas:
1. Advisory & strategy: where AI pays back and where it doesn't; workflow, data and constraint mapping before any code.
2. Enterprise accelerators: production-tested IT-ops accelerators deployed inside the client's own estate, integrated with their ITSM and CMDB. The four are: Incident Intelligence, Change Copilot, Patch Orchestrator, Agent Migration.
3. Small business solutions: Lead Engine, Support Desk, Marketing Studio, Social Autopilot. Live in about four weeks, tuned monthly, always with a human approval step the client keeps.
4. Enablement & workshops: Executive briefing (half day), Builder bootcamp (2 days), Embedded enablement (6 weeks). Run on the client's own workflows and data.
5. Managed AI operations: PulpLabs runs what it builds.

HOW ENGAGEMENTS WORK, in four steps:
Discover (week 0–1) → Scope & propose (week 1–2) → Build & evaluate (week 2–8) → Hand over (ongoing).
Task-level evaluation runs before anything touches a production queue.

FACTS YOU MAY CITE:
- A small team, formally accredited on Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate, and hands-on with Gemini.
- 8+ accelerators in production. MTTR down 38%. Quote turnaround 4x faster.
- Accelerators deploy inside the client's estate, not as multi-tenant SaaS, so their data does not leave their boundary.
- Contact: hello@pulplabs.ai

PRICING: there is no public price list and no rate card. Engagements start with a paid discovery that produces a written scope with success criteria. Never quote a number, a range, a day rate or an hourly rate. If pushed, say pricing depends on scope and estate size and offer a 30-minute scoping call.

RULES:
- Answer ONLY from the facts above. If you do not know, say so plainly and offer hello@pulplabs.ai or a call. Never invent services, clients, case studies, prices, timelines, headcount or certifications.
- Never claim to be human. If asked, say you are an assistant on the PulpLabs site.
- Never promise that a meeting has been booked. You cannot access a calendar. To arrange a call, tell the user to say "book a call" and the site will take their details.
- Be direct and concise: two or three short paragraphs at most, plain British English, no marketing fluff, no exclamation marks, no emoji.
- Use **bold** for emphasis. Do not use headings, tables or code blocks.
- Stay on PulpLabs and its work. If asked about something unrelated, say it is outside what you can help with and redirect.`

export class LlmError extends Error {
  constructor(message, { status, detail } = {}) {
    super(message)
    this.name = 'LlmError'
    this.status = status
    this.detail = detail
  }
}

export const isConfigured = () => Boolean(process.env.GROQ_API_KEY)

/**
 * @param {{role:'user'|'assistant', content:string}[]} history
 * @param {string} message
 * @returns {Promise<string>} the visible reply, never the reasoning trace
 */
export async function askLlm(history, message) {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new LlmError('GROQ_API_KEY is not set.', { status: 503 })

  const messages = [
    { role: 'system', content: SYSTEM },
    // Cap the history: cost scales with every turn resent, and this assistant
    // does not need long-range memory to answer questions about a service page.
    ...history.slice(-8).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content ?? '').slice(0, 4000),
    })),
    { role: 'user', content: message },
  ]

  // Don't let a hung upstream hold a request open indefinitely.
  const signal = AbortSignal.timeout(25000)

  let res
  try {
    res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.3,
        max_completion_tokens: MAX_TOKENS,
        reasoning_effort: REASONING_EFFORT,
        stream: false,
      }),
      signal,
    })
  } catch (err) {
    throw new LlmError(err.name === 'TimeoutError' ? 'The model timed out.' : 'Could not reach the model.', {
      status: 504,
      detail: err.message,
    })
  }

  if (!res.ok) {
    const body = await res.text()
    // Surface the upstream message — "no credits", "bad key", "unknown model"
    // and "rate limited" are all different problems and otherwise invisible.
    throw new LlmError(`Provider returned ${res.status}.`, { status: res.status, detail: body.slice(0, 400) })
  }

  const data = await res.json()
  const choice = data?.choices?.[0]
  // `message.reasoning` is deliberately ignored — it is the model's private
  // scratchpad, frequently unpolished, and not something a visitor should read.
  const reply = choice?.message?.content?.trim()

  if (!reply) {
    throw new LlmError('The model returned no visible content.', {
      status: 502,
      detail: `finish_reason=${choice?.finish_reason} — if this is "length", reasoning consumed the whole token budget.`,
    })
  }
  return reply
}
