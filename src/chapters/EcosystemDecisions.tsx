import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
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
        Svelte ships with built-in transitions, animations, and motion primitives.{' '}
        <code>transition:fade</code>, <code>animate:flip</code>, and <code>svelte/motion</code>{' '}
        handle the vast majority of animation use cases without installing anything. React has
        nothing built-in for animation. No transition directives, no animate blocks, no motion
        stores. But two libraries -- Framer Motion and React Spring -- fill the gap with
        capabilities that go well beyond what Svelte offers out of the box.
      </p>

      <p style={pStyle}>
        This chapter covers animation first, then closes the entire React Ecosystem section with
        a comprehensive decision framework. After reading this, you will know exactly which
        libraries to reach for based on project size and complexity -- and, critically, when to
        reach for nothing at all.
      </p>

      {/* ================================================================== */}
      <h2 style={h2Style}>Animation in React vs Svelte</h2>

      <p style={pStyle}>
        In Svelte, animations are first-class language features. You add a directive to an
        element, pass parameters, and you are done. The compiler generates the animation code
        and handles enter/exit transitions automatically when elements are added or removed from
        the DOM via <code>{'{#if}'}</code> or <code>{'{#each}'}</code> blocks.
      </p>

      <p style={pStyle}>
        In React, the DOM is managed by the reconciler, and elements are removed synchronously
        when they leave the tree. There is no built-in mechanism to delay removal for an exit
        animation. This is why animation libraries in React need wrapper components like{' '}
        <code>AnimatePresence</code> -- they intercept the unmount and keep the element alive
        long enough for the exit animation to play.
      </p>

      <CodeComparison
        svelte={{
          filename: 'FadePanel.svelte',
          language: 'svelte',
          code: `<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  let visible = $state(true);
</script>

<button onclick={() => visible = !visible}>
  Toggle
</button>

{#if visible}
  <div transition:fade={{ duration: 300 }}>
    This fades in and out
  </div>

  <div
    in:fly={{ y: 20, duration: 400 }}
    out:fade={{ duration: 200 }}
  >
    Flies in, fades out
  </div>
{/if}`,
        }}
        react={{
          filename: 'FadePanel.tsx',
          language: 'tsx',
          code: `import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FadePanel() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <button onClick={() => setVisible(v => !v)}>
        Toggle
      </button>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            This fades in and out
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            Flies in, fades out
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}`,
        }}
        note="Svelte's transition directives compile to animation code automatically. React needs AnimatePresence to intercept unmounting and play exit animations."
      />

      <p style={pStyle}>
        The fundamental difference: Svelte transitions are declarative directives applied
        directly to elements. The compiler knows about them and generates the necessary code.
        React animations require wrapper components or hooks because React itself has no
        awareness of animation -- it just mounts and unmounts elements. The library has to
        work around this constraint, which is why the API involves more wrapping.
      </p>

      {/* ================================================================== */}
      <h2 style={h2Style}>Framer Motion</h2>

      <p style={pStyle}>
        Framer Motion is the most popular animation library in the React ecosystem. It was
        built by the team behind the Framer design tool, and it shows -- the API is designed
        around concepts familiar to designers and interaction developers. Most animations can be
        expressed with just three props: <code>initial</code>, <code>animate</code>, and{' '}
        <code>exit</code>.
      </p>

      <h3 style={h3Style}>Basic Animations</h3>

      <CodeBlock
        filename="AnimatedCard.tsx"
        language="tsx"
        code={`import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function AnimatedCard({ title, children }: CardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0',
      }}
    >
      <h3>{title}</h3>

      <button onClick={() => setIsExpanded(e => !e)}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}`}
      />

      <p style={pStyle}>
        The <code>motion.div</code> component is a drop-in replacement for a regular{' '}
        <code>div</code>. It accepts all the same props plus animation-specific ones. You
        describe the start state (<code>initial</code>), the target state (
        <code>animate</code>), and optionally the state when removed (<code>exit</code>).
        Framer Motion handles the interpolation.
      </p>

      <h3 style={h3Style}>Layout Animations</h3>

      <p style={pStyle}>
        This is where Framer Motion pulls ahead of anything Svelte offers built-in. The{' '}
        <code>layout</code> prop enables automatic animation whenever an element's size or
        position changes in the DOM. Items reordering in a list, panels resizing, elements
        moving between containers -- all animate smoothly with a single prop.
      </p>

      <CodeBlock
        filename="ReorderableList.tsx"
        language="tsx"
        code={`import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export function ReorderableList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Learn Framer Motion', completed: false },
    { id: '2', title: 'Build layout animations', completed: false },
    { id: '3', title: 'Ship the feature', completed: false },
  ]);

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Reorder.Group
      axis="y"
      values={tasks}
      onReorder={setTasks}
      style={{ listStyle: 'none', padding: 0 }}
    >
      <AnimatePresence>
        {tasks.map(task => (
          <Reorder.Item
            key={task.id}
            value={task}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            layout
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              background: '#f8fafc',
              borderRadius: '0.375rem',
              cursor: 'grab',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{task.title}</span>
            <button onClick={() => removeTask(task.id)}>Remove</button>
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}`}
      />

      <h3 style={h3Style}>Gesture Animations</h3>

      <p style={pStyle}>
        Framer Motion includes gesture recognition out of the box. Drag, hover, tap, and pan
        interactions can be declared with dedicated props rather than wiring up event listeners
        manually. This is particularly useful for interactive components like draggable cards,
        swipeable lists, and interactive dashboards.
      </p>

      <CodeBlock
        filename="DraggableCard.tsx"
        language="tsx"
        code={`import { motion } from 'framer-motion';

export function DraggableCard() {
  return (
    <motion.div
      drag
      dragConstraints={{ top: -100, bottom: 100, left: -100, right: 100 }}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.97 }}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        width: 200,
        height: 200,
        borderRadius: '1rem',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        cursor: 'grab',
        userSelect: 'none',
      }}
    >
      Drag me
    </motion.div>
  );
}`}
      />

      <h3 style={h3Style}>Svelte animate:flip vs Framer Motion Layout</h3>

      <CodeComparison
        svelte={{
          filename: 'SortableList.svelte',
          language: 'svelte',
          code: `<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  let items = $state([
    { id: 1, name: 'Alpha', priority: 3 },
    { id: 2, name: 'Beta', priority: 1 },
    { id: 3, name: 'Gamma', priority: 2 },
  ]);

  function sortByPriority() {
    items = [...items].sort((a, b) => a.priority - b.priority);
  }

  function removeItem(id: number) {
    items = items.filter(item => item.id !== id);
  }
</script>

<button onclick={sortByPriority}>Sort by Priority</button>

{#each items as item (item.id)}
  <div
    animate:flip={{ duration: 300 }}
    transition:fade={{ duration: 200 }}
  >
    <span>{item.name} (priority: {item.priority})</span>
    <button onclick={() => removeItem(item.id)}>x</button>
  </div>
{/each}`,
        }}
        react={{
          filename: 'SortableList.tsx',
          language: 'tsx',
          code: `import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Item {
  id: number;
  name: string;
  priority: number;
}

export function SortableList() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Alpha', priority: 3 },
    { id: 2, name: 'Beta', priority: 1 },
    { id: 3, name: 'Gamma', priority: 2 },
  ]);

  const sortByPriority = () => {
    setItems(prev =>
      [...prev].sort((a, b) => a.priority - b.priority)
    );
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <>
      <button onClick={sortByPriority}>
        Sort by Priority
      </button>

      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              layout: { duration: 0.3 },
              opacity: { duration: 0.2 },
            }}
          >
            <span>
              {item.name} (priority: {item.priority})
            </span>
            <button onClick={() => removeItem(item.id)}>
              x
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}`,
        }}
        note="Svelte's animate:flip handles list reordering. Framer Motion's layout prop does the same but also handles arbitrary layout changes -- resizing, container swaps, and shared element transitions."
      />

      <Callout type="insight" title="Layout Animations Have No Svelte Equivalent">
        Framer Motion's <code>layout</code> animations have no direct Svelte equivalent. When
        you add the <code>layout</code> prop to a <code>motion</code> element, it automatically
        detects changes to its position and size and smoothly animates between them. Items
        reordering, panels resizing, elements moving between containers -- all animated with a
        single prop. It is genuinely impressive, and it is one area where the React ecosystem
        surpasses Svelte's built-in capabilities.
      </Callout>

      {/* ================================================================== */}
      <h2 style={h2Style}>React Spring</h2>

      <p style={pStyle}>
        React Spring takes a fundamentally different approach from Framer Motion. Instead of
        duration-based animations, it uses spring physics. You define a target value, and the
        animation uses mass, tension, and friction to simulate a physical spring reaching
        equilibrium. The result is animations that feel more natural and responsive -- they have
        no fixed duration because a real spring does not have one.
      </p>

      <p style={pStyle}>
        If you have used <code>svelte/motion</code>'s <code>spring()</code> function, React
        Spring will feel familiar. Both use the same physics model, though React Spring's API
        is more extensive.
      </p>

      <h3 style={h3Style}>Physics-Based Animations</h3>

      <CodeBlock
        filename="SpringCard.tsx"
        language="tsx"
        code={`import { useSpring, animated } from '@react-spring/web';
import { useState } from 'react';

export function SpringCard() {
  const [isActive, setIsActive] = useState(false);

  const springProps = useSpring({
    transform: isActive
      ? 'scale(1.1) rotateZ(2deg)'
      : 'scale(1) rotateZ(0deg)',
    boxShadow: isActive
      ? '0 20px 40px rgba(0,0,0,0.15)'
      : '0 4px 12px rgba(0,0,0,0.08)',
    config: {
      mass: 1,
      tension: 200,
      friction: 20,
    },
  });

  return (
    <animated.div
      style={{
        ...springProps,
        width: 240,
        height: 160,
        borderRadius: '0.75rem',
        background: '#f0f4ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      Hover me (spring physics)
    </animated.div>
  );
}`}
      />

      <h3 style={h3Style}>Enter/Exit Transitions with useTransition</h3>

      <CodeBlock
        filename="NotificationStack.tsx"
        language="tsx"
        code={`import { useTransition, animated } from '@react-spring/web';
import { useState, useCallback } from 'react';

interface Notification {
  id: number;
  message: string;
}

let nextId = 0;

export function NotificationStack() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string) => {
    const id = nextId++;
    setNotifications(prev => [...prev, { id, message }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const transitions = useTransition(notifications, {
    keys: (item) => item.id,
    from: { opacity: 0, transform: 'translateX(100%)', height: 0 },
    enter: { opacity: 1, transform: 'translateX(0%)', height: 60 },
    leave: { opacity: 0, transform: 'translateX(100%)', height: 0 },
    config: { tension: 220, friction: 24 },
  });

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, width: 320 }}>
      <button onClick={() => addNotification('Something happened!')}>
        Add Notification
      </button>

      {transitions((style, item) => (
        <animated.div
          style={{
            ...style,
            padding: '0.75rem 1rem',
            marginBottom: '0.5rem',
            background: '#1e293b',
            color: 'white',
            borderRadius: '0.375rem',
            overflow: 'hidden',
          }}
        >
          {item.message}
        </animated.div>
      ))}
    </div>
  );
}`}
      />

      <p style={pStyle}>
        React Spring's <code>useTransition</code> is the equivalent of wrapping elements in{' '}
        <code>AnimatePresence</code> in Framer Motion, but with physics-based timing. The
        callback pattern <code>{'transitions((style, item) => ...)'}</code> gives you direct
        control over how each animated value maps to styles.
      </p>

      <Callout type="info" title="React Spring vs Framer Motion">
        If you want spring physics similar to <code>svelte/motion</code>'s <code>spring()</code>,
        React Spring is the closest match. Its API is centered around physics parameters
        (mass, tension, friction) rather than duration and easing curves. For everything else --
        layout animations, gestures, drag-and-drop, shared element transitions -- Framer Motion
        is more ergonomic and has a larger community. Most React teams pick Framer Motion as
        their default and only reach for React Spring when they specifically need physics-based
        motion.
      </Callout>

      {/* ================================================================== */}
      <h3 style={h3Style}>CSS-Based Alternatives</h3>

      <p style={pStyle}>
        Before reaching for any animation library, consider whether CSS transitions and
        animations are sufficient. React makes it straightforward to toggle CSS classes based
        on state, and modern CSS can handle opacity, transforms, colors, and even layout
        changes with hardware-accelerated performance.
      </p>

      <CodeBlock
        filename="CSSTransitionExample.tsx"
        language="tsx"
        code={`import { useState } from 'react';
import './Sidebar.css';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(o => !o)}>
        {isOpen ? 'Close' : 'Open'} Sidebar
      </button>

      <aside className={\`sidebar \${isOpen ? 'sidebar--open' : ''}\`}>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/settings">Settings</a>
          <a href="/profile">Profile</a>
        </nav>
      </aside>
    </>
  );
}

/*  Sidebar.css  */
/*
.sidebar {
  transform: translateX(-100%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #1e293b;
  padding: 2rem;
}

.sidebar--open {
  transform: translateX(0);
  opacity: 1;
}
*/`}
      />

      <p style={pStyle}>
        CSS transitions cover a surprising number of use cases: toggling visibility, sliding
        panels, hover effects, skeleton loading states, and smooth color changes. The key
        limitation is <em>exit animations</em>. CSS cannot animate an element that is being
        removed from the DOM. If your component conditionally renders with{' '}
        <code>{'visible && <div>...</div>'}</code>, the element disappears instantly -- there is
        no CSS-only way to fade it out first. This is the primary reason animation libraries
        exist in React.
      </p>

      <Callout type="info" title="When CSS Is Enough">
        For simple opacity and transform transitions, CSS is sufficient and adds zero bundle
        cost. Reach for Framer Motion when you need exit animations (animating elements as they
        leave the DOM), layout animations (smooth reordering), or gesture-driven interactions
        (drag, swipe, pinch). If you are only toggling a class to slide a panel open, CSS does
        the job perfectly.
      </Callout>

      {/* ================================================================== */}
      <h3 style={h3Style}>Animation Comparison</h3>

      <ComparisonTable
        caption="Animation approaches in React compared to Svelte's built-ins"
        headers={['Feature', 'Svelte Built-in', 'Framer Motion', 'React Spring', 'CSS Only']}
        rows={[
          ['Enter/exit transitions', 'transition:fade, transition:fly', 'AnimatePresence + exit prop', 'useTransition', 'Enter only (no exit)'],
          ['List reordering', 'animate:flip', 'layout prop + Reorder', 'useTransition', 'Not supported'],
          ['Spring physics', 'svelte/motion spring()', 'type: "spring"', 'Native (mass/tension/friction)', 'Not supported'],
          ['Gesture animations', 'Manual (use:action)', 'whileHover, whileDrag, whileTap', 'useGesture (separate pkg)', 'Hover only (:hover)'],
          ['Layout animation', 'Not built-in', 'layout prop (automatic)', 'Not built-in', 'Limited (CSS grid)'],
          ['Bundle cost', '0 KB (compiled away)', '~32 KB', '~17 KB', '0 KB'],
          ['Learning curve', 'Low (declarative directives)', 'Low-Medium (prop-based)', 'Medium (physics model)', 'Low (CSS knowledge)'],
        ]}
      />

      {/* ================================================================== */}
      <h2 style={h2Style}>The Decision Framework</h2>

      <p style={pStyle}>
        We have now covered the major categories of the React library ecosystem: state
        management, server data, forms, and animation. Each chapter explored individual
        libraries in depth. Now it is time to zoom out and ask the practical question: given
        a specific project, which libraries do you actually install?
      </p>

      <p style={pStyle}>
        The answer depends on project complexity. Not every app needs Zustand. Not every form
        needs React Hook Form. Not every list needs Framer Motion. The biggest mistake Svelte
        developers make when moving to React is installing everything on day one because a blog
        post said it was "best practice." The right approach is to start minimal and add
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
        Do not install libraries speculatively. Start with React's built-ins:{' '}
        <code>useState</code>, <code>useReducer</code>, <code>useContext</code>, and{' '}
        <code>useEffect</code>. Add a library when you feel specific pain -- when your{' '}
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

