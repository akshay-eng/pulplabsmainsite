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

export default function Page() {
  return <Services />
}
