import 'server-only'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import GithubSlugger from 'github-slugger'

/* ==========================================================================
   Markdown → HTML.

   The output goes through dangerouslySetInnerHTML, so it is sanitised even
   though only an authenticated admin can write it. If the API token ever
   leaks, the blast radius should be a bad blog post — not stored XSS that
   runs against every visitor.
   ========================================================================== */

const ALLOWED_TAGS = [
  'h2', 'h3', 'h4', 'p', 'blockquote', 'ul', 'ol', 'li', 'strong', 'em', 'del',
  'code', 'pre', 'a', 'img', 'hr', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'figure', 'figcaption',
]

const SANITIZE_OPTIONS = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'loading', 'decoding'],
    code: ['class'], // language-* from fenced blocks
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
  },
  // Blocks javascript:, data: and other exotic schemes on links and images.
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  transformTags: {
    // External links open in a new tab; noopener stops the new page reaching
    // back through window.opener, noreferrer keeps the referrer private.
    a: (tagName, attribs) => {
      const href = attribs.href || ''
      const external = /^https?:\/\//i.test(href)
      return {
        tagName: 'a',
        attribs: external ? { ...attribs, target: '_blank', rel: 'noopener noreferrer' } : attribs,
      }
    },
    img: (tagName, attribs) => ({
      tagName: 'img',
      attribs: { ...attribs, loading: 'lazy', decoding: 'async' },
    }),
  },
}

/** Headings get stable ids so the table of contents can link to them. */
function headingRenderer() {
  const slugger = new GithubSlugger()
  const renderer = new marked.Renderer()
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens)
    const plain = text.replace(/<[^>]*>/g, '')
    // h1 is the page title, so demote everything one level.
    const level = Math.min(depth + 1, 4)
    return `<h${level} id="${slugger.slug(plain)}">${text}</h${level}>\n`
  }
  return renderer
}

export function renderMarkdown(md = '') {
  const raw = marked.parse(md, {
    renderer: headingRenderer(),
    gfm: true,
    breaks: false,
    async: false,
  })
  return sanitizeHtml(raw, SANITIZE_OPTIONS)
}

/** Extracts h2/h3 for an on-page table of contents. */
export function extractHeadings(md = '') {
  const slugger = new GithubSlugger()
  const out = []
  for (const line of md.split('\n')) {
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (!m) continue
    const text = m[2].replace(/[*_`]/g, '')
    out.push({ level: m[1].length, text, id: slugger.slug(text) })
  }
  return out
}

/** 200 wpm, rounded up, floored at 1. Matches what readers expect from a byline. */
export function readingTime(md = '') {
  const words = md.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Plain-text excerpt, for cards and meta descriptions when none was given. */
export function excerpt(md = '', max = 180) {
  const text = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, '')}…`
}
