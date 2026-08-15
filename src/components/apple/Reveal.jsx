'use client'

import { useReveal } from '@/lib/apple-motion'
import { useRevealObserver } from '@/lib/motion'

/* Mounted once in the layout; covers the current [data-r] convention and the
   legacy blog's [data-reveal] convention, then renders nothing. */
export default function Reveal() {
  useReveal()
  useRevealObserver()
  return null
}
