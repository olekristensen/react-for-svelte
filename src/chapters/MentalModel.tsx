import { useState } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { ComparisonTable } from '../components/ComparisonTable';

function CounterDemo() {
  const [count, setCount] = useState(0);
  console.log('CounterDemo rendered with count:', count);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
        Open your browser console to see the re-render log
      </p>
      <div style={{
        fontSize: '3rem',
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        color: 'var(--color-accent)',
      }}>
        {count}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setCount(c => c - 1)}
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            color: 'var(--color-text)',
            fontSize: '1rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          -
        </button>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
          }}
        >
          +
        </button>
        <button
          onClick={() => setCount(0)}
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Reset
        </button>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>
        Every click re-executes the entire CounterDemo function body
      </p>
    </div>
  );
}

export default function MentalModel() {
  return (
    <ChapterLayout id="mental-model">
      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Compiler vs. Runtime: The Fundamental Divide
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        This is the single most important concept to internalize when moving from Svelte to React.
        Everything else -- hooks, JSX patterns, performance optimization -- flows from this
        fundamental architectural difference.
      </p>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        <strong>Svelte is a compiler.</strong> When you write a Svelte component, the compiler
        analyzes your code at build time. It sees that <code>count</code> is used in the template,
        traces every assignment to <code>count</code>, and generates imperative JavaScript that
        directly updates the specific DOM nodes that depend on that variable. There is no diffing,
        no virtual DOM, and no runtime framework code re-evaluating your component.
      </p>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        <strong>React is a runtime.</strong> Your component is a plain JavaScript function. When
        state changes, React calls your function again -- the entire function body executes from
        top to bottom. It takes the JSX you return, builds a virtual DOM tree, diffs it against
        the previous one, and applies the minimal set of real DOM updates. Your function does not
        know which specific piece of state changed; it just re-runs and produces a new description
        of what the UI should look like.
      </p>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        A Counter: The Same Feature, Two Paradigms
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Let us compare a simple counter in both frameworks. Pay close attention to the highlighted
        lines -- they reveal where the paradigms diverge most.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let count = $state(0);

  function increment() {
    count++;           // Direct mutation
  }

  // This line runs ONCE at component creation
  console.log('Component initialized');
</script>

<button on:click={increment}>
  Clicks: {count}
</button>`,
          filename: 'Counter.svelte',
          highlight: [2, 5, 9],
        }}
        react={{
          code: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(c => c + 1);  // Explicit setter
  }

  // This line runs on EVERY render
  console.log('Component function called');

  return (
    <button onClick={increment}>
      Clicks: {count}
    </button>
  );
}`,
          filename: 'Counter.tsx',
          highlight: [4, 7, 11],
        }}
        note="In Svelte, the script block runs once and the compiler sets up reactive subscriptions. In React, the entire function body re-executes on every state change -- including that console.log."
      />

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
        What Happens on Each Click
      </h3>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        <strong>In Svelte:</strong> The <code>increment</code> function mutates <code>count</code> directly.
        The compiler has already generated code that knows exactly which DOM text node displays
        <code>count</code>, so it updates that single text node. The <code>console.log</code> at
        the top of the script does not run again -- it ran once when the component was mounted.
      </p>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        <strong>In React:</strong> Calling <code>setCount</code> schedules a re-render. React calls
        the <code>Counter</code> function again from the top. <code>useState(0)</code> returns the
        current count (not 0 -- React tracks the state internally). The <code>console.log</code> fires
        again. The function returns new JSX. React diffs the new virtual DOM against the old one and
        patches the real DOM.
      </p>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        The Re-render Mental Model
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        This is where most Svelte developers get tripped up. In Svelte, you can declare a variable
        in your script block and it persists for the lifetime of the component. In React, every
        local variable inside the component function is recreated on every render.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let count = $state(0);
  let renderCount = 0;  // Persists!

  $effect(() => {
    renderCount++;  // Increments each time count changes
    console.log('Render #' + renderCount);
  });
</script>

