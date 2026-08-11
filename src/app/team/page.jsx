export const metadata = {
  title: 'Team',
  description: 'A six-person team of AI architects, delivery leads and ML engineers, certified across Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate.',
  alternates: { canonical: '/team' },
  openGraph: {
    title: 'Team — PulpLabs',
    description: 'A six-person team of AI architects, delivery leads and ML engineers, certified across Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate.',
    url: '/team',
  },
}

import Team from '@/views/Team'

export default function Page() {
  return <Team />
}
