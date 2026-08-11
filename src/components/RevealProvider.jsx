'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useRevealObserver } from '@/lib/motion'

/* Mounted once in the root layout. Renders nothing — it exists to run the two
   app-wide effects that used to live in App.jsx:
     1. the scroll-reveal observer
     2. hash scrolling (/#contact), which the Next router does not handle

   Deliberately avoids useSearchParams(): reading it opts every page into a
   Suspense boundary and pushes them to client-side rendering, which would
   undo the reason for moving to Next in the first place. pathname plus a
   hashchange listener covers the same cases. */
function HashScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const scrollToHash = () => {
      const { hash } = window.location
      if (!hash) return
      // Wait a frame — on a fresh navigation the target may not be painted yet.
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      })
    }

    scrollToHash()
    // Same-page hash links (/#contact while already on /) don't change pathname.
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [pathname])

  return null
}

export default function RevealProvider() {
  useRevealObserver()
  return <HashScroll />
}
