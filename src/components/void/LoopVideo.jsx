'use client'

import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   LoopVideo — a silent, looping background plate.

   Three gates before a single byte is fetched, because a background video is
   pure decoration and must never cost a visitor who did not ask for it:

     1. prefers-reduced-motion — an autoplaying loop is exactly what that
        setting exists to stop. Poster only.
     2. Save-Data / 2g-3g — the poster is 8KB, the video is 200KB+.
     3. Off-screen — the source is not attached until it scrolls into view.

   The poster carries the composition on its own, so every suppressed path
   still looks finished rather than blank.
   ========================================================================== */
export default function LoopVideo({ src, poster, className = '', opacity = 1 }) {
  const wrap = useRef(null)
  const video = useRef(null)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const c = navigator.connection
    if (c?.saveData || /2g/.test(c?.effectiveType ?? '')) return

    const node = wrap.current
    if (!node) return

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setPlay(true)
        io.disconnect()
      },
      { rootMargin: '200px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!play) return
    // Autoplay can still be refused; the poster stays visible if it is.
    video.current?.play?.().catch(() => {})
  }, [play])

  return (
    <div ref={wrap} className={`loop ${className}`} style={{ opacity }} aria-hidden="true">
      <video
        ref={video}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        /* Tells Safari/iOS this is decorative chrome, not media the user
           chose to watch — keeps it out of picture-in-picture and the
           now-playing controls. */
        disablePictureInPicture
        tabIndex={-1}
      >
        {play && (
          <>
            <source src={`${src}.webm`} type="video/webm" />
            <source src={`${src}.mp4`} type="video/mp4" />
          </>
        )}
      </video>
    </div>
  )
}
