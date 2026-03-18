import { useState, useCallback, useEffect } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

function ToggleDemo() {
  const [isOn, toggle] = useToggle(false);
  const [isDark, toggleDark] = useToggle(false);

  return (
    <div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 60,
            height: 32,
            borderRadius: 16,
            background: isOn ? 'var(--color-success)' : 'var(--color-surface)',
            border: '2px solid var(--color-border)',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }} onClick={toggle}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: 2,
              left: isOn ? 30 : 2,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </div>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            marginTop: '0.5rem',
            fontFamily: 'var(--font-mono)',
          }}>
            Power: {isOn ? 'ON' : 'OFF'}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 60,
            height: 32,
            borderRadius: 16,
            background: isDark ? '#1e293b' : '#fbbf24',
            border: '2px solid var(--color-border)',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }} onClick={toggleDark}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: 2,
              left: isDark ? 30 : 2,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </div>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            marginTop: '0.5rem',
            fontFamily: 'var(--font-mono)',
          }}>
            Theme: {isDark ? 'Dark' : 'Light'}
          </p>
        </div>
      </div>
      <p style={{
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
        marginTop: '1rem',
        fontFamily: 'var(--font-mono)',
      }}>
        Both toggles share the same useToggle hook — independent state, reused logic
      </p>
    </div>
  );
}

function BuggyLocalStorage() {
  const [value, setValue] = useState('');
  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Type something..." style={{ padding: '0.4rem', borderRadius: 0, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', width: '100%', marginBottom: '0.5rem' }} />
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Stored: "{value}"</p>
      <p style={{ fontSize: '0.75rem', color: '#ef4444' }}>Refresh the page — value is lost (not synced to localStorage)</p>
    </div>
  );
}

function FixedLocalStorage() {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem('exercise-demo');
    return stored ? JSON.parse(stored) : '';
  });
  useEffect(() => {
    localStorage.setItem('exercise-demo', JSON.stringify(value));
  }, [value]);
  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Type something..." style={{ padding: '0.4rem', borderRadius: 0, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', width: '100%', marginBottom: '0.5rem' }} />
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Stored: "{value}"</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>Persisted to localStorage — survives page refresh</p>
    </div>
  );
}

