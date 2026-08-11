import { revalidatePath } from 'next/cache'
import { listAll, listPublished, createPost } from '@/lib/posts'
import { guard, json, shape } from '@/lib/api'

export const dynamic = 'force-dynamic'

/* GET /api/posts
 *   ?status=published|draft|all   (default published)
 *   ?category= &tag= &limit= &offset=
 *
 * Reading published posts is public — it's the same content the blog serves.
 * Drafts require the bearer token. */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'published'
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200)
  const offset = Number(searchParams.get('offset')) || 0

  if (status !== 'published') {
    const denied = guard(request)
    if (denied) return denied
    const all = listAll().filter((p) => status === 'all' || p.status === status)
    return json({ posts: all.slice(offset, offset + limit).map(shape), total: all.length })
  }

  const posts = listPublished({
    limit,
    offset,
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
  })
  return json({ posts: posts.map(shape), total: posts.length })
}

/* POST /api/posts — create. Body is JSON matching the post fields. */
export async function POST(request) {
  const denied = guard(request)
  if (denied) return denied

  let input
  try {
    input = await request.json()
  } catch {
    return json({ error: 'Body must be valid JSON.' }, 400)
  }

  const { post, errors } = createPost(input)
  if (errors) return json({ errors }, 422)

  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')
  revalidatePath('/feed.xml')

  return json({ post: shape(post) }, 201)
}
