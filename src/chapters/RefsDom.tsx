import { useRef } from 'react';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { ChapterLayout } from '../components/ChapterLayout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

// -- Interactive Demo: Auto-focus Input and Scroll to Element --

function AutoFocusAndScrollDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const sections = ['Section A', 'Section B', 'Section C', 'Section D'];
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const scrollTo = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  };

  return (
    <div>
      {/* Auto-focus section */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '0.5rem',
            fontWeight: 600,
          }}
        >
          Auto-focus Input
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            ref={inputRef}
            placeholder="Click the button to focus me..."
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          <button
            onClick={focusInput}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Focus Input
          </button>
        </div>
      </div>

      {/* Scroll-to section */}
      <div>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '0.5rem',
            fontWeight: 600,
          }}
        >
          Scroll to Element
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {sections.map((name, i) => (
            <button
              key={name}
              onClick={() => scrollTo(i)}
              style={{
                padding: '0.35rem 0.7rem',
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <div
          style={{
            height: 120,
            overflow: 'auto',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg-tertiary)',
          }}
        >
          {sections.map((name, i) => (
            <div
              key={name}
              ref={el => { sectionRefs.current[i] = el; }}
              style={{
                padding: '1.5rem 1rem',
                borderBottom: i < sections.length - 1 ? '1px solid var(--color-border)' : undefined,
                fontSize: '0.85rem',
                color: 'var(--color-text)',
                fontWeight: 500,
              }}
            >
              {name} -- scroll target
            </div>
          ))}
        </div>
      </div>

      <p
        style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          marginTop: '0.75rem',
          fontFamily: 'var(--font-mono)',
        }}
      >
        Both use useRef to get a DOM reference and call native DOM methods
      </p>
    </div>
  );
}

const refDemoCode = `function AutoFocusAndScrollDemo() {
  const inputRef = useRef(null);
  const sectionRefs = useRef([]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const scrollTo = (index) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Focus me..." />
      <button onClick={focusInput}>Focus Input</button>

      {sections.map((name, i) => (
        <div
          key={name}
          ref={el => { sectionRefs.current[i] = el; }}
        >
          {name}
        </div>
      ))}
    </div>
  );
}`;

