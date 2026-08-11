import '@/styles/global.css'
import '@/styles/refined.css'
import '@/styles/components.css'
import '@/styles/blog.css'
import '@/styles/ai-dock.css'

import AIDock from '@/components/AIDock'
import RevealProvider from '@/components/RevealProvider'

/* Canonical origin. Everything SEO-related derives from this, so per-post
   metadata and the sitemap can emit absolute URLs (relative OG URLs are
   ignored by most social crawlers). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulplabs.ai'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'pulplabs.ai — Get to the pulp of what your business needs from AI',
    // Pages set only their own title; this appends the brand.
    template: '%s — PulpLabs',
  },
  description:
    'PulpLabs is an AI consultancy and engineering firm. Operational accelerators for enterprises, growth solutions for small teams, and the hands-on enablement that makes both stick.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'PulpLabs',
    url: SITE_URL,
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF6B1A',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <RevealProvider />
        {children}
        <AIDock />
      </body>
    </html>
  )
}
