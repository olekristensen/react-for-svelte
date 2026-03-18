export interface Chapter {
  id: string;
  title: string;
  section: string;
  description: string;
}

export interface Section {
  title: string;
  color: string;
  chapters: Chapter[];
}

export const sections: Section[] = [
  {
    title: 'Foundations',
    color: 'var(--color-accent)',
    chapters: [
      { id: 'welcome', title: 'Welcome', section: 'Foundations', description: 'Why this guide exists and how to use it' },
      { id: 'mental-model', title: 'The Mental Model Shift', section: 'Foundations', description: 'From compiler-first to runtime-first thinking' },
      { id: 'components', title: 'Components & JSX', section: 'Foundations', description: '.svelte files vs JSX functions' },
      { id: 'state', title: 'Reactivity & State', section: 'Foundations', description: '$state runes vs useState/useReducer' },
      { id: 'props', title: 'Props & Data Flow', section: 'Foundations', description: 'export let vs function parameters' },
      { id: 'events', title: 'Events & Callbacks', section: 'Foundations', description: 'on:click vs onClick, event forwarding vs callback props' },
      { id: 'lifecycle', title: 'Lifecycle & Effects', section: 'Foundations', description: 'onMount/$effect vs useEffect' },
    ],
  },
  {
    title: 'Intermediate Patterns',
    color: 'var(--color-accent)',
    chapters: [
      { id: 'conditional-rendering', title: 'Conditional & List Rendering', section: 'Intermediate Patterns', description: '{#if}/{#each} vs JSX expressions' },
      { id: 'context', title: 'Context & Stores', section: 'Intermediate Patterns', description: 'Svelte stores vs React Context + useReducer' },
      { id: 'forms', title: 'Form Handling', section: 'Intermediate Patterns', description: 'bind:value vs controlled components' },
      { id: 'slots-children', title: 'Slots vs Children', section: 'Intermediate Patterns', description: '<slot> vs props.children and render props' },
      { id: 'styling', title: 'Styling Strategies', section: 'Intermediate Patterns', description: 'Scoped styles vs CSS-in-JS vs modules' },
      { id: 'refs-dom', title: 'DOM Access & Refs', section: 'Intermediate Patterns', description: 'bind:this vs useRef' },
    ],
  },
  {
    title: 'Advanced React',
    color: 'var(--color-accent)',
    chapters: [
      { id: 'custom-hooks', title: 'Custom Hooks', section: 'Advanced React', description: 'Composable logic extraction — React\'s killer feature' },
      { id: 'performance', title: 'Performance & Memoization', section: 'Advanced React', description: 'useMemo, useCallback, React.memo — what Svelte gives you free' },
      { id: 'suspense-errors', title: 'Suspense & Error Boundaries', section: 'Advanced React', description: 'Declarative loading and error states' },
      { id: 'patterns', title: 'Advanced Patterns', section: 'Advanced React', description: 'HOCs, render props, compound components' },
      { id: 'typescript', title: 'TypeScript in React', section: 'Advanced React', description: 'Typing components, hooks, and generics' },
    ],
  },
  {
    title: 'React Ecosystem',
    color: 'var(--color-accent)',
    chapters: [
      { id: 'style-demo', title: 'Style Directions', section: 'React Ecosystem', description: 'Three design directions to choose from' },
      { id: 'ecosystem-state', title: 'State Management Libraries', section: 'React Ecosystem', description: 'Redux Toolkit, Zustand, Jotai, Valtio — choosing the right tool' },
      { id: 'ecosystem-data', title: 'Data Fetching Libraries', section: 'React Ecosystem', description: 'TanStack Query, SWR, tRPC — managing server state in React' },
      { id: 'ecosystem-forms', title: 'Form Libraries in Depth', section: 'React Ecosystem', description: 'React Hook Form, TanStack Form, Zod — beyond controlled components' },
      { id: 'ecosystem-ui', title: 'Routing, Tables & Headless UI', section: 'React Ecosystem', description: 'TanStack Router, TanStack Table, Radix UI — type-safe utilities' },
      { id: 'animation-transitions', title: 'Animation & Transitions', section: 'React Ecosystem', description: 'CSS transitions, Framer Motion, React Spring — comprehensive animation guide' },
      { id: 'ecosystem-decisions', title: 'Choosing Libraries', section: 'React Ecosystem', description: 'A decision framework for picking the right React libraries by project size' },
    ],
  },
  {
    title: 'Next.js (React\'s SvelteKit)',
    color: 'var(--color-accent)',
    chapters: [
      { id: 'nextjs-intro', title: 'Next.js Overview', section: 'Next.js', description: 'App Router, file conventions, and the SvelteKit parallel' },
      { id: 'nextjs-routing', title: 'Routing & Layouts', section: 'Next.js', description: '+page.svelte vs page.tsx, nested layouts' },
      { id: 'nextjs-data', title: 'Data Fetching', section: 'Next.js', description: 'load functions vs Server Components + fetch' },
      { id: 'nextjs-rendering', title: 'Rendering Strategies', section: 'Next.js', description: 'SSR, SSG, ISR — and how they map to SvelteKit' },
      { id: 'nextjs-server-actions', title: 'Server Actions & Forms', section: 'Next.js', description: 'SvelteKit form actions vs Next.js Server Actions' },
      { id: 'nextjs-middleware', title: 'Middleware & API Routes', section: 'Next.js', description: 'hooks.server.ts vs middleware.ts' },
    ],
  },
];

export const allChapters = sections.flatMap(s => s.chapters);
