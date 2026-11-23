import manifest from '@/data/art-manifest.json'

/* <Art> — an <img> that serves the right resolution.

   For artwork imported at 4K (scripts/ingest-art.mjs records it in
   art-manifest.json) it emits a srcset of 960 / 1920 / full-size WebP, so a
   4K display gets the 4K file and a phone downloads a tenth of it. Anything
   not yet imported renders exactly as a plain <img> did, so pages never
   point at files that do not exist. */
export default function Art({ src, sizes = '100vw', alt = '', ...rest }) {
  const m = manifest[src]
  if (!m) return <img src={src} alt={alt} {...rest} />

  const base = src.replace(/\.webp$/, '')
  const srcSet = m.sizes
    .map((w) => (w === m.w ? `${src} ${w}w` : `${base}-${w}.webp ${w}w`))
    .join(', ')
  return <img src={src} srcSet={srcSet} sizes={sizes} width={m.w} height={m.h} alt={alt} {...rest} />
}
