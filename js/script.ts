import { config, library, dom } from '@fortawesome/fontawesome-svg-core'
import { faRss } from '@fortawesome/free-solid-svg-icons/faRss'
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet'
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons/faAddressCard'
import { faBluesky } from '@fortawesome/free-brands-svg-icons/faBluesky'
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { closest } from 'fastest-levenshtein'

import { Collapse, Tooltip } from 'bootstrap'

import * as AnchorJS from 'anchor-js'

window.Collapse = Collapse
window.Tooltip = Tooltip
const anchors = new AnchorJS()

// Guard flag to prevent double initialization
let initialized = false

// Track if global click handler has been added
let globalClickHandlerAdded = false

// Extend Window interface for custom tooltip state
declare global {
  interface Window {
    __tldrActiveTooltips?: Map<HTMLElement, HTMLDivElement>
  }
}

// Global activeTooltips map (for custom tooltips)
if (!window.__tldrActiveTooltips) {
  window.__tldrActiveTooltips = new Map<HTMLElement, HTMLDivElement>()
}

/**
 * Shows a custom tooltip for the given target element.
 * Creates a tooltip element, positions it relative to the target,
 * and manages ARIA attributes for accessibility.
 * 
 * @param target - The HTML element that should display the tooltip
 */
function showTooltip(target: HTMLElement) {
  const activeTooltips = window.__tldrActiveTooltips

  if (!activeTooltips) return

  // If tooltip already exists for this element, don't create another
  if (activeTooltips.has(target)) return

  const tooltipText = target.getAttribute('data-tooltip-text')

  if (!tooltipText) return

  // Create tooltip element
  const tooltipEl = document.createElement('div')
  tooltipEl.className = 'custom-tooltip'
  tooltipEl.textContent = tooltipText
  tooltipEl.id = `tooltip-${Math.random().toString(36).substring(2, 11)}`
  tooltipEl.setAttribute('role', 'tooltip')
  document.body.appendChild(tooltipEl)

  // Set ARIA attributes
  target.setAttribute('aria-describedby', tooltipEl.id)
  target.setAttribute('aria-expanded', 'true')

  // Track this tooltip
  activeTooltips.set(target, tooltipEl)

  // Position tooltip with viewport boundary checks
  requestAnimationFrame(() => {
    const rect = target.getBoundingClientRect()
    const tooltipRect = tooltipEl.getBoundingClientRect()

    // Default: position to the right
    let left = rect.right + 10
    let top = rect.top + (rect.height / 2) - (tooltipRect.height / 2)

    // Check if tooltip would overflow right edge of viewport
    if (left + tooltipRect.width > window.innerWidth) {
      // Position to the left instead
      left = rect.left - tooltipRect.width - 10
      tooltipEl.classList.add('left')
    } else {
      tooltipEl.classList.remove('left')
    }

    // Clamp top so tooltip doesn't overflow top or bottom
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10))

    tooltipEl.style.left = `${left}px`
    tooltipEl.style.top = `${top}px`

    // Fade in using requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      tooltipEl.classList.add('show')
    })
  })
}

/**
 * Hides and removes the custom tooltip for the given target element.
 * Cleans up ARIA attributes and removes the tooltip from the DOM
 * after transition completes.
 * 
 * @param target - The HTML element whose tooltip should be hidden
 */
function hideTooltip(target: HTMLElement) {
  const activeTooltips = window.__tldrActiveTooltips
  if (!activeTooltips) return

  const tooltipEl = activeTooltips.get(target)
  if (!tooltipEl) return

  // Clear ARIA attributes
  target.removeAttribute('aria-describedby')
  target.setAttribute('aria-expanded', 'false')

  // Remove from active list immediately to prevent duplicate hide calls
  activeTooltips.delete(target)

  tooltipEl.classList.remove('show')

  // Track if cleanup has been executed
  let cleanupExecuted = false

  // Cleanup function
  const cleanup = () => {
    if (cleanupExecuted) return
    cleanupExecuted = true

    tooltipEl.remove()
  }

  // Use transitionend event for proper cleanup timing
  const handleTransitionEnd = () => {
    cleanup()
  }

  tooltipEl.addEventListener('transitionend', handleTransitionEnd, { once: true })

  // Fallback timeout in case transitionend doesn't fire
  // Timeout is longer than CSS transition (0.2s) to ensure transition completes
  setTimeout(() => {
    tooltipEl.removeEventListener('transitionend', handleTransitionEnd)
    cleanup()
  }, 300)
}

