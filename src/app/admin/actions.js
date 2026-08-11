'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createPost, updatePost, deletePost, getById } from '@/lib/posts'
import { createCase, updateCase, deleteCase, getCaseById } from '@/lib/cases'
import { createSession, destroySession, requireSession, verifyCredentials } from '@/lib/auth'

/* Server actions for the admin.
 *
 * Every mutating action calls requireSession() itself. The middleware already
 * gates /admin, but server actions are POST endpoints reachable by their own
 * ids — treating middleware as the only check is how these get exploited. */

export async function loginAction(_prev, formData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const next = formData.get('next') || '/admin'

  const admin = await verifyCredentials(email, password)
  // One vague message for both cases — telling the user which half was wrong
  // hands an attacker a way to enumerate accounts.
  if (!admin) return { error: 'Those credentials were not recognised.', email: String(email ?? '') }

  await createSession(admin)
  redirect(typeof next === 'string' && next.startsWith('/admin') ? next : '/admin')
}

export async function logoutAction() {
  await destroySession()
  redirect('/admin/login')
}

/** Revalidates every surface a post appears on, so a publish is visible at once. */
function revalidatePost(slug) {
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  if (slug) revalidatePath(`/blog/${slug}`)
  revalidatePath('/sitemap.xml')
  revalidatePath('/feed.xml')
}

export async function savePostAction(_prev, formData) {
  await requireSession()

  const id = formData.get('id')
  const input = {
    title: formData.get('title'),
    description: formData.get('description'),
    body: formData.get('body'),
    category: formData.get('category'),
    tags: formData.get('tags'),
    cover_image: formData.get('cover_image'),
    author: formData.get('author'),
    status: formData.get('status'),
    slug: formData.get('slug') || undefined,
  }

  const result = id ? updatePost(Number(id), input) : createPost(input)

  if (result.errors) {
    // Hand the values back so the form doesn't wipe what they typed.
    return { errors: result.errors, values: input }
  }

  revalidatePost(result.post.slug)
  redirect(`/admin/posts/${result.post.id}?saved=1`)
}

export async function deletePostAction(formData) {
  await requireSession()
  const id = Number(formData.get('id'))
  const post = getById(id)
  deletePost(id)
  revalidatePost(post?.slug)
  redirect('/admin?deleted=1')
}

/* ------------------------------------------------------- case studies --- */

function revalidateCase(slug) {
  revalidatePath('/services')
  revalidatePath('/case-studies/[slug]', 'page')
  if (slug) revalidatePath(`/case-studies/${slug}`)
  revalidatePath('/sitemap.xml')
}

export async function saveCaseAction(_prev, formData) {
  await requireSession()

  const id = formData.get('id')
  const input = {
    title: formData.get('title'),
    client: formData.get('client'),
    industry: formData.get('industry'),
    summary: formData.get('summary'),
    body: formData.get('body'),
    metrics: formData.get('metrics'),
    cover_image: formData.get('cover_image'),
    accent: formData.get('accent'),
    position: formData.get('position'),
    status: formData.get('status'),
    slug: formData.get('slug') || undefined,
  }

  const result = id ? updateCase(Number(id), input) : createCase(input)
  if (result.errors) return { errors: result.errors, values: input }

  revalidateCase(result.item.slug)
  redirect(`/admin/cases/${result.item.id}?saved=1`)
}

export async function deleteCaseAction(formData) {
  await requireSession()
  const id = Number(formData.get('id'))
  const existing = getCaseById(id)
  deleteCase(id)
  revalidateCase(existing?.slug)
  redirect('/admin/cases?deleted=1')
}
