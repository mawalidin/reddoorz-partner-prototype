# 008 — Guard CTA buttons from keyboard focus while still entrance-animating

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 2 files (`src/components/Header.tsx`, `src/sections/HeroSection.tsx`), 1 new small hook or inline effect

## Problem

`opacity: 0` and a `translate` offset do not remove an element from the accessibility tree or tab order — only `display: none`, `visibility: hidden`, or the `inert` attribute do that. The desktop header CTAs and the hero CTA row are real, focusable `<button>` elements from the very first paint:

```tsx
// src/components/Header.tsx:59-60 — current
<Button variant="outline" size="sm">Start Free Consultation</Button>
<Button variant="primary" size="sm">Become A Partner</Button>
```

```tsx
// src/sections/HeroSection.tsx:20-33 — current (CTA row, entrance-animating div from plan 007's scope)
<div className="flex w-full flex-row flex-wrap items-center justify-center gap-4 transition-[translate,opacity] duration-[1300ms] delay-[300ms] ease-in starting:translate-y-[20%] starting:opacity-0 lg:gap-6">
  <Button variant="outline" className="...">Start Free Consultation</Button>
  <Button variant="primary" className="...">Become A Partner</Button>
</div>
```

A keyboard user who presses Tab within roughly the first 1.3–1.6 seconds after page load (the hero CTA row's `delay-[300ms]` + `duration-[1300ms]` window) can move focus onto a button that is still invisible or mid-slide. The button is technically operable (Enter/Space still works), but the focus ring lands on nothing visible — disorienting, even though narrow and self-resolving. Screen-reader-only users aren't affected (they don't rely on visual position), and `prefers-reduced-motion` users are incidentally protected since the sitewide rule (`src/index.css:125-134`) collapses the window to near-zero for them.

## Target

Make each entrance-animating CTA container `inert` until its own transition finishes, using the browser's native `transitionend` event — no animation library, no extra state beyond a single `ref` + one-time listener per container.

```tsx
/* target pattern — apply to the Header.tsx:59-60 CTA wrapper and the HeroSection.tsx:20 CTA row */
function useInertUntilSettled<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnd = (e: TransitionEvent) => {
      if (e.target === el) setSettled(true);
    };
    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, []);

  return { ref, inert: !settled };
}
```

```tsx
/* target — HeroSection.tsx:20, using the hook above */
const { ref: ctaRef, inert: ctaInert } = useInertUntilSettled<HTMLDivElement>();
// ...
<div
  ref={ctaRef}
  inert={ctaInert || undefined}
  className="flex w-full flex-row flex-wrap items-center justify-center gap-4 transition-[translate,opacity] duration-[1300ms] delay-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] starting:translate-y-[20%] starting:opacity-0 lg:gap-6"
>
```

Apply the same pattern to a wrapping element around the two desktop CTA `Button`s in `Header.tsx` (they currently sit inside the already-entrance-animating content div at `Header.tsx:32` — wrap just the `<div className="hidden items-center gap-3 lg:flex">` at `Header.tsx:50` with the same hook, since that's the CTA-containing wrapper, not the whole header content div which also holds the logo/nav that don't need this guard).

## Repo conventions to follow

- React 19 (this repo uses `^19.2.8`) supports the native `inert` boolean prop directly — same pattern already used in plan `001` (`plans/001-mobile-nav-panel-reveal.md`) for the mobile nav panel's closed state.
- This repo has no existing custom-hooks directory (`src/hooks/` doesn't exist yet). Keep the hook function local to whichever file needs it first (colocate in `HeroSection.tsx` since it needs it, and duplicate the same ~12-line hook in `Header.tsx`, OR create `src/hooks/useInertUntilSettled.ts` and import it in both — prefer the shared-file approach since this is the second consumer, matching the "reuse, don't duplicate" project convention).

## Steps

1. Create `src/hooks/useInertUntilSettled.ts` exporting the hook shown in Target (adjust the generic/typing as needed for strict TS).
2. In `src/sections/HeroSection.tsx`, import the hook, call it once for the CTA row, and apply `ref`/`inert` to the `<div>` at line 20 as shown in Target.
3. In `src/components/Header.tsx`, import the same hook, call it once for the desktop CTA wrapper, and apply `ref`/`inert` to the `<div className="hidden items-center gap-3 lg:flex">` at line 50 (this div also contains the language `<button>` — confirm with the user/via a quick visual check whether guarding the language button too is acceptable, since it's not a CTA but shares the wrapper; if it must be excluded, wrap only the two `<Button>` elements in a new inner `<div>` instead and guard that).

## Boundaries

- Do NOT apply this guard to the mobile CTA buttons inside `{menuOpen && (...)}` (`Header.tsx:107-114`) — those only render when the menu is explicitly opened by a click, well after the page-load entrance window; not affected by this issue.
- Do NOT change the entrance animation's duration, delay, or easing — this plan only affects focus/tab-order timing, not visual timing.
- Do NOT add a new npm dependency — `transitionend` is a native DOM event, no library needed.
- If `HeroSection.tsx:20` or `Header.tsx:50/59-60` don't match the excerpts above when opened (drift since commit `7b5477f`, e.g. if plan `007` already changed the easing token on line 20), adapt only the easing token in your read of the "current" excerpt and proceed — that's an expected, compatible drift. If the structural JSX (element nesting, which div wraps what) has changed instead, STOP and report.

## Verification

- **Mechanical**: `npm run build` and `npm run lint` — both should pass clean.
- **Feel check**: run `npm run dev`, hard-reload, and immediately (within ~1 second) press Tab repeatedly:
  - Focus should skip the header's desktop CTA buttons and the hero CTA buttons until their entrance transition has visually finished.
  - Once each button has visually settled, Tab should reach it normally and the focus ring should appear correctly.
  - Confirm via DevTools' Elements panel that the `inert` attribute is present on the wrapping element immediately after load and is removed once the transition completes (watch it in real time, or check post-load that it's gone).
  - Confirm screen-reader behavior is unaffected (this only touches focus/AT-exposure timing during the animation window, not final state).
- **Done when**: rapid-Tab immediately after page load never lands focus on a still-animating CTA button, and both buttons are reachable normally once settled.
