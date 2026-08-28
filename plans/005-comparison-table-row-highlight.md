# 005 — Animate the comparison-table active-row highlight

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: LOW
- **Category**: Cohesion & tokens (echoes plan `003`'s state change)
- **Estimated scope**: 1 file (`src/sections/CalculatorSection.tsx`), 1 element

## Problem

The "Comparison of Hotel Types" table highlights whichever row matches the currently-selected Hotel Type with a background color, applied via a plain conditional class with no transition:

```tsx
// src/sections/CalculatorSection.tsx:261-268 — current
{HOTEL_TYPES.map((row) => {
  const monthlyOrn = Math.round(rooms * 30 * (row.occupancy / 100));
  const mid = monthlyOrn * row.recommendedRate;
  return (
    <tr
      key={row.type}
      className={row.type === hotelType ? "bg-light-accent-bg" : undefined}
    >
```

This fires every time the Hotel Type toggle in plan `003` is clicked — the row wash snaps on and off with no bridge, while the toggle itself (once `003` lands) will visibly fade.

## Target

```tsx
/* target */
{HOTEL_TYPES.map((row) => {
  const monthlyOrn = Math.round(rooms * 30 * (row.occupancy / 100));
  const mid = monthlyOrn * row.recommendedRate;
  return (
    <tr
      key={row.type}
      className={`transition-colors duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] ${row.type === hotelType ? "bg-light-accent-bg" : ""}`}
    >
```

## Repo conventions to follow

- Same inline-cubic-bezier and 160ms duration as plan `003`'s Hotel Type toggle — this is the same user action's second visible effect, so the timing should match even though the two plans are independently executable.
- Tailwind's `transition-colors` utility (not the property-list arbitrary syntax used in plans `003`/`004`) is sufficient here since only `background-color` is changing — no `transform` or `border-color` involved.

## Steps

1. In `src/sections/CalculatorSection.tsx`, locate the `<tr>` inside the `HOTEL_TYPES.map(...)` block within the comparison table (lines 264-268).
2. Replace `className={row.type === hotelType ? "bg-light-accent-bg" : undefined}` with the template-literal version shown in Target — the `transition-colors duration-160 ease-[cubic-bezier(0.23,1,0.32,1)]` classes must always be present (on both the active and inactive branches) so the transition applies whether the row is gaining or losing the highlight; use `""` (empty string) for the inactive branch instead of `undefined`, since a template literal with `undefined` interpolated would render the literal string `"undefined"` as a class name.

## Boundaries

- Do NOT touch the `<td>` cells inside this row, or any other table styling.
- Do NOT touch the Hotel Type toggle itself (`CalculatorSection.tsx:137-148`) — that's plan `003`, and this plan is independently executable without it.
- If lines 261-268 don't match this excerpt when opened (drift since commit `7b5477f`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run lint` and `npm run build` — both should pass clean.
- **Feel check**: run `npm run dev`, scroll to the calculator's "Comparison of Hotel Types" table, and:
  - Click between Basic / Plus / Premium above the table — the previously-highlighted row should fade to white and the newly-selected row should fade to pink over ~160ms, with no visible snap.
  - In DevTools' Animations panel, set playback to 10% and confirm the color interpolates smoothly.
  - Toggle `prefers-reduced-motion` — the existing sitewide rule (`src/index.css:125-134`) already collapses this to near-instant; confirm the highlight still moves to the correct row.
- **Done when**: switching Hotel Type produces a smooth ~160ms row-highlight crossfade instead of a snap, and `npm run build` passes clean.
