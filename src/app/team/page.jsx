import Team from '@/views/void/Team'

export const metadata = {
  title: 'Team',
  description:
    'The people who build it: formally accredited on Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate. The person who scopes your engagement is the person who builds it.',
  alternates: { canonical: '/team' },
}

export default function Page() {
  return <Team />
}
