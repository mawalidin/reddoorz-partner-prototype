# 010 — Make sitewide reduced-motion "gentler," not a full snap to zero

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file (`src/index.css`), sitewide blast radius — bigger than the "header and hero" scope this finding was raised in

## Problem

```css
/* src/index.css:125-134 — current */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This blanket, `!important`, universal-selector rule collapses every transition and animation sitewide — including the header/hero entrance work (`Header.tsx:32`, `HeroSection.tsx:13,16,20,41,46`) and the six other animation plans already in this `plans/` directory — to a full instant snap under `prefers-reduced-motion: reduce`. AUDIT.md is explicit: "Reduced motion means fewer and gentler animations, **not zero** — keep transitions that aid comprehension, remove position changes." This rule doesn't distinguish between a position-changing `translate` (which AUDIT.md says to drop) and a comprehension-aiding `opacity` fade (which it says to keep) — it nukes both identically.

**This is the objectively safe failure mode** (nothing moves, nothing takes extra time) — it isn't harmful to vestibular-sensitive users, it's just not the more refined pattern AUDIT.md recommends. It's also a **pre-existing, sitewide rule** that predates the header/hero entrance work — fixing it properly means touching a rule that affects every animated element in the entire codebase, not just Header/HeroSection. Treat this plan as optional/bigger-scope; it was raised while auditing the header and hero, but its fix isn't local to them.

## Target

Replace the blanket kill-switch with per-property handling: keep `opacity`/color transitions animating gently (short, capped duration) while removing position/transform changes entirely.

```css
/* target */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }

  /* Drop position/size changes entirely — no movement for vestibular-sensitive users. */
  *,
  *::before,
  *::after {
    translate: none !important;
    transform: none !important;
    scale: 1 !important;
  }

  /* Keep opacity/color transitions, just capped short — "gentler, not zero". */
  *,
  *::before,
  *::after {
    transition-duration: 150ms !important;
    animation-duration: 150ms !important;
  }
}
```

This keeps every existing `opacity`-driven fade (e.g. the hero image dissolves, plan `006`'s "Play Video" overlay fade once executed) as a quick 150ms fade instead of an instant pop, while every `translate`/`transform`/`scale`-driven motion (the header/hero slides, plan `001`'s mobile-nav slide once executed) is forced to its final position immediately via `translate: none`/`transform: none`, with no visible movement.

## Repo conventions to follow

- This is the only global animation-control rule in the codebase (`src/index.css:118-134`, right after the `body` rule) — keep the replacement in the same location, same file.
- All six existing plans in this `plans/` directory, plus plans `007`-`009`/`011`-`013` from this same audit round, were written assuming this global rule already handles reduced-motion for them (each explicitly says "no per-component reduced-motion CSS needed, the sitewide rule covers it"). This plan changes what that sitewide coverage actually does, so if executed, re-verify a sample of those other plans' "Toggle prefers-reduced-motion" verification steps still pass (spot-check is enough, not all of them).

## Steps

1. In `src/index.css`, replace the single rule block at lines 125-134 with the three-rule-block version shown in Target (note it's now three separate declaration blocks under the same `@media` query, not one — this is intentional, keeping each concern legible rather than one dense rule).
2. Confirm `translate: none`, `transform: none`, and `scale: 1` are valid resets for Tailwind v4's individual-transform-property utilities (`translate-*`, `rotate-*`, `scale-*` compile to the `translate`/`rotate`/`scale` CSS properties respectively, confirmed elsewhere in this codebase's compiled output) — these three resets cover Tailwind's transform utilities used anywhere in the app, not just Header/HeroSection.

## Boundaries

- Do NOT touch any component file — this is a single-file, `src/index.css`-only change.
- Do NOT remove `scroll-behavior: auto !important` or `animation-iteration-count: 1 !important` — those are unrelated, correct, and untouched by this finding.
- Do NOT lower the capped duration below ~100ms or raise it above ~200ms — AUDIT.md's press-feedback budget (100-160ms) is the closest analogous "must still feel instant but not jarring" reference point available; 150ms sits in that range.
- Since this rule is sitewide, re-test a handful of OTHER animated components after this change (e.g. the Solutions section's sticky nav progress bar, the Calculator's toggle transitions from earlier plans) to confirm none of them broke — this plan's blast radius is larger than the two files it was raised against.

## Verification

- **Mechanical**: `npm run build` and `npm run lint` clean.
- **Feel check**: enable "Emulate CSS prefers-reduced-motion: reduce" in DevTools' Rendering panel, reload, and confirm:
  - The header/hero entrance: content appears in its final position immediately (no slide), but still has a very brief (~150ms) opacity fade rather than a hard instant pop.
  - Any hover-color transitions elsewhere in the app (once plan `002` lands) still give a quick, perceptible color change rather than nothing at all.
  - No element gets stuck at a mid-transition or starting-style value — everything reaches its correct final state.
- **Done when**: reduced-motion users get a quick, gentle fade instead of either full motion or a hard instant snap, and no other animated component in the app regresses.
