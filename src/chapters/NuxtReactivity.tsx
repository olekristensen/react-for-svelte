import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function NuxtReactivity() {
  return (
    <ChapterLayout id="nuxt-reactivity">
      <p style={pStyle}>
        Vue's reactivity system is the heart of everything. Coming from Svelte, you will find
        it surprisingly familiar in philosophy -- values are reactive, changes propagate
        automatically, and templates update surgically. But the mechanics are different. Where
        Svelte's compiler rewires your code at build time, Vue uses JavaScript Proxies at
        runtime to intercept reads and writes. Where React requires you to manually specify
        dependencies, Vue tracks them automatically -- just like Svelte.
      </p>

      <p style={pStyle}>
        This chapter walks through every Vue reactivity primitive and maps it directly to the
        Svelte and React equivalents you already know. By the end, you will be able to look
        at any Vue component and immediately understand what each reactive declaration does.
      </p>

      {/* ===== ref() ===== */}
      <h2 style={h2Style}>ref() -- Reactive Primitive Values</h2>

      <p style={pStyle}>
        Vue's <code>ref()</code> is the most common way to declare reactive state. It wraps a
        value in a reactive object with a <code>.value</code> property. In your script code,
        you read and write via <code>.value</code>. In the template, Vue automatically unwraps
        refs, so you just use the variable name directly. This is the single most important
        thing to learn about Vue reactivity.
      </p>

      <CodeBlock
        code={`<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const name = ref('world')

function increment() {
  count.value++          // .value required in script
}

function greet(newName: string) {
  name.value = newName   // .value required in script
}
</script>

<template>
  <!-- No .value needed in template! -->
  <p>Count: {{ count }}</p>
  <p>Hello {{ name }}!</p>
  <button @click="increment">+1</button>
</template>`}
        language="html"
        filename="RefBasics.vue"
        highlight={[4, 5, 8, 12, 18, 19]}
      />

      <p style={pStyle}>
        Compare this to the Svelte and React equivalents:
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  // Svelte: direct assignment, no wrapper
  let count = $state(0);
  let name = $state('world');

  function increment() {
    count++;              // Direct mutation
  }

  function greet(newName) {
    name = newName;       // Direct assignment
  }
</script>

<p>Count: {count}</p>
<p>Hello {name}!</p>
<button on:click={increment}>+1</button>`,
          filename: 'RefBasics.svelte',
          language: 'svelte',
        }}
        react={{
          code: `import { useState } from 'react';

// React: tuple destructuring, setter function
function RefBasics() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('world');

  function increment() {
    setCount(prev => prev + 1);  // Setter function
  }

  function greet(newName: string) {
    setName(newName);            // Setter function
  }

  return (
    <>
      <p>Count: {count}</p>
      <p>Hello {name}!</p>
      <button onClick={increment}>+1</button>
    </>
  );
}`,
          filename: 'RefBasics.tsx',
          language: 'tsx',
        }}
        note="Vue's ref() is a middle ground: you mutate directly like Svelte (via .value), but there is an explicit wrapper like React's useState. The template auto-unwrapping is Vue's way of keeping template code as clean as Svelte's."
      />

      <Callout type="gotcha" title="The .value Trap">
        Vue's <code>ref()</code> requires <code>.value</code> in script but auto-unwraps in
        templates. This trips up every newcomer. You will write <code>count</code> instead of{' '}
        <code>count.value</code> in your script, get no error (it evaluates to the ref
        object itself, which is truthy), and wonder why your logic is broken. TypeScript helps
        catch this, but it remains the single most common Vue mistake.
      </Callout>

      {/* ===== reactive() ===== */}
      <h2 style={h2Style}>reactive() -- Reactive Objects</h2>

      <p style={pStyle}>
        While <code>ref()</code> wraps a single value, <code>reactive()</code> makes an entire
        object deeply reactive without the <code>.value</code> accessor. It uses JavaScript
        Proxies to intercept property access and mutation. This is the closest thing to
        Svelte's <code>$state</code> on objects -- you just mutate properties directly and
        Vue tracks the changes.
      </p>

      <CodeBlock
        code={`<script setup lang="ts">
import { reactive } from 'vue'

const user = reactive({
  name: 'Alice',
  age: 30,
  address: {
    city: 'Copenhagen',
    country: 'Denmark'
  }
})

function updateCity() {
  // Direct mutation -- no .value, no spreading!
  user.address.city = 'Aarhus'
}

function birthday() {
  user.age++
}
</script>

<template>
  <p>{{ user.name }}, {{ user.age }}</p>
  <p>Lives in {{ user.address.city }}</p>
  <button @click="birthday">Birthday</button>
</template>`}
        language="html"
        filename="ReactiveObject.vue"
        highlight={[4, 15, 19]}
      />

      <p style={pStyle}>
        Compare this to how Svelte and React handle the same nested object:
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  // Svelte: $state on objects works the same
  let user = $state({
    name: 'Alice',
    age: 30,
    address: {
      city: 'Copenhagen',
      country: 'Denmark'
    }
  });

  function updateCity() {
    user.address.city = 'Aarhus';  // Direct
  }

  function birthday() {
    user.age++;                     // Direct
  }
</script>`,
          filename: 'ReactiveObject.svelte',
          language: 'svelte',
        }}
        react={{
          code: `import { useState } from 'react';

function ReactiveObject() {
  const [user, setUser] = useState({
    name: 'Alice',
    age: 30,
    address: {
      city: 'Copenhagen',
      country: 'Denmark',
    },
  });

  function updateCity() {
    // React: spread at every nesting level
    setUser({
      ...user,
      address: { ...user.address, city: 'Aarhus' },
    });
  }

  function birthday() {
    setUser({ ...user, age: user.age + 1 });
  }

  return <div>...</div>;
}`,
          filename: 'ReactiveObject.tsx',
          language: 'tsx',
        }}
        note="Vue's reactive() and Svelte's $state on objects are nearly identical in usage. Both allow direct mutation of nested properties. React requires immutable updates with spreading at every level."
      />

      <h3 style={h3Style}>ref() vs reactive() -- When to Use Which</h3>
      <p style={pStyle}>
        The Vue community generally recommends <code>ref()</code> for everything and using{' '}
        <code>reactive()</code> sparingly. The reason is that <code>ref()</code> works with
        any value type (primitives, objects, arrays) and can be destructured and passed
        around without losing reactivity. <code>reactive()</code> only works with objects and
        loses reactivity if you destructure it or reassign the entire variable. This is a
        subtle but important gotcha.
      </p>

      <CodeBlock
        code={`import { ref, reactive } from 'vue'

// ref() -- works with anything, always reactive
const count = ref(0)        // primitive
const user = ref({ name: 'Alice' })  // object (accessed via user.value.name)
const items = ref([1, 2, 3])         // array

// reactive() -- objects only, no .value needed
const state = reactive({ count: 0, name: 'Alice' })
state.count++  // direct access, no .value

// DANGER: destructuring reactive() breaks reactivity!
const { count: c } = state  // c is now a plain number, NOT reactive
// c++ would not trigger updates!

// With ref(), you can safely pass refs around
function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }  // count stays reactive
}`}
        language="typescript"
        filename="ref-vs-reactive.ts"
        highlight={[3, 9, 13, 18]}
      />

      {/* ===== computed() ===== */}
      <h2 style={h2Style}>computed() -- Derived State</h2>

      <p style={pStyle}>
        Vue's <code>computed()</code> is the equivalent of Svelte's <code>$derived</code> and
        React's <code>useMemo</code>. It creates a cached, reactive value that automatically
        recalculates when its dependencies change. Unlike React, you do not need to specify a
        dependency array -- Vue tracks dependencies automatically, just like Svelte.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let items = $state([
    { name: 'Milk', price: 12, qty: 2 },
    { name: 'Bread', price: 8, qty: 1 },
    { name: 'Cheese', price: 45, qty: 1 },
  ]);

  // Auto-tracked by the compiler
  let total = $derived(
    items.reduce((s, i) => s + i.price * i.qty, 0)
  );

  let itemCount = $derived(
    items.reduce((s, i) => s + i.qty, 0)
  );
