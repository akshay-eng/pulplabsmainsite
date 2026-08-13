/* A distinct geometric mark per platform.
 *
 * These are deliberately NOT the vendors' logos. Redrawing someone else's
 * trademark from memory gets it subtly wrong, and a subtly wrong logo on a
 * page claiming certification reads worse than no logo at all. Each mark is
 * our own shape, chosen to echo what the platform is for, and the vendor's
 * actual name sits beside it in text — which is the part that identifies it. */
const MARKS = {
  // Converging rays — long context narrowing to one answer.
  claude: (
    <g>
      <path d="M8 3v10M8 3L3.4 5.6M8 3l4.6 2.6M8 13l-4.6-2.6M8 13l4.6-2.6M3.4 5.6v4.8M12.6 5.6v4.8" />
    </g>
  ),
  // Interlocking rings — a broad surface of composable pieces.
  openai: (
    <g>
      <circle cx="6.2" cy="8" r="3.5" />
      <circle cx="9.8" cy="8" r="3.5" />
    </g>
  ),
  // Four panes — the Microsoft grid, abstracted to an open frame.
  copilot: (
    <g>
      <rect x="2.8" y="2.8" width="4.4" height="4.4" rx="1" />
      <rect x="8.8" y="2.8" width="4.4" height="4.4" rx="1" />
      <rect x="2.8" y="8.8" width="4.4" height="4.4" rx="1" />
      <path d="M8.8 11h4.4" />
    </g>
  ),
  // Nested apertures — multimodality, several signals in one frame.
  gemini: (
    <g>
      <path d="M8 2.4c1.6 2.6 3 4 5.6 5.6-2.6 1.6-4 3-5.6 5.6-1.6-2.6-3-4-5.6-5.6C5 6.4 6.4 5 8 2.4Z" />
    </g>
  ),
  // A stack under a bar — a governed catalogue of skills.
  watsonx: (
    <g>
      <path d="M2.6 3.6h10.8M2.6 8h10.8M2.6 12.4h10.8M5.4 3.6v8.8M10.6 3.6v8.8" />
    </g>
  ),
}

export default function PlatformMark({ id, className = '' }) {
  return (
    <svg className={`pmark ${className}`} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      {MARKS[id] ?? null}
    </svg>
  )
}