<p>count: {count}</p>
<p>renders: {renderCount}</p>`,
          filename: 'Persistent.svelte',
          highlight: [3],
        }}
        react={{
          code: `import { useState, useRef, useEffect } from 'react';

export default function Persistent() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);  // Persists!
  let localVar = 0;               // RESET every render!

  useEffect(() => {
    renderCount.current++;
    console.log('Render #' + renderCount.current);
  });

  localVar++;  // Always 1, never accumulates

  return (
    <>
      <p>count: {count}</p>
      <p>renders: {renderCount.current}</p>
      <p>localVar: {localVar}</p>  {/* Always 1 */}
    </>
  );
}`,
          filename: 'Persistent.tsx',
          highlight: [5, 6, 14],
        }}
        note="In React, only useState and useRef values survive across renders. Plain let variables are recreated every time the function executes. This is the #1 source of bugs for developers coming from Svelte."
      />

      <Callout type="gotcha" title="Fresh Closures on Every Render">
        In React, every render is a fresh closure. Variables don't persist between renders unless
        you use <code>useState</code> or <code>useRef</code>. This means a plain <code>let x = 5</code> inside
        a component will always be 5 at the start of every render. If you need a mutable value that
        persists but does not trigger re-renders, use <code>useRef</code>. If it should trigger
        re-renders, use <code>useState</code>.
      </Callout>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
        Why This Matters in Practice
      </h3>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        The re-render model has profound implications for how you structure code. In Svelte, you
        might casually compute a derived value with a simple variable assignment in the script
        block. In React, if that computation is expensive, you need <code>useMemo</code> to avoid
        recalculating it on every render. If you create a function inside a component, that function
        is a new reference every render -- which can cause child components to re-render
        unnecessarily if passed as a prop.
      </p>

      <CodeBlock
        code={`// This creates a NEW function reference every render
function Parent() {
  const [count, setCount] = useState(0);

  // handleClick is recreated every time Parent re-renders
  const handleClick = () => setCount(c => c + 1);

  // ExpensiveChild receives a new handleClick prop every render
  // causing it to re-render even if nothing else changed
  return <ExpensiveChild onClick={handleClick} />;
}

// Fix: useCallback memoizes the function reference
function ParentOptimized() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Empty deps = same reference across renders

  return <ExpensiveChild onClick={handleClick} />;
}`}
        language="tsx"
        filename="re-render-implications.tsx"
        highlight={[6, 17, 18, 19]}
      />

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        In Svelte, you never think about this. The compiler knows which functions are used where
        and optimizes accordingly. In React, referential stability is your responsibility -- though
        in practice, you only need to worry about it when you observe actual performance issues.
      </p>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Try It: The Re-render Cycle in Action
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Click the buttons below. Open your browser's developer console to see that every click
        causes the entire component function to re-execute. This is not a bug -- it is how
        React works by design.
      </p>

      <InteractiveDemo
        title="Counter with Re-render Logging"
        code={`import { useState } from 'react';

function CounterDemo() {
  const [count, setCount] = useState(0);

  // This log fires on EVERY render
  console.log('CounterDemo rendered with count:', count);

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`}
      >
        <CounterDemo />
      </InteractiveDemo>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        State Update Batching
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Both Svelte and React batch state updates, but the mechanisms differ. In React 18+, all
        state updates are automatically batched -- even in async callbacks and event handlers.
        Multiple <code>setState</code> calls in the same synchronous block result in a single
        re-render.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let x = $state(0);
  let y = $state(0);

  function updateBoth() {
    // Svelte batches these into one update
    x++;
    y++;
    // Template updates once with both new values
  }
</script>`,
          filename: 'Batching.svelte',
          highlight: [7, 8],
        }}
        react={{
          code: `import { useState } from 'react';

export default function Batching() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  function updateBoth() {
    // React 18+ batches these into one re-render
    setX(prev => prev + 1);
    setY(prev => prev + 1);
    // Component re-renders once with both new values
  }

  return <button onClick={updateBoth}>Update Both</button>;
}`,
          filename: 'Batching.tsx',
          highlight: [9, 10],
        }}
        note="React 18 introduced automatic batching for all state updates. Prior to React 18, batching only worked inside React event handlers, not in setTimeout, promises, or native event handlers."
      />

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Immutability: The React Contract
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        In Svelte 5, you can push to an array or mutate an object property and the compiler
        detects the change through its proxy-based reactivity system. React has no such mechanism.
        React determines whether to re-render by comparing state references using <code>Object.is()</code>.
        If you mutate an object in place, the reference stays the same, and React skips the update.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let items = $state(['apple', 'banana']);

  function addItem() {
    items.push('cherry');  // Mutation works!
    // Svelte's proxy detects the push
  }
