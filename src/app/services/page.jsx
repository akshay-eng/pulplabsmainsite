export const metadata = {
  title: 'Services',
  description: 'Five practice areas: advisory, enterprise accelerators, small business solutions, enablement and managed AI operations. No fixed menus, no rate cards — every engagement is scoped from discovery.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services — PulpLabs',
    description: 'Five practice areas: advisory, enterprise accelerators, small business solutions, enablement and managed AI operations. No fixed menus, no rate cards — every engagement is scoped from discovery.',
    url: '/services',
  },
}

import Services from '@/views/Services'
import { listPublishedCases } from '@/lib/cases'

/* Case studies are read here, on the server, and handed to the client view —
   the view needs hooks, so it cannot query SQLite itself. */
export default async function Page() {
  return <Services cases={listPublishedCases()} />
}
