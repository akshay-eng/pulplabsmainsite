#!/usr/bin/env node
/* Dark-plate art for the two PulpLabs Learn spotlight cards.
 *
 * This site runs two art styles, and which one a picture needs depends on
 * where it sits. Case-study imagery is the DARK one: near-black ground, white
 * geometry, and one restrained band of spectral light. The spotlight cards
 * carry case studies and engagement notes, so they belong to that family —
 * see scripts/generate-case-art.mjs for the plates they sit beside.
 *
 * The light flat-illustration style used by solution cards, product cards and
 * category tiles lives in scripts/generate-tile-art.mjs instead.
 *
 * Generated locally with sharp rather than through an image model: there is no
 * key in this environment, and these are geometry rather than scenes. That
 * suits the brief anyway — the art here is deliberately abstract (see
 * public/IMAGE_CREDITS.md), because a photoreal render on a client case study
 * would imply it documents that client's actual facility.
 *
 * Deterministic. A fixed seed means re-running produces byte-identical output
 * instead of a spurious diff.
 *
 *   node scripts/generate-spotlight-art.mjs
 */

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

/* Mulberry32 — small, seeded, and stable across Node versions, which matters
   because the whole point is that a re-run does not churn the files. */
function rng(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* The spectral bands. Each subject gets one, and only one — two bands read as
   decoration, one reads as emitted light. */
const LIGHT = {
  amber: ['#ffb066', '#ff7a2f', '#c2410c'],
  ice: ['#a8d8ff', '#5aa9f5', '#1d4ed8'],
  mint: ['#9df0d0', '#3fc79a', '#0f766e'],
  violet: ['#c9b6ff', '#8b6cf0', '#4c1d95'],
  rose: ['#ffb3c7', '#f0568c', '#9d174d'],
}

const px = (n) => Math.round(n * 100) / 100

/** Ground, vignette, glow and the hairline grid every plate shares. */
function ground(w, h, band, { glowX = 0.66, glowY = 0.42, glow = 0.5 } = {}) {
  const [c1, c2, c3] = LIGHT[band]
  return `
    <defs>
      <radialGradient id="glow" cx="${glowX}" cy="${glowY}" r="0.62">
        <stop offset="0%"   stop-color="${c1}" stop-opacity="${0.5 * glow}"/>
        <stop offset="38%"  stop-color="${c2}" stop-opacity="${0.28 * glow}"/>
        <stop offset="72%"  stop-color="${c3}" stop-opacity="${0.1 * glow}"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.05"/>
        <stop offset="55%"  stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="vig" cx="0.5" cy="0.5" r="0.78">
        <stop offset="55%"  stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.82"/>
      </radialGradient>
      <pattern id="grid" width="${w / 16}" height="${w / 16}" patternUnits="userSpaceOnUse">
        <path d="M ${w / 16} 0 L 0 0 0 ${w / 16}" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
      </pattern>
      <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="${w / 90}"/>
      </filter>
    </defs>

    <rect width="${w}" height="${h}" fill="#000000"/>
    <rect width="${w}" height="${h}" fill="url(#grid)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    <rect width="${w}" height="${h}" fill="url(#edge)"/>
  `
}

const vignette = (w, h) => `<rect width="${w}" height="${h}" fill="url(#vig)"/>`



/** Spotlight: quote turnaround — many inbound forms, one priced output. */
function motifQuote(w, h) {
  let s = ''
  for (let i = 0; i < 5; i++) {
    const y = h * (0.2 + i * 0.14)
    const wid = w * (0.1 + (i % 3) * 0.03)
    s += `<rect x="${px(w * 0.22)}" y="${px(y)}" width="${px(wid)}" height="${px(h * 0.055)}" rx="${px(h * 0.014)}"
      fill="#ffffff" fill-opacity="${0.14 + (i % 2) * 0.08}"/>`
    s += `<path d="M${px(w * 0.22 + wid + w * 0.02)} ${px(y + h * 0.028)} H ${px(w * 0.52)}"
      stroke="#ffffff" stroke-opacity="0.16" stroke-width="${w / 1100}" stroke-dasharray="${w / 160} ${w / 200}"/>`
  }
  const cx = w * 0.62
  s += `<rect x="${px(cx)}" y="${px(h * 0.2)}" width="${px(w * 0.24)}" height="${px(h * 0.55)}" rx="${px(w / 90)}"
    fill="#000000" fill-opacity="0.6" stroke="#ffffff" stroke-opacity="0.7" stroke-width="${w / 800}"/>`
  for (let i = 0; i < 4; i++) {
    s += `<rect x="${px(cx + w * 0.03)}" y="${px(h * (0.29 + i * 0.1))}" width="${px(w * (0.17 - i * 0.02))}" height="${px(h * 0.035)}" rx="${px(h * 0.017)}"
      fill="#ffffff" fill-opacity="${i === 0 ? 0.85 : 0.3 - i * 0.05}"/>`
  }
  s += `<rect x="${px(cx)}" y="${px(h * 0.2)}" width="${px(w * 0.24)}" height="${px(h * 0.55)}" rx="${px(w / 90)}"
    fill="#ffffff" fill-opacity="0.05" filter="url(#soft)"/>`
  return s
}

/** Spotlight: agent migration — a workflow re-expressed, equivalence proven. */
function motifMigrate(w, h) {
  let s = ''
  const node = (x, y, rad, op) =>
    `<circle cx="${px(x)}" cy="${px(y)}" r="${px(rad)}" fill="#000000" fill-opacity="0.6" stroke="#ffffff" stroke-opacity="${op}" stroke-width="${w / 850}"/>`
  const chainY = [h * 0.3, h * 0.5, h * 0.7]
  // Source workflow, left.
  chainY.forEach((y, i) => {
    s += node(w * 0.24, y, w * 0.022, 0.4)
    if (i < 2) s += `<path d="M${px(w * 0.24)} ${px(y + w * 0.022)} V ${px(chainY[i + 1] - w * 0.022)}" stroke="#ffffff" stroke-opacity="0.18" stroke-width="${w / 1000}"/>`
  })
  // Target workflow, right — same shape, so equivalence is the visual claim.
  chainY.forEach((y, i) => {
    s += node(w * 0.8, y, w * 0.022, 0.85)
    if (i < 2) s += `<path d="M${px(w * 0.8)} ${px(y + w * 0.022)} V ${px(chainY[i + 1] - w * 0.022)}" stroke="#ffffff" stroke-opacity="0.5" stroke-width="${w / 1000}"/>`
  })
  // The IR they both pass through.
  const mx = w * 0.52
  s += `<rect x="${px(mx - w * 0.055)}" y="${px(h * 0.34)}" width="${px(w * 0.11)}" height="${px(h * 0.32)}" rx="${px(w / 90)}"
    fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.75" stroke-width="${w / 800}"/>`
  for (let i = 0; i < 3; i++) {
    s += `<path d="M${px(w * 0.28)} ${px(chainY[i])} H ${px(mx - w * 0.055)}" stroke="#ffffff" stroke-opacity="0.2" stroke-width="${w / 1050}" stroke-dasharray="${w / 170} ${w / 210}"/>`
    s += `<path d="M${px(mx + w * 0.055)} ${px(chainY[i])} H ${px(w * 0.76)}" stroke="#ffffff" stroke-opacity="0.5" stroke-width="${w / 1050}"/>`
  }
  s += `<rect x="${px(mx - w * 0.055)}" y="${px(h * 0.34)}" width="${px(w * 0.11)}" height="${px(h * 0.32)}" rx="${px(w / 90)}" fill="#ffffff" fill-opacity="0.12" filter="url(#soft)"/>`
  return s
}

const PLATES = [
  // Spotlight — 2:1, matching .spot-art
  { out: 'public/void/spotlight/quote-turnaround.webp', w: 1400, h: 700, band: 'amber', motif: motifQuote,   seed: 83 },
  { out: 'public/void/spotlight/agent-migration.webp',  w: 1400, h: 700, band: 'rose',  motif: motifMigrate, seed: 97 },
]

for (const p of PLATES) {
  const r = rng(p.seed)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${p.w}" height="${p.h}" viewBox="0 0 ${p.w} ${p.h}">
    ${ground(p.w, p.h, p.band, { glowX: p.glowX ?? 0.62, glowY: p.glowY ?? 0.42, glow: p.glow ?? 1 })}
    ${p.motif(p.w, p.h, r)}
    ${vignette(p.w, p.h)}
  </svg>`

  await mkdir(dirname(p.out), { recursive: true })
  await sharp(Buffer.from(svg)).webp({ quality: 88, effort: 6 }).toFile(p.out)
  console.log('wrote', p.out)
}
