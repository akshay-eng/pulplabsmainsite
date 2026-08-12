import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="ft">
      <div className="shell-wide">
        <div className="ft-top">
          <p className="d3 ft-line">
            Intelligence is abundant.
            <br />
            <span className="dim">Deployment is not.</span>
          </p>
          <Link href="/contact" className="btn">Start a project</Link>
        </div>

        <div className="ft-cols">
          <div>
            <p className="mono">Company</p>
            <ul>
              <li><Link href="/">Overview</Link></li>
              <li><Link href="/services">Capabilities</Link></li>
              <li><Link href="/team">Team</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="mono">Platforms</p>
            <ul>
              <li>Claude</li>
              <li>OpenAI</li>
              <li>Copilot Studio</li>
              <li>IBM watsonx</li>
            </ul>
          </div>
          <div>
            <p className="mono">Contact</p>
            <ul>
              <li><a href="mailto:hello@pulplabs.ai">hello@pulplabs.ai</a></li>
            </ul>
          </div>
        </div>

        <div className="ft-base">
          <p className="mono">© {new Date().getFullYear()} PulpLabs</p>
          <p className="mono">Deployed inside your estate</p>
        </div>
      </div>
    </footer>
  )
}
