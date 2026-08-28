# Implementation Notes

Assumptions and deviations made while implementing the landing page from Figma
(`New Partner Website`, node `3:14238`). Figma provided a desktop (1440px) frame
and a dedicated tablet (768px) frame (node `27:111915`); no mobile-specific frame
was provided, so behavior below 768px is inferred rather than sourced directly
from the design.

Tablet-specific findings applied throughout (`md:` breakpoint, 768px):
- Section side padding is 32px at tablet (vs 16px mobile / 80px desktop) —
  previously the codebase jumped straight from 16px to 80px with no tablet tier.
- Metrics keeps all 5 stat cards in a single row at tablet (not wrapped 3+2).
- Storytelling's quotes stay staggered (not stacked) and the "About" block goes
  side-by-side at tablet, both a breakpoint earlier than desktop.
- Solutions' "+ More" tile is hidden at tablet (8 features fill 2 columns evenly).
- Brand cards and Partner Story reviews become a horizontal-scroll row at
  tablet instead of a wrapping grid (Figma shows a cut-off card peeking at the
  edge, confirming scroll, not wrap).
- Awards logos scroll horizontally starting at the `sm` tier, matching the same
  cut-off-card evidence.
- Value section switches to a 2-column layout (heading/CTAs left, cards right)
  only at tablet — both mobile and desktop stack it in a single column.

## Assumption

**Area:** Header mobile navigation

**Decision:** Nav links and CTAs collapse into a hamburger menu below the `lg` breakpoint.

**Reason:** Figma only shows the desktop topbar; a hamburger pattern is the standard, least-disruptive way to preserve all nav items on narrow viewports.

**Confidence:** Medium

---

## Assumption

**Area:** Storytelling section — staggered quotes

**Decision:** The three handwritten quotes use absolute, staggered positioning (mirroring Figma's desktop layout) only at the `lg` breakpoint. Below that they stack in a simple centered column.

**Reason:** The desktop layout relies on fixed pixel offsets across a 1440px canvas; preserving literal positions at narrow widths would overlap the text. Stacking preserves reading order and content.

**Confidence:** Medium

---

## Assumption

**Area:** Hero decorative composite (phone mockup, revenue badges, icon bubbles)

**Decision:** Originally rebuilt from ~15 separately exported assets, absolutely positioned via percentages inside an `aspect-ratio` box (with the tiny dashed connector lines between icon bubbles omitted). Replaced with a single flattened image (`hero-image-01.png`, provided directly) rendered with `object-contain`.

**Reason:** The single-image export is pixel-accurate to Figma (including the connector lines the manual rebuild dropped), immune to the aspect-ratio drift the percentage-based rebuild suffered under the `56dvh` height cap on short viewports, and is a fraction of the combined weight of the ~15 separate assets it replaced.

**Confidence:** High

---

## Assumption

**Area:** Revenue calculator — occupancy formula

**Decision:** Occupancy is looked up directly from a per-hotel-type benchmark table (Basic 55.9%, Plus 61.5%, Premium 72.0%) rather than being derived from the user's room rate.

**Reason:** Figma's own worked example (Premium, Rp 300,000 = exactly the recommended rate) shows 71.0% occupancy, one point below the Premium benchmark of 72.0% used elsewhere on the same screen (the comparison table). The discrepancy isn't explained by any visible formula (likely a city-specific adjustment not present in the design), so the calculator uses the clean, explainable benchmark value. Monthly/Yearly ORN and NBV *are* formulaically derived (`ORN = rooms × days × occupancy%`; `NBV range = ORN × rate × [0.85, 1.15]`) and reproduce Figma's example numbers exactly.

**Confidence:** Medium

---

## Assumption

**Area:** Revenue calculator — City field

**Decision:** Added a small static list of Indonesian cities (Jakarta, Bandung, Surabaya, Bali, Yogyakarta) to the City dropdown. The selected city does not affect the calculation.

**Reason:** Figma shows only "Jakarta" as the field's example value; no other cities or city-based logic were specified.

**Confidence:** Low

---

## Assumption

**Area:** Partner Testimony video banner

**Decision:** Implemented as a single static slide with a "Play Video" button that shows a placeholder message ("Video playback isn't wired up in this prototype") instead of an actual video, and without the carousel/chevron navigation shown in Figma.

**Reason:** Figma's carousel contains three identical copies of the same slide (same headline, same image) and no real video asset is available — there's nothing distinct to navigate between, and no backend/video file to play.

**Confidence:** Medium

---

## Assumption

**Area:** Footer decorative illustration

**Decision:** The city-skyline/open-door illustration is a single flattened PNG (exported via Figma's asset API) rather than hundreds of individual SVG vector nodes reconstructed in code.

**Reason:** The source Figma layer is a vector illustration made of 400+ nested groups/paths — reconstructing it node-by-node isn't practical or maintainable. Figma's own design-to-code tooling flagged this subtree as "too large for code generation" and recommended exporting it as an asset instead.

**Confidence:** High

---

## Assumption

**Area:** Image asset optimization

**Decision:** Images are used at their original exported resolution/format (PNG) without compression or WebP conversion. Several are large (the biggest, a Solutions thumbnail, is ~7.9MB).

**Reason:** No image-optimization tooling (sharp/imagemin/squoosh) was available in this environment to add without a larger dependency footprint. This is flagged as a follow-up: before any real deployment, these should be compressed and/or converted to WebP/AVIF with responsive `srcset`s.

**Confidence:** High (this is a known gap, not a design judgment call)

---

## Assumption

**Area:** Hidden "Trust Platform Section" layer

**Decision:** Excluded from the implementation.

**Reason:** This Figma layer (`3:14272`, between Metrics and Storytelling) is marked `hidden` in the source file, indicating it's not part of the current published design.

**Confidence:** High
