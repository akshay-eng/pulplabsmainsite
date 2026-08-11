import { writeFileSync } from 'node:fs'
const KEY = process.env.GKEY

const PROMPT =
  'LIGHT, bright, airy composition on a warm off-white cream ground (#FDFBF8). ' +
  'ABSOLUTELY NO BLACK, no dark background, no navy, no charcoal — the image must feel sunlit. ' +
  'Palette: tangerine #FF6B1A, amber #FF8A2B, soft lemon #FFC93C, warm coral #F0384B used sparingly, cream. ' +
  'NO text, NO letters, NO numbers, NO logos, NO people, NO faces, NO fruit, NO oranges, NO citrus slices. ' +
  'Composition: the LEFT THIRD must stay almost empty and very pale (a dark headline sits there); ' +
  'mass, colour and detail belong in the centre-right. ' +
  'Ultra high detail, premium art direction, award-winning, 8k render, cinematic soft lighting. Wide 16:9 banner. ' +
  'SUBJECT: sweeping translucent glass ribbons, like molten sculpted crystal, ' +
  'curling and folding through the air. Thick refractive edges catching light, visible caustics ' +
  'and soft chromatic dispersion where they overlap, gentle drop shadows on the cream ground. ' +
  'Amber and tangerine glass, luminous and clean. Feels like blown-glass sculpture photographed in a bright studio. ' +
  'Razor sharp focus throughout, crisp specular highlights, no blur, no noise, pristine clarity.'

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key=${KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT }] }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9', imageSize: '4K' } },
    }),
  },
)
const d = await res.json()
const img = (d?.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData)
if (!img) { console.log('no image:', JSON.stringify(d).slice(0, 300)); process.exit(1) }
const buf = Buffer.from(img.inlineData.data, 'base64')
writeFileSync('hero-bg-4k.png', buf)
console.log(`saved ${(buf.length / 1024 / 1024).toFixed(1)} MB`)
