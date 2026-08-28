# 011 — Promote the hand-typed easing curve and stagger timings to shared tokens

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`src/index.css`) for token definitions, 2 files (`Header.tsx`, `HeroSection.tsx`) to consume them — plus optionally the 6 pre-existing plans' future execution

## Problem

The strong ease-out curve `cubic-bezier(0.23, 1, 0.32, 1)` is hand-typed identically in at least two places already (`src/sections/HeroSection.tsx:41` and `:46`), with six more prior, not-yet-executed plans in this same `plans/` directory ready to hand-type the exact same string again once run. Separately, the header/hero stagger sequence defines its rhythm via seven ungoverned magic numbers with no named relationship between them:

```
duration-[1300ms]  (×4 — Header.tsx:32, HeroSection.tsx:13,16,20)
delay-[100ms]       (HeroSection.tsx:13)
delay-[200ms]       (HeroSection.tsx:16)
delay-[300ms]       (HeroSection.tsx:20)
duration-[900ms]   (×2 — HeroSection.tsx:41,46)
delay-[600ms]       (×2 — HeroSection.tsx:41,46)
```

AUDIT.md: "Curves and durations should live as shared tokens... hand-typed cubic-beziers that almost match is a consolidation finding" — here it's an exact literal duplicate already, which is the strongest form of that finding.

## Target

Add real CSS custom properties for the curve (Tailwind v4's `--ease-*` namespace generates a matching `ease-*` utility automatically), and use them in place of the arbitrary-value strings. Durations/delays stay as Tailwind arbitrary values (a numeric stagger doesn't benefit from token names the way a hard-to-remember cubic-bezier does — this plan only tokenizes the curve, not every magic number, to avoid over-engineering seven near-single-use variables).

```css
/* target — add to src/index.css inside the existing @theme inline block */
@theme inline {
  /* ...existing tokens... */
  --ease-entrance: cubic-bezier(0.23, 1, 0.32, 1);
}
```

```tsx
/* target — every site that currently hand-types ease-[cubic-bezier(0.23,1,0.32,1)] */
className="... ease-entrance ..."
```

## Repo conventions to follow

- `src/index.css` already has a `@theme inline { ... }` block (search for it near the top of the file) where this repo's design tokens (`--fontsize-*`, `--lineheight-*`, `--space-*`, `--radius-*`) live — add `--ease-entrance` there, not in a separate block.
- Naming: `--ease-entrance` (not `--ease-out`) deliberately avoids colliding with Tailwind's own built-in `ease-out` utility name/value (`cubic-bezier(0,0,0.2,1)`, a different, weaker curve) — overriding a well-known Tailwind utility name to mean something else would be surprising to future maintainers. A distinctly-named token avoids that ambiguity while still auto-generating a `ease-entrance` utility class via Tailwind v4's `--ease-*` theme namespace.

## Steps

1. In `src/index.css`, locate the `@theme inline { ... }` block and add `--ease-entrance: cubic-bezier(0.23, 1, 0.32, 1);` inside it.
2. In `src/sections/HeroSection.tsx:41` and `:46`, replace `ease-[cubic-bezier(0.23,1,0.32,1)]` with `ease-entrance`.
3. If plan `007` has landed (i.e. `Header.tsx:32` and `HeroSection.tsx:13,16,20` also use `ease-[cubic-bezier(0.23,1,0.32,1)]`), replace those four instances with `ease-entrance` too. If `007` hasn't landed yet (those four still say `ease-in`), leave them untouched — this plan only consolidates instances of the curve that already exist, it doesn't introduce the curve to new places (that's `007`'s job).
4. Run `npm run build` and confirm the compiled CSS contains a `.ease-entrance{...cubic-bezier(0.23, 1, 0.32, 1)...}` rule and no remaining literal `cubic-bezier(0.23,1,0.32,1)` arbitrary-value classes in the two touched files.

## Boundaries

- Do NOT touch the `ease-in` instances unless plan `007` has already converted them — this plan consolidates existing usages of the strong-ease-out curve, it does not decide which elements should use which curve (that's `007`'s and `009`'s job).
- Do NOT tokenize the duration/delay values (1300ms, 900ms, 100/200/300/600ms) in this pass — seven near-single-use numeric tokens add indirection without much payoff; only the curve (duplicated verbatim, error-prone to retype) is worth tokenizing here.
- Do NOT retroactively edit the six pre-existing plans in `plans/001` through `plans/006` to reference `ease-entrance` — they're independent, self-contained documents per this skill's Hard Rule 3, and rewriting them is out of scope for a code-consolidation plan. A note in `plans/README.md` is enough (already present).

## Verification

- **Mechanical**: `npm run build` — inspect `dist/assets/index-*.css` for `--ease-entrance` in the theme block and a generated `.ease-entrance` utility class; `npm run lint` clean.
- **Feel check**: reload the page — the hero image fades (and the header/hero entrance, if `007` landed first) should look and time identically to before this change; this plan is a pure refactor with zero visual difference.
- **Done when**: no literal `cubic-bezier(0.23,1,0.32,1)` string remains in `HeroSection.tsx` (or `Header.tsx`, if `007` already landed), replaced by `ease-entrance` everywhere it was used.
