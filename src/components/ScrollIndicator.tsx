import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

const FADE_OUT_DELAY_MS = 800;

// Thin position indicator for a swipe row: hidden at rest, fades in while the row
// scrolls and out shortly after, like an overlay scrollbar (the native one is
// hidden with `.scrollbar-none`). Only `opacity` and `transform` animate.
export default function ScrollIndicator({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const row = targetRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!row || !track || !thumb) return;
    let timer: number | undefined;

    const place = () => {
      const max = row.scrollWidth - row.clientWidth;
      const progress = max > 0 ? row.scrollLeft / max : 0;
      thumb.style.transform = `translateX(${progress * (track.clientWidth - thumb.offsetWidth)}px)`;
    };
    const measure = () => {
      const ratio = row.clientWidth / row.scrollWidth;
      setOverflowing(ratio < 1);
      thumb.style.width = `${Math.max(ratio, 0.1) * 100}%`;
      place();
    };
    const onScroll = () => {
      place();
      setVisible(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setVisible(false), FADE_OUT_DELAY_MS);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      row.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [targetRef]);

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className={`pointer-events-none mt-2 h-[3px] overflow-hidden rounded-full bg-border-opaque transition-opacity ease-[cubic-bezier(0.23,1,0.32,1)] lg:hidden ${
        overflowing ? "" : "hidden"
      } ${visible ? "opacity-100 duration-[120ms]" : "opacity-0 duration-300"}`}
    >
      <div ref={thumbRef} className="h-full rounded-full bg-content-primary" />
    </div>
  );
}
