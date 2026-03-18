import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function NuxtIntro() {
  return (
    <ChapterLayout id="nuxt-intro">
      <p style={pStyle}>
        You know Svelte. You have been learning React. Now there is a third major player worth
        understanding: Vue and its meta-framework Nuxt. If SvelteKit is Svelte's full-stack
        framework and Next.js is React's, then Nuxt is Vue's -- and it has been doing
        file-based routing, server-side rendering, and auto-imports since before either of
        the other two made them mainstream.
      </p>

      <p style={pStyle}>
        Why add a third framework to your mental model? Because Vue occupies a unique position
        in the frontend landscape. It borrows the best ideas from both React and Svelte, and
        understanding it will deepen your grasp of frontend architecture in general. Vue is
        the second most popular frontend framework globally, with massive adoption in Asia,
        Europe, and enterprise environments. Knowing all three makes you genuinely
        framework-agnostic.
      </p>

      {/* ===== Single File Components ===== */}
      <h2 style={h2Style}>Single File Components: Familiar Territory</h2>

      <p style={pStyle}>
        If you are coming from Svelte, Vue's Single File Components will feel like coming
        home. Both frameworks use the same fundamental idea: one file contains your script,
        your template, and your styles, all co-located. React took a different path with JSX
        and CSS-in-JS. Vue and Svelte agree that separation of concerns does not mean
        separation of file types.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<button on:click={increment}>
  Count: {count}
</button>

<style>
  button {
    background: #ff3e00;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>`,
          filename: 'Counter.svelte',
          language: 'svelte',
        }}
        react={{
          code: `<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    Count: {{ count }}
  </button>
</template>

<style scoped>
button {
  background: #42b883;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>`,
          filename: 'Counter.vue',
          language: 'html',
        }}
        note="The structure is nearly identical. Both have script, template, and scoped style blocks. Vue uses <script setup> for the Composition API, and double curly braces {{ }} for template interpolation instead of Svelte's single braces."
      />

      <h3 style={h3Style}>Key Differences in the SFC Format</h3>

      <p style={pStyle}>
        While the structure is similar, there are important differences. Vue's{' '}
        <code>&lt;script setup&gt;</code> is a compiler macro that automatically exposes all
        top-level bindings to the template -- similar to how Svelte exposes everything in
        <code> &lt;script&gt;</code>. Vue uses <code>@click</code> instead of{' '}
        <code>on:click</code>, double curly braces for interpolation, and the{' '}
        <code>scoped</code> attribute on <code>&lt;style&gt;</code> to achieve what Svelte
        does by default with its style encapsulation.
      </p>

      <p style={pStyle}>
        React, by contrast, has no template section at all. JSX is returned from the component
        function body, styles are handled externally through CSS modules, Tailwind, or
        CSS-in-JS libraries, and there is no compiler doing automatic scope isolation.
        Understanding this three-way difference in component structure helps you appreciate
        why each framework makes the trade-offs it does.
      </p>

      {/* ===== Why Learn Nuxt ===== */}
      <h2 style={h2Style}>Why Learn Nuxt?</h2>

      <p style={pStyle}>
        Learning Nuxt is not about abandoning Svelte or React. It is about broadening your
        architectural perspective. Each meta-framework has made different trade-offs, and
        understanding those trade-offs makes you a better developer regardless of which
        framework you use day-to-day.
      </p>

      <h3 style={h3Style}>Vue's Market Position</h3>
      <p style={pStyle}>
        Vue consistently ranks as the second most popular frontend framework by GitHub stars,
        npm downloads in many regions, and developer satisfaction surveys. It is the default
        choice in large parts of the Chinese and Southeast Asian tech ecosystems, widely used
        in European enterprise software, and the foundation of frameworks like Quasar and
        PrimeVue. If you work internationally or in enterprise consulting, you will encounter
        Vue codebases.
      </p>

      <h3 style={h3Style}>Nuxt's Innovations</h3>
      <p style={pStyle}>
        Nuxt pioneered several patterns that other frameworks later adopted. Auto-imports
        (components and composables are available without explicit import statements), the
        server directory convention for API routes, and hybrid rendering modes where different
        routes can use different rendering strategies -- all originated or were popularized
        by Nuxt. Understanding Nuxt helps you appreciate where Next.js and SvelteKit got
        some of their ideas.
      </p>

      {/* ===== Vue Composition API ===== */}
      <h2 style={h2Style}>Vue's Composition API</h2>

      <p style={pStyle}>
        Vue 3 introduced the Composition API, which is philosophically fascinating because it
        sits exactly between React hooks and Svelte runes. Like React hooks, it uses
        composable functions to encapsulate and reuse stateful logic. But like Svelte, it
        provides true reactivity -- when a reactive value changes, only the things that
        depend on it update, without re-running the entire component function.
      </p>

      <p style={pStyle}>
        Here is the mental model: React re-runs your entire component function on every state
        change and diffs a virtual DOM. Svelte compiles your component into surgical DOM
        update instructions. Vue takes a middle path -- it uses a runtime reactivity system
        based on JavaScript Proxies to track which values are read where, and triggers
        targeted updates without a full component re-execution or virtual DOM diff.
      </p>

      <h3 style={h3Style}>Three Ways to Declare State</h3>

      <CodeBlock
        code={`// Svelte 5
let count = $state(0);           // Compiler magic
count++;                          // Direct mutation

// React
const [count, setCount] = useState(0);  // Hook returns tuple
setCount(count + 1);                     // Setter function

// Vue 3
const count = ref(0);            // Reactive ref wrapper
count.value++;                    // Access via .value`}
        language="typescript"
        filename="state-comparison.ts"
        highlight={[2, 3, 6, 7, 10, 11]}
      />

      <p style={pStyle}>
        Notice how Vue's <code>ref()</code> is a middle ground. Like Svelte, you can mutate
        the value directly (via <code>.value</code>). Like React, you are working with an
        explicit wrapper object. The <code>.value</code> accessor is the price you pay for
        runtime reactivity without a compiler -- Vue needs a way to intercept reads and
        writes, and the Proxy-based wrapper is how it achieves that.
      </p>

      <Callout type="insight">
        Vue sits between React and Svelte philosophically. It has React-like composable
        functions but Svelte-like template syntax and reactivity. Understanding Vue helps you
        see the entire spectrum of frontend architecture choices, from fully compiled (Svelte)
        through proxy-based (Vue) to fully runtime (React).
      </Callout>

      {/* ===== Nuxt vs SvelteKit vs Next.js ===== */}
      <h2 style={h2Style}>Nuxt vs SvelteKit vs Next.js: The Meta-Framework Landscape</h2>

      <p style={pStyle}>
        All three meta-frameworks solve the same core problems: file-based routing, server-side
        rendering, data fetching, API routes, and build optimization. But they each approach
        these problems with the philosophy of their underlying framework. SvelteKit leans on
        the compiler for performance. Next.js leans on React Server Components for
        architecture. Nuxt leans on convention-over-configuration for developer experience.
      </p>

      <h3 style={h3Style}>Project Structure Comparison</h3>

      <CodeBlock
        code={`# SvelteKit
src/
  routes/
    +page.svelte
    +layout.svelte
    +page.server.ts
    api/
      +server.ts

# Next.js (App Router)
app/
  page.tsx
  layout.tsx
  api/
    route.ts

# Nuxt
pages/
  index.vue
layouts/
  default.vue
server/
  api/
    hello.ts
composables/
  useCounter.ts
components/
  MyButton.vue`}
        language="bash"
        filename="project-structures"
        highlight={[2, 11, 18]}
      />

      <p style={pStyle}>
        Nuxt separates concerns into dedicated top-level directories: <code>pages/</code> for
        routes, <code>layouts/</code> for page wrappers, <code>server/</code> for backend
        code, <code>composables/</code> for reusable logic, and <code>components/</code> for
        UI components. Everything in these directories is auto-imported -- you never write
        import statements for your own components or composables. SvelteKit and Next.js
        require explicit imports.
      </p>

      {/* ===== Feature Comparison ===== */}
      <h2 style={h2Style}>Three-Way Feature Comparison</h2>

      <p style={pStyle}>
        The following table provides a high-level comparison across the three frameworks and
        their meta-frameworks. Use it as a reference when mapping concepts between ecosystems.
      </p>

      <ComparisonTable
        caption="Svelte/SvelteKit vs React/Next.js vs Vue/Nuxt"
        headers={['Feature', 'Svelte / SvelteKit', 'React / Next.js', 'Vue / Nuxt']}
        rows={[
          ['Component format', '.svelte SFC', '.tsx / .jsx function', '.vue SFC'],
          ['Reactivity model', 'Compiler-driven runes', 'Runtime hooks + vDOM diff', 'Proxy-based runtime tracking'],
          ['State declaration', '$state(value)', 'useState(value)', 'ref(value) / reactive({})'],
          ['Derived state', '$derived(expr)', 'useMemo(() => expr, [deps])', 'computed(() => expr)'],
          ['Side effects', '$effect(() => {})', 'useEffect(() => {}, [deps])', 'watch() / watchEffect()'],
          ['Template syntax', 'HTML with {expressions}', 'JSX (JS with XML)', 'HTML with {{ expressions }}'],
          ['Conditionals', '{#if} / {:else}', 'Ternary / && in JSX', 'v-if / v-else directives'],
          ['Loops', '{#each items as item}', 'array.map()', 'v-for="item in items"'],
          ['Event handling', 'on:click={handler}', 'onClick={handler}', '@click="handler"'],
          ['Two-way binding', 'bind:value', 'value + onChange', 'v-model'],
          ['Scoped styles', 'Built-in (default)', 'CSS Modules / CSS-in-JS', '<style scoped>'],
          ['File-based routing', 'routes/ directory', 'app/ directory', 'pages/ directory'],
          ['Data fetching', 'load() functions', 'Server Components / fetch', 'useFetch / useAsyncData'],
          ['API routes', '+server.ts files', 'route.ts files', 'server/api/ directory'],
          ['Auto-imports', 'No (explicit imports)', 'No (explicit imports)', 'Yes (components + composables)'],
          ['SSR / SSG / ISR', 'SSR + prerender', 'SSR + SSG + ISR', 'SSR + SSG + ISR + SWR'],
        ]}
      />

      <h2 style={h2Style}>What is Coming Next</h2>

      <p style={pStyle}>
        In the following chapters, we will dive deep into Vue's reactivity system, exploring
        how <code>ref()</code>, <code>reactive()</code>, <code>computed()</code>, and{' '}
        <code>watch()</code> map to the Svelte and React primitives you already know. Then we
        will cover Nuxt's routing and data fetching, and finally bring everything together in
        a comprehensive three-way comparison to help you choose the right tool for each project.
      </p>

      <p style={pStyle}>
        The goal is not to convince you that one framework is better than another. It is to
        make you fluent enough in all three that you can read any codebase, contribute to any
        project, and make informed architectural decisions based on real understanding rather
        than tribal loyalty.
      </p>

      <Callout type="info" title="Prerequisites">
        These Nuxt/Vue chapters assume you have read the earlier React chapters in this guide.
        We will frequently reference React patterns as a comparison point alongside Svelte.
        If you have jumped ahead, the three-way comparison tables should still be useful as
        standalone reference material.
      </Callout>
    </ChapterLayout>
  );
}
