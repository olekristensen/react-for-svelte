import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function NextjsRouting() {
  return (
    <ChapterLayout id="nextjs-routing">
      <p style={pStyle}>
        File-based routing is one of the strongest parallels between SvelteKit and Next.js. Both
        frameworks derive the URL structure from the directory hierarchy. If you have built routes
        in SvelteKit, the concepts transfer directly — only the file naming conventions change.
        This chapter covers static routes, dynamic parameters, layouts, error handling, and the
        advanced routing patterns that are unique to Next.js.
      </p>

      <h2 style={h2Style}>
        Basic File-Based Routing
      </h2>

      <p style={pStyle}>
        In SvelteKit, every route is a directory inside <code>src/routes/</code> that contains a
        <code> +page.svelte</code> file. In Next.js App Router, every route is a directory inside
        <code> app/</code> that contains a <code>page.tsx</code> file. The directory name becomes
        the URL segment. Both frameworks require the page file to exist for the route to be
        navigable — a directory without a page file is just an organizational grouping.
      </p>

      <CodeComparison
        svelte={{
          code: `src/routes/
├── +page.svelte              # → /
├── +layout.svelte            # Root layout
├── about/
│   └── +page.svelte          # → /about
├── blog/
│   ├── +page.svelte          # → /blog
│   └── [slug]/
│       └── +page.svelte      # → /blog/:slug
├── dashboard/
│   ├── +page.svelte          # → /dashboard
│   ├── settings/
│   │   └── +page.svelte      # → /dashboard/settings
│   └── profile/
│       └── +page.svelte      # → /dashboard/profile
└── (auth)/
    ├── login/
    │   └── +page.svelte      # → /login
    └── register/
        └── +page.svelte      # → /register`,
          filename: 'SvelteKit route structure',
          language: 'bash',
        }}
        react={{
          code: `app/
├── page.tsx                   # → /
├── layout.tsx                 # Root layout
├── about/
│   └── page.tsx               # → /about
├── blog/
│   ├── page.tsx               # → /blog
│   └── [slug]/
│       └── page.tsx           # → /blog/:slug
├── dashboard/
│   ├── page.tsx               # → /dashboard
│   ├── settings/
│   │   └── page.tsx           # → /dashboard/settings
│   └── profile/
│       └── page.tsx           # → /dashboard/profile
└── (auth)/
    ├── login/
    │   └── page.tsx           # → /login
    └── register/
        └── page.tsx           # → /register`,
          filename: 'Next.js App Router route structure',
          language: 'bash',
        }}
        note="The structures are nearly identical. SvelteKit uses +page.svelte, Next.js uses page.tsx. Both use [brackets] for dynamic segments and (parentheses) for route/layout groups. The URL paths are determined by folder names, not file names."
      />

      <h2 style={h2Style}>
        Dynamic Routes
      </h2>

      <p style={pStyle}>
        Both frameworks use square brackets to define dynamic route segments. A folder named
        <code> [slug]</code> will match any single URL segment and pass it as a parameter. The way
        you access the parameter differs between the frameworks.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<article>
  <h1>{data.post.title}</h1>
  <p>{data.post.content}</p>
</article>

<!-- src/routes/blog/[slug]/+page.server.ts -->
<script lang="ts" context="module">
  import type { PageServerLoad } from './$types';

  export const load: PageServerLoad = async ({
    params
  }) => {
    // params.slug is typed automatically
    const post = await getPost(params.slug);
    return { post };
  };
</script>`,
          filename: 'src/routes/blog/[slug]/',
        }}
        react={{
          code: `// app/blog/[slug]/page.tsx
// Server Component — async by default

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}`,
          filename: 'app/blog/[slug]/page.tsx',
          highlight: [4, 5, 8, 9, 10, 11, 23, 24, 25, 26, 27],
        }}
        note="In SvelteKit, params come through the load function. In Next.js, params are passed directly to the page component as a prop. The generateStaticParams function is Next.js's equivalent of SvelteKit's entries() export for prerendering dynamic routes."
      />

      <h3 style={h3Style}>
        Catch-All and Optional Catch-All Routes
      </h3>

      <p style={pStyle}>
        Both frameworks support catching multiple URL segments with a single route parameter.
        SvelteKit uses <code>[...rest]</code>, and Next.js uses the same convention. Next.js also
        has optional catch-all routes with double brackets <code>[[...rest]]</code> that match the
        route with or without any additional segments.
      </p>

      <CodeBlock
        code={`// Catch-all route examples:

// SvelteKit: src/routes/docs/[...path]/+page.svelte
// Matches: /docs/a, /docs/a/b, /docs/a/b/c
// params.path = "a/b/c"

// Next.js: app/docs/[...path]/page.tsx
// Matches: /docs/a, /docs/a/b, /docs/a/b/c
// params.path = ["a", "b", "c"]  (array, not string!)

// Next.js optional catch-all: app/docs/[[...path]]/page.tsx
// Matches: /docs, /docs/a, /docs/a/b
// params.path = undefined | ["a"] | ["a", "b"]`}
        language="typescript"
        filename="Catch-all routes"
      />

      <h2 style={h2Style}>
        Layouts
      </h2>

      <p style={pStyle}>
        Layouts are components that wrap pages and persist across navigations. Both frameworks
        support nested layouts — a parent layout wraps child layouts, which wrap pages. The key
        behavior is the same: when you navigate between sibling pages, the shared parent layout
        does not re-mount. Only the page content inside it changes.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- src/routes/+layout.svelte (root) -->
<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<Nav />
<main>
  {@render children()}
</main>
<footer>My App</footer>

<!-- src/routes/dashboard/+layout.svelte -->
<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="dashboard-layout">
  <Sidebar />
  <div class="content">
    {@render children()}
  </div>
</div>`,
          filename: '+layout.svelte (root + nested)',
        }}
        react={{
          code: `// app/layout.tsx (root — REQUIRED)
import { Nav } from '@/components/Nav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <footer>My App</footer>
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
}`,
          filename: 'layout.tsx (root + nested)',
          highlight: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        }}
        note="Next.js's root layout MUST include <html> and <body> tags — it replaces what app.html does in SvelteKit. SvelteKit's root layout is optional and does not include the HTML shell. Nested layouts work identically in both."
      />

      <h2 style={h2Style}>
        Error Handling
      </h2>

      <p style={pStyle}>
        Both frameworks let you define error pages at any level of the route hierarchy. Errors
        bubble up to the nearest error boundary. SvelteKit uses <code>+error.svelte</code>,
        Next.js uses <code>error.tsx</code>. The major difference is that Next.js error
        boundaries are React Error Boundaries under the hood and must be Client Components.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- src/routes/+error.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="error-page">
  <h1>{$page.status}</h1>
  <p>{$page.error?.message}</p>
  <a href="/">Go home</a>
</div>

<!-- src/routes/dashboard/+error.svelte -->
<!-- More specific error page for /dashboard/* -->
<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="dashboard-error">
  <h2>Dashboard Error</h2>
  <p>{$page.error?.message}</p>
  <a href="/dashboard">Back to Dashboard</a>
</div>`,
          filename: '+error.svelte',
        }}
        react={{
          code: `// app/error.tsx
"use client"; // Error components MUST be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
      <a href="/">Go home</a>
    </div>
  );
}

// app/dashboard/error.tsx
"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="dashboard-error">
      <h2>Dashboard Error</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}`,
          filename: 'error.tsx',
          highlight: [2, 6, 15],
        }}
        note="Next.js error pages receive a reset function that re-renders the error boundary's children, allowing the user to retry without full navigation. SvelteKit does not have a built-in reset mechanism — you typically navigate away. Note the 'use client' requirement."
      />

      <Callout type="gotcha" title="Route Groups: Similar Syntax, Different Names">
        Next.js route groups use <code>(folderName)</code> syntax — parentheses around the folder
        name. SvelteKit layout groups use the same convention. In both frameworks, the parenthesized
        folder name is excluded from the URL path. The purpose is identical: organizing routes that
        share a layout without affecting the URL structure. For example, <code>(auth)/login</code>
        creates the URL <code>/login</code>, not <code>/auth/login</code>.
      </Callout>

      <h2 style={h2Style}>
        Loading States
      </h2>

      <p style={pStyle}>
        Next.js has a dedicated <code>loading.tsx</code> file that automatically wraps the page
        in a React Suspense boundary. When the page is fetching data (via async Server Components),
        the loading UI is shown. SvelteKit does not have an equivalent file convention — loading
        states are typically handled by checking the navigation store or using <code>{'{#await}'}</code>
        blocks.
      </p>

      <CodeBlock
        code={`// app/dashboard/loading.tsx
// Automatically shown while dashboard/page.tsx is loading

export default function DashboardLoading() {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-card" />
        ))}
      </div>
    </div>
  );
}

// This is equivalent to wrapping the page in:
// <Suspense fallback={<DashboardLoading />}>
//   <DashboardPage />
// </Suspense>`}
        language="tsx"
        filename="app/dashboard/loading.tsx"
      />

      <h2 style={h2Style}>
        Navigation and Linking
      </h2>

      <p style={pStyle}>
        SvelteKit uses native <code>&lt;a&gt;</code> tags for navigation and automatically
        intercepts them for client-side navigation. Next.js provides a <code>&lt;Link&gt;</code>
        component that you must use instead of raw anchor tags to get client-side navigation
        behavior.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- SvelteKit: native <a> tags just work -->
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/blog">Blog</a>
</nav>

