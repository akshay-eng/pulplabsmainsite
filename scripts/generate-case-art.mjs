#!/usr/bin/env node
/* Case-study cover art for the void system, same pipeline as
 * generate-hero-bg.mjs. Run with GKEY=<api-key> node scripts/generate-case-art.mjs
 * — writes raw PNGs to the current directory; convert and resize to webp
 * before committing (the raw 2K PNGs are 5–10 MB and never ship).
 *
 * Art direction follows public/IMAGE_CREDITS.md and the README: deliberately
 * abstract rather than photoreal — a realistic factory photo on a case study
 * would imply it documents that client's actual facility. Dark ground with a
 * single band of spectral light, because in the void system colour only ever
 * arrives through generated light imagery. The lower-left quarter stays calm
 * and dark: the story card sits there. */

const KEY = process.env.GKEY
if (!KEY) { console.error('GKEY not set'); process.exit(1) }

const BASE =
  'Dark, near-black ground (#050505), premium abstract 3D render, monochrome silver and white ' +
  'with ONE restrained band of warm spectral light (amber-to-orange dispersion) as the only colour. ' +
  'NO text, NO letters, NO numbers, NO logos, NO people, NO faces, NO screens, NO photoreal machinery. ' +
  'Composition: the LOWER-LEFT quarter stays almost empty, very dark and calm — a card of text sits there. ' +
  'Detail and light belong centre-right. Cinematic studio lighting, razor sharp, no noise, no blur. ' +
  'Wide 16:9 banner. '

const CASES = [
  {
    file: 'case-manufacturing.png',
    prompt:
      BASE +
      'SUBJECT: an abstract production line — small translucent glass cubes and cylinders gliding along ' +
      'a curved ribbon of frosted glass, like products moving through a sculptural conveyor in darkness. ' +
      'The warm spectral light traces the path of the line and refracts through the moving pieces.',
  },
  {
    file: 'case-research.png',
    prompt:
      BASE +
      'SUBJECT: hundreds of fine luminous threads rising from darkness and weaving themselves into a few ' +
      'distinct glowing clusters, like scattered fragments organising into themes. Threads are silver-white; ' +
      'the warm spectral band catches the moment where threads join a cluster.',
  },
]

for (const c of CASES) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key=${KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: c.prompt }] }],
        generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9', imageSize: '2K' } },
      }),
    },
  )
  const d = await res.json()
  const img = (d?.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData)
  if (!img) { console.error(`${c.file}: no image —`, JSON.stringify(d).slice(0, 300)); process.exit(1) }
  const buf = Buffer.from(img.inlineData.data, 'base64')
  const { writeFileSync } = await import('node:fs')
  writeFileSync(c.file, buf)
  console.log(`✓ ${c.file} ${(buf.length / 1024 / 1024).toFixed(1)} MB raw`)
}
