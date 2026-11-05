/**
 * CRISPY CRAVE - Advanced Interactive Animations & Motion Styles
 * Companion script for animations.css
 */
document.addEventListener('DOMContentLoaded', () => {
  // Respect user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Additional dynamic animation triggers if needed
});
