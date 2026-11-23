/* ==========================================================================
   Glyphs — the PulpLabs icon set.

   Drawn on one 24px grid with a 1.5 stroke, round caps and round joins, the
   same line language as the mark in the nav. Strokes only, currentColor
   only: on the void an icon is a line of light, never a filled badge.

   Each glyph keeps a 2px safe margin and a single focal detail, so it reads
   at 16px in a tab rail and still holds up at 40px in a glass tile.
   ========================================================================== */

function G({ size = 24, children, label, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      {children}
    </svg>
  )
}

/* ---------------------------------------------------------- functions --- */

// Two racked units with a live pulse running through the top one
export const IconITOps = (p) => (
  <G {...p}>
    <rect x="3.5" y="4" width="17" height="7" rx="2" />
    <rect x="3.5" y="13" width="17" height="7" rx="2" />
    <path d="M6.5 7.5h2l1.2-1.8 1.8 3.6 1.2-1.8h1.8" />
    <path d="M7 16.5h.01M10 16.5h.01" strokeWidth="2.2" />
  </G>
)

// A path climbing through three nodes to an arrowhead
export const IconSales = (p) => (
  <G {...p}>
    <path d="M3.5 19.5h17" opacity=".45" />
    <path d="M4.5 16l5-5 3.5 3 6.5-7" />
    <path d="M15.5 7h4v4" />
    <circle cx="9.5" cy="11" r="1.1" />
    <circle cx="13" cy="14" r="1.1" />
  </G>
)

// A speech bubble resolved with a tick
export const IconSupport = (p) => (
  <G {...p}>
    <path d="M20 11.5c0 4-3.6 7-8 7-1.2 0-2.3-.2-3.3-.6L4 19.5l1.3-3.6C4.5 14.6 4 13.1 4 11.5c0-4 3.6-7 8-7s8 3 8 7z" />
    <path d="M8.8 11.6l2.2 2.2 4.2-4.4" />
  </G>
)

// A source broadcasting outward
export const IconMarketing = (p) => (
  <G {...p}>
    <circle cx="7" cy="12" r="2" />
    <path d="M11.5 8.5a5 5 0 010 7" />
    <path d="M14.5 6a8.5 8.5 0 010 12" />
    <path d="M17.6 3.8a11.6 11.6 0 010 16.4" opacity=".55" />
  </G>
)

// A ledger with a reconciled line
export const IconFinance = (p) => (
  <G {...p}>
    <rect x="4.5" y="3.5" width="15" height="17" rx="2.2" />
    <path d="M8 8h8M8 11.5h5" />
    <path d="M8.5 16l1.6 1.6 3.4-3.4" />
    <path d="M16 15.5v2" opacity=".55" />
  </G>
)

// Columns with a trend line drawn across them
export const IconData = (p) => (
  <G {...p}>
    <path d="M5 20v-5M10 20v-8M15 20v-4M20 20V8" />
    <path d="M4 10l5-4 5 3 6-5" opacity=".6" />
  </G>
)

export const functionGlyph = {
  'it-operations': IconITOps,
  sales: IconSales,
  support: IconSupport,
  marketing: IconMarketing,
  finance: IconFinance,
  data: IconData,
}

/* ------------------------------------------------------- process steps --- */

// A lens over scattered points — the audit
export const IconDiscover = (p) => (
  <G {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15 15l5 5" />
    <path d="M8.5 9h.01M12 8h.01M10.5 12.5h.01" strokeWidth="2.2" />
  </G>
)

// A frame with registration marks — a fixed scope
export const IconScope = (p) => (
  <G {...p}>
    <path d="M4 8V5.5A1.5 1.5 0 015.5 4H8M16 4h2.5A1.5 1.5 0 0120 5.5V8M20 16v2.5a1.5 1.5 0 01-1.5 1.5H16M8 20H5.5A1.5 1.5 0 014 18.5V16" />
    <path d="M8.5 12h7M12 8.5v7" opacity=".55" />
    <circle cx="12" cy="12" r="2.4" />
  </G>
)

// An isometric block with a gate line — built, then evaluated
export const IconBuild = (p) => (
  <G {...p}>
    <path d="M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7z" />
    <path d="M4.5 7.7L12 12l7.5-4.3M12 12v8.5" />
    <path d="M8.2 14.6l1.6 1 2-2.4" opacity=".7" />
  </G>
)

// A key turning over — your code, your team
export const IconHandover = (p) => (
  <G {...p}>
    <circle cx="8" cy="15.5" r="3.5" />
    <path d="M10.5 13l8-8M15.5 8l2.5 2.5M17.5 6l2 2" />
  </G>
)

export const stepGlyph = [IconDiscover, IconScope, IconBuild, IconHandover]

/* ----------------------------------------------------------- utilities --- */

export const IconArrowUpRight = (p) => (
  <G {...p}>
    <path d="M7 17L17 7M17 7H9M17 7v8" />
  </G>
)

export const IconCheck = (p) => (
  <G {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </G>
)
