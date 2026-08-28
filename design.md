# Design Specification — Figma → Landing Page Prototype

## 1. Purpose

This document is the design source of truth for implementing a landing page prototype from a Figma design using Claude Code and the Figma MCP.

The goal is **high visual fidelity + maintainable front-end structure**, not a screenshot recreation.

The implementation should preserve:
- visual hierarchy
- layout relationships
- typography
- spacing rhythm
- colors
- components
- responsive behavior
- imagery and assets
- interaction intent
- accessibility
- reusable patterns

Do not invent a new visual direction when the Figma design already provides the answer.

---

## 2. Source of Truth Hierarchy

When resolving ambiguity, use this priority:

1. Figma design structure and design-system information retrieved through Figma MCP
2. Existing repository components, tokens, and conventions
3. This `design.md`
4. Existing product/brand conventions
5. Reasonable implementation assumptions

If a decision cannot be determined confidently:
- do not silently invent a major design decision
- choose the least disruptive implementation
- document the assumption in `IMPLEMENTATION_NOTES.md`
- continue unless the ambiguity blocks implementation

---

## 3. Figma Input

### Figma URL

Figma URL: https://www.figma.com/design/6YVyGT2NsAAQ7m85QIjwdE/New-Partner-Website?node-id=3-14238&t=DWzTworDaPBwNh7l-11

### Target selection

Prefer a direct Figma selection link for the exact landing-page frame.

If the URL points to a file rather than a specific frame:
- inspect the file structure
- identify the intended landing-page frame
- inspect relevant parent and child nodes
- inspect components, variables, styles, and assets used by the target frame

Do not implement based only on a screenshot.

---

## 4. Required Figma Analysis

Before writing substantial UI code, inspect the Figma design through the Figma MCP.

Analyze:

### Page structure
- page/frame hierarchy
- section order
- section boundaries
- max-width containers
- full-bleed sections
- content columns
- alignment rules
- vertical spacing

### Layout
- Auto Layout direction
- gaps
- padding
- alignment
- fixed vs fluid dimensions
- constraints
- responsive intent
- absolute-positioned elements
- overlapping elements
- sticky/fixed elements

### Typography
Record:
- font family
- font weight
- font size
- line height
- letter spacing
- text casing
- text hierarchy
- paragraph width
- heading width constraints

Map the typography into semantic HTML:
- one primary page `<h1>`
- `<h2>` for major sections
- `<h3>` for nested content where appropriate
- paragraphs for body copy
- buttons/links for actions

Do not use heading tags purely for visual styling.

### Colors
Identify:
- primary brand colors
- secondary/accent colors
- surface colors
- text colors
- border colors
- overlay/scrim colors
- hover/active states if present

Prefer existing design tokens or CSS variables over repeated hard-coded values.

### Components
Identify:
- navigation
- buttons
- cards
- badges
- tabs
- forms
- accordions
- carousels
- testimonials
- footers
- reusable content blocks
- responsive variants

Reuse existing project components where possible.

### Imagery
Identify:
- hero images
- background images
- illustrations
- icons
- logos
- decorative graphics
- image crops
- aspect ratios

Use the actual Figma-provided assets or repository assets when available.

Do not replace real assets with generic placeholders unless the asset is unavailable.

---

## 5. Landing Page Information Architecture

Treat the page as a semantic document rather than a collection of screenshots.

Typical structure:

```text
<header>
  Navigation
</header>

<main>
  <section id="hero">
  </section>

  <section>
    ...
  </section>

  <section>
    ...
  </section>

  <section>
    ...
  </section>
</main>

<footer>
</footer>
```

The exact section structure must come from Figma.

Each section should have:
- semantic purpose
- clear component boundary
- responsive behavior
- reusable internal components where appropriate

Avoid creating one giant `LandingPage.tsx` file.

---

## 6. Component Strategy

Use a hierarchy similar to:

```text
LandingPage
├── Header
├── HeroSection
│   ├── HeroContent
│   └── HeroMedia
├── Section
│   ├── SectionHeader
│   └── SectionContent
├── FeatureGrid
│   └── FeatureCard
├── CTASection
└── Footer
```

The actual component tree must reflect the Figma design.

### Component extraction rules

Create a reusable component when:
- the same UI pattern appears more than once
- a pattern has multiple variants
- a component has meaningful internal behavior
- it is likely to be reused elsewhere

Do not over-componentize:
- simple one-off wrappers
- purely structural divs
- tiny fragments with no meaningful reuse

---

## 7. Responsive Design

Do not treat mobile as a scaled-down desktop.

For every section determine:

### Desktop
- container width
- column count
- horizontal alignment
- image position
- navigation behavior

### Tablet
- column changes
- spacing changes
- image behavior
- typography adjustments

### Mobile
- stacking order
- content priority
- navigation transformation
- button width
- image cropping
- section spacing
- horizontal padding
- text alignment

If Figma only contains desktop:
- infer responsive behavior from layout relationships
- preserve the design intent
- avoid arbitrary redesign
- document important assumptions

Recommended approach:

```text
Desktop-first reference
        ↓
Identify constraints
        ↓
Translate to fluid CSS
        ↓
Define breakpoint-specific changes
        ↓
Validate at mobile/tablet/desktop
```

---

## 8. Spacing System

Prefer a consistent spacing scale.

First reuse project/Figma spacing variables.

If no system exists, infer a reasonable scale from repeated Figma measurements rather than creating dozens of unique values.

Avoid:
```css
margin-top: 37px;
margin-bottom: 43px;
padding-left: 29px;
```

when the design clearly follows a spacing rhythm.

