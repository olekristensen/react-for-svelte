import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function EcosystemUI() {
  return (
    <ChapterLayout id="ecosystem-ui">
      <p style={pStyle}>
        Unlike SvelteKit, which bundles file-based routing, data loading, and layout nesting into a
        single cohesive framework, React is a library, not a framework. It renders UI and manages
        component state -- everything else is your choice. You choose your router, your table
        solution, your UI primitives, your form library. This chapter covers the essential ecosystem
        utilities that every React project eventually needs: routing, data tables, and headless UI
        components. If you are coming from SvelteKit, where these concerns are either built in or
        have a single dominant solution, the React ecosystem's variety can feel overwhelming. The
        goal here is to map each SvelteKit concept to its React equivalent and help you make
        informed choices.
      </p>

      {/* ===== Routing in React ===== */}
      <h2 style={h2Style}>Routing in React</h2>
      <p style={pStyle}>
        SvelteKit provides file-based routing out of the box. You create a file at
        <code> src/routes/blog/[slug]/+page.svelte</code> and you have a route with a typed
        parameter. There is no router to install, no configuration to write, no provider to wrap.
        In React, routing is not built in. You must choose a routing library, install it, configure
        it, and wrap your application in a router provider. The two dominant choices are React
        Router (the long-standing community standard) and TanStack Router (the newer type-safe
        alternative). Framework solutions like Next.js and Remix also provide their own routing,
        but if you are building a client-side SPA or want full control, these two libraries are
        your primary options.
      </p>

      {/* ===== React Router ===== */}
      <h3 style={h3Style}>React Router</h3>
      <p style={pStyle}>
        React Router has been the default routing solution for React applications since 2014. It
        provides declarative route definitions, nested layouts, URL parameters, search params, and
        programmatic navigation. Version 7 (the current major version) introduced loader and action
        patterns inspired by Remix, blurring the line between client-side routing and full-stack
        frameworks.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- SvelteKit: src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  // Or with load function:
  // import type { PageData } from './$types';
  // let { data }: { data: PageData } = $props();

  // Access route params
  let slug = $derived($page.params.slug);

  // Access search params
  let sort = $derived(
    $page.url.searchParams.get('sort') ?? 'date'
  );
</script>

<h1>Post: {slug}</h1>
<p>Sorted by: {sort}</p>

<!-- Navigation -->
<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<a href="/blog">All posts</a>
<button onclick={() => goto('/blog?sort=title')}>
  Sort by title
</button>`,
          filename: 'src/routes/blog/[slug]/+page.svelte',
          highlight: [3, 9, 12, 22, 26],
        }}
        react={{
          code: `// React Router: BlogPost.tsx
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from 'react-router';

function BlogPost() {
  // Access route params
  const { slug } = useParams<{ slug: string }>();

  // Access search params (mutable)
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') ?? 'date';

  // Programmatic navigation
  const navigate = useNavigate();

  return (
    <div>
      <h1>Post: {slug}</h1>
      <p>Sorted by: {sort}</p>

      {/* Declarative navigation */}
      <Link to="/blog">All posts</Link>
      <button onClick={() =>
        setSearchParams({ sort: 'title' })
      }>
        Sort by title
      </button>
      <button onClick={() => navigate('/blog')}>
        Go back
      </button>
    </div>
  );
}`,
          filename: 'BlogPost.tsx',
          highlight: [11, 14, 18, 27, 28, 29, 33],
        }}
        note="SvelteKit's $page store maps to React Router's useParams and useSearchParams hooks. SvelteKit's goto() maps to React Router's useNavigate(). The key difference: SvelteKit derives everything from the file system, while React Router requires explicit route definitions."
      />

      <p style={pStyle}>
        Here is a complete React Router setup showing how routes are defined, how layouts nest,
        and how code splitting works. Note that this tutorial app itself uses React Router for
        navigation between chapters.
      </p>

      <CodeBlock
        code={`// main.tsx -- React Router setup
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';

// Code-split route components
const Home = lazy(() => import('./pages/Home'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Index route */}
          <Route path="/" element={<Home />} />

          {/* Nested routes with shared layout */}
          <Route path="/blog" element={<BlogLayout />}>
            <Route index element={<BlogList />} />
            <Route path=":slug" element={<BlogPost />} />
          </Route>

          {/* Protected routes with auth guard */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Redirect */}
          <Route path="/old-path" element={
            <Navigate to="/blog" replace />
          } />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Layout component with shared chrome
import { Outlet, NavLink } from 'react-router';

function BlogLayout() {
  return (
    <div className="blog-layout">
      <nav>
        {/* NavLink adds 'active' class automatically */}
        <NavLink to="/blog" end>All Posts</NavLink>
        <NavLink to="/blog/drafts">Drafts</NavLink>
      </nav>
      {/* Child routes render here -- like SvelteKit's <slot /> */}
      <Outlet />
    </div>
  );
}

// Auth guard using Outlet
import { Outlet, Navigate, useLocation } from 'react-router';
import { useAuth } from './hooks/useAuth';

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}`}
        language="tsx"
        filename="main.tsx + BlogLayout.tsx + RequireAuth.tsx"
        highlight={[6, 7, 8, 15, 22, 23, 24, 28, 53, 54, 58, 73]}
      />

      {/* ===== TanStack Router ===== */}
      <h3 style={h3Style}>TanStack Router -- Type-Safe Routing</h3>
      <p style={pStyle}>
        TanStack Router is the newer alternative that prioritizes type safety above all else. If
        you appreciated SvelteKit's generated <code>$types</code> that give you typed params and
        load data, TanStack Router provides a similar experience in React -- but through TypeScript
        inference rather than code generation. Every route parameter, every search param, and every
        loader return type is fully inferred from your route definitions.
      </p>

      <CodeBlock
        code={`// routes/__root.tsx -- Root route definition
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
} from '@tanstack/react-router';
import { z } from 'zod';

// Root layout (like SvelteKit's +layout.svelte)
const rootRoute = createRootRoute({
  component: () => (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/users" search={{ page: 1 }}>Users</Link>
      </nav>
      <Outlet />
    </div>
  ),
});

// Simple route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <h1>Home</h1>,
});

