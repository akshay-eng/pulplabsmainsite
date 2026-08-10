import { useState } from 'react'

// No backend yet — the form validates, then acknowledges locally.
export default function NewsletterForm({ variant = 'inline' }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSent(true)
    setEmail('')
  }

  if (variant === 'stacked') {
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="newsletter-stacked" className="sr-only" style={{ display: 'none' }}>
          Email address
        </label>
        <input
          id="newsletter-stacked"
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">{sent ? 'Subscribed ✓' : 'Subscribe'}</button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="newsletter-inline" style={{ display: 'none' }}>
        Email address
      </label>
      <input
        id="newsletter-inline"
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Subscribe</button>
      {sent && <span className="sent-note">You're on the list ✓</span>}
    </form>
  )
}
