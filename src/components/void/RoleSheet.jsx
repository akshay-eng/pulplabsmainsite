import ApplyModal from '@/components/void/ApplyModal'

/* One role, laid out in full.
 *
 * This replaced an accordion. Collapsing a job description is a pattern for
 * lists of twenty, where the value is scanning titles; with one or two roles it
 * only puts a click between someone and the thing they came to read, and the
 * page looks empty until they find it.
 *
 * No 'use client' here. Nothing on this sheet has state now that nothing
 * collapses, so it renders on the server and only ApplyModal ships JavaScript.
 *
 * The facts rail is sticky on a wide screen so the Apply button stays reachable
 * however far down the requirements someone has read.
 */
const pad = (n) => String(n).padStart(2, '0')

export default function RoleSheet({ role }) {
  return (
    <article className="rs">
      <header className="rs-head">
        <p className="mono rs-k">{role.team}</p>
        <h2 className="d2 rs-t">{role.title}</h2>
        <p className="lede rs-s">{role.summary}</p>
      </header>

      <div className="rs-body">
        <aside className="rs-rail">
          <dl className="rs-facts">
            <div>
              <dt className="mono">Type</dt>
              <dd>{role.type}</dd>
            </div>
            <div>
              <dt className="mono">Length</dt>
              <dd>{role.length}</dd>
            </div>
            <div>
              <dt className="mono">Location</dt>
              <dd>{role.location}</dd>
            </div>
          </dl>
          <ApplyModal role={role} />
        </aside>

        <div className="rs-main">
          <p className="body rs-about">{role.about}</p>

          {/* The requirements carry the stack, so the technology name is set
              as the heading of each row rather than buried in the sentence.
              Someone deciding whether to apply is scanning for exactly these
              five words. */}
          <section className="rs-block">
            <p className="mono rs-lbl">What we need you to already have</p>
            <ol className="rs-need">
              {role.need.map(([t, d], i) => (
                <li key={t}>
                  <span className="mono rs-need-n">{pad(i + 1)}</span>
                  <h3 className="rs-need-t">{t}</h3>
                  <p className="body">{d}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="rs-two">
            <section className="rs-block">
              <p className="mono rs-lbl">What you will be doing</p>
              <ul className="rs-list">
                {role.doing.map((d) => (
                  <li key={d} className="body">{d}</li>
                ))}
              </ul>
            </section>

            <section className="rs-block">
              <p className="mono rs-lbl">Nice to have</p>
              <ul className="rs-list">
                {role.nice.map((d) => (
                  <li key={d} className="body">{d}</li>
                ))}
              </ul>
            </section>
          </div>

          <p className="rs-honest">
            <span className="mono">Worth saying up front</span>
            {role.honest}
          </p>

          {/* Repeated at the end of a long read. Expecting someone to scroll
              back up to the rail once they have decided is a small tax on the
              one action the page exists for. */}
          <div className="rs-foot">
            <ApplyModal role={role} />
          </div>
        </div>
      </div>
    </article>
  )
}