<!-- Prefetching -->
<a href="/dashboard" data-sveltekit-preload-data>
  Dashboard
</a>

<!-- Programmatic navigation -->
<script>
  import { goto } from '$app/navigation';

  function handleClick() {
    goto('/dashboard');
  }
</script>`,
          filename: 'Navigation in SvelteKit',
        }}
        react={{
          code: `// Next.js: Link component for client navigation
import Link from 'next/link';

export function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  );
}

// Prefetching (automatic by default for Link)
// Disable with:
<Link href="/dashboard" prefetch={false}>
  Dashboard
</Link>

// Programmatic navigation
"use client";
import { useRouter } from 'next/navigation';

export function NavigateButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  );
}`,
          filename: 'Navigation in Next.js',
          highlight: [2, 7, 8, 9, 22, 27],
        }}
        note="SvelteKit intercepts all <a> tags automatically. Next.js requires the Link component for client-side navigation. Using a plain <a> in Next.js triggers a full page reload. Both support prefetching, though Next.js does it by default for all visible Link components."
      />

      <h2 style={h2Style}>
        Parallel Routes and Intercepting Routes
      </h2>

      <p style={pStyle}>
        These are advanced routing features unique to Next.js. They have no direct equivalents
        in SvelteKit, though you can achieve similar results with component composition and
        conditional rendering.
      </p>

      <h3 style={h3Style}>Parallel Routes</h3>

      <p style={pStyle}>
        Parallel routes let you render multiple pages simultaneously in the same layout. They
        are defined using the <code>@folder</code> naming convention. Each slot is independently
        navigable and can have its own loading and error states. A common use case is a dashboard
        with independently loading panels.
      </p>

      <CodeBlock
        code={`// Parallel Routes: render multiple pages in one layout
