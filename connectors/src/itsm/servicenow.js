import { HttpClient } from '../core/http.js'
import { paginate, collect } from '../core/paginate.js'
import { ConnectorError, ValidationError } from '../core/errors.js'

/* ServiceNow.
 *
 * Built on the Table API, which is deliberate: it is one uniform CRUD surface
 * over every table in the instance, so incidents, changes, problems, the CMDB
 * and anything custom all come free from the same code. A connector with a
 * hand-written method per table would cover less and rot faster.
 *
 * Auth is basic by default because that is what a PDI gives you. OAuth is
 * supported for anything real: basic auth sends the password on every single
 * request, and ServiceNow instances are usually reachable from the internet.
 *
 * Docs: /api/now/table/{table}, /api/now/attachment
 */

const DEFAULT_FIELDS = {
  incident: 'sys_id,number,short_description,description,state,priority,urgency,impact,assigned_to,assignment_group,caller_id,opened_at,closed_at,sys_updated_on',
  change_request: 'sys_id,number,short_description,description,state,type,risk,impact,start_date,end_date,assigned_to,assignment_group,sys_updated_on',
  problem: 'sys_id,number,short_description,description,state,priority,assigned_to,sys_updated_on',
}

export class ServiceNow {
  /**
   * @param {object} cfg
   * @param {string} cfg.instance   'dev12345' or a full https URL
   * @param {string} [cfg.username]
   * @param {string} [cfg.password]
   * @param {string} [cfg.token]    OAuth2 access token; wins over basic auth
   * @param {typeof fetch} [cfg.fetch]
   */
  constructor(cfg) {
    if (!cfg?.instance) throw new ValidationError('servicenow: instance is required', { connector: 'servicenow' })
    if (!cfg.token && !(cfg.username && cfg.password)) {
      throw new ValidationError('servicenow: needs either token, or username and password', { connector: 'servicenow' })
    }
    const base = String(cfg.instance).startsWith('http')
      ? String(cfg.instance).replace(/\/+$/, '')
      : `https://${cfg.instance}.service-now.com`

    this.instanceUrl = base
    this.http = new HttpClient({
      baseUrl: `${base}/api/now`,
      connector: 'servicenow',
      fetch: cfg.fetch,
      timeout: cfg.timeout,
      authHeaders: () =>
        cfg.token
          ? { authorization: `Bearer ${cfg.token}` }
          : { authorization: 'Basic ' + Buffer.from(`${cfg.username}:${cfg.password}`).toString('base64') },
    })
  }

  /** Cheap authenticated call, for verifying credentials. */
  async ping() {
    const r = await this.http.get('table/sys_user', {
      query: { sysparm_limit: 1, sysparm_fields: 'sys_id' },
    })
    return { ok: true, instance: this.instanceUrl, sampled: (r?.result ?? []).length }
  }

