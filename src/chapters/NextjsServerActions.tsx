import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function NextjsServerActions() {
  return (
    <ChapterLayout id="nextjs-server-actions">
      <p style={pStyle}>
        Both SvelteKit and Next.js have converged on the same powerful idea: server-side form
        handling that works without JavaScript. SvelteKit calls them form actions. Next.js calls
        them Server Actions. The naming differs, the syntax differs, but the philosophy is
        identical: submit a form to the server, process it, return a result, and optionally
        revalidate cached data. Both frameworks support progressive enhancement, meaning the
        form works even if JavaScript fails to load.
      </p>

      <h2 style={h2Style}>
        Form Actions vs Server Actions
      </h2>

      <p style={pStyle}>
        In SvelteKit, you define form actions in <code>+page.server.ts</code> using the
        <code> actions</code> export. Each action is a named function that receives the request
        and returns data. In Next.js, Server Actions are async functions marked with the
        <code> "use server"</code> directive. They can be defined inline in Server Components
        or in separate files.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/routes/contact/+page.server.ts
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Validation
    if (!name || !email || !message) {
      return fail(400, {
        error: 'All fields are required',
        name,
        email,
        message,
      });
    }

    if (!email.includes('@')) {
      return fail(400, {
        error: 'Invalid email address',
        name,
        email,
        message,
      });
    }

    await db.message.create({
      data: { name, email, message },
    });

    return { success: true };
  },
};

// src/routes/contact/+page.svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<form method="POST" use:enhance>
  <input name="name" value={form?.name ?? ''} />
  <input name="email" value={form?.email ?? ''} />
  <textarea name="message">{form?.message ?? ''}</textarea>

  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}
  {#if form?.success}
    <p class="success">Message sent!</p>
  {/if}

  <button type="submit">Send</button>
</form>`,
          filename: 'SvelteKit form actions',
        }}
        react={{
          code: `// app/contact/actions.ts
"use server";

import { db } from '@/lib/database';

interface FormState {
  error?: string;
  success?: boolean;
  name?: string;
  email?: string;
  message?: string;
}

export async function submitContact(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Validation
  if (!name || !email || !message) {
    return {
      error: 'All fields are required',
      name,
      email,
      message,
    };
  }

  if (!email.includes('@')) {
    return {
      error: 'Invalid email address',
      name,
      email,
      message,
    };
  }

  await db.message.create({
    data: { name, email, message },
  });

  return { success: true };
}

// app/contact/page.tsx
"use client";
import { useActionState } from 'react';
import { submitContact } from './actions';

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    {}
  );

  return (
    <form action={formAction}>
      <input name="name" defaultValue={state.name ?? ''} />
      <input name="email" defaultValue={state.email ?? ''} />
      <textarea name="message"
        defaultValue={state.message ?? ''}
      />

      {state.error && (
        <p className="error">{state.error}</p>
      )}
      {state.success && (
        <p className="success">Message sent!</p>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}`,
          filename: 'Next.js Server Actions',
          highlight: [1, 2, 14, 15, 16, 17, 49, 50, 51, 53, 54, 55],
        }}
        note="SvelteKit defines actions as named exports in +page.server.ts and uses the enhance action for progressive enhancement. Next.js uses 'use server' functions and the useActionState hook (formerly useFormState). Both receive FormData and return state."
      />

      <h2 style={h2Style}>
        The "use server" Directive
      </h2>

      <p style={pStyle}>
        The <code>"use server"</code> directive in Next.js marks a function or file as containing
        server-only code. When you call a Server Action from the client, Next.js automatically
        creates an HTTP endpoint for it behind the scenes. The client sends a POST request with
        the form data, the server executes the function, and the result is returned. This is
        conceptually identical to how SvelteKit form actions work under the hood.
      </p>

      <h3 style={h3Style}>
        Inline vs File-Level "use server"
      </h3>

      <CodeBlock
        code={`// Option 1: File-level directive (recommended)
// app/actions.ts
"use server";

export async function createPost(formData: FormData) {
  // Everything in this file runs on the server
}

export async function deletePost(id: string) {
  // Also server-only
}

// Option 2: Inline in a Server Component
// app/page.tsx (Server Component — no "use client")
export default function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    // This function runs on the server
    // even though it is defined in a component file
    await db.post.create({
      data: { title: formData.get('title') as string },
    });
  }

  return (
    <form action={handleSubmit}>
      <input name="title" />
      <button type="submit">Create Post</button>
    </form>
  );
}

// Option 3: Call from a Client Component event handler
"use client";
import { createPost } from './actions';

