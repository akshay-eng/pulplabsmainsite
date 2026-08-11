'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from '@/app/admin/actions'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-btn primary block" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}

export default function LoginForm({ next = '/admin' }) {
  const [state, formAction] = useActionState(loginAction, {})

  return (
    <div className="admin-login">
      <form action={formAction} className="admin-card">
        <h1>Sign in</h1>
        <p className="admin-sub">PulpLabs blog admin</p>

        <input type="hidden" name="next" value={next} />

        <label className="admin-field">
          <span>Email</span>
          {/* defaultValue re-seeded from the action result: without it a failed
              attempt cleared the email and the retry submitted an empty field. */}
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            autoFocus
            defaultValue={state?.email ?? ''}
            key={state?.email ?? 'empty'}
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>

        {/* role=alert so a screen reader announces the failure without a focus jump */}
        {state?.error && (
          <p className="admin-error" role="alert">
            {state.error}
          </p>
        )}

        <Submit />
      </form>
    </div>
  )
}