</script>

<p>Total: {total} kr ({itemCount} items)</p>`,
          filename: 'Computed.svelte',
          language: 'svelte',
        }}
        react={{
          code: `<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref([
  { name: 'Milk', price: 12, qty: 2 },
  { name: 'Bread', price: 8, qty: 1 },
  { name: 'Cheese', price: 45, qty: 1 },
])

// Auto-tracked by Vue's reactivity system
const total = computed(() =>
  items.value.reduce((s, i) => s + i.price * i.qty, 0)
)

const itemCount = computed(() =>
  items.value.reduce((s, i) => s + i.qty, 0)
)
</script>

<template>
  <p>Total: {{ total }} kr ({{ itemCount }} items)</p>
</template>`,
          filename: 'Computed.vue',
          language: 'html',
        }}
        note="Vue's computed() and Svelte's $derived are philosophically identical: both auto-track dependencies and cache results. React's useMemo requires manual dependency arrays and is an optimization hint, not a semantic guarantee."
      />

      <p style={pStyle}>
        For the React comparison, recall that the equivalent requires explicit dependency
        arrays:
      </p>

      <CodeBlock
        code={`// React -- manual dependency tracking
const total = useMemo(
  () => items.reduce((s, i) => s + i.price * i.qty, 0),
  [items]  // YOU must list dependencies
);

