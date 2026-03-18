import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function EcosystemData() {
  return (
    <ChapterLayout id="ecosystem-data">
      <p style={pStyle}>
        Before diving into specific libraries, it helps to distinguish two fundamentally different
        kinds of state. <strong>Server state</strong> is data that lives on a remote server — API
        responses, database records, user profiles. Your app fetches it, caches a local copy, and
        tries to keep that copy fresh. <strong>Client state</strong> is data that exists only in the
        browser — whether a sidebar is open, which tab is selected, the current value of a form
        input. Client state is born and dies with the UI session.
      </p>

      <p style={pStyle}>
        In SvelteKit, server state is elegantly handled by <code>load</code> functions that run on
        the server before your page renders, and by <code>{'{#await}'}</code> blocks for client-side
        fetches. SvelteKit gives you caching via <code>invalidate()</code>, type safety via
        generated <code>$types</code>, and a clear separation between server and client code. React
        has no built-in equivalent. There is no framework-level data loading primitive, no
        automatic cache, and no invalidation system. This is exactly why data fetching libraries
        exist in the React ecosystem — they fill a gap that SvelteKit fills for you at the
        framework level.
      </p>

      {/* ─── The Server State Problem ─── */}
      <h2 style={h2Style}>The Server State Problem</h2>

      <p style={pStyle}>
        The most natural instinct when coming to React is to reach for <code>useEffect</code> and
        <code>useState</code> to fetch data. This is the pattern every React tutorial teaches first,
        and it is the pattern that every production app eventually outgrows.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/routes/todos/+page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';

export const load: PageServerLoad = async () => {
  const todos = await db.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return { todos };
};

// src/routes/todos/+page.svelte
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  // data.todos is typed, loaded on the server,
  // and available immediately — no loading state
</script>

{#each data.todos as todo}
  <div>{todo.title}</div>
{/each}`,
          filename: '+page.server.ts / +page.svelte',
          language: 'typescript',
        }}
        react={{
          code: `import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/todos')
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setTodos(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>{todo.title}</div>
      ))}
    </div>
  );
}`,
          filename: 'TodoPage.tsx',
          language: 'typescript',
        }}
        note="SvelteKit handles data loading at the framework level. In plain React, you are responsible for everything."
      />

      <p style={pStyle}>
        The naive React approach above looks functional, but it has serious problems in production:
      </p>

      <ul style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, paddingLeft: '1.5rem' }}>
        <li><strong>No caching</strong> — every mount re-fetches, even if the data was just loaded on another page.</li>
        <li><strong>No deduplication</strong> — if two components request the same data, two identical network requests fire.</li>
        <li><strong>No background refetching</strong> — stale data stays stale until the user navigates away and back.</li>
        <li><strong>No optimistic updates</strong> — mutations require full refetch-and-wait cycles.</li>
        <li><strong>Race conditions</strong> — rapid navigation or re-renders can cause out-of-order responses to overwrite newer data.</li>
        <li><strong>No error retry</strong> — a transient network failure permanently breaks the component until remount.</li>
      </ul>

      <Callout type="gotcha" title="The useEffect fetch trap">
        Every React developer has written a broken useEffect fetch at some point. Race conditions,
        missing cleanup, stale closures — this is exactly the problem these libraries solve. If you
        find yourself writing <code>useEffect</code> with <code>fetch</code> inside, stop and
        reach for TanStack Query or SWR instead.
      </Callout>

      {/* ─── TanStack Query ─── */}
      <h2 style={h2Style}>TanStack Query (React Query)</h2>

      <p style={pStyle}>
        TanStack Query (formerly React Query) is the most popular server state library in the React
        ecosystem. It gives you caching, automatic background refetching, deduplication, mutation
        handling, and optimistic updates — all the things SvelteKit's load functions and
        invalidation system give you, but as a client-side library. The mental model maps
        surprisingly well: a <code>queryKey</code> is like a SvelteKit route's URL, and
        <code>queryClient.invalidateQueries</code> is like SvelteKit's <code>invalidate()</code>.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/routes/todos/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  return { todos };
};

// src/routes/todos/+page.svelte
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<!-- data.todos is ready, typed, SSR'd -->
{#each data.todos as todo}
  <p>{todo.title}</p>
{/each}`,
          filename: '+page.server.ts / +page.svelte',
          language: 'typescript',
        }}
        react={{
          code: `import { useQuery } from '@tanstack/react-query';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('/api/todos');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default function TodoPage() {
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {todos?.map(todo => (
        <p key={todo.id}>{todo.title}</p>
      ))}
    </div>
  );
}`,
          filename: 'TodoPage.tsx',
          language: 'typescript',
        }}
        note="useQuery handles caching, deduplication, retries, and background refetching. The query key ['todos'] identifies this cache entry."
      />

      <h3 style={h3Style}>Setting Up the Provider</h3>

      <p style={pStyle}>
        TanStack Query requires a <code>QueryClientProvider</code> at the root of your app, similar
        to how React context providers work. This creates the shared cache that all
        <code>useQuery</code> and <code>useMutation</code> hooks read from and write to.
      </p>

      <CodeBlock
        code={`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}`}
        filename="App.tsx"
        language="typescript"
      />

      <h3 style={h3Style}>Mutations and Cache Invalidation</h3>

      <p style={pStyle}>
        In SvelteKit, you submit a form action and call <code>invalidateAll()</code> or
        <code>invalidate('/api/todos')</code> to refresh data. TanStack Query's equivalent is
        <code>useMutation</code> combined with <code>queryClient.invalidateQueries</code>. After a
        mutation succeeds, you tell the cache which queries are now stale.
      </p>

      <CodeBlock
        code={`import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async (): Promise<Todo[]> => {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      return res.json();
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Failed to create todo');
      return res.json() as Promise<Todo>;
    },
    onSuccess: () => {
      // Like SvelteKit's invalidate('/api/todos')
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

// Usage in a component
function TodoForm() {
  const [title, setTitle] = useState('');
  const createTodo = useCreateTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTodo.mutate(title, {
      onSuccess: () => setTitle(''),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New todo..."
      />
      <button
        type="submit"
        disabled={createTodo.isPending}
      >
        {createTodo.isPending ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}`}
        filename="useTodos.ts"
        language="typescript"
      />

      <h3 style={h3Style}>Optimistic Updates</h3>

      <p style={pStyle}>
        Optimistic updates make your app feel instant by updating the UI before the server
        confirms the mutation. If the server rejects the change, you roll back to the previous
        state. TanStack Query has a structured pattern for this using <code>onMutate</code>,
        <code>onError</code>, and <code>onSettled</code> callbacks.
      </p>

      <CodeBlock
        code={`import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoId: string) => {
      const res = await fetch(\`/api/todos/\${todoId}/toggle\`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Toggle failed');
      return res.json() as Promise<Todo>;
    },

    // 1. Optimistically update the cache before the request
    onMutate: async (todoId) => {
      // Cancel in-flight queries so they don't overwrite
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot the previous value for rollback
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically toggle the todo
      queryClient.setQueryData<Todo[]>(['todos'], old =>
        old?.map(todo =>
          todo.id === todoId
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      );

      // Return the snapshot for rollback
      return { previousTodos };
    },

    // 2. Roll back on error
    onError: (_err, _todoId, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },

    // 3. Always refetch to ensure server and client are in sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}`}
        filename="useToggleTodo.ts"
        language="typescript"
      />

      <h3 style={h3Style}>Infinite Queries</h3>

      <p style={pStyle}>
        For paginated or infinite scroll data, TanStack Query provides <code>useInfiniteQuery</code>.
        It manages an array of pages, tracks the next page parameter, and handles loading states
        for both initial load and subsequent pages.
      </p>

      <CodeBlock
        code={`import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useCallback } from 'react';

interface PostsPage {
  posts: { id: string; title: string; body: string }[];
  nextCursor: string | null;
}

export default function InfiniteFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts', 'feed'],
    queryFn: async ({ pageParam }): Promise<PostsPage> => {
      const url = pageParam
        ? \`/api/posts?cursor=\${pageParam}\`
        : '/api/posts';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Intersection Observer for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (isLoading) return <p>Loading feed...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <div>
      {allPosts.map((post, index) => (
        <div
          key={post.id}
          ref={index === allPosts.length - 1 ? lastPostRef : null}
        >
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
}`}
        filename="InfiniteFeed.tsx"
        language="typescript"
      />

      <Callout type="insight" title="Query keys are like SvelteKit's invalidate()">
        Query keys are like SvelteKit's <code>invalidate()</code> but far more granular. You can
        invalidate by exact key (<code>['todos', 42]</code>), by key prefix
        (<code>['todos']</code> matches all todo queries), or by predicate function
        (<code>{`{ predicate: q => q.queryKey[0] === 'todos' }`}</code>). This gives you
        fine-grained cache control that SvelteKit's URL-based invalidation cannot match.
      </Callout>

      <p style={pStyle}>
        TanStack Query also provides <strong>stale-while-revalidate</strong> behavior out of the
        box. When a query's data is "stale" (older than <code>staleTime</code>), the library
        returns the cached data immediately while refetching in the background. When the fresh
        data arrives, the UI updates seamlessly. It also refetches automatically when the browser
        window regains focus and retries failed requests with exponential backoff. These are
        behaviors you would need to build manually in SvelteKit.
      </p>

      {/* ─── SWR ─── */}
      <h2 style={h2Style}>SWR — Vercel's Alternative</h2>

      <p style={pStyle}>
        SWR (stale-while-revalidate) is Vercel's data fetching library. It shares the same core
        philosophy as TanStack Query — cache first, revalidate in the background — but with a
        smaller API surface and lighter footprint. If TanStack Query is a full toolkit, SWR is a
        sharp, focused knife.
      </p>

      <CodeComparison
        svelte={{
          code: `// TanStack Query
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async (): Promise<User> => {
      const res = await fetch(\`/api/users/\${userId}\`);
      if (!res.ok) throw new Error('Fetch failed');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return <h1>{data?.name}</h1>;
}`,
          filename: 'UserProfile.tsx (TanStack Query)',
          language: 'typescript',
        }}
        react={{
          code: `// SWR
import useSWR from 'swr';

interface User {
  id: string;
  name: string;
  email: string;
}

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error('Fetch failed');
    return res.json() as Promise<User>;
  });

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useSWR(
    \`/api/users/\${userId}\`,
    fetcher,
    { dedupingInterval: 5 * 60 * 1000 }
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return <h1>{data?.name}</h1>;
}`,
          filename: 'UserProfile.tsx (SWR)',
          language: 'typescript',
        }}
        note="SWR uses the URL as the cache key by default, so there is no separate queryKey. The fetcher function is passed the key as its argument."
      />

      <p style={pStyle}>
        SWR is sufficient when your data fetching needs are straightforward: fetch, cache, revalidate.
        TanStack Query pulls ahead when you need structured mutations with <code>useMutation</code>,
        optimistic update rollbacks, infinite queries with cursor management, query cancellation,
        or fine-grained cache manipulation. SWR has basic mutation support via <code>useSWRMutation</code>,
        but TanStack Query's mutation lifecycle (<code>onMutate</code>, <code>onError</code>,
        <code>onSettled</code>) is more powerful.
      </p>

      <Callout type="info" title="When to choose SWR">
        SWR is lighter and simpler. TanStack Query has more features (mutations, optimistic
        updates, infinite queries). In Next.js projects, SWR pairs naturally with Vercel's
        ecosystem and is maintained by the same team. Choose SWR for simpler apps or when you
        want a minimal dependency; choose TanStack Query when you need the full server state
        management toolkit.
      </Callout>

      {/* ─── tRPC ─── */}
      <h2 style={h2Style}>tRPC — End-to-End Type Safety</h2>

      <p style={pStyle}>
        One of SvelteKit's best features is its generated types. When you define a
        <code>load</code> function, SvelteKit generates <code>$types</code> that flow through to
        your page component automatically — no manual type definitions, no code generation step.
        In the React world, tRPC achieves the same end-to-end type safety but through a different
        mechanism: your server-side router definitions become the single source of truth, and the
        client infers types directly from the router without any code generation.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/routes/api/user/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const GET: RequestHandler = async ({ params }) => {
  const user = await db.user.findUnique({
    where: { id: params.id },
  });
  if (!user) return json({ error: 'Not found' }, { status: 404 });
  return json(user);
};

