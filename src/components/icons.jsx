/* Flat fruit-slice iconography. Every icon sits on a tinted disc so the set
   reads as one family at 38–46px. */

export function IconAdvisory({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="21" cy="21" r="20" fill="#FFEBD9" />
      <circle cx="21" cy="21" r="9" fill="none" stroke="#FF6B1A" strokeWidth="2.6" />
      <path
        d="M21 12 L21 8 M21 34 L21 30 M12 21 L8 21 M34 21 L30 21"
        stroke="#FF6B1A"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconAccelerators({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="21" cy="21" r="20" fill="#FFE1E4" />
      <path
        d="M9 23 L16 23 L19 14 L24 30 L27 23 L33 23"
        stroke="#F0384B"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconSmallBusiness({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="21" cy="21" r="20" fill="#FFF3C4" />
      <path
        d="M12 28 L18 21 L23 25 L30 14"
        stroke="#C9930A"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="14" r="3" fill="#C9930A" />
    </svg>
  )
}

export function IconEnablement({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="21" cy="21" r="20" fill="#FFE4EE" />
      <circle cx="16" cy="17" r="4.5" fill="#E0447E" />
      <circle cx="26" cy="17" r="4.5" fill="#E0447E" opacity=".55" />
      <path
        d="M10 30 C12 24, 20 24, 22 30 M20 30 C22 24, 30 24, 32 30"
        stroke="#E0447E"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconManagedOps({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="21" cy="21" r="20" fill="#EAF6DC" />
      <path d="M13 25 A9 9 0 1 1 21 30" stroke="#4F8A1D" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path
        d="M13 19 L13 26 L20 26"
        stroke="#4F8A1D"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconIncident({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="22" cy="22" r="21" fill="#FFEBD9" />
      <path
        d="M9 24 L17 24 L20 15 L25 31 L28 24 L35 24"
        stroke="#FF6B1A"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconChange({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="22" cy="22" r="21" fill="#FFEBD9" />
      <path d="M13 18 A9 9 0 1 1 13 26" stroke="#FF6B1A" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path
        d="M13 12 L13 19 L20 19"
        stroke="#F0384B"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconPatch({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="22" cy="22" r="21" fill="#FFEBD9" />
      <rect x="12" y="12" width="9" height="9" rx="2" fill="#FF6B1A" />
      <rect x="23" y="12" width="9" height="9" rx="2" fill="#FFC93C" />
      <rect x="12" y="23" width="9" height="9" rx="2" fill="#FFC93C" />
      <rect x="23" y="23" width="9" height="9" rx="2" fill="#FF6B1A" />
    </svg>
  )
}

export function IconMigration({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="22" cy="22" r="21" fill="#FFEBD9" />
      <circle cx="15" cy="22" r="5" fill="#FF5C93" />
      <circle cx="30" cy="22" r="5" fill="#FF6B1A" />
      <path d="M21 22 L26 22" stroke="#FF6B1A" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M24 19 L27 22 L24 25"
        stroke="#FF6B1A"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* Pie-slice progress markers for the four engagement steps. */
const PIE_PATHS = {
  quarter: 'M20 20 L20 9 A11 11 0 0 1 29.5 25.5 Z',
  half: 'M20 20 L20 9 A11 11 0 1 1 9.6 23.2 Z',
  threequarter: 'M20 20 L20 9 A11 11 0 1 1 9 20 Z',
}

export function PieIcon({ size = 38, disc, fill, fraction = 'quarter', full = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill={disc} />
      {full ? <circle cx="20" cy="20" r="11" fill={fill} /> : <path d={PIE_PATHS[fraction]} fill={fill} />}
    </svg>
  )
}

/* Certification badges. */
export function CertClaude({ size = 38 }) {
  return <PieIcon size={size} disc="#FFEBD9" fill="#FF6B1A" fraction="quarter" />
}

export function CertOpenAI({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#FFE1E4" />
      <circle cx="20" cy="20" r="10" fill="none" stroke="#F0384B" strokeWidth="2.6" />
    </svg>
  )
}

export function CertCopilot({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#FFF3C4" />
      <rect x="12" y="12" width="7" height="7" rx="2" fill="#C9930A" />
      <rect x="21" y="12" width="7" height="7" rx="2" fill="#E8B00A" />
      <rect x="12" y="21" width="7" height="7" rx="2" fill="#E8B00A" />
      <rect x="21" y="21" width="7" height="7" rx="2" fill="#C9930A" />
    </svg>
  )
}

export function CertWatsonx({ size = 38 }) {
  return <PieIcon size={size} disc="#EAF6DC" fill="#7BC043" full />
}
