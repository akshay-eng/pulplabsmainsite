import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export function GET() {
  try {
    db.prepare('SELECT 1').get()
    return Response.json({ ok: true }, { headers: { 'cache-control': 'no-store' } })
  } catch {
    return Response.json({ ok: false }, { status: 503, headers: { 'cache-control': 'no-store' } })
  }
}
