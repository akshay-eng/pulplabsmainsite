#!/usr/bin/env node
/* Flat illustration art for the product cards and the two new category tiles.
 *
 * This site runs TWO art styles, and which one a picture needs depends on
 * where it sits:
 *
 *   1. Dark abstract render — near-black, spectral light. Case studies and
 *      full-bleed plates. scripts/generate-case-art.mjs and
 *      generate-project-art.mjs produce these.
 *   2. Light flat illustration — pale tinted ground, rounded shapes, one
 *      accent. Solution cards (public/void/cards) and category tiles
 *      (public/void/cat). This script produces these.
 *
 * The product cards sit in the same component as the solution cards, and the
 * two new category tiles sit in the same row as an existing one, so both have
 * to be style 2. Using style 1 there made the tab flip styles mid-component,
 * which is what this file exists to fix.
 *
 * Deterministic — no RNG at all, so re-running never churns the files.
 *
 *   node scripts/generate-tile-art.mjs
 */

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

/* Sampled from the existing tiles so the new work sits in the same family:
   pale ground, a deeper wash for background masses, white cards, one accent. */
const P = {
  blue:   { bg: '#eaf4fb', wash: '#d3e8f7', line: '#b8d9ef', accent: '#7cb8e8', ink: '#5b8fb9' },
  mint:   { bg: '#e9f6f0', wash: '#d2ece0', line: '#b2ddc9', accent: '#63c39c', ink: '#4a917a' },
  amber:  { bg: '#fdf2e6', wash: '#f9e2ca', line: '#f2cfa8', accent: '#eba55c', ink: '#b57b3d' },
  violet: { bg: '#f0edfb', wash: '#dfd8f6', line: '#c9bfee', accent: '#9b86dd', ink: '#7361b4' },
  indigo: { bg: '#eaeefa', wash: '#d4dcf5', line: '#bac6ee', accent: '#7f93dc', ink: '#5c6cae' },
}

const r2 = (n) => Math.round(n * 100) / 100

/** Ground: flat tint plus two soft masses, the way the existing tiles are built. */
function ground(w, h, p) {
  return `
    <rect width="${w}" height="${h}" fill="${p.bg}"/>
    <circle cx="${r2(w * 0.12)}" cy="${r2(h * 0.86)}" r="${r2(w * 0.34)}" fill="${p.wash}" opacity="0.75"/>
    <circle cx="${r2(w * 0.92)}" cy="${r2(h * 0.1)}" r="${r2(w * 0.24)}" fill="${p.wash}" opacity="0.6"/>
  `
}

/** A white rounded card with a hairline — the base unit of this style. */
const card = (x, y, w, h, p, rad = 14, fill = '#ffffff') =>
  `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" rx="${rad}" fill="${fill}" stroke="${p.line}" stroke-width="2"/>`

/** A pill — a row of text, abstracted. */
const pill = (x, y, w, h, fill, op = 1) =>
  `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" rx="${r2(h / 2)}" fill="${fill}" opacity="${op}"/>`

/* ── Motifs ─────────────────────────────────────────────────────────────── */

/** OpenLCM — a long transcript compressing into one compact memory card. */
function mOpenlcm(w, h, p) {
  let s = ''
  const rowW = w * 0.3
  for (let i = 0; i < 7; i++) {
    const y = h * 0.16 + i * h * 0.1
    s += card(w * 0.08, y, rowW, h * 0.072, p, 10)
    s += pill(w * 0.1, y + h * 0.024, rowW * (0.4 + (i % 3) * 0.16), h * 0.024, p.line)
  }
  // The compression seam.
  for (let i = 0; i < 3; i++) {
    const y = h * 0.3 + i * h * 0.14
    s += `<path d="M${r2(w * 0.4)} ${r2(y)} C ${r2(w * 0.48)} ${r2(y)}, ${r2(w * 0.5)} ${r2(h * 0.5)}, ${r2(w * 0.56)} ${r2(h * 0.5)}"
      fill="none" stroke="${p.line}" stroke-width="2.5"/>`
  }
  // The retained memory: fewer rows, one promoted.
  s += card(w * 0.58, h * 0.3, w * 0.34, h * 0.4, p, 16)
  s += pill(w * 0.62, h * 0.36, w * 0.18, h * 0.03, p.accent)
  s += pill(w * 0.62, h * 0.44, w * 0.26, h * 0.026, p.line)
  s += pill(w * 0.62, h * 0.51, w * 0.22, h * 0.026, p.line)
  s += pill(w * 0.62, h * 0.58, w * 0.14, h * 0.026, p.line)
  return s
}

