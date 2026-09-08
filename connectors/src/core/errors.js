/* One error taxonomy across every connector.
 *
 * Callers should be able to write `catch (e) { if (e.retryable) ... }` without
 * knowing whether they were talking to ServiceNow or Box. Each connector maps
 * its provider's error shape onto these; nothing else should throw raw.
 */

export class ConnectorError extends Error {
  /**
   * @param {string} message
   * @param {object} [opts]
   * @param {string} [opts.connector]  which connector raised it
   * @param {number} [opts.status]     HTTP status, when there was one
   * @param {string} [opts.code]       provider's own error code, verbatim
   * @param {boolean} [opts.retryable] safe to try again unchanged
   * @param {number} [opts.retryAfter] seconds the provider asked us to wait
   * @param {unknown} [opts.detail]    provider payload, already redacted
   * @param {Error} [opts.cause]
   */
  constructor(message, opts = {}) {
    super(message, opts.cause ? { cause: opts.cause } : undefined)
    this.name = 'ConnectorError'
    this.connector = opts.connector
    this.status = opts.status
    this.code = opts.code
    this.retryable = opts.retryable ?? false
    this.retryAfter = opts.retryAfter
    this.detail = opts.detail
  }
}

/* Credentials are absent, wrong, or expired. Never retryable: hammering a
   login endpoint with a bad password is how an account gets locked. */
export class AuthError extends ConnectorError {
  constructor(message, opts = {}) {
    super(message, { ...opts, retryable: false })
    this.name = 'AuthError'
  }
}

/* Authenticated but not allowed. Distinct from AuthError because the fix is
   different: a scope or role, not a credential. */
export class PermissionError extends ConnectorError {
  constructor(message, opts = {}) {
    super(message, { ...opts, retryable: false })
    this.name = 'PermissionError'
  }
}

export class NotFoundError extends ConnectorError {
  constructor(message, opts = {}) {
    super(message, { ...opts, retryable: false })
    this.name = 'NotFoundError'
  }
}

/* The provider said slow down. Always retryable, and retryAfter is honoured
   rather than guessed at. */
export class RateLimitError extends ConnectorError {
  constructor(message, opts = {}) {
    super(message, { ...opts, retryable: true })
    this.name = 'RateLimitError'
  }
}

/* The request was rejected on its merits: bad field, failed validation, a
   mandatory value missing. Retrying identical input cannot help. */
export class ValidationError extends ConnectorError {
  constructor(message, opts = {}) {
    super(message, { ...opts, retryable: false })
    this.name = 'ValidationError'
  }
}

/* Network fault, timeout, or a 5xx. Retryable by definition. */
export class TransportError extends ConnectorError {
  constructor(message, opts = {}) {
    super(message, { ...opts, retryable: true })
    this.name = 'TransportError'
  }
}

/* Maps a status onto the right class. `retryable` is deliberately NOT a simple
 * `status >= 500`: a 409 conflict is often transient and worth one more go,
 * while a 501 never is.
 */
export function fromStatus(status, message, opts = {}) {
  const o = { ...opts, status }
  if (status === 401) return new AuthError(message, o)
  if (status === 403) return new PermissionError(message, o)
  if (status === 404 || status === 410) return new NotFoundError(message, o)
  if (status === 429) return new RateLimitError(message, o)
  if (status === 408 || status === 409) return new ConnectorError(message, { ...o, retryable: true })
  if (status >= 400 && status < 500) return new ValidationError(message, o)
  if (status === 501) return new ConnectorError(message, { ...o, retryable: false })
  if (status >= 500) return new TransportError(message, o)
  return new ConnectorError(message, o)
}