  /**
   * Full CRUD against any table. This is the whole connector; everything else
   * is a named shortcut onto it.
   * @param {string} name  e.g. 'incident', 'change_request', 'cmdb_ci_server'
   */
  table(name) {
    if (!/^[a-z0-9_]+$/i.test(name)) {
      throw new ValidationError(`servicenow: suspicious table name ${JSON.stringify(name)}`, { connector: 'servicenow' })
    }
    const http = this.http
    const base = `table/${name}`

    /* display_value 'all' returns both the raw value and the resolved label for
       every reference field. Slightly larger payloads, but without it a caller
       gets a sys_id where they expected a person's name, which is the single
       most common surprise in this API. */
    const shape = (opts) => ({
      sysparm_display_value: opts?.displayValue ?? 'all',
      sysparm_exclude_reference_link: true,
      sysparm_fields: opts?.fields ?? DEFAULT_FIELDS[name],
    })

    return {
      /** One page. Prefer iterate() unless you are handling offsets yourself. */
      async list(opts = {}) {
        const r = await http.get(base, {
          query: {
            ...shape(opts),
            sysparm_query: opts.query,
            sysparm_limit: opts.limit ?? 100,
            sysparm_offset: opts.offset ?? 0,
          },
        })
        return r?.result ?? []
      },

      /** Every match, paged transparently. */
      iterate(opts = {}) {
        const page = opts.pageSize ?? 100
        return paginate(
          async (offset = 0) => {
            const r = await http.get(base, {
              query: {
                ...shape(opts),
                sysparm_query: opts.query,
                sysparm_limit: page,
                sysparm_offset: offset,
              },
            })
            const items = r?.result ?? []
            return { items, next: items.length === page ? offset + page : null }
          },
          { limit: opts.limit ?? Infinity },
        )
      },

      all(opts = {}) { return collect(this.iterate(opts)) },

      async get(sysId, opts = {}) {
        const r = await http.get(`${base}/${encodeURIComponent(sysId)}`, { query: shape(opts) })
        return r?.result ?? null
      },

      /* Aggregate API, so counting does not mean pulling every row back.
         Absolute URL because this one lives under /api/now/stats rather than
         /api/now/table, and a relative "../" hop reads as a mistake. */
      async count(query) {
        const r = await http.get(`${http.baseUrl}/stats/${name}`, {
          query: { sysparm_query: query, sysparm_count: true },
        })
        return Number(r?.result?.stats?.count ?? 0)
      },

      async create(fields) {
        const r = await http.post(base, { body: fields })
        return r?.result ?? null
      },

      /* PATCH, not PUT: PUT replaces the record and silently blanks any field
         the caller did not send. */
      async update(sysId, fields) {
        const r = await http.patch(`${base}/${encodeURIComponent(sysId)}`, { body: fields })
        return r?.result ?? null
      },

      async replace(sysId, fields) {
        const r = await http.put(`${base}/${encodeURIComponent(sysId)}`, { body: fields })
        return r?.result ?? null
      },

      async delete(sysId) {
        await http.delete(`${base}/${encodeURIComponent(sysId)}`)
        return true
      },
    }
  }

  get incidents() { return this.table('incident') }
  get changes() { return this.table('change_request') }
  get problems() { return this.table('problem') }
  get tasks() { return this.table('task') }
  get users() { return this.table('sys_user') }
  get groups() { return this.table('sys_user_group') }
  /** @param {string} [ciClass] any cmdb_ci_* table; the base class by default */
  cmdb(ciClass = 'cmdb_ci') { return this.table(ciClass) }

  /* ---- attachments -------------------------------------------------------
     A separate API from tables, and the reason a "just use the Table API"
     connector is not quite enough: incident bodies routinely carry the actual
     evidence as attachments. */

  async listAttachments(table, sysId) {
    const r = await this.http.get('attachment', {
      query: { sysparm_query: `table_name=${table}^table_sys_id=${sysId}` },
    })
    return r?.result ?? []
  }

  /** @returns {Promise<ArrayBuffer>} */
  async downloadAttachment(attachmentId) {
    const res = await this.http.get(`attachment/${encodeURIComponent(attachmentId)}/file`, {
      raw: true,
      headers: { accept: '*/*' },
    })
    return res.arrayBuffer()
  }

  async uploadAttachment(table, sysId, { fileName, contentType = 'application/octet-stream', data }) {
    const res = await this.http.post('attachment/file', {
      query: { table_name: table, table_sys_id: sysId, file_name: fileName },
      headers: { 'content-type': contentType },
      body: data instanceof ArrayBuffer ? Buffer.from(data) : data,
      raw: true,
    })
    const json = await res.json().catch(() => null)
    return json?.result ?? null
  }

  async deleteAttachment(attachmentId) {
    await this.http.delete(`attachment/${encodeURIComponent(attachmentId)}`)
    return true
  }

  /* Escapes a value for an encoded query. ServiceNow uses ^ and , as
     separators, and a caller interpolating a short_description containing one
     silently changes the meaning of their own query. */
  static escape(value) {
    return String(value).replace(/[\^,]/g, ' ')
  }
}

export default ServiceNow
