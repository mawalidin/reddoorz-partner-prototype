# 009 — Match the hero text and hero image entrance curves

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens / Easing & duration
- **Estimated scope**: 1 file (`src/sections/HeroSection.tsx`), depends on whether plan `007` has landed

## Problem

Within one continuous staggered reveal (header → heading → subtext → CTA → image), the text portion and the image portion use two different timing curves:

```tsx
// src/sections/HeroSection.tsx:13,16,20 — current, text portion
ease-in
```

```tsx
// src/sections/HeroSection.tsx:41,46 — current, image portion
ease-[cubic-bezier(0.23,1,0.32,1)]
```

Two-thirds of one perceptual "entrance moment" moves with a slow-start curve while the last third moves with a fast-start curve — the sequence doesn't read as one authored system.

**Dependency note**: if plan `007` has already been executed, this finding is already resolved (007 changes the text portion's curve to match the image portion exactly). Check `src/sections/HeroSection.tsx:13` before starting — if it already reads `ease-[cubic-bezier(0.23,1,0.32,1)]` instead of `ease-in`, this plan is done with zero changes needed; report that and stop. This plan exists independently in case `007` is skipped or reverted (e.g. if `ease-in` is kept as a deliberate final choice) and the mismatch needs resolving from the other direction instead.

## Target

If `007` has NOT landed (i.e. `HeroSection.tsx:13/16/20` still show `ease-in`): apply plan `007` instead of this one — it's the more complete fix (also resolves AUDIT.md's "ease-in is always a finding" independently of this cohesion concern). Do not do both.

If `007` has landed but was later reverted back to `ease-in` deliberately (i.e. someone consciously chose to keep `ease-in` for the text): make the image portion match the text instead, so the whole sequence is internally consistent even if it keeps the (previously-flagged) `ease-in` curve:

```tsx
/* target — HeroSection.tsx:41 and :46, only if ease-in is being deliberately kept on the text */
className="w-full object-cover transition-opacity duration-[900ms] delay-[600ms] ease-in starting:opacity-0 lg:hidden"
```

## Repo conventions to follow

- This plan is a conditional/fallback — read `007`'s current status in `plans/README.md` before touching any code. Prefer `007`'s resolution (ease-out everywhere) unless there's an explicit, documented reason `ease-in` was kept.

## Steps

1. Check `src/sections/HeroSection.tsx:13` for the current easing token.
2. If it reads `ease-[cubic-bezier(0.23,1,0.32,1)]` (plan `007` executed): no changes needed. Report done, stop.
3. If it still reads `ease-in` AND plan `007` is marked TODO: do not act here — flag that `007` should run first, since it's the more complete fix. Stop.
4. If it still reads `ease-in` AND there is explicit confirmation `ease-in` is being deliberately kept (e.g. `007` was tried and explicitly rolled back): change `HeroSection.tsx:41` and `:46`'s `ease-[cubic-bezier(0.23,1,0.32,1)]` to `ease-in` instead, matching the kept text curve.

## Boundaries

- Do NOT change any duration or delay value.
- Do NOT run both this plan and `007` — they're mutually exclusive resolutions of the same underlying inconsistency.
- If uncertain which branch applies, STOP and ask rather than guessing which curve the user intends to keep.

## Verification

- **Mechanical**: `npm run build` and `npm run lint` clean, whichever branch was taken.
- **Feel check**: reload the page and confirm the text and image portions of the hero entrance now move with the same acceleration character (both fast-start-then-settle, or both slow-start-then-accelerate) — not a mix.
- **Done when**: `HeroSection.tsx:13/16/20/41/46` all share one easing token.