// Route with typed params
const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$slug',
  // Loader runs before render -- like SvelteKit's +page.ts load()
  loader: async ({ params }) => {
    // params.slug is fully typed as string
    const res = await fetch(\`/api/posts/\${params.slug}\`);
    return res.json() as Promise<{
      title: string;
      content: string;
      author: string;
    }>;
  },
  component: function BlogPost() {
    // Both params and loader data are fully typed
    const { slug } = blogPostRoute.useParams();
    const post = blogPostRoute.useLoaderData();
    return (
      <article>
        <h1>{post.title}</h1>
        <p>By {post.author}</p>
        <div>{post.content}</div>
      </article>
    );
  },
});

// Route with validated search params (like SvelteKit +page.ts with url.searchParams)
const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  // Zod validates and types search params automatically
  validateSearch: z.object({
    page: z.number().min(1).default(1),
    sort: z.enum(['name', 'date', 'role']).default('name'),
    filter: z.string().optional(),
  }),
  component: function Users() {
    // search params are fully typed and validated
    const { page, sort, filter } = usersRoute.useSearch();
    const navigate = usersRoute.useNavigate();

    return (
      <div>
        <p>Page {page}, sorted by {sort}</p>
        <button onClick={() =>
          navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })
        }>
          Next Page
        </button>
      </div>
    );
  },
});

// Create the router with full type inference
const routeTree = rootRoute.addChildren([
  indexRoute,
  blogPostRoute,
  usersRoute,
]);

export const router = createRouter({ routeTree });

// Register router for global type inference
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}`}
        language="tsx"
        filename="routes.tsx"
        highlight={[12, 33, 34, 36, 37, 47, 48, 62, 63, 64, 70, 71, 89, 94, 95, 96]}
      />

      <CodeComparison
        svelte={{
          code: `<!-- SvelteKit: generated types from file system -->
<!-- src/routes/users/+page.ts -->
<script lang="ts" module>
  import type { PageLoad } from './$types';

  // Types are auto-generated from the route file path
  export const load: PageLoad = async ({ url }) => {
    const page = Number(url.searchParams.get('page')) || 1;
    const sort = url.searchParams.get('sort') ?? 'name';
    const res = await fetch(\`/api/users?page=\${page}&sort=\${sort}\`);
    return { users: await res.json(), page, sort };
  };
</script>

<!-- src/routes/users/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  // data.users, data.page, data.sort are all typed
  // but search param validation is manual
</script>

<p>Page {data.page}, sorted by {data.sort}</p>
{#each data.users as user}
  <div>{user.name}</div>
{/each}`,
          filename: 'src/routes/users/+page.ts',
          highlight: [4, 7, 8, 9, 17, 18],
        }}
        react={{
          code: `// TanStack Router: fully inferred types
// No code generation needed -- pure TypeScript inference

import { createRoute } from '@tanstack/react-router';
import { z } from 'zod';

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  // Zod schema validates AND types search params
  validateSearch: z.object({
    page: z.number().min(1).default(1),
    sort: z.enum(['name', 'date', 'role']).default('name'),
  }),
  loader: async ({ search }) => {
    // search.page and search.sort are fully typed
    const res = await fetch(
      \`/api/users?page=\${search.page}&sort=\${search.sort}\`
    );
    return { users: await res.json() as User[] };
  },
  component: function UsersPage() {
    const { page, sort } = usersRoute.useSearch();
    const { users } = usersRoute.useLoaderData();

    // Everything is typed: page is number,
    // sort is 'name' | 'date' | 'role',
    // users is User[]
    return (
      <div>
        <p>Page {page}, sorted by {sort}</p>
        {users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  },
});`,
          filename: 'routes/users.tsx',
          highlight: [11, 12, 13, 15, 16, 23, 24],
        }}
        note="SvelteKit generates types from the file system via $types. TanStack Router infers types from route definitions via TypeScript. Both give you typed params, search params, and loader data -- TanStack Router additionally validates search params at runtime via Zod."
      />

      <Callout type="insight" title="Type Safety Parity">
        TanStack Router provides the type safety that SvelteKit developers expect from
        <code> $types</code>. Route parameters, search parameters, and loader data are all fully
        typed and inferred without code generation. React Router v7 has improved its TypeScript
        support significantly, but TanStack Router still leads in type inference depth --
        particularly for search param validation and cross-route type checking.
      </Callout>

      {/* ===== Router Comparison ===== */}
      <h3 style={h3Style}>Router Comparison</h3>
      <p style={pStyle}>
        Choosing a router depends on your project's requirements. Here is how the major options
        compare across the features that matter most.
      </p>

      <ComparisonTable
        caption="Routing solutions compared across key features"
        headers={['Feature', 'React Router', 'TanStack Router', 'Next.js App Router', 'SvelteKit']}
        columnFormat={['prose', 'prose', 'prose', 'prose', 'prose']}
        rows={[
          [
            'File-based routing',
            'Optional (v7 with framework mode)',
            'Optional (plugin)',
            'Yes (built-in)',
            'Yes (built-in)',
          ],
          [
            'Type-safe params',
            'Manual generics',
            'Fully inferred',
            'Manual typing',
            'Generated via $types',
          ],
          [
            'Search params validation',
            'Manual parsing',
            'Zod integration built-in',
            'Manual parsing',
            'Manual parsing',
          ],
          [
            'Nested layouts',
            'Yes (Outlet)',
            'Yes (Outlet)',
            'Yes (layout.tsx)',
            'Yes (+layout.svelte)',
          ],
          [
            'Data loading',
            'Loaders (v7)',
            'Loaders with type inference',
            'Server Components / fetch',
            'load() functions',
          ],
          [
            'Code splitting',
            'lazy() + Suspense',
            'Built-in lazy routes',
            'Automatic',
            'Automatic',
          ],
          [
            'SSR support',
            'Via framework (Remix)',
            'Built-in SSR utilities',
            'Yes (built-in)',
            'Yes (built-in)',
          ],
          [
            'Bundle size',
            '~14 KB',
            '~12 KB',
            'Framework-level',
            'Framework-level',
          ],
          [
            'Maturity',
            'Very high (10+ years)',
            'Moderate (v1 in 2023)',
            'High (stable since 2023)',
            'High (stable since 2023)',
          ],
        ]}
      />

      {/* ===== TanStack Table ===== */}
      <h2 style={h2Style}>TanStack Table</h2>
      <p style={pStyle}>
        Data tables are a universal need in web applications, and they are deceptively complex.
        Sorting, filtering, pagination, column resizing, row selection, virtualization -- each
        feature multiplies the complexity. In Svelte, you might build a table with <code>{'{#each}'}</code>,
        add manual sorting with a reactive declaration, and handle pagination with a derived store.
        This works for simple cases but does not scale well when you need ten features at once.
      </p>
      <p style={pStyle}>
        TanStack Table (formerly React Table) takes a headless approach: it provides all the table
        logic -- sorting, filtering, pagination, grouping, column ordering, row selection -- but
        renders zero markup. You provide every <code>&lt;table&gt;</code>, <code>&lt;tr&gt;</code>,
        and <code>&lt;td&gt;</code> yourself. This means complete control over styling and layout,
        but it also means more JSX to write. The trade-off is intentional: the library handles the
        hard parts (state machines, edge cases, accessibility considerations) while you control
        the easy parts (how it looks).
      </p>

      <CodeComparison
        svelte={{
          code: `<script lang="ts">
  interface User {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  let users = $state<User[]>([
    { id: 1, name: 'Alice', email: 'alice@co.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@co.com', role: 'User' },
    { id: 3, name: 'Carol', email: 'carol@co.com', role: 'User' },
  ]);

  let sortKey = $state<keyof User>('name');
  let sortDir = $state<'asc' | 'desc'>('asc');
  let filterText = $state('');

  let filtered = $derived(
    users.filter(u =>
      u.name.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  let sorted = $derived(
    [...filtered].sort((a, b) => {
      const valA = String(a[sortKey]);
      const valB = String(b[sortKey]);
      return sortDir === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    })
  );

  function toggleSort(key: keyof User) {
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDir = 'asc';
    }
  }
</script>

<input bind:value={filterText} placeholder="Filter..." />

<table>
  <thead>
    <tr>
      {#each ['name', 'email', 'role'] as key}
        <th onclick={() => toggleSort(key as keyof User)}>
          {key} {sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each sorted as user (user.id)}
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
      </tr>
    {/each}
  </tbody>
</table>`,
          filename: 'UserTable.svelte',
          highlight: [15, 16, 19, 25, 35, 50, 51],
        }}
        react={{
          code: `// UserTable.tsx -- TanStack Table
import { useState, useMemo } from 'react';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: (info) => (
      <span className={\`badge-\${info.getValue()}\`}>
        {info.getValue()}
      </span>
    ),
  }),
];

function UserTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <input
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Filter..."
      />
      <table>
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === 'asc' ? ' ↑' :
                   header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
          filename: 'UserTable.tsx',
          highlight: [4, 5, 6, 7, 8, 20, 22, 23, 45, 46, 47, 48, 49, 50, 65, 66, 71],
        }}
        note="The Svelte version is more concise for simple tables because you manage sorting and filtering manually with reactive declarations. TanStack Table is more verbose upfront but scales to complex features (pagination, column resizing, virtualization) without rewriting your logic."
      />

      <CodeBlock
        code={`// Full table with pagination, selection, and server-side data
import { useState } from 'react';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type PaginationState,
  type RowSelectionState,
} from '@tanstack/react-table';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const columnHelper = createColumnHelper<Product>();

const columns = [
  // Selection checkbox column
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.accessor('name', {
    header: 'Product',
    cell: (info) => <strong>{info.getValue()}</strong>,
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => \`$\${info.getValue().toFixed(2)}\`,
    // Custom sorting: numeric instead of lexicographic
    sortingFn: 'basic',
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    filterFn: 'equals', // exact match filter for dropdowns
  }),
  columnHelper.accessor('inStock', {
    header: 'Status',
    cell: (info) => info.getValue() ? 'In Stock' : 'Out of Stock',
  }),
];

function ProductTable({ data }: { data: Product[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search products..."
        />
        <span>
          {Object.keys(rowSelection).length} of{' '}
          {table.getFilteredRowModel().rows.length} selected
        </span>
      </div>

      <table>
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}
              style={{
                background: row.getIsSelected() ? 'var(--color-accent-bg)' : undefined,
              }}
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          First
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          Last
        </button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 25, 50, 100].map(size => (
            <option key={size} value={size}>Show {size}</option>
          ))}
        </select>
      </div>
    </div>
  );
}`}
        language="tsx"
        filename="ProductTable.tsx"
        highlight={[28, 29, 30, 31, 44, 45, 52, 53, 66, 67, 68, 75, 76, 77, 78, 79, 80, 81, 82, 83]}
      />

      <h3 style={h3Style}>Server-Side Pagination with TanStack Query</h3>
      <p style={pStyle}>
        In real applications, you rarely load all data upfront. TanStack Table integrates naturally
        with TanStack Query to handle server-side pagination, where the table tells the server which
        page to fetch and how to sort.
      </p>

      <CodeBlock
        code={`// ServerTable.tsx -- server-side pagination
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';

interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageCount: number;
}

async function fetchUsers(
  pagination: PaginationState,
  sorting: SortingState,
): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams({
    page: String(pagination.pageIndex),
    size: String(pagination.pageSize),
    ...(sorting[0] && {
      sortBy: sorting[0].id,
      sortDir: sorting[0].desc ? 'desc' : 'asc',
    }),
  });
  const res = await fetch(\`/api/users?\${params}\`);
  return res.json();
}

function ServerPaginatedTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  // TanStack Query handles caching, background refetching,
  // and keeps previous data visible while loading next page
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users', pagination, sorting],
    queryFn: () => fetchUsers(pagination, sorting),
    placeholderData: keepPreviousData,
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.pageCount ?? -1,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    // No getSortedRowModel -- server handles sorting
    // No getPaginationRowModel -- server handles pagination
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div>
      {isFetching && <div className="loading-indicator">Updating...</div>}
      <table>
        {/* ...render headers and rows same as before... */}
      </table>
      <div>
        Page {pagination.pageIndex + 1} of {data?.pageCount ?? '...'}
        {' '}({data?.totalCount ?? '...'} total rows)
      </div>
    </div>
  );
}`}
        language="tsx"
        filename="ServerTable.tsx"
        highlight={[3, 43, 44, 45, 46, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]}
      />

      <Callout type="info" title="Headless Tables Are a Different Paradigm">
        TanStack Table is headless -- it gives you sorting, filtering, pagination, and selection
        logic but renders zero markup. This is a fundamentally different approach from Svelte
        component libraries like <code>svelte-table</code> or <code>svelte-headless-table</code>.
        The verbosity is intentional: you own every pixel of rendering, which means you can use
        any CSS framework, any design system, any layout structure. The table logic does not care
        how you display it.
      </Callout>

      {/* ===== Headless UI Patterns ===== */}
      <h2 style={h2Style}>Headless UI Patterns</h2>
      <p style={pStyle}>
        The headless pattern extends beyond tables. It is a philosophy that separates behavior and
        accessibility from visual presentation. A headless dialog component handles focus trapping,
        keyboard navigation, and ARIA attributes but has zero opinions about how it looks. A
        headless combobox manages filtering, keyboard selection, and screen reader announcements but
        renders no visual elements. You provide all the markup and styling. This pattern emerged in
        React because hooks and composition make it natural to separate logic from rendering. Svelte
        is catching up with libraries like melt-ui and bits-ui.
      </p>

      <h3 style={h3Style}>Radix UI -- The Accessibility-First Primitive</h3>
      <p style={pStyle}>
        Radix UI provides unstyled, accessible UI primitives for React. Each component follows WAI-ARIA
        patterns, handles keyboard navigation, manages focus, and announces state changes to screen
        readers. You bring your own styles -- Radix brings the behavior.
      </p>

      <CodeBlock
        code={`// Dialog with Radix UI -- accessible modal
import * as Dialog from '@radix-ui/react-dialog';

function ConfirmDeleteDialog({
  onConfirm,
  itemName,
}: {
  onConfirm: () => void;
  itemName: string;
}) {
  return (
    <Dialog.Root>
      {/* Trigger automatically manages open/close state */}
      <Dialog.Trigger asChild>
        <button className="btn-danger">Delete {itemName}</button>
      </Dialog.Trigger>

      {/* Portal renders outside the DOM tree -- like Svelte's <svelte:window> */}
      <Dialog.Portal>
        {/* Overlay: the dimmed background */}
        <Dialog.Overlay className="dialog-overlay" />

        {/* Content: the modal itself */}
        <Dialog.Content className="dialog-content">
          {/* Title and Description for screen readers */}
          <Dialog.Title className="dialog-title">
            Delete {itemName}?
          </Dialog.Title>
          <Dialog.Description className="dialog-description">
            This action cannot be undone. The item will be
            permanently removed from your account.
          </Dialog.Description>

          <div className="dialog-actions">
            {/* Close automatically closes the dialog */}
            <Dialog.Close asChild>
              <button className="btn-secondary">Cancel</button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button className="btn-danger" onClick={onConfirm}>
                Yes, delete
              </button>
            </Dialog.Close>
          </div>

          {/* Accessible close button */}
          <Dialog.Close asChild>
            <button className="dialog-close-icon" aria-label="Close">
              X
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/*
  What Radix handles for you automatically:
  - Focus trap: Tab key cycles within the dialog
  - Escape key: closes the dialog
  - Click outside: closes the dialog
  - Scroll lock: body scroll is disabled while open
  - ARIA: role="dialog", aria-modal, aria-labelledby, aria-describedby
  - Focus restore: returns focus to trigger on close
  - Portal: renders in document.body to avoid z-index issues

  What you control:
  - Every CSS class and visual style
  - Layout and spacing of content
  - Animations and transitions
  - The trigger element (button, link, icon, anything)
*/`}
        language="tsx"
        filename="ConfirmDeleteDialog.tsx"
        highlight={[14, 19, 21, 24, 26, 27, 36, 37, 39, 40, 47, 48]}
      />

      <h3 style={h3Style}>Headless UI -- Tailwind Labs' Component Library</h3>
      <p style={pStyle}>
        Headless UI is Tailwind Labs' answer to accessible components. It pairs naturally with
        Tailwind CSS and provides components like Combobox, Dialog, Disclosure, Listbox, Menu,
        Popover, and Tabs. Where Radix focuses on granular primitives, Headless UI provides
        slightly more opinionated compound components.
      </p>

      <CodeBlock
        code={`// Combobox with Headless UI -- accessible autocomplete
import { useState } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';

interface Person {
  id: number;
  name: string;
  department: string;
}

const people: Person[] = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering' },
  { id: 2, name: 'Bob Smith', department: 'Design' },
  { id: 3, name: 'Carol Williams', department: 'Engineering' },
  { id: 4, name: 'Dave Brown', department: 'Marketing' },
];

function PersonPicker() {
  const [selected, setSelected] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const filtered =
    query === ''
      ? people
      : people.filter((person) =>
          person.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="combobox-wrapper">
        <ComboboxInput
          className="combobox-input"
          displayValue={(person: Person | null) => person?.name ?? ''}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people..."
        />
        <ComboboxButton className="combobox-btn">
          <ChevronDownIcon />
        </ComboboxButton>
      </div>

      <ComboboxOptions className="combobox-options">
        {filtered.length === 0 ? (
          <div className="combobox-empty">No results found</div>
        ) : (
          filtered.map((person) => (
            <ComboboxOption
              key={person.id}
              value={person}
              className={({ focus, selected }) =>
                \`combobox-option \${focus ? 'focused' : ''} \${selected ? 'selected' : ''}\`
              }
            >
              {({ selected }) => (
                <div>
                  <span className={selected ? 'font-bold' : ''}>
                    {person.name}
                  </span>
                  <span className="text-muted">
                    {person.department}
                  </span>
                </div>
              )}
            </ComboboxOption>
          ))
        )}
      </ComboboxOptions>
    </Combobox>
  );
}

/*
  What Headless UI handles:
  - Keyboard navigation (arrow keys, Home, End)
  - Type-ahead search within options
  - ARIA combobox pattern (role, aria-expanded, aria-activedescendant)
  - Screen reader announcements for selection changes
  - Focus management and portal positioning

  What you control:
  - Every class name and visual style
  - Option rendering (icons, badges, secondary text)
  - Custom filtering logic
  - Animation classes via data attributes
*/`}
        language="tsx"
        filename="PersonPicker.tsx"
        highlight={[4, 5, 6, 7, 8, 36, 38, 39, 40, 49, 54, 55, 57, 58]}
      />

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: melt-ui Combobox -->
<script lang="ts">
  import { createCombobox } from '@melt-ui/svelte';

  const {
    elements: { menu, input, option },
    states: { open, inputValue, selected },
    helpers: { isSelected },
  } = createCombobox<string>({
    forceVisible: true,
  });

  let items = ['Alice', 'Bob', 'Carol', 'Dave'];

  let filtered = $derived(
    $inputValue
      ? items.filter(i =>
          i.toLowerCase().includes(
            $inputValue.toLowerCase()
          ))
      : items
  );
</script>

<input
  use:melt={$input}
  placeholder="Search..."
/>

{#if $open}
  <ul use:melt={$menu}>
    {#each filtered as item}
      <li use:melt={$option({ value: item })}>
        {item}
        {#if $isSelected(item)}
          <span>Selected</span>
        {/if}
      </li>
    {/each}
  </ul>
{/if}`,
          filename: 'ComboboxMelt.svelte',
          highlight: [3, 5, 6, 7, 8, 15, 26, 31, 33],
        }}
        react={{
          code: `// React: Radix UI Combobox-like with Popover + Command
// (Radix does not have a built-in Combobox,
// so the community uses cmdk or Headless UI)
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { useState } from 'react';

function PeoplePicker() {
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');

  const items = ['Alice', 'Bob', 'Carol', 'Dave'];

  const filtered = query === ''
    ? items
    : items.filter(i =>
        i.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <ComboboxInput
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      <ComboboxOptions>
        {filtered.map(item => (
          <ComboboxOption key={item} value={item}>
            {({ selected }) => (
              <span>
                {item}
                {selected && <span>Selected</span>}
              </span>
            )}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}`,
          filename: 'PeoplePicker.tsx',
          highlight: [4, 5, 6, 7, 25, 26, 31, 33, 34],
        }}
        note="Svelte's melt-ui uses the builder pattern with use:melt actions to attach behavior to elements. React's Headless UI uses compound components with render props. Both achieve the same goal: accessible behavior with zero visual opinions."
      />

      <Callout type="insight" title="React Pioneered Headless UI">
        React pioneered the headless pattern because hooks and component composition make it natural
        to separate behavior from rendering. Libraries like Radix UI and Headless UI have been
        polished over years of production use. Svelte is catching up with melt-ui and bits-ui, which
        provide similar headless primitives using Svelte's action and builder patterns. If you are
        used to melt-ui's builder approach, React's compound component pattern serves the same
        purpose -- you will just express it through JSX composition rather than Svelte actions.
      </Callout>

      {/* ===== Component Library Landscape ===== */}
      <h3 style={h3Style}>Component Library Landscape</h3>
      <p style={pStyle}>
        The React UI library landscape is vast. Understanding the spectrum from fully headless to
        fully styled helps you pick the right level of abstraction for your project.
      </p>

      <ComparisonTable
        caption="React UI component libraries compared"
        headers={['Library', 'Approach', 'Styling', 'Accessibility', 'Best For']}
        columnFormat={['code', 'prose', 'prose', 'prose', 'prose']}
        rows={[
          [
            'Radix UI',
            'Headless / unstyled primitives',
            'Bring your own CSS',
            'WAI-ARIA compliant',
            'Custom design systems, full control over visuals',
          ],
          [
            'shadcn/ui',
            'Copy-paste components (Radix + Tailwind)',
            'Tailwind CSS (you own the code)',
            'Inherits Radix accessibility',
            'Most projects -- beautiful defaults, full customization',
          ],
          [
            'Headless UI',
            'Headless compound components',
            'Bring your own CSS (Tailwind-friendly)',
            'WAI-ARIA compliant',
            'Tailwind projects wanting accessible primitives',
          ],
          [
            'MUI (Material UI)',
            'Fully styled, Material Design',
            'Emotion / styled-components',
            'Good (built-in ARIA)',
            'Enterprise apps needing a complete design system fast',
          ],
          [
            'Ant Design',
            'Fully styled, enterprise-focused',
            'CSS-in-JS (cssinjs)',
            'Good (built-in ARIA)',
            'Admin panels, data-heavy dashboards, CJK localization',
          ],
          [
            'Mantine',
            'Styled + headless hooks',
            'CSS modules + PostCSS',
            'Good (built-in ARIA)',
            'Balanced approach: styled components plus headless hooks for custom UI',
          ],
        ]}
      />

      <Callout type="info" title="shadcn/ui Is the De Facto Standard">
        shadcn/ui has become the most popular choice in the React ecosystem. It is not a traditional
        npm package -- instead, you copy component source code into your project. Each component is
        built on Radix UI primitives styled with Tailwind CSS. You own the code completely, which
        means you can customize anything without fighting library abstractions. Svelte developers
        may already know this model from <code>shadcn-svelte</code> or <code>skeleton</code>, which
        follow the same copy-paste philosophy.
      </Callout>

      {/* ===== Key Takeaways ===== */}
      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        The biggest mindset shift for Svelte developers entering React is that nothing is built
        in beyond rendering. SvelteKit gives you routing, data loading, layouts, and form actions
        as first-class features. React gives you a rendering library and an ecosystem of choices.
        This is not a weakness -- it is a design philosophy. React's minimal core means you can
        combine exactly the tools your project needs without paying for features you do not use.
      </p>
      <p style={pStyle}>
        For routing, start with React Router if you want the battle-tested standard, or TanStack
        Router if type safety is your priority. For data tables, TanStack Table's headless approach
        gives you the flexibility to build exactly the table your design requires, at the cost of
        writing more JSX. For UI primitives, Radix UI and Headless UI give you accessible behavior
        without visual opinions, and shadcn/ui layers beautiful Tailwind defaults on top of Radix.
      </p>
      <p style={pStyle}>
        The common thread across all these libraries is the headless pattern: separate logic and
        accessibility from rendering. This is the dominant architecture in modern React. Once you
        internalize this pattern, the entire ecosystem becomes easier to navigate. Instead of
        looking for "the React component that looks like what I want," you look for "the React
        hook or primitive that does what I need" and layer your own design on top.
      </p>
    </ChapterLayout>
  );
}
