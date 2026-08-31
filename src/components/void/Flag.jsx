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
 * The maple leaf took three attempts. What finally made it read as a leaf
 * rather than a star was the stem: the body has to stop short and a narrow
 * shaft continue down, otherwise every point radiates from the centre.
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
      <path d="" fill="#D52B1E" />
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
    <svg className="flag" viewBox="0 0 24 16" width="20" height="13" {...label}>
      {art}
      {/* Hairline edge so the white in the Indian and Canadian flags does not
          bleed into a light background, and the yellow band in Lithuania's
          keeps a defined top edge. */}
      <rect x="0.25" y="0.25" width="23.5" height="15.5" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="0.5" />
    </svg>
  )
}
