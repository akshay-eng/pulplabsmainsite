'use client'

import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { savePostAction } from '@/app/admin/actions'
import CoverField from './CoverField'

/* ==========================================================================
   Post editor — markdown on the left, live preview on the right.

   The preview uses a small client-side renderer that covers the subset the
   editor needs. The canonical render is still the server's sanitised
   marked+sanitize-html pass in src/lib/markdown.js; this is a writing aid, so
   it must never be what actually ships to a reader.
   ========================================================================== */

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Intentionally minimal, and escapes first so a preview can't execute markup. */
function preview(md = '') {
  let h = escapeHtml(md)

  h = h.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`)
  h = h.replace(/^### (.*)$/gm, '<h4>$1</h4>')
  h = h.replace(/^## (.*)$/gm, '<h3>$1</h3>')
  h = h.replace(/^# (.*)$/gm, '<h2>$1</h2>')
  h = h.replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>')
  h = h.replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>')
  h = h.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>')
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  h = h.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>')
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a>$1</a>') // no href — preview only
  h = h.replace(/^---$/gm, '<hr />')

  return h
    .split(/\n{2,}/)
    .map((b) => (/^\s*<(h[234]|ul|pre|blockquote|hr)/.test(b) ? b : `<p>${b.replace(/\n/g, '<br />')}</p>`))
    .join('\n')
}

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

export default function PostEditor({ post = null, saved = false }) {
  const [state, formAction] = useActionState(savePostAction, {})
  const v = state?.values ?? post ?? {}

  const [body, setBody] = useState(v.body ?? '')
  const [title, setTitle] = useState(v.title ?? '')
  const [description, setDescription] = useState(v.description ?? '')
  const [dirty, setDirty] = useState(false)
  const [tab, setTab] = useState('write')
  const textarea = useRef(null)

  const html = useMemo(() => preview(body), [body])
  const words = useMemo(() => body.trim().split(/\s+/).filter(Boolean).length, [body])

  /* Warn before leaving with unsaved work. A long post lost to a stray
     Cmd-W is the single worst thing a CMS can do to you. */
  useEffect(() => {
    if (!dirty) return
    const onLeave = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [dirty])

  /* Cmd/Ctrl+S saves the draft rather than opening the browser's save dialog. */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        document.getElementById('editor-form')?.requestSubmit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* Tab inserts two spaces instead of leaving the textarea. */
  const onBodyKeyDown = (e) => {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const el = e.currentTarget
    const { selectionStart: s, selectionEnd: en } = el
    const next = `${body.slice(0, s)}  ${body.slice(en)}`
    setBody(next)
    requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2))
  }

  const errors = state?.errors ?? {}
  const descLimit = 300

  return (
    <form id="editor-form" action={formAction} onChange={() => setDirty(true)} className="editor">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div className="admin-head">
        <div>
          <h1>{post ? 'Edit post' : 'New post'}</h1>
          {post && <p className="admin-sub">/blog/{post.slug}</p>}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Why your incident bot keeps guessing"
              required
              aria-invalid={errors.title ? 'true' : undefined}
            />
          </label>

          <label className="admin-field">
            <span>
              Description
              <em className={description.length > descLimit ? 'over' : undefined}>
                {description.length}/{descLimit} · used as the meta description and card excerpt
              </em>
            </span>
            <textarea
              name="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One or two sentences. This is what shows in Google and on LinkedIn."
              required
              aria-invalid={errors.description ? 'true' : undefined}
            />
          </label>

          <div className="editor-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'write'} onClick={() => setTab('write')}>
              Write
            </button>
            <button type="button" role="tab" aria-selected={tab === 'preview'} onClick={() => setTab('preview')}>
              Preview
            </button>
            <span className="editor-count">
              {words} words · ~{Math.max(1, Math.ceil(words / 200))} min
            </span>
          </div>

          <div className="editor-panes" data-tab={tab}>
            <label className="admin-field editor-write">
              <span className="sr-only">Body (markdown)</span>
              <textarea
                ref={textarea}
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyDown={onBodyKeyDown}
                spellCheck
                placeholder={'## A heading\n\nMarkdown here. **Bold**, _italic_, `code`, > quotes, - lists.'}
                aria-invalid={errors.body ? 'true' : undefined}
              />
            </label>

            {/* Escaped before rendering — see preview() above */}
            <div className="editor-preview prose" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>

        <aside className="editor-side">
          <label className="admin-field">
            <span>Category</span>
            <input name="category" defaultValue={v.category ?? ''} placeholder="Engineering" list="cat-options" />
            <datalist id="cat-options">
              <option value="Engineering" />
              <option value="Field notes" />
              <option value="Playbook" />
              <option value="Enablement" />
            </datalist>
          </label>

          <label className="admin-field">
            <span>
              Tags <em>comma separated</em>
            </span>
            <input
              name="tags"
              defaultValue={Array.isArray(v.tags) ? v.tags.join(', ') : (v.tags ?? '')}
              placeholder="evals, incident-response, llm"
            />
          </label>

          <label className="admin-field">
            <span>
              Slug <em>{post ? 'changing this breaks existing links' : 'auto from title if blank'}</em>
            </span>
            <input name="slug" defaultValue={post?.slug ?? ''} placeholder="why-your-incident-bot-keeps-guessing" />
          </label>

          <CoverField defaultValue={v.cover_image ?? ''} />

          <label className="admin-field">
            <span>Author</span>
            <input name="author" defaultValue={v.author ?? 'PulpLabs'} />
          </label>

          {post && (
            <div className="editor-meta">
              <div>
                <span>Status</span>
                <b className={`admin-pill ${post.status}`}>{post.status}</b>
              </div>
              <div>
                <span>Created</span>
                <b>{new Date(post.created_at).toLocaleDateString('en-GB')}</b>
              </div>
              {post.published_at && (
                <div>
                  <span>Published</span>
                  <b>{new Date(post.published_at).toLocaleDateString('en-GB')}</b>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </form>
  )
}
