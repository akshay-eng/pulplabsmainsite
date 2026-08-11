import { notFound } from 'next/navigation'
import PostEditor from '@/components/admin/PostEditor'
import { getById } from '@/lib/posts'

export const metadata = { title: 'Edit post', robots: { index: false, follow: false } }

export default async function EditPost({ params, searchParams }) {
  const { id } = await params
  const sp = await searchParams
  const post = getById(Number(id))
  if (!post) notFound()
  return <PostEditor post={post} saved={Boolean(sp?.saved)} />
}
