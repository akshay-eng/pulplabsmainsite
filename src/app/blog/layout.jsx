/* The journal routes (blog, case studies) now sit on the void system like
   every other page. void.css and liquid.css come from the root layout; this
   adds only the long-form reading styles. */
import '@/styles/journal.css'

export default function JournalLayout({ children }) {
  return children
}
