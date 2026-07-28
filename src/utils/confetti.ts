/**
 * Lightweight canvas-free / DOM particle confetti burst utility
 * Creates micro particle explosions for satisfying visual feedback on user actions.
 */

export function triggerConfetti(x?: number, y?: number) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const originX = x ?? window.innerWidth / 2;
  const originY = y ?? window.innerHeight / 3;

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];
  const particleCount = 28;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.floor(Math.random() * 8) + 6;

    particle.style.position = 'fixed';
    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '99999';
    particle.style.opacity = '1';
    particle.style.transition = 'all 800ms cubic-bezier(0.25, 1, 0.5, 1)';

    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 120 + 40;
    const destX = originX + Math.cos(angle) * velocity;
    const destY = originY + Math.sin(angle) * velocity - 20;

    requestAnimationFrame(() => {
      particle.style.transform = `translate(${destX - originX}px, ${destY - originY}px) rotate(${Math.random() * 360}deg) scale(0)`;
      particle.style.opacity = '0';
    });

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 850);
  }
}
