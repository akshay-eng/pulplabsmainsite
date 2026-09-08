/* Pagination, as an async iterator.
 *
 * Every provider here pages differently: ServiceNow by offset, Box by offset
 * with a hard 10,000 ceiling, Confluence and Graph by opaque cursor, AWX by
 * page number, Chef not at all. Callers should not care. They write
 *
 *   for await (const item of client.incidents.iterate({ query }))
 *
 * and the connector decides how the pages were fetched.
 *
 * `limit` caps the total number of items yielded, not the page size, because
 * "give me the first 50 matches" is the question people actually have.
 */
export async function* paginate(fetchPage, { limit = Infinity } = {}) {
  let cursor
  let yielded = 0
  /* Guards a provider that returns the same cursor forever, which is a real
     failure mode and otherwise spins until the process is killed. */
  const seen = new Set()

  while (yielded < limit) {
    const { items, next } = await fetchPage(cursor)
    for (const item of items ?? []) {
      yield item
      if (++yielded >= limit) return
    }
    if (!next || (items ?? []).length === 0) return
    const key = String(next)
    if (seen.has(key)) return
    seen.add(key)
    cursor = next
  }
}

/** Drains an async iterator into an array. */
export async function collect(iter, limit = Infinity) {
  const out = []
  for await (const item of iter) {
    out.push(item)
    if (out.length >= limit) break
  }
  return out
}
