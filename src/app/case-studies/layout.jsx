/* The previous design system, scoped to the routes that still use it. The
   reimagined landing pages load src/styles/apple.css alone; keeping both in
   the root layout would put two conflicting foundations on every page. */
import '@/styles/global.css'
import '@/styles/refined.css'
import '@/styles/components.css'
import '@/styles/blog.css'

export default function LegacyLayout({ children }) {
  return children
}