/** ZiG — notifications tested against a gate; most stop, a few pass. */
function mZig(w, h, p) {
  let s = ''
  for (let i = 0; i < 5; i++) {
    const y = h * 0.16 + i * h * 0.15
    const pass = i === 1 || i === 3
    s += card(w * 0.07, y, w * 0.3, h * 0.11, p, 12)
    s += `<circle cx="${r2(w * 0.11)}" cy="${r2(y + h * 0.055)}" r="${r2(h * 0.026)}" fill="${pass ? p.accent : p.line}"/>`
    s += pill(w * 0.15, y + h * 0.032, w * 0.16, h * 0.022, p.line)
    s += pill(w * 0.15, y + h * 0.066, w * 0.11, h * 0.018, p.line, 0.6)
    if (pass) {
      s += `<path d="M${r2(w * 0.38)} ${r2(y + h * 0.055)} H ${r2(w * 0.63)}" stroke="${p.accent}" stroke-width="3" stroke-linecap="round"/>`
      s += `<circle cx="${r2(w * 0.65)}" cy="${r2(y + h * 0.055)}" r="${r2(h * 0.022)}" fill="${p.accent}"/>`
    } else {
      s += `<path d="M${r2(w * 0.38)} ${r2(y + h * 0.055)} H ${r2(w * 0.46)}" stroke="${p.line}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 6"/>`
      const cx = w * 0.485
      const cy = y + h * 0.055
      const d = h * 0.016
      s += `<path d="M${r2(cx - d)} ${r2(cy - d)} L${r2(cx + d)} ${r2(cy + d)} M${r2(cx + d)} ${r2(cy - d)} L${r2(cx - d)} ${r2(cy + d)}"
        stroke="${p.ink}" stroke-width="2.4" stroke-linecap="round" opacity="0.5"/>`
    }
  }
  // The gate, and the device it never leaves.
  s += `<path d="M${r2(w * 0.55)} ${r2(h * 0.08)} V ${r2(h * 0.92)}" stroke="${p.ink}" stroke-width="2" stroke-dasharray="7 7" opacity="0.35"/>`
  s += card(w * 0.72, h * 0.2, w * 0.2, h * 0.6, p, 18)
  s += pill(w * 0.76, h * 0.28, w * 0.12, h * 0.028, p.line)
  s += pill(w * 0.76, h * 0.36, w * 0.09, h * 0.028, p.line, 0.6)
  s += `<circle cx="${r2(w * 0.82)}" cy="${r2(h * 0.58)}" r="${r2(h * 0.09)}" fill="${p.accent}" opacity="0.25"/>`
  s += `<path d="M${r2(w * 0.785)} ${r2(h * 0.58)} l ${r2(h * 0.025)} ${r2(h * 0.028)} l ${r2(h * 0.05)} -${r2(h * 0.062)}"
    fill="none" stroke="${p.accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`
  return s
}

/** PresoAI — a deck: thumbnails on the left, the composed slide on the right. */
function mPresoai(w, h, p) {
  let s = ''
  for (let i = 0; i < 4; i++) {
    const y = h * 0.16 + i * h * 0.19
    s += card(w * 0.07, y, w * 0.17, h * 0.145, p, 8)
    s += pill(w * 0.09, y + h * 0.03, w * 0.1, h * 0.018, i === 1 ? p.accent : p.line)
    s += pill(w * 0.09, y + h * 0.066, w * 0.12, h * 0.014, p.line, 0.6)
  }
  s += card(w * 0.3, h * 0.16, w * 0.62, h * 0.68, p, 18)
  s += pill(w * 0.35, h * 0.25, w * 0.34, h * 0.045, p.accent)
  s += pill(w * 0.35, h * 0.35, w * 0.26, h * 0.026, p.line)
  s += pill(w * 0.35, h * 0.42, w * 0.2, h * 0.026, p.line, 0.7)
  // A chart block, because that is what a demo deck always has on it.
  s += `<rect x="${r2(w * 0.35)}" y="${r2(h * 0.52)}" width="${r2(w * 0.22)}" height="${r2(h * 0.22)}" rx="8" fill="${p.wash}"/>`
  for (let i = 0; i < 4; i++) {
    const bh = h * (0.06 + i * 0.035)
    s += `<rect x="${r2(w * 0.37 + i * w * 0.045)}" y="${r2(h * 0.74 - bh)}" width="${r2(w * 0.028)}" height="${r2(bh)}" rx="4" fill="${p.accent}" opacity="${0.45 + i * 0.15}"/>`
  }
  s += `<rect x="${r2(w * 0.62)}" y="${r2(h * 0.52)}" width="${r2(w * 0.26)}" height="${r2(h * 0.22)}" rx="8" fill="${p.wash}"/>`
  return s
}

