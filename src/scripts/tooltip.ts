/**
 * Site-wide custom tooltip runtime (no Bootstrap dependency)
 *
 * Drives any element carrying `data-tooltip="true"` + `data-tooltip-text`.
 * Used by the TL;DR component (`Tldr.astro`) and by acronyms auto-wrapped in
 * content by the `rehype-acronyms` plugin. Loaded once site-wide from
 * `BaseLayout.astro` so tooltips work on every page, not just ones with a TL;DR.
 *
 * Shows on hover (desktop), toggles on tap/click and Enter/Space, closes on
 * Escape, click-outside, or scroll. Positions to the right, falling back to the
 * left or below when it would overflow the viewport.
 */

// Track if global handlers have been added (for cleanup in SPAs)
let globalClickHandlerAdded = false;
let globalScrollHandlerAdded = false;

// Global click handler for click-outside functionality (defined outside DOMContentLoaded for cleanup)
const handleGlobalClick = (e: MouseEvent) => {
  const activeTooltips = window.__tldrActiveTooltips;
  if (!activeTooltips || activeTooltips.size === 0) return;

  const target = e.target;
  if (!target) return;

  activeTooltips.forEach((_tooltipEl: HTMLDivElement, element: HTMLElement) => {
    if (!element.contains(target as Node)) {
      hideTooltip(element);
    }
  });
};

// Global scroll handler to hide tooltips when scrolling
const handleGlobalScroll = () => {
  const activeTooltips = window.__tldrActiveTooltips;
  if (!activeTooltips || activeTooltips.size === 0) return;

  activeTooltips.forEach((_tooltipEl: HTMLDivElement, element: HTMLElement) => {
    hideTooltip(element);
  });
};

// Function to show tooltip
const showTooltip = (target: HTMLElement) => {
  const activeTooltips = window.__tldrActiveTooltips;
  if (!activeTooltips) return;

  // Re-entering the trigger cancels any in-flight grace-period hide.
  cancelScheduledHide(target);

  // If tooltip already exists for this element, don't create another
  if (activeTooltips.has(target)) return;

  const tooltipText = target.getAttribute('data-tooltip-text');

  if (!tooltipText) return;

  // Create tooltip element
  const tooltipEl = document.createElement('div');
  tooltipEl.className = 'custom-tooltip';
  tooltipEl.textContent = tooltipText;
  tooltipEl.id = `tooltip-${Math.random().toString(36).substring(2, 11)}`;
  tooltipEl.setAttribute('role', 'tooltip');

  // Keep the tooltip open while the pointer is over it; re-arm the hide on exit.
  tooltipEl.addEventListener('mouseenter', () => cancelScheduledHide(target));
  tooltipEl.addEventListener('mouseleave', () => scheduleHide(target));

  // Read target geometry BEFORE any DOM mutation to avoid forced reflow
  const rect = target.getBoundingClientRect();

  // Append hidden to measure tooltip dimensions without triggering visible reflow
  tooltipEl.style.visibility = 'hidden';
  document.body.appendChild(tooltipEl);
  const tooltipRect = tooltipEl.getBoundingClientRect();

  // Associate the description with the trigger while the tooltip is shown
  // (WAI-ARIA tooltip pattern — no aria-expanded; this isn't a disclosure).
  target.setAttribute('aria-describedby', tooltipEl.id);

  // Track this tooltip
  activeTooltips.set(target, tooltipEl);

  // Position tooltip with viewport boundary checks (no further layout reads needed)
  let left = rect.right + 10;
  let top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);

  // Check if tooltip would overflow right edge of viewport
  if (left + tooltipRect.width > window.innerWidth) {
    // Try positioning to the left instead
    const leftPosition = rect.left - tooltipRect.width - 10;

    if (leftPosition >= 10) {
      left = leftPosition;
      tooltipEl.classList.add('left');
    } else {
      // Not enough horizontal space on either side:
      // fall back to centering the tooltip below the target
      tooltipEl.classList.add('below');

      left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
      left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));

      top = rect.bottom + 10;
    }
  }

  // Clamp top so tooltip doesn't overflow top or bottom
  top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));

  tooltipEl.style.left = `${left}px`;
  tooltipEl.style.top = `${top}px`;
  tooltipEl.style.visibility = '';

  // Fade in on next frame
  requestAnimationFrame(() => {
    tooltipEl.classList.add('show');
  });
};

