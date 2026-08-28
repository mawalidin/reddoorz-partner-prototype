# 006 — Fade in the "Play Video" placeholder overlay

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: LOW
- **Category**: Missed opportunities / Interruptibility
- **Estimated scope**: 2 files (`src/sections/PartnerStoriesSection.tsx`, `src/index.css`), 1 element

## Problem

Clicking "Play Video" on the Partner Stories banner mounts a full-bleed dark overlay instantly, with no transition:

```tsx
// src/sections/PartnerStoriesSection.tsx:53-69 — current
<button
  type="button"
  onClick={() => setPlaying(true)}
  className="flex items-center gap-3 rounded-full bg-background-primary px-3 py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey lg:px-5 lg:py-4 lg:text-[length:var(--fontsize-label-l)]"
>
  <img src={iconPlay} alt="" className="size-4 lg:size-5" />
  Play Video
</button>
{playing && (
  <div
    role="status"
    className="absolute inset-0 flex items-center justify-center bg-black/70 font-['Rubik'] text-white"
  >
    Video playback isn't wired up in this prototype.
  </div>
)}
```

Note: `playing` only ever goes `false → true` in this prototype — there is no close/dismiss control that sets it back to `false`, so this is an entrance-only case. Do not build exit-transition machinery for a state that can't currently reverse; that would be scope creep past what this finding calls for.

## Target

Use `@starting-style` so the freshly-mounted overlay fades in from `opacity: 0` instead of appearing instantly. Because `{playing && (...)}` is a genuine DOM insertion each time (not a `display` toggle on an always-present node), `@starting-style` applies cleanly here with no extra JS state:

```css
/* target — add to src/index.css */
.playing-overlay {
  opacity: 1;
  transition: opacity 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

@starting-style {
  .playing-overlay {
    opacity: 0;
  }
}
```

```tsx
/* target — PartnerStoriesSection.tsx */
{playing && (
  <div
    role="status"
    className="playing-overlay absolute inset-0 flex items-center justify-center bg-black/70 font-['Rubik'] text-white"
  >
    Video playback isn't wired up in this prototype.
  </div>
)}
```

## Repo conventions to follow

- Same inline-cubic-bezier convention as plans `001`-`005`: `cubic-bezier(0.23, 1, 0.32, 1)`.
- Plain CSS lives in `src/index.css` alongside the other hand-written rules — add `.playing-overlay` there, following the same pattern as `.mobile-nav` (plan `001`) and `.playing-overlay` mirrors it structurally (a class name plus a matching `@starting-style` block).
- 200ms sits inside the AUDIT.md "Modals, drawers" budget (200-500ms) — appropriate for a full-bleed status overlay, longer than the 120-160ms feedback-tier durations used in plans `002`/`003`.

## Steps

1. In `src/index.css`, add the `.playing-overlay` rule and its `@starting-style` block shown in Target, after the rules added by plan `001` (or after the reduced-motion block at line 134 if plan `001` hasn't been run yet — either position is correct, this rule has no dependency on plan `001`'s CSS).
2. In `src/sections/PartnerStoriesSection.tsx`, add `playing-overlay ` to the front of the overlay `<div>`'s `className` (line 65), exactly as shown in Target.

## Boundaries

- Do NOT add a close button, a way to set `playing` back to `false`, or any exit-transition logic — that's a functional gap outside this plan's scope (the overlay has no dismiss path today; fixing that is a product decision, not an animation one).
- Do NOT touch the "Play Video" button itself (`PartnerStoriesSection.tsx:53-60`) or the video banner image/aspect-ratio classes around it.
- Do NOT touch the `REVIEWS` carousel or avatar cards below the banner — out of scope.
- If lines 62-69 don't match this excerpt when opened (drift since commit `7b5477f`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run lint` and `npm run build` — both should pass clean.
- **Feel check**: run `npm run dev`, scroll to "Partner stories", and:
  - Click "Play Video" — the dark overlay and its text should fade in over ~200ms, not appear instantly.
  - In DevTools' Animations panel, set playback to 10% and confirm the opacity ramps smoothly from 0.
  - Toggle `prefers-reduced-motion` — the existing sitewide rule (`src/index.css:125-134`) already collapses this to near-instant; confirm the overlay still ends up fully visible and legible.
- **Done when**: clicking "Play Video" produces a ~200ms fade-in instead of an instant appearance, and `npm run build` passes clean.
