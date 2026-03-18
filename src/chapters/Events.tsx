import { useState } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { Callout } from '../components/Callout';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

function EventDemo() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog(prev => [...prev.slice(-6), msg]);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          onClick={() => addLog('Click!')}
          onDoubleClick={() => addLog('Double click!')}
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--color-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
          }}
        >
          Click / Double Click
        </button>
        <button
          onMouseEnter={() => addLog('Mouse entered')}
          onMouseLeave={() => addLog('Mouse left')}
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
          }}
        >
          Hover Me
        </button>
        <button
          onMouseDown={() => addLog('Mouse down')}
          onMouseUp={() => addLog('Mouse up')}
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
          }}
        >
          Press & Release
        </button>
      </div>
      <div
        style={{
          padding: '0.75rem 1rem',
          background: '#011627',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: '#d6deeb',
          minHeight: '7rem',
        }}
      >
        {log.length === 0 ? (
          <span style={{ color: 'var(--color-text-muted)' }}>Interact with the buttons above...</span>
        ) : (
          log.map((entry, i) => (
            <div key={i} style={{ marginBottom: '0.15rem' }}>
              <span style={{ color: 'var(--color-accent)' }}>{'>'}</span> {entry}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BuggySearchForm() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  return (
    <form onSubmit={() => setSubmitted(query)}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', flex: 1 }} />
        <button type="submit" style={{ padding: '0.4rem 0.8rem', background: 'var(--color-accent)', color: '#0f172a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Search</button>
      </div>
      {submitted && <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '0.5rem' }}>⚠ Page would reload! (preventDefault missing)</p>}
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Try clicking Search — the page reloads</p>
    </form>
  );
}

function FixedSearchForm() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); setSubmitted(query); }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', flex: 1 }} />
        <button type="submit" style={{ padding: '0.4rem 0.8rem', background: 'var(--color-accent)', color: '#0f172a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Search</button>
      </div>
      {submitted && <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '0.5rem' }}>✓ Searching for: "{submitted}"</p>}
    </form>
  );
}