// Function to hide tooltip
const hideTooltip = (target: HTMLElement) => {
  const activeTooltips = window.__tldrActiveTooltips;
  if (!activeTooltips) return;
  cancelScheduledHide(target);
  const tooltipEl = activeTooltips.get(target);
  if (!tooltipEl) return;

  // Clear the description association
  target.removeAttribute('aria-describedby');

  // Remove from active list immediately to prevent duplicate hide calls
  activeTooltips.delete(target);

  tooltipEl.classList.remove('show');

  // Track if cleanup has been executed
  let cleanupExecuted = false;

  // Cleanup function
  const cleanup = () => {
    if (cleanupExecuted) return;
    cleanupExecuted = true;

    tooltipEl.remove();
  };

  // Use transitionend event for proper cleanup timing
  const handleTransitionEnd = () => {
    cleanup();
  };

  tooltipEl.addEventListener('transitionend', handleTransitionEnd, { once: true });

  // Fallback timeout in case transitionend doesn't fire
  // Timeout is longer than CSS transition (0.2s) to ensure transition completes
  setTimeout(() => {
    tooltipEl.removeEventListener('transitionend', handleTransitionEnd);
    cleanup();
  }, 300);
};

// Grace-period hide, so the pointer can travel from the trigger onto the bubble
// (WCAG 1.4.13, "hoverable") without it vanishing mid-journey. Hovering the
// bubble cancels the pending hide; leaving it re-arms one.
const pendingHides = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

const cancelScheduledHide = (target: HTMLElement) => {
  const timer = pendingHides.get(target);
  if (timer !== undefined) {
    clearTimeout(timer);
    pendingHides.delete(target);
  }
};

const scheduleHide = (target: HTMLElement) => {
  cancelScheduledHide(target);
  pendingHides.set(target, setTimeout(() => {
    pendingHides.delete(target);
    hideTooltip(target);
  }, 150));
};

// Initialize tooltips function (called on page load and after navigation)
const initializeTooltips = () => {
  const tooltipElements = document.querySelectorAll('[data-tooltip="true"]:not([data-tooltip-initialized])');

  // Initialize global activeTooltips map
  if (!window.__tldrActiveTooltips) {
    window.__tldrActiveTooltips = new Map<HTMLElement, HTMLDivElement>();
  }

  tooltipElements.forEach((element) => {
    // Mark as initialized
    element.setAttribute('data-tooltip-initialized', 'true');

    // Only add hover/focus listeners on devices with hover capability (desktop).
    // On touch (hover: none) we rely on the click toggle below, so a tap that
    // also fires focus can't show-then-hide the tooltip.
    if (window.matchMedia('(hover: hover)').matches) {
      // Show tooltip on mouseenter (for desktop)
      element.addEventListener('mouseenter', (e) => {
        const target = e.currentTarget as HTMLElement;
        showTooltip(target);
      });

      // Hide on mouseleave — but with a grace period so the pointer can reach
      // the bubble (which cancels the hide via its own mouseenter).
      element.addEventListener('mouseleave', () => {
        scheduleHide(element as HTMLElement);
      });

      // Show on keyboard focus, hide on blur — parity with hover so keyboard
      // users get the definition by tabbing, not only by activating it.
      element.addEventListener('focus', (e) => {
        showTooltip(e.currentTarget as HTMLElement);
      });

      element.addEventListener('blur', () => {
        hideTooltip(element as HTMLElement);
      });
    }

    // Toggle tooltip on click/tap (for mobile and accessibility)
    element.addEventListener('click', (e) => {
      // Stop propagation to prevent global click handler from firing
      e.stopPropagation();

      const target = e.currentTarget as HTMLElement;
      const activeTooltips = window.__tldrActiveTooltips;
      if (!activeTooltips) return;

      // Always toggle: if visible, hide it; if hidden, show it
      if (activeTooltips.has(target)) {
        hideTooltip(target);
      } else {
        showTooltip(target);
      }
    });

    // Add keyboard support (Enter, Space to toggle, Escape to close)
    element.addEventListener('keydown', (e) => {
      const keyEvent = e as KeyboardEvent;
      const target = e.currentTarget as HTMLElement;
      const activeTooltips = window.__tldrActiveTooltips;
      if (!activeTooltips) return;

      if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
        keyEvent.preventDefault();
        if (activeTooltips.has(target)) {
          hideTooltip(target);
        } else {
          showTooltip(target);
        }
      } else if (keyEvent.key === 'Escape' && activeTooltips.has(target)) {
        hideTooltip(target);
      }
    });
  });

  // Add single global click handler for click-outside functionality
  // This prevents memory leaks by using one handler for all tooltips
  if (tooltipElements.length > 0 && !globalClickHandlerAdded) {
    document.addEventListener('click', handleGlobalClick);
    globalClickHandlerAdded = true;
  }

  // Add single global scroll handler to hide tooltips when scrolling
  // Use passive: true for better scroll performance
  if (tooltipElements.length > 0 && !globalScrollHandlerAdded) {
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });
    globalScrollHandlerAdded = true;
  }
};

// Initialize on DOMContentLoaded (or immediately if already loaded).
// Without ClientRouter every navigation is a full page load, so there's no
// need for astro:after-swap / astro:page-load listeners.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTooltips);
} else {
  initializeTooltips();
}