export default function CustomHooks() {
  return (
    <ChapterLayout id="custom-hooks">
      <p style={pStyle}>
        Custom hooks are React's killer feature for logic reuse. If you have ever extracted a reactive
        function in Svelte — pulling store subscriptions and reactive declarations into a shared
        module — you have already grasped the concept. Custom hooks are that idea, but with a
        first-class contract enforced by the framework. They let you extract stateful logic out of
        components and share it across your application without any of the ceremony that other
        patterns (HOCs, render props) once required.
      </p>

      <p style={pStyle}>
        In Svelte, logic reuse often means creating a function that returns a writable store or
        a set of derived values. It works, but the calling code must know to subscribe and unsubscribe,
        and the reactive tracking depends on the <code>$</code> prefix or runes. In React, a custom hook
        is simply a function whose name starts with <code>use</code> and that calls other hooks
        internally. The framework handles the rest.
      </p>

      {/* ─── useLocalStorage ─── */}
      <h2 style={h2Style}>Example: useLocalStorage</h2>
      <p style={pStyle}>
        A common need is persisting state to <code>localStorage</code>. Instead of repeating the
        read-on-mount, write-on-change logic in every component, extract it into a custom hook.
        The hook encapsulates the serialization, deserialization, and effect synchronization so
        consuming components see a simple <code>[value, setValue]</code> interface identical
        to <code>useState</code>.
      </p>
      <CodeBlock
        code={`import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state from localStorage or fallback
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Sync to localStorage whenever value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(\`Failed to save \${key} to localStorage\`);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// Usage — identical API to useState!
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16);

  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <input
        type="range"
        min={12}
        max={24}
        value={fontSize}
        onChange={e => setFontSize(Number(e.target.value))}
      />
    </div>
  );
}`}
        language="tsx"
        filename="useLocalStorage.ts"
        highlight={[3, 5, 16, 24, 30, 31]}
      />

      {/* ─── useDebounce ─── */}
      <h2 style={h2Style}>Example: useDebounce</h2>
      <p style={pStyle}>
        Debouncing is another universally needed pattern — delay updating a value until the user
        stops typing. Without a custom hook, you end up scattering <code>setTimeout</code> and
        <code> clearTimeout</code> logic through your components. A <code>useDebounce</code> hook
        encapsulates the timer management and cleanup into a single reusable primitive.
      </p>
      <CodeBlock
        code={`import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the previous timer if value changes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage — just wrap any value
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      fetch(\`/api/search?q=\${debouncedQuery}\`)
        .then(r => r.json())
        .then(data => console.log(data));
    }
  }, [debouncedQuery]); // Only fires 300ms after typing stops

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}`}
        language="tsx"
        filename="useDebounce.ts"
        highlight={[3, 6, 12, 22, 30]}
      />

      {/* ─── Svelte vs React: Logic Reuse ─── */}
      <h2 style={h2Style}>Logic Reuse: Svelte vs React</h2>
      <p style={pStyle}>
        In Svelte, you extract shared reactive logic into a function that typically creates and
        returns stores. The consuming component then subscribes to those stores using the
        <code> $</code> prefix or runes. In React, a custom hook calls <code>useState</code>,
        <code> useEffect</code>, or other hooks internally and returns whatever the consumer needs.
        The shape of the API is similar, but React's approach has a structural advantage: hooks
        compose naturally because they all participate in the same call-order contract.
      </p>
      <CodeComparison
        svelte={{
          code: `// counterStore.ts
import { writable, derived } from 'svelte/store';

export function createCounter(initial = 0) {
  const count = writable(initial);
  const doubled = derived(count, $c => $c * 2);

  function increment() {
    count.update(n => n + 1);
  }

  function decrement() {
    count.update(n => n - 1);
  }

  function reset() {
    count.set(initial);
  }

  return { count, doubled, increment, decrement, reset };
}

// Component.svelte
// <script>
//   const { count, doubled, increment, reset }
//     = createCounter(10);
// </script>
// <p>{$count} (doubled: {$doubled})</p>
// <button on:click={increment}>+</button>`,
          filename: 'counterStore.ts',
        }}
        react={{
          code: `// useCounter.ts
import { useState, useMemo, useCallback } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const doubled = useMemo(() => count * 2, [count]);

  const increment = useCallback(
    () => setCount(c => c + 1), []
  );
  const decrement = useCallback(
    () => setCount(c => c - 1), []
  );
  const reset = useCallback(
    () => setCount(initial), [initial]
  );

  return { count, doubled, increment, decrement, reset };
}

// Component.tsx
// function Counter() {
//   const { count, doubled, increment, reset }
//     = useCounter(10);
//   return (
//     <>
//       <p>{count} (doubled: {doubled})</p>
//       <button onClick={increment}>+</button>
//     </>
//   );
// }`,
          filename: 'useCounter.ts',
        }}
        note="The structure is almost identical. Svelte uses writable/derived stores; React uses useState/useMemo. The key difference: React's hook automatically participates in the component's render cycle — no store subscription needed."
      />

      {/* ─── Rules of Hooks ─── */}
      <h2 style={h2Style}>Rules of Hooks</h2>
      <p style={pStyle}>
        React hooks have two strict rules that you must follow. These rules exist because React
        relies on the <em>call order</em> of hooks to associate each hook with its internal state.
        React does not use names or keys — it uses position. The first <code>useState</code> call
        in your component always corresponds to the first piece of state, the second call to the
        second piece, and so on. This is why hooks cannot be called conditionally or inside loops.
      </p>
      <h3 style={h3Style}>Rule 1: Only Call Hooks at the Top Level</h3>
      <p style={pStyle}>
        Never call hooks inside conditionals, loops, or nested functions. They must appear at the
        top level of your component or custom hook function, so the call order is identical on every
        render. If the order changes, React's internal state slots get misaligned and you see bizarre,
        hard-to-debug corruption.
      </p>
      <CodeBlock
        code={`// BAD: conditional hook call
function Profile({ userId }: { userId: string | null }) {
  if (!userId) return <p>No user selected</p>;

  // This useState is only called sometimes!
  // React can't track it correctly
  const [user, setUser] = useState(null); // BUG

  // ...
}

// GOOD: always call hooks, conditionally use the result
function Profile({ userId }: { userId: string | null }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(\`/api/users/\${userId}\`)
        .then(r => r.json())
        .then(setUser);
    }
  }, [userId]);

  if (!userId) return <p>No user selected</p>;

  return <p>{user?.name}</p>;
}`}
        language="tsx"
        filename="rules-of-hooks.tsx"
        highlight={[7, 14, 25]}
      />

      <h3 style={h3Style}>Rule 2: Only Call Hooks from React Functions</h3>
      <p style={pStyle}>
        Hooks can only be called from React function components or from other custom hooks. You
        cannot call <code>useState</code> from a plain utility function, a class method, or an
        event handler. This rule is what makes the <code>use</code> naming convention essential —
        it signals to both developers and the linter that a function participates in React's
        hook system.
      </p>

      <Callout type="insight" title="Just Functions That Call Hooks">
        Custom hooks are just functions that call other hooks. There is no magic. But the convention
        of the <code>use</code> prefix plus the call-order rule makes them composable in ways Svelte
        functions cannot be. Each call to a custom hook creates its own independent state — you can
        call <code>useToggle()</code> five times and get five independent toggles, each with their
        own state slot.
      </Callout>

      {/* ─── More Useful Hooks ─── */}
      <h2 style={h2Style}>A Toolkit of Custom Hooks</h2>
      <p style={pStyle}>
        Once you internalize the pattern, you will find yourself extracting hooks for everything.
        Here are four practical custom hooks that appear in nearly every production React codebase.
      </p>

      <h3 style={h3Style}>useMediaQuery</h3>
      <p style={pStyle}>
        Reactively track a CSS media query. This hook subscribes to the browser's
        <code> matchMedia</code> API and updates when the media query result changes — perfect
        for responsive logic that goes beyond CSS.
      </p>
      <CodeBlock
        code={`function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mql.addEventListener('change', handler);
    setMatches(mql.matches); // sync initial value

    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Usage
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) return <MobileNav />;
  return <DesktopSidebar />;
}`}
        language="tsx"
        filename="useMediaQuery.ts"
        highlight={[1, 6, 22]}
      />

      <h3 style={h3Style}>useFetch</h3>
      <p style={pStyle}>
        Encapsulate the fetch-loading-error lifecycle into a reusable hook. In production you would
        likely use a library like TanStack Query, but understanding how to build this from primitives
        is valuable.
      </p>
      <CodeBlock
        code={`interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
        return r.json();
      })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => {
        if (err.name !== 'AbortError') {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

// Usage
function UserProfile({ id }: { id: string }) {
  const { data, loading, error } = useFetch<User>(\`/api/users/\${id}\`);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return <div>{data?.name}</div>;
}`}
        language="tsx"
        filename="useFetch.ts"
        highlight={[7, 14, 30, 39]}
      />

      <h3 style={h3Style}>useToggle</h3>
      <p style={pStyle}>
        A tiny hook for boolean state that is toggled frequently. Modals, dropdowns, dark mode
        switches, sidebar visibility — this hook eliminates the repetitive
        <code> setValue(v =&gt; !v)</code> pattern.
      </p>
      <CodeBlock
        code={`import { useState, useCallback } from 'react';

function useToggle(
  initialValue = false
): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

// Usage
function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <>
      <button onClick={toggleOpen}>
        {isOpen ? 'Close' : 'Open'} Modal
      </button>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Modal content</p>
            <button onClick={toggleOpen}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}`}
        language="tsx"
        filename="useToggle.ts"
        highlight={[3, 7, 13]}
      />

      <h3 style={h3Style}>useClickOutside</h3>
      <p style={pStyle}>
        Detect clicks outside a referenced element — essential for closing dropdowns, modals, and
        popover menus. In Svelte you might use an action (<code>use:clickOutside</code>). In React,
        this becomes a hook that accepts a ref and a callback.
      </p>
      <CodeBlock
        code={`import { useEffect, useRef, RefObject } from 'react';

function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void
) {
  useEffect(() => {
    function listener(event: MouseEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    }

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

// Usage
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(o => !o)}>Menu</button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      )}
    </div>
  );
}`}
        language="tsx"
        filename="useClickOutside.ts"
        highlight={[3, 7, 15, 25]}
      />

      {/* ─── Interactive Demo ─── */}
      <h2 style={h2Style}>Try It: useToggle in Action</h2>
      <p style={pStyle}>
        Below you can see two independent toggles that both use the same <code>useToggle</code> hook.
        Each call to the hook creates its own isolated state — the power toggle and the theme toggle
        do not interfere with each other. This is the composability that the call-order contract enables.
      </p>
      <InteractiveDemo
        title="useToggle Hook"
        code={`function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

function ToggleDemo() {
  const [isOn, toggle] = useToggle(false);
  const [isDark, toggleDark] = useToggle(false);

  return (
    <div>
      <Switch checked={isOn} onClick={toggle} label="Power" />
      <Switch checked={isDark} onClick={toggleDark} label="Theme" />
    </div>
  );
}`}
      >
        <ToggleDemo />
      </InteractiveDemo>

      {/* ─── Comparison Table ─── */}
      <h2 style={h2Style}>Logic Reuse Patterns at a Glance</h2>
      <ComparisonTable
        caption="Svelte vs React Logic Reuse"
        headers={['Pattern', 'Svelte', 'React']}
        rows={[
          ['Extract stateful logic', 'Function returning stores', 'Custom hook (use* function)'],
          ['Share between components', 'Import store factory, subscribe with $', 'Import hook, call in component'],
          ['Compose multiple behaviors', 'Combine stores manually', 'Call multiple hooks in one component'],
          ['Reactive tracking', 'Automatic ($effect, $derived)', 'Explicit dependency arrays'],
          ['State isolation', 'Each store call = new store', 'Each hook call = new state slot'],
          ['Cleanup / teardown', 'Return from onMount, onDestroy', 'Return from useEffect callback'],
          ['Naming convention', 'No enforced convention', 'Must start with "use" prefix'],
          ['Conditional calls', 'Allowed anywhere', 'Forbidden — must be top-level only'],
          ['DOM access (actions)', 'use:action directive', 'useRef + useEffect in custom hook'],
          ['Linting support', 'No special lint rules', 'eslint-plugin-react-hooks enforces rules'],
          ['Testing', 'Test the store function directly', 'renderHook() from testing-library'],
          ['Third-party ecosystem', 'Smaller ecosystem', 'Massive hook library ecosystem'],
        ]}
      />

      <p style={pStyle}>
        Custom hooks are the backbone of modern React architecture. Once you are comfortable with
        the rules of hooks, you will find that nearly any piece of component logic can be extracted
        into a reusable hook. The convention is simple, the rules are strict, and the result is a
        composability model that has transformed how React applications are structured. Coming from
        Svelte, the biggest adjustment is the discipline of the dependency array — but once that
        becomes muscle memory, custom hooks will feel like the most natural way to share logic.
      </p>

      <CodeExercise
        id="hooks-complete-custom"
        title="Build useLocalStorage"
        type="complete-the-code"
        description="Complete this custom hook that syncs state with localStorage. Fill in the useState initializer to read from localStorage, and add a useEffect to write changes back."
        initialCode={`function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    // TODO: Read from localStorage, parse JSON
    // Fall back to defaultValue if not found
  });

  useEffect(() => {
    // TODO: Write value to localStorage as JSON
  }, [key, value]);

  return [value, setValue];
}`}
        solution={`function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}`}
        validationPatterns={["localStorage.getItem(key)", "JSON.parse(stored)", "localStorage.setItem(key, JSON.stringify(value))"]}
        hints={[
          "The useState initializer should try localStorage.getItem(key) first",
          "Parse the stored string with JSON.parse, falling back to defaultValue",
          "The useEffect should call localStorage.setItem(key, JSON.stringify(value))"
        ]}
        buggyPreview={<BuggyLocalStorage />}
        solvedPreview={<FixedLocalStorage />}
      />
    </ChapterLayout>
  );
}