export default function RefsDom() {
  return (
    <ChapterLayout id="refs-dom">
      <p style={pStyle}>
        Sometimes you need to reach into the DOM directly -- to focus an input, measure an
        element's size, integrate a third-party library, or scroll to a specific position.
        Svelte handles this with <code>bind:this</code>, which gives you a reference to the
        underlying DOM node. React uses the <code>useRef</code> hook, which serves the same
        purpose but is also a general-purpose mutable container that persists across renders.
        This dual nature of <code>useRef</code> is one of the most useful (and initially
        confusing) concepts in React.
      </p>

      {/* ===== bind:this vs useRef ===== */}
      <h2 style={h2Style}>Getting a DOM Reference</h2>
      <p style={pStyle}>
        In Svelte, you declare a variable and use <code>bind:this</code> to bind it to a DOM
        element. The variable is populated after the component mounts. In React, you create a
        ref with <code>useRef</code> and attach it to an element via the <code>ref</code> prop.
        The DOM node is available at <code>ref.current</code> after the component mounts.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  import { onMount } from 'svelte';

  let inputEl;

  onMount(() => {
    // inputEl is now the DOM node
    inputEl.focus();
  });
</script>

<input bind:this={inputEl} />

<!-- With Svelte 5 -->
<script>
  let inputEl = $state();

  $effect(() => {
    if (inputEl) {
      inputEl.focus();
    }
  });
</script>

<input bind:this={inputEl} />`,
          filename: 'AutoFocus.svelte',
          highlight: [4, 8, 12, 17],
        }}
        react={{
          code: `import { useRef, useEffect } from 'react';

function AutoFocus() {
  // Create a ref — starts as null
  const inputRef = useRef<HTMLInputElement>(null);

  // Access the DOM node in useEffect (after mount)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Attach the ref via the ref prop
  return <input ref={inputRef} />;
}`,
          filename: 'AutoFocus.tsx',
          highlight: [5, 9, 13],
        }}
        note="bind:this assigns directly to a variable. useRef wraps the value in a { current: ... } object. This extra layer exists because React needs a stable reference identity across renders."
      />

      <h3 style={h3Style}>Why the .current Wrapper?</h3>
      <p style={pStyle}>
        You might wonder why React wraps the DOM node in <code>{'{current: node}'}</code> instead
        of assigning directly like Svelte does. The reason is that React functions re-execute
        on every render. A plain variable would be recreated each time, losing the reference.
        The <code>useRef</code> object is created once and persists across renders -- React
        guarantees the same object identity. The <code>.current</code> property is mutable,
        allowing React to update the DOM reference without creating a new container object.
      </p>

      {/* ===== useRef for Values ===== */}
      <h2 style={h2Style}>useRef for Mutable Values</h2>
      <p style={pStyle}>
        Here is where <code>useRef</code> diverges from <code>bind:this</code>. In Svelte,
        if you need a mutable value that persists across renders but does not trigger reactivity,
        you just use a plain <code>let</code> variable in a <code>.svelte</code> file (in
        Svelte 4) or carefully avoid wrapping it in <code>$state</code> (in Svelte 5). In React,
        a plain variable inside a component function is re-initialized on every render. To
        persist a value across renders without triggering a re-render when it changes, you use
        <code> useRef</code>.
      </p>

      <h3 style={h3Style}>The Mutable Box</h3>
      <p style={pStyle}>
        Think of <code>useRef</code> as a mutable box that React ignores for rendering purposes.
        You can put anything in it: a timer ID, a previous value, a WebSocket instance, a flag.
        Unlike <code>useState</code>, changing <code>.current</code> never causes a re-render.
        This makes it perfect for values that your effects or event handlers need but that
        should not affect the UI directly.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  // Svelte: plain variables persist across renders
  // and don't trigger reactivity (Svelte 4)
  let intervalId;
  let renderCount = 0;
  let previousValue;

  // In Svelte 5, just don't use $state()
  // let intervalId;  // not reactive
  // let count = $state(0);  // reactive

  function startTimer() {
    intervalId = setInterval(() => {
      console.log('tick');
    }, 1000);
  }

  function stopTimer() {
    clearInterval(intervalId);
  }
</script>`,
          filename: 'MutableValues.svelte',
          highlight: [4, 5, 6],
        }}
        react={{
          code: `import { useRef, useState } from 'react';

function MutableValues() {
  // useRef: persists across renders, no re-render
  const intervalRef = useRef<number | null>(null);
  const renderCountRef = useRef(0);
  const previousValueRef = useRef<string>('');

  // This increments every render but
  // never triggers one
  renderCountRef.current += 1;

  function startTimer() {
    intervalRef.current = window.setInterval(() => {
      console.log('tick');
    }, 1000);
  }

  function stopTimer() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return <div>...</div>;
}`,
          filename: 'MutableValues.tsx',
          highlight: [5, 6, 7, 11],
        }}
        note="In Svelte, regular variables already persist and do not trigger reactivity. In React, every function-body variable is recreated each render. useRef is the escape hatch for mutable, non-reactive persistence."
      />

      <h3 style={h3Style}>Storing Previous Values</h3>
      <p style={pStyle}>
        A classic use of <code>useRef</code> is storing the previous value of a prop or state
        variable. This pattern is common when you need to compare the current value with the
        previous one, for example to animate transitions or detect direction of change.
      </p>

      <CodeBlock
        code={`import { useRef, useEffect } from 'react';

// Custom hook: usePrevious
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  });
  // No dependency array: runs after EVERY render
  // so ref.current always holds the previous value

  return ref.current;
}

// Usage
function PriceDisplay({ price }: { price: number }) {
  const previousPrice = usePrevious(price);

  const direction =
    previousPrice !== undefined
      ? price > previousPrice
        ? 'up'
        : price < previousPrice
          ? 'down'
          : 'same'
      : 'same';

  return (
    <div>
      <span>{price}</span>
      {direction === 'up' && <span style={{ color: 'green' }}> ▲</span>}
      {direction === 'down' && <span style={{ color: 'red' }}> ▼</span>}
    </div>
  );
}`}
        language="tsx"
        filename="usePrevious.tsx"
        highlight={[4, 5, 7, 8, 9, 18]}
      />

      <Callout type="gotcha" title="useRef Does Not Trigger Re-renders">
        <code>useRef</code> does not trigger re-renders. If you need a DOM ref AND want to
        react to it changing, you need a callback ref or state. A callback ref is a function
        passed as the <code>ref</code> prop: <code>ref={'{(node) => { /* node is the DOM element */ }}'}</code>.
        React calls this function when the element mounts (with the node) and unmounts (with null).
        If you store it in state instead of a ref, the state update will trigger a re-render,
        allowing you to react to the element's presence.
      </Callout>

      <h3 style={h3Style}>Callback Refs</h3>
      <p style={pStyle}>
        When you pass a function as the <code>ref</code> prop, React calls it with the DOM
        element when the component mounts, and with <code>null</code> when it unmounts. This
        is useful when you need to perform setup logic when an element appears or measure it
        dynamically.
      </p>

      <CodeBlock
        code={`import { useCallback, useState } from 'react';

function MeasuredBox() {
  const [height, setHeight] = useState(0);

  // Callback ref — called when element mounts/unmounts
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <div ref={measuredRef}>
        <p>This content has variable height.</p>
        <p>Add more lines to see the measurement update.</p>
      </div>
      <p>Measured height: {Math.round(height)}px</p>
    </>
  );
}`}
        language="tsx"
        filename="CallbackRef.tsx"
        highlight={[7, 8, 9, 10, 15]}
      />

      {/* ===== Forwarding Refs ===== */}
      <h2 style={h2Style}>Forwarding Refs</h2>
      <p style={pStyle}>
        In Svelte, <code>bind:this</code> on a component gives you the component instance
        (Svelte 4) or works with exported bindings. In React, the <code>ref</code> prop on a
        component does not automatically forward to the inner DOM element. You must explicitly
        opt in using <code>forwardRef</code>. This is because React components are functions,
        not DOM elements -- there is no single "root element" to forward to. The component
        author must decide which element (if any) should receive the forwarded ref.
      </p>

      <h3 style={h3Style}>forwardRef</h3>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: bind:this on a component -->
