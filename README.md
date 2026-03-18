# React for Svelte Developers

An interactive tutorial that teaches React to experienced Svelte developers. Instead of starting from scratch, every concept is explained through the lens of what you already know.

**[Read it live](https://olekristensen.github.io/react-for-svelte/)**

## What's inside

33 chapters across 6 sections, progressing from fundamentals to full-stack frameworks:

### Foundations
Components & JSX, reactivity & state (`$state` vs `useState`), props, events, lifecycle & effects — the core mental model shift from compiler-first to runtime-first.

### Intermediate Patterns
Conditional rendering, context & stores, form handling, slots vs children, styling strategies, DOM access & refs.

### Advanced React
Custom hooks, performance & memoization, Suspense & error boundaries, HOCs/render props/compound components, TypeScript in React.

### React Ecosystem
A dedicated section covering the libraries that React projects rely on, with honest trade-offs and guidance on when each brings value:

- **State Management** — Redux Toolkit, Zustand, Jotai, Valtio, and the signals convergence
- **Data Fetching** — TanStack Query, SWR, tRPC, and why `useEffect` + `fetch` breaks
- **Forms** — React Hook Form, TanStack Form, Zod validation
- **Routing, Tables & UI** — React Router vs TanStack Router, TanStack Table, Radix UI, Headless UI
- **Animation & Decision Framework** — Framer Motion, React Spring, plus a capstone guide for choosing libraries by project complexity (simple CRUD / medium SaaS / large enterprise)

### Next.js (React's SvelteKit)
App Router, routing & layouts, data fetching, rendering strategies (SSR/SSG/ISR), Server Actions, middleware.

### Nuxt.js (Vue's SvelteKit)
A third perspective — Vue reactivity, Nuxt routing & data, and a three-way SvelteKit vs Next.js vs Nuxt comparison.

## Every concept anchored to Svelte

Throughout the tutorial, side-by-side code comparisons show the Svelte way next to the React way:

| Svelte | React |
|---|---|
| `$state` / `$derived` | `useState` / `useMemo` |
| `writable()` / `derived()` | Zustand / Jotai |
| `bind:value` | Controlled components / React Hook Form |
| `transition:fade` | Framer Motion |
| SvelteKit `load` | TanStack Query |
| `{#if}` / `{#each}` | Ternaries / `.map()` |
| `<slot>` | `props.children` |
| `on:click` | `onClick` |

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for dev server and build
- **React Router** (HashRouter) for client-side navigation
- **prism-react-renderer** for syntax highlighting
- Deployed to **GitHub Pages** via GitHub Actions

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Static output goes to `dist/`. The GitHub Actions workflow builds and deploys to Pages on every push to `main`.

## License

MIT
