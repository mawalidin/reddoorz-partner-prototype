# 007 — Replace `ease-in` with the strong ease-out curve on all header/hero entrances

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 2 files (`src/components/Header.tsx`, `src/sections/HeroSection.tsx`), 4 elements

## Problem

The topbar and hero heading/subtext/CTA entrances all use Tailwind's literal `ease-in` (`cubic-bezier(.4,0,1,1)`) at 1300ms:

```tsx
// src/components/Header.tsx:32 — current
<div className="flex h-[length:var(--header-height)] items-center justify-between px-4 py-2 transition-[translate,opacity] duration-[1300ms] ease-in starting:-translate-y-[20%] starting:opacity-0 md:px-8 lg:px-20">
```

```tsx
// src/sections/HeroSection.tsx:13 — current (h1)
<h1 className="max-w-[900px] font-['Rubik'] text-[length:var(--fontsize-headline-xxl)] leading-[var(--lineheight-headline-xxl)] font-semibold text-content-primary transition-[translate,opacity] duration-[1300ms] delay-[100ms] ease-in starting:translate-y-[20%] starting:opacity-0 lg:text-[length:var(--fontsize-display-l)] lg:leading-[var(--lineheight-display-l)]">
```

```tsx
// src/sections/HeroSection.tsx:16 — current (p)
<p className="max-w-[900px] font-['Rubik'] text-[length:var(--fontsize-headline-xs)] leading-[var(--lineheight-headline-xs)] font-light text-[#524f4d] transition-[translate,opacity] duration-[1300ms] delay-[200ms] ease-in starting:translate-y-[20%] starting:opacity-0 lg:text-[length:var(--fontsize-headline-m)] lg:leading-[var(--lineheight-headline-m)]">
```

```tsx
// src/sections/HeroSection.tsx:20 — current (CTA row)
<div className="flex w-full flex-row flex-wrap items-center justify-center gap-4 transition-[translate,opacity] duration-[1300ms] delay-[300ms] ease-in starting:translate-y-[20%] starting:opacity-0 lg:gap-6">
```

`ease-in` starts slow and only accelerates near the end — the opposite of what an entering element should do. AUDIT.md is unconditional here: "Entering or exiting → `ease-out`... `ease-in` on UI is always a finding — it starts slow, delaying the exact moment the user is watching." Combined with the 1300ms duration, the CTA row (last, +300ms delay) doesn't visually finish settling until ~1600ms after every single page load, and most of that window barely reads as motion because of the slow start.

This was a deliberate, explicit choice made earlier in this same project's history (the curve was changed to `ease-in` on direct request), not an oversight — but the audit's job is to report it regardless so it can be revisited knowingly.

## Target

Swap `ease-in` for this repo's own strong ease-out curve — the same one already used two elements away on the hero images (`HeroSection.tsx:41,46`) — so the whole staggered sequence shares one motion quality:

```tsx
/* target — Header.tsx:32 */
className="flex h-[length:var(--header-height)] items-center justify-between px-4 py-2 transition-[translate,opacity] duration-[1300ms] ease-[cubic-bezier(0.23,1,0.32,1)] starting:-translate-y-[20%] starting:opacity-0 md:px-8 lg:px-20"
```

```tsx
/* target — HeroSection.tsx:13 (h1), same pattern for :16 (p) and :20 (CTA row), only the delay differs */
className="max-w-[900px] font-['Rubik'] text-[length:var(--fontsize-headline-xxl)] leading-[var(--lineheight-headline-xxl)] font-semibold text-content-primary transition-[translate,opacity] duration-[1300ms] delay-[100ms] ease-[cubic-bezier(0.23,1,0.32,1)] starting:translate-y-[20%] starting:opacity-0 lg:text-[length:var(--fontsize-display-l)] lg:leading-[var(--lineheight-display-l)]"
```

Only the `ease-in` → `ease-[cubic-bezier(0.23,1,0.32,1)]` token changes on each of the 4 elements. Durations (1300ms), delays (0/100/200/300ms), and the `translate`/`opacity` property list are untouched — this plan is a pure curve swap, not a re-timing.

## Repo conventions to follow

- `cubic-bezier(0.23, 1, 0.32, 1)` is already this repo's established strong ease-out — used verbatim on `HeroSection.tsx:41` and `HeroSection.tsx:46`, and in six prior animation plans in this same `plans/` directory (see `plans/README.md`'s "Shared conventions" section). Use the exact same string, don't approximate it.
- Tailwind's arbitrary `ease-[cubic-bezier(...)]` syntax is the established pattern in this codebase for custom curves (no `--ease-*` CSS token exists yet — see plan `011` for that follow-up).

## Steps

1. In `src/components/Header.tsx:32`, replace `ease-in` with `ease-[cubic-bezier(0.23,1,0.32,1)]` in the `className` string. No other part of the class list changes.
2. In `src/sections/HeroSection.tsx:13`, `:16`, and `:20`, make the same replacement — `ease-in` → `ease-[cubic-bezier(0.23,1,0.32,1)]` — in each of the three `className` strings. Do not touch the `delay-[100ms|200ms|300ms]` values, they stay as-is.

## Boundaries

- Do NOT touch `HeroSection.tsx:41`/`:46` (the hero images) — they already use the correct curve.
- Do NOT change any `duration-[...]` or `delay-[...]` value on any of the 4 elements — this plan is curve-only.
- Do NOT touch `Header.tsx:26` (the separate scroll-driven background/blur transition) — that's covered by plan `012`.
- If any of the 4 cited `className` strings don't contain `ease-in` exactly as shown (drift since commit `7b5477f`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` and `npm run lint` — both should pass clean.
- **Feel check**: run `npm run dev`, hard-reload the page, and watch the topbar and hero content settle in:
  - Motion should now visibly start immediately and ease into its final position, rather than barely moving for the first half of the transition.
  - In DevTools' Animations panel, set playback to 10% and confirm the interpolation curve now front-loads the motion (fast start, gentle settle) instead of back-loading it.
  - Toggle `prefers-reduced-motion` (Rendering panel) — the existing sitewide rule (`src/index.css:125-134`) still collapses this to near-instant regardless of curve; confirm nothing looks broken.
- **Done when**: all 4 entrance elements share the same ease-out curve as the hero images, and `npm run build` passes clean.