// Zustand store (defined elsewhere)
// const useStore = create<AppState>((set) => ({
//   sidebarOpen: true,
//   toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
// }));

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
        rows={[
          ['Client state', 'Redux Toolkit', 'Enforced conventions, middleware, devtools, time-travel debugging'],
          ['Server data', 'TanStack Query + tRPC', 'End-to-end type safety from API to UI, automatic cache management'],
          ['Routing', 'TanStack Router', 'Type-safe params, search params, loaders, preloading'],
          ['Forms', 'React Hook Form + Zod', 'Performance at scale, composable schemas, field-level validation'],
          ['Animation', 'Framer Motion', 'Consistent animation language across teams and features'],
          ['Components', 'Radix UI or custom headless system', 'Full accessibility compliance, design system foundation'],
          ['Testing', 'Vitest + React Testing Library + Playwright', 'Unit, integration, and end-to-end coverage'],
        ]}
      />

      <Callout type="warning" title="Enterprise Does Not Mean Use Everything">
        Enterprise does not mean "install every library." It means "use tools that enforce
        conventions across large teams." Redux Toolkit's opinionated structure -- slices,
        actions, reducers, middleware -- is a <em>feature</em> at scale because it forces every
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
        rows={[
          ['$state / $derived', 'useState / useMemo', 'Built-in React primitives; Zustand or Jotai for shared state'],
          ['writable() / derived()', 'Zustand or Jotai', 'External stores for state shared across components'],
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
        The difference is in who makes the decision -- the framework authors or you.
      </p>

      {/* ================================================================== */}
      <h2 style={h2Style}>Closing Thoughts</h2>

      <p style={pStyle}>
        The React ecosystem's size is both its greatest strength and its biggest source of
        overwhelm. Coming from Svelte, where batteries are included, it can feel like you need
        to build a toolkit before you can build the product. The first time you set up a new
        React project and face twenty choices before writing a single feature, it is natural to
        miss the simplicity of <code>npx sv create</code> and its sensible defaults.
      </p>

      <p style={pStyle}>
        But the trade-off is real and valuable. Each piece of your React stack can be swapped,
        upgraded, or dropped independently. If TanStack Query releases a breaking change, you
        can pin the old version while migrating at your own pace -- your state management,
        routing, and animation code are completely unaffected. If a better form library emerges
        next year, you can adopt it in one part of your app without touching the rest. You are
        not locked in to any single vendor's vision of how web applications should work. That
        modularity is not a bug of the ecosystem -- it is the defining feature.
      </p>

      <p style={pStyle}>
        The practical advice is simple: start with React's built-ins. Add a library when you
        feel pain. When you do add a library, pick one from the established consensus --
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