// src/routes/user/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';

export const load: PageServerLoad = async ({ params }) => {
  const user = await db.user.findUnique({
    where: { id: params.id },
  });
  // Type flows to $page.data automatically
  return { user };
};`,
          filename: 'SvelteKit typed load',
          language: 'typescript',
        }}
        react={{
          code: `// server/routers/user.ts
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '../database';

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { id: input.id },
      });
      if (!user) throw new Error('Not found');
      return user;
      // Return type is inferred and flows to the client
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      return db.user.create({ data: input });
    }),
});`,
          filename: 'server/routers/user.ts',
          language: 'typescript',
        }}
        note="SvelteKit generates types from your file structure. tRPC infers types from your router definitions — no codegen needed."
      />

      <h3 style={h3Style}>Using tRPC in React Components</h3>

      <p style={pStyle}>
        tRPC integrates with TanStack Query under the hood. When you call a tRPC procedure from a
        React component, you get all of TanStack Query's caching, deduplication, and background
        refetching — but with full type inference from your server code.
      </p>

      <CodeBlock
        code={`// utils/trpc.ts — Create the typed client
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();

// components/UserProfile.tsx — Use in a component
import { trpc } from '../utils/trpc';

export default function UserProfile({ userId }: { userId: string }) {
  // Fully typed: data is inferred from the router definition
  const { data: user, isLoading, error } = trpc.user.getById.useQuery(
    { id: userId }
  );

  const createUser = trpc.user.create.useMutation({
    onSuccess: () => {
      // Invalidate all user queries after creating a new user
      trpc.useUtils().user.getById.invalidate();
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // user.name, user.email — all typed, no manual interfaces
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// App.tsx — Provider setup
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';
import { useState } from 'react';

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}`}
        filename="tRPC setup and usage"
        language="typescript"
      />

      <Callout type="insight" title="tRPC fills the SvelteKit-shaped hole">
        tRPC gives React what SvelteKit gives you for free — type-safe data fetching from server
        to client without code generation or schema files. The difference is that SvelteKit
        achieves this through its file-based routing conventions and build-time type generation,
        while tRPC achieves it through TypeScript inference from a shared router object. Both
        approaches eliminate the "type gap" between server and client.
      </Callout>

      {/* ─── Combining Server and Client State ─── */}
      <h2 style={h2Style}>Combining Server and Client State</h2>

      <p style={pStyle}>
        Real applications need both server state and client state. A dashboard page might fetch
        analytics data from an API (server state) while also tracking which sidebar panel is open
        and which date range filter is selected (client state). The key is to keep these concerns
        in separate systems: server state in TanStack Query's cache, client state in Zustand
        (or useState, or any client state solution).
      </p>

      <CodeBlock
        code={`// stores/uiStore.ts — Client state in Zustand
import { create } from 'zustand';

interface DashboardUI {
  sidebarOpen: boolean;
  selectedDateRange: 'day' | 'week' | 'month' | 'year';
  selectedMetrics: string[];
  toggleSidebar: () => void;
  setDateRange: (range: DashboardUI['selectedDateRange']) => void;
  toggleMetric: (metric: string) => void;
}

export const useDashboardUI = create<DashboardUI>((set) => ({
  sidebarOpen: true,
  selectedDateRange: 'week',
  selectedMetrics: ['revenue', 'users'],
  toggleSidebar: () =>
    set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setDateRange: (range) =>
    set({ selectedDateRange: range }),
  toggleMetric: (metric) =>
    set(state => ({
      selectedMetrics: state.selectedMetrics.includes(metric)
        ? state.selectedMetrics.filter(m => m !== metric)
        : [...state.selectedMetrics, metric],
    })),
}));

// hooks/useAnalytics.ts — Server state in TanStack Query
import { useQuery } from '@tanstack/react-query';
import { useDashboardUI } from '../stores/uiStore';

interface AnalyticsData {
  revenue: number;
  users: number;
  pageViews: number;
  conversionRate: number;
}

export function useAnalytics() {
  const { selectedDateRange, selectedMetrics } = useDashboardUI();

  return useQuery({
    queryKey: ['analytics', selectedDateRange, selectedMetrics],
    queryFn: async (): Promise<AnalyticsData> => {
      const params = new URLSearchParams({
        range: selectedDateRange,
        metrics: selectedMetrics.join(','),
      });
      const res = await fetch(\`/api/analytics?\${params}\`);
      if (!res.ok) throw new Error('Analytics fetch failed');
      return res.json();
    },
    // Refetch every 30 seconds for a live dashboard
    refetchInterval: 30_000,
  });
}

// components/Dashboard.tsx — Combining both
import { useDashboardUI } from '../stores/uiStore';
import { useAnalytics } from '../hooks/useAnalytics';

export default function Dashboard() {
  const {
    sidebarOpen,
    selectedDateRange,
    toggleSidebar,
    setDateRange,
  } = useDashboardUI();

  const { data, isLoading, error } = useAnalytics();

  return (
    <div className="dashboard">
      <button onClick={toggleSidebar}>
        {sidebarOpen ? 'Close' : 'Open'} Sidebar
      </button>

      <div className="date-range-picker">
        {(['day', 'week', 'month', 'year'] as const).map(range => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={selectedDateRange === range ? 'active' : ''}
          >
            {range}
          </button>
        ))}
      </div>

      {isLoading && <p>Loading analytics...</p>}
      {error && <p>Failed to load analytics</p>}
      {data && (
        <div className="metrics-grid">
          <MetricCard label="Revenue" value={data.revenue} />
          <MetricCard label="Users" value={data.users} />
          <MetricCard label="Page Views" value={data.pageViews} />
        </div>
      )}

      {sidebarOpen && <Sidebar />}
    </div>
  );
}`}
        filename="Dashboard with TanStack Query + Zustand"
        language="typescript"
      />

      <Callout type="warning" title="Keep server state out of client state stores">
        Do not put server data in Redux or Zustand. That data belongs in TanStack Query's cache.
        If you store API responses in Zustand, you lose automatic background refetching,
        cache invalidation, stale-while-revalidate behavior, and deduplication. Client state
        libraries are for UI state only — sidebar toggles, selected filters, modal visibility,
        form draft values. Server data and client data have fundamentally different lifetimes and
        update patterns, and mixing them creates bugs that are hard to diagnose.
      </Callout>

      {/* ─── Comparison with SvelteKit Patterns ─── */}
      <h2 style={h2Style}>Comparison with SvelteKit Patterns</h2>

      <p style={pStyle}>
        The following table maps SvelteKit data patterns to their React equivalents. Notice that
        SvelteKit consolidates many of these concerns into the framework itself, while React
        distributes them across specialized libraries. Neither approach is inherently better —
        SvelteKit's integration is more convenient, but React's library ecosystem gives you more
        flexibility and choice.
      </p>

      <ComparisonTable
        headers={['Concept', 'SvelteKit', 'React + Libraries']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          [
            'Server-side data fetching',
            '+page.server.ts load function',
            'Next.js Server Components, or TanStack Query with SSR',
          ],
          [
            'Client-side fetching',
            '{#await fetch(...)} or onMount + $state',
            'useQuery (TanStack Query) or useSWR',
          ],
          [
            'Cache invalidation',
            'invalidate() / invalidateAll()',
            'queryClient.invalidateQueries({ queryKey })',
          ],
          [
            'Optimistic updates',
            'Manual with $state + try/catch',
            'useMutation onMutate/onError/onSettled',
          ],
          [
            'Loading states',
            '{#await} pending block or $page.status',
            'isLoading / isPending from useQuery',
          ],
          [
            'Error handling',
            '+error.svelte or {#await} catch block',
            'error from useQuery or Error Boundaries',
          ],
          [
            'Background refetch',
            'Manual with setInterval or invalidate()',
            'Built-in: refetchOnWindowFocus, refetchInterval',
          ],
          [
            'Infinite scroll',
            'Manual with load + pagination state',
            'useInfiniteQuery with getNextPageParam',
          ],
          [
            'Mutation + revalidation',
            'Form actions + invalidate()',
            'useMutation + invalidateQueries',
          ],
          [
            'End-to-end type safety',
            'Generated $types from load functions',
            'tRPC router inference or code generation',
          ],
        ]}
        caption="SvelteKit patterns mapped to React data fetching libraries"
      />

      <p style={pStyle}>
        The biggest adjustment for Svelte developers is accepting that React requires you to
        choose and compose libraries for data fetching. In SvelteKit, load functions, form
        actions, and invalidation are built in. In React, you assemble this stack yourself —
        TanStack Query or SWR for server state, Zustand or Jotai for client state, and optionally
        tRPC for type safety. The upside is that each piece is independently replaceable and
        testable. The downside is that you need to learn and configure multiple libraries before
        you have the equivalent of what SvelteKit gives you by default.
      </p>

      <p style={pStyle}>
        Start with TanStack Query. It solves the most painful problem (server state management)
        and its mental model — query keys, cache invalidation, mutations — maps directly onto
        concepts you already understand from SvelteKit. Once you are comfortable with that, layer
        in tRPC if you want SvelteKit-level type safety, or SWR if you prefer a lighter tool for
        simpler projects.
      </p>
    </ChapterLayout>
  );
}
