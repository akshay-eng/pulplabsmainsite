import { notFound } from 'next/navigation'
import Industry from '@/views/void/Industry'
import { industries, getIndustry } from '@/data/industries'

export function generateStaticParams() {
  return industries.map((i) => ({ sector: i.slug }))
}

export async function generateMetadata({ params }) {
  const { sector } = await params
  const industry = getIndustry(sector)
  if (!industry) return { title: 'Industry not found' }

  return {
    title: industry.name,
    description: industry.lede,
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      type: 'website',
      title: `${industry.name} — PulpLabs`,
      description: industry.lede,
      url: `/industries/${industry.slug}`,
    },
  }
}

export default async function Page({ params }) {
  const { sector } = await params
  const industry = getIndustry(sector)
  if (!industry) notFound()

  return <Industry industry={industry} />
}
