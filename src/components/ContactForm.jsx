'use client'

import { useState } from 'react'

const EMPTY = { name: '', company: '', email: '', problem: '' }

// Placeholder handler — wire `submit` to the real endpoint when it exists.
export default function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [sent, setSent] = useState(false)

  function update(field) {
    return (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSent(true)
    setValues(EMPTY)
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" required placeholder="Jane Doe" value={values.name} onChange={update('name')} />
        </div>
        <div className="field">
          <label htmlFor="contact-company">Company</label>
          <input id="contact-company" placeholder="Acme Ltd" value={values.company} onChange={update('company')} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-email">Work email</label>
        <input
          id="contact-email"
          type="email"
          required
          placeholder="jane@acme.com"
          value={values.email}
          onChange={update('email')}
        />
      </div>

      <div className="field">
        <label htmlFor="contact-problem">What's the problem?</label>
        <textarea
          id="contact-problem"
          rows={3}
          required
          placeholder="Our support inbox is three days behind…"
          value={values.problem}
          onChange={update('problem')}
          style={{ height: 82 }}
        />
      </div>

      <button className="form-submit" type="submit">
        Book the consultation
      </button>

      {sent && <p className="form-note">Thanks, we'll come back to you within one working day.</p>}
    </form>
  )
}
