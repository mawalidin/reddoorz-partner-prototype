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

## How It Works & Value Section — all three breakpoints now verified

Desktop (`3:14408`/`3:14588`), tablet (`27:112115`/`27:112361`), and mobile
(`3:16065`/`3:16308`) frames have all been inspected directly for these two
sections. No remaining assumptions for either section — every tier is sourced
from Figma, not inferred.

Notable findings that shaped the implementation:
- How It Works step cards needed no mobile-specific overrides at all — the
  codebase's pre-existing base styles (gap/padding/sizing) already matched the
  mobile frame exactly. Only tablet needed new `md:` values: fixed `172px`
  card height, `24px` padding, and a flattened `16px` gap between indicator/
  title/body (vs. desktop's `24px`/`8px` split grouping) — reverted at `lg`
  back to the desktop values.
- Value section cards: mobile and tablet share an identical icon treatment
  (44px chip, `rounded-lg`, 20px glyph) that's distinct from desktop's larger
  64px/`rounded-md` chip — so the icon only needs a base + `lg:` override, no
  separate `md:` tier. Card *direction* does change at `md:` (icon-left/
  text-right row instead of mobile's stacked column), and the card-list gap
  is smaller on mobile (`8px`) than tablet/desktop (`16px`).

---

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

---

## Register Property screen (`/register`)

Figma: desktop `262:70364`, tablet `300:146289`, mobile `290:106672` — all three
inspected directly; layout values are sourced from the frames.

- **Routing:** no router dependency was added; `src/router.ts` is a small History-API
  helper (`/` and `/register`). "Get Started" (header) and every "Become A Partner"
  button navigate to `/register`. Hosting must serve `index.html` for `/register`.
- **Section anchors on this screen:** header/footer `#…` links navigate back to the
  home page and land on that section (handled once in `App.tsx`).
- **Search field:** Figma draws it as a button ("Search Button"). Implemented as a
  styled `type="search"` input so it is typable; there is no results/next-step design,
  so submitting does nothing yet.
- **Topbar:** `Header variant="register"` — desktop shows logo + EN only (nav/CTAs are
  hidden in the frame); tablet/mobile show the hamburger with nav links and language
  (the CTAs are omitted since the user is already registering). Menu content on this
  screen is inferred.
- **Page background:** `#faf9f6` (matches the home page and the tablet/mobile frames).
- **Hero image:** `src/assets/register/hero.jpg` (exported from Figma, 1440×960).

### Address modal (desktop only so far)

Figma desktop frames: Default `290:83923`, Search Filled `290:88440`, Search Empty
(not found) `290:92977`, Property Address `304:183265`. Tablet/mobile modal frames
exist but are not implemented yet; the modal is merely fluid below 800px.

- Search button on `/register` opens the modal (`src/sections/register/`).
  Step 1 "Enter your address" → step 2 "Property Address"; Back keeps the typed query.
- **Search:** starts at 3+ characters (trimmed), 250ms debounce, against local mock
  data (`src/data/mockAddresses.ts`, every keyword must match). Below 3 characters the
  default "Use my current location" row shows; while searching it is hidden, as in the
  Figma Search Filled/Empty frames.
- **Use my current location:** real browser Geolocation; the nearest *mock* address is
  selected (stand-in for reverse geocoding). If permission is denied/unavailable an
  inline error is shown instead of silently picking an address (not in Figma).
- Mock "City / Regency" values use real cities (e.g. Jakarta Pusat) rather than Figma's
  placeholder "Kecamatan Tanah Abang".
- Property Address "Next" has no design for a following step, so it is currently a
  no-op. Country has a single option (Indonesia).
- Location text uses Manrope per Figma → added `@fontsource/manrope`.

### Address dialog — tablet & mobile

Tablet frames (`300:152103`, `303:150191`, `304:178328`) and mobile frames
(`290:126454`, `290:130957`, `290:135529`) are now implemented. Base classes are the
mobile values, `md:` = tablet, `lg:` = desktop.

- **Mobile = bottom sheet** (`< 768px`): anchored to the bottom, 20px top radius, 34px
  bottom padding, content-height up to `100dvh - 68px` (Figma: 776px of 844px). Slides
  up on open. Cross icon top-right replaces the modal close button; the heading row's
  "Enter Your Address" text is `opacity:0` in Figma, so it is omitted.
- **Swipe down to dismiss** (not in Figma, expected bottom-sheet behavior): drag the
  top strip down >100px; backdrop tap and Esc also close.
- Mobile differences: 16/24 titles, Building Name / Unit fields stack in one column,
  16px field gap, 8px result-row padding.
- Result rows wrap onto several lines in Figma because of long lorem ipsum; sheet
  height is content-driven, so with the short mock addresses it is shorter than the
  670px shown in the Search Filled frame.

### Property Details page (`/register/details`)

Figma: desktop `277:78417`, tablet `303:159520`, mobile `290:116872`. Reached from
"Next" in the Property Address modal/sheet.

- The confirmed (editable) address is kept in `src/registration.ts` (memory +
  sessionStorage) and rendered under "Property Location" instead of Figma's lorem
  ipsum. Visiting the page without an address redirects back to `/register`.
- Native form validation covers the required fields (Owner Full Name, Mobile Number,
  Property Type, Number of Rooms, privacy consent). A valid submit goes to the success page.
- Radio and checkbox are native inputs styled to match; Figma only shows the
  unchecked state, so the checked state (red) is inferred.
- "Privacy Policy" links to a placeholder `/privacy-policy` (no such page exists).
- Copy kept exactly as in Figma, including "Apartement".
- Property Location text is 14px/20px at every breakpoint (mobile was updated in Figma).
- The house illustration is a single image; the Figma layer is named "2-3 Hotel", so
  it may be meant to change per property type — no variants were provided.

### Motion pass (register flow)

- **Dialog exit:** `Modal` keeps the dialog mounted with `data-closing` and calls
  `onClose` after 180ms (modal) / 280ms (sheet; `translateY(100%)`, drawer curve
  `cubic-bezier(0.32,0.72,0,1)`). Applies to the cross, Esc, backdrop and drag.
- **Sheet drag:** dismiss on >100px *or* a flick (>0.11px/ms); the exit/snap-back
  transition starts from the current drag position.
- **Step swap:** search ⇄ Property Address reuses `content-swap` at 220ms (it rises
  12px, slightly more than the 8px first proposed).
- **Press feedback:** Button, BackLink and the page search trigger scale to 0.97/0.98
  on `:active` (150ms). Tailwind v4 scale utilities use the `scale` property, so the
  transition lists name `scale`, not `transform`.
- **Dynamic regions:** results/error fade in (150ms); empty state pops in (200ms).
- **Radio/checkbox:** radio border and checkbox tick/fill transition (120–150ms).
- Reduced motion: the global rule collapses durations; the exit timer is 0 then.

### Registration success page (`/register/success`)

Figma: desktop `290:97547`, tablet `303:164052`, mobile `296:114756`.

- Submit Registration (after native validation) sets a "submitted" flag
  (`src/registration.ts`) and navigates here; visiting directly without submitting
  redirects to `/register`. **Nothing is actually sent anywhere** (prototype).
- "Back to Home" → `/`. "Register A New Property" clears the saved address/flag and
  → `/register`.
- The contact number (+62 858-8088-1103) is Figma's placeholder, linked as `tel:`.
- Illustration: Figma node `306:197624` exported as a 750px PNG (3×). The SVG export
  of that node includes the whole surrounding page, so PNG was used instead; replace
  with a clean SVG if one is exported.
- Tablet/mobile text sizes (24/32 title, 14/20 body) are inferred from the frame
  geometry, not read from the Figma code.
- New `subtle` Button variant (grey pill) for "Back to Home".

- **Property type illustration:** selecting a Property Type swaps the grey panel image
  to the matching file in `src/assets/register/property-typeimage/` (fade-in 150ms).
  Mapping: 1-2 Star Hotel → `2-3 Hotel.png` (assumed from the filename), 3 Star →
  `3 Hotel.png`, 4-5 Star → `4-5 Hotel.png`, Villa, Homestay, Apartement →
  `Apartment.png`, Guest House → `Guesthouse.png`. "Other" has no image and keeps the
  default house (also shown before any selection).
