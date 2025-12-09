// Core Web Vitals Optimized Bundle
// Lazy load non-critical features to reduce initial bundle size

import { config, library, dom } from '@fortawesome/fontawesome-svg-core'
// Load only critical icons initially (above-the-fold content)
import { faRss } from '@fortawesome/free-solid-svg-icons/faRss'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin'

import { Collapse } from 'bootstrap'

import * as Turbo from '@hotwired/turbo'

window.Turbo = Turbo
window.Collapse = Collapse

// Configure FontAwesome for better performance
config.mutateApproach = 'sync'
// Disable auto-watching and add icons on demand
config.autoReplaceSvg = false

// Add critical icons immediately
library.add(
  faRss,
  faGithub,
  faEnvelope,
  faLinkedin
)

// Lazy load non-critical icons after page load
const loadNonCriticalIcons = async () => {
  const { faTwitter } = await import('@fortawesome/free-brands-svg-icons/faTwitter')
  const { faBluesky } = await import('@fortawesome/free-brands-svg-icons/faBluesky')
  const { faAddressCard } = await import('@fortawesome/free-solid-svg-icons/faAddressCard')
  const { faRetweet } = await import('@fortawesome/free-solid-svg-icons/faRetweet')
  const { faClock } = await import('@fortawesome/free-regular-svg-icons/faClock')
  const { faHeart } = await import('@fortawesome/free-regular-svg-icons/faHeart')
  
  library.add(
    faTwitter,
    faBluesky,
    faAddressCard,
    faRetweet,
    faHeart,
    faClock
  )
  
  // Re-scan DOM for newly loaded icons
  dom.i2svg()
}

// Lazy load AnchorJS only if there are headings to anchor
const loadAnchorJS = async () => {
  if (document.querySelectorAll('h2, h3, h4, h5, h6').length > 0) {
    const AnchorJS = await import('anchor-js')
    const anchors = new AnchorJS.default()
    anchors.add()
  }
}

// Lazy load Tooltip only if tooltips are present
const loadTooltips = async () => {
  const els = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  if (els.length > 0) {
    const { Tooltip } = await import('bootstrap')
    window.Tooltip = Tooltip
    Array.from(els).forEach((el) => {
      new Tooltip(el) // eslint-disable-line no-new
    })
  }
}

// Lazy load 404 suggestion logic only on 404 page
const load404Suggestion = async () => {
  const div = document.getElementById('four-oh-four-suggestion')
  if (div != null) {
    const { closest } = await import('fastest-levenshtein')
    const xhr = new XMLHttpRequest()

    xhr.onload = () => {
      if (xhr.status === 200) {
        const xml = xhr.responseXML
        const urls = Array.from(xml.querySelectorAll('urlset > url > loc')).map((el) => el.textContent)
        const url = new URL(closest(window.location.href, urls))
        div.innerHTML = `<a href="${url.href}">${url.pathname}</a>`
      } else {
        div.innerHTML = '<a href="/">/</a>'
      }
    }

    xhr.open('GET', `${window.location.protocol}//${window.location.host}/sitemap.xml`)
    xhr.send()
  }
}

// Initial DOM scan for critical icons
dom.i2svg()

// Load non-critical features after initial page load
document.addEventListener('turbo:load', () => {
  // Use requestIdleCallback for better performance or setTimeout as fallback
  // requestIdleCallback is supported in Chrome, Edge, and Safari
  const scheduleNonCritical = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback)
    } else {
      // Use 0ms delay to schedule on next tick
      setTimeout(callback, 0)
    }
  }

  scheduleNonCritical(() => {
    loadNonCriticalIcons()
    loadAnchorJS()
    loadTooltips()
    load404Suggestion()
  })
})
