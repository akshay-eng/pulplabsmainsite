'use client'

import { Component } from 'react'

/* Catches anything a WebGL scene throws — a lost context, a driver that
   refuses a shader, a canvas torn down mid-creation by a fast tab switch —
   and renders the fallback instead of taking the page down with it. */
export default class SceneBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(err) {
    console.warn('[scene] fell back to static art:', err?.message || err)
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
