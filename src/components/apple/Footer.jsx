import Link from 'next/link'

/* Apple's footer convention: small, quiet, legal-weight type. It is a
   destination for people who are looking for something specific, not a
   second navigation competing with the page. */
export default function Footer() {
  return (
    <footer className="foot">
      <div className="u-shell-wide">
        <div className="foot-cols">
          <div>
            <p className="t-eyebrow">PulpLabs</p>
            <p className="t-caption foot-blurb">
              An AI consultancy and engineering firm. We build the thing, then stay and run it.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="t-eyebrow">Explore</p>
            <ul>
              <li><Link href="/">Overview</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>

          <div>
            <p className="t-eyebrow">Get in touch</p>
            <ul>
              <li><a href="mailto:hello@pulplabs.ai">hello@pulplabs.ai</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-base">
          <p className="t-caption">© {new Date().getFullYear()} PulpLabs. All rights reserved.</p>
          <p className="t-caption">Certified across Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate.</p>
        </div>
      </div>
    </footer>
  )
}