/** DevOps Copilot — a cluster of nodes streaming into a broker. */
function mDevops(w, h, p) {
  let s = ''
  const cols = 4
  const rows = 3
  const x0 = w * 0.08
  const y0 = h * 0.2
  const cw = w * 0.1
  const ch = h * 0.17
  const gx = w * 0.035
  const gy = h * 0.09
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = x0 + i * (cw + gx)
      const y = y0 + j * (ch + gy)
      const hot = i === 2 && j === 1
      s += card(x, y, cw, ch, p, 10, hot ? '#ffffff' : '#ffffff')
      s += `<circle cx="${r2(x + cw * 0.25)}" cy="${r2(y + ch * 0.32)}" r="${r2(ch * 0.14)}" fill="${hot ? p.accent : p.line}"/>`
      s += pill(x + cw * 0.42, y + ch * 0.24, cw * 0.4, ch * 0.15, p.line, 0.8)
      s += pill(x + cw * 0.18, y + ch * 0.62, cw * 0.6, ch * 0.13, p.line, 0.55)
      if (hot) {
        s += `<rect x="${r2(x - 4)}" y="${r2(y - 4)}" width="${r2(cw + 8)}" height="${r2(ch + 8)}" rx="13" fill="none" stroke="${p.accent}" stroke-width="3"/>`
      }
    }
  }
  // The stream out.
  const my = h * 0.5
  s += `<path d="M${r2(x0 + cols * (cw + gx) - gx)} ${r2(my)} C ${r2(w * 0.74)} ${r2(my)}, ${r2(w * 0.74)} ${r2(my)}, ${r2(w * 0.78)} ${r2(my)}"
    stroke="${p.accent}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
  s += card(w * 0.79, h * 0.3, w * 0.13, h * 0.4, p, 14)
  for (let i = 0; i < 4; i++) {
    s += pill(w * 0.815, h * 0.37 + i * h * 0.075, w * 0.08, h * 0.032, i === 0 ? p.accent : p.line, i === 0 ? 1 : 0.7)
  }
  return s
}

/** Wheatear — source workflow, canonical form, target workflow. */
function mWheatear(w, h, p) {
  let s = ''
  const chain = (cx, op, accent) => {
    let o = ''
    for (let i = 0; i < 3; i++) {
      const y = h * 0.22 + i * h * 0.24
      o += card(cx - w * 0.075, y, w * 0.15, h * 0.16, p, 12)
      o += `<circle cx="${r2(cx - w * 0.04)}" cy="${r2(y + h * 0.08)}" r="${r2(h * 0.03)}" fill="${accent ? p.accent : p.line}" opacity="${op}"/>`
      o += pill(cx - w * 0.005, y + h * 0.062, w * 0.06, h * 0.032, p.line, op)
      if (i < 2) o += `<path d="M${r2(cx)} ${r2(y + h * 0.16)} V ${r2(y + h * 0.24)}" stroke="${p.line}" stroke-width="2.5"/>`
    }
    return o
  }
  s += chain(w * 0.16, 0.55, false)
  s += chain(w * 0.84, 1, true)
  // The intermediate representation, centred.
  s += card(w * 0.4, h * 0.24, w * 0.2, h * 0.52, p, 18)
  s += pill(w * 0.435, h * 0.32, w * 0.13, h * 0.032, p.accent)
  for (let i = 0; i < 4; i++) {
    s += pill(w * 0.435, h * 0.41 + i * h * 0.08, w * (0.13 - i * 0.018), h * 0.026, p.line, 0.8)
  }
  const arrow = (x1, x2) =>
    `<path d="M${r2(x1)} ${r2(h * 0.5)} H ${r2(x2)}" stroke="${p.ink}" stroke-width="2.5" opacity="0.45" stroke-linecap="round"/>
     <path d="M${r2(x2 - 9)} ${r2(h * 0.5 - 6)} L${r2(x2)} ${r2(h * 0.5)} L${r2(x2 - 9)} ${r2(h * 0.5 + 6)}" fill="none" stroke="${p.ink}" stroke-width="2.5" opacity="0.45" stroke-linecap="round" stroke-linejoin="round"/>`
  s += arrow(w * 0.245, w * 0.39)
  s += arrow(w * 0.61, w * 0.755)
  return s
}

/** Revenue & Customer — enquiries narrowing to one committed outcome. */
function mRevenue(w, h, p) {
  let s = ''
  for (let i = 0; i < 4; i++) {
    const y = h * 0.14 + i * h * 0.115
    const wd = w * (0.6 - i * 0.09)
    s += card((w - wd) / 2, y, wd, h * 0.085, p, 12)
    s += pill((w - wd) / 2 + w * 0.03, y + h * 0.028, wd * 0.4, h * 0.028, i === 3 ? p.accent : p.line)
  }
  // The reply, and the human who approved it.
  s += card(w * 0.18, h * 0.62, w * 0.42, h * 0.2, p, 16)
  s += pill(w * 0.22, h * 0.68, w * 0.3, h * 0.03, p.line)
  s += pill(w * 0.22, h * 0.74, w * 0.22, h * 0.026, p.line, 0.65)
  s += `<path d="M${r2(w * 0.24)} ${r2(h * 0.82)} l ${r2(h * 0.035)} ${r2(h * 0.05)} v -${r2(h * 0.05)} z" fill="#ffffff" stroke="${p.line}" stroke-width="2"/>`
  s += `<circle cx="${r2(w * 0.72)}" cy="${r2(h * 0.72)}" r="${r2(h * 0.1)}" fill="${p.accent}" opacity="0.22"/>`
  s += `<path d="M${r2(w * 0.685)} ${r2(h * 0.72)} l ${r2(h * 0.026)} ${r2(h * 0.03)} l ${r2(h * 0.052)} -${r2(h * 0.066)}"
    fill="none" stroke="${p.accent}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`
  return s
}

