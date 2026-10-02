import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import iconSelector from "../assets/transformation/icon-selector.svg";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  alt: string;
  initialPosition?: number;
  className?: string;
};

const STEP = 5;
const HANDLE_HALF_WIDTH = 28; // handle hit area is w-14
const MAX_SPEED = 3500; // px/s at which the speed-driven effects are fully on
const COAST_SECONDS = 0.12; // how far ahead of the release the divider aims, at release speed
const TEASE_OFFSET = 10; // % the handle nudges once to hint it can be dragged

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export default function BeforeAfterSlider({
  before,
  after,
  alt,
  initialPosition = 35,
  className = "",
}: BeforeAfterSliderProps) {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const interactedRef = useRef(false);
  const playbackRef = useRef<ReturnType<typeof animate> | null>(null);
  const [dragging, setDragging] = useState(false);

  // Position lives in a motion value (percent, may briefly overshoot 0–100 while
  // coasting), so dragging updates the DOM directly with no React re-renders.
  const x = useMotionValue(initialPosition);
  const width = useMotionValue(0);

  const clip = useTransform(x, (v) => `inset(0 0 0 ${clamp(v)}%)`);
  const handleX = useTransform([x, width], ([p, w]: number[]) => (p / 100) * w - HANDLE_HALF_WIDTH);

  // Speed in px/s, derived from how fast the position is changing.
  const velocity = useVelocity(x); // percent per second
  const signedSpeed = useTransform([velocity, width], ([v, w]: number[]) => (v / 100) * w);
  const speed = useTransform(signedSpeed, (v) => Math.abs(v));

  // Follow-through: these springs chase the live speed, so they ease in while
  // dragging and relax back after the pointer slows or stops.
  const stretch = useSpring(useTransform(speed, [0, MAX_SPEED], [1, 1.15], { clamp: true }), {
    stiffness: 400,
    damping: 25,
    mass: 0.5,
  });
  const squash = useTransform(stretch, [1, 1.15], [1, 0.93]);
  const glow = useSpring(useTransform(speed, [0, MAX_SPEED], [0, 1], { clamp: true }), {
    stiffness: 120,
    damping: 20,
  });
  const glowOpacity = useTransform(glow, [0, 1], [0, 0.3]);
  const glowScale = useTransform(glow, [0, 1], [0.4, 1.6]);
  const arrowX = useSpring(useTransform(signedSpeed, [-MAX_SPEED, 0, MAX_SPEED], [-3, 0, 3], { clamp: true }), {
    stiffness: 300,
    damping: 22,
  });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => width.set(frame.offsetWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [width]);

  // Keep slider semantics current without re-rendering.
  useMotionValueEvent(x, "change", (value) => {
    const rounded = Math.round(clamp(value));
    handleRef.current?.setAttribute("aria-valuenow", String(rounded));
    handleRef.current?.setAttribute("aria-valuetext", `${rounded}% before`);
  });

  // One-time hint: nudge the handle when the slider first scrolls into view.
  useEffect(() => {
    if (reduced) return;
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || interactedRef.current) return;
        observer.disconnect();
        playbackRef.current = animate(x, [initialPosition, initialPosition + TEASE_OFFSET, initialPosition], {
          duration: 0.9,
          delay: 0.8, // let the section's own reveal finish first
          ease: [0.23, 1, 0.32, 1],
        });
      },
      { threshold: 0.6 },
    );
    observer.observe(frame);
    return () => {
      observer.disconnect();
      playbackRef.current?.stop();
    };
  }, [reduced, x, initialPosition]);

  const stopPlayback = () => {
    interactedRef.current = true;
    playbackRef.current?.stop();
    playbackRef.current = null;
  };

  const moveTo = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(clamp(((clientX - rect.left) / rect.width) * 100));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    stopPlayback();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture is best-effort; dragging still works while the pointer stays over the handle.
    }
    draggingRef.current = true;
    setDragging(true);
    moveTo(event.clientX);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) moveTo(event.clientX);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    const releaseVelocity = velocity.get();
    // Momentum: carry the release velocity into a spring aimed a short distance
    // ahead. Near the ends the underdamped spring overshoots slightly and settles
    // back (rubber-banding). A release after a pause has ~0 velocity: no coast.
    if (!reduced && Math.abs(releaseVelocity) > 20) {
      const current = x.get();
      const projected = clamp(current + releaseVelocity * COAST_SECONDS);
      if (Math.abs(projected - current) > 0.5) {
        playbackRef.current = animate(x, projected, {
          type: "spring",
          velocity: releaseVelocity,
          duration: 0.5,
          bounce: 0.2,
        });
      }
    }
  };

  const moveBy = (target: number) => {
    stopPlayback();
    if (reduced) x.set(target);
    else playbackRef.current = animate(x, target, { type: "spring", duration: 0.35, bounce: 0 });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") moveBy(clamp(x.get() - STEP));
    else if (event.key === "ArrowRight") moveBy(clamp(x.get() + STEP));
    else if (event.key === "Home") moveBy(0);
    else if (event.key === "End") moveBy(100);
    else return;
    event.preventDefault();
  };

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden select-none ${className}`}
      role="img"
      aria-label={alt}
    >
      <img src={before} alt="" draggable={false} className="absolute inset-0 size-full object-cover" />
      <span className="absolute top-3 left-3 rounded-full bg-[rgba(27,28,31,0.6)] px-3 py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-s)] leading-[normal] font-semibold text-white md:top-5 md:left-5 md:text-[length:var(--fontsize-label-m)]">
        Before
      </span>

      <motion.div className="absolute inset-0" style={{ clipPath: clip }} aria-hidden>
        <img src={after} alt="" draggable={false} className="absolute inset-0 size-full object-cover" />
        <span className="absolute top-3 right-3 rounded-full bg-background-primary px-[11px] py-2 font-['Rubik'] text-[length:var(--fontsize-label-s)] leading-[normal] font-semibold text-brand-grey md:top-5 md:right-5 md:text-[length:11.6px]">
          After
        </span>
      </motion.div>

      <motion.div
        ref={handleRef}
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(initialPosition)}
        aria-valuetext={`${Math.round(initialPosition)}% before`}
        data-compare-handle
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="group absolute inset-y-0 left-0 flex w-14 cursor-ew-resize touch-none items-center justify-center outline-none"
        style={{ x: handleX }}
      >
        {/* Speed-driven glow beside the divider; fades out shortly after you stop. */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{ opacity: reduced ? 0 : glowOpacity, scaleX: glowScale }}
        />
        <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-background-primary md:w-2" />
        <motion.span
          className="relative flex"
          style={{ scaleX: reduced ? 1 : stretch, scaleY: reduced ? 1 : squash }}
        >
          <span
            className={`relative flex items-center justify-center rounded-full bg-gradient-to-b from-[#fb4042] to-[#ec228a] p-2.5 transition-transform duration-200 ease-out group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#ec228a] md:p-[12.5px] ${dragging ? "scale-110" : "group-hover:scale-105"}`}
          >
            <motion.img
              src={iconSelector}
              alt=""
              className="size-4 md:size-5"
              style={{ x: reduced ? 0 : arrowX }}
            />
          </span>
        </motion.span>
      </motion.div>
    </div>
  );
}