export default function Events() {
  return (
    <ChapterLayout id="events">
      <p style={pStyle}>
        If you have been writing Svelte, you are used to the <code>on:</code> directive for attaching event
        listeners to elements. React takes a different approach: event handlers are passed as props using
        camelCase naming. The conceptual mapping is straightforward, but there are several subtle differences
        in how events propagate, how modifiers work, and how child-to-parent communication is structured.
      </p>

      {/* ─── on:click vs onClick ─── */}
      <h2 style={h2Style}>on:click vs onClick</h2>
      <p style={pStyle}>
        In Svelte, you attach a click handler with <code>on:click={'{handleClick}'}</code>. React uses
        the JSX prop <code>onClick={'{handleClick}'}</code>. This is not just syntactic sugar — React's
        event props are actually part of a synthetic event system that normalizes browser differences.
        Every DOM event has a corresponding camelCase prop in React: <code>onMouseEnter</code>,
        <code> onKeyDown</code>, <code>onFocus</code>, <code>onSubmit</code>, and so on.
      </p>
      <h3 style={h3Style}>Basic Click Handler</h3>
      <CodeComparison
        svelte={{
          code: `<script>
  let count = $state(0);

  function handleClick() {
    count += 1;
  }
</script>

<button on:click={handleClick}>
  Clicked {count} times
</button>

<!-- Or inline -->
<button on:click={() => count += 1}>
  Clicked {count} times
</button>`,
          filename: 'Counter.svelte',
        }}
        react={{
          code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(c => c + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );

  // Or inline
  // <button onClick={() => setCount(c => c + 1)}>
}`,
          filename: 'Counter.tsx',
        }}
        note="Notice the casing difference: on:click (lowercase, colon-separated) vs onClick (camelCase). React's naming follows the DOM property convention rather than the HTML attribute convention."
      />

      {/* ─── Event Modifiers ─── */}
      <h2 style={h2Style}>Event Modifiers</h2>
      <p style={pStyle}>
        Svelte provides a concise pipe syntax for event modifiers: <code>on:click|preventDefault</code>,
        <code> on:click|stopPropagation|once</code>, and so on. These are compile-time conveniences that
        Svelte translates into the appropriate JavaScript calls. React has no equivalent shorthand — you
        call the methods on the event object yourself. This means more code, but it also means you have
        full control and nothing is hidden from you.
      </p>
      <h3 style={h3Style}>Preventing Default and Stopping Propagation</h3>
      <CodeComparison
        svelte={{
          code: `<script>
  function handleSubmit() {
    // form data handling
  }
</script>

<!-- Svelte modifiers: clean, declarative -->
<form on:submit|preventDefault={handleSubmit}>
  <button type="submit">Submit</button>
</form>

<!-- Chaining multiple modifiers -->
<div on:click|stopPropagation|preventDefault={handle}>
  Won't bubble, won't trigger default
</div>

<!-- Self modifier: only fires if
     event.target is the element itself -->
<div on:click|self={handleSelf}>
  Only fires on direct clicks
</div>

<!-- Once modifier -->
<button on:click|once={handleOnce}>
  Only fires once, then auto-removes
</button>`,
          filename: 'Modifiers.svelte',
        }}
        react={{
          code: `import { useRef, useEffect } from 'react';

function ModifiersExample() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // form data handling
  }

  function handle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    // ...
  }

  function handleSelf(e: React.MouseEvent) {
    if (e.target !== e.currentTarget) return;
    // Only processes direct clicks
  }

  // "once" requires useEffect + addEventListener
  useEffect(() => {
    const btn = buttonRef.current;
    const handler = () => { /* ... */ };
    btn?.addEventListener('click', handler, { once: true });
    return () => btn?.removeEventListener('click', handler);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div onClick={handle}>Manual modifier calls</div>
      <div onClick={handleSelf}>Self-check pattern</div>
      <button ref={buttonRef}>Once via useEffect</button>
    </form>
  );
}`,
          filename: 'Modifiers.tsx',
        }}
        note="Svelte modifiers are compile-time sugar. React requires explicit calls, which is more verbose but leaves nothing implicit. For 'once', you need a ref and native addEventListener."
      />

      {/* ─── Custom Events ─── */}
      <h2 style={h2Style}>Custom Events and Callback Props</h2>
      <p style={pStyle}>
        In Svelte, child-to-parent communication traditionally used <code>createEventDispatcher</code> to
        dispatch custom events that the parent would listen to with <code>on:eventname</code>. In Svelte 5
        with runes, this pattern is being replaced by simple callback props, which is exactly how React has
        always done it. In React, you pass a function as a prop to the child, and the child calls that
        function when it needs to communicate upward. There is no event dispatcher — just functions.
      </p>
      <h3 style={h3Style}>Child-to-Parent Communication</h3>
      <CodeComparison
        svelte={{
          code: `<!-- Svelte 4 style with createEventDispatcher -->
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleSelect(item) {
    dispatch('select', { item });
  }
</script>

<button on:click={() => handleSelect('apple')}>
  Pick Apple
</button>

<!-- Parent usage -->
<ItemPicker on:select={e => console.log(e.detail.item)} />

<!-- Svelte 5 runes style (callback props) -->
<script>
  let { onSelect } = $props();
</script>

<button on:click={() => onSelect?.('apple')}>
  Pick Apple
</button>

<!-- Parent: same as React now -->
<ItemPicker onSelect={item => console.log(item)} />`,
          filename: 'ItemPicker.svelte',
        }}
        react={{
          code: `// React: callback props — always has been this way

interface ItemPickerProps {
  onSelect: (item: string) => void;
}

function ItemPicker({ onSelect }: ItemPickerProps) {
  return (
    <button onClick={() => onSelect('apple')}>
      Pick Apple
    </button>
  );
}

// Parent usage
function Parent() {
  return (
    <ItemPicker
      onSelect={(item) => console.log(item)}
    />
  );
}

// Typed event data — just function arguments
interface FilterChangeEvent {
  category: string;
  sortBy: 'name' | 'date';
}

interface FilterProps {
  onChange: (event: FilterChangeEvent) => void;
}

function Filter({ onChange }: FilterProps) {
  return (
    <button onClick={() => onChange({
      category: 'fruit',
      sortBy: 'name',
    })}>
      Apply Filter
    </button>
  );
}`,
          filename: 'ItemPicker.tsx',
        }}
        note="Svelte 5's runes pattern converges with React here. Callback props are simple, type-safe, and require no special API. React never had a dispatch/event-detail layer."
      />

      {/* ─── Event Forwarding ─── */}
      <h2 style={h2Style}>Event Forwarding</h2>
      <p style={pStyle}>
        Svelte has a shorthand for event forwarding: writing <code>on:click</code> on a child element
        without a handler re-dispatches that event to the parent. This is especially useful for wrapper
        components that need to pass through events they do not handle themselves. React does not have this
        built-in — instead, you spread the remaining props (which include the event handlers) onto the
        inner element using the rest/spread pattern.
      </p>
      <h3 style={h3Style}>Forwarding Events Through Wrapper Components</h3>
      <CodeComparison
        svelte={{
          code: `<!-- FancyButton.svelte -->
<script>
  let { children } = $props();
</script>

<!-- on:click without a handler = forwarding -->
<button class="fancy" on:click on:mouseenter on:mouseleave>
  {@render children()}
</button>

<!-- Parent automatically receives the event -->
<FancyButton on:click={handleClick}>
  Click me
</FancyButton>`,
          filename: 'FancyButton.svelte',
        }}
        react={{
          code: `// FancyButton.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface FancyButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

// Spread remaining props (includes all handlers)
function FancyButton({
  children,
  ...rest
}: FancyButtonProps) {
  return (
    <button className="fancy" {...rest}>
      {children}
    </button>
  );
}

// Parent — onClick, onMouseEnter, etc.
// are all forwarded via ...rest
<FancyButton onClick={handleClick}>
  Click me
</FancyButton>`,
          filename: 'FancyButton.tsx',
        }}
        note="React's spread pattern forwards ALL props including event handlers, aria attributes, and data attributes — not just specific events. This is more flexible but requires you to be intentional about what you spread."
      />

      {/* ─── Synthetic Events Gotcha ─── */}
      <Callout type="gotcha" title="Synthetic Events">
        React uses synthetic events (<code>SyntheticEvent</code>). Every event handler receives a React
        wrapper around the native browser event, not the raw DOM event itself. This wrapper normalizes
        cross-browser differences and exposes the same interface regardless of the browser. In older
        versions of React (before 17), these events were pooled and reused for performance — meaning you
        could not access event properties asynchronously. In React 18+ this pooling is gone, but the
        wrapper still exists. If you ever need the native event, call <code>e.nativeEvent</code>.
      </Callout>

      {/* ─── Interactive Demo ─── */}
      <h2 style={h2Style}>Try It: Event Handling in Action</h2>
      <p style={pStyle}>
        Interact with the buttons below to see how different event types fire in React.
        Each button demonstrates a different event pattern — single click, double click,
        hover (mouseenter/mouseleave), and press-release (mousedown/mouseup).
      </p>
      <InteractiveDemo
        title="Event Handling Playground"
        code={`function EventDemo() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) =>
    setLog(prev => [...prev.slice(-6), msg]);

  return (
    <div>
      <button
        onClick={() => addLog('Click!')}
        onDoubleClick={() => addLog('Double click!')}
      >
        Click / Double Click
      </button>
      <button
        onMouseEnter={() => addLog('Mouse entered')}
        onMouseLeave={() => addLog('Mouse left')}
      >
        Hover Me
      </button>
      <button
        onMouseDown={() => addLog('Mouse down')}
        onMouseUp={() => addLog('Mouse up')}
      >
        Press & Release
      </button>
      <div className="log">{log.map(e => <div>> {e}</div>)}</div>
    </div>
  );
}`}
      >
        <EventDemo />
      </InteractiveDemo>

      {/* ─── Comparison Table ─── */}
      <h2 style={h2Style}>Event Patterns at a Glance</h2>
      <ComparisonTable
        caption="Svelte vs React Event Handling"
        headers={['Pattern', 'Svelte', 'React']}
        rows={[
          ['Click handler', 'on:click={handler}', 'onClick={handler}'],
          ['Inline handler', 'on:click={() => ...}', 'onClick={() => ...}'],
          ['preventDefault', 'on:submit|preventDefault', 'e.preventDefault() in handler'],
          ['stopPropagation', 'on:click|stopPropagation', 'e.stopPropagation() in handler'],
          ['once modifier', 'on:click|once={handler}', 'useEffect + addEventListener({ once: true })'],
          ['self modifier', 'on:click|self={handler}', 'if (e.target !== e.currentTarget) return'],
          ['Custom events (Svelte 4)', 'dispatch("name", data)', 'N/A — use callback props'],
          ['Callback props', 'let { onEvent } = $props()', 'function Comp({ onEvent }: Props)'],
          ['Event forwarding', 'on:click (no handler)', '{...rest} spread on element'],
          ['Native event access', 'Direct native events', 'e.nativeEvent'],
          ['Event typing', 'Implicit from element', 'React.MouseEvent<HTMLButtonElement>'],
          ['Capture phase', 'on:click|capture', 'onClickCapture={handler}'],
        ]}
      />

      <p style={pStyle}>
        The biggest adjustment for Svelte developers is the absence of event modifiers. In practice, calling
        <code> e.preventDefault()</code> and <code>e.stopPropagation()</code> manually becomes second
        nature quickly. The real mental shift is recognizing that in React, events are just props — there
        is no separate event system. A callback passed as <code>onClick</code> is indistinguishable from any
        other prop, which means the same patterns for composition, typing, and testing apply uniformly.
      </p>

      <CodeExercise
        id="events-complete-handler"
        title="Complete the Form Handler"
        type="complete-the-code"
        description="This form reloads the page on submit because the default behavior isn't prevented. In Svelte you'd use on:submit|preventDefault. Complete the React equivalent."
        initialCode={`function SearchForm() {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    // TODO: Prevent the default form submission
    console.log('Searching for:', query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
}`}
        solution={`function SearchForm() {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Searching for:', query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
}`}
        validationPatterns={["e.preventDefault()"]}
        hints={[
          "Svelte uses on:submit|preventDefault. React has no event modifiers.",
          "You need to call a method on the event object inside the handler",
          "Add e.preventDefault() at the start of handleSubmit"
        ]}
        buggyPreview={<BuggySearchForm />}
        solvedPreview={<FixedSearchForm />}
      />
    </ChapterLayout>
  );
}
