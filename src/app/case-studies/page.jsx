import Work from '@/views/void/Work'
import { listPublishedCases } from '@/lib/cases'

export const metadata = {
  title: 'Client work',
  description:
    'Case studies from PulpLabs engagements, published only once the client has signed them off. What we shipped, and what it changed.',
  alternates: { canonical: '/case-studies' },
}

export const revalidate = 60

export default function Page() {
  return <Work cases={listPublishedCases({ limit: 24 })} />
}