<!-- TextInput.svelte -->
<script>
  let { value = $bindable('') } = $props();
  let inputEl;

  // Export a method for parent to call
  export function focus() {
    inputEl.focus();
  }
</script>

<input bind:this={inputEl} bind:value />

<!-- Parent.svelte -->
<script>
  let inputComponent;
</script>

<TextInput bind:this={inputComponent} />
<button on:click={() => inputComponent.focus()}>
  Focus
</button>`,
          filename: 'TextInput.svelte',
          highlight: [8, 9, 10, 20],
        }}
        react={{
          code: `import { forwardRef, useRef } from 'react';

// forwardRef wraps the component to accept a ref
const TextInput = forwardRef<
  HTMLInputElement,
  { value: string; onChange: (v: string) => void }
>(({ value, onChange }, ref) => {
  return (
    <input
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
});

// Parent — ref points to the <input> DOM node
function Parent() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <TextInput
        ref={inputRef}
        value=""
        onChange={() => {}}
      />
      <button onClick={() => inputRef.current?.focus()}>
        Focus
      </button>
    </>
  );
}`,
          filename: 'TextInput.tsx',
          highlight: [4, 5, 6, 7, 10, 24],
        }}
        note="forwardRef lets a parent access a specific DOM element inside a child component. Without it, the ref prop on a custom component does nothing. In React 19, ref is available as a regular prop without forwardRef."
      />

      <h3 style={h3Style}>useImperativeHandle</h3>
      <p style={pStyle}>
        Sometimes you do not want to expose the raw DOM node to the parent. Instead, you want
        to expose a limited API -- specific methods the parent can call. This is what
        <code> useImperativeHandle</code> does. It customizes the value that a parent receives
        when using a ref on your component. This is React's equivalent of Svelte's
        <code> export function</code> pattern for component methods.
      </p>

      <CodeBlock
        code={`import {
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';

// Define the handle type
interface VideoPlayerHandle {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, {
  src: string;
}>(({ src }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Expose only specific methods to the parent
  useImperativeHandle(ref, () => ({
    play() {
      videoRef.current?.play();
    },
    pause() {
      videoRef.current?.pause();
    },
    seekTo(time: number) {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
  }));

  return <video ref={videoRef} src={src} />;
});

// Parent — gets the custom handle, not the DOM node
function Parent() {
  const playerRef = useRef<VideoPlayerHandle>(null);

  return (
    <>
      <VideoPlayer ref={playerRef} src="/video.mp4" />
      <button onClick={() => playerRef.current?.play()}>
        Play
      </button>
      <button onClick={() => playerRef.current?.seekTo(0)}>
        Restart
      </button>
    </>
  );
}`}
        language="tsx"
        filename="VideoPlayer.tsx"
        highlight={[8, 9, 10, 11, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 39]}
      />

      <p style={pStyle}>
        The key insight is that <code>useImperativeHandle</code> creates an abstraction layer.
        The parent cannot access the underlying <code>&lt;video&gt;</code> element directly --
        it only sees <code>play()</code>, <code>pause()</code>, and <code>seekTo()</code>. This
        is good API design: you expose intention, not implementation. If you later replace the
        <code> &lt;video&gt;</code> with a third-party player library, the parent's code does
        not need to change.
      </p>

      {/* ===== Lists of Refs ===== */}
      <h2 style={h2Style}>Refs in Lists</h2>
      <p style={pStyle}>
        A common need is to hold refs for a dynamic list of elements -- for example, to scroll
        to a specific list item or measure multiple elements. In Svelte, you can use
        <code> bind:this</code> in an <code>{'{#each}'}</code> block and store refs in an array.
        In React, you use a callback ref that stores the element in an array or Map.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let { items } = $props();
  let itemEls = [];

  function scrollToItem(index) {
    itemEls[index]?.scrollIntoView({
      behavior: 'smooth'
    });
  }
</script>

{#each items as item, i}
  <div bind:this={itemEls[i]}>
    {item.name}
  </div>
{/each}`,
          filename: 'ScrollableList.svelte',
          highlight: [3, 13],
        }}
        react={{
          code: `import { useRef } from 'react';

function ScrollableList({ items }) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  function scrollToItem(index: number) {
    itemRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <>
      {items.map((item, i) => (
        <div
          key={item.id}
          ref={el => { itemRefs.current[i] = el; }}
        >
          {item.name}
        </div>
      ))}
    </>
  );
}`,
          filename: 'ScrollableList.tsx',
          highlight: [4, 17],
        }}
        note="Use a callback ref (ref={el => { ... }}) to populate an array of refs. This pattern works for any dynamic list where you need DOM access to individual items."
      />

      {/* ===== Interactive Demo ===== */}
      <h2 style={h2Style}>Try It: Refs in Action</h2>
      <p style={pStyle}>
        This demo shows two common ref use cases. The auto-focus input uses a single
        <code> useRef</code> to focus a text input on button click. The scroll-to-element
        section uses an array of refs to scroll a container to a specific child element.
        Both patterns use <code>useRef</code> to get a DOM reference and call native browser
        APIs on it.
      </p>

      <InteractiveDemo title="Auto-focus and Scroll-to-Element" code={refDemoCode}>
        <AutoFocusAndScrollDemo />
      </InteractiveDemo>

      {/* ===== React 19 Changes ===== */}
      <h2 style={h2Style}>React 19: ref as a Regular Prop</h2>
      <p style={pStyle}>
        React 19 simplifies ref forwarding significantly. You no longer need <code>forwardRef</code>
        -- the <code>ref</code> prop is available as a regular prop on function components. This
        eliminates one of React's most awkward APIs and brings the DX closer to Svelte's
        straightforward <code>bind:this</code>.
      </p>

      <CodeBlock
        code={`// React 19: ref is just a prop, no forwardRef needed
function TextInput({ ref, value, onChange }) {
  return (
    <input
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

// Parent — same usage as before
function Parent() {
  const inputRef = useRef(null);
  return <TextInput ref={inputRef} value="" onChange={() => {}} />;
}

// useImperativeHandle still works the same way
function VideoPlayer({ ref, src }) {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
  }));

  return <video ref={videoRef} src={src} />;
}`}
        language="tsx"
        filename="React19Refs.tsx"
        highlight={[2, 5, 19]}
      />

      {/* ===== Comparison Table ===== */}
      <h2 style={h2Style}>Refs and DOM Access at a Glance</h2>

      <ComparisonTable
        caption="Svelte DOM Access vs React Refs"
        headers={['Pattern', 'Svelte', 'React']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['DOM reference', 'bind:this={el}', 'ref={useRef()} + el.current'],
          ['Access after mount', 'onMount / $effect', 'useEffect(() => {}, [])'],
          ['Mutable non-reactive value', 'Plain let variable', 'useRef(initialValue)'],
          ['Store previous value', 'Plain variable + reactive statement', 'useRef + useEffect (usePrevious)'],
          ['Forward ref to child', 'bind:this on component', 'forwardRef (or ref prop in React 19)'],
          ['Expose component API', 'export function', 'useImperativeHandle'],
          ['Refs in loops', 'bind:this={arr[i]}', 'Callback ref: ref={el => arr[i] = el}'],
          ['Callback ref', 'Not needed (bind:this is reactive)', 'ref={(node) => { ... }}'],
          ['Measure DOM', 'bind:this + onMount', 'useRef + useLayoutEffect'],
          ['Re-render on ref change', 'bind:this with $state', 'Callback ref + useState'],
        ]}
      />

      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        Svelte's <code>bind:this</code> is simpler because Svelte components have a clear
        lifecycle: the variable is populated after mount, and the compiler knows when it changes.
        React's <code>useRef</code> is more general-purpose -- it is both a DOM reference tool
        and a mutable value container. This dual nature can be confusing at first, but it is
        extremely powerful. Use <code>useRef</code> for DOM access when you need to call
        imperative APIs (focus, scroll, measure). Use it for mutable values when you need
        persistence across renders without triggering re-renders (timer IDs, previous values,
        flags). And remember the critical distinction: <code>useState</code> triggers re-renders,
        <code> useRef</code> does not. If you need the UI to update when a value changes, use
        state. If you just need to remember something silently, use a ref.
      </p>
    </ChapterLayout>
  );
}
