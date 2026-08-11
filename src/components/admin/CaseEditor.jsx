'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { saveCaseAction } from '@/app/admin/actions'
import CoverField from './CoverField'

/* Case study editor. Deliberately close to PostEditor so the two feel like one
   tool — same save bar, same dirty guard, same field styling. The differences
   are the metric rows, the accent colour and the carousel position. */

function SaveBar({ dirty }) {
  const { pending } = useFormStatus()
  return (
    <div className="editor-actions">
      {dirty && !pending && <span className="editor-dirty">Unsaved changes</span>}
      <button type="submit" name="status" value="draft" className="admin-btn ghost" disabled={pending}>
        {pending ? 'Saving…' : 'Save draft'}
      </button>
      <button type="submit" name="status" value="published" className="admin-btn primary" disabled={pending}>
        {pending ? 'Saving…' : 'Publish'}
      </button>
    </div>
  )
}

const ACCENTS = [
  ['#FF6B1A', 'Tangerine'],
  ['#F0384B', 'Watermelon'],
  ['#C9930A', 'Lemon'],
  ['#E0447E', 'Strawberry'],
  ['#7BC043', 'Kiwi'],
]

export default function CaseEditor({ item = null, saved = false }) {
  const [state, formAction] = useActionState(saveCaseAction, {})
  const v = state?.values ?? item ?? {}

  const [dirty, setDirty] = useState(false)
  const [accent, setAccent] = useState(v.accent || '#FF6B1A')

  /* Metrics are three (or four) figure/caption pairs. Kept as component state
     and serialised into one hidden field as `figure|caption` lines — a plain
     form cannot submit an array, and this avoids indexed field names. */
  const [metrics, setMetrics] = useState(() => {
    const existing = Array.isArray(v.metrics) ? v.metrics : []
    const rows = existing.map((m) => ({ figure: m.figure ?? '', caption: m.caption ?? '' }))
    while (rows.length < 3) rows.push({ figure: '', caption: '' })
    return rows.slice(0, 4)
  })

  const setMetric = (i, key, val) => {
    setMetrics((rows) => rows.map((r, j) => (i === j ? { ...r, [key]: val } : r)))
    setDirty(true)
  }

  const serialisedMetrics = metrics
    .filter((m) => m.figure.trim() || m.caption.trim())
    .map((m) => `${m.figure.trim()}|${m.caption.trim()}`)
    .join('\n')

  useEffect(() => {
    if (!dirty) return
    const onLeave = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [dirty])

  const errors = state?.errors ?? {}

  return (
    <form action={formAction} onChange={() => setDirty(true)} className="editor">
      {item?.id && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="metrics" value={serialisedMetrics} />

      <div className="admin-head">
        <div>
          <h1>{item ? 'Edit case study' : 'New case study'}</h1>
          {item && <p className="admin-sub">/case-studies/{item.slug}</p>}
        </div>
        <SaveBar dirty={dirty} />
      </div>

      {saved && !dirty && <div className="admin-flash">Saved.</div>}
      {Object.keys(errors).length > 0 && (
        <div className="admin-error" role="alert">
          {Object.values(errors).map((e) => (
            <div key={e}>{e}</div>
          ))}
        </div>
      )}

      <div className="editor-grid">
        <div className="editor-main">
          <label className="admin-field">
            <span>Title</span>
            <input
              name="title"
              defaultValue={v.title ?? ''}
              placeholder="Quotes in minutes, not days"
              required
              aria-invalid={errors.title ? 'true' : undefined}
            />
          </label>

          <div className="field-row">
            <label className="admin-field">
              <span>Client</span>
              <input
                name="client"
                defaultValue={v.client ?? ''}
                placeholder="Power &amp; Pack Solutions"
                required
                aria-invalid={errors.client ? 'true' : undefined}
              />
            </label>
            <label className="admin-field">
              <span>Industry</span>
              <input name="industry" defaultValue={v.industry ?? ''} placeholder="Manufacturing" />
            </label>
          </div>

          <label className="admin-field">
            <span>
              Summary <em>card copy and meta description</em>
            </span>
            <textarea
              name="summary"
              rows={3}
              defaultValue={v.summary ?? ''}
              placeholder="One or two sentences on what you built and what changed."
              required
              aria-invalid={errors.summary ? 'true' : undefined}
            />
          </label>

          <fieldset className="admin-field metrics-field">
            <legend>
              Metrics <em>the three figures on the card — leave a row blank to omit it</em>
            </legend>
            {metrics.map((m, i) => (
              <div className="metric-row" key={i}>
                <input
                  value={m.figure}
                  onChange={(e) => setMetric(i, 'figure', e.target.value)}
                  placeholder="4×"
                  aria-label={`Metric ${i + 1} figure`}
                />
                <input
                  value={m.caption}
                  onChange={(e) => setMetric(i, 'caption', e.target.value)}
                  placeholder="faster quote turnaround"
                  aria-label={`Metric ${i + 1} caption`}
                />
              </div>
            ))}
          </fieldset>

          <label className="admin-field">
            <span>
              Body <em>markdown — the detail page</em>
            </span>
            <textarea
              name="body"
              rows={16}
              defaultValue={v.body ?? ''}
              className="mono-input"
              placeholder={'## The problem\n\n…\n\n## What we built\n\n- …\n\n## What changed\n\n…'}
            />
          </label>
        </div>

        <aside className="editor-side">
          <CoverField defaultValue={v.cover_image ?? ''} />

          <label className="admin-field">
            <span>
              Accent <em>card and detail-page colour</em>
            </span>
            <div className="accent-row">
              {ACCENTS.map(([hex, name]) => (
                <button
                  type="button"
                  key={hex}
                  className="accent-swatch"
                  style={{ background: hex }}
                  data-active={accent === hex || undefined}
                  aria-label={name}
                  aria-pressed={accent === hex}
                  onClick={() => {
                    setAccent(hex)
                    setDirty(true)
                  }}
                />
              ))}
            </div>
            <input type="hidden" name="accent" value={accent} />
          </label>

          <label className="admin-field">
            <span>
              Position <em>lower shows first in the carousel</em>
            </span>
            <input name="position" type="number" defaultValue={v.position ?? 0} min={0} step={1} />
          </label>

          <label className="admin-field">
            <span>
              Slug <em>{item ? 'changing this breaks existing links' : 'auto from title if blank'}</em>
            </span>
            <input name="slug" defaultValue={item?.slug ?? ''} placeholder="quotes-in-minutes-not-days" />
          </label>

          {item && (
            <div className="editor-meta">
              <div>
                <span>Status</span>
                <b className={`admin-pill ${item.status}`}>{item.status}</b>
              </div>
              {item.published_at && (
                <div>
                  <span>Published</span>
                  <b>{new Date(item.published_at).toLocaleDateString('en-GB')}</b>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </form>
  )
}
