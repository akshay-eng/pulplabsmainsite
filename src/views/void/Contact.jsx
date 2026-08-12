'use client'

import { useState } from 'react'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'

const TOPICS = [
  ['accelerators', 'Enterprise accelerators'],
  ['small-business', 'Small business systems'],
  ['enablement', 'Enablement & workshops'],
  ['advisory', 'Advisory & strategy'],
  ['other', 'Something else'],
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', company: '', topic: 'accelerators', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    // Clear the error the moment the field is touched again — leaving it up
    // while someone is actively fixing it is just nagging.
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  function validate() {
    const e = {}
    if (values.name.trim().length < 2) e.name = 'Please give us a name we can use.'
    if (!EMAIL_RE.test(values.email.trim())) e.email = 'That does not look like a complete email address.'
    if (values.message.trim().length < 10) e.message = 'A sentence or two about the workflow helps us prepare.'
    return e
  }

  function onSubmit(event) {
    event.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      // Move focus to the first problem rather than making them hunt for it.
      document.getElementById(Object.keys(e)[0])?.focus()
      return
    }
    setSent(true)
  }

  const mailto = `mailto:hello@pulplabs.ai?subject=${encodeURIComponent(
    `Enquiry — ${values.company || values.name}`,
  )}&body=${encodeURIComponent(
    `Name: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company}\nTopic: ${values.topic}\n\n${values.message}`,
  )}`

  return (
    <div className="grain">
      <Nav />

      <main id="main">
        <section className="phead">
          <div className="shell">
            <h1 className="d1 phead-h">
              Tell us the workflow
              <br />
              that is <span className="dim">eating your week.</span>
            </h1>
            <p className="lede phead-l">
              Thirty minutes with an engineer, no deck. You will leave with a straight answer on whether AI helps here —
              even if that answer is no.
            </p>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell contact-grid">
            <div className="contact-aside">
              <div data-r>
                <p className="mono">Email</p>
                <a className="contact-mail" href="mailto:hello@pulplabs.ai">
                  hello@pulplabs.ai
                </a>
              </div>

              <div data-r style={{ '--rd': '60ms' }}>
                <p className="mono">What happens next</p>
                <ol className="contact-next">
                  <li>We reply the same working day.</li>
                  <li>Thirty minutes, with an engineer — not a salesperson.</li>
                  <li>If we are not the right fit, we say so.</li>
                </ol>
              </div>

              <div data-r style={{ '--rd': '120ms' }}>
                <p className="mono">Prefer to ask first?</p>
                <p className="body contact-hint">
                  The assistant at the bottom of the screen answers questions about our services, pricing approach and
                  security posture straight away.
                </p>
              </div>
            </div>

            {sent ? (
              <div className="contact-done" role="status" data-r>
                <h2 className="d3">Almost there, {values.name.split(' ')[0]}.</h2>
                <p className="body">
                  This site has no form backend yet, so nothing has been sent. The button below opens a pre-filled email
                  to the team with everything you just wrote.
                </p>
                <a className="btn" href={mailto}>
                  Send it to the team
                </a>
                <button type="button" className="link contact-back" onClick={() => setSent(false)}>
                  Edit the details
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={onSubmit} noValidate data-r>
                <div className="f-row">
                  <Field id="name" label="Name" value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                  <Field id="company" label="Company" value={values.company} onChange={set('company')} autoComplete="organization" optional />
                </div>

                <Field
                  id="email"
                  label="Email"
                  type="email"
                  inputMode="email"
                  value={values.email}
                  onChange={set('email')}
                  error={errors.email}
                  autoComplete="email"
                />

                <div className="f">
                  <label className="f-label" htmlFor="topic">
                    What is this about
                  </label>
                  <div className="f-select">
                    <select id="topic" value={values.topic} onChange={set('topic')}>
                      {TOPICS.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="f">
                  <label className="f-label" htmlFor="message">
                    The workflow
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={values.message}
                    onChange={set('message')}
                    placeholder="What happens today, who does it, and what it costs you."
                    aria-invalid={errors.message ? 'true' : undefined}
                    aria-describedby={errors.message ? 'message-err' : undefined}
                  />
                  {errors.message && (
                    <p className="f-err" id="message-err">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn contact-submit">
                  Send
                </button>
                <p className="mono">We reply the same working day. No newsletter, no sequence.</p>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/* Visible label above every field — a placeholder is not a label; it vanishes
   the moment someone starts typing, exactly when they need it most. */
function Field({ id, label, error, optional, ...rest }) {
  return (
    <div className="f">
      <label className="f-label" htmlFor={id}>
        {label}
        {optional && <span className="f-opt">Optional</span>}
      </label>
      <input
        id={id}
        value={rest.value}
        onChange={rest.onChange}
        type={rest.type ?? 'text'}
        inputMode={rest.inputMode}
        autoComplete={rest.autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <p className="f-err" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  )
}
