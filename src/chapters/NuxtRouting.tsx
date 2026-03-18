import { ChapterLayout } from '../components/ChapterLayout';
import { CodeBlock } from '../components/CodeBlock';
import { CodeComparison } from '../components/CodeComparison';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function NuxtRouting() {
  return (
    <ChapterLayout id="nuxt-routing">
      <p style={pStyle}>
        All three meta-frameworks use file-based routing, but they each have their own
        conventions for directory structure, dynamic segments, layouts, and data loading.
        If you know SvelteKit's routing, Nuxt will feel familiar but with different file
        names and a few extra conventions. If you know Next.js, Nuxt is actually closer to
        the older Pages Router model than the newer App Router.
      </p>

      <p style={pStyle}>
        This chapter covers Nuxt's routing system, data fetching primitives, and server
        routes, mapping each concept to SvelteKit and Next.js equivalents you already know.
      </p>

      {/* ===== File-Based Routing ===== */}
      <h2 style={h2Style}>File-Based Routing</h2>

      <p style={pStyle}>
        Nuxt uses a <code>pages/</code> directory where each <code>.vue</code> file becomes a
        route. The filename maps to the URL path. Dynamic segments use square brackets, and
        nested routes use nested directories. This is conceptually identical to SvelteKit and
        Next.js, but with different naming conventions.
      </p>

      <h3 style={h3Style}>Directory Structure Comparison</h3>

      <CodeBlock
        code={`# SvelteKit routes
src/routes/
  +page.svelte              -> /
  +layout.svelte            -> layout wrapper
  about/
    +page.svelte            -> /about
  blog/
    +page.svelte            -> /blog
    [slug]/
      +page.svelte          -> /blog/:slug
      +page.server.ts       -> data loader`}
        language="bash"
        filename="SvelteKit routes/"
      />

      <CodeBlock
        code={`# Next.js App Router
app/
  page.tsx                  -> /
  layout.tsx                -> layout wrapper
  about/
    page.tsx                -> /about
  blog/
    page.tsx                -> /blog
    [slug]/
      page.tsx              -> /blog/:slug
      loading.tsx           -> loading UI`}
        language="bash"
        filename="Next.js app/"
      />

      <CodeBlock
        code={`# Nuxt pages
pages/
  index.vue                 -> /
  about.vue                 -> /about
  blog/
    index.vue               -> /blog
    [slug].vue              -> /blog/:slug
layouts/
  default.vue               -> layout wrapper
middleware/
  auth.ts                   -> route middleware`}
        language="bash"
        filename="Nuxt pages/"
        highlight={[2, 3, 4, 6, 7]}
      />

      <p style={pStyle}>
        Notice the key differences: Nuxt uses <code>index.vue</code> for directory root
        pages (like Next.js Pages Router), while SvelteKit uses <code>+page.svelte</code>.
        Nuxt keeps layouts in a separate <code>layouts/</code> directory rather than
        co-locating them with routes. Dynamic segments use <code>[param]</code> in all three,
        but the file extension differs.
      </p>

      {/* ===== Route Examples ===== */}
      <h3 style={h3Style}>The Same Route in All Three Frameworks</h3>

      <p style={pStyle}>
        Let us build the same dynamic blog post route in all three frameworks. This shows how
        each handles URL parameters, data fetching, and template rendering for a single
        page.
      </p>

      <CodeBlock
        code={`<!-- SvelteKit: src/routes/blog/[slug]/+page.svelte -->
<script>
  let { data } = $props();
</script>

<article>
  <h1>{data.post.title}</h1>
  <p>By {data.post.author} on {data.post.date}</p>
  <div>{@html data.post.content}</div>
</article>

<!-- Data loaded in +page.server.ts -->
<!-- export async function load({ params }) {
  const post = await getPost(params.slug);
  return { post };
} -->`}
        language="svelte"
        filename="SvelteKit: +page.svelte"
      />

      <CodeBlock
        code={`// Next.js: app/blog/[slug]/page.tsx
// This is a Server Component by default

type Props = {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {post.author} on {post.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}`}
        language="tsx"
        filename="Next.js: page.tsx"
      />

      <CodeBlock
        code={`<!-- Nuxt: pages/blog/[slug].vue -->
<script setup lang="ts">
const route = useRoute()

const { data: post } = await useFetch(
  \`/api/posts/\${route.params.slug}\`
)
</script>

<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>
    <p>By {{ post.author }} on {{ post.date }}</p>
    <div v-html="post.content" />
  </article>
</template>`}
        language="html"
        filename="Nuxt: [slug].vue"
        highlight={[3, 5, 6]}
      />

      <p style={pStyle}>
        Notice the philosophical differences: SvelteKit separates data loading into a
        dedicated <code>+page.server.ts</code> file and passes data via props. Next.js uses
        async Server Components where data fetching happens directly in the component.
        Nuxt uses <code>useFetch</code> in <code>&lt;script setup&gt;</code>, which is a
        composable that handles both server-side and client-side fetching seamlessly. All
        three approaches work, but each has different implications for caching, streaming,
        and code organization.
      </p>

      {/* ===== Data Fetching ===== */}
      <h2 style={h2Style}>Data Fetching</h2>

      <p style={pStyle}>
        Data fetching is where the three frameworks diverge most dramatically. SvelteKit uses{' '}
        <code>load</code> functions that run on the server (or during prerendering). Next.js
        leverages React Server Components where you <code>await</code> data directly inside
        the component. Nuxt provides composables like <code>useFetch</code> and{' '}
        <code>useAsyncData</code> that handle SSR hydration, caching, and client-side
        refetching in a single, unified API.
      </p>

      <Callout type="info">
        Nuxt's <code>useFetch</code> is the most ergonomic data fetching of the three. It
        handles SSR hydration, caching, and refetching in one composable. It automatically
        deduplicates requests, provides loading and error states, and avoids the double-fetch
        problem where data fetched on the server is re-fetched on the client during hydration.
      </Callout>

      <h3 style={h3Style}>useFetch -- Nuxt's Primary Data Fetching Composable</h3>

      <CodeBlock
        code={`<script setup lang="ts">
// Basic fetch with automatic SSR hydration
const { data, pending, error, refresh } = await useFetch('/api/posts')

// With options: transform, caching, watching
const { data: users } = await useFetch('/api/users', {
  // Transform the response
  transform: (response) => response.data.map(u => ({
    ...u,
    fullName: \`\${u.firstName} \${u.lastName}\`,
  })),
  // Only refetch when these change
  watch: [page, filters],
  // Cache key for deduplication
  key: 'users-list',
  // Lazy: don't block navigation
  lazy: true,
})

// useAsyncData for non-fetch async operations
const { data: config } = await useAsyncData('config', () => {
  return queryContent('/config').findOne()
})
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <ul v-else>
    <li v-for="post in data" :key="post.id">
      {{ post.title }}
    </li>
  </ul>
  <button @click="refresh()">Refresh</button>
</template>`}
        language="html"
        filename="DataFetching.vue"
        highlight={[3, 6, 21, 27, 28]}
      />

      <h3 style={h3Style}>Data Fetching Comparison</h3>

      <p style={pStyle}>
        Let us compare how each framework handles a typical data fetching scenario: loading a
        list of posts with loading and error states.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- SvelteKit: +page.svelte -->
<script>
  let { data } = $props();
  // Data comes from +page.server.ts load()
</script>

{#if data.posts.length === 0}
  <p>No posts found.</p>
{:else}
  <ul>
    {#each data.posts as post}
      <li><a href="/blog/{post.slug}">{post.title}</a></li>
    {/each}
  </ul>
{/if}

<!-- +page.server.ts -->
<!-- export async function load({ fetch }) {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  return { posts };
} -->`,
          filename: 'SvelteKit data loading',
          language: 'svelte',
        }}
        react={{
          code: `<!-- Nuxt: pages/posts.vue -->
<script setup lang="ts">
const {
  data: posts,
  pending,
  error,
  refresh
} = await useFetch('/api/posts')
</script>

<template>
  <div v-if="pending">Loading posts...</div>
  <div v-else-if="error">
    Error: {{ error.message }}
    <button @click="refresh()">Retry</button>
  </div>
  <div v-else-if="posts?.length === 0">
    <p>No posts found.</p>
  </div>
  <ul v-else>
    <li v-for="post in posts" :key="post.id">
      <NuxtLink :to="\`/blog/\${post.slug}\`">
        {{ post.title }}
      </NuxtLink>
    </li>
  </ul>
</template>`,
          filename: 'Nuxt data loading',
          language: 'html',
        }}
        note="SvelteKit separates data loading into a dedicated server file. Nuxt co-locates it using useFetch, which provides pending, error, and refresh out of the box. Both avoid the double-fetch hydration problem."
      />

      {/* ===== Server Routes ===== */}
      <h2 style={h2Style}>Server Routes</h2>

      <p style={pStyle}>
        All three meta-frameworks support server-side API endpoints. SvelteKit uses{' '}
        <code>+server.ts</code> files inside the <code>routes/</code> directory. Next.js uses{' '}
        <code>route.ts</code> files in the <code>app/</code> directory. Nuxt uses a dedicated{' '}
        <code>server/api/</code> directory, which keeps API code completely separate from
        page components.
      </p>

      <h3 style={h3Style}>API Route Comparison</h3>

      <CodeBlock
        code={`// SvelteKit: src/routes/api/posts/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');
  const posts = await db.posts.findMany({
    skip: (page - 1) * 10,
    take: 10,
  });
  return json(posts);
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const post = await db.posts.create({ data: body });
  return json(post, { status: 201 });
};`}
        language="typescript"
        filename="SvelteKit: +server.ts"
      />

      <CodeBlock
        code={`// Next.js: app/api/posts/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const posts = await db.posts.findMany({
    skip: (page - 1) * 10,
    take: 10,
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const post = await db.posts.create({ data: body });
  return NextResponse.json(post, { status: 201 });
}`}
        language="typescript"
        filename="Next.js: route.ts"
      />

      <CodeBlock
        code={`// Nuxt: server/api/posts.ts
export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'GET') {
    const query = getQuery(event)
    const page = Number(query.page ?? 1)
    const posts = await db.posts.findMany({
      skip: (page - 1) * 10,
      take: 10,
    })
    return posts  // Automatically serialized to JSON
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const post = await db.posts.create({ data: body })
    setResponseStatus(event, 201)
    return post
  }
})`}
        language="typescript"
        filename="Nuxt: server/api/posts.ts"
        highlight={[2, 12]}
      />

      <p style={pStyle}>
        Nuxt's server routes use the <code>defineEventHandler</code> function from the Nitro
        engine. The return value is automatically serialized to JSON -- no need to wrap it
        in a response helper. Nuxt's server engine (Nitro) is actually framework-agnostic
        and can be used independently. It provides utilities like <code>getQuery</code>,{' '}
        <code>readBody</code>, and <code>getMethod</code> that are simpler than working
        with raw Request objects.
      </p>

      <h3 style={h3Style}>Server Middleware and Route Rules</h3>

      <p style={pStyle}>
        Nuxt also supports server middleware (code that runs before every request) and route
        rules that let you configure caching, CORS, and rendering mode per-route. This is
        similar to SvelteKit's hooks and Next.js's middleware, but with a more declarative
        configuration.
      </p>

      <CodeBlock
        code={`// server/middleware/log.ts -- runs before every request
