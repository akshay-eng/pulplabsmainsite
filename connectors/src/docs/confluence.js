import { HttpClient } from '../core/http.js'
import { paginate, collect } from '../core/paginate.js'
import { ValidationError } from '../core/errors.js'

/* Confluence Cloud.
 *
 * Two APIs, on purpose. v2 (/wiki/api/v2) is the current one and is where
 * pages, spaces and CRUD live. Search is still only on v1 (/wiki/rest/api),
 * because CQL was never ported, so this connector talks to both rather than
 * pretending otherwise.
 *
 * Auth is basic with an Atlassian API token as the password, not the account
 * password: https://id.atlassian.com/manage-profile/security/api-tokens
 *
 * v2 pages cursor-based: the next URL arrives opaque in _links.next and is
 * followed verbatim rather than reconstructed.
 */
export class Confluence {
  /**
   * @param {object} cfg
   * @param {string} cfg.site      'yourco' or https://yourco.atlassian.net
   * @param {string} cfg.email
   * @param {string} cfg.apiToken
   */
  constructor(cfg) {
    if (!cfg?.site || !cfg.email || !cfg.apiToken) {
      throw new ValidationError('confluence: site, email and apiToken are required', { connector: 'confluence' })
    }
    const base = String(cfg.site).startsWith('http')
      ? String(cfg.site).replace(/\/+$/, '')
      : `https://${cfg.site}.atlassian.net`
    this.siteUrl = base

    const auth = () => ({
      authorization: 'Basic ' + Buffer.from(`${cfg.email}:${cfg.apiToken}`).toString('base64'),
    })
    const common = { connector: 'confluence', fetch: cfg.fetch, timeout: cfg.timeout, authHeaders: auth }
    this.v2 = new HttpClient({ ...common, baseUrl: `${base}/wiki/api/v2` })
    this.v1 = new HttpClient({ ...common, baseUrl: `${base}/wiki/rest/api` })
  }

  async ping() {
    const r = await this.v2.get('spaces', { query: { limit: 1 } })
    return { ok: true, site: this.siteUrl, spaces: (r?.results ?? []).length }
  }

  /* Cursor pagination. The next link is absolute-ish and site-relative, so it
     is resolved against the site rather than the API base. */
  #cursor(path, query, pick = (r) => r.results) {
    return (opts = {}) =>
      paginate(
        async (next) => {
          const r = next
            ? await this.v2.get(next.startsWith('http') ? next : this.siteUrl + next)
            : await this.v2.get(path, { query: { ...query, ...opts.query, limit: opts.pageSize ?? 50 } })
          return { items: pick(r) ?? [], next: r?._links?.next ?? null }
        },
        { limit: opts.limit ?? Infinity },
      )
  }

  /* ---- spaces ---- */
  spaces(opts = {}) { return this.#cursor('spaces', {})(opts) }
  async allSpaces(opts) { return collect(this.spaces(opts)) }

  /* ---- pages ---- */

  /**
   * body-format storage returns Confluence's own XHTML markup. That is the
   * right choice for a connector: it is lossless and can be converted
   * downstream, whereas view format has already had macros rendered away.
   */
  async getPage(id, { bodyFormat = 'storage' } = {}) {
    return this.v2.get(`pages/${encodeURIComponent(id)}`, { query: { 'body-format': bodyFormat } })
  }

  listPages(opts = {}) {
    const query = { 'space-id': opts.spaceId, status: opts.status ?? 'current', 'body-format': opts.bodyFormat }
    return this.#cursor('pages', query)(opts)
  }

  async createPage({ spaceId, title, body, parentId, status = 'current', representation = 'storage' }) {
    return this.v2.post('pages', {
      body: {
        spaceId, title, parentId, status,
        body: { representation, value: body },
      },
    })
  }

  /* Confluence requires the CURRENT version number plus one on every update,
     and rejects the write otherwise. Fetching it here rather than making every
     caller do it removes the most common cause of a failed update. */
  async updatePage(id, { title, body, representation = 'storage', version, status = 'current' }) {
    let next = version
    if (next == null) {
      const current = await this.getPage(id)
      next = (current?.version?.number ?? 0) + 1
      title ??= current?.title
    }
    return this.v2.put(`pages/${encodeURIComponent(id)}`, {
      body: {
        id, status, title,
        body: { representation, value: body },
        version: { number: next, message: 'Updated via pulplabs connector' },
      },
    })
  }

  async deletePage(id, { purge = false } = {}) {
    await this.v2.delete(`pages/${encodeURIComponent(id)}`, { query: purge ? { purge: true } : undefined })
    return true
  }

  /* ---- search (v1: CQL never made it to v2) ---- */

  /**
   * @param {string} cql e.g. `type=page and text ~ "incident runbook"`
   */
  search(cql, opts = {}) {
    const pageSize = opts.pageSize ?? 25
    return paginate(
      async (start = 0) => {
        const r = await this.v1.get('search', { query: { cql, start, limit: pageSize } })
        const items = r?.results ?? []
        return { items, next: items.length === pageSize ? start + pageSize : null }
      },
      { limit: opts.limit ?? Infinity },
    )
  }

  async searchAll(cql, opts) { return collect(this.search(cql, opts)) }

  /* ---- attachments ---- */
  attachments(pageId, opts = {}) {
    return this.#cursor(`pages/${encodeURIComponent(pageId)}/attachments`, {})(opts)
  }

  async downloadAttachment(downloadPath) {
    const res = await this.v2.get(
      downloadPath.startsWith('http') ? downloadPath : this.siteUrl + downloadPath,
      { raw: true, headers: { accept: '*/*' } },
    )
    return res.arrayBuffer()
  }

  /** CQL string escaping. An unescaped quote turns a search into a syntax error. */
  static cql(value) { return `"${String(value).replace(/(["\\])/g, '\\$1')}"` }
}

export default Confluence
