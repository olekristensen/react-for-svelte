import { useState, createContext, useContext, useMemo, useCallback, type ReactNode } from 'react';
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

// -- Interactive Theme Demo --
type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
});

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function ThemedCard() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  return (
    <div style={{
      padding: '1rem',
      borderRadius: 'var(--radius-sm)',
      background: isDark ? '#1e293b' : '#f8fafc',
      color: isDark ? '#e2e8f0' : '#1e293b',
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      marginBottom: '0.75rem',
      fontSize: '0.9rem',
      lineHeight: 1.6,
    }}>
      <strong>Themed Card</strong>
      <p style={{ margin: '0.5rem 0 0' }}>
        Current theme: <code style={{
          padding: '1px 6px',
          borderRadius: 3,
          background: isDark ? '#334155' : '#e2e8f0',
          fontSize: '0.85rem',
        }}>{theme}</code>
      </p>
    </div>
  );
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '0.5rem 1.25rem',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        background: theme === 'dark' ? '#60a5fa' : 'var(--color-accent)',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.85rem',
        fontFamily: 'var(--font-sans)',
        marginBottom: '0.75rem',
      }}
    >
      Toggle to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
  );
}

function ThemeDemo() {
  return (
    <ThemeProvider>
      <div>
        <ThemeToggleButton />
        <ThemedCard />
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          The toggle button and card are sibling components that share theme state through React Context -- no prop drilling needed.
        </p>
      </div>
    </ThemeProvider>
  );
}

const themeDemoCode = `const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = useCallback(
    () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
    []
  );
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function ThemedCard() {
  const { theme } = useContext(ThemeContext);
  return <div className={theme}>Current theme: {theme}</div>;
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <button onClick={toggleTheme}>Switch to {theme === 'light' ? 'dark' : 'light'}</button>;
}

function App() {
  return (
    <ThemeProvider>
      <ThemeToggleButton />
      <ThemedCard />
    </ThemeProvider>
  );
}`;

function BuggyThemeDemo() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_theme, setTheme] = useState('light');
  return (
    <div>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{ padding: '0.4rem 0.8rem', background: 'var(--color-accent)', color: '#ffffff', border: 'none', borderRadius: 0, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem' }}>Toggle Theme</button>
      <div style={{ padding: '0.5rem', background: 'var(--color-bg-secondary)', borderRadius: 0, fontSize: '0.85rem' }}>
        <p style={{ color: 'var(--color-text)' }}>Current: light <span style={{ color: '#ef4444' }}>(theme does not change)</span></p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Toggle button works, but the child ignores it</p>
      </div>
    </div>
  );
}