// Global click handler for click-outside functionality
const handleGlobalClick = (e: MouseEvent) => {
  const target = e.target

  if (!target) return

  const activeTooltips = window.__tldrActiveTooltips
  if (!activeTooltips) return

  activeTooltips.forEach((_tooltipEl: HTMLDivElement, element: HTMLElement) => {
    if (!element.contains(target as Node)) {
      hideTooltip(element)
    }
  })
}

/**
 * Initializes custom tooltip functionality for all elements with data-tooltip="true".
 * Sets up event handlers for hover (desktop), click/tap (mobile), and keyboard
 * interactions. Uses hover media query to detect device capabilities.
 * Implements click-outside-to-close behavior with a single global handler.
 */
function initializeCustomTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip="true"]:not([data-tooltip-initialized])')

  tooltipElements.forEach((element) => {
    // Mark as initialized
    element.setAttribute('data-tooltip-initialized', 'true')

    // Only add hover listeners on devices with hover capability
    if (window.matchMedia('(hover: hover)').matches) {
      // Show tooltip on mouseenter (for desktop)
      element.addEventListener('mouseenter', (e) => {
        const target = e.currentTarget as HTMLElement
        showTooltip(target)
      })

      // Hide tooltip on mouseleave (for desktop)
      element.addEventListener('mouseleave', () => {
        hideTooltip(element as HTMLElement)
      })
    }

    // Toggle tooltip on click/tap (for mobile and accessibility)
    element.addEventListener('click', (e) => {
      // Stop propagation to prevent global click handler from firing
      e.stopPropagation()

      const target = e.currentTarget as HTMLElement
      const activeTooltips = window.__tldrActiveTooltips

      if (!activeTooltips) return

      // Always toggle: if visible, hide it; if hidden, show it
      if (activeTooltips.has(target)) {
        hideTooltip(target)
      } else {
        showTooltip(target)
      }
    })

    // Add keyboard support (Enter, Space to toggle, Escape to close)
    element.addEventListener('keydown', (e) => {
      const keyEvent = e as KeyboardEvent
      const target = e.currentTarget as HTMLElement
      const activeTooltips = window.__tldrActiveTooltips

      if (!activeTooltips) return

      if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
        keyEvent.preventDefault()
        if (activeTooltips.has(target)) {
          hideTooltip(target)
        } else {
          showTooltip(target)
        }
      } else if (keyEvent.key === 'Escape' && activeTooltips.has(target)) {
        hideTooltip(target)
      }
    })
  })

  // Add single global click handler for click-outside functionality
  // This prevents memory leaks by using one handler for all tooltips
  if (tooltipElements.length > 0 && !globalClickHandlerAdded) {
    document.addEventListener('click', handleGlobalClick)
    globalClickHandlerAdded = true
  }
}

// Initialize page functionality (for both Astro and Jekyll)
function initializePage() {
  if (initialized) return
  initialized = true

  anchors.add()

  // Initialize Bootstrap tooltips (for legacy elements that still use data-bs-toggle)
  const els = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  Array.from(els).forEach((el) => {
    new Tooltip(el) // eslint-disable-line no-new
  })

  // Initialize custom tooltips (for TLDR and other custom tooltip elements)
  initializeCustomTooltips()

  const div = document.getElementById('four-oh-four-suggestion')
  if (div != null) {
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

// For Astro: Listen for Astro's page load event
document.addEventListener('astro:page-load', initializePage)

// For Jekyll: Listen for standard DOMContentLoaded event
document.addEventListener('DOMContentLoaded', initializePage)

config.mutateApproach = 'sync'
library.add(
  faRss,
  faTwitter,
  faLinkedin,
  faGithub,
  faEnvelope,
  faAddressCard,
  faRetweet,
  faHeart,
  faClock,
  faBluesky
)
dom.watch()
