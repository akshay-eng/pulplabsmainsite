import 'server-only'

/* ==========================================================================
   xAI (Grok) client.

   Server-only, deliberately. The key lives in XAI_API_KEY and must never be
   sent to the browser — anything in NEXT_PUBLIC_* or imported by a client
   component is readable by every visitor, and this key bills a real account.

   The API is OpenAI-compatible, so this is a plain chat/completions call.
   ========================================================================== */

const ENDPOINT = 'https://api.x.ai/v1/chat/completions'
const MODEL = process.env.XAI_MODEL || 'grok-4-fast'

/* The assistant answers about a real business, so it is grounded in the same
   facts the site publishes and told plainly what it must not invent. An
   ungrounded model will cheerfully make up prices and case studies. */
const SYSTEM = `You are the assistant on pulplabs.ai, the website of PulpLabs — an AI consultancy and engineering firm.

WHAT PULPLABS DOES — five practice areas:
1. Advisory & strategy — where AI pays back and where it doesn't; workflow, data and constraint mapping before any code.
2. Enterprise accelerators — production-tested IT-ops accelerators deployed inside the client's own estate, integrated with their ITSM and CMDB. The four are: Incident Intelligence, Change Copilot, Patch Orchestrator, Agent Migration.
3. Small business solutions — Lead Engine, Support Desk, Marketing Studio, Social Autopilot. Live in about four weeks, tuned monthly, always with a human approval step the client keeps.
4. Enablement & workshops — Executive briefing (half day), Builder bootcamp (2 days), Embedded enablement (6 weeks). Run on the client's own workflows and data.
5. Managed AI operations — PulpLabs runs what it builds.

HOW ENGAGEMENTS WORK — four steps:
Discover (week 0–1) → Scope & propose (week 1–2) → Build & evaluate (week 2–8) → Hand over (ongoing).
Task-level evaluation runs before anything touches a production queue.

FACTS YOU MAY CITE:
- Six people. Certified across four platforms: Claude, OpenAI, Copilot Studio, IBM watsonx Orchestrate.
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

export class GrokError extends Error {
  constructor(message, { status, detail } = {}) {
    super(message)
    this.name = 'GrokError'
    this.status = status
    this.detail = detail
  }
}

export const isConfigured = () => Boolean(process.env.XAI_API_KEY)

/**
 * @param {{role:'user'|'assistant', content:string}[]} history
 * @param {string} message
 * @returns {Promise<string>} the assistant's reply text
 */
export async function askGrok(history, message) {
  const key = process.env.XAI_API_KEY
  if (!key) throw new GrokError('XAI_API_KEY is not set.', { status: 503 })

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
  const abort = AbortSignal.timeout(20000)

  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.3, max_tokens: 600, stream: false }),
      signal: abort,
    })
  } catch (err) {
    throw new GrokError(err.name === 'TimeoutError' ? 'The model timed out.' : 'Could not reach the model.', {
      status: 504,
      detail: err.message,
    })
  }

  if (!res.ok) {
    const body = await res.text()
    // Surface the upstream message — the difference between "no credits",
    // "bad key" and "unknown model" matters and is otherwise invisible.
    throw new GrokError(`xAI returned ${res.status}.`, { status: res.status, detail: body.slice(0, 400) })
  }

  const data = await res.json()
  const reply = data?.choices?.[0]?.message?.content?.trim()
  if (!reply) throw new GrokError('The model returned an empty reply.', { status: 502 })
  return reply
}
