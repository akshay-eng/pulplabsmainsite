import Link from 'next/link'

/* The primary call to action, routed by device.
 *
 * On a touch device it opens WhatsApp with a starter message already typed; on
 * a desktop it goes to the contact form, because wa.me on desktop lands people
 * in WhatsApp Web, which many visitors are not signed into.
 *
 * The split is done in CSS with BOTH links rendered, not with matchMedia in an
 * effect. A JS check runs after hydration, so the wrong destination would be
 * live for the first moments after paint — and the first moments are exactly
 * when an impatient visitor taps. CSS decides before anything renders.
 *
 * With NEXT_PUBLIC_WHATSAPP unset, the WhatsApp half is not rendered at all and
 * every device gets the contact page. That is the safe default: a wrong number
 * would route real enquiries to a stranger.
 */
const NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP ?? '').replace(/[^0-9]/g, '')

export function whatsappHref(message) {
  if (!NUMBER) return null
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`
}

export default function StartCta({
  children,
  message = "Hi PulpLabs, I'd like to book a 30-minute call about an AI project.",
  href = '/contact',
  className = 'btn',
}) {
  const wa = whatsappHref(message)

  if (!wa) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <>
      <a href={wa} className={`${className} cta-touch`} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
      <Link href={href} className={`${className} cta-desk`}>
        {children}
      </Link>
    </>
  )
}
