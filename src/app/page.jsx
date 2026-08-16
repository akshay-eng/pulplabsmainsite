import Home from '@/views/void/Home'
import { listPublished } from '@/lib/posts'

export const revalidate = 60

export default function Page() {
  return <Home posts={listPublished({ limit: 3 })} />
}
