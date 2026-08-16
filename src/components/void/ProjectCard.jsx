import Link from 'next/link'

/* A card for something that exists as a public repository, as opposed to
   SolCard, which is for work we scope and build.

   The differences are deliberate rather than cosmetic. The destination is
   GitHub, so the link is a plain <a> with the external-link affordance and
   rel="noreferrer" — using next/link for an off-site URL buys nothing and
   quietly implies an in-app route. The badge says the build stage instead of
   'Accelerator / Built to scope', because neither of those claims is true of
   an open repository. And the stack row is listed, because for this audience
   the runtimes it targets IS the description. */
export default function ProjectCard({ project, i = 0 }) {
  const { name, tagline, blurb, stack, stage, repo, site, capability, art } = project

  return (
    <li className="proj" data-r style={{ '--rd': `${i * 55}ms` }}>
      <span className="proj-art" aria-hidden="true">
        <img src={art} alt="" loading="lazy" decoding="async" />
        <span className={`sol-status is-${stage === 'released' ? 'production' : 'scope'} is-float`}>
          {stage === 'released' ? 'Released' : 'In build'}
        </span>
      </span>

      <span className="proj-body">
        <span className="proj-head">
          <span className="h4 proj-n">{name}</span>
        </span>
        <span className="body proj-tag">{tagline}</span>
        <span className="body proj-d">{blurb}</span>

        <span className="proj-stack">
          {stack.map((s) => (
            <span className="proj-chip" key={s}>{s}</span>
          ))}
        </span>

        <span className="proj-links">
          {/* Repository first — for an open project it is the primary artefact,
              and the thing this audience opens before anything else. */}
          <a className="link proj-link" href={repo} target="_blank" rel="noreferrer">
            Repository
            <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {site && (
            <a className="link proj-link is-dim" href={site} target="_blank" rel="noreferrer">
              Project site
              <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}

          {/* Only accelerators carry this: the engagement the repository
              shortens, so the tab connects to something we actually sell. */}
          {capability && (
            <Link className="link proj-link is-dim" href={`/services/${capability}`}>
              The engagement it shortens
              <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden="true">
                <path d="M1 1l4.5 4.5L1 10" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </span>
      </span>
    </li>
  )
}
