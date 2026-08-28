# 001 — Animate the mobile/tablet nav panel reveal + hamburger↔X icon

- **Status**: TODO
- **Commit**: 7b5477f
- **Severity**: HIGH
- **Category**: Missed opportunities / Interruptibility
- **Estimated scope**: 2 files (`src/components/Header.tsx`, `src/index.css`), ~25 lines changed

## Problem

The mobile/tablet primary nav panel (`<lg`, i.e. below 1024px — this is the phone AND tablet breakpoint, the two sizes most visitors will actually use) is conditionally mounted and unmounted with no transition. It snaps into existence and vanishes instantly:

```tsx
// src/components/Header.tsx:91-116 — current
{menuOpen && (
  <nav
    id="mobile-nav"
    aria-label="Primary"
    className="flex flex-col gap-1 border-t border-border-opaque px-4 py-3 lg:hidden"
  >
    {NAV_LINKS.map((link) => (
      <a
        key={link.href}
        href={link.href}
        onClick={() => setMenuOpen(false)}
        className="rounded-full px-3 py-2 font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold text-brand-grey hover:bg-background-alternative"
      >
        {link.label}
      </a>
    ))}
    <div className="mt-2 flex flex-col gap-2">
      <Button variant="outline" size="sm" className="w-full">
        Start Free Consultation
      </Button>
      <Button variant="primary" size="sm" className="w-full">
        Become A Partner
      </Button>
    </div>
  </nav>
)}
```

The hamburger/close icon has the same problem — it swaps between two entirely different `<path>` elements on the same click, with no crossfade:

```tsx
// src/components/Header.tsx:71-87 — current
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  {menuOpen ? (
    <path
      d="M6 6L18 18M6 18L18 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ) : (
    <path
      d="M4 7H20M4 12H20M4 17H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  )}
</svg>
```

Both are state changes a mobile/tablet visitor will trigger within seconds of landing on the page — this is the single most-trafficked motion gap in the app.

## Target

The panel fades and slides in from the header (`translateY(-8px) → 0`, `opacity 0 → 1`), and — critically — fades back out on close instead of vanishing, using `@starting-style` for entry and `transition-behavior: allow-discrete` on `display` for exit. This requires the `<nav>` to stay in the DOM always (no more `{menuOpen && ...}` wrapper) with visibility controlled by a `data-open` attribute, and `inert` toggled so closed-panel links aren't tabbable or exposed to assistive tech.

```css
/* target — add to src/index.css, after the existing @media (prefers-reduced-motion) block */
.mobile-nav {
  display: none;
  opacity: 0;
  transform: translateY(-8px);
  transition:
    opacity 220ms cubic-bezier(0.23, 1, 0.32, 1),
    transform 220ms cubic-bezier(0.23, 1, 0.32, 1),
    display 220ms allow-discrete;
}

.mobile-nav[data-open] {
  display: flex;
  opacity: 1;
  transform: translateY(0);
}

@starting-style {
  .mobile-nav[data-open] {
    opacity: 0;
    transform: translateY(-8px);
  }
}
```

```tsx
/* target — src/components/Header.tsx */
<nav
  id="mobile-nav"
  aria-label="Primary"
  data-open={menuOpen || undefined}
  inert={!menuOpen || undefined}
  className="mobile-nav flex flex-col gap-1 border-t border-border-opaque px-4 py-3 lg:hidden"
>
  {/* ...unchanged children... */}
</nav>
```

```tsx
/* target — icon crossfade, both paths always rendered, opacity-swapped */
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path
    d="M4 7H20M4 12H20M4 17H20"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={`transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${menuOpen ? "opacity-0" : "opacity-100"}`}
  />
  <path
    d="M6 6L18 18M6 18L18 6"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={`transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${menuOpen ? "opacity-100" : "opacity-0"}`}
  />
</svg>
```

## Repo conventions to follow

