/* Rendered instantly on navigation while the page streams in. Without it the
   browser sits on the old page with no feedback, which reads as "nothing
   happened" even when the response is quick. */
export default function Loading() {
  return (
    <div className="jr" aria-busy="true" aria-label="Loading">
      <div className="shell" style={{ paddingTop: 'calc(var(--nav-h) + 96px)', display: 'grid', gap: 18 }}>
        <span className="jr-sk" style={{ width: 120, height: 12 }} />
        <span className="jr-sk" style={{ width: '70%', height: 48 }} />
        <span className="jr-sk" style={{ width: '45%', height: 48 }} />
        <span className="jr-sk" style={{ width: '60%', height: 16, marginTop: 12 }} />
        <span className="jr-sk" style={{ width: '100%', aspectRatio: '1.91 / 1', borderRadius: 22, marginTop: 32 }} />
      </div>
    </div>
  )
}
