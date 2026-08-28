# 003 — Add selection transition + press feedback to the Hotel Type toggle

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: MEDIUM
- **Category**: Physicality & origin / Easing & duration
- **Estimated scope**: 1 file (`src/sections/CalculatorSection.tsx`), 1 element

## Problem

The Hotel Type segmented control (Basic / Plus / Premium) in the revenue calculator swaps its border and background color instantly on click, with no press feedback of any kind:

```tsx
// src/sections/CalculatorSection.tsx:134-149 — current
{HOTEL_TYPES.map((option) => {
  const isActive = option.type === hotelType;
  return (
    <button
      key={option.type}
      type="button"
      onClick={() => setHotelType(option.type)}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 font-['Rubik'] text-[length:var(--fontsize-body-xm)] text-content-primary ${
        isActive ? "border-brand-red bg-light-accent-bg" : "border-border-opaque bg-background-primary"
      }`}
    >
      <img src={option.icon} alt="" className="size-6" />
      {option.type}
    </button>
  );
})}
```

This is a real, occasional interaction (a first-time visitor clicks it a handful of times while configuring the calculator) — it clears the frequency gate for standard feedback treatment, and today it gives none.

## Target

A 160ms color transition on the border/background swap, plus a subtle `scale(0.98)` press state so the click itself feels acknowledged before the selection state even updates:

```tsx
/* target */
{HOTEL_TYPES.map((option) => {
  const isActive = option.type === hotelType;
  return (
    <button
      key={option.type}
      type="button"
      onClick={() => setHotelType(option.type)}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 font-['Rubik'] text-[length:var(--fontsize-body-xm)] text-content-primary transition-[background-color,border-color,transform] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] ${
        isActive ? "border-brand-red bg-light-accent-bg" : "border-border-opaque bg-background-primary"
      }`}
    >
      <img src={option.icon} alt="" className="size-6" />
      {option.type}
    </button>
  );
})}
```

## Repo conventions to follow

- This repo has no `--ease-*` tokens; inline the cubic-bezier via Tailwind's arbitrary `ease-[cubic-bezier(0.23,1,0.32,1)]` syntax, matching plans `001`/`002`.
- Tailwind v4's arbitrary `transition-[...]` property-list syntax is already the right tool here since three distinct properties (`background-color`, `border-color`, `transform`) need to transition together — don't use `transition-colors` alone, it would silently exclude the `transform` press-feedback and Tailwind's `active:scale-*` would then snap instead of animate.
- `active:scale-[0.98]` matches the AUDIT press-feedback range (0.95–0.98, subtle) and duration range (100–160ms via the shared 160ms transition).

## Steps

1. In `src/sections/CalculatorSection.tsx`, locate the `<button>` inside the `HOTEL_TYPES.map(...)` block (lines 137-148).
2. Add `transition-[background-color,border-color,transform] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]` to the static part of the template literal (before the `${isActive ? ... : ...}` interpolation), exactly as shown in Target.
3. Leave the `isActive ? "border-brand-red bg-light-accent-bg" : "border-border-opaque bg-background-primary"` conditional untouched — only the static class list gains the new utilities.

## Boundaries

- Do NOT touch the icon (`<img src={option.icon} .../>`) or the `HOTEL_TYPES` data array.
- Do NOT touch the Comparison table's row highlight at `CalculatorSection.tsx:264-268` — that's covered by plan `005`.
- Do NOT touch the "Use Recommendation" button (`CalculatorSection.tsx:153-160`) or the `View Potential` submit button — out of scope.
- If the cited lines don't match this excerpt when opened (drift since commit `7b5477f`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run lint` and `npm run build` — both should pass clean.
- **Feel check**: run `npm run dev`, scroll to the "Find your potential" calculator, and:
  - Click between Basic / Plus / Premium — the border and background should crossfade over ~160ms, not snap.
  - Press and hold a chip (mousedown, don't release) — it should visibly shrink to 98% before the click even registers.
  - In DevTools' Animations panel, set playback to 10% and confirm the color and scale interpolate smoothly together, not sequentially.
  - Toggle `prefers-reduced-motion` in the Rendering panel — the existing sitewide rule (`src/index.css:125-134`) should already collapse this to near-instant; confirm the toggle still visually registers a state change (border/background color still swaps, just fast).
- **Done when**: clicking any chip produces a smooth ~160ms color transition and a visible press-scale, and `npm run build` passes clean.
