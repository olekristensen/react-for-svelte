import { useState, useMemo } from 'react';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { ChapterLayout } from '../components/ChapterLayout';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

// -- Interactive Filterable List Demo --
let nextId = 4;

function FilterableListDemo() {
  const [items, setItems] = useState([
    { id: 1, text: 'Learn React conditionals', category: 'react' },
    { id: 2, text: 'Understand key prop', category: 'react' },
    { id: 3, text: 'Compare with Svelte each', category: 'svelte' },
  ]);
  const [filter, setFilter] = useState<'all' | 'react' | 'svelte'>('all');
  const [input, setInput] = useState('');
  const [category, setCategory] = useState<'react' | 'svelte'>('react');

  const filtered = useMemo(
    () => filter === 'all' ? items : items.filter(i => i.category === filter),
    [items, filter]
  );

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setItems(prev => [...prev, { id: nextId++, text: trimmed, category }]);
    setInput('');
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder="Add an item..."
          style={{
            flex: 1,
            minWidth: '140px',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
          }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value as 'react' | 'svelte')}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
          }}
        >
          <option value="react">React</option>
          <option value="svelte">Svelte</option>
        </select>
        <button
          onClick={addItem}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'var(--color-accent)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          Add
        </button>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['all', 'react', 'svelte'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: filter === f ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              background: filter === f ? 'rgba(56, 189, 248, 0.15)' : 'var(--color-surface)',
              color: filter === f ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filtered.map(item => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0.75rem',
              marginBottom: '0.35rem',
              background: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              color: 'var(--color-text)',
            }}
          >
            <span>
              <span style={{
                display: 'inline-block',
                padding: '1px 6px',
                borderRadius: 3,
                fontSize: '0.7rem',
                fontWeight: 600,
                marginRight: '0.5rem',
                background: item.category === 'react' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 62, 0, 0.15)',
                color: item.category === 'react' ? 'var(--color-react)' : 'var(--color-svelte)',
              }}>
                {item.category}
              </span>
              {item.text}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '2px 6px',
              }}
            >
              remove
            </button>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
          No items match the current filter.
        </p>
      )}
    </div>
  );
}

const filterableDemoCode = `function FilterableList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Learn React conditionals', category: 'react' },
    { id: 2, text: 'Understand key prop', category: 'react' },
    { id: 3, text: 'Compare with Svelte each', category: 'svelte' },
  ]);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(
    () => filter === 'all' ? items : items.filter(i => i.category === filter),
    [items, filter]
  );

  return (
    <div>
      <div>
        {['all', 'react', 'svelte'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? 'bold' : 'normal' }}>
            {f}
          </button>
        ))}
      </div>
      <ul>
        {filtered.map(item => (
          <li key={item.id}>
            <span>{item.category}</span> {item.text}
            <button onClick={() => removeItem(item.id)}>remove</button>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p>No items match.</p>}
    </div>
  );
}`;

