import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function NextjsRendering() {
  return (
    <ChapterLayout id="nextjs-rendering">
      <p style={pStyle}>
        Both SvelteKit and Next.js support multiple rendering strategies: server-side rendering
        (SSR), static site generation (SSG), and client-side rendering (CSR). The difference lies
        in how you opt into each strategy and the additional options Next.js provides, particularly
        Incremental Static Regeneration (ISR). If you understand SvelteKit's <code>prerender</code>
        and <code>ssr</code> options, the conceptual leap to Next.js rendering strategies is small.
      </p>

      <h2 style={h2Style}>
        The Rendering Landscape
      </h2>

      <p style={pStyle}>
        Before diving into the details, here is the high-level picture. Both frameworks default to
        server-side rendering: the page is rendered on the server for each request, the HTML is
        sent to the browser, and then the framework hydrates it for interactivity. From this
        default, you can opt specific routes into static generation (build-time rendering) or
        configure caching strategies.
      </p>

      <h3 style={h3Style}>
        The Mental Model
      </h3>

      <p style={pStyle}>
        SvelteKit uses explicit configuration exports to control rendering behavior. You set
        <code> export const prerender = true</code> or <code>export const ssr = false</code>
        in your page or layout files. Next.js App Router is more implicit: it analyzes your
        code to determine whether a route is static or dynamic. If your Server Component uses
        no dynamic functions (cookies, headers, searchParams), Next.js automatically makes it
        static at build time. You can override this with configuration exports or by using
        dynamic functions.
      </p>

      <h2 style={h2Style}>
        Static Generation (SSG)
      </h2>

      <p style={pStyle}>
        Static generation means rendering the page at build time and serving the pre-built HTML
        for every request. This is the fastest possible rendering strategy because there is no
        server-side computation per request. Both frameworks support static generation, but the
        opt-in mechanism differs.
      </p>

      <CodeComparison
        svelte={{
          code: `// Static page — SvelteKit
// src/routes/about/+page.ts
export const prerender = true;

// Static page with dynamic params
// src/routes/blog/[slug]/+page.ts
export const prerender = true;

// Tell SvelteKit which slugs to prerender
export function entries() {
  return [
    { slug: 'hello-world' },
    { slug: 'getting-started' },
    { slug: 'advanced-guide' },
  ];
}

// Prerender the entire app
// svelte.config.js
const config = {
  kit: {
    prerender: {
      entries: ['*'], // Crawl all routes
    },
  },
};

// Or in a layout to prerender all children:
// src/routes/+layout.ts
export const prerender = true;`,
          filename: 'SvelteKit static generation',
          language: 'typescript',
        }}
        react={{
          code: `// Static page — Next.js
// app/about/page.tsx
// Automatically static if no dynamic functions used!
export default function AboutPage() {
  return <h1>About Us</h1>;
}
// No configuration needed — Next.js detects this is static

// Static page with dynamic params
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  return [
    { slug: 'hello-world' },
    { slug: 'getting-started' },
    { slug: 'advanced-guide' },
  ];
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.content}</article>;
}

// Force static rendering explicitly:
export const dynamic = 'force-static';

// Force dynamic rendering explicitly:
export const dynamic = 'force-dynamic';`,
          filename: 'Next.js static generation',
          language: 'typescript',
          highlight: [3, 11, 12, 13, 14, 15, 16, 29, 32],
        }}
        note="SvelteKit requires an explicit prerender = true export. Next.js automatically detects static routes based on your code. The entries() function in SvelteKit maps to generateStaticParams() in Next.js. Both serve the same purpose: telling the framework which dynamic paths to pre-render."
      />

      <h2 style={h2Style}>
        Server-Side Rendering (SSR)
      </h2>

      <p style={pStyle}>
        SSR is the default behavior in both frameworks. Every request triggers a server-side
        render, producing fresh HTML. This ensures the content is always up-to-date but requires
        server compute for every page view. Both frameworks handle SSR automatically — you do
        not need to configure anything.
      </p>

      <CodeComparison
        svelte={{
          code: `// SSR is the default in SvelteKit
// No special configuration needed

// src/routes/dashboard/+page.server.ts
export const load: PageServerLoad = async ({
  locals,
  cookies,
}) => {
  // Uses cookies/locals = inherently dynamic
  const session = cookies.get('session');
  const user = await getUser(session);
  return { user };
};

// Disable SSR for client-only pages:
// src/routes/admin/+page.ts
export const ssr = false;
// Page only renders on the client (SPA mode)

// Disable SSR for a whole section:
// src/routes/app/+layout.ts
export const ssr = false;
// All routes under /app/ are client-only`,
          filename: 'SvelteKit SSR',
          language: 'typescript',
        }}
        react={{
          code: `// SSR is the default in Next.js App Router
// Server Components render on every request
// when they use dynamic functions

// app/dashboard/page.tsx
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  // Using cookies() makes this dynamic (SSR)
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  const user = await getUser(session?.value);
  return <div>Welcome, {user.name}</div>;
}

// Force dynamic rendering:
export const dynamic = 'force-dynamic';

// Client-only rendering (no SSR):
// Not a single export — use 'use client' + lazy loading
// app/admin/page.tsx
import dynamic from 'next/dynamic';
const AdminPanel = dynamic(
  () => import('@/components/AdminPanel'),
  { ssr: false }
);

export default function AdminPage() {
  return <AdminPanel />;
}`,
          filename: 'Next.js SSR',
          language: 'typescript',
          highlight: [6, 10, 11, 17, 23, 24, 25, 26],
        }}
        note="SvelteKit uses export const ssr = false for client-only pages. Next.js uses next/dynamic with { ssr: false } to achieve the same effect. Both default to SSR and provide escape hatches for client-only rendering."
      />

      <h2 style={h2Style}>
        Incremental Static Regeneration (ISR)
      </h2>

      <p style={pStyle}>
        ISR is a rendering strategy unique to Next.js. It lets you statically generate pages at
        build time but automatically regenerate them in the background after a specified time
        interval. The first visitor after the revalidation period gets the stale cached page
        (instant response), while a fresh version is generated in the background for subsequent
        visitors. This gives you the performance of static generation with the freshness of SSR.
      </p>

      <CodeBlock
        code={`// Next.js ISR — app/blog/[slug]/page.tsx
// Revalidate every 60 seconds

export const revalidate = 60; // seconds

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.updatedAt}</time>
      <div>{post.content}</div>
    </article>
  );
}

// How ISR works:
// 1. At build time: generates pages for all slugs
// 2. First 60 seconds: serves cached static HTML
// 3. After 60 seconds: next request triggers background regeneration
// 4. New version replaces the old cached page
// 5. Repeat from step 2

// On-demand revalidation (in a Server Action or Route Handler):
import { revalidatePath, revalidateTag } from 'next/cache';

// Revalidate a specific path
revalidatePath('/blog/hello-world');

// Or revalidate by tag
revalidateTag('blog-posts');`}
        language="tsx"
        filename="Incremental Static Regeneration"
      />

      <h3 style={h3Style}>
        ISR Equivalent in SvelteKit
      </h3>

      <p style={pStyle}>
        SvelteKit does not have built-in ISR, but you can approximate it using HTTP cache headers
        with <code>stale-while-revalidate</code>. The behavior is similar — serve a stale response
        immediately while fetching a fresh one in the background — but it relies on your CDN or
        reverse proxy supporting this cache directive rather than being a framework feature.
      </p>

      <CodeBlock
        code={`// SvelteKit ISR approximation using cache headers
// src/routes/blog/[slug]/+page.server.ts

export const load: PageServerLoad = async ({
  params,
  setHeaders,
}) => {
  const post = await getPost(params.slug);

  // Cache for 60 seconds, serve stale for up to 1 day
  // while revalidating in the background
  setHeaders({
    'Cache-Control':
      'max-age=60, s-maxage=60, stale-while-revalidate=86400',
  });

  return { post };
};

// This approach depends on your deployment platform:
// - Vercel: supports stale-while-revalidate
// - Cloudflare: supports stale-while-revalidate
// - Self-hosted: need a CDN that supports this header
// It is NOT the same as Next.js ISR:
// - No on-demand revalidation (no revalidatePath/Tag)
// - No build-time generation of pages
// - Relies entirely on HTTP caching infrastructure`}
        language="typescript"
        filename="SvelteKit ISR approximation"
      />

      <Callout type="info" title="Deployment and Infrastructure">
        SvelteKit uses adapter-based deployment. You choose an adapter (adapter-auto, adapter-node,
        adapter-cloudflare, adapter-vercel) that determines how your app is built and deployed.
        Next.js assumes Vercel-like infrastructure by default but supports self-hosting with a
        Node.js server. ISR works best on Vercel where the infrastructure is purpose-built. When
        self-hosting Next.js, ISR uses a filesystem cache that works but may not scale as well as
        Vercel's global edge cache.
      </Callout>

      <h2 style={h2Style}>
        Route Segment Configuration
      </h2>

      <p style={pStyle}>
        Next.js provides several configuration exports that control rendering behavior at the
        route level. These are similar in spirit to SvelteKit's page-level exports but offer
        more granular control over caching and rendering strategies.
      </p>

      <CodeComparison
        svelte={{
          code: `// SvelteKit route configuration exports

// src/routes/about/+page.ts
export const prerender = true;    // Static generation
export const ssr = true;          // SSR (default)
export const csr = true;          // CSR/hydration (default)

// src/routes/api/posts/+server.ts
export const prerender = false;   // Dynamic route

// Prerender with trailing slash:
export const trailingSlash = 'always';

// These can also be set in layouts
// to apply to all child routes:
// src/routes/blog/+layout.ts
export const prerender = true;
// All pages under /blog/ are prerendered`,
          filename: 'SvelteKit route config',
          language: 'typescript',
        }}
        react={{
          code: `// Next.js route segment configuration

// app/about/page.tsx
export const dynamic = 'auto';
// 'auto' | 'force-dynamic' | 'error' | 'force-static'

export const revalidate = false;
// false (cache forever) | 0 (no cache) | number (seconds)

export const fetchCache = 'auto';
// Controls caching of fetch() calls

export const runtime = 'nodejs';
// 'nodejs' | 'edge'

export const preferredRegion = 'auto';
// Region hints for edge deployment

export const maxDuration = 5;
// Max execution time in seconds (serverless)

// These also cascade from layouts:
// app/blog/layout.tsx
export const revalidate = 3600;
// All pages under /blog/ revalidate hourly`,
          filename: 'Next.js route segment config',
          language: 'typescript',
          highlight: [4, 5, 7, 8, 12, 13],
        }}
        note="Next.js has more route-level configuration options than SvelteKit. The dynamic export replaces what prerender and ssr do in SvelteKit, while revalidate enables ISR behavior. Both support cascading configuration from layouts to child routes."
      />

      <h2 style={h2Style}>
        Metadata and SEO
      </h2>

      <p style={pStyle}>
        Both frameworks need to generate HTML <code>&lt;head&gt;</code> content for SEO —
        titles, descriptions, Open Graph tags, etc. SvelteKit uses the <code>&lt;svelte:head&gt;</code>
        special element. Next.js uses exported metadata objects or a <code>generateMetadata</code>
        function for dynamic content.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- SvelteKit metadata -->
<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.post.title} | My Blog</title>
  <meta
    name="description"
    content={data.post.excerpt}
  />
  <meta
    property="og:title"
    content={data.post.title}
  />
  <meta
    property="og:image"
    content={data.post.coverImage}
  />
</svelte:head>

<article>
  <h1>{data.post.title}</h1>
  <p>{data.post.content}</p>
</article>`,
          filename: 'SvelteKit metadata',
        }}
        react={{
          code: `// Next.js metadata
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

// Static metadata
export const metadata: Metadata = {
  title: 'My Blog',
};

// Dynamic metadata (replaces static)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: \`\${post.title} | My Blog\`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}`,
          filename: 'Next.js metadata',
          highlight: [11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25],
        }}
        note="SvelteKit uses HTML-like <svelte:head> for metadata. Next.js uses a typed JavaScript object or async function. The Next.js approach provides better type safety and structure for complex metadata. Both support dynamic metadata based on route data."
      />

      <h2 style={h2Style}>
        Static Exports
      </h2>

      <p style={pStyle}>
        Both frameworks can generate a fully static site with no server. This produces a directory
        of HTML, CSS, and JavaScript files that can be served from any static hosting provider
        (GitHub Pages, Netlify, S3, etc.).
      </p>

      <CodeComparison
        svelte={{
          code: `// SvelteKit static export
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true,
    }),
  },
};

// Ensure all routes are prerenderable:
// src/routes/+layout.ts
export const prerender = true;
export const ssr = true;`,
          filename: 'SvelteKit static export',
          language: 'javascript',
        }}
        react={{
          code: `// Next.js static export
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Optional: trailing slashes
  trailingSlash: true,
  // Optional: custom output directory
  distDir: 'out',
  // Optional: disable image optimization
  // (not supported in static export)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

// Note: Static export does NOT support:
// - ISR (revalidate)
// - Server-side rendering
// - Dynamic routes without generateStaticParams
// - API routes (route.ts)
// - Middleware`,
          filename: 'Next.js static export',
          language: 'javascript',
          highlight: [5],
        }}
        note="SvelteKit uses adapter-static for static exports. Next.js uses the output: 'export' config option. Both require all routes to be prerenderable. Next.js has more limitations in static export mode because many of its features depend on a server."
      />

      <h2 style={h2Style}>
        Rendering Strategies Comparison
      </h2>

      <ComparisonTable
        caption="Rendering Strategies: SvelteKit vs Next.js"
        headers={['Strategy', 'SvelteKit', 'Next.js App Router']}
        columnFormat={['prose', 'prose', 'prose']}
        rows={[
          ['SSR (default)', 'Default behavior', 'Default for dynamic Server Components'],
          ['SSG (build-time)', 'export const prerender = true', 'Automatic for static pages / generateStaticParams'],
          ['ISR', 'No built-in (use cache headers)', 'export const revalidate = N'],
          ['Client-only', 'export const ssr = false', 'next/dynamic with { ssr: false }'],
          ['Static export', 'adapter-static', 'output: "export" in next.config.js'],
          ['Dynamic routes', 'entries() in +page.ts', 'generateStaticParams()'],
          ['On-demand revalidation', 'invalidate() (client-side)', 'revalidatePath() / revalidateTag()'],
          ['Cache control', 'setHeaders() with Cache-Control', 'Route segment config + fetch options'],
          ['Edge rendering', 'Adapter-dependent', 'export const runtime = "edge"'],
          ['Streaming SSR', 'Promises in load return', 'Suspense + async Server Components'],
          ['Metadata/SEO', '<svelte:head>', 'metadata export / generateMetadata()'],
          ['Deployment', 'Adapter-based (node, vercel, etc.)', 'Vercel-optimized, self-host supported'],
        ]}
      />

      <h2 style={h2Style}>
        Choosing a Rendering Strategy
      </h2>

      <p style={pStyle}>
        The decision tree is similar in both frameworks. Start with these questions:
      </p>

      <ul style={{ ...pStyle, paddingLeft: '1.5rem' }}>
        <li>Does the content change per request (user-specific data, real-time content)? Use SSR.</li>
        <li>Is the content the same for all users and rarely changes? Use SSG.</li>
        <li>Is the content the same for all users but changes periodically? Use ISR (Next.js) or SSG with cache headers (SvelteKit).</li>
        <li>Does the page depend entirely on client-side JavaScript (WebGL, complex canvas apps)? Use client-only rendering.</li>
      </ul>

      <p style={pStyle}>
        In practice, most applications use a mix of strategies. Your marketing pages are static,
        your blog uses ISR or SSG, your dashboard uses SSR, and your interactive editor uses
        client-only rendering. Both frameworks support mixing strategies across different routes
        within the same application.
      </p>

      <Callout type="gotcha" title="Static Detection in Next.js">
        Next.js automatically determines whether a route is static or dynamic by analyzing your
        code. If a Server Component calls <code>cookies()</code>, <code>headers()</code>, or
        reads <code>searchParams</code>, Next.js treats it as dynamic (SSR). If none of these
        are used, it is treated as static (SSG). This automatic detection is convenient but can
        be surprising — adding a single <code>cookies()</code> call can change a page from
        static to dynamic without any explicit configuration change.
      </Callout>

      <p style={pStyle}>
        In the next chapter, we will explore Server Actions and form handling — how both
        frameworks handle mutations, form submissions, and progressive enhancement.
      </p>
    </ChapterLayout>
  );
}
