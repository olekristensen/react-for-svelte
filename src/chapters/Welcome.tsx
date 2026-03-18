import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

export default function Welcome() {
  return (
    <ChapterLayout id="welcome">
      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Who This Is For
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        You already know Svelte. You have built production apps with SvelteKit, you understand
        runes, you think in reactive declarations, and you can wire up a store in your sleep.
        Now you need to work in React -- maybe a new job, a client project, or a library ecosystem
        that only exists in React-land. This guide is your bridge.
      </p>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        We will not waste your time explaining what a component is or why state management matters.
        Instead, every concept is presented as a direct translation from the Svelte patterns you
        already know, with side-by-side code, honest commentary on trade-offs, and callouts for
        the gotchas that trip up every Svelte developer entering the React ecosystem.
      </p>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Your First Translation: Hello World
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Let us start with the simplest possible comparison. Even at this scale, the philosophical
        differences are visible: Svelte uses a single-file component with a dedicated template
        region, while React uses a JavaScript function that returns JSX.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let name = $state('world');
</script>

<h1>Hello {name}!</h1>

<style>
  h1 {
    color: #ff3e00;
    font-weight: 700;
  }
</style>`,
          filename: 'Hello.svelte',
        }}
        react={{
          code: `import { useState } from 'react';

export default function Hello() {
  const [name] = useState('world');

  return (
    <h1 style={{ color: '#61dafb', fontWeight: 700 }}>
      Hello {name}!
    </h1>
  );
}`,
          filename: 'Hello.tsx',
        }}
        note="Notice: Svelte's $state rune becomes React's useState hook. Svelte's scoped <style> block becomes inline styles, CSS modules, or a CSS-in-JS solution -- React has no built-in scoped styling."
      />

      <Callout type="insight" title="The Core Difference">
        React is runtime-first; Svelte is compiler-first. This changes everything. Svelte analyzes
        your code at build time and generates surgical DOM updates. React re-runs your component
        function on every state change and diffs a virtual DOM at runtime. Understanding this
        distinction is the key to thinking in React.
      </Callout>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        What You Will Learn
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        This guide is structured as a progressive journey. Each section builds on the last,
        mapping Svelte concepts to their React equivalents and then deepening your understanding
        of how React thinks about the same problems differently.
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
        Foundations
      </h3>
      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        The mental model shift from compiler-driven to runtime-driven reactivity. Components, JSX,
        and how React's function-based architecture differs from Svelte's single-file components.
        Props, state with <code>useState</code>, and the core rendering cycle.
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
        Intermediate Patterns
      </h3>
      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Side effects with <code>useEffect</code> (and why it is not the same as <code>$effect</code>),
        derived state with <code>useMemo</code>, refs, context, and controlled vs uncontrolled
        inputs. Component composition patterns that replace Svelte's slots and actions.
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
        Advanced Concepts
      </h3>
      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Performance optimization with <code>React.memo</code>, <code>useCallback</code>, and
        <code>useMemo</code>. Suspense, error boundaries, portals, and the concurrent rendering
        model. Custom hooks as the React equivalent of reusable Svelte logic.
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
        Meta-Frameworks: Next.js
      </h3>
      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        SvelteKit to Next.js -- the App Router, server components, file-based routing, data
        fetching with <code>fetch</code> in server components vs SvelteKit's <code>load</code> functions,
        and the server/client component boundary.
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
        Ecosystem and Tooling
      </h3>
      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        State management libraries (Zustand, Jotai, Redux Toolkit), styling approaches
        (Tailwind, styled-components, CSS Modules), testing with Vitest and React Testing Library,
        and the broader React ecosystem you will be working within.
      </p>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        The Rosetta Stone: Svelte to React Concept Map
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Before we dive deep, here is a quick-reference table mapping the Svelte concepts you
        know to their React equivalents. Bookmark this -- you will come back to it often.
      </p>

      <ComparisonTable
        headers={['Svelte Concept', 'React Equivalent', 'Key Difference']}
        rows={[
          [
            '$state',
            'useState',
            'useState returns a [value, setter] tuple; updates are explicit function calls, not assignments',
          ],
          [
            '$derived',
            'useMemo',
            'useMemo requires a dependency array; React cannot auto-track dependencies like the Svelte compiler',
          ],
          [
            '$effect',
            'useEffect',
            'useEffect runs after paint by default and requires manual dependency arrays and cleanup returns',
          ],
          [
            '{#if condition}',
            'Ternary / &&',
            'JSX uses inline JavaScript expressions: {flag ? <A /> : <B />} or {flag && <A />}',
          ],
          [
            '{#each items as item}',
            'array.map()',
            'React requires explicit key props on mapped elements; no implicit index variable',
          ],
          [
            'on:click',
            'onClick',
            'React uses camelCase event names as JSX props; no event modifiers like |preventDefault',
          ],
          [
            'bind:value',
            'Controlled input',
            'React needs both value={state} and onChange={handler} -- two-way binding is always explicit',
          ],
          [
            '<slot />',
            'children prop',
            'React passes nested JSX as props.children automatically; named slots use named props',
          ],
          [
            'Svelte store',
            'Context + useReducer',
            'React has no built-in observable stores; Context provides DI, useReducer handles complex state',
          ],
          [
            '+page.svelte',
            'page.tsx (Next.js)',
            'Both use file-based routing; Next.js App Router uses folder conventions with page.tsx files',
          ],
        ]}
        caption="Svelte to React: Quick Reference"
      />

      <Callout type="info" title="A Note on Versions">
        This guide covers Svelte 5 (with runes) and React 18+. If you are coming from Svelte 4
        with its older reactive declarations (<code>$:</code>) and <code>let</code>-based state,
        the conceptual distance to React is actually smaller than you might think -- Svelte 5's
        runes already moved closer to React's explicit state management model.
      </Callout>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        How to Use This Guide
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Each chapter follows a consistent structure: concept introduction, side-by-side Svelte
        and React code, an interactive demo where applicable, and a comparison table summarizing
        the differences. We recommend reading sequentially at first, then using the concept map
        above and individual chapter tables as reference material when you are writing React code.
      </p>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        The interactive demos are live React components. Experiment with them -- modify values,
        click buttons, and observe the behavior. There is no better way to internalize React's
        rendering model than watching it in action.
      </p>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Ready? Let us start with the most important thing to understand: how React's mental model
        fundamentally differs from Svelte's.
      </p>
    </ChapterLayout>
  );
}
