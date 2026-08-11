import { readUpload } from '@/lib/uploads'

/* Serves uploaded covers off the volume. They can't live in public/ — that is
 * baked into the image at build time and is not writable at runtime. */
export async function GET(_request, { params }) {
  const { name } = await params
  const file = await readUpload(name)
  if (!file) return new Response('Not found', { status: 404 })

  return new Response(file.body, {
    headers: {
      'Content-Type': file.type,
      'Content-Length': String(file.size),
      // Filenames are content-addressed by random suffix, so they never change
      // under a given URL — safe to cache hard.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
