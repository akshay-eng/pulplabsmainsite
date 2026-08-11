import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Services from './pages/Services'
import Team from './pages/Team'
import Blog from './pages/Blog'
import AIDock from './components/AIDock'
import { useRevealObserver } from './lib/motion'

// Route changes jump to the top; a hash (e.g. /#contact) scrolls to that section instead.
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  // One observer for the whole app; sections opt in with a `data-reveal` attribute.
  useRevealObserver()

  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/team" element={<Team />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Mounted outside <Routes> so the transcript survives navigation */}
      <AIDock />
    </>
  )
}