export default defineEventHandler((event) => {
  console.log(\`[\${getMethod(event)}] \${getRequestURL(event)}\`)
})

// nuxt.config.ts -- per-route rendering rules
export default defineNuxtConfig({
  routeRules: {
    '/':          { prerender: true },       // Static at build time
    '/blog/**':   { isr: 3600 },             // Revalidate every hour
    '/admin/**':  { ssr: false },             // Client-only SPA
    '/api/**':    { cors: true },             // CORS headers
    '/old-page':  { redirect: '/new-page' }, // Redirects
  }
})`}
        language="typescript"
        filename="Nuxt server middleware and route rules"
        highlight={[8, 9, 10, 11, 12, 13]}
      />

      <Callout type="insight" title="Hybrid Rendering">
        Nuxt's route rules are one of its most powerful features. You can mix rendering
        strategies on a per-route basis: pre-render your marketing pages, use ISR for your
        blog, SSR for your dashboard, and SPA mode for your admin panel -- all in the same
        application. SvelteKit supports similar flexibility with its <code>prerender</code>{' '}
        and <code>ssr</code> page options, while Next.js achieves this through its App
        Router conventions and <code>revalidate</code> settings.
      </Callout>

      {/* ===== Navigation ===== */}
      <h2 style={h2Style}>Navigation and Links</h2>

      <p style={pStyle}>
        Client-side navigation in all three frameworks uses a special link component that
        intercepts clicks and navigates without a full page reload. The naming differs but
        the concept is identical.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- SvelteKit navigation -->
<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
</script>

<!-- Declarative link -->
<a href="/about">About</a>
<a href="/blog/{post.slug}">{post.title}</a>

<!-- Programmatic navigation -->
<button on:click={() => goto('/dashboard')}>
  Go to Dashboard
</button>

<!-- Active link styling -->
<a href="/about"
  class:active={$page.url.pathname === '/about'}>
  About
</a>`,
          filename: 'SvelteKit navigation',
          language: 'svelte',
        }}
        react={{
          code: `<!-- Nuxt navigation -->
<script setup lang="ts">
const router = useRouter()
const route = useRoute()
</script>

<template>
  <!-- Declarative link (auto-imported) -->
  <NuxtLink to="/about">About</NuxtLink>
  <NuxtLink :to="\`/blog/\${post.slug}\`">
    {{ post.title }}
  </NuxtLink>

  <!-- Programmatic navigation -->
  <button @click="router.push('/dashboard')">
    Go to Dashboard
  </button>

  <!-- Active link (automatic class) -->
  <!-- NuxtLink adds .router-link-active automatically -->
  <NuxtLink to="/about" active-class="active">
    About
  </NuxtLink>
</template>`,
          filename: 'Nuxt navigation',
          language: 'html',
        }}
        note="SvelteKit uses plain <a> tags and enhances them automatically. Nuxt and Next.js use dedicated link components (NuxtLink, Link). Nuxt auto-adds active classes, which is a nice DX touch."
      />

      {/* ===== Data Fetching Comparison Table ===== */}
      <h2 style={h2Style}>Data Fetching Approaches at a Glance</h2>

      <ComparisonTable
        caption="Data fetching and routing across all three meta-frameworks"
        headers={['Concept', 'SvelteKit', 'Next.js (App Router)', 'Nuxt 3']}
        rows={[
          ['Route definition', '+page.svelte in routes/', 'page.tsx in app/', '.vue files in pages/'],
          ['Dynamic params', '[slug] directory name', '[slug] directory name', '[slug].vue filename'],
          ['Layouts', '+layout.svelte (co-located)', 'layout.tsx (co-located)', 'layouts/ directory'],
          ['Data loading', 'load() in +page.server.ts', 'Async Server Components', 'useFetch / useAsyncData'],
          ['Loading states', 'Managed via load()', 'loading.tsx / Suspense', 'pending ref from useFetch'],
          ['Error handling', '+error.svelte', 'error.tsx', 'NuxtErrorBoundary / error.vue'],
          ['API routes', '+server.ts in routes/', 'route.ts in app/api/', 'server/api/ directory'],
          ['Middleware', 'hooks.server.ts', 'middleware.ts', 'middleware/ directory'],
          ['Client navigation', '<a> tags (enhanced)', '<Link> component', '<NuxtLink> component'],
          ['Programmatic nav', 'goto() from $app/navigation', 'useRouter().push()', 'useRouter().push()'],
          ['SSR hydration', 'Automatic in load()', 'Automatic (RSC)', 'Automatic in useFetch'],
          ['Caching', 'Custom (no built-in cache)', 'fetch() cache + revalidate', 'useFetch key + getCachedData'],
          ['Hybrid rendering', 'prerender + ssr options', 'Static + dynamic per route', 'routeRules per route'],
        ]}
      />

      <h2 style={h2Style}>Key Takeaways</h2>

      <p style={pStyle}>
        All three meta-frameworks solve the same fundamental problems -- routing, data
        fetching, server rendering, and API endpoints -- but with notably different
        ergonomics. SvelteKit's approach is the most explicit, with dedicated files for each
        concern (<code>+page.svelte</code>, <code>+page.server.ts</code>,{' '}
        <code>+layout.svelte</code>). Next.js has moved toward colocating everything via
        Server Components. Nuxt takes the convention-over-configuration approach with
        auto-imports and dedicated directories.
      </p>

      <p style={pStyle}>
        For data fetching specifically, Nuxt's <code>useFetch</code> provides the most
        batteries-included experience. A single composable call gives you the data, loading
        state, error state, and a refresh function. SvelteKit's <code>load</code> functions
        are more explicit but require more setup for client-side refetching. Next.js Server
        Components are the most radical departure, eliminating the traditional request
        lifecycle entirely in favor of async component rendering.
      </p>

      <p style={pStyle}>
        Understanding all three approaches makes you a better architect. When you start a new
        project, you can choose the pattern that best fits your needs rather than defaulting
        to the one you happen to know.
      </p>
    </ChapterLayout>
  );
}