app/
├── layout.tsx           # Receives @analytics and @team as props
├── @analytics/
│   ├── page.tsx         # Analytics panel
│   └── loading.tsx      # Independent loading state
├── @team/
│   ├── page.tsx         # Team panel
│   └── loading.tsx      # Independent loading state
└── page.tsx             # Main content

// app/layout.tsx
export default function Layout({
  children,     // maps to page.tsx
  analytics,    // maps to @analytics/page.tsx
  team,         // maps to @team/page.tsx
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <div className="main">{children}</div>
      <div className="sidebar">
        {analytics}
        {team}
      </div>
    </div>
  );
}`}
        language="tsx"
        filename="Parallel routes example"
      />

      <h3 style={h3Style}>Intercepting Routes</h3>

      <p style={pStyle}>
        Intercepting routes let you load a route from within a different part of the UI. The
        classic example is a photo feed: clicking a photo shows it in a modal (intercepted route),
        but navigating directly to the photo URL shows the full page. The convention uses
        <code> (.)</code> for same level, <code>(..)</code> for one level up, and <code>(...)</code>
        for the root.
      </p>

      <CodeBlock
        code={`// Intercepting Routes: modal pattern
app/
├── feed/
│   ├── page.tsx                    # Photo grid
│   └── (..)photo/[id]/            # Intercepts /photo/[id]
│       └── page.tsx               # Shows photo in modal
├── photo/
│   └── [id]/
│       └── page.tsx               # Full photo page (direct URL)
└── layout.tsx

// When user clicks a photo in /feed:
//   → Intercepts to show (..)photo/[id] as a modal
// When user navigates directly to /photo/123:
//   → Shows the full photo/[id]/page.tsx

