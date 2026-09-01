/* Country flags, drawn rather than typed.
 *
 * Emoji flags were the obvious answer and are the wrong one: Windows ships no
 * country-flag glyphs at all, so every Chrome and Edge visitor would see the
 * letter pair "IN" or "CA" where a flag should be. These are inline SVG, so
 * they render identically everywhere and cost no request.
 *
 * All three sit in the same 3:2 box for a tidy column. Canada's real ratio is
 * 1:2, so its bands are marginally wide here; matching each flag's true ratio
 * would stagger the alignment for no gain at this size.
 *
 * SIZE IS PART OF THE DRAWING. These render at 30x20. At the 20x13 they used
 * to be, Canada's maple leaf disappeared completely: every notch in it was
 * sub-pixel and averaged away, leaving plain red-white-red that reads as Peru.
 * India's chakra was a navy smudge. Both were verified by rasterising at the
 * exact pixel size and magnifying with nearest-neighbour, which is the only
 * check that shows what a screen actually shows. Magnifying the SVG instead
 * flatters detail that never survives.
 *
 * The leaf is also drawn chunkier than a real one for the same reason: eleven
 * fat lobes rather than the true outline, because fine notches do not exist at
 * 20 pixels tall.
 */
const FLAGS = {
  IN: (
    <>
      <rect width="24" height="5.333" fill="#FF9933" />
      <rect y="5.333" width="24" height="5.334" fill="#fff" />
      <rect y="10.667" width="24" height="5.333" fill="#138808" />
      <g stroke="#000080" strokeWidth="0.22">
      <line x1="12" y1="8" x2="12.00" y2="6.00" />
      <line x1="12" y1="8" x2="12.52" y2="6.07" />
      <line x1="12" y1="8" x2="13.00" y2="6.27" />
      <line x1="12" y1="8" x2="13.41" y2="6.59" />
      <line x1="12" y1="8" x2="13.73" y2="7.00" />
      <line x1="12" y1="8" x2="13.93" y2="7.48" />
      <line x1="12" y1="8" x2="14.00" y2="8.00" />
      <line x1="12" y1="8" x2="13.93" y2="8.52" />
      <line x1="12" y1="8" x2="13.73" y2="9.00" />
      <line x1="12" y1="8" x2="13.41" y2="9.41" />
      <line x1="12" y1="8" x2="13.00" y2="9.73" />
      <line x1="12" y1="8" x2="12.52" y2="9.93" />
      <line x1="12" y1="8" x2="12.00" y2="10.00" />
      <line x1="12" y1="8" x2="11.48" y2="9.93" />
      <line x1="12" y1="8" x2="11.00" y2="9.73" />
      <line x1="12" y1="8" x2="10.59" y2="9.41" />
      <line x1="12" y1="8" x2="10.27" y2="9.00" />
      <line x1="12" y1="8" x2="10.07" y2="8.52" />
      <line x1="12" y1="8" x2="10.00" y2="8.00" />
      <line x1="12" y1="8" x2="10.07" y2="7.48" />
      <line x1="12" y1="8" x2="10.27" y2="7.00" />
      <line x1="12" y1="8" x2="10.59" y2="6.59" />
      <line x1="12" y1="8" x2="11.00" y2="6.27" />
      <line x1="12" y1="8" x2="11.48" y2="6.07" />
      </g>
      <circle cx="12" cy="8" r="2" fill="none" stroke="#000080" strokeWidth="0.45" />
      <circle cx="12" cy="8" r="0.45" fill="#000080" />
    </>
  ),
  CA: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect width="6" height="16" fill="#D52B1E" />
      <rect x="18" width="6" height="16" fill="#D52B1E" />
      <path d="M12.00 1.70L12.90 5.48L14.24 4.72L13.90 6.99L16.03 6.24L15.47 8.63L16.82 9.51L14.24 10.02L14.58 12.54L12.78 11.78L12.73 14.30L11.22 11.78L9.42 12.54L9.76 10.02L7.18 9.51L8.53 8.63L7.97 6.24L10.10 6.99L9.76 4.72L11.10 5.48L12.00 1.70Z" fill="#D52B1E" />
    </>
  ),
  LT: (
    <>
      <rect width="24" height="5.333" fill="#FDB913" />
      <rect y="5.333" width="24" height="5.334" fill="#006A44" />
      <rect y="10.667" width="24" height="5.333" fill="#C1272D" />
    </>
  ),
}

export default function Flag({ code, title }) {
  const art = FLAGS[code]
  if (!art) return null
  /* Labelled only when asked. Where the country is spelled out in text beside
     the flag, an aria-label here would make a screen reader announce it twice. */
  const label = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true }
  return (
    <svg className="flag" viewBox="0 0 24 16" width="30" height="20" {...label}>
      {art}
      {/* Hairline edge so the white in the Indian and Canadian flags does not
          bleed into a light background, and the yellow band in Lithuania's
          keeps a defined top edge. */}
      <rect x="0.25" y="0.25" width="23.5" height="15.5" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="0.5" />
    </svg>
  )
}
