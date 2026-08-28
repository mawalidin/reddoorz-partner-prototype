# 012 — Reconcile the header's scroll-driven chrome transition with the new entrance motion

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: LOW
- **Category**: Cohesion
- **Estimated scope**: 1 file (`src/components/Header.tsx`), 1 declaration

## Problem

```tsx
// src/components/Header.tsx:25-31 — current
<header
  className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
    scrolled || menuOpen
      ? "bg-[rgba(250,249,246,0.9)] backdrop-blur-[29px]"
      : "bg-transparent"
  }`}
>
  <div className="flex h-[length:var(--header-height)] items-center justify-between px-4 py-2 transition-[translate,opacity] duration-[1300ms] ease-in starting:-translate-y-[20%] starting:opacity-0 md:px-8 lg:px-20">
```

The scroll-driven background/blur fade (`duration-300`, Tailwind's default timing function since none is specified) sits one JSX line above the newly-authored, deliberately-curved entrance transition on the same component. Two different, unrelated motion languages exist side-by-side on the same element tree, with nothing marking whether that's intentional (persistent chrome feedback legitimately pacing differently from a one-time reveal) or just an oversight from adding new motion next to old.

## Target

Bring the scroll-driven transition into the same curve vocabulary as the entrance work, while keeping its shorter, more frequent-interaction-appropriate duration (300ms is correct for a recurring, scroll-tied transition — AUDIT.md's budget table doesn't call for lengthening it):

```tsx
/* target */
<header
  className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
    scrolled || menuOpen
      ? "bg-[rgba(250,249,246,0.9)] backdrop-blur-[29px]"
      : "bg-transparent"
  }`}
>
```

(If plan `011` has landed, use `ease-entrance` instead of the literal `ease-[cubic-bezier(0.23,1,0.32,1)]` string.)

## Repo conventions to follow

- Same curve as plans `007`/`009`/`011` — one motion vocabulary across the whole header, not just the new entrance work.
- Tailwind's default timing function (applied when no `ease-*` class is present) is `cubic-bezier(0.4, 0, 0.2, 1)` — a different, weaker curve than this repo's established strong ease-out; making it explicit here removes the ambiguity of "was this left un-curved on purpose."

## Steps

1. In `src/components/Header.tsx`, locate the outer `<header>`'s className template literal (line 26).
2. Append `ease-[cubic-bezier(0.23,1,0.32,1)]` (or `ease-entrance` if plan `011` has already landed) immediately after `duration-300` in the static part of the string, before the `${scrolled || menuOpen ? ... : ...}` interpolation.

## Boundaries

- Do NOT change `duration-300` to a longer value — this is a recurring, scroll-tied transition, not a one-time entrance; AUDIT.md doesn't call for lengthening it.
- Do NOT touch the `bg-[rgba(250,249,246,0.9)] backdrop-blur-[29px]` / `bg-transparent` conditional values — that's the scroll-state logic, unrelated to this cohesion fix.
- Do NOT touch `Header.tsx:32` (the entrance transition) — covered by plan `007`.
- If the header's className string doesn't match the excerpt above (drift since commit `7b5477f`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` and `npm run lint` clean.
- **Feel check**: run `npm run dev`, scroll past the 8px threshold and back — the background/blur fade should feel slightly more considered (fast-settling rather than linear-ish default), while still completing quickly (300ms, not sluggish). Toggle the mobile menu open/close too, since `menuOpen` also drives this same transition.
- **Done when**: the header's scroll-driven transition uses the same curve as the rest of the header/hero motion, with its duration unchanged.