function CreateButton() {
  async function handleClick() {
    // Server Action called from event handler
    await createPost(new FormData());
  }
  return <button onClick={handleClick}>Create</button>;
}`}
        language="tsx"
        filename="Server Action definition patterns"
      />

      <h2 style={h2Style}>
        Progressive Enhancement
      </h2>

      <p style={pStyle}>
        Both frameworks support forms that work without JavaScript. This is a core web platform
        feature: a <code>&lt;form&gt;</code> with <code>method="POST"</code> submits to the
        server using a full page navigation. Both frameworks enhance this baseline behavior with
        JavaScript to avoid full page reloads while preserving the no-JS fallback.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- SvelteKit progressive enhancement -->
<script>
  import { enhance } from '$app/forms';
</script>

<!-- Without use:enhance: full page reload on submit -->
<!-- With use:enhance: AJAX submission, no reload -->
<form method="POST" use:enhance>
  <input name="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>

<!-- Custom enhance behavior -->
<form method="POST" use:enhance={() => {
  // Before submission
  return async ({ result, update }) => {
    if (result.type === 'success') {
      // Custom success handling
      showToast('Subscribed!');
    }
    await update(); // Apply default behavior
  };
}}>
  <input name="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>`,
          filename: 'SvelteKit progressive enhancement',
        }}
        react={{
          code: `// Next.js progressive enhancement
// The form works with or without JavaScript

// Server Action
"use server";
export async function subscribe(formData: FormData) {
  const email = formData.get('email') as string;
  await addSubscriber(email);
}

// Page component
import { subscribe } from './actions';

// Simple form — works without JS
export default function Page() {
  return (
    <form action={subscribe}>
      <input name="email" type="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}

// Enhanced version with pending state
"use client";
import { useActionState } from 'react';
import { subscribe } from './actions';

export default function EnhancedPage() {
  const [state, formAction, isPending] = useActionState(
    subscribe,
    null
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}`,
          filename: 'Next.js progressive enhancement',
          highlight: [4, 5, 6, 7, 8, 17, 26, 30, 31, 32],
        }}
        note="Both frameworks support no-JS form submission out of the box. SvelteKit enhances forms with the use:enhance action directive. Next.js uses useActionState for enhanced client-side form state management with built-in pending detection."
      />

      <h2 style={h2Style}>
        Validation and Error Handling
      </h2>

      <p style={pStyle}>
        Robust form handling requires validation on both client and server. Both frameworks
        support returning validation errors from the server and displaying them in the UI.
        The pattern is nearly identical: validate the form data, return errors if invalid,
        process the data if valid.
      </p>

      <CodeComparison
        svelte={{
          code: `// +page.server.ts — validation
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  category: z.enum(['tech', 'design', 'business']),
});

export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = schema.safeParse(data);
    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        values: data,
      });
    }

    const post = await db.post.create({
      data: result.data,
    });

    throw redirect(303, \`/blog/\${post.slug}\`);
  },
};

// +page.svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<form method="POST" action="?/create" use:enhance>
  <label>
    Title
    <input name="title" value={form?.values?.title ?? ''} />
    {#if form?.errors?.title}
      <span class="error">{form.errors.title[0]}</span>
    {/if}
  </label>

  <button type="submit">Create Post</button>
</form>`,
          filename: 'SvelteKit validation',
        }}
        react={{
          code: `// app/blog/actions.ts
"use server";

import { z } from 'zod';
import { redirect } from 'next/navigation';

const schema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  category: z.enum(['tech', 'design', 'business']),
});

interface CreatePostState {
  errors?: Record<string, string[]>;
  values?: Record<string, string>;
}

export async function createPost(
  prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const data = Object.fromEntries(formData);

  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: data as Record<string, string>,
    };
  }

  const post = await db.post.create({
    data: result.data,
  });

  redirect(\`/blog/\${post.slug}\`);
}

// app/blog/create/page.tsx
"use client";
import { useActionState } from 'react';
import { createPost } from '../actions';

export default function CreatePostPage() {
  const [state, formAction, isPending] = useActionState(
    createPost,
    {}
  );

  return (
    <form action={formAction}>
      <label>
        Title
        <input
          name="title"
          defaultValue={state.values?.title ?? ''}
        />
        {state.errors?.title && (
          <span className="error">
            {state.errors.title[0]}
          </span>
        )}
      </label>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}`,
          filename: 'Next.js validation',
          highlight: [1, 2, 18, 19, 20, 21, 41, 42, 45, 46, 47],
        }}
        note="The validation pattern is essentially identical: parse with Zod (or similar), return field errors on failure, redirect on success. SvelteKit uses fail() to set the HTTP status. Next.js returns the error state directly. Both repopulate the form with submitted values."
      />

      <h2 style={h2Style}>
        Revalidation After Mutation
      </h2>

      <p style={pStyle}>
        After a successful form submission that changes data, you need to update the UI to
        reflect the new state. Both frameworks provide mechanisms for this: SvelteKit
        automatically revalidates the page's load function, and Next.js provides explicit
        revalidation functions.
      </p>

      <CodeComparison
        svelte={{
          code: `// SvelteKit auto-revalidation
// After a form action completes successfully,
// SvelteKit automatically re-runs the load function
// for the current page. No manual revalidation needed.

// +page.server.ts
export const actions = {
  toggleTodo: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    await db.todo.update({
      where: { id },
      data: { done: { set: true } },
    });
    // Load function re-runs automatically!
    // The page gets fresh data without manual work.
  },
};

// For cross-page invalidation:
// In +page.svelte
<script>
  import { invalidateAll, invalidate } from '$app/navigation';

  // Invalidate all load functions
  await invalidateAll();

  // Invalidate specific dependencies
  await invalidate('app:todos');
  await invalidate('/api/todos');
</script>`,
          filename: 'SvelteKit revalidation',
        }}
        react={{
          code: `// Next.js explicit revalidation
"use server";

import {
  revalidatePath,
  revalidateTag,
} from 'next/cache';

export async function toggleTodo(formData: FormData) {
  const id = formData.get('id') as string;
  await db.todo.update({
    where: { id },
    data: { done: { set: true } },
  });

  // Must explicitly revalidate!
  // Option 1: Revalidate a specific path
  revalidatePath('/todos');

  // Option 2: Revalidate by cache tag
  revalidateTag('todos');

  // Option 3: Revalidate the current page
  revalidatePath('/todos', 'page');

  // Option 4: Revalidate an entire layout segment
  revalidatePath('/dashboard', 'layout');
}

// In a Client Component using useRouter:
"use client";
import { useRouter } from 'next/navigation';

function TodoItem({ todo }) {
  const router = useRouter();

  async function handleToggle() {
    await toggleTodo(new FormData(/* ... */));
    // Also refresh client-side cache:
    router.refresh();
  }

  return (
    <button onClick={handleToggle}>
      {todo.done ? 'Undo' : 'Complete'}
    </button>
  );
}`,
          filename: 'Next.js revalidation',
          highlight: [3, 4, 5, 6, 17, 18, 20, 21, 23, 24, 38, 39],
        }}
        note="SvelteKit automatically re-runs load functions after form action completion. Next.js requires explicit revalidation calls. This is a trade-off: SvelteKit's approach is simpler, Next.js's approach gives you more control over what gets revalidated."
      />

      <h2 style={h2Style}>
        Optimistic Updates
      </h2>

      <p style={pStyle}>
        Both frameworks support optimistic UI updates — showing the expected result immediately
        before the server confirms it. This makes the app feel faster because the UI responds
        instantly. If the server operation fails, the optimistic state is rolled back.
      </p>

      <CodeBlock
        code={`// Next.js optimistic updates with useOptimistic
"use client";
import { useOptimistic } from 'react';
import { toggleTodoAction } from './actions';

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, toggledId: string) =>
      state.map(todo =>
        todo.id === toggledId
          ? { ...todo, done: !todo.done }
          : todo
      )
  );

  async function handleToggle(id: string) {
    // Update UI immediately (optimistic)
    addOptimistic(id);
    // Then persist to server
    await toggleTodoAction(id);
  }

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id}>
          <button onClick={() => handleToggle(todo.id)}>
            {todo.done ? 'Undo' : 'Done'}
          </button>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// SvelteKit equivalent uses enhance:
// <form method="POST" use:enhance={() => {
//   // Optimistically update local state
//   todo.done = !todo.done;
//   return async ({ result, update }) => {
//     if (result.type === 'failure') {
//       // Rollback on failure
//       todo.done = !todo.done;
//     }
//     await update();
//   };
// }}>`}
        language="tsx"
        filename="Optimistic updates"
      />

      <Callout type="insight" title="Convergent Design">
        Both frameworks converge on the same idea: server-side form handling with progressive
        enhancement. The syntax differs, the philosophy is identical. Submit a form, validate
        on the server, return errors or redirect, and optionally revalidate cached data. If you
        understand SvelteKit form actions, you already understand Next.js Server Actions. The
        main difference is that Next.js Server Actions can be called from any Client Component,
        not just forms — making them more versatile but also blurring the line between form
        actions and general RPC calls.
      </Callout>

      <h2 style={h2Style}>
        Named Actions vs Multiple Server Actions
      </h2>

      <p style={pStyle}>
        SvelteKit supports named actions: multiple actions in the same <code>+page.server.ts</code>
        file, selected by the form's <code>action</code> attribute with a query parameter.
        Next.js does not have this convention — you simply define separate Server Action functions
        and pass the appropriate one to each form.
      </p>

      <CodeComparison
        svelte={{
          code: `// SvelteKit named actions
// +page.server.ts
export const actions = {
  login: async ({ request }) => {
    const data = await request.formData();
    // Handle login
  },
  register: async ({ request }) => {
    const data = await request.formData();
    // Handle registration
  },
  resetPassword: async ({ request }) => {
    const data = await request.formData();
    // Handle password reset
  },
};

// +page.svelte — select action via URL
<form method="POST" action="?/login">
  <!-- Login form fields -->
</form>

<form method="POST" action="?/register">
  <!-- Registration form fields -->
</form>

<form method="POST" action="?/resetPassword">
  <!-- Reset password form fields -->
</form>`,
          filename: 'SvelteKit named actions',
        }}
        react={{
          code: `// Next.js — separate Server Action functions
// app/auth/actions.ts
"use server";

export async function login(
  prev: any, formData: FormData
) {
  // Handle login
}

export async function register(
  prev: any, formData: FormData
) {
  // Handle registration
}

export async function resetPassword(
  prev: any, formData: FormData
) {
  // Handle password reset
}

// app/auth/page.tsx
"use client";
import { useActionState } from 'react';
import { login, register, resetPassword } from './actions';

export default function AuthPage() {
  const [loginState, loginAction] = useActionState(login, {});
  const [regState, regAction] = useActionState(register, {});
  const [resetState, resetAction] = useActionState(
    resetPassword,
    {}
  );

  return (
    <>
      <form action={loginAction}>
        {/* Login form fields */}
      </form>
      <form action={regAction}>
        {/* Registration form fields */}
      </form>
      <form action={resetAction}>
        {/* Reset password form fields */}
      </form>
    </>
  );
}`,
          filename: 'Next.js multiple actions',
          highlight: [1, 2, 24, 25, 29, 30, 31, 32, 33],
        }}
        note="SvelteKit uses named actions selected by action='?/name'. Next.js simply defines separate functions. Both achieve the same result — multiple server-side handlers for different forms on the same page."
      />

      <h2 style={h2Style}>
        Server Actions and Forms Comparison
      </h2>

      <ComparisonTable
        caption="Server Actions: SvelteKit vs Next.js"
        headers={['Feature', 'SvelteKit', 'Next.js']}
        columnFormat={['prose', 'prose', 'prose']}
        rows={[
          ['Definition', 'actions export in +page.server.ts', '"use server" functions'],
          ['Named actions', 'action="?/name" convention', 'Separate function per action'],
          ['Progressive enhancement', 'use:enhance directive', 'Native form action + useActionState'],
          ['Pending state', 'use:enhance callback', 'useActionState isPending'],
          ['Error handling', 'fail(status, data)', 'Return error state object'],
          ['Redirect after success', 'throw redirect(303, url)', 'redirect(url) from next/navigation'],
          ['Revalidation', 'Automatic (re-runs load)', 'Manual (revalidatePath/Tag)'],
          ['Optimistic updates', 'use:enhance callback', 'useOptimistic hook'],
          ['Non-form invocation', 'Not supported (forms only)', 'Callable from any event handler'],
          ['File-level scope', '+page.server.ts per route', 'Any file with "use server"'],
          ['Type safety', 'Auto-generated ActionData', 'Manual interface definition'],
          ['Form data access', 'request.formData()', 'formData parameter'],
        ]}
      />

      <p style={pStyle}>
        Server Actions are one of the areas where SvelteKit and Next.js are most philosophically
        aligned. Both frameworks recognized that the web platform's <code>&lt;form&gt;</code>
        element is the right primitive for mutations, and both built server-side handlers that
        enhance native forms with modern capabilities. The main practical difference is that
        Next.js Server Actions are more flexible — they can be called from any event handler,
        not just form submissions — making them function like a lightweight RPC layer in addition
        to a form handler. In the next chapter, we will explore middleware and API routes.
      </p>
    </ChapterLayout>
  );
}
