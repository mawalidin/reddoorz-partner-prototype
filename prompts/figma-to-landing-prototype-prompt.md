# Claude Code Prompt — Build Landing Page Prototype from Figma

## Objective

I have an existing landing-page design in Figma.

I want you to implement a **working front-end prototype** from that Figma design using **Claude Code + Figma MCP + the available Figma skills**.

The goal is:

> High-fidelity implementation of the Figma design while keeping the code responsive, semantic, maintainable, and reusable.

Do not treat this as a screenshot recreation task.

---

## Inputs

### Figma design

Replace this with the actual Figma URL: https://www.figma.com/design/6YVyGT2NsAAQ7m85QIjwdE/New-Partner-Website?node-id=3-14238&t=DWzTworDaPBwNh7l-11

If possible, use a direct link to the exact landing-page frame/selection.

### Project instructions

Before doing anything else, read:

```text
CLAUDE.md
design.md
```

These files define the implementation rules and design source of truth.

---

# Phase 1 — Understand the existing codebase

Before writing code, inspect the repository.

Determine:

- framework
- build tool
- routing
- existing page structure
- styling approach
- component architecture
- design-system components
- typography
- CSS variables/tokens
- icon library
- asset structure
- existing responsive conventions
- package dependencies

Reuse the existing stack.

Do not introduce a new framework or styling system unless the repository has no suitable implementation foundation.

---

# Phase 2 — Inspect the Figma design

Use the Figma MCP.

Use the appropriate Figma design-to-code/implementation skill available in this Claude Code environment before retrieving detailed design context when required by the installed skills.

Inspect the Figma design structurally.

Do not implement from visual memory.

Analyze:

### Page
- page/frame hierarchy
- section order
- section heights
- max-widths
- full-width backgrounds
- container behavior

### Layout
- Auto Layout
- padding
- gaps
- alignment
- constraints
- fixed/fluid dimensions
- overlapping elements

### Typography
- font family
- font weight
- font size
- line height
- letter spacing
- heading hierarchy
- text widths

### Visual system
- colors
- borders
- radii
- shadows
- backgrounds
- gradients
- overlays

### Components
Identify reusable:
- navigation
- buttons
- cards
- badges
- tabs
- forms
- accordions
- testimonials
- CTAs
- footer elements

### Assets
Identify and use:
- logo
- images
- illustrations
- icons
- decorative assets

Prefer actual Figma/repository assets over placeholders.

---

# Phase 3 — Create the implementation plan

Before substantial coding, summarize:

```text
Figma sections:
1.
2.
3.

Component structure:
- ...
- ...

Design tokens:
- ...

Assets:
- ...

Responsive behavior:
- ...

Interactions:
- ...

Assumptions:
- ...
```

Do not ask me to approve this plan unless there is a blocking ambiguity.

Proceed automatically when the design is sufficiently clear.

---

# Phase 4 — Implement the design

Build the page section by section.

Recommended order:

1. global styles/tokens
2. page container
3. header
4. hero
5. primary sections
6. repeated components
7. CTA
8. footer
9. interactions
10. responsive behavior

Use semantic HTML.

Example structure:

```tsx
<header />
<main>
  <section />
  <section />
  <section />
</main>
<footer />
```

Do not build the entire page as one giant component.

---

# Phase 5 — Componentization

Create components based on meaningful reuse.

Good:

```text
LandingPage
├── Header
├── Hero
├── SectionHeader
├── FeatureGrid
├── FeatureCard
├── CTASection
└── Footer
```

Avoid unnecessary abstraction.

Do not create components for every `<div>`.

---

# Phase 6 — Responsive behavior

The Figma desktop design is the primary reference.

If Figma includes mobile/tablet designs:
- follow them closely.

If only desktop exists:
- infer responsive behavior from the layout
- preserve the hierarchy
- avoid redesigning the page
- document important assumptions

Check at minimum:

```text
Desktop
1440px

Tablet
1024px / 768px

Mobile
390px / 375px
```

Adjust:
- columns
- stacking
- typography
- spacing
- image crops
- navigation
- button layout
- content alignment

Do not merely scale the desktop layout down.

---

# Phase 7 — Interactions

Implement interactions visible or implied by Figma.

Examples:
- mobile navigation
- hover states
- focus states
- dropdowns
- tabs
- accordions
- carousels
- CTA states
- sticky navigation
- simple animations

Do not invent elaborate interactions that aren't supported by the design.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

---

# Phase 8 — Visual QA

This phase is mandatory.

Start the development server and inspect the rendered page.

Compare implementation against Figma.

Fix discrepancies in this order:

### 1. Structure
- missing sections
- incorrect ordering
- wrong component structure

### 2. Geometry
- widths
- heights
- spacing
- alignment
- positioning

### 3. Typography
- font
- weight
- size
- line-height
- wrapping

### 4. Visual styling
- colors
- borders
- radius
- shadows
- images

### 5. Responsive behavior
- mobile
- tablet
- desktop

### 6. Interaction
- hover
- focus
- navigation
- animation

Repeat the visual QA loop until the major discrepancies are resolved.

Do not stop after the first successful render.

---

# Phase 9 — Accessibility and SEO

Verify:

- semantic HTML
- one primary H1
- logical H2/H3 hierarchy
- keyboard navigation
- visible focus states
- meaningful alt text
- accessible buttons and links
- form labels
- sufficient contrast
- reduced motion

For a public landing page also implement:
- page title
- meta description
- Open Graph metadata if appropriate
- semantic sections

---

# Phase 10 — Cleanup

Before finishing:

- remove temporary debug code
- remove unused imports
- remove unnecessary dependencies
- check console errors
- check broken images
- check build
- check responsive overflow
- check mobile horizontal scrolling
- check accessibility basics

Do not refactor unrelated parts of the repository.

---

# Important Figma-to-Code Rules

## Do

- use Figma MCP
- use Figma skills
- inspect design context
- reuse components
- reuse variables/tokens
- use actual assets
- preserve layout relationships
- implement responsive behavior
- validate visually

## Do not

- guess major design values
- recreate screenshots with absolute coordinates
- flatten the page into one image
- use arbitrary placeholder imagery
- replace real icons with emoji
- rewrite copy unnecessarily
- create a completely new visual design
- declare success without visual validation

---

# If Figma and Existing Code Conflict

Use this priority:

```text
1. Figma design intent
2. Existing project's design-system architecture
3. design.md
4. Existing implementation conventions
5. Reasonable assumptions
```

Do not rewrite the existing application architecture simply to match Figma.

Adapt the design to the existing codebase where appropriate.

---

# Assumption Handling

When something cannot be determined from Figma:

1. Make the smallest reasonable assumption.
2. Implement it.
3. Record it in:

```text
IMPLEMENTATION_NOTES.md
```

Use this format:

```md
## Assumption

**Area:** Mobile hero layout

**Decision:** Image moves below hero copy below 768px.

**Reason:** Figma only provides desktop; this preserves the intended content hierarchy.

**Confidence:** Medium
```

---

# Final Response

After implementation, provide:

## Summary

What was implemented.

## Components

List major components created/reused.

## Responsive

Describe desktop/tablet/mobile behavior.

## Interactions

List implemented interactions.

## Visual QA

State exactly what was checked.

## Known Deviations

List anything that could not be matched exactly.

## Assumptions

List important assumptions.

## Files Changed

List files modified or created.

Do not claim that something was validated if it was not actually checked.
