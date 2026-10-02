import confetti from "canvas-confetti";

// Brand reds/pinks (the primary button gradient) plus two soft neutrals.
const COLORS = ["#fb4042", "#ec228a", "#ec2224", "#ff8fa3", "#ffe9ea", "#d9e5ea", "#404141"];

const PARTICLE_COUNT = 140;

/**
 * One celebratory burst from the centre of `element`, using the common
 * canvas-confetti "fireworks" layering: a fast narrow core, then wider, slower,
 * larger pieces. Skipped automatically when the user prefers reduced motion.
 */
export function burstConfettiFrom(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const origin = {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };

  const shoot = (ratio: number, options: confetti.Options) =>
    confetti({
      origin,
      colors: COLORS,
      shapes: ["square", "circle"],
      angle: 90,
      gravity: 0.9,
      ticks: 220,
      zIndex: 60, // above page content, below nothing interactive (canvas ignores pointer events)
      disableForReducedMotion: true,
      ...options,
      particleCount: Math.floor(PARTICLE_COUNT * ratio),
    });

  shoot(0.25, { spread: 26, startVelocity: 48 });
  shoot(0.2, { spread: 60, startVelocity: 40 });
  shoot(0.35, { spread: 100, startVelocity: 32, decay: 0.91, scalar: 0.8 });
  shoot(0.1, { spread: 120, startVelocity: 22, decay: 0.92, scalar: 1.2 });
  shoot(0.1, { spread: 120, startVelocity: 40 });
}

/** Stop and clear any confetti still in flight (e.g. when leaving the page). */
export function clearConfetti() {
  confetti.reset();
}
