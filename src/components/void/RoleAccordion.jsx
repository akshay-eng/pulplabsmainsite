'use client'

import { useState } from 'react'
import ApplyModal from '@/components/void/ApplyModal'

/* One role, collapsed until asked for.
 *
 * The detail is rendered into the HTML whether or not the row is open, and
 * only collapsed with CSS. Mounting it on expand would be marginally lighter,
 * but a job description that is not in the markup cannot be indexed, and a
 * careers page that search engines cannot read defeats the point of having
 * one. Crawlers get the whole JD; the visitor gets a tidy list.
 *
 * The panel animates on grid-template-rows rather than height, because there
 * is no transform equivalent for opening a panel and 0fr to 1fr is the one
 * way to animate to content height without measuring it.
 */
export default function RoleAccordion({ role, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = `role-${role.slug}`

  return (
    <li className="rl" data-open={open || undefined}>
      <h2 className="rl-h">
        <button
          type="button"
          className="rl-btn"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="rl-lead">
            <span className="mono rl-k">{role.team}</span>
            <span className="rl-t">{role.title}</span>
          </span>

          <span className="rl-meta">
            <span className="mono">{role.type}</span>
            <span className="mono">{role.length}</span>
            <span className="mono rl-where">{role.location}</span>
          </span>

          <span className="rl-sign" aria-hidden="true"><span /><span /></span>
        </button>
      </h2>

      <div className="rl-panel" id={panelId} role="region" aria-label={role.title}>
        <div className="rl-panel-in">
          <p className="body rl-summary">{role.summary}</p>
          <p className="body rl-about">{role.about}</p>

          <div className="cr-grid">
            <div>
              <p className="mono cr-lbl">What we need you to already have</p>
              <ul className="cr-need">
                {role.need.map(([t, d]) => (
                  <li key={t}>
                    <span className="cr-need-t">{t}</span>
                    <span className="body">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cr-side">
              <div>
                <p className="mono cr-lbl">What you will be doing</p>
                <ul className="cr-list">
                  {role.doing.map((d) => <li key={d} className="body">{d}</li>)}
                </ul>
              </div>
              <div>
                <p className="mono cr-lbl">Nice to have</p>
                <ul className="cr-list">
                  {role.nice.map((d) => <li key={d} className="body">{d}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <p className="cr-honest">
            <span className="mono">Worth saying up front</span>
            {role.honest}
          </p>

          <div className="cr-cta">
            <ApplyModal role={role} />
          </div>
        </div>
      </div>
    </li>
  )
}