Prefer:
```css
gap: var(--space-8);
padding-block: var(--section-space);
```

Exact values may still be used when required for fidelity.

---

## 9. Tokens

Create or reuse CSS variables for:

```css
:root {
  --color-primary: ...;
  --color-surface: ...;
  --color-text: ...;
  --color-text-muted: ...;
  --color-border: ...;

  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;

  --shadow-sm: ...;
  --shadow-md: ...;

  --container-max: ...;
}
```

Do not create tokens merely for every individual Figma value.

Tokenize repeated design decisions.

---

## 10. Interaction Requirements

Inspect Figma for signs of interaction:
- hover
- active
- focus
- dropdown
- accordion
- carousel
- modal
- navigation menu
- scroll behavior
- sticky header
- animation
- video
- tabs

For a prototype:
- implement meaningful interactions
- use realistic state changes
- do not create fake complexity
- do not build backend functionality unless explicitly requested

Buttons should behave like buttons.
Links should behave like links.
Forms should provide basic interaction feedback.

---

## 11. Animation

If animation is visible or clearly implied by Figma:
- reproduce the intent
- keep motion subtle and purposeful
- use CSS transitions or an existing animation library
- respect `prefers-reduced-motion`

Avoid adding animation that does not exist in the design merely to make the prototype "feel better."

---

## 12. Accessibility

Minimum requirements:

- semantic HTML
- keyboard-accessible interactive elements
- visible focus states
- appropriate button/link semantics
- meaningful alt text
- decorative images marked appropriately
- sufficient color contrast
- logical heading hierarchy
- form labels where applicable
- reduced-motion support

Do not sacrifice accessibility for pixel matching.

---

## 13. Image and Asset Rules

Prefer this order:

1. Existing repository assets
2. Figma MCP-provided assets
3. Existing brand asset libraries
4. Clearly marked temporary placeholders

Do not:
- use random stock images
- hotlink unreliable assets
- recreate logos with text
- use emoji as icon replacements
- embed huge base64 assets unnecessarily

Optimize image dimensions and loading behavior where appropriate.

---

## 14. SEO / Content Semantics

For a landing page:

- exactly one primary `<h1>` unless there is a strong technical reason otherwise
- section headings should follow hierarchy
- meaningful page `<title>`
- meta description
- descriptive link text
- image alt text
- semantic sections
- Open Graph metadata if the project supports it

Do not change marketing copy unless asked.

If Figma copy appears truncated or unclear, preserve the intended content and document the issue.

---

## 15. Prototype Scope

The prototype should prioritize:

### P0 — Must match
- overall layout
- hero
- typography
- colors
- spacing
- imagery
- navigation
- primary CTAs
- section structure

### P1 — Should match
- cards
- secondary components
- responsive behavior
- hover/focus states
- animations
- footer

### P2 — Nice to have
- advanced transitions
- non-critical micro-interactions
- deep form validation
- backend integration

Do not spend significant effort on P2 while P0 is visually inaccurate.

---

## 16. Visual Validation

After implementation:

1. Start the development server.
2. Render the page at the target viewport.
3. Compare the implementation against the Figma design.
4. Identify differences.
5. Fix the largest visual discrepancies first.
6. Repeat.

Compare:
- section height
- container width
- alignment
- typography
- image crop
- spacing
- button dimensions
- border radius
- colors
- responsive behavior

Use a visual-diff mindset rather than assuming the first implementation is correct.

---

## 17. Validation Order

Use this order:

### Pass 1 — Structure
- sections exist
- content exists
- components are correct

### Pass 2 — Geometry
- widths
- heights
- spacing
- alignment
- positioning

### Pass 3 — Typography
- font
- weight
- size
- line height
- wrapping

### Pass 4 — Visuals
- colors
- images
- borders
- shadows
- radius

### Pass 5 — Interaction
- navigation
- buttons
- states
- animation

### Pass 6 — Responsive
- desktop
- tablet
- mobile

### Pass 7 — Accessibility / SEO
- semantics
- keyboard
- contrast
- metadata
- alt text

---

## 18. Implementation Constraints

Do not:
- replace the existing framework without a reason
- introduce a new component library without approval
- rewrite unrelated application code
- change project architecture unnecessarily
- create duplicated components
- hard-code screenshot coordinates
- build the page as one giant component
- use canvas/SVG as a screenshot substitute for normal UI
- ignore existing design-system components

Do:
- inspect the existing codebase first
- reuse existing patterns
- keep the implementation maintainable
- use CSS/layout primitives for normal UI
- preserve Figma intent
- keep changes scoped to the landing page

---

## 19. Assumptions Log

When implementation requires an assumption, record it in:

`IMPLEMENTATION_NOTES.md`

Use:

```md
## Assumption

**Area:** Hero responsive behavior

**Figma evidence:** Desktop design only.

**Decision:** Stack hero content above image below 768px.

**Reason:** Preserves content hierarchy and avoids excessive horizontal compression.

**Confidence:** Medium
```

---

## 20. Definition of Done

The landing page is complete when:

- [ ] Figma design was inspected through Figma MCP
- [ ] Existing project structure was inspected
- [ ] Existing components/tokens were reused where appropriate
- [ ] Major sections match Figma
- [ ] Typography is close to Figma
- [ ] Assets match the intended design
- [ ] Responsive behavior works
- [ ] Primary interactions work
- [ ] No obvious console errors
- [ ] No broken images
- [ ] Semantic HTML is used
- [ ] Basic accessibility requirements are met
- [ ] SEO metadata is implemented where appropriate
- [ ] Visual validation was performed at desktop and mobile
- [ ] Important deviations/assumptions are documented
