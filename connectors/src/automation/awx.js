import { HttpClient } from '../core/http.js'
import { paginate, collect } from '../core/paginate.js'
import { ValidationError, ConnectorError } from '../core/errors.js'

/* AWX and Ansible Automation Controller.
 *
 * Same API, two names: AWX is upstream, Automation Controller is the supported
 * build. /api/v2 is identical on both, so one connector covers them.
 *
 * A bearer token is much preferred over basic auth here. Controller tokens are
 * per-application and revocable; basic auth means the account password crosses
 * the wire on every poll, and job polling is chatty by nature.
 *
 * Every list endpoint returns {count, next, previous, results} with `next` as a
 * path rather than a full URL, so it is resolved against the host.
 */
export class AWX {
  /**
   * @param {object} cfg
   * @param {string} cfg.host        https://awx.example.com
   * @param {string} [cfg.token]     OAuth2 token, preferred
   * @param {string} [cfg.username]
   * @param {string} [cfg.password]
   * @param {boolean} [cfg.insecure] accept a self-signed certificate
   */
  constructor(cfg) {
    if (!cfg?.host) throw new ValidationError('awx: host is required', { connector: 'awx' })
    if (!cfg.token && !(cfg.username && cfg.password)) {
      throw new ValidationError('awx: needs a token, or username and password', { connector: 'awx' })
    }
    this.host = String(cfg.host).replace(/\/+$/, '')
    /* Self-signed certificates are the norm on internal AWX. This is opt-in and
       process-wide, which is why it warns rather than doing it silently. */
    if (cfg.insecure) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      console.warn('[awx] TLS verification disabled for this process (insecure: true)')
    }
    this.http = new HttpClient({
      baseUrl: `${this.host}/api/v2`,
      connector: 'awx',
      fetch: cfg.fetch,
      timeout: cfg.timeout,
      authHeaders: () =>
        cfg.token
          ? { authorization: `Bearer ${cfg.token}` }
          : { authorization: 'Basic ' + Buffer.from(`${cfg.username}:${cfg.password}`).toString('base64') },
    })
  }

  async ping() {
    const me = await this.http.get('me/')
    const who = me?.results?.[0]
    return { ok: true, host: this.host, user: who?.username ?? null }
  }

  #page(path) {
    return (opts = {}) =>
      paginate(
        async (next) => {
          const r = next
            ? await this.http.get(next.startsWith('http') ? next : this.host + next)
            : await this.http.get(path, { query: { page_size: opts.pageSize ?? 50, ...opts.query } })
          return { items: r?.results ?? [], next: r?.next ?? null }
        },
        { limit: opts.limit ?? Infinity },
      )
  }

  /* Generic CRUD over any AWX resource. Everything named below is this. */
  resource(name) {
    if (!/^[a-z0-9_]+$/i.test(name)) throw new ValidationError(`awx: bad resource ${JSON.stringify(name)}`, { connector: 'awx' })
    const http = this.http
    const base = `${name}/`
    const list = this.#page(base)
    return {
      iterate: list,
      all: (opts) => collect(list(opts)),
      get: (id) => http.get(`${base}${encodeURIComponent(id)}/`),
      create: (body) => http.post(base, { body }),
      update: (id, body) => http.patch(`${base}${encodeURIComponent(id)}/`, { body }),
      replace: (id, body) => http.put(`${base}${encodeURIComponent(id)}/`, { body }),
      delete: async (id) => { await http.delete(`${base}${encodeURIComponent(id)}/`); return true },
    }
  }

  get jobTemplates() { return this.resource('job_templates') }
  get jobs() { return this.resource('jobs') }
  get inventories() { return this.resource('inventories') }
  get hosts() { return this.resource('hosts') }
  get groups() { return this.resource('groups') }
  get projects() { return this.resource('projects') }
  get credentials() { return this.resource('credentials') }
  get organizations() { return this.resource('organizations') }
  get workflowJobTemplates() { return this.resource('workflow_job_templates') }
  get schedules() { return this.resource('schedules') }

  /**
   * Launches a job template and returns the created job.
   * Anything passed here has to be enabled as "prompt on launch" on the
   * template itself, otherwise AWX accepts the request and silently ignores
   * the field. That is the most common reason a launch "works" but runs with
   * the wrong inventory.
   */
  async launch(templateId, { extraVars, limit, inventory, jobTags, skipTags, verbosity } = {}) {
    const body = {}
    if (extraVars) body.extra_vars = typeof extraVars === 'string' ? extraVars : JSON.stringify(extraVars)
    if (limit) body.limit = limit
    if (inventory) body.inventory = inventory
    if (jobTags) body.job_tags = Array.isArray(jobTags) ? jobTags.join(',') : jobTags
    if (skipTags) body.skip_tags = Array.isArray(skipTags) ? skipTags.join(',') : skipTags
    if (verbosity != null) body.verbosity = verbosity
    return this.http.post(`job_templates/${encodeURIComponent(templateId)}/launch/`, { body })
  }

  /** What the template will actually accept at launch. Worth checking first. */
  launchConfig(templateId) { return this.http.get(`job_templates/${encodeURIComponent(templateId)}/launch/`) }

  getJob(jobId) { return this.http.get(`jobs/${encodeURIComponent(jobId)}/`) }

  async jobStdout(jobId, format = 'txt') {
    const res = await this.http.get(`jobs/${encodeURIComponent(jobId)}/stdout/`, {
      query: { format },
      raw: true,
      headers: { accept: 'text/plain' },
    })
    return res.text()
  }

  async cancelJob(jobId) {
    await this.http.post(`jobs/${encodeURIComponent(jobId)}/cancel/`, { body: {} })
    return true
  }

  /**
   * Polls until the job reaches a terminal state.
   * Backs off rather than hammering: a long playbook polled every second is
   * thousands of pointless requests, and AWX is usually the least scalable
   * thing in the estate.
   */
  async waitForJob(jobId, { timeout = 30 * 60_000, interval = 2_000, maxInterval = 15_000, onTick } = {}) {
    const done = new Set(['successful', 'failed', 'error', 'canceled'])
    const deadline = Date.now() + timeout
    let wait = interval
    for (;;) {
      const job = await this.getJob(jobId)
      onTick?.(job)
      if (done.has(job?.status)) return job
      if (Date.now() > deadline) {
        throw new ConnectorError(`awx: job ${jobId} still ${job?.status} after ${Math.round(timeout / 1000)}s`, {
          connector: 'awx', detail: { status: job?.status }, retryable: false,
        })
      }
      await new Promise((r) => setTimeout(r, wait))
      wait = Math.min(wait * 1.5, maxInterval)
    }
  }

  /** Launch and wait, which is what most callers actually want. */
  async run(templateId, opts = {}) {
    const job = await this.launch(templateId, opts)
    return this.waitForJob(job.id ?? job.job, opts)
  }
}

export default AWX