</script>

{#each items as item}
  <li>{item}</li>
{/each}`,
          filename: 'Mutation.svelte',
          highlight: [5],
        }}
        react={{
          code: `import { useState } from 'react';

export default function Mutation() {
  const [items, setItems] = useState(['apple', 'banana']);

  function addItem() {
    // WRONG: items.push('cherry') mutates in place
    // React won't detect the change!

    // CORRECT: create a new array
    setItems(prev => [...prev, 'cherry']);
  }

  return (
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}`,
          filename: 'Mutation.tsx',
          highlight: [7, 8, 11],
        }}
        note="React's immutability requirement is non-negotiable. Always produce new references when updating state: spread arrays, spread objects, use map/filter for transformations. Libraries like Immer can help if this feels verbose."
      />

      <Callout type="insight" title="Why Immutability?">
        React's immutability contract enables fast change detection (<code>Object.is()</code> is
        cheaper than deep comparison), powers features like time-travel debugging, and makes
        concurrent rendering possible. Svelte avoids this cost through compiler analysis and
        runtime proxies, but at the cost of a more complex internal reactivity system.
      </Callout>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Trade-offs at a Glance
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Neither approach is objectively better. Each makes trade-offs that matter at different
        scales and in different contexts. Here is an honest comparison.
      </p>

      <ComparisonTable
        headers={['Dimension', 'Svelte (Compiler)', 'React (Runtime)']}
        rows={[
          [
            'Bundle size',
            'Smaller baseline; grows with component count',
            'Larger baseline (~40kb min); amortized across components',
          ],
          [
            'Reactivity mechanism',
            'Compile-time analysis + runtime proxies (Svelte 5)',
            'Virtual DOM diffing + explicit state updates',
          ],
          [
            'State update ergonomics',
            'Direct assignment: count++ triggers updates',
            'Explicit setters: setCount(c => c + 1)',
          ],
          [
            'Mutation model',
            'Mutable: push, splice, property assignment all work',
            'Immutable: must create new references for updates',
          ],
          [
            'Re-rendering scope',
            'Surgical: only affected DOM nodes update',
            'Component-level: entire function re-runs, virtual DOM diffed',
          ],
          [
            'Dev experience',
            'Less boilerplate; more magical (compiler does work)',
            'More explicit; more predictable (you see what runs)',
          ],
          [
            'Performance ceiling',
            'High by default; fewer optimization knobs needed',
            'Requires manual optimization (memo, useCallback, useMemo)',
          ],
          [
            'Learning curve',
            'Lower initial curve; compiler hides complexity',
            'Steeper initial curve; closures and hooks need understanding',
          ],
          [
            'Ecosystem breadth',
            'Growing rapidly; smaller but curated',
            'Massive; library for every conceivable use case',
          ],
          [
            'Debugging model',
            'Harder to debug compiled output',
            'Standard JavaScript; DevTools show exactly what runs',
          ],
        ]}
        caption="Svelte Compiler vs. React Runtime: Honest Trade-offs"
      />

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        With this mental model in place, you are ready to look at the building blocks: components
        and JSX. Understanding that React re-runs your function on every state change is the
        foundation that makes everything else make sense.
      </p>
    </ChapterLayout>
  );
}
