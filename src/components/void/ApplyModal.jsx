'use client'

import { useEffect, useRef, useState } from 'react'

/* Application form in a dialog.
 *
 * Uses the native <dialog> element rather than a hand-rolled overlay: it gives
 * focus trapping, Escape to close, inert background content and the top layer
 * for free, all of which are easy to get subtly wrong by hand.
 */
export default function ApplyModal({ role }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const [cvName, setCvName] = useState('')

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const body = new FormData(e.currentTarget)
      body.set('role', role.slug)
      const res = await fetch('/api/apply', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'That did not go through.')
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        Apply for this role
      </button>

      <dialog
        ref={ref}
        className="ap"
        onClose={() => setOpen(false)}
        /* Clicking the backdrop closes. The check compares against the dialog
           itself because the backdrop is not a separate element to listen on. */
        onClick={(e) => { if (e.target === ref.current) setOpen(false) }}
      >
        <div className="ap-in">
          <header className="ap-head">
            <div>
              <p className="mono">{role.type} · {role.length}</p>
              <h2 className="d3 ap-t">{role.title}</h2>
            </div>
            <button type="button" className="ap-x" aria-label="Close" onClick={() => setOpen(false)}>
              <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          {done ? (
            <div className="ap-done" role="status">
              <p className="body">
                That is with us, {`${cvName ? '' : ''}`}and your CV came through. We read every application and
                reply either way, usually within a few working days.
              </p>
              <button type="button" className="btn" onClick={() => setOpen(false)}>Close</button>
            </div>
          ) : (
            <form className="ap-form" onSubmit={onSubmit} noValidate>
              <div className="f">
                <label className="f-label" htmlFor="ap-name">Name</label>
                <input id="ap-name" name="name" autoComplete="name" required />
              </div>

              <div className="f-row">
                <div className="f">
                  <label className="f-label" htmlFor="ap-email">Email</label>
                  <input id="ap-email" name="email" type="email" inputMode="email" autoComplete="email" required />
                </div>
                <div className="f">
                  <label className="f-label" htmlFor="ap-phone">Phone</label>
                  <input id="ap-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required />
                </div>
              </div>

              <div className="f">
                <label className="f-label" htmlFor="ap-cv">
                  CV <span className="f-opt">PDF or Word, up to 5MB</span>
                </label>
                {/* The native control is replaced visually but kept in the DOM
                    and focusable, so keyboard and screen-reader users get the
                    real file picker rather than a div pretending to be one. */}
                <label className="ap-file" data-has={cvName || undefined}>
                  <input
                    id="ap-cv"
                    name="cv"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    required
                    onChange={(e) => setCvName(e.target.files?.[0]?.name ?? '')}
                  />
                  <span>{cvName || 'Choose a file'}</span>
                </label>
              </div>

              <div className="f">
                <label className="f-label" htmlFor="ap-note">
                  Anything you have shipped <span className="f-opt">Optional</span>
                </label>
                <textarea id="ap-note" name="note" rows={3}
                  placeholder="A link to something you built, and one line on what it does." />
              </div>

              {/* Off-screen rather than display:none, which some bots skip. */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="ap-website">Website</label>
                <input id="ap-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              {error && <p className="f-err" role="alert">{error}</p>}

              <button type="submit" className="btn ap-submit" disabled={busy}>
                {busy ? 'Sending…' : 'Send application'}
              </button>
              <p className="mono ap-note">We reply either way.</p>
            </form>
          )}
        </div>
      </dialog>
    </>
  )
}