- This repo has no `--ease-*`/duration tokens yet and no other `plans/` history to match, so this plan inlines the exact cubic-bezier via Tailwind's arbitrary-value syntax (`ease-[cubic-bezier(0.23,1,0.32,1)]`) rather than inventing a token another, independently-run plan wouldn't know about.
- Plain hand-written CSS already lives directly in `src/index.css` (see the `@media (prefers-reduced-motion: reduce)` block at `src/index.css:125-134` and the `body` rule above it) — add the new `.mobile-nav` rule in that same file, not a new file.
- React 19 (this repo uses `^19.2.8`) supports the native `inert` boolean prop directly — no library needed.

## Steps

1. In `src/index.css`, after the closing brace of the existing `@media (prefers-reduced-motion: reduce)` block (ends at line 134), add the `.mobile-nav` / `.mobile-nav[data-open]` / `@starting-style` CSS block shown in Target above.
2. In `src/components/Header.tsx`, replace the `{menuOpen && (<nav ...>...</nav>)}` block (lines 91-116) with the always-mounted `<nav>` shown in Target — same children, unchanged — adding `data-open={menuOpen || undefined}`, `inert={!menuOpen || undefined}`, and prepending `mobile-nav` to the existing `className` string (keep every existing class: `flex flex-col gap-1 border-t border-border-opaque px-4 py-3 lg:hidden`).
3. In the same file, replace the `{menuOpen ? (...) : (...)}` conditional inside the `<svg>` (lines 71-87) with the two always-rendered `<path>` elements shown in Target, each carrying its own `transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]` and opacity class driven by `menuOpen`.
4. Leave the button's `onClick={() => setMenuOpen((open) => !open)}` (line 69), `aria-expanded`, and `aria-controls` exactly as they are — this plan only changes how the state is *rendered*, not how it's toggled.

## Boundaries

- Do NOT touch the desktop (`lg:flex`) nav at `Header.tsx:37-47`, or the CTA buttons at `Header.tsx:50-61` — those are unaffected by `menuOpen` and out of scope.
- Do NOT change the `NAV_LINKS` data, hrefs, or the `onClick={() => setMenuOpen(false)}` link-close behavior.
- Do NOT add a JS library (Framer Motion, etc.) — this is achievable with plain CSS.
- Do NOT touch `src/index.css:118-134` (the `body` rule and the reduced-motion block) beyond appending the new rule after it — the existing reduced-motion block already collapses this transition to ~0ms sitewide, so no additional reduced-motion CSS is required for this plan.
- If `Header.tsx:91-116` or `71-87` don't match the excerpts above when you open the file (code has drifted since commit `7b5477f`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run lint` (oxlint — expect no new errors) and `npm run build` (expect a clean `tsc -b && vite build`, no type errors from the new `data-open`/`inert` props).
- **Feel check**: run `npm run dev`, open the site at a viewport under 1024px wide (resize the browser or use device toolbar), and:
  - Click the hamburger — the panel should fade + slide down from the header over ~220ms, not pop into place.
  - Click again (now showing the X) — the panel should fade + slide back up and actually be removed from layout afterward (inspect the DOM: `display: none` should be applied once the transition ends, not before).
  - Watch the icon while clicking — the three lines and the X should crossfade into each other, never both fully visible or a hard jump.
  - Tab through the page with the panel closed — focus should skip the (now `inert`) nav links entirely.
  - In DevTools' Animations panel, set playback to 10% and confirm both the panel and the icon move smoothly across the full 220ms/150ms window with no jump-cut partway through.
  - Toggle `prefers-reduced-motion` in the Rendering panel — the existing global rule at `src/index.css:125-134` should already collapse both transitions to near-instant; confirm nothing looks broken (e.g., the panel doesn't get stuck invisible).
- **Done when**: the panel and icon both animate in and out at every viewport under 1024px, `inert` correctly gates keyboard focus, and `npm run build` passes clean.
