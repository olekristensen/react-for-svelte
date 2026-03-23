import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function ReactEvolution() {
  return (
    <ChapterLayout id="react-evolution">
      <p style={pStyle}>
        React has undergone a fundamental transformation since its early days. What started
        as a simple view library with class components and lifecycle methods has evolved into
        a full-stack architecture with compilers, server components, and built-in async
        primitives. For Svelte developers coming to React, understanding where React has been
        and where it is heading reveals why the ecosystem looks the way it does &mdash; and
        shows that many of the ideas Svelte pioneered are now influencing React&apos;s direction.
      </p>

      <p style={pStyle}>
        This chapter covers the current state of React 19, the React Compiler, Server
        Components, the meta-framework landscape, and where both React and Svelte are
        converging. It is the closing chapter of this tutorial &mdash; a chance to zoom out
        and see the bigger picture before you ship your first React project.
      </p>

      {/* ================================================================== */}
      <h2 style={h2Style}>React 19 &mdash; The Current Release</h2>

      <p style={pStyle}>
        React 19 shipped in December 2024 and represents the largest single-version leap
        since the introduction of hooks in React 16.8. The headline features are Actions
        (built-in async mutation handling), three new hooks (<code>useActionState</code>,{' '}
        <code>useFormStatus</code>, <code>useOptimistic</code>), the <code>use</code> hook
        for reading promises and context in render, stable Server Components, and the ability
        to pass <code>ref</code> as a regular prop without <code>forwardRef</code>.
      </p>

      <p style={pStyle}>
        For Svelte developers, React 19 is significant because it brings several patterns
        you already know into React&apos;s core. Form actions, optimistic updates, and async
        data reading were all things SvelteKit handled elegantly &mdash; React 19 now has
        first-class answers for each.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h3 style={h3Style}>Actions &mdash; Built-in Async Patterns</h3>

      <p style={pStyle}>
        Actions are React 19&apos;s mechanism for handling form submissions and other async
        mutations. You pass an async function to a <code>&lt;form action=&#123;fn&#125;&gt;</code>{' '}
        and React automatically manages pending states, error handling, and sequential
        processing. If you have used SvelteKit form actions, the mental model is nearly
        identical.
      </p>

      <CodeComparison
        svelte={{
          filename: '+page.server.ts / +page.svelte',
          language: 'svelte',
          code: `// +page.server.ts
export const actions = {
  addTodo: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title') as string;
    await db.todo.create({ data: { title } });
    return { success: true };
  }
};

<!-- +page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<form method="POST" action="?/addTodo"
  use:enhance>
  <input name="title" required />
  <button type="submit">Add</button>
  {#if form?.success}
    <p>Added!</p>
  {/if}
</form>`
        }}
        react={{
          filename: 'TodoForm.tsx',
          language: 'tsx',
          code: `'use client';

function TodoForm() {
  async function addTodo(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    await db.todo.create({ data: { title } });
  }

  return (
    <form action={addTodo}>
      <input name="title" required />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add'}
    </button>
  );
}`
        }}
        note="SvelteKit form actions and React 19 Actions share the same philosophy: progressive enhancement, server-side execution, and declarative form handling."
      />

      <Callout type="insight" title="Same Philosophy, Different Syntax">
        React 19 Actions bring SvelteKit&apos;s form actions philosophy into React itself. The
        pattern is remarkably similar &mdash; declare an async function, bind it to a form,
        and let the framework handle pending states, error boundaries, and sequential
        submission. The biggest difference is that React&apos;s version works in pure SPAs
        too, not just server-rendered apps.
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h3 style={h3Style}>useActionState &mdash; Replacing Boilerplate</h3>

      <p style={pStyle}>
        Before React 19, handling form state meant juggling multiple <code>useState</code>{' '}
        calls: one for the result, one for errors, one for pending status. The{' '}
        <code>useActionState</code> hook collapses all of this into a single call that
        returns the current state, a bound action function, and a pending boolean.
      </p>

      <CodeComparison
        svelte={{
          filename: '+page.svelte',
          language: 'svelte',
          code: `<script lang="ts">
  import { enhance } from '$app/forms';

  let loading = $state(false);
  let result = $state<{
    success?: boolean;
    error?: string;
  } | null>(null);
</script>

<form method="POST" action="?/subscribe"
  use:enhance={() => {
    loading = true;
    return async ({ result: res, update }) => {
      loading = false;
      if (res.type === 'success') {
        result = res.data;
      } else {
        result = { error: 'Failed' };
      }
      await update();
    };
  }}
>
  <input name="email" type="email" required />
  <button disabled={loading}>
    {loading ? 'Subscribing...' : 'Subscribe'}
  </button>
  {#if result?.error}
    <p class="error">{result.error}</p>
  {/if}
  {#if result?.success}
    <p class="success">Subscribed!</p>
  {/if}
</form>`
        }}
        react={{
          filename: 'SubscribeForm.tsx',
          language: 'tsx',
          code: `import { useActionState } from 'react';

type State = {
  success?: boolean;
  error?: string;
} | null;

async function subscribe(
  prev: State,
  formData: FormData
): Promise<State> {
  const email = formData.get('email') as string;
  try {
    await api.subscribe(email);
    return { success: true };
  } catch {
    return { error: 'Subscription failed' };
  }
}

function SubscribeForm() {
  const [state, action, pending] =
    useActionState(subscribe, null);

  return (
    <form action={action}>
      <input name="email" type="email" required />
      <button disabled={pending}>
        {pending ? 'Subscribing...' : 'Subscribe'}
      </button>
      {state?.error && (
        <p className="error">{state.error}</p>
      )}
      {state?.success && (
        <p className="success">Subscribed!</p>
      )}
    </form>
  );
}`
        }}
        note="useActionState replaces the manual loading + result + error state pattern with a single hook."
      />

      {/* ------------------------------------------------------------------ */}
      <h3 style={h3Style}>useFormStatus &mdash; No More Prop Drilling for Forms</h3>

      <p style={pStyle}>
        A common pain point in React forms was passing <code>isSubmitting</code> state down
        to submit buttons and other child components. The <code>useFormStatus</code> hook
        reads the pending state of the nearest parent <code>&lt;form&gt;</code> without any
        props at all. It is a bit like how SvelteKit&apos;s <code>$page.form</code> and{' '}
        <code>enhance</code> give components access to form state without explicit wiring.
      </p>

      <CodeBlock
        filename="SubmitButton.tsx"
        language="tsx"
        code={`import { useFormStatus } from 'react-dom';

// This component can be used inside ANY form.
// It automatically reads the pending state of its
// nearest parent <form>.
function SubmitButton({ label = 'Submit' }: {
  label?: string;
}) {
  const { pending, data, method, action } =
    useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : label}
    </button>
  );
}

// Usage — no prop drilling needed:
function ContactForm() {
  return (
    <form action={submitContact}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      {/* SubmitButton reads form state automatically */}
      <SubmitButton label="Send Message" />
    </form>
  );
}`}
      />

      <p style={pStyle}>
        In SvelteKit, components inside a form enhanced with <code>use:enhance</code> can
        access submission state through the callback. React&apos;s <code>useFormStatus</code>{' '}
        inverts this &mdash; any child component can read the form&apos;s state without the
        form knowing about it. This is context-like behavior without an explicit context
        provider.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h3 style={h3Style}>useOptimistic &mdash; Instant UI Feedback</h3>

      <p style={pStyle}>
        Optimistic updates show the result of an action immediately, before the server
        confirms success. If the server rejects the update, the UI reverts. In Svelte,
        you would manually update a store and revert on error. React 19&apos;s{' '}
        <code>useOptimistic</code> hook provides a declarative way to do this.
      </p>

      <CodeComparison
        svelte={{
          filename: 'TodoList.svelte',
          language: 'svelte',
          code: `<script lang="ts">
  type Todo = { id: string; title: string };
  let todos = $state<Todo[]>([]);

  async function addTodo(title: string) {
    // Optimistic: add immediately
    const tempId = crypto.randomUUID();
    const optimistic = { id: tempId, title };
    todos = [...todos, optimistic];

    try {
      const saved = await api.createTodo(title);
      // Replace temp with real
      todos = todos.map(t =>
        t.id === tempId ? saved : t
      );
    } catch {
      // Revert on failure
      todos = todos.filter(t =>
        t.id !== tempId
      );
    }
  }
</script>

<ul>
  {#each todos as todo (todo.id)}
    <li>{todo.title}</li>
  {/each}
</ul>`
        }}
        react={{
          filename: 'TodoList.tsx',
          language: 'tsx',
          code: `import { useOptimistic, useActionState }
  from 'react';

type Todo = { id: string; title: string };

function TodoList({
  todos,
}: {
  todos: Todo[];
}) {
  const [optimisticTodos, addOptimistic] =
    useOptimistic(
      todos,
      (state, newTodo: Todo) =>
        [...state, newTodo]
    );

  async function addTodo(
    _prev: null,
    formData: FormData
  ) {
    const title =
      formData.get('title') as string;
    addOptimistic({
      id: 'temp-' + Date.now(),
      title,
    });
    await api.createTodo(title);
    return null;
  }

  const [, action] =
    useActionState(addTodo, null);

  return (
    <>
      <form action={action}>
        <input name="title" required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  );
}`
        }}
        note="React's useOptimistic automatically reverts to the real state when the action completes. No manual error handling needed."
      />

      <CodeBlock
        filename="OptimisticLike.tsx"
        language="tsx"
        code={`import { useOptimistic } from 'react';

// A common pattern: optimistic like button
function LikeButton({
  liked,
  onToggle,
}: {
  liked: boolean;
  onToggle: () => Promise<void>;
}) {
  const [optimisticLiked, setOptimisticLiked] =
    useOptimistic(liked);

  async function handleClick() {
    setOptimisticLiked(!optimisticLiked);
    await onToggle();
  }

  return (
    <form action={handleClick}>
      <button type="submit">
        {optimisticLiked ? '❤️' : '🤍'}
      </button>
    </form>
  );
}`}
      />

      {/* ------------------------------------------------------------------ */}
      <h3 style={h3Style}>The use Hook &mdash; Reading Promises in Render</h3>

      <p style={pStyle}>
        The <code>use</code> hook lets you read a promise or context directly during
        render. When combined with <code>&lt;Suspense&gt;</code>, it provides a clean way
        to handle async data without <code>useEffect</code> or loading state booleans.
        If you know Svelte&apos;s <code>&#123;#await promise&#125;</code> block, this is
        React&apos;s answer to the same problem.
      </p>

      <CodeComparison
        svelte={{
          filename: 'UserProfile.svelte',
          language: 'svelte',
          code: `<script lang="ts">
  let { userId } = $props<{ userId: string }>();

  const userPromise = fetchUser(userId);
</script>

{#await userPromise}
  <p>Loading user...</p>
{:then user}
  <div class="profile">
    <h2>{user.name}</h2>
    <p>{user.email}</p>
    <p>Joined {user.joinDate}</p>
  </div>
{:catch error}
  <p class="error">
    Failed to load: {error.message}
  </p>
{/await}`
        }}
        react={{
          filename: 'UserProfile.tsx',
          language: 'tsx',
          code: `import { use, Suspense } from 'react';
import { ErrorBoundary } from
  'react-error-boundary';

function UserData({
  userPromise,
}: {
  userPromise: Promise<User>;
}) {
  // use() suspends until resolved
  const user = use(userPromise);

  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Joined {user.joinDate}</p>
    </div>
  );
}

function UserProfile({
  userId,
}: {
  userId: string;
}) {
  const userPromise = fetchUser(userId);

  return (
    <ErrorBoundary fallback={
      <p className="error">
        Failed to load user
      </p>
    }>
      <Suspense fallback={
        <p>Loading user...</p>
      }>
        <UserData
          userPromise={userPromise}
        />
      </Suspense>
    </ErrorBoundary>
  );
}`
        }}
        note="Svelte's {#await} and React's use() + Suspense solve the same problem: rendering async data declaratively."
      />

      <Callout type="insight" title="Svelte Was Here First">
        Svelte&apos;s <code>&#123;#await&#125;</code> block has been doing this from day one
        &mdash; reading promises directly in templates with built-in loading and error
        states. React&apos;s <code>use()</code> hook is the React-idiomatic version of the
        same concept, wrapping the loading state in <code>&lt;Suspense&gt;</code> and errors
        in <code>&lt;ErrorBoundary&gt;</code>.
      </Callout>

      {/* ================================================================== */}
      <h2 style={h2Style}>The React Compiler</h2>

      <p style={pStyle}>
        The React Compiler is arguably the most important change in React&apos;s recent
        history. It went stable at React Conf in October 2025 and is now production-ready.
        The compiler analyzes your React code at build time and automatically inserts
        memoization &mdash; eliminating the need for <code>useMemo</code>,{' '}
        <code>useCallback</code>, and <code>React.memo</code> in the vast majority of
        cases.
      </p>

      <p style={pStyle}>
        For years, one of the biggest complaints about React was the memoization tax:
        developers had to manually wrap expensive computations in <code>useMemo</code>,
        wrap callback functions in <code>useCallback</code>, and wrap entire components in{' '}
        <code>React.memo</code> to prevent unnecessary re-renders. This was boilerplate
        that Svelte developers never had to think about because Svelte&apos;s compiler
        handled reactivity at build time.
      </p>

      <CodeComparison
        svelte={{
          filename: 'FilteredList.svelte',
          language: 'svelte',
          code: `<script lang="ts">
  let { items } = $props<{
    items: Item[];
  }>();

  let search = $state('');

  // Svelte's compiler optimizes this
  // automatically — no memoization needed
  let filtered = $derived(
    items.filter(item =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  function handleSelect(item: Item) {
    console.log('Selected:', item.name);
  }
</script>

<input bind:value={search} />
<ul>
  {#each filtered as item (item.id)}
    <li>
      <button onclick={() => handleSelect(item)}>
        {item.name}
      </button>
    </li>
  {/each}
</ul>`
        }}
        react={{
          filename: 'FilteredList.tsx (before compiler)',
          language: 'tsx',
          highlight: [7, 12, 18],
          code: `import { useState, useMemo, useCallback, memo }
  from 'react';

function FilteredList({ items }: {
  items: Item[];
}) {
  const [search, setSearch] = useState('');

  // Manual memoization required
  const filtered = useMemo(
    () => items.filter(item =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    ),
    [items, search]
  );

  // Must wrap in useCallback to prevent
  // child re-renders
  const handleSelect = useCallback(
    (item: Item) => {
      console.log('Selected:', item.name);
    },
    []
  );

  return (
    <>
      <input
        value={search}
        onChange={e =>
          setSearch(e.target.value)
        }
      />
      <ul>
        {filtered.map(item => (
          <ItemRow
            key={item.id}
            item={item}
            onSelect={handleSelect}
          />
        ))}
      </ul>
    </>
  );
}

// Must wrap in memo to skip re-renders
const ItemRow = memo(function ItemRow({
  item,
  onSelect,
}: {
  item: Item;
  onSelect: (item: Item) => void;
}) {
  return (
    <li>
      <button onClick={() => onSelect(item)}>
        {item.name}
      </button>
    </li>
  );
});`
        }}
        note="Before the compiler, React required manual memoization at three levels: values, callbacks, and components."
      />

      <CodeBlock
        filename="FilteredList.tsx (with compiler)"
        language="tsx"
        code={`// With the React Compiler — SAME behavior,
// zero memoization boilerplate.
// The compiler inserts useMemo/useCallback/memo
// automatically at build time.

function FilteredList({ items }: {
  items: Item[];
}) {
  const [search, setSearch] = useState('');

  // No useMemo needed — compiler handles it
  const filtered = items.filter(item =>
    item.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // No useCallback needed — compiler handles it
  function handleSelect(item: Item) {
    console.log('Selected:', item.name);
  }

  return (
    <>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul>
        {filtered.map(item => (
          <ItemRow
            key={item.id}
            item={item}
            onSelect={handleSelect}
          />
        ))}
      </ul>
    </>
  );
}

// No React.memo needed — compiler handles it
function ItemRow({
  item,
  onSelect,
}: {
  item: Item;
  onSelect: (item: Item) => void;
}) {
  return (
    <li>
      <button onClick={() => onSelect(item)}>
        {item.name}
      </button>
    </li>
  );
}`}
      />

      <Callout type="insight" title="Compiler-First Architecture">
        The React Compiler essentially does what Svelte&apos;s compiler has always done
        &mdash; optimize reactivity at build time rather than runtime. React is converging
        toward compiler-first architecture. The difference is that Svelte compiles away the
        framework entirely, while React&apos;s compiler optimizes within the existing
        virtual DOM model. But the philosophy is the same: let machines handle performance
        so developers can write straightforward code.
      </Callout>

      <ComparisonTable
        caption="What the React Compiler eliminates"
        headers={['Optimization', 'Before Compiler', 'With Compiler']}
        rows={[
          ['Memoize computed values', 'Manual useMemo with dependency array', 'Automatic — write plain expressions'],
          ['Stable callback references', 'Manual useCallback with dependency array', 'Automatic — write plain functions'],
          ['Skip component re-renders', 'Manual React.memo wrapper', 'Automatic — compiler detects pure components'],
          ['Dependency array correctness', 'Developer must track manually (error-prone)', 'Compiler determines dependencies statically'],
          ['Bundle size impact', 'Extra wrapper code for each memoization', 'Compiler output is minimal and optimized'],
        ]}
      />

      <Callout type="info" title="Developer Excitement">
        In recent surveys, 62% of developers say the React Compiler is what excites them
        most about React&apos;s future. It addresses the single biggest ergonomic complaint
        about React &mdash; the memoization tax &mdash; and brings React closer to
        Svelte&apos;s developer experience.
      </Callout>

      {/* ================================================================== */}
      <h2 style={h2Style}>Server Components &mdash; The Architectural Shift</h2>

      <p style={pStyle}>
        React Server Components (RSCs) are a fundamentally new way to think about where
        React code runs. In the RSC model, components are <strong>server-rendered by
        default</strong>. They run on the server, have direct access to databases and file
        systems, and their code never ships to the browser. Only components that need
        interactivity (event handlers, state, effects) are marked with{' '}
        <code>&quot;use client&quot;</code> and sent to the browser.
      </p>

      <p style={pStyle}>
        If you are coming from SvelteKit, the mental model has similarities. SvelteKit
        separates server code into <code>+page.server.ts</code> (or <code>+server.ts</code>)
        and client code into <code>+page.svelte</code>. The difference is that SvelteKit
        uses file conventions to draw the boundary, while RSCs use a directive at the
        component level.
      </p>

      <CodeComparison
        svelte={{
          filename: '+page.server.ts / +page.svelte',
          language: 'svelte',
          code: `// +page.server.ts — runs only on server
import { db } from '$lib/server/db';

export async function load() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return { posts };
}

<!-- +page.svelte — runs on client -->
<script lang="ts">
  let { data } = $props();
</script>

<h1>Recent Posts</h1>
<ul>
  {#each data.posts as post (post.id)}
    <li>
      <a href="/posts/{post.id}">
        {post.title}
      </a>
      <span>{post.author}</span>
    </li>
  {/each}
</ul>`
        }}
        react={{
          filename: 'PostList.tsx (Server Component)',
          language: 'tsx',
          code: `// Server Component — runs ONLY on server.
// No "use client" directive means this is
// a server component by default.
import { db } from '@/lib/db';

export default async function PostList() {
  // Direct database access — no API layer,
  // no useEffect, no loading states
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <>
      <h1>Recent Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={\`/posts/\${post.id}\`}>
              {post.title}
            </a>
            <span>{post.author}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

// This component's JavaScript is NEVER
// sent to the browser. Zero bundle impact.`
        }}
        note="SvelteKit uses file conventions (+page.server.ts) to separate server/client. RSCs use component-level directives."
      />

      <CodeBlock
        filename="InteractivePost.tsx"
        language="tsx"
        code={`// A practical example: server component
// with a client component child.

// PostPage.tsx — Server Component (default)
import { db } from '@/lib/db';
import { LikeButton } from './LikeButton';

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await db.post.findUnique({
    where: { id: params.id },
  });

  if (!post) return <p>Not found</p>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Client component for interactivity */}
      <LikeButton
        postId={post.id}
        initialLikes={post.likes}
      />
    </article>
  );
}

// LikeButton.tsx — Client Component
'use client';
import { useState } from 'react';

export function LikeButton({
  postId,
  initialLikes,
}: {
  postId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] =
    useState(initialLikes);

  async function handleLike() {
    setLikes(prev => prev + 1);
    await fetch(\`/api/posts/\${postId}/like\`, {
      method: 'POST',
    });
  }

  return (
    <button onClick={handleLike}>
      Like ({likes})
    </button>
  );
}`}
      />

      <ComparisonTable
        caption="SvelteKit vs React Server Components data model"
        headers={['Aspect', 'SvelteKit', 'React Server Components']}
        rows={[
          ['Server boundary', 'File convention (+page.server.ts)', 'Component directive ("use client")'],
          ['Data loading', 'load() functions return data to page', 'Components are async — await directly'],
          ['Serialization', 'Data must be serializable (JSON)', 'React serializes component trees (RSC payload)'],
          ['Client hydration', 'Full page hydration', 'Selective — only "use client" components hydrate'],
          ['Bundle impact', 'Server code excluded by file convention', 'Server component code excluded automatically'],
          ['Nested data', 'Parent layouts load data for children', 'Each server component can fetch independently'],
        ]}
      />

      <Callout type="gotcha" title="The Mental Model Takes Time">
        Server Components are polarizing. About 45% of new projects use them, but the
        mental model of server/client boundaries takes getting used to &mdash; especially
        if you are coming from Svelte where the server/client split is handled by
        SvelteKit&apos;s <code>load</code>/<code>+page</code> conventions. The key
        difference is granularity: SvelteKit draws the boundary at the page level, while
        RSCs draw it at the component level. This gives RSCs more flexibility but demands
        more discipline in deciding what runs where.
      </Callout>

      {/* ================================================================== */}
      <h2 style={h2Style}>The Meta-Framework Landscape</h2>

      <p style={pStyle}>
        React, like Svelte, is a UI library &mdash; not a framework. To build a real
        application, you need routing, server rendering, data loading, and build tooling.
        In the Svelte world, SvelteKit is the obvious (and essentially only) answer. In
        React, there are several options, each with different philosophies.
      </p>

      <h3 style={h3Style}>Next.js</h3>

      <p style={pStyle}>
        Next.js is the dominant React meta-framework, maintained by Vercel. Its App Router
        (introduced in Next.js 13, now mature) uses React Server Components and file-based
        routing. If you are coming from SvelteKit, Next.js App Router is the closest
        equivalent &mdash; it provides the same batteries-included experience with SSR,
        SSG, API routes, and middleware.
      </p>

      <h3 style={h3Style}>React Router v7</h3>

      <p style={pStyle}>
        React Router v7 absorbed the best features from Remix (which pivoted away from
        React in 2025, moving to a Preact fork). React Router v7 now includes loaders,
        actions, nested routing, and server-side rendering &mdash; making it a full
        meta-framework for React, not just a client-side router. For developers who want
        Remix&apos;s web-standards-first approach, React Router v7 is the continuation.
      </p>

      <h3 style={h3Style}>Astro</h3>

      <p style={pStyle}>
        Astro takes a different approach: islands architecture. It generates static HTML
        by default and only ships JavaScript for interactive &ldquo;islands&rdquo; &mdash;
        which can be React components, Svelte components, or anything else. If your site
        is content-heavy with some interactivity, Astro is an excellent choice.
      </p>

      <h3 style={h3Style}>Vite as the SPA Default</h3>

      <p style={pStyle}>
        Create React App was officially sunset. Vite is now the standard tool for building
        React SPAs. If you do not need server-side rendering or file-based routing, a
        Vite + React setup is the simplest starting point &mdash; similar to how this
        tutorial itself is built.
      </p>

      <ComparisonTable
        caption="React meta-framework landscape"
        headers={['Framework', 'Approach', 'Status', 'Best For']}
        rows={[
          ['Next.js (App Router)', 'Full-stack RSC, file-based routing', 'Dominant, actively developed', 'Production apps, SSR/SSG, API routes'],
          ['React Router v7', 'Loaders/actions, nested routing', 'Stable, absorbed Remix features', 'Web-standards apps, migration from Remix'],
          ['Astro', 'Islands architecture, multi-framework', 'Stable, growing adoption', 'Content sites with selective interactivity'],
          ['Vite + React', 'SPA, client-side only', 'Standard SPA toolchain', 'Dashboards, internal tools, prototypes'],
          ['Create React App', 'Legacy SPA scaffold', 'Officially sunset', 'Not recommended for new projects'],
        ]}
      />

      <Callout type="info" title="The SvelteKit Equivalent">
        If you are coming from SvelteKit, Next.js App Router is the closest equivalent. It
        has the same batteries-included philosophy: file-based routing, server-side
        rendering, API routes, middleware, and deployment optimizations. But for SPAs
        without server rendering, Vite + React Router v7 is the modern default &mdash;
        and the setup is nearly identical to a Vite + Svelte project.
      </Callout>

      {/* ================================================================== */}
      <h2 style={h2Style}>State Management Trends</h2>

      <p style={pStyle}>
        One of the biggest shifts in the React ecosystem is the simplification of state
        management. In the early days, Redux was essentially mandatory for any non-trivial
        app. Today, the landscape looks very different.
      </p>

      <p style={pStyle}>
        About 34% of React developers do not use any external state management library at
        all. They rely entirely on React&apos;s built-in hooks: <code>useState</code>,{' '}
        <code>useReducer</code>, and <code>useContext</code>. This was always technically
        possible, but the memoization overhead made it painful &mdash; without{' '}
        <code>useCallback</code> and <code>React.memo</code>, context-based state caused
        unnecessary re-renders throughout the component tree. The React Compiler removes
        this concern entirely.
      </p>

      <p style={pStyle}>
        When an external library is needed, the trend is toward simplicity. Zustand
        adoption is rising rapidly because it provides a minimal, hooks-based API with
        almost no boilerplate. Redux Toolkit remains a solid choice for large teams that
        need strict patterns, but its share in new projects is declining. Jotai and Valtio
        serve niche use cases &mdash; atomic state and proxy-based state, respectively.
      </p>

      <p style={pStyle}>
        The distinction between <strong>server state</strong> (data from APIs) and{' '}
        <strong>client state</strong> (UI state like modals, selections, form inputs) is
        now a settled concept. TanStack Query handles server state. Zustand or built-in
        hooks handle client state. Mixing the two &mdash; as Redux often encouraged &mdash;
        is considered an anti-pattern.
      </p>

      <Callout type="insight" title="Converging on Simplicity">
        The trend in React is converging toward Svelte&apos;s philosophy: do more with less.
        Built-in hooks are sufficient for most apps. The compiler handles performance. Server
        Components handle data fetching. The days of installing Redux, Redux Thunk, Redux
        Saga, Reselect, and Immutable.js for a todo app are over. Start simple, and add a
        library only when you feel specific pain.
      </Callout>

      {/* ================================================================== */}
      <h2 style={h2Style}>React vs Svelte: Convergence</h2>

      <p style={pStyle}>
        One of the most interesting stories in frontend development is the convergence of
        React and Svelte. Each framework has influenced the other, and the gap between
        them is narrower than ever.
      </p>

      <ComparisonTable
        caption="Ideas flowing between Svelte and React"
        headers={['Concept', 'Svelte (Pioneer)', 'React (Adopting)']}
        rows={[
          ['Compiler-first optimization', 'Core architecture since v1 (2016)', 'React Compiler (stable 2025)'],
          ['Signals / fine-grained reactivity', '$state runes in Svelte 5', 'TC39 Signals proposal (in progress)'],
          ['Server-side data loading', 'SvelteKit load functions', 'React Server Components'],
          ['Built-in form actions', 'SvelteKit form actions', 'React 19 Actions + useActionState'],
          ['No manual memoization', 'Never needed it', 'React Compiler eliminates it'],
          ['File-based routing', 'SvelteKit routes/', 'Next.js app/ (meta-framework level)'],
          ['Progressive enhancement', 'SvelteKit use:enhance', 'React Actions with form fallback'],
        ]}
      />

      <p style={pStyle}>
        The influence runs both ways. While React has adopted many ideas Svelte pioneered,
        Svelte 5 adopted React-like patterns in its own right. Svelte&apos;s runes
        (<code>$state</code>, <code>$derived</code>, <code>$effect</code>) replaced the
        implicit reactivity of <code>let</code> declarations with explicit, composable
        primitives &mdash; a design that is closer to React hooks than to Svelte 4&apos;s
        magic variables. Snippets replaced slots with a pattern closer to render props.
      </p>

      <p style={pStyle}>
        This convergence is healthy. Both ecosystems are borrowing what works and
        discarding what does not. The result is that the skills you learn in one framework
        transfer more easily to the other than at any point in history.
      </p>

      <Callout type="insight" title="The Beautiful Irony">
        The irony is beautiful: Svelte influenced React to adopt compilers and build-time
        optimization, while React influenced Svelte to adopt hooks-like composition (runes)
        and explicit reactivity. The old narrative of &ldquo;Svelte vs React&rdquo; is
        becoming &ldquo;Svelte and React, learning from each other.&rdquo; Both ecosystems
        are better for it.
      </Callout>

      {/* ================================================================== */}
      <h2 style={h2Style}>What&apos;s Coming Next</h2>

      <p style={pStyle}>
        The frontend landscape does not stand still. Several developments are shaping the
        future of both React and web development broadly.
      </p>

      <h3 style={h3Style}>TC39 Signals Proposal</h3>

      <p style={pStyle}>
        The TC39 Signals proposal aims to add a standard reactivity primitive to JavaScript
        itself. If adopted, it would give every framework &mdash; React, Svelte, Vue, Solid
        &mdash; a shared foundation for fine-grained reactivity. Svelte&apos;s runes and
        Solid&apos;s signals are direct ancestors of this proposal. React&apos;s relationship
        with signals is more complex (it would complement rather than replace hooks), but
        standardized signals would reduce the conceptual gap between frameworks even
        further.
      </p>

      <h3 style={h3Style}>React Compiler Improvements</h3>

      <p style={pStyle}>
        The React Compiler will continue to improve. Future versions will optimize more
        patterns, handle edge cases better, and potentially optimize across component
        boundaries. The compiler team is also exploring optimizations that go beyond
        memoization &mdash; such as automatically batching state updates and eliminating
        unnecessary DOM operations.
      </p>

      <h3 style={h3Style}>Server Functions and Streaming</h3>

      <p style={pStyle}>
        Server Functions (the generalization of Server Actions beyond forms) and streaming
        patterns are maturing rapidly. React&apos;s streaming SSR, combined with Suspense
        boundaries, allows pages to send HTML progressively &mdash; showing content as it
        becomes available rather than waiting for everything to load. SvelteKit has similar
        streaming capabilities, and both ecosystems are converging on the same patterns.
      </p>

      <h3 style={h3Style}>The React Foundation</h3>

      <p style={pStyle}>
        React is now governed by the React Foundation under the Linux Foundation, broadening
        its governance beyond any single company. This institutional backing signals
        long-term stability and ensures that React&apos;s direction reflects the needs of
        its broad community rather than a single corporate interest.
      </p>

      <h3 style={h3Style}>AI-Assisted Development</h3>

      <p style={pStyle}>
        AI-assisted development is becoming a standard workflow. Tools like Cursor, GitHub
        Copilot, and Claude Code generate React components, debug issues, and scaffold
        entire applications. React&apos;s massive ecosystem and documentation corpus make
        it particularly well-suited for AI assistance &mdash; models have seen more React
        code than any other framework. This practical advantage accelerates the learning
        curve and makes the React ecosystem more accessible than ever.
      </p>

      <Callout type="info" title="The Best Time to Learn React">
        The best time to learn React is now. React 19 is a mature, well-designed release.
        The compiler removes historical friction. Server Components solve the data problem.
        The meta-framework landscape has settled. And if you know Svelte, you will find
        that React is closer to Svelte than ever before. The concepts transfer. The
        patterns rhyme. The main adjustment is syntax and ecosystem conventions &mdash;
        not fundamental architecture.
      </Callout>

      {/* ================================================================== */}
      <h2 style={h2Style}>Closing Thoughts</h2>

      <p style={pStyle}>
        You have reached the end of this tutorial. Over the course of 33 chapters, you have
        learned how React thinks about components, state, effects, context, forms, routing,
        performance, TypeScript integration, the ecosystem, meta-frameworks, and now the
        evolution of the platform itself. Every concept was framed through the lens of what
        you already know from Svelte &mdash; because the fastest way to learn a new
        framework is to map it onto existing knowledge.
      </p>

      <p style={pStyle}>
        The React ecosystem&apos;s greatest strength is its adaptability. It has survived
        class components, mixins, higher-order components, render props, hooks, concurrent
        mode, and now server components. Each paradigm shift was met with skepticism, and
        each time React emerged stronger. This resilience is not accidental &mdash; it
        comes from React&apos;s willingness to evolve while maintaining backward
        compatibility. Your class components from 2015 still work in React 19.
      </p>

      <p style={pStyle}>
        Coming from Svelte, you bring a powerful perspective. You have seen what a
        compiler-first, batteries-included framework looks like. You know what good
        developer experience feels like. Apply that taste to your React work. Start simple.
        Use built-in hooks before reaching for libraries. Let the compiler handle
        performance. Write server components when you need server data. Reach for Zustand
        when <code>useContext</code> gets unwieldy. Reach for TanStack Query when your{' '}
        <code>useEffect</code> data fetching becomes a tangle. Let the pain guide the
        architecture, not blog posts or conference talks.
      </p>

      <p style={pStyle}>
        The gap between React and Svelte is smaller than it has ever been. The ideas flow
        both ways. And the skills you have built in both ecosystems make you a more
        versatile, more thoughtful developer. Build something great.
      </p>
    </ChapterLayout>
  );
}
