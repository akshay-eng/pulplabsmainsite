import Link from 'next/link'
import { capabilities } from '@/data/capabilities'
import { industries } from '@/data/industries'

export default function Footer() {
  return (
    <footer className="ft">
      <div className="shell-wide">
        <div className="ft-top">
          <div>
            <p className="d3 ft-line">pulplabs.ai</p>
            <p className="body ft-blurb">
              An AI consultancy and engineering firm. We scope from discovery, build in weekly increments, and hand
              over what we build.
            </p>
          </div>
          <Link href="/contact" className="btn">Start a project</Link>
        </div>

        {/* The two axes carry into the footer: what we do, who we serve. */}
        <div className="ft-cols">
          <nav aria-label="Capabilities">
            <p className="mono">Capabilities</p>
            <ul>
              {capabilities.map((c) => (
                <li key={c.id}>
                  <Link href={`/services#${c.id}`}>{c.k}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Industries">
            <p className="mono">Industries</p>
            <ul>
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries/${i.slug}`}>{i.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Firm">
            <p className="mono">Firm</p>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/case-studies">Client work</Link></li>
              <li><Link href="/blog">Insights</Link></li>
              <li>
                <a href="https://github.com/pulplabs" target="_blank" rel="noreferrer">GitHub</a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="mono">Contact</p>
            <ul>
              <li><Link href="/contact">Start a project</Link></li>
              <li><a href="mailto:hello@pulplabs.ai">hello@pulplabs.ai</a></li>
            </ul>
          </div>
        </div>

        <div className="ft-base">
          <p className="mono">© {new Date().getFullYear()} PulpLabs. All rights reserved.</p>
          <p className="mono">Scoped from discovery</p>
        </div>
      </div>
    </footer>
  )
}
