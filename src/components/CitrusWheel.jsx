// Eight-segment citrus wheel — the hero's slow-spinning centrepiece.
export default function CitrusWheel({ size = 330, className = 'spin-slow', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" fill="#FFE3C6" />
      <circle cx="50" cy="50" r="41" fill="#FFF3E4" />
      <path d="M50,50 L88,50 A38,38 0 0 1 79.5,73.9 Z" fill="#FF6B1A" />
      <path d="M50,50 L76.87,76.87 A38,38 0 0 1 53.97,87.8 Z" fill="#FF8A2B" />
      <path d="M50,50 L50,88 A38,38 0 0 1 26.1,79.5 Z" fill="#FF6B1A" />
      <path d="M50,50 L23.13,76.87 A38,38 0 0 1 12.2,53.97 Z" fill="#FFA23F" />
      <path d="M50,50 L12,50 A38,38 0 0 1 20.5,26.1 Z" fill="#FF6B1A" />
      <path d="M50,50 L23.13,23.13 A38,38 0 0 1 46.03,12.2 Z" fill="#F0384B" />
      <path d="M50,50 L50,12 A38,38 0 0 1 73.9,20.5 Z" fill="#FF6B1A" />
      <path d="M50,50 L76.87,23.13 A38,38 0 0 1 87.8,46.03 Z" fill="#FFC93C" />
      <circle cx="50" cy="50" r="7" fill="#FFF3E4" />
      <circle cx="50" cy="50" r="3" fill="#FF6B1A" />
    </svg>
  )
}
