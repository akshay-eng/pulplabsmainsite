import About from '@/views/void/About'

export const metadata = {
  title: 'About',
  description:
    'PulpLabs is a six-person AI consultancy. How an engagement runs, the three things we will not trade, the team you would actually work with, and what we are formally accredited on.',
  alternates: { canonical: '/about' },
}

export default function Page() {
  return <About />
}
