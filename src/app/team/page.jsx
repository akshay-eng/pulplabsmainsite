import { permanentRedirect } from 'next/navigation'

/* The roster moved onto /about, where it sits with the engagement model and the
   accreditation rather than standing alone. Kept as a permanent redirect so old
   links and anything already indexed still land somewhere sensible. */
export default function Page() {
  permanentRedirect('/about')
}
