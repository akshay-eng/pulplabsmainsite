import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  askAssistant,
  bookingPrompt,
  BOOKING_STEPS,
  completeBooking,
  isBookingIntent,
  OPENERS,
  validateBookingField,
} from '../lib/assistant'

/* ==========================================================================
   AIDock — persistent assistant, mounted once in App so it survives route
   changes with its transcript intact.

   Three states:
     'bar'  — sticky composer across the bottom (default)
     'open' — transcript panel above the composer
     'dot'  — collapsed to a single floating dot at the right edge

   State and transcript persist in sessionStorage so a refresh mid-conversation
   doesn't wipe the thread.
   ========================================================================== */

const STORE_KEY = 'pulplabs.dock.v1'
const MAX_RESTORED = 40

let uid = 0
const nextId = () => `m${++uid}`

function loadStored() {
  try {
    const raw = sessionStorage.getItem(STORE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.messages)) return null
    return { mode: parsed.mode, messages: parsed.messages.slice(-MAX_RESTORED) }
  } catch {
    return null // private-mode / quota / corrupt JSON — start fresh rather than crash the app
  }
}

export default function AIDock() {
  const stored = useRef(loadStored()).current
  const navigate = useNavigate()

  const [mode, setMode] = useState(stored?.mode === 'dot' ? 'dot' : 'bar')
  const [messages, setMessages] = useState(stored?.messages ?? [])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const [booking, setBooking] = useState(null) // { step, data }
  const [narrow, setNarrow] = useState(() => window.matchMedia?.('(max-width: 560px)').matches ?? false)

  const dockRef = useRef(null)
  const inputRef = useRef(null)
  const logRef = useRef(null)
  const timers = useRef([])

  /* Clear any pending reply timers on unmount so a late setState can't fire
     against a torn-down tree. */
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  /* Track the narrow breakpoint so the placeholder can shorten with it */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 560px)')
    const onChange = (e) => setNarrow(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* Persist mode + transcript */
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ mode, messages: messages.slice(-MAX_RESTORED) }))
    } catch {
      /* storage full or unavailable — the dock still works, it just won't survive a refresh */
    }
  }, [mode, messages])

  /* Publish the dock's height as --dock-h so page content can clear it.
     Measured rather than hard-coded: the composer grows with a long draft. */
  useLayoutEffect(() => {
    // Minimised: there is no bar to clear, so release the reserved space.
    // This has to run BEFORE the ref check — in 'dot' mode the component
    // returns early and dockRef is null, so bailing first left --dock-h stuck
    // at the bar's last height and stranded a gap under the footer.
    if (mode === 'dot') {
      document.documentElement.style.setProperty('--dock-h', '0px')
      return
    }

    const el = dockRef.current
    if (!el) return

    const publish = () => {
      document.documentElement.style.setProperty('--dock-h', `${el.offsetHeight}px`)
    }

    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    window.addEventListener('resize', publish)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', publish)
    }
  }, [mode, draft])

  /* Keep the newest message in view */
  useEffect(() => {
    if (mode !== 'open') return
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, thinking, mode])

  /* Escape steps back: open → bar → dot */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setMode((m) => (m === 'open' ? 'bar' : m))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const push = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: nextId(), ...msg }])
  }, [])

  /* Replies land after a short beat. Instant answers read as canned; the pause
     is also what makes the typing indicator meaningful rather than decorative. */
  const replyAfter = useCallback(
    (payload, delay = 480) => {
      setThinking(true)
      const t = setTimeout(() => {
        setThinking(false)
        push({ role: 'bot', ...payload })
      }, delay)
      timers.current.push(t)
    },
    [push],
  )

  const startBooking = useCallback(() => {
    setBooking({ step: 0, data: {} })
    replyAfter({ text: bookingPrompt(BOOKING_STEPS[0]).reply }, 320)
  }, [replyAfter])

  const submit = useCallback(
    (raw) => {
      const text = raw.trim()
      if (!text || thinking) return

      push({ role: 'user', text })
      setDraft('')
      if (mode !== 'open') setMode('open')

      /* --- mid-booking: treat the message as the answer to the current field --- */
      if (booking) {
        const step = BOOKING_STEPS[booking.step]
        const error = validateBookingField(step, text)

        if (error) {
          replyAfter({ text: error }, 300)
          return
        }

        const data = { ...booking.data, [step]: text.trim() }
        const nextIndex = booking.step + 1

        if (nextIndex < BOOKING_STEPS.length) {
          setBooking({ step: nextIndex, data })
          replyAfter({ text: bookingPrompt(BOOKING_STEPS[nextIndex]).reply }, 340)
        } else {
          setBooking(null)
          const done = completeBooking(data)
          replyAfter({ text: done.reply, action: done.action, chips: done.chips }, 620)
        }
        return
      }

      /* --- not booking --- */
      if (isBookingIntent(text)) {
        setBooking({ step: 0, data: {} })
        replyAfter({ text: bookingPrompt(BOOKING_STEPS[0]).reply }, 380)
        return
      }

      setThinking(true)
      askAssistant(text)
        .then(({ reply, chips, action }) => {
          const t = setTimeout(() => {
            setThinking(false)
            push({ role: 'bot', text: reply, chips, action })
          }, 460)
          timers.current.push(t)
        })
        .catch(() => {
          setThinking(false)
          push({ role: 'bot', text: 'Something went wrong reaching the assistant. Try again in a moment.' })
        })
    },
    [booking, mode, push, replyAfter, thinking],
  )

  const onChip = useCallback(
    (chip) => {
      if (/^book/i.test(chip)) {
        push({ role: 'user', text: chip })
        if (mode !== 'open') setMode('open')
        startBooking()
        return
      }
      submit(chip)
    },
    [mode, push, startBooking, submit],
  )

  const onAction = useCallback(
    (action) => {
      if (action.type === 'navigate') {
        navigate(action.to)
        setMode('bar')
      }
    },
    [navigate],
  )

  const onKeyDown = (e) => {
    // Enter sends; Shift+Enter is a newline. Standard composer behaviour.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit(draft)
    }
  }

  const activeLabel = booking ? bookingPrompt(BOOKING_STEPS[booking.step]).label : 'Ask about PulpLabs'
  const placeholder = booking
    ? bookingPrompt(BOOKING_STEPS[booking.step]).label
    : // The long form wraps to a second line in the one-row textarea on a
      // narrow phone and gets clipped mid-sentence.
      narrow
      ? 'Ask, or book a call…'
      : 'Ask about our services, or book a call…'

  /* ---------------------------------------------------------------- dot --- */
  if (mode === 'dot') {
    return (
      <button
        type="button"
        className="dock-dot"
        onClick={() => setMode(messages.length ? 'open' : 'bar')}
        aria-label="Open the PulpLabs assistant"
      >
        <span className="dock-dot-pulse" aria-hidden="true" />
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M12 3c4.97 0 9 3.36 9 7.5 0 4.14-4.03 7.5-9 7.5a10.4 10.4 0 0 1-2.6-.33L5 20.5l.9-3.4C4.1 15.74 3 13.75 3 11.5 3 7.36 7.03 3 12 3Z"
            fill="currentColor"
          />
        </svg>
        {messages.length > 0 && <span className="dock-dot-badge" aria-hidden="true" />}
      </button>
    )
  }

  /* ------------------------------------------------------- bar / open --- */
  return (
    <div className={`dock dock-${mode}`} ref={dockRef} data-open={mode === 'open'}>
      <div className="dock-shell">
        {mode === 'open' && (
          <section className="dock-panel" aria-label="PulpLabs assistant conversation">
            <header className="dock-head">
              <span className="dock-head-id">
                <span className="dock-orb" aria-hidden="true" />
                <span>
                  <strong>PulpLabs assistant</strong>
                  <em>Answers from this site · not a human</em>
                </span>
              </span>

              <span className="dock-head-actions">
                {messages.length > 0 && (
                  <button
                    type="button"
                    className="dock-icon-btn"
                    onClick={() => {
                      setMessages([])
                      setBooking(null)
                    }}
                    aria-label="Clear conversation"
                    title="Clear conversation"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path
                        d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  className="dock-icon-btn"
                  onClick={() => setMode('bar')}
                  aria-label="Collapse to the composer bar"
                  title="Collapse"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path d="M6 14h12" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="dock-icon-btn"
                  onClick={() => setMode('dot')}
                  aria-label="Minimise the assistant to a dot"
                  title="Minimise"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path
                      d="m7 7 10 10M17 7 7 17"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </span>
            </header>

            <div className="dock-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions">
              {messages.length === 0 && (
                <div className="dock-empty">
                  <p>
                    Ask about our services, accelerators, process or security posture — or say <em>book a call</em> and
                    I'll take your details.
                  </p>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`dock-msg dock-msg-${m.role}`}>
                  <div className="dock-bubble">
                    <RichText text={m.text} />
                  </div>

                  {m.action && (
                    <div className="dock-msg-action">
                      {m.action.type === 'mailto' ? (
                        <a className="btn btn-primary btn-sm" href={m.action.href}>
                          {m.action.label}
                        </a>
                      ) : (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onAction(m.action)}>
                          {m.action.label}
                        </button>
                      )}
                    </div>
                  )}

                  {m.chips && m.chips.length > 0 && (
                    <div className="dock-chips">
                      {m.chips.map((chip) => (
                        <button key={chip} type="button" className="dock-chip" onClick={() => onChip(chip)}>
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {thinking && (
                <div className="dock-msg dock-msg-bot">
                  <div className="dock-bubble dock-typing" aria-label="Assistant is typing">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Openers sit above the composer while the bar is collapsed and empty */}
        {mode === 'bar' && messages.length === 0 && (
          <div className="dock-openers">
            {OPENERS.map((o) => (
              <button key={o} type="button" className="dock-chip" onClick={() => onChip(o)}>
                {o}
              </button>
            ))}
          </div>
        )}

        <form
          className="dock-composer"
          onSubmit={(e) => {
            e.preventDefault()
            submit(draft)
          }}
        >
          <label className="sr-only" htmlFor="dock-input">
            {activeLabel}
          </label>

          <span className="dock-composer-orb" aria-hidden="true" />

          <textarea
            id="dock-input"
            ref={inputRef}
            className="dock-input"
            rows={1}
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => mode === 'bar' && messages.length > 0 && setMode('open')}
            enterKeyHint="send"
            autoComplete="off"
            inputMode={booking && BOOKING_STEPS[booking.step] === 'email' ? 'email' : 'text'}
          />

          <button
            type="submit"
            className="dock-send"
            disabled={!draft.trim() || thinking}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M4 12h13m0 0-5-5m5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {mode === 'bar' && (
            <button
              type="button"
              className="dock-icon-btn dock-min"
              onClick={() => setMode('dot')}
              aria-label="Minimise the assistant to a dot"
              title="Minimise"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   RichText — renders the small markdown subset the knowledge base uses:
   **bold** and newlines. Deliberately not a markdown library and deliberately
   not dangerouslySetInnerHTML — the content is ours, but a chat surface is
   exactly where an HTML sink becomes an injection vector later.
   -------------------------------------------------------------------------- */
function RichText({ text = '' }) {
  return text.split('\n').map((line, i) => {
    if (line.trim() === '') return <span key={i} className="dock-gap" />
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    return (
      <p key={i}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part,
        )}
      </p>
    )
  })
}
