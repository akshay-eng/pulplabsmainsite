import Industries from '@/views/void/Industries'

export const metadata = {
  title: 'Industries',
  description:
    'The sectors PulpLabs has delivered in: enterprise IT operations, manufacturing, qualitative research and small business. Four sectors we have actually shipped in, not a list of verticals.',
  alternates: { canonical: '/industries' },
}

export default function Page() {
  return <Industries />
}
