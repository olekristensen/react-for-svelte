import { useState } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

function BuggyCartStore() {
  return (
    <div style={{ padding: '0.5rem', background: 'var(--color-bg-secondary)', borderRadius: '6px' }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginBottom: '0.3rem' }}>Shopping Cart</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Items: (empty)</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
        <button disabled style={{ padding: '0.3rem 0.6rem', background: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)', border: 'none', borderRadius: '4px', fontSize: '0.8rem' }}>Add Item</button>
        <button disabled style={{ padding: '0.3rem 0.6rem', background: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)', border: 'none', borderRadius: '4px', fontSize: '0.8rem' }}>Remove</button>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.4rem' }}>Store incomplete — no state or actions defined</p>
    </div>
  );
}

function FixedCartStore() {
  const [items, setItems] = useState<string[]>([]);
  let nextId = items.length + 1;
  return (
    <div style={{ padding: '0.5rem', background: 'var(--color-bg-secondary)', borderRadius: '6px' }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginBottom: '0.3rem' }}>Shopping Cart</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Items: {items.length === 0 ? '(empty)' : items.join(', ')}</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
        <button onClick={() => { setItems(p => [...p, `Item ${nextId}`]); }} style={{ padding: '0.3rem 0.6rem', background: 'var(--color-accent)', color: '#0f172a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>Add Item</button>
        <button onClick={() => setItems(p => p.slice(0, -1))} disabled={items.length === 0} style={{ padding: '0.3rem 0.6rem', background: items.length ? 'var(--color-bg-tertiary)' : 'var(--color-bg-tertiary)', color: items.length ? 'var(--color-text)' : 'var(--color-text-muted)', border: 'none', borderRadius: '4px', cursor: items.length ? 'pointer' : 'default', fontSize: '0.8rem' }}>Remove</button>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.4rem' }}>Store working — items managed with actions</p>
    </div>
  );
}

export default function EcosystemState() {
  return (
    <ChapterLayout id="ecosystem-state">
      <p style={pStyle}>
        The Context chapter introduced Zustand and Jotai as alternatives to React Context for
        high-frequency state. That was a teaser. This chapter goes deep into the full state
        management landscape in React -- when each solution makes sense, how they compare to
        Svelte stores, and how to choose the right tool for the job. If you have been building
        Svelte apps, you are used to a single built-in store mechanism that covers almost every
        case. React's ecosystem is different: there is no single official answer, and the variety
        exists because different applications have fundamentally different needs.
      </p>

      <p style={pStyle}>
        We will walk through the major libraries from simplest to most complex, compare each one
        side-by-side with the Svelte equivalent, and end with a practical decision matrix you can
        reference when starting a new project.
      </p>

      {/* ===== The State Management Spectrum ===== */}
      <h2 style={h2Style}>The State Management Spectrum</h2>
      <p style={pStyle}>
        React's state management ecosystem spans a wide spectrum from built-in primitives to
        full-featured external libraries. Each occupies a different niche defined by its mental
        model, bundle cost, and the scale of application it serves best.
      </p>

      <ComparisonTable
        caption="The React state management spectrum at a glance"
        headers={['Library', 'Mental Model', 'Bundle Size', 'Best For']}
        rows={[
          ['useState', 'Local component state', '0 KB (built-in)', 'Single-component state, forms, toggles'],
          ['Context + useReducer', 'Dependency injection + flux', '0 KB (built-in)', 'Theme, auth, locale -- low-frequency global state'],
          ['Zustand', 'External store with selectors', '~1.1 KB', 'Medium apps, shared state with granular subscriptions'],
          ['Jotai', 'Atomic bottom-up primitives', '~2.4 KB', 'Fine-grained reactivity, derived state graphs'],
          ['Valtio', 'Mutable proxy objects', '~3.3 KB', 'Svelte-like mutable ergonomics, real-time state'],
          ['Redux Toolkit', 'Centralized store with slices', '~11 KB', 'Enterprise apps, middleware, time-travel debugging'],
          ['MobX', 'Observable classes + decorators', '~16 KB', 'OOP-heavy codebases, transparent reactivity'],
        ]}
      />

      <Callout type="insight" title="Why So Many Options?">
        Svelte developers are used to stores that "just work" with <code>$store</code> syntax.
        One mechanism covers local state, shared state, and derived state. React's variety exists
        because no single solution fits all scales. A todo app and a real-time collaborative
        document editor have fundamentally different state management needs, and React's ecosystem
        reflects that reality. The good news: you only need to learn one or two of these libraries.
        Most React teams pick one external solution and stick with it.
      </Callout>

      {/* ===== Redux Toolkit ===== */}
      <h2 style={h2Style}>Redux Toolkit -- The Enterprise Standard</h2>
      <p style={pStyle}>
        Redux was React's first widely adopted state management library, released in 2015. It
        introduced a unidirectional data flow: actions describe what happened, reducers specify
        how state changes, and the store holds the single source of truth. The original API was
        notoriously verbose -- a simple counter required action type constants, action creators,
        switch-case reducers, and mapStateToProps connectors. The community joke was that Redux
        required "100 lines of boilerplate to increment a number."
      </p>
      <p style={pStyle}>
        Redux Toolkit (RTK) was released in 2019 as the official, opinionated wrapper around
        Redux. It eliminated almost all the boilerplate while preserving the benefits: predictable
        state updates, middleware for side effects, time-travel debugging, and excellent DevTools.
        Today, "Redux" effectively means "Redux Toolkit" -- the old API is considered legacy.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- stores/todos.ts -->
<script lang="ts" module>
  import { writable, derived } from 'svelte/store';

  interface Todo {
    id: number;
    text: string;
    completed: boolean;
  }

  function createTodoStore() {
    const { subscribe, update } = writable<Todo[]>([]);

    return {
      subscribe,
      add: (text: string) =>
        update(todos => [
          ...todos,
          { id: Date.now(), text, completed: false }
        ]),
      toggle: (id: number) =>
        update(todos =>
          todos.map(t =>
            t.id === id
              ? { ...t, completed: !t.completed }
              : t
          )
        ),
      remove: (id: number) =>
        update(todos =>
          todos.filter(t => t.id !== id)
        ),
    };
  }

  export const todos = createTodoStore();

  export const remaining = derived(
    todos,
    $todos => $todos.filter(t => !t.completed).length
  );
</script>`,
          filename: 'stores/todos.ts',
          highlight: [11, 16, 21, 29, 37, 38, 39],
        }}
        react={{
          code: `// store/todosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
}

const initialState: TodosState = { items: [] };

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    add(state, action: PayloadAction<string>) {
      // RTK uses Immer -- mutations are safe here
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
      });
    },
    toggle(state, action: PayloadAction<number>) {
      const todo = state.items.find(
        t => t.id === action.payload
      );
      if (todo) todo.completed = !todo.completed;
    },
    remove(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        t => t.id !== action.payload
      );
    },
  },
});

