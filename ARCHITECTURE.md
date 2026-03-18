# Architecture & Design Decisions

## Visual Design: New Nordic + Bright Blue

**Direction**: Kinfolk-inspired Scandinavian minimalism with a single high-gamut OKLCH accent color.

**Palette**: Warm near-black dark mode (#141614), warm off-white light mode (#f6f7f4). Accent defined in OKLCH (`oklch(0.7 0.22 250)`) with sRGB fallback (`#1a8aff`) via `@supports`.

**Typography**: DM Sans for body (humanist sans-serif), Source Serif 4 for chapter titles (weight 400, light), JetBrains Mono for code (chosen because it maintains identical character widths across all weights — critical for the overlay code editor).

**No border radius anywhere**. No emoji — all icons are inline SVGs from `src/components/Icons.tsx`. Monochromatic section labels — all sections use the same accent blue. No framework brand colors (no Svelte orange, no React cyan).

**Syntax highlighting**: Monochromatic blue tones in dark mode, matched tones in light mode. Four tonal levels: keyword (bold), function (medium), string (muted), comment (desaturated italic). Defined via CSS variables (`--color-code-keyword` etc.) so they cascade through components.

**Code blocks**: Always dark background in dark mode (`--color-code-bg: #181a18`, matches sidebar). Light mode uses `#eaece6` with the GitHub prism theme. Theme switching uses `useSyncExternalStore` + `MutationObserver` on the `data-theme` attribute.

**Code comparisons**: Use negative margins to break out of the text column when viewport is wide enough (>1320px breakpoint = sidebar + padding + article + breakout). Single responsive breakpoint — either breaks out or stays at text width, nothing in between. Columns use flex with equal-height stretching. Insight text shares the same container width as the code.

**Callouts**: Thin 1px top border in the type's color. Body text and inline code inherit that color for a monochromatic unit. No background, no left accent bar. Four types: Note (accent blue), Warning (amber), Insight (accent blue), Gotcha (error red).

**Tables**: Column formatting (monospace vs sans-serif) is specified per call site via the `columnFormat` prop — not inferred by the component. The component renders; the content decides formatting.

**Navigation**: Previous/Next as plain text. On hover, arrow slides in from the margin side (width animates from 0), pushing the label text inward. Sidebar stays open when navigating.

## Interactive Exercises

**CodeExercise component** (`src/components/CodeExercise.tsx`): Editable code area using the overlay technique — a prism-highlighted `<pre>` sits behind a transparent `<textarea>`. Both share identical font, size, padding, and line-height. JetBrains Mono is critical here because it maintains the same character widths across bold/regular/italic, so the highlighted layer stays aligned with the transparent cursor layer.

**Validation** (3 tiers, in priority order):

1. **Behavioral tests** (`tests` prop): User code is compiled with sucrase (JSX → createElement), executed with mocked React hooks (useState, useEffect, etc.), and behavioral assertions check actual output. This catches real bugs like `o++` returning the old value. Tests are defined per exercise and surface specific failure messages ("Expected 1, got 0").

2. **AST structural comparison** (acorn + acorn-jsx): Parses both user code and solution, normalizes variable names to positional IDs, strips whitespace/formatting differences. Handles renamed variables, different formatting, equivalent patterns (arrow updaters ↔ direct values, `x++` ↔ `x + 1`).

3. **Normalized string pattern matching** (fallback): Collapses whitespace, flexibly matches method calls regardless of the variable name before the dot (`e.preventDefault()` matches `ev.preventDefault()`).

**Confetti**: Canvas-based particle system. Particles spawn at the box center with upward-fan velocities, then physics-simulated (gravity + friction) via requestAnimationFrame. Each particle is fast-forwarded through the simulation (without gravity) until it clears the box bounding rect, then life resets to 0 — so particles appear at full opacity the instant they emerge from behind the box. Staggered over 1 second. Canvas sits at z-index 0, exercise box DOM at z-index 1.

**Solved state**: When an exercise is completed, CSS custom properties are overridden on the container to green tones — all accent colors, code syntax colors, and semantic colors cascade to green automatically.

## Progress Tracking

**useProgress hook** (`src/hooks/useProgress.ts`): Uses `useSyncExternalStore` to stay synchronized across Sidebar, ChapterLayout, and CodeExercise. Reads/writes `localStorage` key `rfsd-progress`. Custom events (`rfsd-progress-change`) notify other components of changes.

**Chapter visits**: Marked as read when the user scrolls within 200px of the page bottom (not on page load). Reset available in sidebar footer.

**Exercise state**: Persisted per exercise ID — userCode, solved status, attempt count. Auto-saved on a 500ms debounce.

## Key Dependencies

- **acorn + acorn-jsx**: JavaScript parser for AST-based code comparison
- **sucrase**: Fast JSX → createElement transform for the behavioral test runner
- **prism-react-renderer**: Syntax highlighting with custom token color overrides
- **react-router-dom**: HashRouter for GitHub Pages compatibility

## File Structure

```
src/
  components/
    Icons.tsx          — SVG icon components (currentColor, no emoji)
    CodeExercise.tsx   — Interactive exercise with editor, tests, confetti
    CodeBlock.tsx      — Syntax-highlighted code display
    CodeComparison.tsx — Side-by-side Svelte/React comparison
    Callout.tsx        — Monochromatic callout boxes
    ComparisonTable.tsx — Table with per-column formatting
    ChapterLayout.tsx  — Chapter wrapper with nav and progress tracking
    InteractiveDemo.tsx — Live demo with toggleable code view
  hooks/
    useProgress.ts     — localStorage-backed progress persistence
  utils/
    codeValidator.ts   — Test runner + AST comparison + pattern matching
  data/
    chapters.ts        — Chapter metadata and section definitions
    exercises.ts       — Exercise registry for sidebar badges
  chapters/
    *.tsx              — 30 chapter files with content
```
