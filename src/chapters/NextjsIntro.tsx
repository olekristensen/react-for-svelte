import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function NextjsIntro() {
  return (
    <ChapterLayout id="nextjs-intro">
      <p style={pStyle}>
        If SvelteKit is the meta-framework that brings structure, routing, and server-side rendering
        to Svelte, then Next.js is the equivalent for React. Both are opinionated frameworks built
        on top of their respective UI libraries, and both solve the same fundamental problems:
        file-based routing, server-side rendering, data fetching, and deployment. The concepts map
        remarkably well from one to the other, even though the syntax and implementation details
        differ. If you already understand SvelteKit, you have a massive head start with Next.js.
      </p>

      <h2 style={h2Style}>
        Meta-Frameworks: The Same Problem, Two Solutions
      </h2>

      <p style={pStyle}>
        Both SvelteKit and Next.js exist because raw UI libraries (Svelte and React) do not provide
        opinions about routing, server rendering, or project structure. You could build a React
        app with just <code>create-react-app</code> or Vite, but you would need to manually configure
        routing, SSR, API endpoints, and deployment. Next.js handles all of that, just as SvelteKit
        does for Svelte. The mental model is identical: you write components, the framework handles
        the plumbing.
      </p>

      <h2 style={h2Style}>
        Project Structure Side by Side
      </h2>

      <p style={pStyle}>
        Both frameworks use file-based routing, but the directory conventions differ. SvelteKit
        uses a <code>src/routes</code> directory where files like <code>+page.svelte</code> and
        <code> +layout.svelte</code> define pages and layouts. Next.js (with the App Router) uses
        an <code>app</code> directory where files named <code>page.tsx</code> and
        <code> layout.tsx</code> serve the same purpose. The plus-sign prefix in SvelteKit is
        replaced by specific filenames in Next.js.
      </p>

      <CodeComparison
        svelte={{
          code: `my-sveltekit-app/
├── src/
│   ├── routes/
│   │   ├── +page.svelte          # Home page
│   │   ├── +layout.svelte        # Root layout
│   │   ├── +page.server.ts       # Server-side load
│   │   ├── +error.svelte         # Error page
│   │   ├── about/
│   │   │   └── +page.svelte      # /about
│   │   └── blog/
│   │       ├── +page.svelte      # /blog
│   │       ├── +page.server.ts   # Blog data loader
│   │       └── [slug]/
│   │           ├── +page.svelte  # /blog/:slug
│   │           └── +page.server.ts
│   ├── lib/
│   │   └── components/           # Shared components
│   └── app.html                  # HTML shell
├── static/                       # Static assets
├── svelte.config.js
└── vite.config.ts`,
          filename: 'SvelteKit project structure',
          language: 'bash',
        }}
        react={{
          code: `my-nextjs-app/
├── app/
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── error.tsx                 # Error page
│   ├── loading.tsx               # Loading UI
│   ├── not-found.tsx             # 404 page
│   ├── about/
│   │   └── page.tsx              # /about
│   └── blog/
│       ├── page.tsx              # /blog
│       └── [slug]/
│           └── page.tsx          # /blog/:slug
├── components/                   # Shared components
├── public/                       # Static assets
├── next.config.js
└── tsconfig.json`,
          filename: 'Next.js App Router structure',
          language: 'bash',
        }}
        note="SvelteKit prefixes special files with + to distinguish them from regular modules. Next.js uses reserved filenames (page.tsx, layout.tsx, error.tsx) inside each route folder. Both use folder nesting to define the URL hierarchy."
      />

      <h2 style={h2Style}>
        Server Components vs Client Components
      </h2>

      <p style={pStyle}>
        This is where Next.js introduces a concept that has no direct equivalent in SvelteKit:
        React Server Components (RSC). In SvelteKit, you have a clear separation between server
        code (<code>+page.server.ts</code>, <code>+layout.server.ts</code>) and client code
        (<code>+page.svelte</code>). The server files export <code>load</code> functions that
        fetch data, and the Svelte components render it.
      </p>

      <p style={pStyle}>
        In Next.js App Router, every component is a Server Component by default. This means the
        component code runs on the server, can directly access databases, read files, and call
        APIs without exposing secrets to the client. The rendered HTML is sent to the browser.
        When you need interactivity (state, effects, event handlers, browser APIs), you add the
        <code> "use client"</code> directive at the top of the file to make it a Client Component.
      </p>

      <h3 style={h3Style}>
        The "use client" Directive
      </h3>

      <CodeComparison
        svelte={{
          code: `<!-- +page.server.ts — runs on server -->
<script lang="ts" context="module">
  // This is the server-side load function
  // It fetches data and passes it to the page
</script>

<!-- +page.svelte — renders on client (and SSR) -->
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  // All Svelte components can use state,
  // effects, event handlers, etc.
  let count = $state(0);
</script>

<h1>{data.title}</h1>
<button on:click={() => count++}>
  Clicked {count} times
</button>`,
          filename: '+page.svelte / +page.server.ts',
        }}
        react={{
          code: `// app/page.tsx — Server Component (default)
// No "use client" = runs on server only
// Can use async/await, access DB, read files
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  const json = await data.json();

  return (
    <div>
      <h1>{json.title}</h1>
      {/* Client Component for interactivity */}
      <Counter />
    </div>
  );
}

// components/Counter.tsx
"use client"; // <-- This makes it a Client Component
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}`,
          filename: 'app/page.tsx + components/Counter.tsx',
          highlight: [1, 2, 3, 18],
        }}
        note="SvelteKit cleanly separates server logic (+page.server.ts) from UI (+page.svelte). Next.js blurs this line — Server Components are both the data fetcher and the renderer. Client Components opt in to interactivity with 'use client'."
      />

      <Callout type="insight" title="Server Components and Load Functions">
        Next.js App Router's Server Components are conceptually similar to SvelteKit's load
        functions — code that runs on the server and passes data to the client. The key
        difference is that in SvelteKit, the load function and the component are separate files
        with a clear contract (PageData). In Next.js, the Server Component itself is the data
        fetcher and the renderer combined into one.
      </Callout>

      <h2 style={h2Style}>
        A Page Component: Side by Side
      </h2>

      <p style={pStyle}>
        Let us compare a typical page that fetches data and renders it. This is the bread and
        butter of any web application, and seeing the full picture in both frameworks reveals
        how similar the end result is despite the different approaches.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/routes/blog/+page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';

export const load: PageServerLoad = async () => {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return { posts };
};

// src/routes/blog/+page.svelte
<script lang="ts">
  import type { PageData } from './$types';
  import PostCard from '$lib/components/PostCard.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<h1>Latest Posts</h1>
<div class="grid">
  {#each data.posts as post (post.id)}
    <PostCard {post} />
  {/each}
</div>`,
          filename: '+page.server.ts + +page.svelte',
        }}
        react={{
          code: `// app/blog/page.tsx (Server Component)
import { db } from '@/lib/database';
import { PostCard } from '@/components/PostCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
};

export default async function BlogPage() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <>
      <h1>Latest Posts</h1>
      <div className="grid">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}`,
          filename: 'app/blog/page.tsx',
          highlight: [6, 7, 8, 10, 11, 12, 13, 14],
        }}
        note="Notice how SvelteKit uses two files (load function + component) while Next.js collapses everything into one async Server Component. The metadata export replaces <svelte:head>. The database query runs directly in the component body."
      />

      <h2 style={h2Style}>
        File Conventions: The Special Files
      </h2>

      <p style={pStyle}>
        Both frameworks reserve certain filenames for specific purposes. SvelteKit uses the
        plus-sign prefix to denote framework-managed files. Next.js uses specific filenames
        within route directories. Here is the mapping of every special file.
      </p>

      <h3 style={h3Style}>
        Entry Points and Configuration
      </h3>

      <CodeBlock
        code={`// SvelteKit special files:
+page.svelte        // Page component
+page.ts            // Universal load function (runs server + client)
+page.server.ts     // Server-only load function
+layout.svelte      // Layout component
+layout.ts          // Layout load function
+layout.server.ts   // Server-only layout load
+error.svelte       // Error boundary
+server.ts          // API route (GET, POST, etc.)

// Next.js App Router special files:
page.tsx            // Page component (required for route)
layout.tsx          // Layout (wraps pages and nested layouts)
loading.tsx         // Loading UI (Suspense boundary)
error.tsx           // Error boundary (React Error Boundary)
not-found.tsx       // 404 UI
route.ts            // API route (GET, POST, etc.)
template.tsx        // Like layout, but re-mounts on navigation
default.tsx         // Fallback for parallel routes`}
        language="bash"
        filename="Special file conventions"
      />

      <p style={pStyle}>
        A key difference is that Next.js has <code>loading.tsx</code> — a file that automatically
        wraps the page in a React Suspense boundary. SvelteKit achieves loading states differently,
        typically through the <code>+page.ts</code> load function and the page store's navigation
        state. Next.js also has <code>template.tsx</code>, which behaves like a layout but creates
        a new component instance on each navigation, useful for enter/exit animations.
      </p>

      <h2 style={h2Style}>
        The App Router vs Pages Router
      </h2>

      <p style={pStyle}>
        Next.js has two routing systems: the legacy Pages Router (<code>pages/</code> directory)
        and the modern App Router (<code>app/</code> directory). The App Router was introduced in
        Next.js 13 and is the recommended approach for new projects. It supports React Server
        Components, nested layouts, and streaming. Throughout this guide, we focus exclusively on
        the App Router because it is the modern standard and maps more naturally to SvelteKit
        concepts.
      </p>

      <p style={pStyle}>
        If you encounter Next.js tutorials or code using <code>pages/_app.tsx</code>,
        <code> getServerSideProps</code>, or <code>getStaticProps</code>, those are Pages Router
        patterns. They still work but are considered legacy. The App Router equivalents are
        <code> layout.tsx</code>, async Server Components, and <code>generateStaticParams</code>.
      </p>

      <h2 style={h2Style}>
        Configuration and Tooling
      </h2>

      <p style={pStyle}>
        SvelteKit uses Vite as its build tool and bundler. Next.js uses its own custom build
        system built on top of Webpack (with Turbopack as an opt-in replacement). This means
        some Vite-specific plugins or configurations you might be familiar with from SvelteKit
        will not carry over. However, the developer experience is similar: both provide hot
        module replacement, TypeScript support out of the box, and fast refresh during development.
      </p>

      <CodeComparison
        svelte={{
          code: `// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '$components': 'src/lib/components',
    },
  },
};

export default config;`,
          filename: 'svelte.config.js',
          language: 'javascript',
        }}
        react={{
          code: `// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Most features work out of the box
  // Common configuration options:
  images: {
    remotePatterns: [
      { hostname: 'example.com' },
    ],
  },
  experimental: {
    // Enable Turbopack (fast Rust bundler)
    turbo: {},
  },
};

module.exports = nextConfig;`,
          filename: 'next.config.js',
          language: 'javascript',
        }}
        note="SvelteKit's adapter system determines deployment targets. Next.js assumes Vercel-like infrastructure by default but supports self-hosting. Next.js has fewer configuration knobs because it is more opinionated about defaults."
      />

      <h2 style={h2Style}>
        Path Aliases and Imports
      </h2>

      <p style={pStyle}>
        SvelteKit provides the <code>$lib</code> alias for <code>src/lib</code> by default, and
        you can define custom aliases in <code>svelte.config.js</code>. Next.js uses
        the <code>@/</code> alias (configured in <code>tsconfig.json</code>) which maps to the
        project root. Both serve the same purpose: avoiding deeply nested relative imports.
      </p>

      <CodeComparison
        svelte={{
          code: `// SvelteKit imports
import Button from '$lib/components/Button.svelte';
import { db } from '$lib/server/database';
import { formatDate } from '$lib/utils';

// Custom aliases (svelte.config.js)
import Icon from '$components/Icon.svelte';`,
          filename: 'SvelteKit imports',
          language: 'typescript',
        }}
        react={{
          code: `// Next.js imports
import { Button } from '@/components/Button';
import { db } from '@/lib/database';
import { formatDate } from '@/lib/utils';

// tsconfig.json "paths" configuration:
// "@/*": ["./src/*"] or ["./*"]`,
          filename: 'Next.js imports',
          language: 'typescript',
        }}
      />

      <h2 style={h2Style}>
        Environment Variables
      </h2>

      <p style={pStyle}>
        Both frameworks distinguish between server-only and client-exposed environment variables,
        but they use different naming conventions. SvelteKit provides type-safe env modules
        (<code>$env/static/private</code> and <code>$env/static/public</code>). Next.js uses a
        naming convention: variables prefixed with <code>NEXT_PUBLIC_</code> are exposed to the
        client, and everything else is server-only.
      </p>

      <CodeComparison
        svelte={{
          code: `// SvelteKit env access
import { DATABASE_URL } from '$env/static/private';
import { PUBLIC_API_URL } from '$env/static/public';

// .env file
DATABASE_URL=postgres://...     # server only
PUBLIC_API_URL=https://api...   # client exposed`,
          filename: 'SvelteKit environment variables',
          language: 'typescript',
        }}
        react={{
          code: `// Next.js env access
// Server Components (no import needed):
const dbUrl = process.env.DATABASE_URL;

// Client Components:
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// .env.local file
DATABASE_URL=postgres://...           # server only
NEXT_PUBLIC_API_URL=https://api...    # client exposed`,
          filename: 'Next.js environment variables',
          language: 'typescript',
        }}
        note="SvelteKit's $env modules provide compile-time type safety and tree shaking. Next.js relies on the NEXT_PUBLIC_ prefix convention. Both will throw errors if you try to access server-only variables on the client."
      />

      <h2 style={h2Style}>
        Concept Mapping: SvelteKit to Next.js
      </h2>

      <p style={pStyle}>
        This is the reference table you will keep coming back to. Every major SvelteKit concept
        has a Next.js equivalent, though the naming and implementation details differ. Bookmark
        this table and consult it whenever you encounter unfamiliar Next.js terminology.
      </p>

      <ComparisonTable
        caption="SvelteKit vs Next.js: Complete Concept Map"
        headers={['Concept', 'SvelteKit', 'Next.js App Router']}
        rows={[
          ['Page component', '+page.svelte', 'page.tsx'],
          ['Layout', '+layout.svelte', 'layout.tsx'],
          ['Error boundary', '+error.svelte', 'error.tsx'],
          ['Loading UI', 'Navigation store / await blocks', 'loading.tsx (Suspense)'],
          ['Server data fetching', '+page.server.ts load()', 'async Server Component'],
          ['Universal data fetching', '+page.ts load()', 'No equivalent (use Server Component)'],
          ['API routes', '+server.ts (GET, POST, etc.)', 'route.ts (GET, POST, etc.)'],
          ['Middleware', 'hooks.server.ts handle()', 'middleware.ts'],
          ['Form handling', 'Form actions (+page.server.ts)', 'Server Actions ("use server")'],
          ['Static generation', 'export const prerender = true', 'generateStaticParams()'],
          ['Server-side rendering', 'Default behavior', 'Default behavior (Server Components)'],
          ['Client-side navigation', '<a> with prefetch', '<Link> component with prefetch'],
          ['Head/metadata', '<svelte:head>', 'export const metadata / generateMetadata()'],
          ['Env variables (server)', '$env/static/private', 'process.env.VAR_NAME'],
          ['Env variables (client)', '$env/static/public', 'process.env.NEXT_PUBLIC_VAR'],
          ['Path alias', '$lib', '@/ (tsconfig paths)'],
          ['Static assets', 'static/', 'public/'],
          ['Config file', 'svelte.config.js', 'next.config.js'],
          ['Build tool', 'Vite', 'Webpack / Turbopack'],
          ['Deployment adapters', 'adapter-auto, adapter-node, etc.', 'Built-in (Vercel, self-host, Docker)'],
        ]}
      />

      <h2 style={h2Style}>
        What Next.js Has That SvelteKit Does Not
      </h2>

      <p style={pStyle}>
        While the two frameworks share most concepts, Next.js has a few features without direct
        SvelteKit equivalents. Understanding these will help you leverage the full power of Next.js.
      </p>

      <h3 style={h3Style}>React Server Components</h3>
      <p style={pStyle}>
        RSC is not just "SSR with extra steps." Server Components never ship their JavaScript to the
        client. They render to a special streaming format that the client-side React runtime can
        interleave with Client Components. SvelteKit's server-side load functions are conceptually
        similar, but the boundary between server and client code is enforced differently. In Next.js,
        the boundary is the <code>"use client"</code> directive. In SvelteKit, it is the file
        convention (<code>+page.server.ts</code> vs <code>+page.svelte</code>).
      </p>

      <h3 style={h3Style}>Incremental Static Regeneration (ISR)</h3>
      <p style={pStyle}>
        ISR lets you statically generate pages at build time but revalidate them after a specified
        interval. A stale page is served instantly while a fresh version is generated in the
        background. SvelteKit does not have a built-in equivalent, though you can approximate it
        with cache headers and CDN invalidation.
      </p>

      <h3 style={h3Style}>Parallel and Intercepting Routes</h3>
      <p style={pStyle}>
        Next.js supports rendering multiple pages simultaneously in the same layout (parallel
        routes) and intercepting navigation to show a different view (like opening a modal
        on photo click without full navigation). These are advanced patterns that have no
        direct SvelteKit counterpart.
      </p>

      <Callout type="info" title="Starting Point">
        If you have built a SvelteKit application, you already understand 80% of what Next.js does.
        The remaining 20% is React-specific concepts (Server Components, Client Components, Suspense
        boundaries) and Next.js-specific features (ISR, parallel routes, middleware at the edge).
        The chapters that follow will cover each of these in depth, always drawing parallels back
        to the SvelteKit patterns you already know.
      </Callout>

      <p style={pStyle}>
        In the next chapter, we will dive deep into routing and layouts — comparing SvelteKit's
        file-based routing system with Next.js's App Router, including dynamic routes, nested
        layouts, route groups, and the unique Next.js features like parallel routes and
        intercepting routes.
      </p>
    </ChapterLayout>
  );
}
