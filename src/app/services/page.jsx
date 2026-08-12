import Services from '@/views/apple/Services'

export const metadata = {
  title: 'Services',
  description:
    'Five practice areas: advisory, enterprise accelerators, small business systems, enablement and managed AI operations. No fixed menus, no rate cards — every engagement is scoped from discovery.',
  alternates: { canonical: '/services' },
}

export default function Page() {
  return <Services />
}