// Vue -- automatic dependency tracking
const total = computed(
  () => items.value.reduce((s, i) => s + i.price * i.qty, 0)
  // No dependency array! Vue tracks reads automatically.
);

// Svelte -- compiler tracks at build time
let total = $derived(
  items.reduce((s, i) => s + i.price * i.qty, 0)
  // No dependency array! Compiler tracks at build time.
);`}
        language="typescript"
        filename="derived-state-three-way.ts"
        highlight={[4, 10, 16]}
      />

      {/* ===== watch() and watchEffect() ===== */}
      <h2 style={h2Style}>watch() and watchEffect() -- Side Effects</h2>

      <p style={pStyle}>
        Side effects -- reacting to state changes by doing something beyond updating the
        UI -- are handled differently in each framework. Vue offers two approaches:{' '}
        <code>watch()</code> for watching specific sources and <code>watchEffect()</code>{' '}
        for auto-tracked effects. Both map to Svelte's <code>$effect</code>, but{' '}
        <code>watch()</code> is closer to React's <code>useEffect</code> in that you
        specify what to watch.
      </p>

      <CodeBlock
        code={`<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const results = ref([])

// watch() -- explicit source, gives old and new values
watch(searchQuery, async (newQuery, oldQuery) => {
  console.log(\`Changed from "\${oldQuery}" to "\${newQuery}"\`)
  if (newQuery.length > 2) {
    results.value = await fetchResults(newQuery)
  }
})

// watchEffect() -- auto-tracks dependencies, like $effect
watchEffect(() => {
  // Vue tracks that this reads searchQuery.value
  document.title = \`Search: \${searchQuery.value}\`
})

// watch() with options
watch(
  () => searchQuery.value.length,  // Computed watch source
  (newLen) => {
    console.log(\`Query is now \${newLen} chars\`)
  },
  { immediate: true }  // Run on mount too, like useEffect
)
</script>`}
        language="html"
        filename="WatchExamples.vue"
        highlight={[8, 16, 22]}
      />

      <p style={pStyle}>
        Compare the three approaches to side effects:
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let query = $state('');

  // $effect auto-tracks dependencies
  $effect(() => {
    document.title = \`Search: \${query}\`;
    // Cleanup: return a function
    return () => {
      document.title = 'App';
    };
  });

  // Watching specific values
  $effect(() => {
    if (query.length > 2) {
      fetchResults(query);
    }
  });
</script>`,
          filename: 'Effects.svelte',
          language: 'svelte',
        }}
        react={{
          code: `import { useState, useEffect } from 'react';

function Effects() {
  const [query, setQuery] = useState('');

  // useEffect with manual dependency array
  useEffect(() => {
    document.title = \`Search: \${query}\`;
    // Cleanup function
    return () => {
      document.title = 'App';
    };
  }, [query]);  // Must list dependencies manually!

  useEffect(() => {
    if (query.length > 2) {
      fetchResults(query);
    }
  }, [query]);  // Must list dependencies manually!

  return <div>...</div>;
}`,
          filename: 'Effects.tsx',
          language: 'tsx',
        }}
        note="Vue's watchEffect() and Svelte's $effect both auto-track dependencies. React's useEffect requires manual dependency arrays. Vue's watch() adds the ability to access old values and run conditionally, which is harder to do cleanly in React or Svelte."
      />

      {/* ===== Composables ===== */}
      <h2 style={h2Style}>Composables -- Vue's Custom Hooks</h2>

      <p style={pStyle}>
        Composables are Vue's answer to React's custom hooks and Svelte's custom stores or
        extracted reactive logic. They are plain functions that use Vue's reactivity
        primitives and can be shared across components. The convention is to prefix them with{' '}
        <code>use</code>, just like React hooks.
      </p>

      <p style={pStyle}>
        The key difference from React hooks is that Vue composables return reactive refs that
        maintain their reactivity when destructured. React hooks return plain values that
        become stale after each render. Svelte achieves something similar by returning objects
        with <code>$state</code> properties from functions, though the pattern is less
        formalized.
      </p>

      <CodeBlock
        code={`// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)

  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initial }

  return { count, doubled, isEven, increment, decrement, reset }
}

// Usage in a component:
// <script setup>
// const { count, doubled, increment } = useCounter(10)
// </script>
// <template>
//   <p>{{ count }} (doubled: {{ doubled }})</p>
//   <button @click="increment">+1</button>
// </template>`}
        language="typescript"
        filename="composables/useCounter.ts"
        highlight={[4, 5, 6, 13]}
      />

      <p style={pStyle}>
        Here is the same pattern in all three frameworks:
      </p>

      <CodeComparison
        svelte={{
          code: `// lib/useCounter.svelte.ts
export function useCounter(initial = 0) {
  let count = $state(initial);
  let doubled = $derived(count * 2);
  let isEven = $derived(count % 2 === 0);

  function increment() { count++; }
  function decrement() { count--; }
  function reset() { count = initial; }

  return {
    get count() { return count; },
    get doubled() { return doubled; },
    get isEven() { return isEven; },
    increment,
    decrement,
    reset,
  };
}

// Usage: const counter = useCounter(10);
// {counter.count} in template`,
          filename: 'lib/useCounter.svelte.ts',
          language: 'typescript',
        }}
        react={{
          code: `// hooks/useCounter.ts
import { useState, useMemo, useCallback } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const doubled = useMemo(() => count * 2, [count]);
  const isEven = useMemo(() => count % 2 === 0, [count]);

  const increment = useCallback(
    () => setCount(c => c + 1), []
  );
  const decrement = useCallback(
    () => setCount(c => c - 1), []
  );
  const reset = useCallback(
    () => setCount(initial), [initial]
  );

  return { count, doubled, isEven,
    increment, decrement, reset };
}

// Usage: const { count, increment } = useCounter(10);
// {count} in JSX`,
          filename: 'hooks/useCounter.ts',
          language: 'typescript',
        }}
        note="Vue composables are the simplest. No useCallback needed (refs are stable). No getter wrappers needed (refs auto-unwrap in templates). React requires the most boilerplate for the same pattern."
      />

      <Callout type="insight" title="Reactivity Ergonomics">
        Notice how the boilerplate scales differently. For a simple composable, Vue requires
        the least ceremony. React requires <code>useMemo</code> and <code>useCallback</code>{' '}
        to avoid re-computation and stale closures. Svelte requires getter wrappers in
        returned objects to maintain reactivity. Each approach has trade-offs, but Vue's
        composables are widely regarded as the most ergonomic for medium-complexity logic.
      </Callout>

      {/* ===== Lifecycle in Composables ===== */}
      <h3 style={h3Style}>Lifecycle Hooks in Composables</h3>

      <p style={pStyle}>
        Vue composables can also use lifecycle hooks, just like React's custom hooks can use{' '}
        <code>useEffect</code>. This makes them powerful for encapsulating complex behavior
        like event listeners, intersection observers, or WebSocket connections.
      </p>

      <CodeBlock
        code={`// composables/useWindowSize.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => window.addEventListener('resize', update))
  onUnmounted(() => window.removeEventListener('resize', update))

  return { width, height }
}

// In Svelte, you would use $effect for the same:
// $effect(() => {
//   window.addEventListener('resize', update);
//   return () => window.removeEventListener('resize', update);
// });

// In React, you would use useEffect:
// useEffect(() => {
//   window.addEventListener('resize', update);
//   return () => window.removeEventListener('resize', update);
// }, []);`}
        language="typescript"
        filename="composables/useWindowSize.ts"
        highlight={[13, 14]}
      />

      {/* ===== Comparison Table ===== */}
      <h2 style={h2Style}>Reactivity Primitives at a Glance</h2>

      <ComparisonTable
        caption="Reactivity primitives across all three frameworks"
        headers={['Concept', 'Svelte 5', 'React 18+', 'Vue 3']}
        rows={[
          ['Primitive state', '$state(value)', 'useState(value)', 'ref(value)'],
          ['Object state', '$state({ ... })', 'useState({ ... })', 'reactive({ ... })'],
          ['Derived / computed', '$derived(expr)', 'useMemo(() => expr, [deps])', 'computed(() => expr)'],
          ['Side effects', '$effect(() => {})', 'useEffect(() => {}, [deps])', 'watchEffect(() => {})'],
          ['Watch specific value', '$effect with reads', 'useEffect with [dep]', 'watch(source, callback)'],
          ['Access old value', 'Not built-in', 'useRef + useEffect', 'watch(src, (new, old) => {})'],
          ['Dependency tracking', 'Automatic (compiler)', 'Manual (arrays)', 'Automatic (runtime proxies)'],
          ['Reusable logic', 'Exported functions + runes', 'Custom hooks', 'Composables (use* functions)'],
          ['State wrapper', 'None (direct variable)', '[value, setter] tuple', 'ref.value accessor'],
          ['Template access', 'Direct variable name', 'Direct variable name', 'Auto-unwrapped ref'],
          ['Mutable updates', 'Yes (compiler handles)', 'No (immutable required)', 'Yes (proxies handle)'],
          ['Stable identity', 'Compiler rewires closures', 'useCallback / useMemo', 'Refs are stable objects'],
          ['Deep reactivity', 'Yes ($state proxies)', 'No (manual spreading)', 'Yes (reactive() proxies)'],
        ]}
      />

      <h2 style={h2Style}>Key Takeaways</h2>

      <p style={pStyle}>
        Vue's reactivity system is the closest to Svelte's in terms of developer experience.
        Both auto-track dependencies, both allow direct mutation, and both provide
        fine-grained updates without a virtual DOM diff (though Vue does use a lightweight
        virtual DOM for template rendering). The main difference is the mechanism: Svelte
        uses compile-time analysis, Vue uses runtime Proxies, and React uses manual
        dependency arrays with a full virtual DOM reconciliation.
      </p>

      <p style={pStyle}>
        If you are coming from Svelte, the biggest adjustment is the <code>.value</code>{' '}
        accessor on refs. Think of it as the small tax you pay for runtime reactivity without
        a compiler. If you are also familiar with React, you will appreciate that Vue
        eliminates the entire category of stale closure bugs and incorrect dependency arrays
        that plague React applications. Each framework has chosen a different point on the
        convenience-vs-explicitness spectrum, and understanding all three makes you a more
        thoughtful developer.
      </p>
    </ChapterLayout>
  );
}
