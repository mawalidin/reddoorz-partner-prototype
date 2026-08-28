# Claude Code Project Instructions

## Figma → Landing Page Prototype

You are implementing a landing page prototype from a Figma design.

The primary objective is:

> Translate the Figma design into a maintainable, responsive, interactive front-end prototype with high visual fidelity.

Read `design.md` before implementation.

---

## Required Workflow

### Phase 0 — Inspect the project

Before changing code:

1. Inspect the repository structure.
2. Identify the framework and build tool.
3. Identify the entry point.
4. Inspect package.json and existing dependencies.
5. Find existing design-system components.
6. Find existing CSS, tokens, fonts, icons, and assets.
7. Determine whether Tailwind, CSS Modules, styled-components, or another styling system is already used.
8. Do not introduce a competing styling system unless necessary.

Do not immediately start coding.

---

### Phase 1 — Inspect Figma

Use the Figma MCP and its relevant Figma skill(s).

The Figma design is the primary visual reference.

Before implementation, inspect:
- target frame
- child layers
- components
- variables
- typography
- spacing
- colors
- assets
- layout constraints
- responsive variants if available
- interaction/state information

Do not rely only on screenshots.

If the target is a Figma URL, identify the exact relevant selection/frame.

---

### Phase 2 — Create an implementation plan

Before writing substantial UI code, produce a concise plan containing:

1. Figma sections discovered
2. proposed React/component structure
3. tokens to reuse/create
4. assets required
5. responsive strategy
6. interactions
7. uncertainties/assumptions

If the plan reveals a blocking ambiguity, ask one focused question.

Otherwise proceed without asking for approval.

---

### Phase 3 — Implement foundations first

Set up or reuse:

- fonts
- colors
- spacing
- container
- typography
- radius
- shadows
- breakpoints
- shared components

Prefer existing project tokens.

Do not create a token for every single Figma value.

---

### Phase 4 — Implement section by section

Implement in this order:

1. page shell
2. header/navigation
3. hero
4. primary landing sections
5. repeated components
6. CTA
7. footer
8. interactions
9. responsive behavior

Keep components maintainable.

Avoid a monolithic landing-page component.

---

### Phase 5 — Responsive implementation

Do not simply shrink desktop.

For every section determine:
- what stacks
- what remains horizontal
- what changes alignment
- what disappears
- what becomes scrollable
- what changes image crop
- what changes typography
- what changes spacing

Use the Figma design and layout relationships as evidence.

If mobile designs are unavailable, make conservative responsive decisions and document them.

---

### Phase 6 — Visual validation

After the first implementation:

1. Run the app.
2. Inspect the actual rendered page.
3. Compare against Figma.
4. Fix visual mismatches.
5. Repeat.

Prioritize:
1. structure
2. geometry
3. typography
4. imagery
5. colors
6. interactions
7. responsive behavior

Do not declare completion after the first render.

---

## Figma MCP Rules

When implementing a Figma design:

- Use the Figma MCP instead of guessing design values.
- Use the appropriate Figma design-to-code/implementation skill before retrieving design context when required by the installed Figma skills.
- Reuse existing Figma components and variables where possible.
- Use actual assets when available.
- Inspect parent/child relationships rather than flattening the design.
- Treat Figma Auto Layout as evidence of intended layout behavior.
- Treat constraints as evidence of responsive behavior.
- Do not reproduce a screenshot with absolute-positioned elements unless the design genuinely requires it.

Figma's official MCP documentation recommends the remote Figma MCP for Claude Code and provides skills specifically for design-to-code workflows. Use the installed Figma plugin/skills when available.

---

## Code Quality Rules

Prefer:
- semantic HTML
- reusable components
- clear naming
- small focused components
- existing project conventions
- CSS/layout primitives
- accessible interactions

Avoid:
- giant components
- duplicated markup
- unnecessary dependencies
- arbitrary pixel positioning
- screenshot-as-code techniques
- base64 images unless unavoidable
- inline SVG recreations when an existing asset is available
- rewriting unrelated files

---

## Prototype Rules

This is a prototype, not necessarily production backend implementation.

Implement realistic front-end behavior for:
- navigation
- menus
- buttons
- links
- tabs
- accordions
- carousels
- forms
- hover/focus states

Do not build backend systems unless explicitly requested.

Use local mock data when necessary.

---

## Content Rules

Preserve Figma copy.

Do not:
- rewrite marketing copy
- invent claims
- add unnecessary sections
- add random placeholder content

If content is missing, use a minimal placeholder and document it.

---

## Accessibility Rules

Always check:
- semantic headings
- button vs link semantics
- keyboard access
- visible focus
- alt text
- color contrast
- form labels
- reduced motion

Accessibility is part of implementation quality, not an optional polish step.

---

## SEO Rules

For a public landing page:
- use one primary H1
- preserve logical heading hierarchy
- set title and description
- use semantic sections
- add meaningful alt text
- use crawlable links
- add Open Graph metadata where appropriate

---

## Change Scope

Keep changes scoped.

Before modifying unrelated code, ask whether it is actually required.

If an existing component is imperfect but sufficient, prefer reuse over replacement.

---

## Completion Report

When finished, report:

### Implemented
- sections
- components
- interactions
- responsive behavior

### Figma fidelity
- high-confidence matches
- known deviations

### Assumptions
- important inferred behaviors

### Validation
- desktop viewport checked
- mobile viewport checked
- console/build status

### Files changed
- list the relevant files

Do not claim visual validation was performed unless it actually was.