// Combine with parallel routes for the modal slot:
app/
├── @modal/
│   └── (..)photo/[id]/
│       └── page.tsx              # Modal view
├── feed/
│   └── page.tsx
└── layout.tsx`}
        language="bash"
        filename="Intercepting routes example"
      />

      <Callout type="info" title="Advanced Patterns">
        Parallel routes and intercepting routes are powerful but complex. If you are just starting
        with Next.js, do not worry about these yet. They solve specific UX patterns (dashboards
        with independent panels, modal overlays) that you can initially implement with simpler
        approaches like conditional rendering and state management. Come back to these patterns
        when you have a concrete need.
      </Callout>

      <h2 style={h2Style}>
        Route Handlers (API Routes)
      </h2>

      <p style={pStyle}>
        Both frameworks support defining API endpoints alongside pages. SvelteKit
        uses <code>+server.ts</code> files that export HTTP method handlers. Next.js uses
        <code> route.ts</code> files with the same pattern. They cannot coexist with a
        <code> page.tsx</code> in the same directory.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/routes/api/posts/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({
  url,
}) => {
  const page = url.searchParams.get('page') ?? '1';
  const posts = await db.post.findMany({
    skip: (Number(page) - 1) * 10,
    take: 10,
  });
  return json(posts);
};

export const POST: RequestHandler = async ({
  request,
}) => {
  const body = await request.json();
  const post = await db.post.create({
    data: body,
  });
  return json(post, { status: 201 });
};`,
          filename: 'src/routes/api/posts/+server.ts',
          language: 'typescript',
        }}
        react={{
          code: `// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page')
    ?? '1';
  const posts = await db.post.findMany({
    skip: (Number(page) - 1) * 10,
    take: 10,
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const post = await db.post.create({
    data: body,
  });
  return NextResponse.json(post, { status: 201 });
}`,
          filename: 'app/api/posts/route.ts',
          language: 'typescript',
          highlight: [2, 4, 14],
        }}
        note="Nearly identical APIs. SvelteKit uses the json() helper from @sveltejs/kit, Next.js uses NextResponse.json(). Both export named functions matching HTTP methods. The request/response types differ but the pattern is the same."
      />

      <h2 style={h2Style}>
        Routing Features Comparison
      </h2>

      <ComparisonTable
        caption="Routing Feature Comparison: SvelteKit vs Next.js"
        headers={['Feature', 'SvelteKit', 'Next.js App Router']}
        rows={[
          ['Page file', '+page.svelte', 'page.tsx'],
          ['Layout file', '+layout.svelte', 'layout.tsx'],
          ['Error page', '+error.svelte', 'error.tsx ("use client")'],
          ['Loading UI', 'No file convention', 'loading.tsx (Suspense)'],
          ['Not found page', 'Handled by +error.svelte', 'not-found.tsx'],
          ['API routes', '+server.ts', 'route.ts'],
          ['Dynamic segments', '[param]', '[param]'],
          ['Catch-all', '[...rest] (string)', '[...rest] (array)'],
          ['Optional catch-all', 'Not built-in', '[[...rest]]'],
          ['Route groups', '(groupName)', '(groupName)'],
          ['Client navigation', 'Native <a> tags', '<Link> component'],
          ['Programmatic nav', 'goto() from $app/navigation', 'useRouter().push()'],
          ['Prefetching', 'data-sveltekit-preload-data', 'Link prefetch (auto)'],
          ['Parallel routes', 'Not supported', '@folderName convention'],
          ['Intercepting routes', 'Not supported', '(..) convention'],
          ['Template (re-mount)', 'Not supported', 'template.tsx'],
          ['Default fallback', 'Not supported', 'default.tsx'],
          ['Middleware', 'hooks.server.ts', 'middleware.ts'],
          ['Navigation events', 'beforeNavigate / afterNavigate', 'usePathname + useEffect'],
        ]}
      />

      <p style={pStyle}>
        The routing systems are remarkably similar at their core. Both derive routes from the
        file system, support dynamic parameters and catch-all segments, and provide layouts at
        every level of nesting. The main differences are Next.js's additional file conventions
        (<code>loading.tsx</code>, <code>template.tsx</code>, <code>not-found.tsx</code>),
        its advanced parallel and intercepting route features, and the requirement to use the
        <code> Link</code> component instead of native anchor tags. In the next chapter, we will
        explore how both frameworks handle data fetching — the other half of the server-side story.
      </p>

      <CodeExercise
        id="nextjs-routing-fix-link"
        title="Fix the Navigation"
        type="fix-the-bug"
        description="This navigation uses regular <a> tags which cause full page reloads. In Next.js (like SvelteKit), you need the framework's Link component for client-side navigation."
        initialCode={`import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/blog">Blog</a>
    </nav>
  );
}`}
        solution={`import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  );
}`}
        validationPatterns={["<Link href=\"/\">", "<Link href=\"/about\">", "<Link href=\"/blog\">"]}
        hints={[
          "In SvelteKit you use <a> tags naturally. In Next.js, <a> causes full page reloads.",
          "Replace <a href=...> with <Link href=...> from next/link",
          "Link is already imported at the top — just change the HTML tags"
        ]}
      />
    </ChapterLayout>
  );
}
