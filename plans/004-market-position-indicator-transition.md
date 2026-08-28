# 004 — Animate the Market Position scale indicator's position

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: MEDIUM
- **Category**: Missed opportunities / Performance (documented trade-off — see below)
- **Estimated scope**: 1 file (`src/sections/CalculatorSection.tsx`), 1 element

## Problem

The Market Position indicator dot (in the "Below / Recommended / Above" ADR scale) is positioned with a JS-computed inline `left` percentage that's recalculated on every render via `useMemo`, but the DOM update has no transition — the dot teleports to its new spot the instant `rooms`, `rate`, or `hotelType` changes:

```tsx
// src/sections/CalculatorSection.tsx:206-213 — current
<div className="flex flex-col gap-2">
  <div className="relative h-8 rounded-full bg-background-alternative">
    <div className="absolute inset-y-1/2 left-2 right-2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#ec8422] via-[#beffe5] to-[#228aec]" />
    <div
      className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-brand-red bg-white/85 shadow-sm"
      style={{ left: `${summary.scalePosition}%` }}
    />
  </div>
```

The same recalculation already updates the "Evaluation" card and ADR text directly below this scale, so a visitor changing the room rate sees the number change but the visual indicator jump with no bridge between the two states.

## Target

```tsx
/* target */
<div
  className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-brand-red bg-white/85 shadow-sm transition-[left] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
  style={{ left: `${summary.scalePosition}%` }}
/>
```

## A note on why this transitions `left`, not `transform`

AUDIT.md's performance rule says to animate `transform`/`opacity` only, since `left` triggers layout. That rule is written for busy, frequently-updating UI (lists, drag handles, scroll-linked motion) where layout thrash actually costs frames. This is a single 24px dot inside one small, static-width track that updates on discrete form input, not continuously — the layout cost here is negligible in practice.

The reason this plan doesn't "fix" it into a `transform: translateX()` is a semantic one, not a laziness one: `summary.scalePosition` is a percentage of the **track's** width (that's what `left: X%` means), while `transform: translateX(X%)` is a percentage of the **dot's own** width — they are not interchangeable. Converting this to a pure-transform animation correctly would require measuring the track's rendered pixel width (a `ref` + `ResizeObserver` or `getBoundingClientRect`) and computing `translateX(Npx)` in JS — a meaningfully larger change for a decorative, rarely-updated widget. If a future pass wants that, it's a separate, bigger plan; this plan takes the honest, proportionate fix.

## Repo conventions to follow

- Same inline-cubic-bezier convention as plans `001`-`003`: `ease-[cubic-bezier(0.23,1,0.32,1)]`.
- 300ms sits at the top of the AUDIT.md "UI animations stay under 300ms" budget — appropriate here since this is a value/state indicator, not a button press (which would need to stay under 160ms).
- Tailwind's `transition-[left]` arbitrary-property syntax already appears in this codebase's conventions via the other plans in this series — keep it consistent rather than introducing a raw `<style>` block for one element.

## Steps

1. In `src/sections/CalculatorSection.tsx`, locate the indicator `<div>` at lines 209-212 (the one with `style={{ left: ... }}`).
2. Add `transition-[left] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]` to its existing `className` string, exactly as shown in Target — do not reorder or remove any existing classes.

## Boundaries

- Do NOT change the gradient track (`CalculatorSection.tsx:208`) or its sibling elements.
- Do NOT change how `summary.scalePosition` is computed (`CalculatorSection.tsx:37-47`) — this plan is presentation-only.
- Do NOT attempt the `transform`-based, JS-measured version described above — that's explicitly out of scope for this plan (see the note above).
- If lines 206-213 don't match this excerpt when opened (drift since commit `7b5477f`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run lint` and `npm run build` — both should pass clean.
- **Feel check**: run `npm run dev`, scroll to the calculator, ensure the form has been submitted so the summary is visible, then:
  - Change the "Room Rate per night" input — the red-bordered dot on the Market Position scale should visibly slide to its new position over ~300ms, not jump.
  - Switch Hotel Type (Basic/Plus/Premium) — same check; the dot should glide, not teleport, even though the underlying number recalculates immediately.
  - In DevTools' Animations panel, set playback to 10% and confirm the dot's horizontal movement is smooth across the full 300ms.
  - Toggle `prefers-reduced-motion` — the existing sitewide rule (`src/index.css:125-134`) already collapses this to near-instant; confirm the dot still ends up in the correct final position.
- **Done when**: every input change that affects `summary.scalePosition` produces a visible glide instead of a jump, and `npm run build` passes clean.
