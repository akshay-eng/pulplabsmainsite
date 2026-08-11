import { guard, json } from '@/lib/api'
import { getSession } from '@/lib/auth'
import { saveUpload, COVER_RATIO, COVER_HINT } from '@/lib/uploads'

export const dynamic = 'force-dynamic'

/* POST /api/upload — multipart form with a `file` field.
 *
 * Accepts either an admin session (the editor's picker) or a bearer token
 * (automation), so the same endpoint serves both paths. */
export async function POST(request) {
  const session = await getSession()
  if (!session) {
    const denied = guard(request)
    if (denied) return denied
  }

  let form
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'Expected multipart/form-data with a "file" field.' }, 400)
  }

  const result = await saveUpload(form.get('file'))
  if (result.error) return json(result, 422)

  // Advisory only — a wrong ratio still uploads, it just warns. Rejecting it
  // would strand someone with the only image they have.
  let warning
  if (result.ratio && Math.abs(result.ratio - COVER_RATIO) > 0.25) {
    warning = `That image is ${result.width}×${result.height} (${result.ratio}:1). Covers are cropped to ${COVER_HINT}, so the edges will be trimmed.`
  }

  return json({ ...result, warning }, 201)
}
