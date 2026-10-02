# 016 — Auto-hiding scroll indicator for the swipe rows (optional, additive)

- **Status**: DONE
- **Commit**: f6cc0b7 (working tree also contains the uncommitted full-bleed carousel change)
- **Severity**: LOW
- **Category**: Missed opportunities (state indication)
- **Estimated scope**: 1 new component (~50 lines) + 4 one-line uses; no new dependencies

## Problem

After plan 014 hides the native scrollbars, mouse users on a desktop browser at tablet widths lose the only explicit cue that a row scrolls (touch users still get the peeking next card). A native scrollbar is permanent chrome; the better pattern is the one macOS/iOS use: a thin indicator that appears **only while scrolling** and fades out shortly after.

Rows (current, after plan 014): `src/sections/HowItWorksIntro.tsx:45`, `src/sections/PartnerStoriesSection.tsx:163`, `src/sections/BrandSection.tsx:73`, `src/sections/AwardsSection.tsx:24`.

Frequency: rare (a few swipes per visit) → delight/state-indication budget applies. Purpose: **state indication** (position within the row).

## Target

A 3px track under the row (same horizontal inset as the content), a thumb whose width is `clientWidth / scrollWidth` of the row and whose position follows `scrollLeft`.

- Hidden at rest: `opacity: 0`.
- On scroll: opacity to `1` in `120ms` with `cubic-bezier(0.23, 1, 0.32, 1)`.
- 800ms after the last scroll event: opacity to `0` in `300ms` with `cubic-bezier(0.23, 1, 0.32, 1)`.
- Thumb moves with `transform: translateX(...)` only (never `left`); width set once on resize.
- Colours: track `var(--color-border-opaque)` (#d9e5ea), thumb `var(--color-content-primary)` (#1b1c1f) — the same pair as the sticky-menu progress bar in `src/sections/solutions/SolutionsList.tsx:111-116`.
- `aria-hidden="true"`; pointer-events none. Not shown when the row doesn't overflow.
- Reduced motion: keep the opacity fade, drop nothing else (there is no movement beyond the thumb tracking the user's own scroll).

```tsx
// src/components/ScrollIndicator.tsx — new
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

const FADE_OUT_DELAY_MS = 800;

export default function ScrollIndicator({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const row = targetRef.current;
    const thumb = thumbRef.current;
    if (!row || !thumb) return;
    let timer: number | undefined;

    const measure = () => {
      const ratio = row.clientWidth / row.scrollWidth;
      setOverflowing(ratio < 1);
      thumb.style.width = `${Math.max(ratio, 0.1) * 100}%`;
    };
    const onScroll = () => {
      const max = row.scrollWidth - row.clientWidth;
      const progress = max > 0 ? row.scrollLeft / max : 0;
      const room = row.clientWidth - thumb.offsetWidth;
      thumb.style.transform = `translateX(${progress * room}px)`;
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
      aria-hidden="true"
      className={`pointer-events-none mt-2 h-[3px] overflow-hidden rounded-full bg-border-opaque lg:hidden ${overflowing ? "" : "hidden"} ${
        visible ? "opacity-100 duration-[120ms]" : "opacity-0 duration-300"
      } transition-opacity ease-[cubic-bezier(0.23,1,0.32,1)]`}
    >
      <div ref={thumbRef} className="h-full rounded-full bg-content-primary" />
    </div>
  );
}
```

## Repo conventions to follow

- Easing: the repo hand-types `cubic-bezier(0.23, 1, 0.32, 1)` everywhere (e.g. `src/sections/HeroSection.tsx:41`); plan 011 proposes a shared token — if 011 has landed, use `ease-out`/the token instead.
- Exemplar progress bar styling: `src/sections/solutions/SolutionsList.tsx:111-116`.
- Refs/effects style: see `src/components/Modal.tsx` for the ref + cleanup pattern.

## Steps

1. Create `src/components/ScrollIndicator.tsx` with the code above.
2. In each of the four section files, give the row element a `ref` (e.g. `const rowRef = useRef<HTMLDivElement>(null)`), put `ref={rowRef}` on the row `<div>` and render `<ScrollIndicator targetRef={rowRef} />` immediately after it (inside the same `Container`). For the three rows that turn into a grid at `lg`, the indicator already hides itself with `lg:hidden`.
3. Nothing else changes.

## Boundaries

- Do NOT add dependencies and do NOT replace native scrolling with a JS scroller.
- Do NOT show the indicator on the Embla carousels.
- If any step doesn't match the code you find, STOP and report.

## Verification

- **Mechanical**: `npx tsc -b` and `npm run build` pass.
- **Feel check**:
  - Scroll a row: the thin bar fades in immediately (about 120ms), the thumb tracks 1:1 with no lag, and it fades out about 0.8s after you stop.
  - Spamming scroll never makes it flicker or restart (it only extends the 800ms timer).
  - DevTools Animations panel at 10%: only `opacity` animates; the thumb uses `transform`.
  - `prefers-reduced-motion`: the fade still happens (global rule shortens it) and the thumb still tracks scroll.
  - Rows that don't overflow (e.g. desktop grids) show nothing.
- **Done when**: the indicator is invisible at rest, appears only while scrolling, and no layout shift occurs when it appears.
