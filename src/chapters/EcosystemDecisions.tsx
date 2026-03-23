import { ChapterLayout } from '../components/ChapterLayout';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function EcosystemDecisions() {
  return (
    <ChapterLayout id="ecosystem-decisions">
      <p style={pStyle}>
        The previous chapters explored the major categories of the React ecosystem: state
        management, data fetching, forms, routing, UI components, and animation. Each library
        was examined on its own merits. Now it is time to zoom out and answer the practical
        question: given a specific project, which libraries do you actually install?
      </p>

      <p style={pStyle}>
        The answer depends on project complexity. Not every app needs Zustand. Not every form
        needs React Hook Form. Not every list needs Framer Motion. The biggest mistake Svelte
        developers make when moving to React is installing everything on day one because a blog
        post said it was &ldquo;best practice.&rdquo; The right approach is to start minimal and add
        libraries only when you feel specific pain that a library solves.
      </p>

      <p style={pStyle}>
        Here are three project archetypes with concrete, opinionated stacks for each.
      </p>

      {/* ================================================================== */}
      <h3 style={h3Style}>Simple CRUD App</h3>

      <p style={pStyle}>
        A small internal tool, a personal project, a prototype, or any app with a handful of
        pages and straightforward data requirements. Think: a todo app, an admin panel for a
        small database, a documentation site with some interactive elements.
      </p>

      <ComparisonTable
        caption="Recommended stack for a simple CRUD app"
        headers={['Concern', 'Solution', 'Why']}
        columnFormat={['prose', 'code', 'prose']}
        rows={[
          ['Client state', 'useState + useReducer', 'Built-in, zero dependencies, sufficient for local state'],
          ['Server data', 'fetch + useEffect (or SWR)', 'SWR adds caching with minimal API surface'],
          ['Routing', 'React Router', 'Standard choice, simple API for few routes'],
          ['Forms', 'Controlled components (useState)', 'Manageable for 1-3 forms with few fields'],
          ['Animation', 'CSS transitions', 'Zero bundle cost for simple enter/hover effects'],
          ['Styling', 'CSS Modules or Tailwind', 'Scoped styles without runtime overhead'],
        ]}
      />

      <Callout type="info" title="Start With Nothing Extra">
        Do not install libraries speculatively. Start with React&apos;s built-ins:{' '}
        <code>useState</code>, <code>useReducer</code>, <code>useContext</code>, and{' '}
        <code>useEffect</code>. Add a library when you feel specific pain &mdash; when your{' '}
        <code>useEffect</code> data fetching becomes a mess of loading states, or when your
        form validation logic is duplicated across five components. The pain tells you which
        library to reach for. Without the pain, you are adding complexity you do not need.
      </Callout>

      <CodeBlock
        filename="SimpleCrudApp.tsx"
        language="tsx"
        code={`// A simple CRUD app needs surprisingly few dependencies.
// This entire component uses only React built-ins.

import { useState, useEffect } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
}

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        setContacts(data);
        setIsLoading(false);
      });
  }, []);

  const addContact = async () => {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, email: newEmail }),
    });
    const contact = await res.json();
    setContacts(prev => [...prev, contact]);
    setNewName('');
    setNewEmail('');
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <ul>
        {contacts.map(c => (
          <li key={c.id}>{c.name} ({c.email})</li>
        ))}
      </ul>
      <input
        value={newName}
        onChange={e => setNewName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={newEmail}
        onChange={e => setNewEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={addContact}>Add</button>
    </div>
  );
}`}
      />

      {/* ================================================================== */}
      <h3 style={h3Style}>Medium SaaS Application</h3>

      <p style={pStyle}>
        A multi-page product with authentication, dashboards, settings, real-time updates, and
        moderate complexity. Think: a project management tool, an analytics dashboard, an
        e-commerce storefront. This is the sweet spot where most production React applications
        live, and where the ecosystem libraries earn their keep.
      </p>

      <ComparisonTable
        caption="Recommended stack for a medium SaaS application"
        headers={['Concern', 'Solution', 'Why']}
        columnFormat={['prose', 'code', 'prose']}
        rows={[
          ['Client state', 'Zustand', 'Minimal API, no boilerplate, granular subscriptions'],
          ['Server data', 'TanStack Query', 'Caching, background refetch, optimistic updates, devtools'],
          ['Routing', 'React Router or TanStack Router', 'TanStack Router adds type-safe params and search params'],
          ['Forms', 'React Hook Form + Zod', 'Uncontrolled for performance, schema validation, great DX'],
          ['Animation', 'Framer Motion (key interactions)', 'Layout animations, exit transitions for modals/toasts'],
          ['Components', 'shadcn/ui (Radix + Tailwind)', 'Accessible primitives, copy-paste ownership, customizable'],
        ]}
      />

      <p style={pStyle}>
        This stack represents the current consensus among experienced React developers. Each
        library is best-in-class for its category, they compose well together, and none of them
        overlap. Zustand handles what lives in the browser. TanStack Query handles what comes
        from the server. React Hook Form handles user input. Framer Motion handles movement.
        Each solves one problem well.
      </p>

      <CodeBlock
        filename="SaasArchitectureExample.tsx"
        language="tsx"
        code={`// How these libraries compose in a real feature:
// A dashboard page that fetches data, manages UI state,
// and animates elements.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '../store'; // Zustand
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'archived';
}

export function ProjectDashboard() {
  const sidebarOpen = useStore(s => s.sidebarOpen);
  const queryClient = useQueryClient();

  // Server state via TanStack Query
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetch('/api/projects').then(r => r.json()) as Promise<Project[]>,
  });

  // Mutation with optimistic update
  const archiveMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(\`/api/projects/\${id}/archive\`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  if (isLoading) return <p>Loading projects...</p>;

  return (
    <div style={{ display: 'flex' }}>
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ overflow: 'hidden' }}
      >
        {/* Sidebar content */}
      </motion.aside>

      <main style={{ flex: 1, padding: '2rem' }}>
        <AnimatePresence>
          {projects?.map(project => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h3>{project.name}</h3>
              <button onClick={() => archiveMutation.mutate(project.id)}>
                Archive
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
}`}
      />

      {/* ================================================================== */}
      <h3 style={h3Style}>Large Enterprise Application</h3>

      <p style={pStyle}>
        A large application maintained by multiple teams, with strict conventions, extensive
        test coverage requirements, and a long maintenance horizon. Think: a banking dashboard,
        a multi-tenant platform, an enterprise resource planner. At this scale, the priority
        shifts from developer convenience to team-wide consistency and predictability.
      </p>

      <ComparisonTable
        caption="Recommended stack for a large enterprise application"
        headers={['Concern', 'Solution', 'Why']}
        columnFormat={['prose', 'code', 'prose']}
        rows={[
          ['Client state', 'Redux Toolkit or MobX', 'Redux for flux-style conventions; MobX for rich domain models with computed properties and reactions'],
          ['Server data', 'TanStack Query + tRPC', 'End-to-end type safety from API to UI, automatic cache management'],
          ['Routing', 'TanStack Router', 'Type-safe params, search params, loaders, preloading'],
          ['Forms', 'React Hook Form + Zod', 'Performance at scale, composable schemas, field-level validation'],
          ['Animation', 'Framer Motion', 'Consistent animation language across teams and features'],
          ['Components', 'Radix UI or custom headless system', 'Full accessibility compliance, design system foundation'],
          ['Testing', 'Vitest + React Testing Library + Playwright', 'Unit, integration, and end-to-end coverage'],
        ]}
      />

      <Callout type="warning" title="Enterprise Does Not Mean Use Everything">
        Enterprise does not mean &ldquo;install every library.&rdquo; It means &ldquo;use tools that enforce
        conventions across large teams.&rdquo; Redux Toolkit&apos;s opinionated structure &mdash; slices,
        actions, reducers, middleware &mdash; is a <em>feature</em> at scale because it forces every
        developer to structure state changes the same way. A team of forty developers needs
        that consistency far more than it needs the minimal API of Zustand. Pick tools that
        make the codebase predictable, not tools that make individual features fast to build.
      </Callout>

      <CodeBlock
        filename="EnterpriseSliceExample.tsx"
        language="tsx"
        code={`// Redux Toolkit slice -- enforced structure for team consistency
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

interface UsersState {
  entities: Record<string, User>;
  ids: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  entities: {},
  ids: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch');
      return (await response.json()) as User[];
    } catch (err) {
      return rejectWithValue('Failed to load users');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userUpdated(state, action: PayloadAction<User>) {
      const user = action.payload;
      state.entities[user.id] = user;
    },
    userRemoved(state, action: PayloadAction<string>) {
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter(uid => uid !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        action.payload.forEach(user => {
          state.entities[user.id] = user;
          if (!state.ids.includes(user.id)) {
            state.ids.push(user.id);
          }
        });
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { userUpdated, userRemoved } = usersSlice.actions;
export default usersSlice.reducer;`}
      />

      {/* ================================================================== */}
      <h2 style={h2Style}>The Migration Path from Svelte</h2>

      <p style={pStyle}>
        If you have been building with Svelte and SvelteKit, every feature you relied on has a
        React ecosystem equivalent. The difference is that Svelte bundles these as language
        features and framework conventions, while React requires you to choose and install
        separate libraries. This table maps every major Svelte built-in to its React counterpart.
      </p>

      <ComparisonTable
        caption="Mapping Svelte built-ins to React ecosystem equivalents"
        headers={['Svelte Built-in', 'React Equivalent', 'Notes']}
        columnFormat={['code', 'code', 'prose']}
        rows={[
          ['$state / $derived', 'useState / useMemo', 'Built-in React primitives; Zustand or Jotai for shared state'],
          ['writable() / derived()', 'Zustand, Jotai, or MobX', 'Zustand/Jotai for simple shared state; MobX for class-based domain models'],
          ['SvelteKit load functions', 'TanStack Query', 'Server data fetching with caching, revalidation, and devtools'],
          ['bind:value', 'React Hook Form', 'Controlled inputs are built-in; RHF adds validation and performance'],
          ['transition: / in: / out:', 'Framer Motion', 'AnimatePresence for exit animations, motion.* for enter/animate'],
          ['{#each} + sorting', 'TanStack Table', 'Headless table with sorting, filtering, pagination, virtualization'],
          ['SvelteKit routing', 'React Router / TanStack Router', 'TanStack Router adds type-safe params and search params'],
          ['$effect', 'useEffect', 'Built-in React hook; runs after render, cleans up on unmount'],
          ['svelte/store subscriptions', 'useSyncExternalStore', 'Built-in React hook for subscribing to external stores'],
          ['use:action', 'Custom hooks + useRef', 'Hooks replace actions; refs provide direct DOM access'],
          ['svelte/motion spring()', 'React Spring', 'Physics-based animation with mass, tension, friction parameters'],
          ['svelte/motion tweened()', 'Framer Motion / CSS', 'Duration-based interpolation via animate prop or CSS transitions'],
          ['on:click|preventDefault', 'onClick + e.preventDefault()', 'No modifier shorthand; call event methods explicitly'],
          ['{@html}', 'dangerouslySetInnerHTML', 'Both are escape hatches; React name warns about XSS risk'],
          ['Context API (setContext/getContext)', 'React Context (createContext/useContext)', 'Same concept; React requires Provider wrapper component'],
          ['<svelte:component>', 'Dynamic components (JSX expressions)', 'Store component in variable, render with <Component />'],
        ]}
      />

      <p style={pStyle}>
        The pattern is consistent: for every Svelte built-in, there is either a React built-in
        or a well-established library that fills the same role. The biggest shift is mental.
        In Svelte, you learn the framework and you have the tools. In React, you learn the
        core library and then curate your toolkit from the ecosystem. Both approaches work.
        The difference is in who makes the decision &mdash; the framework authors or you.
      </p>

      {/* ================================================================== */}
      <h2 style={h2Style}>Closing Thoughts</h2>

      <p style={pStyle}>
        The React ecosystem&apos;s size is both its greatest strength and its biggest source of
        overwhelm. Coming from Svelte, where batteries are included, it can feel like you need
        to build a toolkit before you can build the product. The first time you set up a new
        React project and face twenty choices before writing a single feature, it is natural to
        miss the simplicity of <code>npx sv create</code> and its sensible defaults.
      </p>

      <p style={pStyle}>
        But the trade-off is real and valuable. Each piece of your React stack can be swapped,
        upgraded, or dropped independently. If TanStack Query releases a breaking change, you
        can pin the old version while migrating at your own pace &mdash; your state management,
        routing, and animation code are completely unaffected. If a better form library emerges
        next year, you can adopt it in one part of your app without touching the rest. You are
        not locked in to any single vendor&apos;s vision of how web applications should work. That
        modularity is not a bug of the ecosystem &mdash; it is the defining feature.
      </p>

      <p style={pStyle}>
        The practical advice is simple: start with React&apos;s built-ins. Add a library when you
        feel pain. When you do add a library, pick one from the established consensus &mdash;
        Zustand for state, TanStack Query for data, React Hook Form for forms, Framer Motion
        for animation. These are battle-tested, well-documented, and widely used. Master these
        four and you can build anything that a Svelte developer builds with built-in features,
        and in many cases, you will find that the React library offers capabilities that go
        beyond what Svelte provides out of the box. The ecosystem is your advantage. Learn to
        use it deliberately, and it becomes a superpower rather than a burden.
      </p>
    </ChapterLayout>
  );
}
