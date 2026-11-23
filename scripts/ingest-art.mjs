#!/usr/bin/env node
/* Imports generated artwork (Higgsfield, or any source) at 4K.
 *
 *   node scripts/ingest-art.mjs ~/Downloads/pulplabs-art
 *
 * Name each downloaded file after its key in TARGETS below — e.g.
 * `ind-retail.png` — and drop them all in one folder. For every match this
 * writes three WebP files next to the original asset:
 *
 *   <name>.webp        the full size (3840 wide for plates, 2160 for tiles)
 *   <name>-1920.webp   for 1080p-class screens
 *   <name>-960.webp    for phones
 *
 * and records it in src/data/art-manifest.json, which the <Art> component
 * reads to emit a srcset. Unrecognised files are listed and skipped.
 * Re-running replaces the earlier encode. */

import sharp from 'sharp'
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, parse, resolve } from 'node:path'

// key -> [public path, full width, aspect w/h]
const TARGETS = {
  // Sector tiles (square) — CategoryPicker and /services/for/[slug]
  'ind-financial': ['/void/cat/ind-financial.webp', 2160, 1],
  'ind-healthcare': ['/void/cat/ind-healthcare.webp', 2160, 1],
  'ind-manufacturing': ['/void/cat/ind-manufacturing.webp', 2160, 1],
  'ind-retail': ['/void/cat/ind-retail.webp', 2160, 1],
  'ind-professional': ['/void/cat/ind-professional.webp', 2160, 1],
  'ind-public': ['/void/cat/ind-public.webp', 2160, 1],
  'dept-it-operations': ['/void/cat/dept-it-operations.webp', 2160, 1],
  'dept-sales': ['/void/cat/dept-sales.webp', 2160, 1],
  'dept-support': ['/void/cat/dept-support.webp', 2160, 1],
  'dept-marketing': ['/void/cat/dept-marketing.webp', 2160, 1],
  'dept-finance': ['/void/cat/dept-finance.webp', 2160, 1],
  'dept-data': ['/void/cat/dept-data.webp', 2160, 1],
  // Home section plates (square)
  'sec-connect': ['/void/sec-connect.webp', 2160, 1],
  'sec-approve': ['/void/sec-approve.webp', 2160, 1],
  // Widescreen plates (16:9)
  'advisory-strategy': ['/void/advisory-strategy.webp', 3840, 16 / 9],
  'enablement-workshops': ['/void/enablement-workshops.webp', 3840, 16 / 9],
  'mo-hero': ['/void/managed/mo-hero.webp', 3840, 16 / 9],
  'hero-bleed': ['/void/hero-bleed.webp', 3840, 16 / 9],
}

const dir = process.argv[2]
if (!dir || !existsSync(dir)) {
  console.error('Usage: node scripts/ingest-art.mjs <folder-of-images>')
  process.exit(1)
}

const manifestPath = resolve('src/data/art-manifest.json')
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {}

const files = readdirSync(dir).filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f))
let done = 0
for (const f of files) {
  const key = parse(f).name.toLowerCase()
  const t = TARGETS[key]
  if (!t) {
    console.log(`– skipped ${f} (no target named "${key}")`)
    continue
  }
  const [pub, full, aspect] = t
  const src = join(dir, f)
  const meta = await sharp(src).metadata()
  const out = resolve('public' + pub)
  const base = out.replace(/\.webp$/, '')
  const height = Math.round(full / aspect)

  if (meta.width < full * 0.75) {
    console.warn(`! ${f} is ${meta.width}px wide; the 4K target is ${full}px. It will be upscaled — use Higgsfield's 4K output or upscaler for real detail.`)
  }

  // Cover-crop to the target aspect, Lanczos resample, high-quality WebP.
  // smartSubsample keeps colour edges clean on the dark grounds this site uses.
  const encode = (w, path) =>
    sharp(src)
      .resize(w, Math.round(w / aspect), { fit: 'cover', position: 'attention', kernel: 'lanczos3' })
      .webp({ quality: w >= 2000 ? 84 : 80, effort: 6, smartSubsample: true })
      .toFile(path)

  await encode(full, out)
  await encode(1920, `${base}-1920.webp`)
  await encode(960, `${base}-960.webp`)

  manifest[pub] = { w: full, h: height, sizes: [960, 1920, full] }
  done++
  console.log(`✓ ${f} -> ${pub} (${full}×${height}, +1920, +960)`)
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n${done} image(s) imported. Manifest: src/data/art-manifest.json`)
