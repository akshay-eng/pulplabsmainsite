import { revalidatePath } from 'next/cache'
import { getById, getBySlug, updatePost, deletePost } from '@/lib/posts'
import { guard, json, shape } from '@/lib/api'

export const dynamic = 'force-dynamic'

/** Accepts either a numeric id or a slug, so automation can use whichever it has. */
function find(idOrSlug, { includeDrafts }) {
  return /^\d+$/.test(idOrSlug) ? getById(Number(idOrSlug)) : getBySlug(idOrSlug, { includeDrafts })
}

function revalidateAll(slug) {
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  if (slug) revalidatePath(`/blog/${slug}`)
  revalidatePath('/sitemap.xml')
  revalidatePath('/feed.xml')
}

export async function GET(request, { params }) {
  const { idOrSlug } = await params
  const authed = !guard(request)
  const post = find(idOrSlug, { includeDrafts: authed })
  if (!post || (post.status !== 'published' && !authed)) return json({ error: 'Not found.' }, 404)
  return json({ post: shape(post) })
}

/** PATCH — partial update. Omitted fields keep their current value. */
export async function PATCH(request, { params }) {
  const denied = guard(request)
  if (denied) return denied

  const { idOrSlug } = await params
  const existing = find(idOrSlug, { includeDrafts: true })
  if (!existing) return json({ error: 'Not found.' }, 404)

  let input
  try {
    input = await request.json()
  } catch {
    return json({ error: 'Body must be valid JSON.' }, 400)
  }

  const { post, errors } = updatePost(existing.id, input)
  if (errors) return json({ errors }, 422)

  revalidateAll(post.slug)
  if (post.slug !== existing.slug) revalidateAll(existing.slug)
  return json({ post: shape(post) })
}

export async function DELETE(request, { params }) {
  const denied = guard(request)
  if (denied) return denied

  const { idOrSlug } = await params
  const existing = find(idOrSlug, { includeDrafts: true })
  if (!existing) return json({ error: 'Not found.' }, 404)

  deletePost(existing.id)
  revalidateAll(existing.slug)
  return json({ deleted: true, slug: existing.slug })
}
