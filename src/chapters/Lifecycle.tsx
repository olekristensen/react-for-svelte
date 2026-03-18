import { useState, useEffect, useRef } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { Callout } from '../components/Callout';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

function TimerDemo() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    setSeconds(0);
  };

  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '2rem',
        fontWeight: 700,
        textAlign: 'center',
        padding: '1rem',
        color: running ? 'var(--color-success)' : 'var(--color-text)',
        transition: 'color 0.3s',
      }}>
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:
        {String(seconds % 60).padStart(2, '0')}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          onClick={() => setRunning(r => !r)}
          style={{
            padding: '0.5rem 1.25rem',
            background: running ? 'var(--color-warning, #fbbf24)' : 'var(--color-success)',
            color: running ? '#000' : '#fff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {running ? 'Pause' : seconds > 0 ? 'Resume' : 'Start'}
        </button>
        <button
          onClick={reset}
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
          Reset
        </button>
      </div>
      <p style={{
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
        marginTop: '0.75rem',
        fontFamily: 'var(--font-mono)',
      }}>
        {running
          ? 'useEffect cleanup will clear the interval when you pause or unmount'
          : 'Timer paused — interval has been cleaned up'}
      </p>
    </div>
  );
}

function BuggyTimer() {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!active) return;
    setInterval(() => setSeconds(s => s + 1), 1000);
    // No cleanup! (intentionally leaks)
  }, [active]);
  return (
    <div>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Elapsed: {seconds}s</p>
      <button onClick={() => setActive(!active)} style={{ padding: '0.4rem 0.8rem', background: active ? '#ef4444' : 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 0, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
        {active ? 'Unmount Timer' : 'Remount Timer'}
      </button>
      {!active && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem' }}>Timer keeps running after unmount</p>}
    </div>
  );
}

function FixedTimer() {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Elapsed: {seconds}s</p>
      <button onClick={() => setActive(!active)} style={{ padding: '0.4rem 0.8rem', background: active ? '#ef4444' : 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 0, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
        {active ? 'Unmount Timer' : 'Remount Timer'}
      </button>
      {!active && <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.5rem' }}>Timer properly stopped on unmount</p>}
    </div>
  );
}

export default function Lifecycle() {
  return (
    <ChapterLayout id="lifecycle">
      <p style={pStyle}>
        Svelte gives you a set of clearly named lifecycle functions: <code>onMount</code>,
        <code> onDestroy</code>, <code>beforeUpdate</code>, and <code>afterUpdate</code>. Each one
        does exactly what its name says. React collapses most of this into a single primitive:
        <code> useEffect</code>. This is simultaneously React's most powerful and most confusing hook.
        Understanding it deeply is essential, because nearly every React component you write will
        use it — and misusing it is the source of a large percentage of React bugs.
      </p>

      {/* ─── onMount vs useEffect ─── */}
      <h2 style={h2Style}>onMount vs useEffect</h2>
      <p style={pStyle}>
        Svelte's <code>onMount</code> runs once after the component is first rendered into the DOM. The
        React equivalent is <code>useEffect</code> with an empty dependency array <code>[]</code>. The
        empty array tells React "this effect has no dependencies, so only run it once after the initial
        render." If you forget the array, the effect runs after every single render — a common mistake
        that can cause infinite loops or excessive API calls.
      </p>
      <h3 style={h3Style}>Running Code on Mount</h3>
      <CodeComparison
        svelte={{
          code: `<script>
  import { onMount } from 'svelte';

  let data = $state(null);
  let loading = $state(true);

  onMount(async () => {
    const res = await fetch('/api/data');
    data = await res.json();
    loading = false;
  });

  // onMount can return a cleanup function
  onMount(() => {
    const id = setInterval(() => {
      console.log('tick');
    }, 1000);

    return () => clearInterval(id);
  });
</script>

{#if loading}
  <p>Loading...</p>
{:else}
  <p>{data.title}</p>
{/if}`,
          filename: 'DataFetcher.svelte',
        }}
        react={{
          code: `import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Empty dependency array = run once on mount
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    fetchData();
  }, []); // <-- [] is critical

  // Separate effect for the interval
  useEffect(() => {
    const id = setInterval(() => {
      console.log('tick');
    }, 1000);

    return () => clearInterval(id); // cleanup
  }, []);

  if (loading) return <p>Loading...</p>;
  return <p>{data.title}</p>;
}`,
          filename: 'DataFetcher.tsx',
        }}
        note="Note that useEffect's callback cannot be async directly. You must define an async function inside and call it. Also note that React encourages splitting separate concerns into separate useEffect calls."
      />

      {/* ─── Cleanup / onDestroy ─── */}
      <h2 style={h2Style}>Cleanup and Destruction</h2>
      <p style={pStyle}>
        Svelte has a dedicated <code>onDestroy</code> lifecycle function that runs when the component is
        removed from the DOM. React folds this into <code>useEffect</code> — the function you return
        from your effect callback is your cleanup function. This cleanup runs when the component unmounts,
        but also before the effect re-runs if its dependencies change. This dual purpose is deliberate:
        React wants you to think of setup and teardown as two halves of the same concern.
      </p>
      <h3 style={h3Style}>Cleanup on Unmount</h3>
      <CodeComparison
        svelte={{
          code: `<script>
  import { onMount, onDestroy } from 'svelte';

  let width = $state(0);

  function handleResize() {
    width = window.innerWidth;
  }

  onMount(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // initial value
  });

  onDestroy(() => {
    window.removeEventListener('resize', handleResize);
  });

  // Or combine with onMount's return:
  // onMount(() => {
  //   window.addEventListener('resize', handleResize);
  //   return () =>
  //     window.removeEventListener('resize', handleResize);
  // });
</script>

<p>Window width: {width}px</p>`,
          filename: 'WindowSize.svelte',
        }}
        react={{
          code: `import { useState, useEffect } from 'react';

function WindowSize() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Setup
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // initial value

    // Cleanup — returned function runs on:
    // 1. Component unmount
    // 2. Before effect re-runs (if deps change)
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // empty deps = mount/unmount only

  return <p>Window width: {width}px</p>;
}`,
          filename: 'WindowSize.tsx',
        }}
        note="React merges setup and teardown into one function. The returned cleanup function is the equivalent of onDestroy, but it also runs before re-execution if dependencies change."
      />

      {/* ─── The Dependency Array ─── */}
      <h2 style={h2Style}>The Dependency Array</h2>
      <p style={pStyle}>
        The dependency array is React's key innovation for effects — and its biggest footgun. It is the
        second argument to <code>useEffect</code>, and it controls when the effect re-runs. Svelte's
        <code> $effect</code> automatically tracks which reactive values you read inside the effect body
        and re-runs when any of them change. React requires you to explicitly list every value from the
        component scope that the effect uses. Get this wrong, and you either have stale closures (missing
        dependencies) or infinite loops (unstable references in the array).
      </p>
      <h3 style={h3Style}>Dependency Tracking: Automatic vs Explicit</h3>
      <CodeComparison
        svelte={{
          code: `<script>
  let searchTerm = $state('');
  let category = $state('all');
  let results = $state([]);

  // $effect auto-tracks: searchTerm and category
  // Re-runs whenever either changes
  $effect(() => {
    const controller = new AbortController();

    fetch(
      \`/api/search?q=\${searchTerm}&cat=\${category}\`,
      { signal: controller.signal }
    )
      .then(r => r.json())
      .then(data => results = data)
      .catch(() => {});

    // Cleanup: abort on re-run or destroy
    return () => controller.abort();
  });
</script>

<input bind:value={searchTerm} />
<select bind:value={category}>
  <option value="all">All</option>
  <option value="books">Books</option>
</select>`,
          filename: 'Search.svelte',
        }}
        react={{
          code: `import { useState, useEffect } from 'react';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState([]);

  // YOU must list deps: [searchTerm, category]
  useEffect(() => {
    const controller = new AbortController();

    fetch(
      \`/api/search?q=\${searchTerm}&cat=\${category}\`,
      { signal: controller.signal }
    )
      .then(r => r.json())
      .then(data => setResults(data))
      .catch(() => {});

    return () => controller.abort();
  }, [searchTerm, category]); // <-- explicit!

  return (
    <>
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="all">All</option>
        <option value="books">Books</option>
      </select>
    </>
  );
}`,
          filename: 'Search.tsx',
        }}
        note="Svelte's $effect auto-detects dependencies at compile time. React's useEffect requires you to manually enumerate them. Forgetting one leads to stale closures; including an unstable reference leads to infinite loops."
      />

      <Callout type="gotcha" title="The #1 React Bug">
        Missing dependencies in <code>useEffect</code> is the number one source of bugs for React
        beginners. If your effect reads <code>searchTerm</code> but you forget to include it in the
        dependency array, the effect will keep using the initial value of <code>searchTerm</code>
        forever — a stale closure. React's official ESLint plugin (<code>eslint-plugin-react-hooks</code>)
        includes the <code>exhaustive-deps</code> rule that warns you about missing dependencies.
        Install it and treat its warnings as errors. Do not suppress them unless you truly understand why.
      </Callout>

      <p style={pStyle}>
        Here is what the dependency array means in each form:
      </p>
      <ul style={{ ...pStyle, paddingLeft: '1.5rem' }}>
        <li><code>useEffect(fn)</code> — no array: runs after every render (rarely what you want)</li>
        <li><code>useEffect(fn, [])</code> — empty array: runs once on mount, cleans up on unmount</li>
        <li><code>useEffect(fn, [a, b])</code> — with deps: runs on mount and whenever <code>a</code> or <code>b</code> changes</li>
      </ul>

      {/* ─── Avoiding Effects ─── */}
      <h2 style={h2Style}>Avoiding Effects</h2>
      <p style={pStyle}>
        One of React's more counterintuitive pieces of guidance is: you probably need fewer effects than
        you think. The React documentation has an entire page titled "You Might Not Need an Effect" that
        explains when effects are appropriate and when they are not. The core insight is that effects are
        an escape hatch for synchronizing with external systems — the DOM, timers, network requests,
        third-party libraries. They are not meant for derived state or transforming data.
      </p>
      <h3 style={h3Style}>When NOT to Use an Effect</h3>
      <p style={pStyle}>
        If you are computing a value from existing state, use a regular variable or <code>useMemo</code>
        instead of an effect that sets state. In Svelte, you would use <code>$derived</code>. In React,
        the equivalent is computing the value directly during render or memoizing it. Setting state inside
        an effect to "synchronize" derived data creates unnecessary re-renders and is a common anti-pattern.
      </p>
      <CodeComparison
        svelte={{
          code: `<script>
  let items = $state([]);
  let filter = $state('');

  // Derived state — not an effect!
  let filteredItems = $derived(
    items.filter(item =>
      item.name.includes(filter)
    )
  );

  // Also $derived, not $effect
  let totalPrice = $derived(
    filteredItems.reduce(
      (sum, item) => sum + item.price, 0
    )
  );
</script>`,
          filename: 'Derived.svelte',
        }}
        react={{
          code: `import { useState, useMemo } from 'react';

function FilteredList() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');

  // Compute during render — no effect needed!
  const filteredItems = useMemo(
    () => items.filter(item =>
      item.name.includes(filter)
    ),
    [items, filter]
  );

  // Also computed, not an effect
  const totalPrice = useMemo(
    () => filteredItems.reduce(
      (sum, item) => sum + item.price, 0
    ),
    [filteredItems]
  );

  // BAD: Don't do this!
  // useEffect(() => {
  //   setFilteredItems(items.filter(...));
  // }, [items, filter]);

  return <div>{totalPrice}</div>;
}`,
          filename: 'FilteredList.tsx',
        }}
        note="Svelte's $derived maps to useMemo or inline computation in React. If you find yourself using useEffect to set state based on other state, you almost certainly want useMemo or a regular variable instead."
      />

      {/* ─── beforeUpdate/afterUpdate vs useLayoutEffect ─── */}
      <h2 style={h2Style}>beforeUpdate / afterUpdate vs useLayoutEffect</h2>
      <p style={pStyle}>
        Svelte's <code>beforeUpdate</code> runs before the DOM is updated, and <code>afterUpdate</code>
        runs after. These are useful for things like preserving scroll position or measuring DOM elements
        after a state change. React's equivalent is <code>useLayoutEffect</code>, which fires synchronously
        after the DOM has been mutated but before the browser has painted. This gives you a chance to
        read DOM measurements and make corrections before the user sees a visual flash. Standard
        <code> useEffect</code> fires after the browser paints, so it is too late for layout-critical work.
      </p>
      <h3 style={h3Style}>Synchronous DOM Measurement</h3>
      <CodeComparison
        svelte={{
          code: `<script>
  import { beforeUpdate, afterUpdate } from 'svelte';

  let messages = $state([]);
  let container;

  let autoscroll = false;

  beforeUpdate(() => {
    if (container) {
      const { scrollHeight, scrollTop, clientHeight }
        = container;
      autoscroll =
        scrollHeight - scrollTop - clientHeight < 50;
    }
  });

  afterUpdate(() => {
    if (autoscroll && container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  });
</script>

<div bind:this={container} class="chat">
  {#each messages as msg}
    <p>{msg}</p>
  {/each}
</div>`,
          filename: 'Chat.svelte',
        }}
        react={{
          code: `import {
  useState, useRef, useLayoutEffect
} from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldScroll = useRef(false);

  // useLayoutEffect runs after DOM mutation,
  // before browser paint — similar to
  // afterUpdate but synchronous
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollHeight, scrollTop, clientHeight } = el;
    shouldScroll.current =
      scrollHeight - scrollTop - clientHeight < 50;

    if (shouldScroll.current) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]); // re-run when messages change

  return (
    <div ref={containerRef} className="chat">
      {messages.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}
    </div>
  );
}`,
          filename: 'Chat.tsx',
        }}
        note="useLayoutEffect is the React equivalent of afterUpdate for DOM measurement. Use it when you need to read or adjust the DOM before the browser paints. For most other effects, stick with useEffect."
      />

      {/* ─── Interactive Demo ─── */}
      <h2 style={h2Style}>Try It: Effect Lifecycle in Action</h2>
      <p style={pStyle}>
        This timer demonstrates <code>useEffect</code> with cleanup. When you start the timer, an
        interval is created inside a <code>useEffect</code>. When you pause it, the effect's cleanup
        function fires and clears the interval. If this component were unmounted, the same cleanup
        would prevent the interval from leaking. This is the core pattern for any subscription,
        WebSocket, or timer in React.
      </p>
      <InteractiveDemo
        title="useEffect Cleanup Timer"
        code={`function TimerDemo() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    // Cleanup: clear interval on pause or unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]); // re-run when running changes

  return (
    <div>
      <div className="timer">{seconds}s</div>
      <button onClick={() => setRunning(r => !r)}>
        {running ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => { setRunning(false); setSeconds(0); }}>
        Reset
      </button>
    </div>
  );
}`}
      >
        <TimerDemo />
      </InteractiveDemo>

      <Callout type="insight" title="Automatic vs Explicit Dependencies">
        Svelte's <code>$effect</code> auto-tracks dependencies. React's <code>useEffect</code> requires
        you to manually list them. This is a deliberate design choice — explicit is better than implicit
        in React's philosophy. The React team believes that forcing you to think about what your effect
        depends on leads to fewer subtle bugs, even though it creates more surface-area for forgetting
        a dependency. The ESLint <code>exhaustive-deps</code> rule exists specifically to bridge this gap
        by catching what humans miss.
      </Callout>

      {/* ─── Comparison Table ─── */}
      <h2 style={h2Style}>Lifecycle Methods at a Glance</h2>
      <ComparisonTable
        caption="Svelte Lifecycle vs React Hooks"
        headers={['Concept', 'Svelte', 'React']}
        rows={[
          ['Run on mount', 'onMount(() => { ... })', 'useEffect(() => { ... }, [])'],
          ['Cleanup on unmount', 'onDestroy(() => { ... })', 'useEffect(() => { return () => { ... } }, [])'],
          ['Reactive effect', '$effect(() => { ... })', 'useEffect(() => { ... }, [deps])'],
          ['Derived/computed', '$derived(expression)', 'useMemo(() => expression, [deps])'],
          ['Before DOM update', 'beforeUpdate(() => { ... })', 'No direct equivalent (useLayoutEffect is close)'],
          ['After DOM update', 'afterUpdate(() => { ... })', 'useLayoutEffect(() => { ... }, [deps])'],
          ['Auto-tracked deps', '$effect auto-tracks reads', 'Must list deps manually in array'],
          ['Dep array: omitted', 'N/A', 'Runs after every render'],
          ['Dep array: empty []', 'N/A (onMount)', 'Runs once on mount only'],
          ['Dep array: [a, b]', 'N/A ($effect auto-tracks)', 'Runs when a or b changes'],
          ['Server-side safe', 'onMount skips SSR', 'useEffect skips SSR'],
          ['Strict Mode behavior', 'N/A', 'Runs effect twice in dev to catch bugs'],
        ]}
      />

      <p style={pStyle}>
        The biggest mental shift is recognizing that <code>useEffect</code> is not four separate lifecycle
        hooks squeezed into one — it is a different primitive entirely. It represents a synchronization
        between your React component and some external system. When you think "I need to keep this
        external thing in sync with my state," that is when you reach for <code>useEffect</code>.
        When you think "I need to compute a value from my state," reach for <code>useMemo</code> or a
        regular variable instead. Getting this distinction right is the single most important insight for
        writing clean React code.
      </p>

      <CodeExercise
        id="lifecycle-fix-cleanup"
        title="Fix the Effect Cleanup"
        type="fix-the-bug"
        description="This timer component leaks memory because the interval is never cleared when the component unmounts. Add the cleanup function."
        initialCode={`function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    // Bug: no cleanup!
  }, []);

  return <p>Elapsed: {seconds}s</p>;
}`}
        solution={`function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>Elapsed: {seconds}s</p>;
}`}
        validationPatterns={["return () => clearInterval(id)"]}
        hints={[
          "In Svelte, onDestroy handles cleanup. In React, the useEffect cleanup is the return value.",
          "useEffect can return a function that React calls when the component unmounts",
          "Return a function that calls clearInterval with the interval id"
        ]}
        buggyPreview={<BuggyTimer />}
        solvedPreview={<FixedTimer />}
      />
    </ChapterLayout>
  );
}
