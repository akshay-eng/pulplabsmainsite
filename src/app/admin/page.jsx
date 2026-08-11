import Link from 'next/link'
import { listAll } from '@/lib/posts'
import { deletePostAction } from './actions'

export const metadata = { title: 'Posts', robots: { index: false, follow: false } }

function fmt(iso) {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}

export default async function AdminPosts({ searchParams }) {
  const params = await searchParams
  const posts = listAll()
  const published = posts.filter((p) => p.status === 'published').length

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Posts</h1>
          <p className="admin-sub">
            {posts.length} total · {published} published · {posts.length - published} draft
          </p>
        </div>
        <Link href="/admin/posts/new" className="admin-btn primary">New post</Link>
      </div>

      {params?.deleted && <div className="admin-flash">Post deleted.</div>}

      {posts.length === 0 ? (
        <p className="admin-empty">
          Nothing here yet. <Link href="/admin/posts/new">Write the first post</Link>.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th><th>Category</th><th>Status</th><th>Published</th><th />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/admin/posts/${p.id}`} className="admin-title-link">{p.title}</Link>
                  <div className="admin-slug">/blog/{p.slug}</div>
                </td>
                <td>{p.category || '—'}</td>
                <td><span className={`admin-pill ${p.status}`}>{p.status}</span></td>
                <td className="admin-date">{fmt(p.published_at)}</td>
                <td className="admin-row-actions">
                  {p.status === 'published' && (
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="admin-btn ghost sm">View</a>
                  )}
                  <Link href={`/admin/posts/${p.id}`} className="admin-btn ghost sm">Edit</Link>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="admin-btn danger sm">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
