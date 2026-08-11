/* Rendered instantly on navigation while the page streams in. Without it the
   browser sits on the old page with no feedback, which reads as "nothing
   happened" even when the response is quick. */
export default function Loading() {
  return (
    <div className="page">
      <div className="skeleton-header">
        <div className="shell">
          <span className="sk sk-kicker" />
          <span className="sk sk-title" />
          <span className="sk sk-title short" />
          <span className="sk sk-line" />
        </div>
      </div>
      <div className="shell skeleton-body">
        <span className="sk sk-line" />
        <span className="sk sk-line" />
        <span className="sk sk-line short" />
        <span className="sk sk-line" />
        <span className="sk sk-line short" />
      </div>
    </div>
  )
}
