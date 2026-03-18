import React, { useState } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

function FlashingList({ items, label, color }: { items: string[]; label: string; color: string }) {
  const [flash, setFlash] = useState(false);
  const renderCountRef = React.useRef(0);
  renderCountRef.current++;
  React.useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 300);
    return () => clearTimeout(t);
  });
  return (
    <div style={{
      padding: '0.5rem',
      background: flash ? 'rgba(239, 68, 68, 0.2)' : 'var(--color-bg-secondary)',
      borderRadius: 0,
      fontSize: '0.85rem',
      transition: 'background 0.3s',
      border: flash ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent',
    }}>
      <p style={{ color: 'var(--color-text)' }}>List: {items.join(', ')}</p>
      <p style={{ color, fontSize: '0.75rem' }}>{label} (rendered {renderCountRef.current}×)</p>
    </div>
  );
}

function BuggyExpensiveParent() {
  const [count, setCount] = useState(0);
  const items = ['Apple', 'Banana', 'Cherry'];
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: '0.4rem 0.8rem', background: 'var(--color-accent)', color: '#ffffff', border: 'none', borderRadius: 0, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        Count: {count}
      </button>
      <FlashingList items={items} label="Red flash = unnecessary re-render" color="#ef4444" />
      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>Click the button — the list flashes red every time even though it didn't change</p>
    </div>
  );
}

function FixedExpensiveParent() {
  const [count, setCount] = useState(0);
  const items = ['Apple', 'Banana', 'Cherry'];
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: '0.4rem 0.8rem', background: 'var(--color-accent)', color: '#ffffff', border: 'none', borderRadius: 0, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        Count: {count}
      </button>
      <div style={{ padding: '0.5rem', background: 'var(--color-bg-secondary)', borderRadius: 0, fontSize: '0.85rem' }}>
        <p style={{ color: 'var(--color-text)' }}>List: {items.join(', ')}</p>
        <p style={{ color: 'var(--color-success)', fontSize: '0.75rem' }}>No flash — list stays stable</p>
      </div>
    </div>
  );
}