/** Finance & Data — a reconciliation table and the variance it explains. */
function mFinance(w, h, p) {
  let s = ''
  s += card(w * 0.07, h * 0.14, w * 0.46, h * 0.72, p, 16)
  for (let i = 0; i < 5; i++) {
    const y = h * 0.22 + i * h * 0.13
    s += `<path d="M${r2(w * 0.07)} ${r2(y + h * 0.09)} H ${r2(w * 0.53)}" stroke="${p.line}" stroke-width="1.6" opacity="0.7"/>`
    s += pill(w * 0.11, y + h * 0.025, w * 0.14, h * 0.03, p.line, i === 0 ? 1 : 0.75)
    s += pill(w * 0.29, y + h * 0.025, w * 0.09, h * 0.03, p.line, 0.55)
    // One exception routed to a person; the rest match.
    if (i === 2) {
      s += `<circle cx="${r2(w * 0.46)}" cy="${r2(y + h * 0.04)}" r="${r2(h * 0.028)}" fill="${p.accent}"/>`
    } else {
      s += `<path d="M${r2(w * 0.44)} ${r2(y + h * 0.04)} l ${r2(h * 0.016)} ${r2(h * 0.02)} l ${r2(h * 0.032)} -${r2(h * 0.042)}"
        fill="none" stroke="${p.ink}" stroke-width="2.6" opacity="0.45" stroke-linecap="round" stroke-linejoin="round"/>`
    }
  }
  // The variance card.
  s += card(w * 0.58, h * 0.28, w * 0.35, h * 0.44, p, 16)
  const bx = w * 0.62
  const bw = w * 0.27
  const by = h * 0.64
  const vals = [0.5, 0.72, 0.44, 0.86, 0.62]
  vals.forEach((v, i) => {
    const bh = h * 0.26 * v
    s += `<rect x="${r2(bx + i * (bw / 5))}" y="${r2(by - bh)}" width="${r2(bw / 5 - 6)}" height="${r2(bh)}" rx="4"
      fill="${i === 3 ? p.accent : p.line}" opacity="${i === 3 ? 1 : 0.8}"/>`
  })
  s += `<path d="M${r2(bx)} ${r2(by)} H ${r2(bx + bw)}" stroke="${p.line}" stroke-width="2"/>`
  s += pill(w * 0.62, h * 0.34, w * 0.16, h * 0.03, p.line)
  return s
}

const PLATES = [
  // Product cards — 16:7, matching .proj-art
  { out: 'public/void/products/openlcm.webp',        w: 1200, h: 525, p: P.blue,   motif: mOpenlcm },
  { out: 'public/void/products/zig.webp',            w: 1200, h: 525, p: P.mint,   motif: mZig },
  { out: 'public/void/products/presoai.webp',        w: 1200, h: 525, p: P.amber,  motif: mPresoai },
  { out: 'public/void/products/devops-copilot.webp', w: 1200, h: 525, p: P.violet, motif: mDevops },
  { out: 'public/void/products/wheatear.webp',       w: 1200, h: 525, p: P.indigo, motif: mWheatear },

  // Category tiles — square, matching the existing dept-*.webp at 760×760
  { out: 'public/void/cat/dept-revenue-customer.webp', w: 760, h: 760, p: P.mint,   motif: mRevenue },
  { out: 'public/void/cat/dept-finance-data.webp',     w: 760, h: 760, p: P.indigo, motif: mFinance },
]

for (const t of PLATES) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${t.w}" height="${t.h}" viewBox="0 0 ${t.w} ${t.h}">
    ${ground(t.w, t.h, t.p)}
    ${t.motif(t.w, t.h, t.p)}
  </svg>`
  await mkdir(dirname(t.out), { recursive: true })
  await sharp(Buffer.from(svg)).webp({ quality: 90, effort: 6 }).toFile(t.out)
  console.log('wrote', t.out)
}