function BuggyNotifications() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button onClick={() => setCount(c => c + 1)} style={{ padding: '0.3rem 0.7rem', background: 'var(--color-accent)', color: '#0f172a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>+</button>
        <button onClick={() => setCount(c => Math.max(0, c - 1))} style={{ padding: '0.3rem 0.7rem', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>-</button>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Messages: {count}</span>
      </div>
      <div style={{ padding: '0.5rem', background: 'var(--color-bg-secondary)', borderRadius: '6px', fontSize: '0.85rem' }}>
        {count && <p style={{ color: 'var(--color-text)' }}>You have {count} new messages</p>}
        {count === 0 && <p style={{ color: '#ef4444', fontSize: '0.8rem' }}>⚠ Bug: renders "0" instead of nothing!</p>}
      </div>
    </div>
  );
}

function FixedNotifications() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button onClick={() => setCount(c => c + 1)} style={{ padding: '0.3rem 0.7rem', background: 'var(--color-accent)', color: '#0f172a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>+</button>
        <button onClick={() => setCount(c => Math.max(0, c - 1))} style={{ padding: '0.3rem 0.7rem', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>-</button>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Messages: {count}</span>
      </div>
      <div style={{ padding: '0.5rem', background: 'var(--color-bg-secondary)', borderRadius: '6px', fontSize: '0.85rem' }}>
        {count > 0 && <p style={{ color: 'var(--color-text)' }}>You have {count} new messages</p>}
        {count === 0 && <p style={{ color: 'var(--color-success)', fontSize: '0.8rem' }}>✓ No messages — renders nothing (correct)</p>}
      </div>
    </div>
  );
}

export default function ConditionalRendering() {
  return (
    <ChapterLayout id="conditional-rendering">
      <p style={pStyle}>
        Svelte uses template-level block syntax for control flow -- <code>{'{#if}'}</code>,
        <code> {'{:else}'}</code>, and <code>{'{#each}'}</code>. These are first-class features
        of the Svelte compiler. React has no special template syntax at all. Instead, you use
        plain JavaScript expressions inside JSX: ternary operators, logical <code>&&</code>,
        <code> .map()</code>, and early returns. The approach feels very different at first, but
        once you internalize it, you will appreciate that there are no new constructs to learn --
        only JavaScript you already know.
      </p>

      {/* ===== If/Else ===== */}
      <h2 style={h2Style}>Conditional Rendering: if/else</h2>
      <p style={pStyle}>
        In Svelte, you wrap conditional content in <code>{'{#if}'}</code> blocks. In React, you
        have several options. The ternary operator (<code>condition ? a : b</code>) is the most
        common for inline conditionals. For simpler show/hide logic, the logical AND
        (<code>condition && element</code>) works well. For complex multi-branch logic, you can
        extract the decision into a variable or use early returns.
      </p>

      <h3 style={h3Style}>Basic if/else</h3>
      <CodeComparison
        svelte={{
          code: `<script>
  let loggedIn = $state(false);
</script>

{#if loggedIn}
  <p>Welcome back!</p>
{:else}
  <p>Please log in.</p>
{/if}`,
          filename: 'Auth.svelte',
          highlight: [5, 7],
        }}
        react={{
          code: `function Auth() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {loggedIn
        ? <p>Welcome back!</p>
        : <p>Please log in.</p>
      }
    </div>
  );
}`,
          filename: 'Auth.tsx',
          highlight: [6, 7, 8],
        }}
        note="The ternary operator is React's if/else. Each branch must be a single expression, not a statement block."
      />

      <h3 style={h3Style}>Multi-branch: else if</h3>
      <p style={pStyle}>
        Svelte's <code>{'{:else if}'}</code> maps to nested ternaries in React. This is where
        readability can suffer. When you find yourself nesting more than two levels of ternary,
        it is usually better to extract the logic into a helper function or use early returns.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let status = $state('loading');
</script>

{#if status === 'loading'}
  <Spinner />
{:else if status === 'error'}
  <ErrorMessage />
{:else if status === 'empty'}
  <EmptyState />
{:else}
  <DataView />
{/if}`,
          filename: 'StatusView.svelte',
        }}
        react={{
          code: `function StatusView({ status }: { status: string }) {
  // Early return pattern -- cleaner than nested ternaries
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <ErrorMessage />;
  if (status === 'empty') return <EmptyState />;

  return <DataView />;
}

// Alternative: extracted variable
function StatusViewAlt({ status }: { status: string }) {
  let content: JSX.Element;
  if (status === 'loading') content = <Spinner />;
  else if (status === 'error') content = <ErrorMessage />;
  else if (status === 'empty') content = <EmptyState />;
  else content = <DataView />;

  return <div className="wrapper">{content}</div>;
}`,
          filename: 'StatusView.tsx',
          highlight: [3, 4, 5, 7],
        }}
        note="Early returns are the idiomatic React pattern for multi-branch conditionals. They keep the code flat and readable -- no nesting, no indentation cascade."
      />

      <h3 style={h3Style}>Logical AND for show/hide</h3>
      <p style={pStyle}>
        When you only need to show something conditionally (no else branch), the <code>&&</code> operator
        is concise. But there is a subtle trap: if the left side evaluates to <code>0</code> or
        <code> NaN</code>, React will render that value instead of skipping the element. Always
        ensure the left side is a boolean.
      </p>

      <CodeBlock
        code={`// Good -- boolean left side
{items.length > 0 && <ItemList items={items} />}
{isVisible && <Modal />}

// Dangerous -- renders "0" if items is empty
{items.length && <ItemList items={items} />}

// Fix: coerce to boolean
{!!items.length && <ItemList items={items} />}
{Boolean(items.length) && <ItemList items={items} />}`}
        language="tsx"
        filename="logical-and-gotchas.tsx"
        highlight={[2, 3, 6, 9, 10]}
      />

      <Callout type="gotcha" title="The 0 && Trap">
        In Svelte, <code>{'{#if items.length}'}</code> works fine because the template block is either
        rendered or not. In React, <code>{'{items.length && <List />}'}</code> will render the
        number <code>0</code> on screen when the array is empty, because <code>0</code> is a
        falsy but renderable value in JSX. Always use <code>{'{items.length > 0 && ...}'}</code> or
        double-bang <code>{'{!!items.length && ...}'}</code> instead.
      </Callout>

      {/* ===== List Rendering ===== */}
      <h2 style={h2Style}>List Rendering: each vs map</h2>
      <p style={pStyle}>
        Svelte's <code>{'{#each}'}</code> block is purpose-built for iteration. React uses
        JavaScript's native <code>.map()</code> method. The mapping is direct, but there is one
        critical difference that trips up every developer coming from Svelte: React requires an
        explicit <code>key</code> prop on every element in a mapped list.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let fruits = $state([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
  ]);
</script>

{#each fruits as fruit (fruit.id)}
  <li>{fruit.name}</li>
{/each}

<!-- With index -->
{#each fruits as fruit, index (fruit.id)}
  <li>{index + 1}. {fruit.name}</li>
{/each}`,
          filename: 'FruitList.svelte',
          highlight: [9, 14],
        }}
        react={{
          code: `function FruitList() {
  const [fruits] = useState([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
  ]);

  return (
    <ul>
      {fruits.map(fruit => (
        <li key={fruit.id}>{fruit.name}</li>
      ))}

      {/* With index */}
      {fruits.map((fruit, index) => (
        <li key={fruit.id}>
          {index + 1}. {fruit.name}
        </li>
      ))}
    </ul>
  );
}`,
          filename: 'FruitList.tsx',
          highlight: [11, 16],
        }}
        note="Svelte puts the key expression in parentheses after the each clause: (fruit.id). React puts it as a prop on the element: key={fruit.id}. Both serve the same purpose -- helping the framework reconcile which items changed."
      />

      {/* ===== Key Prop Deep Dive ===== */}
      <h2 style={h2Style}>The Key Prop: A Deep Dive</h2>
      <p style={pStyle}>
        Understanding the <code>key</code> prop is essential for writing correct React code. When
        React re-renders a list, it needs to figure out which items were added, removed, or moved.
        Without keys, React has no choice but to compare elements by position -- the first element
        in the old list maps to the first element in the new list, and so on. This positional
        diffing breaks catastrophically when items are reordered, inserted, or deleted from the
        middle of a list.
      </p>
      <p style={pStyle}>
        A <code>key</code> tells React: "this element represents this specific piece of data."
        When React sees that a key exists in both the old and new list but at a different position,
        it moves the DOM node instead of destroying and recreating it. This preserves internal
        component state, focus, scroll position, and CSS animations.
      </p>

      <h3 style={h3Style}>Keyed vs Unkeyed Behavior</h3>
      <p style={pStyle}>
        Consider a list of text inputs where each has typed content. Without proper keys, removing
        an item from the middle causes the remaining inputs to show the wrong values -- because
        React matched them by position, not identity. With proper keys, each input stays paired
        with its data.
      </p>

      <CodeBlock
        code={`// Without stable keys -- inputs lose their state on reorder
{items.map((item, index) => (
  <input key={index} defaultValue={item.name} />
))}

// With stable keys -- inputs maintain their state
{items.map(item => (
  <input key={item.id} defaultValue={item.name} />
))}`}
        language="tsx"
        filename="key-comparison.tsx"
        highlight={[3, 8]}
      />

      <h3 style={h3Style}>What Makes a Good Key</h3>
      <p style={pStyle}>
        A good key is stable (does not change between renders), unique (no two siblings share
        the same key), and predictable (derived from the data, not generated randomly on each render).
        Database IDs, slugs, and UUIDs are ideal. Indices are acceptable only when the list is
        static and never reordered.
      </p>

      <CodeBlock
        code={`// Good keys
<li key={user.id}>         {/* database ID */}
<li key={post.slug}>       {/* unique slug */}
<li key={item.sku}>        {/* product SKU */}

// Bad keys
<li key={index}>           {/* index -- breaks on reorder */}
<li key={Math.random()}>   {/* random -- remounts every render */}
<li key={item.name}>       {/* name -- not unique if duplicates exist */}`}
        language="tsx"
        filename="good-vs-bad-keys.tsx"
        highlight={[2, 3, 4, 7, 8, 9]}
      />

      <Callout type="gotcha" title="Array Index as Key">
        Using array index as key is an anti-pattern when list items can be reordered, added, or
        removed. When you prepend an item to a list keyed by index, every existing item's key
        shifts by one, causing React to update every single item in the list instead of just
        inserting the new one. This leads to bugs, wasted renders, and lost component state.
        Only use index as key for static lists that will never change order.
      </Callout>

      {/* ===== Index Access ===== */}
      <h3 style={h3Style}>Accessing the Index</h3>
      <p style={pStyle}>
        Svelte's <code>{'{#each items as item, index}'}</code> gives you the index as a second
        parameter. React's <code>.map()</code> provides the index as the second argument to the
        callback -- this is standard JavaScript, not a framework feature.
      </p>

      <CodeComparison
        svelte={{
          code: `{#each items as item, index (item.id)}
  <div class="row" class:even={index % 2 === 0}>
    <span class="number">{index + 1}</span>
    <span>{item.name}</span>
  </div>
{/each}`,
          filename: 'IndexedList.svelte',
          highlight: [1],
        }}
        react={{
          code: `{items.map((item, index) => (
  <div
    key={item.id}
    className={\`row \${index % 2 === 0 ? 'even' : ''}\`}
  >
    <span className="number">{index + 1}</span>
    <span>{item.name}</span>
  </div>
))}`,
          filename: 'IndexedList.tsx',
          highlight: [1, 3],
        }}
        note="Note that the index is available via .map() but should still NOT be used as the key. Use item.id as the key, and index only for display purposes like row numbering or zebra striping."
      />

      {/* ===== #key vs key prop ===== */}
      <h2 style={h2Style}>Forcing Remount: {'{#key}'} vs key Prop</h2>
      <p style={pStyle}>
        Svelte's <code>{'{#key expression}'}</code> block destroys and recreates its contents
        whenever the expression changes. This is useful for resetting component state or retriggering
        intro transitions. React achieves the same thing by changing the <code>key</code> prop on
        a component or element -- when the key changes, React unmounts the old instance and mounts
        a fresh one.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let selectedId = $state(1);
</script>

<!-- Destroys and recreates UserProfile
     whenever selectedId changes -->
{#key selectedId}
  <UserProfile id={selectedId} />
{/key}

<!-- Also triggers intro/outro transitions -->
{#key selectedId}
  <div transition:fade>
    <UserProfile id={selectedId} />
  </div>
{/key}`,
          filename: 'KeyBlock.svelte',
          highlight: [7, 12],
        }}
        react={{
          code: `function UserSwitcher() {
  const [selectedId, setSelectedId] = useState(1);

  return (
    <div>
      {/* Changing key forces full remount */}
      <UserProfile key={selectedId} id={selectedId} />

      {/* Useful for resetting form state */}
      <EditForm key={selectedId} userId={selectedId} />

      {/* Resetting an animation */}
      <AnimatedCard key={selectedId}>
        <UserProfile id={selectedId} />
      </AnimatedCard>
    </div>
  );
}`,
          filename: 'UserSwitcher.tsx',
          highlight: [7, 10, 13],
        }}
        note="This is a powerful pattern for resetting internal state. When a key changes, React treats it as a completely new component -- all useState values reset, all useEffect cleanups run, and all refs are reassigned."
      />

      <Callout type="insight" title="Key as a Reset Mechanism">
        The key prop is not just for lists. You can put a <code>key</code> on any component to force
        a full remount when data changes. This is the React equivalent of Svelte's{' '}
        <code>{'{#key}'}</code> block. Common use cases include resetting a form when switching
        between records, reinitializing an animation, or forcing a third-party library to
        re-initialize when its config changes.
      </Callout>

      {/* ===== Show/Hide vs Mount/Unmount ===== */}
      <h2 style={h2Style}>Show/Hide vs Mount/Unmount</h2>
      <p style={pStyle}>
        Svelte developers often toggle visibility using CSS classes: <code>class:hidden</code> keeps
        the element in the DOM but hides it visually. The <code>{'{#if}'}</code> block fully mounts
        and unmounts the element. Both patterns are natural in Svelte.
      </p>
      <p style={pStyle}>
        React strongly favors mount/unmount via conditional rendering. There is no built-in
        <code> class:hidden</code> directive. You can achieve the same effect with inline styles or
        CSS classes, but the React community defaults to conditional rendering because it avoids
        keeping invisible components alive in the tree (and running their effects, subscriptions,
        and re-renders).
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let visible = $state(true);
</script>

<!-- CSS toggle -- stays in DOM -->
<div class:hidden={!visible}>
  <HeavyComponent />
</div>

<!-- Mount/unmount -- removed from DOM -->
{#if visible}
  <HeavyComponent />
{/if}

<style>
  .hidden { display: none; }
</style>`,
          filename: 'ShowHide.svelte',
        }}
        react={{
          code: `function ShowHide() {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      {/* CSS toggle -- stays in DOM, keeps state */}
      <div style={{ display: visible ? 'block' : 'none' }}>
        <HeavyComponent />
      </div>

      {/* Mount/unmount -- the React default */}
      {visible && <HeavyComponent />}

      {/* Class-based toggle */}
      <div className={visible ? '' : 'hidden'}>
        <HeavyComponent />
      </div>
    </div>
  );
}`,
          filename: 'ShowHide.tsx',
          highlight: [7, 12, 15],
        }}
        note="CSS toggling preserves component state and avoids remount cost, but the component keeps running its effects. Conditional rendering is cleaner and cheaper when the component is rarely shown."
      />

      <p style={pStyle}>
        The choice between these approaches has performance implications. CSS hiding keeps the
        component mounted, so its effects keep running, its subscriptions stay active, and it
        participates in re-renders. Conditional rendering unmounts the component entirely, freeing
        those resources. Use CSS hiding when the component is frequently toggled and expensive to
        mount (like a complex modal with lots of state), and conditional rendering for everything
        else.
      </p>

      {/* ===== Interactive Demo ===== */}
      <h2 style={h2Style}>Interactive Demo</h2>
      <p style={pStyle}>
        This demo combines conditional rendering and list rendering in a single interactive
        example. Add items with a category, filter by category, and remove items. Notice how
        each item has a stable <code>key</code> based on its unique ID, and how the empty state
        message appears conditionally when no items match the filter.
      </p>

      <InteractiveDemo title="Filterable List with Add/Remove" code={filterableDemoCode}>
        <FilterableListDemo />
      </InteractiveDemo>

      {/* ===== Comparison Table ===== */}
      <h2 style={h2Style}>Rendering Patterns at a Glance</h2>

      <ComparisonTable
        caption="Svelte vs React conditional and list rendering"
        headers={['Pattern', 'Svelte', 'React']}
        rows={[
          ['If/else', '{#if cond}...{:else}...{/if}', '{cond ? <A /> : <B />}'],
          ['Else if', '{:else if cond2}', 'Nested ternary or early return'],
          ['Show if true', '{#if visible}<X />{/if}', '{visible && <X />}'],
          ['List rendering', '{#each items as item}', 'items.map(item => ...)'],
          ['List with key', '{#each items as item (item.id)}', '<li key={item.id}>'],
          ['List with index', '{#each items as item, i}', 'items.map((item, i) => ...)'],
          ['Force remount', '{#key expr}...{/key}', '<Comp key={expr} />'],
          ['CSS show/hide', 'class:hidden={!show}', 'style={{ display: show ? ... }}'],
          ['Empty list check', '{#if items.length === 0}', '{items.length === 0 && <Empty />}'],
          ['Render nothing', 'Empty {#if} block', 'return null'],
        ]}
      />

      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        The transition from Svelte's template blocks to React's JavaScript expressions is more
        of a mindset shift than a complexity increase. Instead of learning framework-specific
        syntax (<code>{'{#if}'}</code>, <code>{'{#each}'}</code>, <code>{'{#key}'}</code>), you
        use the JavaScript you already know -- ternaries, <code>.map()</code>, <code>&&</code>,
        and early returns. The one area that requires genuine new understanding is the{' '}
        <code>key</code> prop and React's reconciliation algorithm. Get keys right, and your lists
        will be fast, correct, and bug-free. Get them wrong, and you will face mysterious state
        bugs and wasted renders. When in doubt, always key on a stable, unique identifier from
        your data.
      </p>

      <CodeExercise
        id="conditional-fix-falsy"
        title="Fix the Falsy Render"
        type="fix-the-bug"
        description="When messageCount is 0, this component renders '0' on screen instead of nothing. This is a classic React gotcha with short-circuit evaluation. Fix it."
        initialCode={`function Notifications({ messageCount }) {
  return (
    <div>
      <h2>Dashboard</h2>
      {messageCount && (
        <p>You have {messageCount} new messages</p>
      )}
    </div>
  );
}`}
        solution={`function Notifications({ messageCount }) {
  return (
    <div>
      <h2>Dashboard</h2>
      {messageCount > 0 && (
        <p>You have {messageCount} new messages</p>
      )}
    </div>
  );
}`}
        validationPatterns={["messageCount > 0 &&"]}
        hints={[
          "In JSX, {0 && <Component />} renders the number 0, not nothing",
          "Svelte's {#if count} treats 0 as falsy and renders nothing. React's JSX renders 0 as text.",
          "Convert the condition to a boolean: use messageCount > 0 instead of messageCount"
        ]}
        buggyPreview={<BuggyNotifications />}
        solvedPreview={<FixedNotifications />}
      />
    </ChapterLayout>
  );
}