export const { add, toggle, remove } = todosSlice.actions;
export default todosSlice.reducer;`,
          filename: 'store/todosSlice.ts',
          highlight: [16, 20, 21, 22, 29, 30, 32, 42],
        }}
        note="RTK's createSlice uses Immer under the hood, so you can write mutating code (state.items.push) and it produces immutable updates. The Svelte custom store uses manual immutable patterns with spread operators and map/filter."
      />

      <h3 style={h3Style}>RTK with TypeScript -- The Full Setup</h3>
      <p style={pStyle}>
        In a real Redux Toolkit project, you wire up typed hooks once and use them everywhere.
        This setup code lives in a single file and never needs to change. The typed hooks give
        you autocompletion on every selector and dispatch call throughout your app.
      </p>

      <CodeBlock
        code={`// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    user: userReducer,
  },
});

// Infer types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// store/hooks.ts -- typed hooks used everywhere
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Usage in a component
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { add, toggle } from '../store/todosSlice';

function TodoList() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.items);
  const remaining = useAppSelector(
    state => state.todos.items.filter(t => !t.completed).length
  );

  return (
    <div>
      <p>{remaining} items left</p>
      {todos.map(todo => (
        <div key={todo.id} onClick={() => dispatch(toggle(todo.id))}>
          {todo.completed ? '✓' : '○'} {todo.text}
        </div>
      ))}
      <button onClick={() => dispatch(add('New todo'))}>
        Add Todo
      </button>
    </div>
  );
}`}
        language="tsx"
        filename="store/index.ts + hooks.ts + TodoList.tsx"
        highlight={[6, 14, 15, 21, 22, 29, 30, 31, 32]}
      />

      <h3 style={h3Style}>RTK Query -- Server State Management</h3>
      <p style={pStyle}>
        One of Redux Toolkit's strongest features is RTK Query, a built-in data fetching and
        caching layer. It eliminates the need for manual loading/error states and handles cache
        invalidation, polling, and optimistic updates. Think of it as React's answer to SvelteKit's
        load functions, but for client-side data fetching in any React app.
      </p>

      <CodeBlock
        code={`// store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Post {
  id: number;
  title: string;
  body: string;
}

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: ['Post'],
    }),
    getPost: builder.query<Post, number>({
      query: (id) => \`/posts/\${id}\`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Post'], // auto-refetches getPosts
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddPostMutation,
} = postsApi;

// In a component -- loading, error, and caching handled automatically
function PostList() {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts</p>;

  return (
    <div>
      {posts?.map(post => <PostCard key={post.id} post={post} />)}
      <button onClick={() => addPost({ title: 'New', body: '...' })}>
        Add Post
      </button>
    </div>
  );
}`}
        language="tsx"
        filename="store/api.ts + PostList.tsx"
        highlight={[10, 15, 19, 23, 29, 34, 35, 36, 42, 43]}
      />

      <Callout type="info" title="When Redux Makes Sense">
        Redux Toolkit is the right choice when your app has: a large team that benefits from
        strict conventions and a single state tree; middleware requirements like logging, analytics,
        or saga-based side effects; the need for time-travel debugging during development; or
        complex state interactions where actions in one slice trigger updates in another. If you
        are building a banking dashboard, an admin panel with dozens of interconnected views, or
        an app where audit trails matter, Redux gives you guardrails that simpler libraries do not.
      </Callout>

      <Callout type="warning" title="Redux Is Overkill for Most Apps">
        If your app has fewer than 15-20 interconnected state slices, Redux Toolkit adds ceremony
        without proportional benefit. The boilerplate is much lower than old Redux, but it is still
        more than Zustand or Jotai. Most small-to-medium apps are better served by lighter
        solutions. Do not pick Redux because it is popular -- pick it because your app genuinely
        needs centralized state management with middleware support.
      </Callout>

      {/* ===== Zustand ===== */}
      <h2 style={h2Style}>Zustand -- The Svelte Developer's Best Friend</h2>
      <p style={pStyle}>
        If you are a Svelte developer looking for familiar ergonomics in React, Zustand is your
        first stop. It shares Svelte stores' philosophy: define state outside the component tree,
        import it where you need it, and subscribe to specific values. There is no provider, no
        reducer boilerplate, and no action types. You create a store, use it in components with
        a hook, and components only re-render when the specific value they select changes.
      </p>

      <CodeComparison
        svelte={{
          code: `<script lang="ts" module>
  // stores/settings.ts
  import { writable, derived } from 'svelte/store';

  interface Settings {
    theme: 'light' | 'dark';
    fontSize: number;
    sidebarOpen: boolean;
  }

  const settings = writable<Settings>({
    theme: 'light',
    fontSize: 16,
    sidebarOpen: true,
  });

  // Custom store methods
  export const settingsStore = {
    subscribe: settings.subscribe,
    setTheme: (theme: Settings['theme']) =>
      settings.update(s => ({ ...s, theme })),
    setFontSize: (size: number) =>
      settings.update(s => ({ ...s, fontSize: size })),
    toggleSidebar: () =>
      settings.update(s => ({
        ...s, sidebarOpen: !s.sidebarOpen,
      })),
  };

  // Derived: only notifies when this specific
  // value changes
  export const isDark = derived(
    settings,
    $s => $s.theme === 'dark'
  );
</script>

<!-- Usage in a component -->
<script lang="ts">
  import { settingsStore, isDark } from './stores/settings';
</script>

<button on:click={settingsStore.toggleSidebar}>
  Toggle sidebar
</button>
<p>Dark mode: {$isDark}</p>`,
          filename: 'stores/settings.ts',
          highlight: [11, 18, 19, 20, 21, 32, 33, 34],
        }}
        react={{
          code: `// stores/settings.ts
import { create } from 'zustand';

interface Settings {
  theme: 'light' | 'dark';
  fontSize: number;
  sidebarOpen: boolean;
  // Actions live alongside state
  setTheme: (theme: Settings['theme']) => void;
  setFontSize: (size: number) => void;
  toggleSidebar: () => void;
}

export const useSettings = create<Settings>((set) => ({
  theme: 'light',
  fontSize: 16,
  sidebarOpen: true,
  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
}));

// Usage in a component -- selector-based subscriptions
// Only re-renders when sidebarOpen changes
function SidebarToggle() {
  const sidebarOpen = useSettings(s => s.sidebarOpen);
  const toggleSidebar = useSettings(s => s.toggleSidebar);
  return (
    <button onClick={toggleSidebar}>
      {sidebarOpen ? 'Close' : 'Open'} sidebar
    </button>
  );
}

// Derived value via selector
function ThemeIndicator() {
  const isDark = useSettings(s => s.theme === 'dark');
  return <p>Dark mode: {isDark ? 'yes' : 'no'}</p>;
}`,
          filename: 'stores/settings.ts',
          highlight: [14, 18, 19, 20, 21, 29, 30, 40, 41],
        }}
        note="Zustand's selector model maps directly to Svelte's derived stores. The component calling useSettings(s => s.theme === 'dark') only re-renders when that boolean value actually changes, just like a Svelte derived store."
      />

      <h3 style={h3Style}>Zustand Middleware -- Immer, Persist, DevTools</h3>
      <p style={pStyle}>
        Zustand's middleware system lets you layer on capabilities without changing your store's
        API. The three most commonly used middlewares are <code>immer</code> for mutable-style
        updates, <code>persist</code> for automatic localStorage synchronization, and
        <code> devtools</code> for Redux DevTools integration.
      </p>

      <CodeBlock
        code={`import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        addItem: (item) =>
          set((state) => {
            const existing = state.items.find(i => i.id === item.id);
            if (existing) {
              existing.quantity += 1; // Immer makes this safe
            } else {
              state.items.push({ ...item, quantity: 1 });
            }
          }),
        updateQuantity: (id, delta) =>
          set((state) => {
            const item = state.items.find(i => i.id === id);
            if (item) {
              item.quantity = Math.max(0, item.quantity + delta);
              if (item.quantity === 0) {
                state.items = state.items.filter(i => i.id !== id);
              }
            }
          }),
        removeItem: (id) =>
          set((state) => {
            state.items = state.items.filter(i => i.id !== id);
          }),
        clearCart: () => set({ items: [] }),
        total: () =>
          get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
      })),
      { name: 'cart-storage' } // localStorage key
    )
  )
);`}
        language="tsx"
        filename="stores/cart.ts"
        highlight={[22, 23, 24, 25, 32, 33, 59]}
      />

      <h3 style={h3Style}>Zustand Slices Pattern for Larger Apps</h3>
      <p style={pStyle}>
        As your app grows, a single Zustand store can become unwieldy. The slices pattern lets
        you define separate pieces of state in their own files and combine them into a single
        store. Each slice is a function that receives <code>set</code> and <code>get</code> and
        returns its portion of the state.
      </p>

      <CodeBlock
        code={`// stores/authSlice.ts
import type { StateCreator } from 'zustand';

export interface AuthSlice {
  user: { id: string; name: string } | null;
  isAuthenticated: boolean;
  login: (name: string) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice & UISlice, // full store type for cross-slice access
  [],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  isAuthenticated: false,
  login: (name) =>
    set({ user: { id: crypto.randomUUID(), name }, isAuthenticated: true }),
  logout: () =>
    set({ user: null, isAuthenticated: false }),
});

// stores/uiSlice.ts
export interface UISlice {
  sidebarOpen: boolean;
  modal: string | null;
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const createUISlice: StateCreator<
  AuthSlice & UISlice,
  [],
  [],
  UISlice
> = (set) => ({
  sidebarOpen: true,
  modal: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openModal: (id) => set({ modal: id }),
  closeModal: () => set({ modal: null }),
});

// stores/index.ts -- combine slices
import { create } from 'zustand';

export const useStore = create<AuthSlice & UISlice>()((...args) => ({
  ...createAuthSlice(...args),
  ...createUISlice(...args),
}));

// Components pick what they need
function UserMenu() {
  const user = useStore(s => s.user);
  const logout = useStore(s => s.logout);
  // Only re-renders when user changes -- UI state is ignored
  if (!user) return null;
  return <button onClick={logout}>Logout {user.name}</button>;
}`}
        language="tsx"
        filename="stores/authSlice.ts + uiSlice.ts + index.ts"
        highlight={[11, 35, 50, 51, 52, 56, 57]}
      />

      <Callout type="insight" title="Zustand Selectors = Svelte Store Granularity">
        Zustand's selector model is the closest thing to Svelte's <code>$store</code> granular
        subscriptions. When you write <code>useStore(s =&gt; s.user)</code>, that component only
        re-renders when the <code>user</code> reference changes. Other state changes in the same
        store are ignored. This is fundamentally different from React Context, where every consumer
        re-renders on any change. If you miss the precision of Svelte stores, Zustand selectors
        give you the same behavior.
      </Callout>

      {/* ===== Jotai ===== */}
      <h2 style={h2Style}>Jotai -- Atomic State</h2>
      <p style={pStyle}>
        Jotai takes a fundamentally different approach from both Redux and Zustand. Instead of
        defining a store with a predefined shape, you define individual atoms -- small, independent
        pieces of state that can be composed together. If Svelte's <code>writable</code> and
        <code> derived</code> stores are your mental model, Jotai will feel immediately familiar.
        Each atom is like a writable, and derived atoms are like derived stores.
      </p>

      <CodeComparison
        svelte={{
          code: `<script lang="ts" module>
  // stores/filters.ts
  import { writable, derived } from 'svelte/store';

  export const searchQuery = writable('');
  export const category = writable<string>('all');
  export const priceRange = writable({
    min: 0,
    max: 1000,
  });

  // Derived: builds filter summary from
  // multiple independent stores
  export const activeFilterCount = derived(
    [searchQuery, category, priceRange],
    ([$query, $cat, $price]) => {
      let count = 0;
      if ($query.length > 0) count++;
      if ($cat !== 'all') count++;
      if ($price.min > 0 || $price.max < 1000) count++;
      return count;
    }
  );

  export const filterSummary = derived(
    activeFilterCount,
    $count =>
      $count === 0
        ? 'No filters applied'
        : \`\${$count} filter\${$count > 1 ? 's' : ''} active\`
  );
</script>`,
          filename: 'stores/filters.ts',
          highlight: [5, 6, 7, 14, 15, 16, 25, 26, 27],
        }}
        react={{
          code: `// atoms/filters.ts
import { atom } from 'jotai';

// Base atoms -- like writable()
export const searchQueryAtom = atom('');
export const categoryAtom = atom<string>('all');
export const priceRangeAtom = atom({
  min: 0,
  max: 1000,
});

// Derived atom -- like derived()
// Automatically tracks which atoms it reads
export const activeFilterCountAtom = atom((get) => {
  let count = 0;
  if (get(searchQueryAtom).length > 0) count++;
  if (get(categoryAtom) !== 'all') count++;
  const price = get(priceRangeAtom);
  if (price.min > 0 || price.max < 1000) count++;
  return count;
});

// Derived from another derived atom
export const filterSummaryAtom = atom((get) => {
  const count = get(activeFilterCountAtom);
  return count === 0
    ? 'No filters applied'
    : \`\${count} filter\${count > 1 ? 's' : ''} active\`;
});

// Usage in components
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

function SearchBar() {
  // useAtom = read + write (like $store)
  const [query, setQuery] = useAtom(searchQueryAtom);
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function FilterBadge() {
  // useAtomValue = read only (like $derived)
  const summary = useAtomValue(filterSummaryAtom);
  return <span>{summary}</span>;
}`,
          filename: 'atoms/filters.ts',
          highlight: [5, 6, 7, 14, 15, 24, 25, 36, 37, 47, 48],
        }}
        note="The mapping is almost 1:1. Svelte writable = Jotai atom. Svelte derived = Jotai read-only atom with get(). Jotai's useAtomValue is analogous to reading a Svelte derived store -- the component only re-renders when that specific derived value changes."
      />

      <h3 style={h3Style}>Advanced Jotai -- Storage, Families, and Async</h3>
      <p style={pStyle}>
        Jotai's atom primitives compose to handle advanced patterns: persisted state with
        <code> atomWithStorage</code>, parameterized atoms with <code>atomFamily</code>, and
        server-fetched state with async atoms. These composable primitives mean you rarely need
        to reach for separate libraries.
      </p>

      <CodeBlock
        code={`import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomFamily } from 'jotai/utils';

// Persisted atom -- auto-syncs with localStorage
// Like a Svelte writable that survives page reloads
export const themeAtom = atomWithStorage<'light' | 'dark'>(
  'app-theme',  // localStorage key
  'light'       // default value
);

// Atom family -- parameterized atoms
// Creates a unique atom for each user ID
export const userProfileAtom = atomFamily((userId: string) =>
  atom(async () => {
    const response = await fetch(\`/api/users/\${userId}\`);
    return response.json() as Promise<{
      id: string;
      name: string;
      avatar: string;
    }>;
  })
);

// Async derived atom -- like a derived store that
// fetches from an API
const currentUserIdAtom = atom<string | null>(null);

export const currentUserAtom = atom(async (get) => {
  const userId = get(currentUserIdAtom);
  if (!userId) return null;
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
});

// Write-only atom for complex actions
// Like a Svelte store with only custom methods
export const addToCartAtom = atom(
  null, // no read value
  async (get, set, productId: string) => {
    const response = await fetch(\`/api/cart/add\`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    const updatedCart = await response.json();
    set(cartItemsAtom, updatedCart.items);
    set(cartTotalAtom, updatedCart.total);
  }
);

// Usage in a component
function UserProfile({ userId }: { userId: string }) {
  const [profile] = useAtom(userProfileAtom(userId));
  // Suspense handles loading automatically
  return <p>{profile.name}</p>;
}

function AddToCartButton({ productId }: { productId: string }) {
  const [, addToCart] = useAtom(addToCartAtom);
  return (
    <button onClick={() => addToCart(productId)}>
      Add to Cart
    </button>
  );
}`}
        language="tsx"
        filename="atoms/advanced.ts"
        highlight={[7, 14, 15, 29, 38, 39, 40, 52, 57]}
      />

      <h3 style={h3Style}>Bottom-Up vs Top-Down Mental Models</h3>
      <p style={pStyle}>
        Jotai and Redux represent two fundamentally different ways of thinking about state.
        Redux uses a top-down model: you define a single large state tree and carve it into
        slices. Each slice owns a portion of the tree, and selectors reach into the tree to
        extract what a component needs. Jotai uses a bottom-up model: you define small,
        independent atoms and compose them upward into derived atoms. There is no single tree
        -- atoms are a graph that grows organically as your application grows.
      </p>
      <p style={pStyle}>
        The bottom-up model is closer to how Svelte stores work. In Svelte, you do not define
        a single global store shape. You create individual writable and derived stores and compose
        them. Jotai follows this same philosophy in React. If you think in terms of "small,
        composable reactive values" rather than "one big state object with slices," Jotai will
        feel natural.
      </p>

      {/* ===== Valtio ===== */}
      <h2 style={h2Style}>Valtio and Proxy-Based Reactivity</h2>
      <p style={pStyle}>
        Valtio takes a radically different approach from every other React state library. Instead
        of immutable updates or reducer patterns, Valtio wraps your state in a JavaScript Proxy
        and tracks which properties each component accesses at runtime. You mutate state directly,
        and Valtio figures out which components need to re-render. If that sounds exactly like how
        Svelte 5 runes work, you are not wrong.
      </p>

      <CodeComparison
        svelte={{
          code: `<script lang="ts">
  // Svelte 5 runes: mutable-looking,
  // compiler-tracked at build time
  let todos = $state<{
    id: number;
    text: string;
    done: boolean;
  }[]>([]);

  let filter = $state<'all' | 'active' | 'done'>('all');

  let filtered = $derived(
    filter === 'all'
      ? todos
      : todos.filter(t =>
          filter === 'done' ? t.done : !t.done
        )
  );

  function addTodo(text: string) {
    // Direct mutation -- compiler tracks this
    todos.push({
      id: Date.now(),
      text,
      done: false,
    });
  }

  function toggleTodo(id: number) {
    // Direct property mutation
    const todo = todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  }
</script>

<input on:keydown={(e) => {
  if (e.key === 'Enter') {
    addTodo(e.currentTarget.value);
    e.currentTarget.value = '';
  }
}} />

{#each filtered as todo}
  <div on:click={() => toggleTodo(todo.id)}>
    {todo.done ? '✓' : '○'} {todo.text}
  </div>
{/each}`,
          filename: 'TodoApp.svelte',
          highlight: [4, 10, 12, 22, 23, 31, 32],
        }}
        react={{
          code: `// stores/todos.ts
import { proxy, useSnapshot } from 'valtio';

// Proxy-based: mutable, tracked at runtime
const state = proxy({
  todos: [] as {
    id: number;
    text: string;
    done: boolean;
  }[],
  filter: 'all' as 'all' | 'active' | 'done',
});

// Direct mutations -- Valtio tracks them
export function addTodo(text: string) {
  state.todos.push({
    id: Date.now(),
    text,
    done: false,
  });
}

export function toggleTodo(id: number) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
}

export { state };

// TodoApp.tsx
import { useSnapshot } from 'valtio';
import { state, addTodo, toggleTodo } from './stores/todos';

function TodoApp() {
  // useSnapshot creates a read-only snapshot
  // for rendering -- auto-tracks access
  const snap = useSnapshot(state);
  const filtered = snap.filter === 'all'
    ? snap.todos
    : snap.todos.filter(t =>
        snap.filter === 'done' ? t.done : !t.done
      );

  return (
    <div>
      <input onKeyDown={(e) => {
        if (e.key === 'Enter') {
          addTodo(e.currentTarget.value);
          e.currentTarget.value = '';
        }
      }} />
      {filtered.map(todo => (
        <div key={todo.id}
          onClick={() => toggleTodo(todo.id)}>
          {todo.done ? '✓' : '○'} {todo.text}
        </div>
      ))}
    </div>
  );
}`,
          filename: 'stores/todos.ts + TodoApp.tsx',
          highlight: [5, 16, 17, 25, 37, 38, 39],
        }}
        note="Both Svelte 5 runes and Valtio let you write mutable code. The difference: Svelte's compiler tracks reactivity statically at build time. Valtio's proxy tracks property access dynamically at runtime. The developer experience is nearly identical."
      />

      <Callout type="gotcha" title="Proxy Debugging Trade-offs">
        Proxy-based reactivity feels closest to Svelte's ergonomics, but it comes with debugging
        trade-offs. Mutations happen anywhere in your codebase, and tracing "who changed this
        property?" requires Valtio's devtools extension. With Zustand or Redux, state changes
        are explicit (you call <code>set()</code> or <code>dispatch()</code>), making them easy
        to trace in DevTools. With Valtio, any code with a reference to the proxy object can
        mutate it silently. This trade-off mirrors a debate in the Svelte community about
        <code> $state</code> mutations vs explicit store updates.
      </Callout>

      {/* ===== Signals in React ===== */}
      <h3 style={h3Style}>Signals in React</h3>
      <p style={pStyle}>
        The JavaScript ecosystem is converging on a reactivity primitive called signals. Svelte
        was an early pioneer: runes like <code>$state</code> and <code>$derived</code> are
        effectively signals with compiler support. Angular adopted signals in v16. Vue's ref/
        computed system is signal-based. SolidJS was built on signals from the start. React is
        the last major framework without native signal support.
      </p>
      <p style={pStyle}>
        The <code>@preact/signals-react</code> library brings signal-based reactivity to React
        today. It allows state updates to bypass React's re-render cycle entirely, updating the
        DOM directly. The TC39 signals proposal (currently Stage 1) aims to standardize signals
        at the language level, which would eventually give all frameworks -- including React --
        a shared reactivity primitive.
      </p>

      <CodeBlock
        code={`// Signals in React via @preact/signals-react
import { signal, computed } from '@preact/signals-react';

// Signals live outside components, like Svelte stores
const count = signal(0);
const doubled = computed(() => count.value * 2);

// Components that use .value auto-subscribe
// No selectors, no hooks, no re-renders of the component
function Counter() {
  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={() => count.value++}>
        Increment
      </button>
    </div>
  );
}

// The signal updates the DOM text node directly,
// without re-rendering the Counter component at all.
// This is the same model Svelte uses under the hood.`}
        language="tsx"
        filename="signals-example.tsx"
        highlight={[5, 6, 13, 14, 15]}
      />

      <Callout type="insight" title="Svelte Runes ARE Signals">
        Svelte runes are signals. The <code>$state</code> rune creates a signal,
        <code> $derived</code> creates a computed signal, and <code>$effect</code> creates a
        reaction. React's ecosystem is slowly converging toward what Svelte already provides
        natively. The difference is that Svelte has compiler support to eliminate the
        <code> .value</code> ceremony and optimize updates at build time. React signal libraries
        must work within React's runtime constraints, which makes them less seamless. Still, if
        signals feel natural to you from Svelte, you can use them in React today.
      </Callout>

      {/* ===== Decision Matrix ===== */}
      <h2 style={h2Style}>Decision Matrix</h2>
      <p style={pStyle}>
        Choosing a state management solution is not about finding the "best" library -- it is
        about matching the tool to your application's actual needs. Here is a practical guide
        based on common scenarios.
      </p>

      <ComparisonTable
        caption="Which state management solution for which scenario"
        headers={['Scenario', 'Recommended', 'Why']}
        rows={[
          [
            'Simple app (landing pages, blogs, portfolios)',
            'useState + Context',
            'Built-in, zero bundle cost, sufficient for low-frequency global state like theme and auth',
          ],
          [
            'Medium SaaS app (dashboards, project tools)',
            'Zustand',
            'Selector-based subscriptions prevent re-render cascades, minimal API surface, excellent TypeScript support',
          ],
          [
            'Form-heavy CRUD app (admin panels, data entry)',
            'Jotai (+ React Hook Form)',
            'Atomic model lets each form field be an independent atom, derived atoms handle validation, no wasted re-renders',
          ],
          [
            'Large enterprise app (banking, ERP, multi-team)',
            'Redux Toolkit',
            'Strict conventions scale across large teams, middleware for logging/analytics, time-travel debugging, RTK Query for API layer',
          ],
          [
            'Real-time collaborative app (whiteboards, editors)',
            'Valtio or Zustand',
            'Valtio\'s mutable model maps naturally to CRDT operations; Zustand works if you prefer explicit updates with transient state',
          ],
          [
            'Micro-frontend / widget embedded in other apps',
            'Jotai or Zustand',
            'No provider required (Zustand) or minimal Provider (Jotai), small bundle, no global side effects',
          ],
          [
            'Migrating from Svelte and want familiar patterns',
            'Zustand (stores) or Jotai (atoms)',
            'Zustand mirrors custom stores with selectors; Jotai mirrors writable/derived with atomic composition',
          ],
        ]}
      />

      <Callout type="info" title="The Pragmatic Starting Point">
        Start with <code>useState</code> and <code>useContext</code>. You will not need an
        external library on day one. Add Zustand when Context re-renders become a measurable
        problem, or when you find yourself passing state through three or more intermediate
        components that do not use it. You will know when -- the symptoms are sluggish UI updates
        and a growing web of providers wrapping your app root. The migration from Context to
        Zustand is straightforward: extract the state into a Zustand store and replace
        <code> useContext</code> calls with <code>useStore</code> selectors.
      </Callout>

      <h2 style={h2Style}>Migration Cheat Sheet: Svelte Stores to React</h2>
      <p style={pStyle}>
        Here is a quick reference mapping Svelte store patterns to their closest React
        equivalents across the different libraries. Keep this handy during your first few React
        projects.
      </p>

      <ComparisonTable
        caption="Svelte store patterns mapped to React state libraries"
        headers={['Svelte Pattern', 'Zustand Equivalent', 'Jotai Equivalent']}
        rows={[
          [
            'writable(value)',
            'create(() => ({ value, setValue }))',
            'atom(value)',
          ],
          [
            'derived(store, fn)',
            'useStore(s => fn(s))',
            'atom((get) => fn(get(baseAtom)))',
          ],
          [
            '$store (subscribe)',
            'useStore(s => s.field)',
            'useAtomValue(myAtom)',
          ],
          [
            '$store = newValue (set)',
            'useStore(s => s.setValue)(newValue)',
            'useSetAtom(myAtom)(newValue)',
          ],
          [
            'store.update(fn)',
            'set((state) => ({ ...state, ...fn(state) }))',
            'set with useAtom write function',
          ],
          [
            'Custom store (writable + methods)',
            'create with actions alongside state',
            'Write-only atom with (get, set) signature',
          ],
          [
            'Store outside components',
            'create() returns hook, store is external',
            'atom() defined at module level',
          ],
        ]}
      />

      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        React's state management ecosystem is richer and more fragmented than Svelte's because
        React does not have a built-in reactive primitive that covers all use cases. This is
        not a weakness -- it is a reflection of the diverse scale of React applications. The
        core insight for Svelte developers is this: React Context is not a replacement for
        Svelte stores. It is a dependency injection mechanism that happens to trigger re-renders.
        For actual state management with granular subscriptions, reach for Zustand (if you think
        in terms of stores) or Jotai (if you think in terms of atoms and derived values).
      </p>
      <p style={pStyle}>
        Redux Toolkit remains the right answer for large teams and complex enterprise applications
        where strict conventions, middleware, and time-travel debugging provide genuine value.
        Valtio offers the closest developer experience to Svelte's mutable-style runes, but its
        proxy-based approach demands discipline around debugging and traceability. And signals --
        which Svelte pioneered with runes -- are slowly making their way into the broader
        JavaScript ecosystem, with the TC39 proposal potentially standardizing what Svelte
        developers already take for granted.
      </p>
      <p style={pStyle}>
        The most important takeaway: do not pick a state management library on day one of a
        project. Start with <code>useState</code> for local state and <code>useContext</code> for
        the few truly global values (theme, auth, locale). When you hit the wall -- when Context
        re-renders cascade through your component tree, when prop drilling becomes unmanageable,
        when you need persistence or middleware -- that is when you add Zustand or Jotai. You
        will know exactly which problem you are solving, and the migration will be targeted and
        incremental.
      </p>

      <CodeExercise
        id="ecosystem-state-complete-zustand"
        title="Complete the Zustand Store"
        type="complete-the-code"
        description="Complete this Zustand store for a shopping cart. Define the state shape and the addItem/removeItem actions."
        buggyPreview={<BuggyCartStore />}
        solvedPreview={<FixedCartStore />}
        initialCode={`import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
}

const useCartStore = create((set) => ({
  // TODO: Define items array
  // TODO: Define addItem action
  // TODO: Define removeItem action
}));

// Usage:
// const items = useCartStore(state => state.items);
// const addItem = useCartStore(state => state.addItem);`}
        solution={`import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
}

const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
}));

// Usage:
// const items = useCartStore(state => state.items);
// const addItem = useCartStore(state => state.addItem);`}
        validationPatterns={["items: []", "addItem:", "set((state) =>", "removeItem:", "filter("]}
        hints={[
          "Start with items: [] as the initial state",
          "Actions use set() to update state. set((state) => ({ ... })) gives you the current state.",
          "addItem should spread the existing items and add the new one. removeItem should filter by id."
        ]}
      />
    </ChapterLayout>
  );
}
