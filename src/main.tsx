import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SmoothScroll from './components/SmoothScroll.tsx'

// Prevent the browser from restoring a prior scroll position on refresh —
// that restore can land after the hero's mount-triggered entrance animation
// has already started, yanking the viewport mid-animation. This only
// disables "remember where I was" on reload/back-forward; a URL hash (e.g.
// #solutions) still scrolls to that section normally.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
if (!location.hash) {
  window.scrollTo(0, 0)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScroll>
      <App />
    </SmoothScroll>
  </StrictMode>,
)
