import Home from '@/views/void/Home'
import { listPublishedCases } from '@/lib/cases'

export const revalidate = 60

export default function Page() {
  return <Home cases={listPublishedCases({ limit: 8 })} />
}
