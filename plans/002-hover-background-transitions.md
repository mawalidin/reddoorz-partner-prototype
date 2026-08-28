# 002 — Add hover-background transitions to nav pills & social icons

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: MEDIUM
- **Category**: Easing & duration / Accessibility
- **Estimated scope**: 3 elements across 2 files (`src/components/Header.tsx`, `src/components/Footer.tsx`), plus one new CSS rule in `src/index.css`

## Problem

Three hover targets change background color with no transition — the color swap happens in a single frame the instant the pointer enters/leaves:

```tsx
// src/components/Header.tsx:38-46 — current (desktop nav links)
<nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
  {NAV_LINKS.map((link) => (
    <a
      key={link.href}
      href={link.href}
      className="rounded-full px-3 py-2 font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey whitespace-nowrap hover:bg-background-alternative"
    >
      {link.label}
    </a>
  ))}
</nav>
```

```tsx
// src/components/Header.tsx:51-58 — current (language button)
<button
  type="button"
  className="flex items-center gap-2 rounded-full px-3 py-2 font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey hover:bg-background-alternative"
  aria-label="Select language"
>
  EN
  <img src={chevronDown} alt="" className="size-4" />
</button>
```

```tsx
// src/components/Footer.tsx:74-87 — current (social icons)
{SOCIALS.map((social) => (
  <a
    key={social.label}
    href={social.href}
    target="_blank"
    rel="noreferrer"
    aria-label={social.label}
    className="flex size-9 items-center justify-center rounded-full text-content-primary hover:bg-background-primary"
  >
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d={social.path} />
    </svg>
  </a>
))}
```

A returning visitor scanning the desktop nav with a mouse will see this snap tens of times per session — it's the "tens of times/day" tier in the frequency table, which calls for near-imperceptible motion, not zero.

## Target

Add a 120ms background-color transition to all three, gated behind `@media (hover: hover) and (pointer: fine)` so touch taps on tablet/mobile (which fire a synthetic `:hover` on tap in some browsers) never get a lingering fade — the transition only exists where a real hover-capable pointer is present.

```css
/* target — add to src/index.css */
@media (hover: hover) and (pointer: fine) {
  .hover-fade {
    transition: background-color 120ms cubic-bezier(0.23, 1, 0.32, 1);
  }
}
```

```tsx
/* target — Header.tsx nav link className, append "hover-fade" */
className="hover-fade rounded-full px-3 py-2 font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey whitespace-nowrap hover:bg-background-alternative"
```

```tsx
/* target — Header.tsx language button className, append "hover-fade" */
className="hover-fade flex items-center gap-2 rounded-full px-3 py-2 font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey hover:bg-background-alternative"
```

```tsx
/* target — Footer.tsx social icon className, append "hover-fade" */
className="hover-fade flex size-9 items-center justify-center rounded-full text-content-primary hover:bg-background-primary"
```

## Repo conventions to follow

- Plain CSS lives directly in `src/index.css` alongside the `@theme inline` block and the reduced-motion media query — add `.hover-fade` there.
- This repo has no `--ease-*` tokens; the cubic-bezier is inlined directly per Hard Rule 3, matching plan `001`.
- A reusable class (`.hover-fade`) is used instead of repeating the same Tailwind arbitrary-variant chain three times, since Tailwind v4's built-in `hover:` variant is a plain `:hover` pseudo-class with no `(hover: hover)` media guard in this project — verify this assumption in Step 1 before proceeding.

## Steps

1. Before writing any CSS, confirm Tailwind's `hover:` utility in this project is NOT already wrapped in `@media (hover: hover)`: run `npm run dev`, open DevTools on the built page, inspect the computed/matched CSS rule for `.hover\:bg-background-alternative:hover` (or search the served stylesheet for `hover:hover`). If it turns out Tailwind already gates hover this way, skip adding the `@media` wrapper in step 2 (add `.hover-fade { transition: ...; }` unconditionally instead) and note this in the plan's completion report.
2. In `src/index.css`, add the `.hover-fade` rule (with or without the `@media (hover: hover) and (pointer: fine)` wrapper per step 1's finding) after the existing reduced-motion block.
3. In `src/components/Header.tsx`, prepend `hover-fade ` to the `className` of the nav `<a>` at line 42 and the language `<button>` at line 53.
4. In `src/components/Footer.tsx`, prepend `hover-fade ` to the `className` of the social `<a>` at line 81.

## Boundaries

- Do NOT touch the Footer's `NAVIGATION` links (`Footer.tsx:47-56`) — those use `hover:underline`, a different mechanism (`text-decoration`), which browsers don't animate consistently across engines; leave them as-is.
- Do NOT add `transition-colors` via Tailwind utility classes directly on these three elements — use the shared `.hover-fade` class so the hover-capable-pointer gate lives in one place.
- Do NOT touch any other `hover:` usage in the codebase (e.g. `BrandCarousel.tsx`, `Button.tsx`'s `hover:brightness-105`/`hover:bg-background-alternative`) — those are out of scope for this plan.
- If any of the three cited `className` strings don't match exactly (drift since commit `7b5477f`), STOP and report instead of improvising — find-and-replace on `hover:bg-background-alternative` blindly would also catch the mobile nav links inside `{menuOpen && (...)}`, which are a different, touch-only context and should NOT receive this hover-only treatment.

## Verification

- **Mechanical**: `npm run lint` and `npm run build` — both should pass clean.
- **Feel check**: run `npm run dev` on a desktop-width viewport with a real mouse (not touch emulation):
  - Hover each of the four desktop nav links, the language button, and each footer social icon — the background should fade in over ~120ms, not snap.
  - Move the mouse away — the background should fade back out over the same ~120ms, not snap.
  - Switch DevTools to a touch/mobile device emulation (which reports `(hover: none)`) and tap the equivalent elements in the mobile menu / footer — confirm no transition class is being applied there (there should be no lingering hover-tint after tapping).
  - In DevTools' Animations panel, set playback to 10% and confirm the background-color interpolates smoothly rather than jumping partway through.
- **Done when**: all three hover targets fade in/out at 120ms on hover-capable pointers only, and `npm run build` passes clean.
