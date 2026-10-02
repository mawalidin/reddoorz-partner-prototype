# 014 — Hide the always-visible native scrollbar on the swipe rows (keep scrolling, add keyboard access)

- **Status**: DONE
- **Commit**: f6cc0b7 (working tree also contains the uncommitted full-bleed carousel change in `src/index.css` and the four section files — the excerpts below are from that working tree)
- **Severity**: MEDIUM
- **Category**: Purpose & frequency (permanent chrome that carries no information) / Accessibility
- **Estimated scope**: 1 CSS file + 5 component files, a few lines each

## Problem

Five horizontal swipe rows use native `overflow-x-auto`. On Windows/Linux desktop browsers a classic scrollbar track is drawn under each row **permanently**, even when the user never scrolls. Measured in the running app at 1440px: the "How it works" row has a 15px scrollbar (`offsetHeight - clientHeight = 15`). At tablet width on a desktop browser the Awards, Our Brands and Partner-story review rows get the same bar. On phones it is an overlay bar and does not show, which is why it only looks wrong on desktop browsers. The bar is also now full page width because these rows bleed to the screen edges.

Locations (current code, verbatim):

```tsx
// src/sections/HowItWorksIntro.tsx:45
<div className="bleed-x flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 lg:gap-4">

// src/sections/PartnerStoriesSection.tsx:163
<div className="bleed-x-until-lg flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">

// src/sections/BrandSection.tsx:73
<div className="bleed-x-until-lg flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:gap-x-4 lg:gap-y-10 lg:overflow-visible lg:pb-0">

// src/sections/AwardsSection.tsx:24
<div className="bleed-x-until-lg flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">

// src/sections/solutions/SolutionsList.tsx:89   (sticky mobile menu; the Figma frame has a custom progress bar and no scrollbar)
<div className="flex overflow-x-auto lg:flex-col lg:overflow-visible">
```

Hiding the bar removes the only keyboard-scroll cue, so each row must also become keyboard-focusable (a scroll container with no focusable child cannot be scrolled with the arrow keys in some browsers).

## Target

Add one utility class to `src/index.css` and apply it to the five rows. Scrolling, snapping, touch swipe and trackpad all keep working; only the bar is hidden.

```css
/* src/index.css — add after the .bleed-x-until-lg rules */
.scrollbar-none {
  scrollbar-width: none; /* Firefox, modern Chromium */
  -ms-overflow-style: none; /* legacy Edge */
}

.scrollbar-none::-webkit-scrollbar {
  display: none; /* Safari, older Chromium */
}
```

Each row also gets keyboard access and a name:

```tsx
tabIndex={0}
role="group"
aria-label="<row name>"   // e.g. "How it works steps"
```

and a visible focus style that matches the repo's existing keyboard-focus outline:
`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red`

## Repo conventions to follow

- Shared full-bleed helpers already live at the bottom of `src/index.css` (`.bleed-host`, `.bleed-x`, `.bleed-x-until-lg`); add the new class next to them in the same plain-CSS style.
- Exemplar for focus styling: `src/components/BackLink.tsx:11` uses `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red`.

## Steps

1. In `src/index.css`, after the `.bleed-x-until-lg` media query block, add the `.scrollbar-none` rules above.
2. `src/sections/HowItWorksIntro.tsx:45` — change the class string to start with `bleed-x scrollbar-none flex …` (keep everything else) and add `tabIndex={0} role="group" aria-label="How it works steps"` plus the focus classes.
3. `src/sections/PartnerStoriesSection.tsx:163` — prepend `scrollbar-none` after `bleed-x-until-lg`; add `tabIndex={0} role="group" aria-label="Partner reviews"` plus the focus classes. This row becomes a grid at `lg`; keep the same focus outline there (a focused grid wrapper is harmless).
4. `src/sections/BrandSection.tsx:73` — same pattern; `aria-label="Our brands"`.
5. `src/sections/AwardsSection.tsx:24` — same pattern; `aria-label="Awards and recognition"`.
6. `src/sections/solutions/SolutionsList.tsx:89` — add `scrollbar-none` only (no tabIndex: this row is a non-interactive label strip driven by scroll position elsewhere).
7. Do NOT apply `.scrollbar-none` to the calculator table scroller (`src/sections/CalculatorSection.tsx:269`) — its scrollbar is a real affordance for a data table.

## Boundaries

- Do NOT touch the Embla carousels (Real Transformation, Partner-story videos, brand photo carousels) — they have no scrollbar.
- Do NOT change layout, widths, snap behaviour or padding.
- Do NOT add dependencies.
- If a line number does not match the excerpt (drift since the commit), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx tsc -b` passes; `npm run build` passes.
- **Feel check** (use a Windows or Linux desktop browser — macOS overlay scrollbars hide this bug):
  - At 768px and at 1440px, none of the five rows show a scrollbar track; measure in DevTools: `el.offsetHeight - el.clientHeight` is `0` for each.
  - Swipe/drag and trackpad scrolling still work and still snap to card starts.
  - Tab into each row: a red outline appears; Left/Right arrow keys scroll it.
  - Screen reader announces the group name.
- **Done when**: no scrollbar is drawn under any of the five rows in any breakpoint on a classic-scrollbar browser, and every hidden-bar row is keyboard scrollable.
