'use client'

import { useReveal } from '@/lib/apple-motion'

/* Mounted once in the layout; renders nothing. */
export default function Reveal() {
  useReveal()
  return null
}
