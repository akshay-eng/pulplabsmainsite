import { askGrok, isConfigured, GrokError } from '@/lib/grok'
import { matchIntent } from '@/lib/assistant'

export const dynamic = 'force-dynamic'

/* ==========================================================================
   POST /api/assistant  { message, history:[{role,content}] }

   Public and unauthenticated — it has to be, it powers the site's chat. That
   makes it a paid API anyone can call, so it is rate limited and capped.
   ========================================================================== */

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 12
const MAX_MESSAGE = 1000

/* In-memory sliding window. Adequate because fly.toml pins this to a single
   always-on machine; if that ever scales past one, this needs to move to
   SQLite or Redis or each machine will allow the full quota independently. */
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)

  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k)
  }
  return recent.length > MAX_PER_WINDOW
}

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

/** Falls back to the local intent matcher so the dock still answers when the
 *  model is unavailable — a broken key should degrade, not dead-end. */
function localAnswer(message) {
  const entry = matchIntent(message)
  if (entry) return { reply: entry.answer, chips: entry.chips, action: entry.action, source: 'local' }
  return {
    reply:
      "I can't reach the model right now, so I'm answering from what's published on this site — and I don't have a confident answer to that one.\n\nA person can help: **hello@pulplabs.ai**, or say *book a call* and I'll take your details.",
    chips: ['What services do you offer?', 'Book a call'],
    source: 'local',
  }
}

export async function POST(request) {
  const ip =
    request.headers.get('fly-client-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'

  if (rateLimited(ip)) {
    return json({ error: 'Too many messages. Give it a minute.', retryAfter: 60 }, 429)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Body must be JSON.' }, 400)
  }

  const message = String(body?.message ?? '').trim().slice(0, MAX_MESSAGE)
  if (!message) return json({ error: 'Empty message.' }, 400)

  const history = Array.isArray(body?.history) ? body.history : []

  if (!isConfigured()) return json(localAnswer(message))

  try {
    const reply = await askGrok(history, message)
    return json({ reply, source: 'grok' })
  } catch (err) {
    if (err instanceof GrokError) {
      // Logged server-side so the real cause (no credits, bad key, unknown
      // model) is diagnosable; never returned to the browser.
      console.error('[assistant] grok failed:', err.status, err.message, err.detail ?? '')
    } else {
      console.error('[assistant] unexpected:', err)
    }
    return json(localAnswer(message))
  }
}
