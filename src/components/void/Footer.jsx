import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="ft">
      <div className="shell-wide">
        <div className="ft-top">
          <div>
            <p className="d3 ft-line">pulplabs.ai</p>
            <p className="body ft-blurb">
              AI consultancy and engineering. Accelerators, solutions and enablement for enterprises and small
              businesses.
            </p>
          </div>
          <Link href="/contact" className="btn">Book a call</Link>
        </div>

        <div className="ft-cols">
          <nav aria-label="Services">
            <p className="mono">Services</p>
            <ul>
              <li><Link href="/services">Service catalogue</Link></li>
              <li><Link href="/services#accelerators">Enterprise accelerators</Link></li>
              <li><Link href="/services#small-business">Small business solutions</Link></li>
              <li><Link href="/services#work">Case studies</Link></li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="mono">Company</p>
            <ul>
              <li><Link href="/team">Team</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li>
                <a href="https://github.com/pulplabs" target="_blank" rel="noreferrer">GitHub</a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="mono">Contact</p>
            <ul>
              <li><Link href="/contact">Book a call</Link></li>
              <li><a href="mailto:hello@pulplabs.ai">hello@pulplabs.ai</a></li>
            </ul>
          </div>
        </div>

        <div className="ft-base">
          <p className="mono">© {new Date().getFullYear()} PulpLabs. All rights reserved.</p>
          <p className="mono">Deployed inside your estate</p>
        </div>
      </div>
    </footer>
  )
}
