import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

function BuggyPostsPage() {
  return (
    <div style={{ padding: '0.5rem', background: 'var(--color-bg-secondary)', borderRadius: '6px' }}>
      <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: '0 0 0.3rem' }}>Blog Posts</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Loading...</p>
      <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.4rem' }}>⚠ No fetch call — data never loads</p>
    </div>
  );
}

function FixedPostsPage() {
  const posts = [{ id: 1, title: 'Getting Started with React' }, { id: 2, title: 'Server Components Explained' }, { id: 3, title: 'Data Fetching Patterns' }];
  return (
    <div style={{ padding: '0.5rem', background: 'var(--color-bg-secondary)', borderRadius: '6px' }}>
      <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: '0 0 0.3rem' }}>Blog Posts</h3>
      <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
        {posts.map(post => <li key={post.id} style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', padding: '0.1rem 0' }}>{post.title}</li>)}
      </ul>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.4rem' }}>✓ Data fetched and rendered on the server</p>
    </div>
  );
}

export default function NextjsData() {
  return (
    <ChapterLayout id="nextjs-data">
      <p style={pStyle}>
        Data fetching is where SvelteKit and Next.js diverge most philosophically. SvelteKit
        separates concerns clearly: the <code>load</code> function fetches data, the component
        renders it. Next.js merges them — a Server Component is simultaneously the data fetcher
        and the renderer. This difference is not merely syntactic; it reflects a fundamentally
        different architecture (React Server Components) that changes how you think about the
        boundary between server and client code.
      </p>

      <h2 style={h2Style}>
        Server-Side Data Fetching
      </h2>

      <p style={pStyle}>
        In SvelteKit, you export a <code>load</code> function from <code>+page.server.ts</code>
        (or <code>+page.ts</code> for universal loading). This function receives the request
        context and returns an object that becomes the page's <code>data</code> prop. The load
        function and the page component are separate files with a typed contract between them.
      </p>

      <p style={pStyle}>
        In Next.js, a Server Component is an async function. You fetch data directly in the
        component body using <code>await</code>. There is no separate load function, no typed
        data contract, and no distinction between "fetching" and "rendering." The component
        does both.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/routes/products/+page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';

export const load: PageServerLoad = async ({
  url,
  cookies,
  locals,
}) => {
  const category = url.searchParams.get('cat');
  const userId = locals.user?.id;

  const products = await db.product.findMany({
    where: category
      ? { category }
      : undefined,
    take: 20,
  });

  const favorites = userId
    ? await db.favorite.findMany({
        where: { userId },
      })
    : [];

  return {
    products,
    favorites,
    category,
  };
};

// src/routes/products/+page.svelte
<script lang="ts">
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ProductCard.svelte';

  let { data }: { data: PageData } = $props();
</script>

<h1>Products {data.category ? \`- \${data.category}\` : ''}</h1>
<div class="grid">
  {#each data.products as product (product.id)}
    <ProductCard
      {product}
      isFavorite={data.favorites.some(f => f.productId === product.id)}
    />
  {/each}
</div>`,
          filename: '+page.server.ts + +page.svelte',
        }}
        react={{
          code: `// app/products/page.tsx (Server Component)
import { db } from '@/lib/database';
import { cookies } from 'next/headers';
import { ProductCard } from '@/components/ProductCard';
import { getUser } from '@/lib/auth';

interface ProductsPageProps {
  searchParams: Promise<{
    cat?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { cat: category } = await searchParams;
  const user = await getUser();

  const products = await db.product.findMany({
    where: category
      ? { category }
      : undefined,
    take: 20,
  });

  const favorites = user
    ? await db.favorite.findMany({
        where: { userId: user.id },
      })
    : [];

  return (
    <>
      <h1>
        Products {category ? \`- \${category}\` : ''}
      </h1>
      <div className="grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.some(
              f => f.productId === product.id
            )}
          />
        ))}
      </div>
    </>
  );
}`,
          filename: 'app/products/page.tsx',
          highlight: [7, 8, 9, 10, 13, 14, 15, 16, 17],
        }}
        note="SvelteKit's load function receives url, cookies, and locals as parameters. Next.js passes searchParams as a prop and provides cookies(), headers() as importable functions. The data fetching logic is identical — only its location changes."
      />

      <Callout type="insight" title="The Component IS the Data Fetcher">
        SvelteKit's load function is a clear contract: it receives request context, returns
        typed data. Next.js Server Components blur the line — the component IS the data fetcher.
        There is no separate data layer. This means you can fetch data exactly where you need it,
        but it also means the boundary between server and client code is less visible. You must
        be intentional about what is a Server Component and what needs <code>"use client"</code>.
      </Callout>

      <h2 style={h2Style}>
        Data Typing and Contracts
      </h2>

      <p style={pStyle}>
        SvelteKit generates type definitions for your load function return values. When you write
        a load function, the <code>PageData</code> type is automatically inferred and available
        in your component via <code>./$types</code>. This creates a typed contract between your
        server code and your UI code.
      </p>

      <p style={pStyle}>
        Next.js does not have this automatic type generation. Since the data fetching happens
        inside the component itself, the types are whatever your database client or API returns.
        You define your own interfaces or rely on inference. For shared types between Server
        and Client Components, you define them in a separate file.
      </p>

      <CodeComparison
        svelte={{
          code: `// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    user: { name: 'Alice', role: 'admin' },
    stats: { posts: 42, comments: 108 },
  };
};

// +page.svelte — PageData is auto-generated
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  // data.user is typed as { name: string; role: string }
  // data.stats is typed as { posts: number; comments: number }
</script>

<h1>Welcome, {data.user.name}</h1>
<p>{data.stats.posts} posts</p>`,
          filename: 'SvelteKit auto-generated types',
          language: 'typescript',
        }}
        react={{
          code: `// app/dashboard/page.tsx
// No auto-generated types — define your own
// or rely on inference from your data layer

import { db } from '@/lib/database';

export default async function DashboardPage() {
  // Types come from your ORM/API client
  const user = await db.user.findUnique({
    where: { id: 'current-user' },
  });
  // user is typed by Prisma's generated types

  const stats = await db.post.aggregate({
    _count: true,
  });

  return (
    <>
      <h1>Welcome, {user?.name}</h1>
      <p>{stats._count} posts</p>
    </>
  );
}

// For shared types between components:
// lib/types.ts
export interface DashboardData {
  user: { name: string; role: string };
  stats: { posts: number; comments: number };
}`,
          filename: 'Next.js manual types',
          language: 'typescript',
        }}
        note="SvelteKit's automatic PageData type generation is a significant DX advantage. Next.js relies on your ORM's type generation (like Prisma) or manual type definitions. The trade-off is flexibility vs. convenience."
      />

      <h2 style={h2Style}>
        Client-Side Data Fetching
      </h2>

      <p style={pStyle}>
        Not all data fetching happens on the server. Both frameworks support fetching data on
        the client for dynamic content that depends on user interaction, like search-as-you-type,
        infinite scrolling, or polling. The patterns are quite different between Svelte and React.
      </p>

      <CodeComparison
        svelte={{
          code: `<script lang="ts">
  import { onMount } from 'svelte';

  let query = $state('');
  let results = $state<string[]>([]);
  let loading = $state(false);

  // Fetch on user interaction
  async function search() {
    if (!query.trim()) return;
    loading = true;
    const res = await fetch(
      \`/api/search?q=\${encodeURIComponent(query)}\`
    );
    results = await res.json();
    loading = false;
  }

  // Or fetch on mount
  let initialData = $state(null);
  onMount(async () => {
    const res = await fetch('/api/initial');
    initialData = await res.json();
  });

  // Reactive fetch with debounce
  let debounceTimer: ReturnType<typeof setTimeout>;
  $effect(() => {
    clearTimeout(debounceTimer);
    if (query.length > 2) {
      debounceTimer = setTimeout(search, 300);
    }
    return () => clearTimeout(debounceTimer);
  });
</script>

<input bind:value={query} placeholder="Search..." />
{#if loading}
  <p>Searching...</p>
{:else}
  <ul>
    {#each results as result}
      <li>{result}</li>
    {/each}
  </ul>
{/if}`,
          filename: 'Client-side fetch in Svelte',
        }}
        react={{
          code: `"use client";
import { useState, useEffect, useCallback } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(
      () => setDebounced(value), delay
    );
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  // Fetch when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length <= 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(
      \`/api/search?q=\${encodeURIComponent(debouncedQuery)}\`,
      { signal: controller.signal }
    )
      .then(r => r.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading ? (
        <p>Searching...</p>
      ) : (
        <ul>
          {results.map((result, i) => (
            <li key={i}>{result}</li>
          ))}
        </ul>
      )}
    </>
  );
}`,
          filename: 'Client-side fetch in React',
          highlight: [1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 20, 29, 43],
        }}
        note="React's client-side fetching requires more boilerplate: 'use client' directive, AbortController for cleanup, explicit state management. The custom useDebounce hook demonstrates React's composable hook pattern. Libraries like TanStack Query or SWR are commonly used to reduce this boilerplate."
      />

      <h3 style={h3Style}>
        Data Fetching Libraries
      </h3>

      <p style={pStyle}>
        In practice, most React applications use a data fetching library for client-side fetching
        instead of raw <code>useEffect</code> + <code>fetch</code>. The most popular options are
        TanStack Query (formerly React Query) and SWR. These libraries handle caching, revalidation,
        optimistic updates, and error retries — all things you would otherwise implement manually.
      </p>

      <CodeBlock
        code={`"use client";
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url).then(r => r.json());

export default function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading, mutate } = useSWR(
    \`/api/users/\${userId}\`,
    fetcher
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading user</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  );
}

// Compare with TanStack Query:
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () =>
      fetch(\`/api/users/\${userId}\`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  // ...
}`}
        language="tsx"
        filename="Client-side fetching with SWR and TanStack Query"
      />

      <h2 style={h2Style}>
        Streaming and Suspense
      </h2>

      <p style={pStyle}>
        Both frameworks support streaming server-rendered content to the browser, but the
        mechanisms differ. Next.js leverages React Suspense boundaries natively — you can
        wrap slow-loading parts of the page in Suspense with a fallback, and they will stream
        in when ready. SvelteKit handles streaming through its load function by returning
        promises that resolve asynchronously.
      </p>

      <CodeComparison
        svelte={{
          code: `// +page.server.ts — streaming with promises
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // This data loads immediately
  const user = await getUser();

  // These stream in when ready (not awaited)
  return {
    user,
    // Return a promise — page renders
    // immediately, data streams in
    recommendations: getRecommendations(user.id),
    recentActivity: getRecentActivity(user.id),
  };
};

// +page.svelte — use {#await} for streamed data
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<h1>Welcome, {data.user.name}</h1>

{#await data.recommendations}
  <p>Loading recommendations...</p>
{:then recommendations}
  {#each recommendations as item}
    <div>{item.title}</div>
  {/each}
{/await}

{#await data.recentActivity}
  <p>Loading activity...</p>
{:then activity}
  {#each activity as item}
    <div>{item.description}</div>
  {/each}
{/await}`,
          filename: 'Streaming in SvelteKit',
        }}
        react={{
          code: `// app/dashboard/page.tsx — streaming with Suspense
import { Suspense } from 'react';

export default async function DashboardPage() {
  // This data loads before any HTML is sent
  const user = await getUser();

  return (
    <>
      <h1>Welcome, {user.name}</h1>

      {/* Each Suspense boundary streams independently */}
      <Suspense
        fallback={<p>Loading recommendations...</p>}
      >
        <Recommendations userId={user.id} />
      </Suspense>

      <Suspense
        fallback={<p>Loading activity...</p>}
      >
        <RecentActivity userId={user.id} />
      </Suspense>
    </>
  );
}

// Separate async Server Components
async function Recommendations({
  userId,
}: {
  userId: string;
}) {
  const items = await getRecommendations(userId);
  return (
    <>
      {items.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </>
  );
}

async function RecentActivity({
  userId,
}: {
  userId: string;
}) {
  const items = await getRecentActivity(userId);
  return (
    <>
      {items.map(item => (
        <div key={item.id}>{item.description}</div>
      ))}
    </>
  );
}`,
          filename: 'Streaming in Next.js',
          highlight: [13, 14, 15, 16, 17, 19, 20, 21, 22, 23],
        }}
        note="SvelteKit streams by returning un-awaited promises from load and using {#await} blocks. Next.js streams by wrapping async Server Components in Suspense boundaries. The result is the same: the page renders immediately with fallback UI, and slow sections stream in progressively."
      />

      <h2 style={h2Style}>
        Caching and Revalidation
      </h2>

      <p style={pStyle}>
        Next.js has a sophisticated caching layer for Server Component data. By default, fetch
        requests in Server Components are cached and deduplicated. You control caching behavior
        with options on the fetch call or with route segment configuration. SvelteKit leaves
        caching to the developer, relying on standard HTTP cache headers and your deployment
        platform's CDN.
      </p>

      <CodeBlock
        code={`// Next.js fetch caching options in Server Components

// Default: cached indefinitely (static)
const data = await fetch('https://api.example.com/data');

// Revalidate every 60 seconds (ISR-like)
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 },
});

// No caching (dynamic, always fresh)
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store',
});

// Tag-based revalidation
const data = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] },
});

// Later, in a Server Action:
import { revalidateTag } from 'next/cache';
revalidateTag('posts'); // Invalidate all fetches tagged 'posts'

// Route segment config (applies to all fetches in the route)
export const dynamic = 'force-dynamic'; // No caching
export const revalidate = 60; // Revalidate every 60s`}
        language="typescript"
        filename="Next.js caching strategies"
      />

      <p style={pStyle}>
        SvelteKit does not have a built-in fetch caching layer. Instead, you manage caching
        through standard HTTP headers in your load functions or by setting cache headers on
        your responses. The <code>setHeaders</code> function in load lets you control
        <code> Cache-Control</code> headers directly.
      </p>

      <CodeBlock
        code={`// SvelteKit caching approach
export const load: PageServerLoad = async ({
  setHeaders,
  fetch,
}) => {
  // Set HTTP cache headers
  setHeaders({
    'Cache-Control': 'max-age=60, s-maxage=60',
  });

  const data = await fetch('https://api.example.com/data');
  return { data: await data.json() };
};

// Or use the depends() function for fine-grained invalidation
export const load: PageServerLoad = async ({
  depends,
}) => {
  depends('app:posts');
  const posts = await getPosts();
  return { posts };
};

// Trigger revalidation from anywhere:
import { invalidate } from '$app/navigation';
invalidate('app:posts');`}
        language="typescript"
        filename="SvelteKit caching approach"
      />

      <h2 style={h2Style}>
        Request Deduplication
      </h2>

      <p style={pStyle}>
        A subtle but important feature of Next.js Server Components is automatic request
        deduplication. If multiple components on the same page fetch the same URL, Next.js
        makes only one actual network request. SvelteKit achieves something similar with its
        <code> fetch</code> function passed to load functions, which deduplicates requests made
        during the same server-side render.
      </p>

      <CodeBlock
        code={`// Next.js: Automatic deduplication
// These two components render on the same page:

async function Header() {
  // This fetch is deduplicated with the one below
  const user = await fetch('/api/user');
  return <nav>{user.name}</nav>;
}

async function Sidebar() {
  // Same URL = same request (deduplicated)
  const user = await fetch('/api/user');
  return <div>Welcome, {user.name}</div>;
}

// Only ONE network request is made, not two.
// This works because React extends fetch() to
// memoize results during a single render pass.`}
        language="tsx"
        filename="Request deduplication"
      />

      <h2 style={h2Style}>
        Passing Data Between Components
      </h2>

      <p style={pStyle}>
        In SvelteKit, the load function returns data that is available to the entire page.
        Layout load functions pass data down to child layouts and pages via the <code>data</code>
        prop. In Next.js, there is no centralized data passing mechanism for Server Components.
        Each component fetches its own data. This is by design — it encourages colocation and
        works well with request deduplication.
      </p>

      <CodeComparison
        svelte={{
          code: `// Layout load passes data to all children
// src/routes/+layout.server.ts
export const load = async ({ locals }) => {
  return {
    user: locals.user,
    notifications: await getNotifications(locals.user),
  };
};

// Child page accesses layout data via $page
// src/routes/dashboard/+page.svelte
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  // data includes both layout and page data
</script>

<p>Hello, {data.user.name}</p>
<p>{data.notifications.length} notifications</p>`,
          filename: 'SvelteKit layout data passing',
        }}
        react={{
          code: `// Next.js: each component fetches its own data
// No centralized data passing for Server Components

// app/layout.tsx
import { getUser } from '@/lib/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="en">
      <body>
        <nav>Hello, {user.name}</nav>
        {children}
      </body>
    </html>
  );
}

// app/dashboard/page.tsx
// Fetches user AGAIN — deduplicated by React
import { getUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getUser();
  const notifications = await getNotifications(user);

  return (
    <div>
      <p>{notifications.length} notifications</p>
    </div>
  );
}`,
          filename: 'Next.js independent fetching',
          highlight: [2, 3, 12, 26, 27, 29],
        }}
        note="SvelteKit centralizes data in load functions that cascade down. Next.js encourages each component to fetch its own data, relying on request deduplication to avoid redundant network calls. Different philosophies, both effective."
      />

      <h2 style={h2Style}>
        Data Fetching Comparison
      </h2>

      <ComparisonTable
        caption="Data Fetching: SvelteKit vs Next.js"
        headers={['Concept', 'SvelteKit', 'Next.js App Router']}
        rows={[
          ['Server data loading', '+page.server.ts load()', 'async Server Component'],
          ['Universal loading', '+page.ts load()', 'No direct equivalent'],
          ['Data typing', 'Auto-generated PageData', 'Manual or ORM-generated types'],
          ['Client-side fetching', 'onMount + fetch / $effect', 'useEffect + state / SWR / TanStack Query'],
          ['Streaming', 'Return promises from load', 'Suspense + async Server Components'],
          ['Caching', 'HTTP headers (manual)', 'Built-in fetch cache + revalidate'],
          ['Request deduplication', 'load fetch() dedupes', 'Automatic fetch() deduplication'],
          ['Revalidation', 'invalidate() / depends()', 'revalidateTag() / revalidatePath()'],
          ['Data passing', 'Layout load cascades down', 'Each component fetches independently'],
          ['Search params', 'url.searchParams in load', 'searchParams prop on page'],
          ['Cookies', 'cookies parameter in load', 'cookies() function import'],
          ['Headers', 'request.headers in load', 'headers() function import'],
        ]}
      />

      <p style={pStyle}>
        The fundamental trade-off is separation vs. colocation. SvelteKit's load functions create
        a clear, typed boundary between data fetching and rendering. Next.js Server Components
        colocate data fetching with the UI that consumes it, which reduces indirection but makes
        the server/client boundary less visible. Both approaches work well in practice. If you
        value explicit contracts and type safety, you may miss SvelteKit's load function pattern.
        If you value simplicity and colocation, Next.js's approach may feel more natural. In the
        next chapter, we will explore how both frameworks handle different rendering strategies:
        SSR, SSG, and ISR.
      </p>

      <CodeExercise
        id="nextjs-data-complete-fetch"
        title="Complete Server Fetch"
        type="complete-the-code"
        description="Complete this Next.js Server Component to fetch and display a list of posts. Unlike SvelteKit's load function, Server Components can fetch data directly in the component body."
        buggyPreview={<BuggyPostsPage />}
        solvedPreview={<FixedPostsPage />}
        initialCode={`// app/posts/page.tsx (Server Component)

interface Post {
  id: number;
  title: string;
}

export default async function PostsPage() {
  // TODO: Fetch posts from /api/posts
  // TODO: Parse the JSON response

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}`}
        solution={`// app/posts/page.tsx (Server Component)

interface Post {
  id: number;
  title: string;
}

export default async function PostsPage() {
  const res = await fetch('/api/posts');
  const posts: Post[] = await res.json();

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}`}
        validationPatterns={["await fetch(", "await res.json()"]}
        hints={[
          "In SvelteKit, data fetching goes in +page.server.ts load(). In Next.js Server Components, you fetch directly in the component.",
          "Use await fetch('/api/posts') to get the response",
          "Then parse it with await res.json() and assign to a typed variable"
        ]}
      />
    </ChapterLayout>
  );
}
