/* Health endpoint for the Kubernetes probes.
 *
 * The readiness probe points here and the liveness probe does not, on purpose.
 * Readiness asks "should this pod receive traffic", and a pod whose SQLite file
 * has gone missing should not. Liveness asks "should this pod be killed", and
 * restarting the container does nothing for a broken volume: it just produces a
 * crash loop that hides the real fault. Liveness is a TCP check on the port
 * instead, so it only fires when the Node process is genuinely wedged.
 *
 * The database import is dynamic so that opening a connection is not a side
 * effect of the build collecting page data.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    db.prepare('select 1').get()
    return Response.json({ ok: true, uptime: Math.round(process.uptime()) })
  } catch (err) {
    console.error('[health] database unreachable:', err.message)
    return Response.json({ ok: false, error: 'database unreachable' }, { status: 503 })
  }
}