function FixedThemeDemo() {
  const [theme, setTheme] = useState('light');
  return (
    <div>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{ padding: '0.4rem 0.8rem', background: 'var(--color-accent)', color: '#ffffff', border: 'none', borderRadius: 0, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem' }}>Toggle Theme</button>
      <div style={{ padding: '0.5rem', background: theme === 'dark' ? '#1e293b' : '#f1f5f9', borderRadius: 0, fontSize: '0.85rem', transition: 'background 0.3s' }}>
        <p style={{ color: theme === 'dark' ? '#f1f5f9' : '#0f172a', transition: 'color 0.3s' }}>Current: {theme} <span style={{ color: 'var(--color-success)' }}></span></p>
      </div>
    </div>
  );
}

export default function Context() {
  return (
    <ChapterLayout id="context">
      <p style={pStyle}>
        In Svelte, sharing state across components that are not directly connected is handled
        by stores -- <code>writable</code>, <code>readable</code>, and <code>derived</code>.
        You import a store, subscribe to it with the <code>$</code> prefix, and you are done.
        React solves the same problem with a more ceremonial but explicit mechanism: the
        Context API, often combined with <code>useState</code> or <code>useReducer</code>.
        Understanding how these map to each other -- and where they diverge -- is crucial for
        structuring React applications.
      </p>

      {/* ===== Svelte Stores vs React Context ===== */}
      <h2 style={h2Style}>Svelte Stores vs React Context</h2>
      <p style={pStyle}>
        A Svelte <code>writable</code> store is a self-contained reactive container. You create
        it outside any component, import it wherever you need it, and read/write it with the
        <code> $</code> syntax. There is no provider, no wrapper component, and no boilerplate.
        React Context requires three steps: creating the context, wrapping a subtree with a
        Provider, and consuming the context with <code>useContext</code>. The trade-off is
        explicitness -- React makes the data flow visible in the component tree.
      </p>

      <CodeComparison
        svelte={{
          code: `// stores/counter.ts
import { writable } from 'svelte/store';

export const count = writable(0);

// In any component:
<script>
  import { count } from './stores/counter';
</script>

<button on:click={() => $count++}>
  Count: {$count}
</button>

<!-- In another component -- same store -->
<p>The count is {$count}</p>`,
          filename: 'stores/counter.ts + components',
          highlight: [4, 11, 12, 16],
        }}
        react={{
          code: `// context/CounterContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

const CounterContext = createContext<{
  count: number;
  increment: () => void;
} | null>(null);

export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  return (
    <CounterContext.Provider value={{ count, increment }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounter() {
  const ctx = useContext(CounterContext);
  if (!ctx) throw new Error('useCounter must be used within CounterProvider');
  return ctx;
}

// In a component:
function CounterButton() {
  const { count, increment } = useCounter();
  return <button onClick={increment}>Count: {count}</button>;
}`,
          filename: 'CounterContext.tsx',
          highlight: [4, 9, 13, 19, 20, 21, 27],
        }}
        note="The Svelte store is 4 lines. The React context is 25+. This is the most common complaint from Svelte developers. The verbosity is intentional -- it makes the provider boundary explicit in the component tree."
      />

      <h3 style={h3Style}>The Full Pattern: createContext, Provider, useContext</h3>
      <p style={pStyle}>
        Let us break down the three-step pattern that every React context follows. First, you
        create the context with <code>createContext</code>, providing a default value (or null,
        with a guard). Second, you create a Provider component that holds the actual state and
        passes it down. Third, you create a custom hook that wraps <code>useContext</code> and
        provides a helpful error message if the consumer is outside the provider tree.
      </p>

      <CodeBlock
        code={`// Step 1: Create the context with a typed shape
const AuthContext = createContext<AuthContextType | null>(null);

// Step 2: Create a provider component that manages state
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const user = await api.login(email, password);
    setUser(user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: Custom hook with safety check
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Usage in any descendant component
function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return <LoginButton />;
  return <button onClick={logout}>Logout {user.name}</button>;
}`}
        language="tsx"
        filename="auth-context-pattern.tsx"
        highlight={[2, 5, 16, 23, 24, 25, 26, 27]}
      />

      <p style={pStyle}>
        This three-step pattern appears so frequently in React codebases that it becomes
        muscle memory. The custom hook in step 3 is optional but strongly recommended -- it
        centralizes the null check, improves TypeScript inference, and gives consumers a clean
        API that looks just like any other hook.
      </p>

      {/* ===== Derived Stores vs useMemo ===== */}
      <h2 style={h2Style}>Derived Stores vs useMemo in Context</h2>
      <p style={pStyle}>
        Svelte's <code>derived</code> store creates a new reactive value that automatically
        updates when its source stores change. In React, derived computations inside a context
        provider are typically handled with <code>useMemo</code>. The key difference is that
        Svelte's derived store only notifies subscribers when its output value actually changes,
        while React's context notifies all consumers whenever the provider's value reference
        changes -- even if the derived data has not changed.
      </p>

      <CodeComparison
        svelte={{
          code: `// stores/cart.ts
import { writable, derived } from 'svelte/store';

export const items = writable([
  { name: 'Widget', price: 25, qty: 2 },
  { name: 'Gadget', price: 50, qty: 1 },
]);

// Derived store: only updates when total actually changes
export const total = derived(items, $items =>
  $items.reduce((sum, i) => sum + i.price * i.qty, 0)
);

export const itemCount = derived(items, $items =>
  $items.reduce((sum, i) => sum + i.qty, 0)
);

// Component that only re-renders when total changes
<script>
  import { total } from './stores/cart';
</script>
<p>Total: {$total} kr</p>`,
          filename: 'stores/cart.ts',
          highlight: [10, 11, 12, 14, 15, 16],
        }}
        react={{
          code: `// context/CartContext.tsx
function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState([
    { name: 'Widget', price: 25, qty: 2 },
    { name: 'Gadget', price: 50, qty: 1 },
  ]);

  // Derived values via useMemo
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, setItems, total, itemCount }),
    [items, total, itemCount]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}`,
          filename: 'CartContext.tsx',
          highlight: [9, 10, 11, 14, 15, 16, 19, 20, 21],
        }}
        note="In Svelte, a component subscribing only to $total will not re-render when items change in a way that does not affect the total. In React, ALL consumers of CartContext re-render whenever any part of the context value changes."
      />

      {/* ===== The Re-render Problem ===== */}
      <h2 style={h2Style}>The Re-render Problem</h2>
      <p style={pStyle}>
        This is the single most important behavioral difference between Svelte stores and React
        context, and it catches every Svelte developer off guard. In Svelte, a component that
        subscribes to <code>$total</code> is surgically updated only when that specific derived
        value changes. In React, every component that calls <code>useContext(CartContext)</code>
        will re-render whenever the context value changes -- even if the specific property that
        component reads has not changed.
      </p>
      <p style={pStyle}>
        This means that if your context contains ten values and only one changes, all ten
        consumers re-render. For small applications this is irrelevant. For large applications
        with many context consumers, it can become a real performance problem.
      </p>

      <Callout type="warning" title="Context Re-render Behavior">
        Every consumer of a React context re-renders when the context value changes. This is very
        different from Svelte stores where only the reactive statements using the store update.
        If you pass an object as the context value and any property of that object changes, every
        single component that calls <code>useContext</code> on that context will re-render --
        even components that only read properties that did not change.
      </Callout>

      <h3 style={h3Style}>Solution 1: Splitting Contexts</h3>
      <p style={pStyle}>
        The most effective solution is to split a large context into smaller, focused contexts.
        Instead of one massive <code>AppContext</code>, create separate contexts for theme,
        authentication, cart, notifications, and so on. Components that only need the theme will
        not re-render when the cart changes.
      </p>

      <CodeBlock
        code={`// Instead of one mega context:
const AppContext = createContext({ theme, user, cart, notifications });

// Split into focused contexts:
const ThemeContext = createContext({ theme, setTheme });
const AuthContext = createContext({ user, login, logout });
const CartContext = createContext({ items, addItem, total });

// A component reading only theme won't re-render
// when cart items change
function ThemeIndicator() {
  const { theme } = useContext(ThemeContext); // isolated
  return <span>{theme}</span>;
}`}
        language="tsx"
        filename="split-contexts.tsx"
        highlight={[5, 6, 7, 12]}
      />

      <h3 style={h3Style}>Solution 2: Memoizing the Context Value</h3>
      <p style={pStyle}>
        Always wrap your context value in <code>useMemo</code> to prevent creating a new object
        reference on every render of the provider. Without memoization, the provider creates a
        new object on every render, which triggers re-renders in all consumers even when nothing
        has changed.
      </p>

      <CodeBlock
        code={`// Bad -- creates a new object every render, consumers always re-render
function Provider({ children }) {
  const [count, setCount] = useState(0);
  return (
    <MyContext.Provider value={{ count, setCount }}>
      {children}
    </MyContext.Provider>
  );
}

// Good -- stable reference, consumers only re-render when count changes
function Provider({ children }) {
  const [count, setCount] = useState(0);
  const value = useMemo(() => ({ count, setCount }), [count]);
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
}`}
        language="tsx"
        filename="memoize-context-value.tsx"
        highlight={[5, 14]}
      />

      <h3 style={h3Style}>Solution 3: Separating State and Dispatch</h3>
      <p style={pStyle}>
        A powerful pattern is to split state and dispatch into two separate contexts. Components
        that only dispatch actions (like buttons) consume only the dispatch context and never
        re-render when the state changes. Components that read state consume the state context.
      </p>

      <CodeBlock
        code={`const StateContext = createContext<State>(initialState);
const DispatchContext = createContext<Dispatch<Action>>(() => {});

function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

// This component only dispatches -- it never re-renders on state change
function AddButton() {
  const dispatch = useContext(DispatchContext);
  return <button onClick={() => dispatch({ type: 'ADD' })}>Add</button>;
}

// This component reads state -- it re-renders when state changes
function ItemList() {
  const state = useContext(StateContext);
  return <ul>{state.items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}`}
        language="tsx"
        filename="split-state-dispatch.tsx"
        highlight={[1, 2, 7, 8, 17, 23]}
      />

      {/* ===== External State Libraries ===== */}
      <h2 style={h2Style}>External Solutions: Closer to Svelte Stores</h2>
      <p style={pStyle}>
        If React Context feels too verbose or the re-render behavior is too coarse, the React
        ecosystem offers state management libraries that behave much more like Svelte stores.
        These are not part of React itself, but they are widely adopted and well-maintained.
      </p>

      <h3 style={h3Style}>Zustand</h3>
      <p style={pStyle}>
        Zustand is probably the closest React equivalent to Svelte stores. You define a store
        outside your component tree, and components subscribe to specific slices of state. Only
        the components that read a changed slice will re-render -- exactly like Svelte's store
        subscriptions.
      </p>

      <CodeBlock
        code={`// Zustand -- feels very similar to Svelte writable stores
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));

// Component subscribes to just count -- does NOT re-render
// when other store properties change
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  return <button onClick={increment}>Count: {count}</button>;
}`}
        language="tsx"
        filename="zustand-store.tsx"
        highlight={[4, 13, 14]}
      />

      <h3 style={h3Style}>Jotai</h3>
      <p style={pStyle}>
        Jotai uses an atomic model that maps even more naturally to Svelte's <code>writable</code>
        and <code>derived</code> stores. Each atom is an independent reactive value, and derived
        atoms automatically track their dependencies.
      </p>

      <CodeBlock
        code={`// Jotai -- atomic model, very close to Svelte stores
import { atom, useAtom } from 'jotai';

// Like writable(0)
const countAtom = atom(0);

// Like derived(count, $count => $count * 2)
const doubleAtom = atom((get) => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}

function DoubleDisplay() {
  const [double] = useAtom(doubleAtom);
  return <p>Double: {double}</p>; // only re-renders when countAtom changes
}`}
        language="tsx"
        filename="jotai-atoms.tsx"
        highlight={[5, 8, 11, 16]}
      />

      <Callout type="insight" title="When to Use What">
        Use React Context for low-frequency updates like themes, locale, and authentication.
        Use Zustand or Jotai for high-frequency updates like form state, real-time data, or
        any state that many components subscribe to. The ecosystem has settled on this pragmatic
        split because React Context was never designed to be a general-purpose state manager --
        it was designed for dependency injection.
      </Callout>

      {/* ===== Interactive Demo ===== */}
      <h2 style={h2Style}>Interactive Demo</h2>
      <p style={pStyle}>
        This demo shows a theme switcher built with React Context. The <code>ThemeProvider</code>
        wraps both the toggle button and the themed card. When you toggle the theme, both
        components re-render because they both consume the same context. Notice how the context
        value is memoized to prevent unnecessary re-renders from the provider itself.
      </p>

      <InteractiveDemo title="Theme Switcher with Context" code={themeDemoCode}>
        <ThemeDemo />
      </InteractiveDemo>

      {/* ===== Comparison Table ===== */}
      <h2 style={h2Style}>Context and Stores at a Glance</h2>

      <ComparisonTable
        caption="Svelte stores vs React Context and alternatives"
        headers={['Concept', 'Svelte', 'React']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['Basic shared state', 'writable(value)', 'createContext + Provider + useContext'],
          ['Read-only shared state', 'readable(value, start)', 'Context with no setter exposed'],
          ['Derived values', 'derived(store, fn)', 'useMemo inside provider'],
          ['Subscribe to slice', '$ auto-subscription', 'Not possible (entire context)'],
          ['Granular re-renders', 'Automatic (compiler)', 'Split contexts or Zustand/Jotai'],
          ['Provider required', 'No (import and use)', 'Yes (must wrap tree)'],
          ['Default value', 'Initial value in writable()', 'createContext(default)'],
          ['Custom methods', 'Custom store with set/update', 'Functions in context value'],
          ['DevTools', 'Svelte DevTools', 'React DevTools (Context tab)'],
          ['External alternative', 'Built-in stores suffice', 'Zustand, Jotai, Valtio'],
        ]}
      />

      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        Svelte stores are simpler, more concise, and offer granular subscriptions out of the box.
        React Context is more verbose but makes data flow explicit through the component tree.
        The biggest gotcha is the re-render behavior: React Context re-renders every consumer
        on every change, regardless of which property they read. For simple, infrequent updates
        (themes, auth, locale), this is fine. For complex, high-frequency state, reach for
        Zustand or Jotai -- they bring Svelte-store-like ergonomics to React, with selector-based
        subscriptions and minimal boilerplate. The React ecosystem compensates for the core API's
        limitations with excellent third-party libraries, and learning to pick the right tool
        for each type of state is a key skill in React development.
      </p>

      <CodeExercise
        id="context-complete-provider"
        title="Complete the Provider"
        type="complete-the-code"
        description="The theme context is created and consumed, but the Provider is missing from the component tree. Wrap the children with the Provider and pass the theme value."
        initialCode={`const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');

  return (
    // TODO: Wrap with ThemeContext.Provider
    <div>
      <button onClick={() => setTheme(
        t => t === 'light' ? 'dark' : 'light'
      )}>
        Toggle Theme
      </button>
      <ThemedBox />
    </div>
  );
}

function ThemedBox() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Current: {theme}</div>;
}`}
        solution={`const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <div>
        <button onClick={() => setTheme(
          t => t === 'light' ? 'dark' : 'light'
        )}>
          Toggle Theme
        </button>
        <ThemedBox />
      </div>
    </ThemeContext.Provider>
  );
}

function ThemedBox() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Current: {theme}</div>;
}`}
        validationPatterns={["<ThemeContext.Provider value={theme}>", "</ThemeContext.Provider>"]}
        hints={[
          "In Svelte, setContext/getContext works automatically. React needs an explicit Provider component.",
          "Wrap the JSX tree with <ThemeContext.Provider value={...}>",
          "The value prop is what useContext(ThemeContext) will return in child components"
        ]}
        buggyPreview={<BuggyThemeDemo />}
        solvedPreview={<FixedThemeDemo />}
      />
    </ChapterLayout>
  );
}
