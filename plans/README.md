# Animation plans

Generated from the `find-animation-opportunities` sweep (all breakpoints) on commit `7b5477f`, plus a follow-up `improve-animations` audit of the header/hero entrance work (also commit `7b5477f`). Each plan is independently self-contained — none depends on another having run first, except where noted.

| # | Title | Severity | Status |
| --- | --- | --- | --- |
| [001](001-mobile-nav-panel-reveal.md) | Mobile/tablet nav panel reveal + hamburger↔X crossfade | HIGH | **DONE** (implemented directly, see note below) |
| [002](002-hover-background-transitions.md) | Hover-background transitions on nav pills & social icons | MEDIUM | TODO |
| [003](003-hotel-type-toggle-feedback.md) | Hotel Type toggle selection transition + press feedback | MEDIUM | TODO |
| [004](004-market-position-indicator-transition.md) | Market Position scale indicator position transition | MEDIUM | TODO |
| [005](005-comparison-table-row-highlight.md) | Comparison-table active-row highlight transition | LOW | TODO |
| [006](006-play-video-overlay-fade.md) | "Play Video" placeholder overlay fade-in | LOW | TODO |
| [007](007-hero-header-entrance-easing.md) | Replace `ease-in` with strong ease-out on header/hero entrances | HIGH | TODO |
| [008](008-entrance-cta-focus-guard.md) | Guard CTA buttons from keyboard focus while entrance-animating | MEDIUM | TODO |
| [009](009-hero-sequence-curve-consistency.md) | Match hero text and hero image entrance curves | MEDIUM | TODO (conditional on 007) |
| [010](010-reduced-motion-gentler-not-zero.md) | Make sitewide reduced-motion gentler, not a full snap to zero | MEDIUM | TODO (sitewide scope) |
| [011](011-motion-token-consolidation.md) | Promote the hand-typed ease-out curve to a shared token | LOW | TODO |
| [012](012-header-chrome-entrance-cohesion.md) | Reconcile header scroll-transition with entrance motion curve | LOW | TODO |
| [013](013-header-blur-transition-budget.md) | Bring header's transitioned blur radius under the 20px budget | LOW | TODO |
| [014](014-hide-snap-row-scrollbars.md) | Hide the always-visible native scrollbar on the swipe rows (+ keyboard access) | MEDIUM | **DONE** |
| [015](015-how-it-works-fit-four-cards-desktop.md) | "How it works": fit all four cards at desktop so the row doesn't scroll | MEDIUM | TODO |
| [016](016-auto-hiding-scroll-indicator.md) | Auto-hiding scroll indicator for the swipe rows (optional) | LOW | **DONE** |

**Note on 001**: originally written as a plan, then implemented directly in this session (not via a separate executor dispatch) at the user's explicit request to "implement the missed opportunities" from the header/hero audit. A second missed opportunity from that same audit — a subtle accompanying transform on the hero images — was implemented alongside it without a numbered plan, since it wasn't corrective (no finding to fix) and was small enough to execute directly.

## Recommended execution order

Batch 1 (find-animation-opportunities sweep):
1. **001** — DONE.
2. **003** then **005** — same user action (the Hotel Type toggle click); doing them together makes the click's two visible effects (chip color, table row wash) consistent at a glance, though either can run alone.
3. **004** — same calculator, independent element (the ADR scale indicator).
4. **002** — desktop-only hover polish, no dependency on the calculator plans.
5. **006** — lowest leverage (a placeholder overlay in a not-yet-wired-up video feature); do last or skip if time-constrained.

Batch 2 (header/hero improve-animations audit):
1. **007** — highest leverage of this batch: one-token curve swap, resolves the AUDIT.md `ease-in` finding outright and pre-resolves **009**.
2. **009** — check after 007: if 007 landed, this is already done (verify, don't re-execute). Only act on it if `ease-in` was deliberately kept.
3. **008** — CTA focus guard; independent of 007/009, addresses a real (if narrow) accessibility gap.
4. **012** then **013** — both touch the same `Header.tsx` className string (the outer `<header>`'s scroll-driven transition); doing them together avoids two separate edits to the same line.
5. **011** — token consolidation; do this *after* 007 lands (or explicitly skip 007) so it knows which elements to sweep.
6. **010** — biggest blast radius (sitewide `index.css` rule, not local to header/hero); treat as its own standalone decision, not a quick batch item.

Batch 3 (scrollbar audit of the full-bleed swipe rows, commit `f6cc0b7` + uncommitted full-bleed change):
1. **014** first — removes the permanent scrollbar everywhere and adds keyboard access.
2. **015** — independent; removes the pointless 63px scroll on "How it works" at desktop. Pairs naturally with 014 (the desktop scrollbar disappears either way, but 015 also removes the dead scroll).
3. **016** — optional, only after 014; do it if losing the scrollbar cue matters for mouse users at tablet widths.

## Dependencies

Batch 1: None are hard dependencies. The only soft relationship is **003 ↔ 005**: both animate the fallout of one click (selecting a Hotel Type) and use the same 160ms / `cubic-bezier(0.23, 1, 0.32, 1)` timing so the two effects feel like one system if both land, but neither plan requires the other to be present first.

Batch 2: **009** is conditional on **007** (see 009's own Problem section — it's a no-op if 007 already ran). **011** should run after **007** for a complete token sweep, though it degrades gracefully (it only touches curve instances that already exist) if run first or if 007 is skipped entirely. **012** and **013** both edit the same `Header.tsx` className string but neither depends on the other's content — just sequence them to avoid a merge conflict with yourself.

## Shared conventions across all plans

None of these tokens exist in the repo yet, so every plan inlines the raw value via Tailwind's arbitrary-value syntax rather than assuming a shared token another plan might add — **except plan 011**, which is specifically the plan that introduces the token (named `--ease-entrance`, generating a Tailwind `ease-entrance` utility) once enough call sites exist to justify it. Until 011 lands, keep inlining:

- Standard UI curve: `cubic-bezier(0.23, 1, 0.32, 1)` — used throughout batch 1 and by plan 007 in batch 2 (there was no on-screen "moving/morphing" case in either batch that would call for the `cubic-bezier(0.77, 0, 0.175, 1)` in/out curve).
- Reduced motion: the repo has a blanket `@media (prefers-reduced-motion: reduce)` rule at `src/index.css:125-134` that collapses all `transition`/`animation` durations to `0.01ms`. This covers every plan in batch 1 as-is (none of them add their own reduced-motion CSS, per Hard Rule 5 — don't relitigate a settled, existing sitewide decision). Batch 2's audit revisited this same rule on its own merits and produced plan **010**, which proposes changing it — if 010 lands, its "gentler, not zero" behavior then applies retroactively to every batch-1 plan too, no changes needed on their end.
