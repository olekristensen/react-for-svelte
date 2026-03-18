import { ChapterLayout } from '../components/ChapterLayout';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function NuxtComparison() {
  return (
    <ChapterLayout id="nuxt-comparison">
      <p style={pStyle}>
        You have now seen all three frameworks in action: Svelte/SvelteKit, React/Next.js,
        and Vue/Nuxt. This chapter brings everything together in a comprehensive comparison.
        The goal is not to declare a winner -- each framework excels in different areas and
        suits different projects. The goal is to give you a clear, honest reference for
        making architectural decisions.
      </p>

      <p style={pStyle}>
        Every comparison table in this chapter uses three columns, one per framework. The
        assessments are based on real-world usage, community consensus, and the inherent
        trade-offs of each framework's architecture. Where opinions are stated, they are
        labeled as such.
      </p>

      {/* ===== Routing ===== */}
      <h2 style={h2Style}>Routing</h2>

      <p style={pStyle}>
        All three frameworks use file-based routing as their primary routing mechanism. The
        differences lie in conventions: file naming, how dynamic segments are expressed, and
        where layouts live. SvelteKit uses the most distinctive naming with its{' '}
        <code>+page.svelte</code> convention. Next.js App Router uses directory-based routing
        with <code>page.tsx</code> files. Nuxt uses the most traditional approach with
        <code>.vue</code> files in a <code>pages/</code> directory.
      </p>

      <ComparisonTable
        caption="Routing features comparison"
        headers={['Feature', 'SvelteKit', 'Next.js (App Router)', 'Nuxt 3']}
        rows={[
          ['Route files', '+page.svelte', 'page.tsx', 'index.vue / [name].vue'],
          ['Dynamic routes', '[param] directory', '[param] directory', '[param].vue file'],
          ['Catch-all', '[...rest] directory', '[...slug] directory', '[...slug].vue file'],
          ['Optional params', '[[optional]] directory', '(group) + separate route', 'Not built-in (workaround)'],
          ['Route groups', '(group) directories', '(group) directories', 'Not built-in'],
          ['Layouts', '+layout.svelte (co-located)', 'layout.tsx (co-located)', 'layouts/ directory (separate)'],
          ['Nested layouts', 'Automatic via nesting', 'Automatic via nesting', 'definePageMeta + layout'],
          ['Middleware', 'hooks.server.ts', 'middleware.ts', 'middleware/ directory (named)'],
          ['Error pages', '+error.svelte', 'error.tsx (per segment)', 'error.vue (global)'],
          ['Loading UI', 'Custom (no convention)', 'loading.tsx (per segment)', 'Custom (pending from useFetch)'],
        ]}
      />

      <h3 style={h3Style}>Strengths and Trade-offs</h3>
      <p style={pStyle}>
        SvelteKit's routing is the most explicit -- every file has a clear purpose indicated
        by its prefix (<code>+page</code>, <code>+layout</code>, <code>+server</code>,{' '}
        <code>+error</code>). This makes it easy to understand a route at a glance but
        creates more files per route. Next.js App Router's segment-level error and loading
        boundaries are the most granular. Nuxt's approach creates the fewest files but
        requires more configuration for advanced patterns like named layouts and middleware.
      </p>

      {/* ===== Data Fetching ===== */}
      <h2 style={h2Style}>Data Fetching</h2>

      <p style={pStyle}>
        Data fetching is arguably the area with the greatest divergence between the three
        frameworks. SvelteKit uses explicit <code>load</code> functions. Next.js uses React
        Server Components. Nuxt uses composables. Each approach has deep implications for
        caching, streaming, and developer experience.
      </p>

      <ComparisonTable
        caption="Data fetching approaches comparison"
        headers={['Feature', 'SvelteKit', 'Next.js (App Router)', 'Nuxt 3']}
        rows={[
          ['Primary API', 'load() in +page.server.ts', 'async Server Components', 'useFetch() / useAsyncData()'],
          ['Where it runs', 'Server (or universal)', 'Server (RSC) or client', 'Server + client (isomorphic)'],
          ['SSR hydration', 'Automatic via load()', 'Automatic (RSC payload)', 'Automatic (payload key)'],
          ['Loading states', 'Streaming with await', 'loading.tsx / Suspense', 'pending ref from composable'],
          ['Error handling', 'throw error() in load', 'error.tsx boundary', 'error ref from composable'],
          ['Refetching', 'invalidate() / invalidateAll()', 'revalidatePath / revalidateTag', 'refresh() from composable'],
          ['Caching', 'No built-in cache layer', 'fetch() cache + ISR', 'Built-in key-based caching'],
          ['Watchers', 'Not needed (load re-runs)', 'Not needed (RSC re-renders)', 'watch option on useFetch'],
          ['Mutations', 'Form actions (+page.server)', 'Server Actions', 'useFetch with POST + refresh'],
          ['Type safety', 'Full (generated types)', 'Manual typing', 'Full (auto-generated)'],
        ]}
      />

      <h3 style={h3Style}>Strengths and Trade-offs</h3>
      <p style={pStyle}>
        SvelteKit's <code>load</code> functions provide the clearest separation between data
        and presentation. The generated types give excellent type safety. Next.js Server
        Components are the most revolutionary approach -- data fetching happens inside the
        component tree itself, enabling granular streaming. Nuxt's <code>useFetch</code>{' '}
        provides the best DX for common cases, returning reactive data, pending, error, and
        refresh in a single destructured call. The trade-off is that Nuxt's approach is less
        explicit about where code runs (server vs client) compared to SvelteKit's file
        convention.
      </p>

      {/* ===== Rendering ===== */}
      <h2 style={h2Style}>Rendering</h2>

      <p style={pStyle}>
        All three frameworks support server-side rendering, static generation, and client-side
        rendering. The differences lie in how they configure rendering modes and the
        underlying engine that powers them.
      </p>

      <ComparisonTable
        caption="Rendering strategies comparison"
        headers={['Feature', 'SvelteKit', 'Next.js', 'Nuxt 3']}
        rows={[
          ['SSR', 'Default (per-page opt-out)', 'Default (per-page opt-out)', 'Default (per-route opt-out)'],
          ['SSG / Prerendering', 'export const prerender = true', 'generateStaticParams()', 'routeRules: { prerender: true }'],
          ['ISR', 'Not built-in', 'revalidate option', 'routeRules: { isr: seconds }'],
          ['SPA mode', 'ssr: false in config', 'use client on root', 'routeRules: { ssr: false }'],
          ['Hybrid rendering', 'Per-page config', 'Per-segment config', 'Per-route rules in config'],
          ['Streaming', 'Supported (await blocks)', 'Supported (Suspense)', 'Supported (experimental)'],
          ['Server engine', 'Adapters (Node, Vercel, etc.)', 'Next.js runtime', 'Nitro (universal engine)'],
          ['Edge runtime', 'Via adapters', 'Built-in edge runtime', 'Via Nitro presets'],
          ['Build output', 'Adapter-dependent', 'Standalone or static', 'Nitro preset-dependent'],
        ]}
      />

      <h3 style={h3Style}>Strengths and Trade-offs</h3>
      <p style={pStyle}>
        Nuxt's Nitro engine is the most portable -- it supports over 15 deployment targets
        including Cloudflare Workers, Deno Deploy, AWS Lambda, and traditional Node servers.
        Next.js has the deepest integration with Vercel but also works self-hosted. SvelteKit
        uses adapters for deployment targets, which is a clean abstraction but means each
        adapter needs to be maintained. For ISR (Incremental Static Regeneration), Next.js
        and Nuxt have built-in support while SvelteKit relies on adapter-specific
        implementations.
      </p>

      {/* ===== State Management ===== */}
      <h2 style={h2Style}>State Management</h2>

      <p style={pStyle}>
        The need for external state management libraries varies dramatically across the three
        frameworks, largely because of their different reactivity models. Svelte's built-in
        reactivity and stores often eliminate the need for third-party state management.
        Vue's Composition API and Pinia do the same. React's ecosystem has the most
        state management options because the built-in primitives are lower-level.
      </p>

      <ComparisonTable
        caption="State management comparison"
        headers={['Feature', 'Svelte 5', 'React 18+', 'Vue 3']}
        rows={[
          ['Local state', '$state rune', 'useState hook', 'ref() / reactive()'],
          ['Derived state', '$derived rune', 'useMemo hook', 'computed()'],
          ['Global state', 'Svelte stores / context', 'Context + useReducer', 'Pinia / provide-inject'],
          ['Official store lib', 'Built-in stores', 'None (community libs)', 'Pinia (official)'],
          ['Popular alternatives', 'Minimal need', 'Zustand, Jotai, Redux', 'Minimal need (Pinia covers most)'],
          ['Dependency tracking', 'Compiler (automatic)', 'Manual (dep arrays)', 'Runtime proxies (automatic)'],
          ['Mutation model', 'Direct mutation', 'Immutable (new references)', 'Direct mutation'],
          ['DevTools', 'Svelte DevTools', 'React DevTools', 'Vue DevTools + Pinia plugin'],
          ['SSR state', 'Load functions', 'Server Components', 'useState composable + Pinia SSR'],
        ]}
      />

      <h3 style={h3Style}>Strengths and Trade-offs</h3>
      <p style={pStyle}>
        Svelte requires the least state management infrastructure because the compiler makes
        reactivity nearly invisible. Vue's Pinia is widely considered the best official state
        management solution of any framework -- it is type-safe, supports SSR, has excellent
        DevTools integration, and its API is minimal. React has the richest ecosystem of
        state management libraries (Zustand, Jotai, Valtio, Redux Toolkit, Recoil), but this
        abundance is partly because no single built-in solution covers all use cases. The
        choice paralysis in React's state management ecosystem is a real cost for teams.
      </p>

      {/* ===== Developer Experience ===== */}
      <h2 style={h2Style}>Developer Experience</h2>

      <p style={pStyle}>
        Developer experience encompasses tooling, error messages, documentation quality,
        learning curve, and daily ergonomics. This is inherently subjective, but there are
        measurable differences worth noting.
      </p>

      <ComparisonTable
        caption="Developer experience comparison"
        headers={['Feature', 'SvelteKit', 'Next.js', 'Nuxt 3']}
        rows={[
          ['Learning curve', 'Gentle (HTML-first)', 'Moderate (JSX + hooks rules)', 'Moderate (ref .value + directives)'],
          ['Boilerplate', 'Very low', 'Moderate (hooks verbosity)', 'Low (auto-imports)'],
          ['TypeScript', 'Excellent (generated types)', 'Good (manual in places)', 'Excellent (auto-generated)'],
          ['Auto-imports', 'No (explicit imports)', 'No (explicit imports)', 'Yes (components + composables)'],
          ['HMR speed', 'Very fast (Vite)', 'Fast (Turbopack / Webpack)', 'Fast (Vite)'],
          ['Error messages', 'Clear and helpful', 'Variable quality', 'Clear (improved in v3)'],
          ['Documentation', 'Excellent (interactive)', 'Extensive (large surface)', 'Good (improving)'],
          ['CLI scaffolding', 'npx sv create', 'npx create-next-app', 'npx nuxi init'],
          ['DevTools', 'Browser extension', 'Browser extension', 'Built-in DevTools panel'],
          ['File count per route', '2-4 files', '1-4 files', '1-2 files'],
        ]}
      />

      <h3 style={h3Style}>Strengths and Trade-offs</h3>
      <p style={pStyle}>
        SvelteKit has the most approachable learning curve for developers who think in HTML
        first. Its documentation is widely praised as the best in the framework ecosystem.
        Nuxt's auto-import system eliminates a significant amount of boilerplate -- you never
        write import statements for your own components, composables, or utility functions.
        Next.js has the most extensive documentation but also the largest API surface, which
        can be overwhelming. React's hook rules (no conditional hooks, dependency arrays)
        add a learning burden that does not exist in Svelte or Vue.
      </p>

      {/* ===== Performance ===== */}
      <h2 style={h2Style}>Performance</h2>

      <p style={pStyle}>
        Performance is multi-dimensional: initial load time, runtime speed, bundle size,
        memory usage, and time-to-interactive all matter differently depending on the
        application. Each framework has made explicit trade-offs in this space.
      </p>

      <ComparisonTable
        caption="Performance characteristics comparison"
        headers={['Metric', 'Svelte / SvelteKit', 'React / Next.js', 'Vue / Nuxt']}
        rows={[
          ['Bundle size (min)', 'Smallest (compiler output)', 'Largest (runtime ~40kb)', 'Medium (runtime ~33kb)'],
          ['Runtime overhead', 'Minimal (no framework runtime)', 'Virtual DOM diffing', 'Proxy-based tracking'],
          ['Initial load', 'Fastest (less JS to parse)', 'Slower (larger runtime)', 'Moderate'],
          ['Update performance', 'Surgical DOM updates', 'vDOM reconciliation', 'Targeted proxy updates'],
          ['Memory usage', 'Lowest', 'Higher (vDOM tree)', 'Moderate (proxy wrappers)'],
          ['SSR speed', 'Fast (compiled output)', 'Fast (streaming RSC)', 'Fast (Nitro engine)'],
          ['Tree shaking', 'Excellent (compiler)', 'Good (module-level)', 'Good (module-level)'],
          ['Lazy loading', 'Dynamic imports', 'React.lazy + Suspense', 'defineAsyncComponent / lazy routes'],
        ]}
      />

      <h3 style={h3Style}>Strengths and Trade-offs</h3>
      <p style={pStyle}>
        Svelte wins on bundle size and initial load because it compiles away the framework.
        There is no Svelte runtime shipped to the browser -- just the compiled output. React
        has the largest runtime but has invested heavily in Server Components to reduce
        client-side JavaScript. Vue sits in the middle -- its runtime is smaller than
        React's but present. For most applications, the performance differences are not
        user-perceptible, but for low-bandwidth or low-powered device scenarios, Svelte's
        smaller bundles provide a measurable advantage.
      </p>

      {/* ===== Ecosystem ===== */}
      <h2 style={h2Style}>Ecosystem</h2>

      <p style={pStyle}>
        The ecosystem around a framework often matters more than the framework itself. Library
        availability, hiring pool, community size, and corporate backing all influence
        real-world project decisions.
      </p>

      <ComparisonTable
        caption="Ecosystem comparison"
        headers={['Factor', 'Svelte / SvelteKit', 'React / Next.js', 'Vue / Nuxt']}
        rows={[
          ['npm downloads', 'Growing (smallest of three)', 'Dominant (largest by far)', 'Large (2nd globally)'],
          ['GitHub stars', 'High (very popular per capita)', 'Highest', 'Very high'],
          ['Component libraries', 'Growing (Skeleton, Melt UI)', 'Vast (MUI, Radix, shadcn)', 'Large (Vuetify, PrimeVue, Quasar)'],
          ['Job market', 'Niche (growing)', 'Dominant', 'Strong (especially Asia/Europe)'],
          ['Corporate backing', 'Vercel (acquired)', 'Meta + Vercel', 'Independent (community funded)'],
          ['Community size', 'Smallest (passionate)', 'Largest', 'Large (global)'],
          ['Learning resources', 'Official tutorial (excellent)', 'Abundant (books, courses)', 'Good (official + community)'],
          ['Headless CMS support', 'Growing', 'Best support', 'Good support'],
          ['Mobile / Native', 'Limited', 'React Native', 'Capacitor / NativeScript'],
        ]}
      />

      <h3 style={h3Style}>Strengths and Trade-offs</h3>
      <p style={pStyle}>
        React's ecosystem is unmatched. If a library exists for the web, it probably has a
        React version. The job market for React developers is the largest of any frontend
        framework. Vue has the second-largest ecosystem globally and dominates in China and
        Southeast Asia. Its component library ecosystem (Vuetify, PrimeVue, Quasar) is
        mature and well-maintained. Svelte has the smallest ecosystem but the most passionate
        community, and its acquisition by Vercel signals growing corporate investment.
      </p>

      {/* ===== Deployment ===== */}
      <h2 style={h2Style}>Deployment</h2>

      <p style={pStyle}>
        Deployment flexibility matters for teams with existing infrastructure. Some frameworks
        are tightly coupled to specific platforms, while others are more portable.
      </p>

      <ComparisonTable
        caption="Deployment options comparison"
        headers={['Platform', 'SvelteKit', 'Next.js', 'Nuxt 3']}
        rows={[
          ['Vercel', 'Adapter available', 'Native (best support)', 'Preset available'],
          ['Netlify', 'Adapter available', 'Supported', 'Preset available'],
          ['Cloudflare', 'Adapter available', 'Limited support', 'Preset available'],
          ['AWS Lambda', 'Via adapter', 'Via SST or custom', 'Preset available'],
          ['Docker / Node', 'Node adapter', 'Standalone output', 'Node preset'],
          ['Static hosting', 'Static adapter', 'Static export', 'Static preset'],
          ['Edge runtimes', 'Via adapters', 'Built-in', 'Via Nitro presets'],
          ['Deno Deploy', 'Community adapter', 'Not officially supported', 'Preset available'],
        ]}
      />

      <h3 style={h3Style}>Strengths and Trade-offs</h3>
      <p style={pStyle}>
        Nuxt's Nitro engine provides the most deployment targets with official support. Over
        15 presets are available out of the box, from Cloudflare Workers to AWS Lambda to Deno
        Deploy. Next.js works best on Vercel (unsurprisingly) and has solid self-hosting
        support, but some features (ISR, image optimization) require additional setup outside
        Vercel. SvelteKit's adapter system is clean and well-documented, with community
        adapters filling gaps in official support.
      </p>

      <Callout type="insight">
        There is no "best" framework. SvelteKit excels in developer experience and bundle
        size. Next.js excels in ecosystem breadth and deployment infrastructure. Nuxt excels
        in progressive enhancement and convention-over-configuration. The best choice depends
        on your team's experience, project requirements, and deployment constraints.
      </Callout>

      {/* ===== When to Choose What ===== */}
      <h2 style={h2Style}>When to Choose What</h2>

      <p style={pStyle}>
        Choosing a framework is a team and project decision, not a technical one alone. Here
        are practical guidelines based on common scenarios. These are opinions informed by
        real-world usage, not universal truths.
      </p>

      <h3 style={h3Style}>Choose SvelteKit When...</h3>
      <p style={pStyle}>
        You are building a new project with a small to medium team that values developer
        experience above all else. SvelteKit is ideal for content sites, marketing pages,
        internal tools, and applications where bundle size matters (low-bandwidth users,
        mobile-first markets). It has the gentlest learning curve and the least boilerplate.
        The compiler-driven approach means fewer runtime bugs related to stale closures or
        incorrect dependency arrays.
      </p>

      <h3 style={h3Style}>Choose Next.js When...</h3>
      <p style={pStyle}>
        You need the largest ecosystem, the most hiring options, or deep integration with
        Vercel's platform. Next.js is the safe enterprise choice -- it has the most component
        libraries, the most tutorials, and the most battle-tested production deployments. If
        you are building a product that needs React Native for mobile, Next.js for web keeps
        your team in one paradigm. Server Components represent the future of React
        architecture, and Next.js is where they are most mature.
      </p>

      <h3 style={h3Style}>Choose Nuxt When...</h3>
      <p style={pStyle}>
        You want the best convention-over-configuration experience, need flexible deployment
        targets, or are working in a market where Vue is dominant (China, Southeast Asia,
        parts of Europe). Nuxt's auto-imports and directory conventions reduce boilerplate
        significantly. The Nitro engine provides the most portable server runtime. Pinia is
        arguably the best state management solution of any framework. If your team already
        knows Vue, Nuxt is the obvious choice.
      </p>

      <h3 style={h3Style}>Framework-Agnostic Factors</h3>
      <p style={pStyle}>
        Beyond framework features, consider: What does your team already know? What does your
        hiring market look like? What component libraries does your design system need? What
        is your deployment target? These practical constraints often matter more than any
        technical comparison. A team that knows React deeply will ship faster with Next.js
        than with a "superior" framework they need to learn.
      </p>

      {/* ===== Comprehensive Feature Matrix ===== */}
      <h2 style={h2Style}>Comprehensive Feature Matrix</h2>

      <p style={pStyle}>
        This final table is your reference card. It covers the full surface area of all three
        framework ecosystems in a single view. Bookmark it and come back when you need to
        quickly compare a specific feature.
      </p>

      <ComparisonTable
        caption="Comprehensive three-way feature matrix"
        headers={['Feature', 'Svelte / SvelteKit', 'React / Next.js', 'Vue / Nuxt']}
        rows={[
          ['Component model', 'Single File Component (.svelte)', 'Function components (.tsx)', 'Single File Component (.vue)'],
          ['Reactivity', 'Compiler runes ($state, $derived)', 'Hooks (useState, useMemo)', 'Proxy refs (ref, computed)'],
          ['Template language', 'Superset of HTML', 'JSX (JavaScript XML)', 'Superset of HTML + directives'],
          ['Scoped styles', 'Built-in (default behavior)', 'CSS Modules / Tailwind / CSS-in-JS', '<style scoped> attribute'],
          ['Two-way binding', 'bind:value', 'value + onChange (controlled)', 'v-model directive'],
          ['Conditional render', '{#if} / {:else} blocks', 'Ternary / && in JSX', 'v-if / v-else directives'],
          ['List rendering', '{#each} blocks', 'array.map() in JSX', 'v-for directive'],
          ['Slot / children', '<slot> element', 'props.children', '<slot> element'],
          ['Named slots', '<slot name="x">', 'Named props', '<slot name="x">'],
          ['Event handling', 'on:event={handler}', 'onEvent={handler}', '@event="handler"'],
          ['Component lifecycle', 'onMount, onDestroy', 'useEffect', 'onMounted, onUnmounted'],
          ['Custom reusable logic', 'Exported functions + runes', 'Custom hooks (use* convention)', 'Composables (use* convention)'],
          ['Context / DI', 'setContext / getContext', 'createContext / useContext', 'provide / inject'],
          ['File-based routing', 'routes/ with +page.svelte', 'app/ with page.tsx', 'pages/ with .vue files'],
          ['API routes', '+server.ts files', 'route.ts files', 'server/api/ directory'],
          ['Data fetching (SSR)', 'load() functions', 'Async Server Components', 'useFetch / useAsyncData'],
          ['Form handling', 'Form actions', 'Server Actions', 'useFetch + form submit'],
          ['Middleware', 'hooks.server.ts', 'middleware.ts', 'middleware/ directory'],
          ['State management', 'Built-in stores', 'Context + Zustand / Redux', 'Pinia (official)'],
          ['Animation', 'Built-in transitions', 'Framer Motion / react-spring', 'Built-in <Transition>'],
          ['SSR', 'Default (opt-out per page)', 'Default (opt-out per page)', 'Default (opt-out per route)'],
          ['Static generation', 'prerender option', 'generateStaticParams', 'routeRules prerender'],
          ['ISR', 'Not built-in', 'revalidate option', 'routeRules isr option'],
          ['Image optimization', '@sveltejs/enhanced-img', 'next/image (built-in)', 'nuxt/image module'],
          ['Font optimization', 'Manual', 'next/font (built-in)', '@nuxtjs/google-fonts module'],
          ['SEO / Meta', 'svelte:head element', 'Metadata API', 'useHead / useSeoMeta composables'],
          ['Testing', 'Vitest + Testing Library', 'Jest/Vitest + Testing Library', 'Vitest + Testing Library'],
          ['Build tool', 'Vite', 'Webpack / Turbopack', 'Vite'],
          ['Server engine', 'Adapters', 'Next.js runtime', 'Nitro (15+ deploy targets)'],
          ['Mobile / Native', 'Limited options', 'React Native', 'Capacitor / NativeScript Vue'],
        ]}
      />

      <h2 style={h2Style}>Final Thoughts</h2>

      <p style={pStyle}>
        Knowing all three frameworks does not mean you should use all three. It means you can
        make informed decisions. When you understand why React uses immutable state, why
        Svelte uses a compiler, and why Vue uses Proxies, you understand the fundamental
        trade-offs of frontend architecture itself. You can read any codebase, contribute to
        any project, and evaluate new frameworks as they emerge.
      </p>

      <p style={pStyle}>
        The frontend ecosystem will continue to evolve. Svelte 5 runes already moved closer
        to Vue's Composition API in spirit. React Server Components pushed the boundary of
        where server and client code meet. Vue's Vapor mode (in development) is exploring
        compiler-driven optimization similar to Svelte's approach. The frameworks are
        converging on many ideas while diverging on implementation details.
      </p>

      <p style={pStyle}>
        The most valuable skill in frontend development is not mastery of a single framework.
        It is the ability to understand the patterns that all frameworks share, the trade-offs
        they make differently, and the judgment to pick the right tool for each situation.
        If you have read through this entire guide, you have that skill. Now go build
        something.
      </p>
    </ChapterLayout>
  );
}
