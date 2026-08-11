import { notFound } from 'next/navigation'
import CaseEditor from '@/components/admin/CaseEditor'
import { getCaseById } from '@/lib/cases'

export const metadata = { title: 'Edit case study', robots: { index: false, follow: false } }

export default async function EditCase({ params, searchParams }) {
  const { id } = await params
  const sp = await searchParams
  const item = getCaseById(Number(id))
  if (!item) notFound()
  return <CaseEditor item={item} saved={Boolean(sp?.saved)} />
}
