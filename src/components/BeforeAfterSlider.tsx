import { useCallback, useRef, useState } from "react";
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

export default function BeforeAfterSlider({
  before,
  after,
  alt,
  initialPosition = 35,
  className = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
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
    draggingRef.current = false;
    setDragging(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") setPosition((p) => Math.max(0, p - STEP));
    else if (event.key === "ArrowRight") setPosition((p) => Math.min(100, p + STEP));
    else if (event.key === "Home") setPosition(0);
    else if (event.key === "End") setPosition(100);
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

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        aria-hidden
      >
        <img src={after} alt="" draggable={false} className="absolute inset-0 size-full object-cover" />
        <span className="absolute top-3 right-3 rounded-full bg-background-primary px-[11px] py-2 font-['Rubik'] text-[length:var(--fontsize-label-s)] leading-[normal] font-semibold text-brand-grey md:top-5 md:right-5 md:text-[length:11.6px]">
          After
        </span>
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% before`}
        data-compare-handle
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="group absolute inset-y-0 flex w-14 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center outline-none"
        style={{ left: `${position}%` }}
      >
        <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-background-primary md:w-2" />
        <span
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-b from-[#fb4042] to-[#ec228a] p-2.5 transition-transform duration-200 ease-out group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#ec228a] md:p-[12.5px] ${dragging ? "scale-110" : "group-hover:scale-105"}`}
        >
          <img src={iconSelector} alt="" className="size-4 md:size-5" />
        </span>
      </div>
    </div>
  );
}