export default function Performance() {
  return (
    <ChapterLayout id="performance">
      <p style={pStyle}>
        If you are coming from Svelte, React's performance story will initially feel like a step
        backward. Svelte's compiler statically analyzes your code and generates minimal, surgical
        DOM updates at build time. React re-renders entire component subtrees at runtime and relies
        on virtual DOM diffing to figure out what changed. This means React developers must
        sometimes manually optimize things that Svelte handles automatically. The tools for this
        are <code>React.memo</code>, <code>useMemo</code>, and <code>useCallback</code> — and
        understanding when and why to use them is a critical part of writing performant React.
      </p>

      <p style={pStyle}>
        The fundamental difference is architectural. Svelte compiles reactivity into the code itself:
        when you assign to a reactive variable, only the exact DOM nodes that depend on that variable
        are updated. React, by contrast, re-executes your entire component function on every state
        change, generates a new virtual DOM tree, diffs it against the previous one, and patches only
        the changed nodes into the real DOM. The diffing is fast, but re-running every component
        function — including expensive computations and object allocations — can add up.
      </p>

      {/* ─── Auto-optimized vs Manual ─── */}
      <h2 style={h2Style}>Auto-Optimized vs Manual Memoization</h2>
      <p style={pStyle}>
        In Svelte, derived values computed with <code>$derived</code> are automatically cached and
        only recalculated when their dependencies change. In React, every line of your component
        function runs on every render unless you explicitly opt into memoization. Here is the same
        computation in both frameworks.
      </p>
      <CodeComparison
        svelte={{
          code: `<script lang="ts">
  let items = $state<Item[]>([]);
  let filter = $state('');

  // Automatically cached by the compiler.
  // Only recalculates when items or filter change.
  let filtered = $derived(
    items.filter(i =>
      i.name.toLowerCase().includes(
        filter.toLowerCase()
      )
    )
  );

  // Also auto-cached
  let totalPrice = $derived(
    filtered.reduce((sum, i) => sum + i.price, 0)
  );

  // This function reference is stable —
  // Svelte does not recreate it on every update
  function handleSort() {
    items = [...items].sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }
</script>

<input bind:value={filter} placeholder="Filter..." />
<p>Total: {totalPrice}</p>
<button on:click={handleSort}>Sort</button>`,
          filename: 'FilteredList.svelte',
        }}
        react={{
          code: `import {
  useState, useMemo, useCallback
} from 'react';

function FilteredList() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState('');

  // Must manually memoize expensive computation
  const filtered = useMemo(
    () => items.filter(i =>
      i.name.toLowerCase().includes(
        filter.toLowerCase()
      )
    ),
    [items, filter] // explicit deps
  );

  // Also manually memoized
  const totalPrice = useMemo(
    () => filtered.reduce(
      (sum, i) => sum + i.price, 0
    ),
    [filtered]
  );

  // Must stabilize function reference if passed
  // to a memo'd child component
  const handleSort = useCallback(() => {
    setItems(prev =>
      [...prev].sort(
        (a, b) => a.name.localeCompare(b.name)
      )
    );
  }, []);

  return (
    <>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter..."
      />
      <p>Total: {totalPrice}</p>
      <button onClick={handleSort}>Sort</button>
    </>
  );
}`,
          filename: 'FilteredList.tsx',
        }}
        note="Svelte's compiler automatically does what useMemo and useCallback do manually. Every $derived is a cached computation. Every function defined in the script block keeps a stable reference. React developers must opt in."
      />

      {/* ─── React.memo ─── */}
      <h2 style={h2Style}>React.memo — Preventing Unnecessary Re-renders</h2>
      <p style={pStyle}>
        When a parent component re-renders in React, all of its children re-render too — even if
        the props passed to them have not changed. This is by design and usually fast enough. But
        when a child component is expensive to render (large lists, heavy computations, complex
        SVGs), you can wrap it with <code>React.memo</code> to skip re-rendering when its props
        are shallowly equal to the previous render's props.
      </p>
      <p style={pStyle}>
        In Svelte, this is a non-issue. Components only re-run the specific reactive blocks whose
        dependencies changed. There is no concept of "re-rendering the whole component" to prevent.
      </p>
      <CodeBlock
        code={`import { memo, useState } from 'react';

// Without memo: re-renders every time parent renders,
// even if items hasn't changed
function ExpensiveList({ items }: { items: Item[] }) {
  console.log('ExpensiveList rendered');
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {/* imagine heavy rendering here */}
          <ComplexItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}

// With memo: only re-renders if items reference changes
const MemoizedList = memo(ExpensiveList);

// Custom comparison for deeper equality checks
const DeepMemoizedList = memo(ExpensiveList, (prev, next) => {
  // Return true if props are equal (skip re-render)
  // Return false if props differ (allow re-render)
  return prev.items.length === next.items.length
    && prev.items.every((item, i) => item.id === next.items[i].id);
});

// Parent component
function Dashboard() {
  const [items] = useState<Item[]>(loadItems());
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      {/* searchQuery changes cause Dashboard to re-render,
          but MemoizedList skips if items hasn't changed */}
      <input
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <MemoizedList items={items} />
    </div>
  );
}`}
        language="tsx"
        filename="React.memo.tsx"
        highlight={[20, 23, 43]}
      />

      <h3 style={h3Style}>When Does React.memo Break?</h3>
      <p style={pStyle}>
        <code>React.memo</code> uses shallow comparison by default, which means it compares object
        and function references with <code>===</code>. If you pass a new object literal or inline
        function as a prop, the references are different every render, and memo has no effect. This
        is exactly the problem that <code>useMemo</code> and <code>useCallback</code> solve.
      </p>
      <CodeBlock
        code={`// BAD: memo is useless here because style and onClick
// are new references every render
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <MemoizedChild
      style={{ color: 'red' }}         // new object every render
      onClick={() => console.log('hi')} // new function every render
    />
  );
}

// GOOD: stable references make memo effective
function Parent() {
  const [count, setCount] = useState(0);

  const style = useMemo(() => ({ color: 'red' }), []);
  const handleClick = useCallback(() => console.log('hi'), []);

  return (
    <MemoizedChild
      style={style}         // stable reference
      onClick={handleClick}  // stable reference
    />
  );
}`}
        language="tsx"
        filename="memo-gotcha.tsx"
        highlight={[8, 9, 19, 20]}
      />

      {/* ─── useMemo ─── */}
      <h2 style={h2Style}>useMemo — Expensive Computations and Referential Equality</h2>
      <p style={pStyle}>
        <code>useMemo</code> serves two purposes. First, it caches the result of an expensive
        computation so it only re-runs when its dependencies change — the equivalent of
        Svelte's <code>$derived</code>. Second, it preserves referential equality of objects
        and arrays, preventing unnecessary re-renders of memoized children.
      </p>
      <CodeBlock
        code={`import { useMemo, useState } from 'react';

function SearchResults({ items, query }: Props) {
  // Purpose 1: Avoid re-running expensive filter on every render
  const results = useMemo(() => {
    console.log('Filtering...');
    return items
      .filter(item => item.name.includes(query))
      .sort((a, b) => relevanceScore(b, query) - relevanceScore(a, query));
  }, [items, query]); // only re-filter when items or query change

  // Purpose 2: Stable object reference for memo'd child
  const chartData = useMemo(
    () => ({
      labels: results.map(r => r.name),
      values: results.map(r => r.score),
    }),
    [results]
  );

  return (
    <div>
      <p>{results.length} results found</p>
      <MemoizedChart data={chartData} />
      <ResultList items={results} />
    </div>
  );
}`}
        language="tsx"
        filename="useMemo.tsx"
        highlight={[5, 10, 13]}
      />

      <h3 style={h3Style}>When NOT to Use useMemo</h3>
      <p style={pStyle}>
        Do not memoize everything. Memoization itself has a cost — React must store the previous
        result and compare dependencies on every render. For simple computations (adding two numbers,
        string concatenation, trivial array operations), the overhead of <code>useMemo</code> exceeds
        the cost of just recomputing. Reserve it for genuinely expensive operations or when referential
        stability is required for downstream memoized components.
      </p>

      {/* ─── useCallback ─── */}
      <h2 style={h2Style}>useCallback — Stabilizing Function References</h2>
      <p style={pStyle}>
        Every time a component renders, all the functions declared inside it are re-created as new
        references. Most of the time this does not matter. But when you pass a function as a prop
        to a <code>React.memo</code>-wrapped child, the new reference defeats memoization.
        <code> useCallback</code> returns a memoized version of the function that only changes when
        its dependencies change.
      </p>
      <CodeBlock
        code={`import { useCallback, useState, memo } from 'react';

// Child wrapped in memo — only re-renders if props change
const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
}: TodoItemProps) {
  console.log(\`Rendering todo: \${todo.text}\`);
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  // Without useCallback: new function every render
  // → every TodoItem re-renders even if only one todo changed
  const onToggle = useCallback((id: number) => {
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }, []);

  const onDelete = useCallback((id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}  // stable reference
          onDelete={onDelete}  // stable reference
        />
      ))}
    </ul>
  );
}`}
        language="tsx"
        filename="useCallback.tsx"
        highlight={[4, 28, 34, 44, 45]}
      />

      <Callout type="insight" title="The Tax of Runtime Reactivity">
        Svelte's compiler handles most of what <code>useMemo</code>, <code>useCallback</code>,
        and <code>React.memo</code> do. This is the tax React developers pay for runtime reactivity.
        Svelte generates code that only touches exactly what changed. React re-runs everything and
        asks the developer to signal what can be skipped. This is not a flaw — it is a trade-off.
        React's model is more flexible and easier to reason about in complex cases, but it shifts
        optimization responsibility to the developer.
      </Callout>

      {/* ─── React Compiler ─── */}
      <h2 style={h2Style}>The React Compiler (React Forget)</h2>
      <p style={pStyle}>
        The React team has been working on an auto-memoizing compiler, sometimes called "React
        Forget" and now officially the "React Compiler." It aims to eliminate the need for manual
        <code> useMemo</code>, <code>useCallback</code>, and <code>React.memo</code> calls by
        automatically determining which values and functions need memoization at compile time.
      </p>
      <p style={pStyle}>
        This is conceptually similar to what Svelte already does — moving optimization decisions
        from runtime to compile time. When the React Compiler is stable and widely adopted, much
        of this chapter's advice about manual memoization will become unnecessary. But for now,
        understanding these primitives remains essential for production React code.
      </p>
      <CodeBlock
        code={`// Before React Compiler (today):
function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');

  // Must manually memoize
  const filteredTodos = useMemo(
    () => todos.filter(t =>
      filter === 'all' ? true : filter === 'done' ? t.done : !t.done
    ),
    [todos, filter]
  );

  const addTodo = useCallback((text: string) => {
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  }, []);

  return <TodoList todos={filteredTodos} onAdd={addTodo} />;
}

// After React Compiler (future):
// The compiler inserts memoization automatically.
// You just write plain code.
function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');

  // Compiler detects this is derived data and memoizes it
  const filteredTodos = todos.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  );

  // Compiler detects this is passed to children and stabilizes it
  function addTodo(text: string) {
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  }

  return <TodoList todos={filteredTodos} onAdd={addTodo} />;
}`}
        language="tsx"
        filename="react-compiler.tsx"
        highlight={[7, 14, 30, 35]}
      />

      {/* ─── Windowing / Virtualization ─── */}
      <h2 style={h2Style}>Virtual Lists and Windowing</h2>
      <p style={pStyle}>
        When rendering thousands of items, both Svelte and React face the same fundamental DOM
        bottleneck — the browser cannot handle 10,000 DOM nodes efficiently regardless of framework.
        The solution in both ecosystems is windowing (or virtualization): only render the items
        currently visible in the viewport, plus a small buffer above and below.
      </p>
      <CodeComparison
        svelte={{
          code: `<!-- Svelte: using svelte-virtual-list
     or @tanstack/virtual (framework-agnostic) -->
<script>
  import { createVirtualizer } from
    '@tanstack/svelte-virtual';

  let items = $state(generateItems(10000));

  let container;

  const virtualizer = createVirtualizer({
    count: items.length,
    getScrollElement: () => container,
    estimateSize: () => 35,
  });
</script>

<div bind:this={container}
  style="height: 400px; overflow: auto;">
  <div style="height: {
    virtualizer.getTotalSize()
  }px; position: relative;">
    {#each virtualizer.getVirtualItems()
      as row (row.key)}
      <div style="
        position: absolute;
        top: {row.start}px;
        height: {row.size}px;
        width: 100%;
      ">
        {items[row.index].name}
      </div>
    {/each}
  </div>
</div>`,
          filename: 'VirtualList.svelte',
        }}
        react={{
          code: `// React: using @tanstack/react-virtual
import { useVirtualizer } from
  '@tanstack/react-virtual';
import { useRef } from 'react';

function VirtualList() {
  const items = generateItems(10000);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div ref={parentRef}
      style={{ height: 400, overflow: 'auto' }}>
      <div style={{
        height: virtualizer.getTotalSize(),
        position: 'relative',
      }}>
        {virtualizer.getVirtualItems().map(row => (
          <div
            key={row.key}
            style={{
              position: 'absolute',
              top: row.start,
              height: row.size,
              width: '100%',
            }}
          >
            {items[row.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
          filename: 'VirtualList.tsx',
        }}
        note="Both frameworks use the same @tanstack/virtual library. Windowing is a DOM optimization technique that transcends framework boundaries. The concepts and APIs are nearly identical."
      />

      {/* ─── Comparison Table ─── */}
      <h2 style={h2Style}>Performance Tools at a Glance</h2>
      <ComparisonTable
        caption="Svelte vs React Performance Optimization"
        headers={['Optimization', 'Svelte', 'React']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['Cached derived values', '$derived (automatic)', 'useMemo(() => ..., [deps])'],
          ['Stable function refs', 'Automatic (compiler)', 'useCallback(fn, [deps])'],
          ['Skip child re-renders', 'Automatic (granular updates)', 'React.memo(Component)'],
          ['Custom equality check', 'Not needed', 'React.memo(Comp, compareFn)'],
          ['Profiling tool', 'Browser DevTools', 'React DevTools Profiler'],
          ['Compiler auto-optimize', 'Built-in (Svelte compiler)', 'React Compiler (emerging)'],
          ['Virtual lists', '@tanstack/svelte-virtual', '@tanstack/react-virtual'],
          ['Code splitting', 'Dynamic import()', 'React.lazy() + Suspense'],
          ['Transition priority', 'Not applicable', 'useTransition, useDeferredValue'],
          ['Concurrent rendering', 'Not applicable', 'Concurrent features (React 18+)'],
          ['Bundle analyzer', 'rollup-plugin-visualizer', 'webpack-bundle-analyzer'],
          ['SSR streaming', 'SvelteKit streaming', 'renderToPipeableStream'],
        ]}
      />

      <p style={pStyle}>
        The mental model shift here is significant. In Svelte, performance is largely the compiler's
        responsibility — you write straightforward code and trust the build step to produce efficient
        output. In React, performance is a shared responsibility between the framework and the
        developer. React provides the primitives, but you decide when to apply them. Over-memoizing
        adds complexity without benefit; under-memoizing leads to janky UIs with large datasets.
        The art is knowing when optimization matters — and the React DevTools Profiler is your best
        friend for making that judgment empirically rather than guessing.
      </p>

      <CodeExercise
        id="performance-fix-memo"
        title="Fix the Re-render"
        type="fix-the-bug"
        description="The ExpensiveList re-renders every time the parent's count changes, even though the list data hasn't changed. The inline object and function create new references every render. Fix it."
        buggyPreview={<BuggyExpensiveParent />}
        solvedPreview={<FixedExpensiveParent />}
        initialCode={`function Parent() {
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState('');
  const items = ['Apple', 'Banana', 'Cherry'];

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <ExpensiveList
        items={items}
        config={{ sortOrder: 'asc' }}
        onSelect={(item) => setSelected(item)}
      />
      {selected && <p>Selected: {selected}</p>}
    </div>
  );
}`}
        solution={`function Parent() {
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState('');
  const items = ['Apple', 'Banana', 'Cherry'];

  const config = useMemo(() => ({ sortOrder: 'asc' }), []);
  const onSelect = useCallback((item) => setSelected(item), []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <ExpensiveList
        items={items}
        config={config}
        onSelect={onSelect}
      />
      {selected && <p>Selected: {selected}</p>}
    </div>
  );
}`}
        validationPatterns={["useMemo(() =>", "useCallback("]}
        hints={[
          "Inline objects {} and arrow functions () => create new references every render",
          "React.memo on ExpensiveList won't help if the props are new objects each time",
          "Wrap the config object with useMemo and the callback with useCallback"
        ]}
      />
    </ChapterLayout>
  );
}
