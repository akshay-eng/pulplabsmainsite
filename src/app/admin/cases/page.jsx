import Link from 'next/link'
import { listAllCases } from '@/lib/cases'
import { deleteCaseAction } from '../actions'

export const metadata = { title: 'Case studies', robots: { index: false, follow: false } }

export default async function AdminCases({ searchParams }) {
  const params = await searchParams
  const items = listAllCases()
  const published = items.filter((c) => c.status === 'published').length

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Case studies</h1>
          <p className="admin-sub">
            {items.length} total · {published} published · ordered by position, lowest first
          </p>
        </div>
        <Link href="/admin/cases/new" className="admin-btn primary">New case study</Link>
      </div>

      {params?.deleted && <div className="admin-flash">Case study deleted.</div>}

      {items.length === 0 ? (
        <p className="admin-empty">
          Nothing yet. <Link href="/admin/cases/new">Add the first one</Link>.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Client</th><th>Status</th><th>Order</th><th /></tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/admin/cases/${c.id}`} className="admin-title-link">{c.title}</Link>
                  <div className="admin-slug">/case-studies/{c.slug}</div>
                </td>
                <td>
                  {c.client}
                  {c.industry && <div className="admin-slug">{c.industry}</div>}
                </td>
                <td><span className={`admin-pill ${c.status}`}>{c.status}</span></td>
                <td className="admin-date">{c.position}</td>
                <td className="admin-row-actions">
                  {c.status === 'published' && (
                    <a href={`/case-studies/${c.slug}`} target="_blank" rel="noreferrer" className="admin-btn ghost sm">View</a>
                  )}
                  <Link href={`/admin/cases/${c.id}`} className="admin-btn ghost sm">Edit</Link>
                  <form action={deleteCaseAction}>
                    <input type="hidden" name="id" value={c.id} />
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
