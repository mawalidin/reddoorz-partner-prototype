# 015 — "How it works": fit all four cards at desktop so the row doesn't scroll

- **Status**: TODO
- **Commit**: f6cc0b7 (working tree also contains the uncommitted full-bleed carousel change; excerpts are from that working tree)
- **Severity**: MEDIUM
- **Category**: Purpose & frequency (a scroll row that has nothing to scroll to) / Physicality
- **Estimated scope**: 1 file, 2 class strings

## Problem

At desktop the four step cards are fixed 320px wide with 16px gaps: 4×320 + 3×16 = 1328px, which is wider than the 1280px content column. After the full-bleed change the row spans the page with 80px of padding either side, so it scrolls about 63px at 1440px (`scrollWidth > clientWidth`) and draws a permanent 15px scrollbar (see plan 014). The cards all fit on screen, so there is nothing for the user to scroll to — the bar and the scroll are pure noise.

```tsx
// src/sections/HowItWorksIntro.tsx:45 — current
<div className="bleed-x flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 lg:gap-4">

// src/sections/HowItWorksIntro.tsx:49 — current (card)
className={`flex w-[300px] shrink-0 snap-start flex-col gap-6 rounded-2xl bg-[#f0f0f0] p-4 md:h-[172px] md:gap-4 md:p-6 lg:h-auto lg:w-[320px] lg:gap-6 ${reveal} ${visible ? shown : hidden}`}
```

## Target

At `lg` and up the row is a normal 4-column flex row at the content width (no bleed, no scroll). Below `lg` nothing changes (still a full-bleed swipe row of 300px cards).

```tsx
// scroller
<div className="bleed-x-until-lg flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 lg:gap-4 lg:overflow-visible lg:pb-0">

// card: replace `lg:w-[320px]` with a flexible width and allow shrinking
`flex w-[300px] shrink-0 snap-start flex-col gap-6 rounded-2xl bg-[#f0f0f0] p-4 md:h-[172px] md:gap-4 md:p-6 lg:h-auto lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink lg:gap-6 ${reveal} ${visible ? shown : hidden}`
```

At 1440px each card becomes (1280 − 48) / 4 = 308px (Figma specifies 320px; the Figma row is wider than its own container, which is the original cropping problem, so 308px is a deliberate fit — confirm with design).

## Repo conventions to follow

- `.bleed-x-until-lg` is defined at the bottom of `src/index.css`; it is already used by `src/sections/BrandSection.tsx:73` for exactly this "swipe row that becomes a normal layout at desktop" pattern. Imitate that line.

## Steps

1. `src/sections/HowItWorksIntro.tsx:45` — replace `bleed-x` with `bleed-x-until-lg` and append `lg:overflow-visible lg:pb-0`.
2. `src/sections/HowItWorksIntro.tsx:49` — in the card class string replace `lg:w-[320px]` with `lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink`.
3. Leave all other classes, the reveal stagger and the copy untouched.

## Boundaries

- Do NOT change the card content, the stagger delays, or any breakpoint below `lg`.
- Do NOT touch other sections.
- If the line numbers drifted from the excerpt, STOP and report.

## Verification

- **Mechanical**: `npx tsc -b` and `npm run build` pass.
- **Feel check**:
  - At 1440px: all four cards are fully visible inside the content column, equal width, aligned with the heading's left edge; `el.scrollWidth === el.clientWidth` on the row; no scrollbar.
  - At 1024–1279px: cards shrink evenly and text still fits (watch the 4th card's body copy for wrapping).
  - At 768px and 390px: still a full-bleed swipe row with the next card peeking to the screen edge.
- **Done when**: no horizontal scroll exists on the row at `lg` and above, and nothing changed below `lg`.
