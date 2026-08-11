import 'server-only'
import { mkdir, writeFile, readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import { randomBytes } from 'node:crypto'

/* ==========================================================================
   Cover-image uploads.

   Files go to a directory on the same persistent volume as the database, not
   into public/. public/ is baked into the Docker image at build time — writes
   there vanish on the next deploy, and in the standalone output it isn't even
   writable.
   ========================================================================== */

export const UPLOAD_DIR = process.env.UPLOAD_DIR || '.data/uploads'

/** 1200×630 — the Open Graph standard. Cover art doubles as the social card,
 *  so one ratio serves both and there's nothing to reconcile later. */
export const COVER_RATIO = 1200 / 630
export const COVER_HINT = '1200×630 (1.91:1)'

const MAX_BYTES = 8 * 1024 * 1024

const TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
}

export const CONTENT_TYPES = Object.fromEntries(
  Object.entries(TYPES).map(([mime, ext]) => [ext, mime]),
)

/** Reads the real format from magic bytes — a client-supplied Content-Type is
 *  trivially spoofed, and this file gets served back to browsers. */
function sniff(buf) {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (buf.subarray(0, 3).toString('ascii') === 'GIF') return 'image/gif'
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP')
    return 'image/webp'
  if (buf.subarray(4, 8).toString('ascii') === 'ftyp' && buf.subarray(8, 12).toString('ascii').startsWith('avif'))
    return 'image/avif'
  return null
}

/** Pulls intrinsic dimensions so the editor can warn about a bad ratio.
 *  Only PNG/JPEG/GIF are parsed — enough to be useful, and a null result just
 *  means "no warning", never a rejected upload. */
export function dimensions(buf, mime) {
  try {
    if (mime === 'image/png') return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    if (mime === 'image/gif') return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }
    if (mime === 'image/jpeg') {
      let i = 2
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) { i++; continue }
        const marker = buf[i + 1]
        // SOF0..SOF15, excluding the non-frame markers C4 / C8 / CC
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }
        }
        i += 2 + buf.readUInt16BE(i + 2)
      }
    }
  } catch {
    /* malformed header — fall through to null */
  }
  return null
}

export async function saveUpload(file) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    return { error: 'No file received.' }
  }
  if (file.size > MAX_BYTES) {
    return { error: `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 8MB.` }
  }

  const buf = Buffer.from(await file.arrayBuffer())
  const mime = sniff(buf)
  if (!mime) {
    return { error: 'That does not look like an image. Use JPEG, PNG, WebP, AVIF or GIF.' }
  }

  // Random name: never trust the client filename, and this sidesteps both path
  // traversal and collisions in one go.
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString('hex')}${TYPES[mime]}`
  await mkdir(UPLOAD_DIR, { recursive: true })
  await writeFile(join(UPLOAD_DIR, name), buf)

  const dim = dimensions(buf, mime)
  return {
    url: `/uploads/${name}`,
    bytes: buf.length,
    mime,
    ...(dim ? { width: dim.width, height: dim.height, ratio: +(dim.width / dim.height).toFixed(2) } : {}),
  }
}

/** Reads a stored upload. Returns null for anything that escapes UPLOAD_DIR. */
export async function readUpload(name) {
  // Reject traversal before touching the filesystem.
  if (!/^[A-Za-z0-9._-]+$/.test(name) || name.includes('..')) return null
  const ext = extname(name).toLowerCase()
  if (!CONTENT_TYPES[ext]) return null

  const path = normalize(join(UPLOAD_DIR, name))
  if (!path.startsWith(normalize(UPLOAD_DIR))) return null

  try {
    const [body, info] = await Promise.all([readFile(path), stat(path)])
    return { body, type: CONTENT_TYPES[ext], size: info.size }
  } catch {
    return null
  }
}
