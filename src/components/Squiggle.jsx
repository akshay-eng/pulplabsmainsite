// Lemon marker stroke that sits under an emphasised phrase.
export default function Squiggle({ children, height = 14, weight = 6 }) {
  return (
    <span className="squiggle">
      {children}
      <svg
        width="100%"
        height={height}
        viewBox="0 0 120 14"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M2 9 C30 2, 90 2, 118 8" stroke="#FFC93C" strokeWidth={weight} fill="none" strokeLinecap="round" />
      </svg>
    </span>
  )
}
