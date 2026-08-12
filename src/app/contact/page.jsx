import Contact from '@/views/apple/Contact'

export const metadata = {
  title: 'Contact',
  description:
    'Thirty minutes with an engineer, no deck. You will leave with a straight answer on whether AI helps here — even if that answer is no.',
  alternates: { canonical: '/contact' },
}

export default function Page() {
  return <Contact />
}
