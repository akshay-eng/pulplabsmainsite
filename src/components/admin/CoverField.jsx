'use client'

import { useEffect, useRef, useState } from 'react'

/* Cover image picker: click or drop a file, it uploads immediately and the
 * hidden input carries the resulting URL into the form. Pasting a path still
 * works, so an image already in /art or on a CDN needs no upload. */

const RATIO_HINT = '1200×630 (1.91:1)'

export default function CoverField({ defaultValue = '' }) {
  const [url, setUrl] = useState(defaultValue || '')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null) // { kind, text }
  const [dragging, setDragging] = useState(false)
  const input = useRef(null)
  const dropRef = useRef(null)

  async function upload(file) {
    if (!file) return
    setBusy(true)
    setMessage(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ kind: 'error', text: data.error || 'Upload failed.' })
        return
      }
      setUrl(data.url)
      setMessage(
        data.warning
          ? { kind: 'warn', text: data.warning }
          : { kind: 'ok', text: `Uploaded${data.width ? ` · ${data.width}×${data.height}` : ''}` },
      )
    } catch {
      setMessage({ kind: 'error', text: 'Upload failed — is the server running?' })
    } finally {
      setBusy(false)
    }
  }

  /* Drag-and-drop. Bound imperatively because React's synthetic drag events
     need every one of these prevented to stop the browser navigating to the
     dropped file. */
  useEffect(() => {
    const node = dropRef.current
    if (!node) return

    const stop = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    const onOver = (e) => {
      stop(e)
      setDragging(true)
    }
    const onLeave = (e) => {
      stop(e)
      setDragging(false)
    }
    const onDrop = (e) => {
      stop(e)
      setDragging(false)
      upload(e.dataTransfer?.files?.[0])
    }

    node.addEventListener('dragover', onOver)
    node.addEventListener('dragleave', onLeave)
    node.addEventListener('drop', onDrop)
    return () => {
      node.removeEventListener('dragover', onOver)
      node.removeEventListener('dragleave', onLeave)
      node.removeEventListener('drop', onDrop)
    }
  }, [])

  return (
    <div className="admin-field cover-field">
      <span>
        Cover image <em>{RATIO_HINT} · also used as the social card</em>
      </span>

      {/* The value the form actually submits */}
      <input type="hidden" name="cover_image" value={url} />

      <div
        ref={dropRef}
        className="cover-drop"
        data-dragging={dragging || undefined}
        data-filled={url ? true : undefined}
      >
        {url ? (
          // Cropped to the same ratio the site uses, so what you see here is
          // exactly what gets published.
          <img src={url} alt="" className="cover-preview" />
        ) : (
          <div className="cover-placeholder">
            <strong>Drop an image</strong>
            <span>or click to choose · {RATIO_HINT}</span>
          </div>
        )}

        <button
          type="button"
          className="cover-hit"
          onClick={() => input.current?.click()}
          disabled={busy}
          aria-label={url ? 'Replace cover image' : 'Choose cover image'}
        />

        {busy && <div className="cover-busy">Uploading…</div>}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        onChange={(e) => upload(e.target.files?.[0])}
      />

      <div className="cover-actions">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/art/blog-featured.webp or https://…"
          aria-label="Cover image path or URL"
        />
        {url && (
          <button type="button" className="admin-btn ghost sm" onClick={() => { setUrl(''); setMessage(null) }}>
            Clear
          </button>
        )}
      </div>

      {message && (
        <p className={`cover-msg ${message.kind}`} role={message.kind === 'error' ? 'alert' : undefined}>
          {message.text}
        </p>
      )}
    </div>
  )
}
