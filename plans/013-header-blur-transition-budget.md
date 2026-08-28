# 013 — Bring the header's transitioned backdrop-blur radius under the performance budget

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file (`src/components/Header.tsx`), 1 declaration

## Problem

```tsx
// src/components/Header.tsx:25-30 — current
<header
  className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
    scrolled || menuOpen
      ? "bg-[rgba(250,249,246,0.9)] backdrop-blur-[29px]"
      : "bg-transparent"
  }`}
>
```

Two related, low-severity performance notes on this one declaration, pre-existing (predates the header/hero entrance work added this session):

1. `backdrop-blur-[29px]` is transitioned (from 0 to 29px) on every scroll-threshold crossing and menu toggle. AUDIT.md: "Keep transition-time `filter: blur()` under 20px — heavy blur is expensive, especially in Safari." 29px exceeds that budget on a `fixed`, full-width, frequently-retriggered element.
2. The same declaration also transitions `background-color`, which is outside AUDIT.md's "animate transform/opacity only" allowlist — though `background-color` is paint-only (no layout impact) and this fires only on a scroll-threshold crossing (not per-frame), so real-world cost is negligible. Noted for completeness, not treated as a meaningful risk.

## Target

Reduce the transitioned blur radius to stay within budget. The simplest fix that preserves the visual "frosted glass" effect closely: cap the transitioned value at 20px.

```tsx
/* target */
<header
  className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
    scrolled || menuOpen
      ? "bg-[rgba(250,249,246,0.9)] backdrop-blur-[20px]"
      : "bg-transparent"
  }`}
>
```

The `background-color` transition (finding 2 above) is left as-is — its cost is negligible and AUDIT.md's allowlist rule is aimed at layout-triggering properties, which `background-color` is not; no code change proposed for that half of the finding, it's informational only.

## Repo conventions to follow

- `backdrop-blur-[29px]` is a one-off arbitrary Tailwind value already in this file; changing the number is a one-token edit, no new pattern introduced.

## Steps

1. In `src/components/Header.tsx`, change `backdrop-blur-[29px]` to `backdrop-blur-[20px]` in the `scrolled || menuOpen` truthy branch of the className template literal (line 28).

## Boundaries

- Do NOT change the falsy branch (`bg-transparent`) — it has no blur to adjust.
- Do NOT touch `background-color` — left as-is per this plan's own Target section (informational finding only, no fix proposed).
- Do NOT touch `duration-300` or add an easing token here — that's plan `012`'s job; this plan is blur-radius-only. If both `012` and `013` are being executed, either order is fine since they touch adjacent but distinct parts of the same className string.
- If the exact string `backdrop-blur-[29px]` isn't present (drift since commit `7b5477f`), STOP and report instead of guessing a replacement value.

## Verification

- **Mechanical**: `npm run build` and `npm run lint` clean.
- **Feel check**: scroll past the threshold in a real browser (Safari if available, since AUDIT.md specifically calls out Safari's blur cost) and confirm the frosted-glass background still reads clearly as "blurred," just slightly less intensely — 20px vs 29px is a subtle difference, not a visibly broken effect.
- **Done when**: the transitioned blur radius is ≤20px and the header still visually reads as a frosted-glass scrolled state.
