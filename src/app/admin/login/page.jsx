import LoginForm from '@/components/admin/LoginForm'

export const metadata = { title: 'Sign in', robots: { index: false, follow: false } }

export default async function LoginPage({ searchParams }) {
  const params = await searchParams
  return <LoginForm next={typeof params?.next === 'string' ? params.next : '/admin'} />
}
