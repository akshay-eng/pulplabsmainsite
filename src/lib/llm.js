import 'server-only'

import { KNOWLEDGE } from '@/lib/knowledge'

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
/* 3. Output tokens count against the same per-minute budget as the prompt, and
      on Groq's free tier that budget is 8,000 for the whole site. The answers
      here are meant to be two or three short paragraphs, so 1200 was reserving
      headroom nobody uses and starving the next visitor's request. 700 still
      leaves reasoning room at 'low' effort. */
const MAX_TOKENS = 700

/* The grounding context is composed from src/data at build time rather than
   written out here, so a new solution or a closed vacancy reaches the assistant
   without anyone remembering to edit this file. See src/lib/knowledge.js. */
const SYSTEM = KNOWLEDGE

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
