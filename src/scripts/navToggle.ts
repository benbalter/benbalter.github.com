/**
 * Minimal Navigation Toggle Script
 * 
 * Replaces Bootstrap JS collapse functionality with a lightweight implementation.
 * Handles mobile navbar toggle with proper ARIA attributes for accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.querySelector('.navbar-toggler');
  const target = document.getElementById('navbar');

  if (!toggler || !target) {
    return;
  }

  toggler.addEventListener('click', () => {
    const isExpanded = toggler.getAttribute('aria-expanded') === 'true';
    
    // Toggle ARIA attributes
    toggler.setAttribute('aria-expanded', String(!isExpanded));
    
    // Toggle collapse class
    if (isExpanded) {
      target.classList.remove('show');
      target.classList.add('collapse');
    } else {
      target.classList.remove('collapse');
      target.classList.add('show');
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!event.target) return;
    
    const isClickInside = toggler.contains(event.target as Node) || 
                          target.contains(event.target as Node);
    
    if (!isClickInside && target.classList.contains('show')) {
      toggler.setAttribute('aria-expanded', 'false');
      target.classList.remove('show');
      target.classList.add('collapse');
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && target.classList.contains('show')) {
      toggler.setAttribute('aria-expanded', 'false');
      target.classList.remove('show');
      target.classList.add('collapse');
    }
  });
});
