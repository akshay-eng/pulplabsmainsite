import '@/styles/void.css'
/* The dock is mounted globally, so its own stylesheet belongs here rather than
   with the legacy routes. apple.css restyles its surface further down. */
import '@/styles/ai-dock.css'

import AIDock from '@/components/AIDock'
import Reveal from '@/components/apple/Reveal'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulplabs.ai'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PulpLabs — Get to the pulp of what your business needs from AI',
    template: '%s — PulpLabs',
  },
  description:
    'An AI consultancy and engineering firm. Accelerators for enterprise operations, growth systems for small teams, and the enablement that makes either one stick.',
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', siteName: 'PulpLabs', url: SITE_URL },
  twitter: { card: 'summary_large_image' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // Matches the page ground so mobile browser chrome blends with the site
  themeColor: [
    { color: "#000000" },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Keyboard users should never have to tab the whole nav on every page */}
        <a className="skip" href="#main">Skip to content</a>
        <Reveal />
        {children}
        <AIDock />
      </body>
    </html>
  )
}
