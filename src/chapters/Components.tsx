import { useState } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

function BuggyUserList() {
  const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }, { id: 4, name: 'Diana' }];
  const [filter, setFilter] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Type to filter..." style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', marginBottom: '0.5rem', width: '100%' }} />
      <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
        {filtered.map((user, index) => <li key={index} style={{ padding: '0.15rem 0' }}>{user.name} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>(key={index})</span></li>)}
      </ul>
      <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem' }}>⚠ Try filtering then clearing — indices shift and React confuses elements</p>
    </div>
  );
}

function FixedUserList() {
  const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }, { id: 4, name: 'Diana' }];
  const [filter, setFilter] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Type to filter..." style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', marginBottom: '0.5rem', width: '100%' }} />
      <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
        {filtered.map(user => <li key={user.id} style={{ padding: '0.15rem 0' }}>{user.name} <span style={{ color: 'var(--color-success)', fontSize: '0.75rem' }}>(key={user.id})</span></li>)}
      </ul>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.5rem' }}>✓ Stable keys — React correctly tracks each element</p>
    </div>
  );
}

export default function Components() {
  return (
    <ChapterLayout id="components">
      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Single-File Components vs. Function Components
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        In Svelte, every component lives in its own <code>.svelte</code> file with three distinct
        regions: <code>&lt;script&gt;</code> for logic, the template for markup, and <code>&lt;style&gt;</code> for
        scoped CSS. This separation-within-a-file is a defining feature of Svelte's developer
        experience.
      </p>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        React takes a different approach. A component is simply a JavaScript function that returns
        JSX. There are no special file formats, no template regions, and no built-in scoped styling.
        Everything is JavaScript (or TypeScript), and JSX is a syntax extension that compiles to
        function calls.
      </p>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Basic Component with Props
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Props are the primary interface for passing data into a component. Both frameworks
        support TypeScript for prop types, but the declaration syntax differs significantly.
      </p>

      <CodeComparison
        svelte={{
          code: `<script lang="ts">
  interface Props {
    name: string;
    greeting?: string;
    count: number;
  }

  let {
    name,
    greeting = 'Hello',
    count
  }: Props = $props();
</script>

<div class="card">
  <h2>{greeting}, {name}!</h2>
  <p>You have {count} messages.</p>
</div>

<style>
  .card {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
</style>`,
          filename: 'UserCard.svelte',
          highlight: [8, 9, 10, 11, 12],
        }}
        react={{
          code: `interface UserCardProps {
  name: string;
  greeting?: string;
  count: number;
}

export default function UserCard({
  name,
  greeting = 'Hello',
  count,
}: UserCardProps) {
  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
    }}>
      <h2>{greeting}, {name}!</h2>
      <p>You have {count} messages.</p>
    </div>
  );
}`,
          filename: 'UserCard.tsx',
          highlight: [7, 8, 9, 10, 11],
        }}
        note="Svelte 5's $props() rune with destructuring is remarkably similar to React's destructured props. Default values use the same JavaScript destructuring syntax in both. The biggest visual difference is the style approach."
      />

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Component with Local State
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        When a component needs to manage its own state, the patterns diverge more noticeably.
        Svelte uses the <code>$state</code> rune for reactive variables. React uses
        the <code>useState</code> hook, which returns a tuple of the current value and a setter
        function.
      </p>

      <CodeComparison
        svelte={{
          code: `<script lang="ts">
  let isExpanded = $state(false);
  let inputValue = $state('');

  let charCount = $derived(inputValue.length);

  function toggle() {
    isExpanded = !isExpanded;
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    inputValue = target.value;
  }
</script>

<button on:click={toggle}>
  {isExpanded ? 'Collapse' : 'Expand'}
</button>

{#if isExpanded}
  <div class="panel">
    <input value={inputValue} on:input={handleInput} />
    <p>{charCount} characters</p>
  </div>
{/if}`,
          filename: 'ExpandableInput.svelte',
          highlight: [2, 3, 5, 8],
        }}
        react={{
          code: `import { useState, useMemo } from 'react';

export default function ExpandableInput() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const charCount = useMemo(
    () => inputValue.length,
    [inputValue]
  );

  function toggle() {
    setIsExpanded(prev => !prev);
  }

  return (
    <>
      <button onClick={toggle}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>

      {isExpanded && (
        <div className="panel">
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <p>{charCount} characters</p>
        </div>
      )}
    </>
  );
}`,
          filename: 'ExpandableInput.tsx',
          highlight: [4, 5, 7, 8, 9, 13],
        }}
        note="Notice: $derived becomes useMemo with an explicit dependency array. The toggle function uses a functional updater (prev => !prev) instead of direct assignment. The input uses onChange (not on:input) and e.target.value is typed automatically in React's ChangeEvent."
      />

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        JSX Is Just JavaScript
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        This is one of React's most powerful -- and initially disorienting -- design decisions.
        Svelte has its own template syntax with dedicated block constructs
        like <code>{'{#if}'}</code>, <code>{'{#each}'}</code>, and <code>{'{#await}'}</code>.
        React has none of these. Instead, JSX lets you use any JavaScript expression inline.
      </p>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        This means conditional rendering uses ternary operators or logical AND, iteration
        uses <code>.map()</code>, and any JavaScript expression can appear inside curly braces.
        There is no special syntax to learn -- if you know JavaScript, you know JSX.
      </p>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
        Conditional Rendering
      </h3>

      <CodeComparison
        svelte={{
          code: `{#if status === 'loading'}
  <Spinner />
{:else if status === 'error'}
  <ErrorMessage message={error} />
{:else}
  <DataTable data={data} />
{/if}`,
          filename: 'Conditional.svelte',
        }}
        react={{
          code: `{/* Ternary for if/else */}
{status === 'loading' ? (
  <Spinner />
) : status === 'error' ? (
  <ErrorMessage message={error} />
) : (
  <DataTable data={data} />
)}

{/* Or extract to a function for readability */}
function renderContent() {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <ErrorMessage message={error} />;
  return <DataTable data={data} />;
}

// In the return:
{renderContent()}`,
          filename: 'Conditional.tsx',
        }}
        note="Nested ternaries can become hard to read. A common React pattern is to extract complex conditionals into a helper function or an early return. Svelte's block syntax is more readable for multi-branch conditions."
      />

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
        List Rendering
      </h3>

      <CodeComparison
        svelte={{
          code: `<script>
  let users = $state([
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' },
    { id: 3, name: 'Charlie', role: 'User' },
  ]);
</script>

<ul>
  {#each users as user (user.id)}
    <li>
      <strong>{user.name}</strong> - {user.role}
    </li>
  {/each}
</ul>

<!-- With index -->
{#each users as user, index (user.id)}
  <li>{index + 1}. {user.name}</li>
{/each}`,
          filename: 'UserList.svelte',
          highlight: [10, 18],
        }}
        react={{
          code: `import { useState } from 'react';

export default function UserList() {
  const [users] = useState([
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' },
    { id: 3, name: 'Charlie', role: 'User' },
  ]);

  return (
    <>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.role}
          </li>
        ))}
      </ul>

      {/* With index */}
      {users.map((user, index) => (
        <li key={user.id}>{index + 1}. {user.name}</li>
      ))}
    </>
  );
}`,
          filename: 'UserList.tsx',
          highlight: [13, 14, 21, 22],
        }}
        note="Svelte's (user.id) keyed each block becomes React's key={user.id} prop. The key prop is critical for React's diffing algorithm -- without it, React falls back to index-based reconciliation which can cause bugs with stateful list items."
      />

      <Callout type="info" title="JSX Compiles to Function Calls">
        JSX is not HTML -- it is syntactic sugar for <code>React.createElement()</code> calls.
        When you write <code>&lt;button onClick={'{fn}'}&gt;Click&lt;/button&gt;</code>,
        the compiler transforms it into <code>React.createElement('button', {'{ onClick: fn }'}, 'Click')</code>.
        This is why JSX uses <code>className</code> instead of <code>class</code> (it is a
        JavaScript property name) and <code>htmlFor</code> instead of <code>for</code>. Understanding
        this helps demystify JSX behavior and error messages.
      </Callout>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Boolean Attributes and Short-Circuit Gotchas
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        A common pattern in both frameworks is conditionally rendering content. React uses the
        logical AND operator (<code>&&</code>), but there is a subtle trap that catches many
        developers.
      </p>

      <CodeBlock
        code={`// GOTCHA: Rendering 0 instead of nothing
function MessageCount({ count }: { count: number }) {
  return (
    <div>
      {/* BUG: When count is 0, this renders "0" not nothing */}
      {count && <span>{count} new messages</span>}

      {/* FIX: Explicitly convert to boolean */}
      {count > 0 && <span>{count} new messages</span>}

      {/* ALTERNATIVE: Use a ternary */}
      {count ? <span>{count} new messages</span> : null}
    </div>
  );
}`}
        language="tsx"
        filename="short-circuit-gotcha.tsx"
        highlight={[6, 9, 12]}
      />

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        In Svelte, <code>{'{#if count}'}</code> simply does not render the block when count is 0.
        In JSX, <code>{'{count && <span>...</span>}'}</code> evaluates to <code>0</code> (a falsy but
        renderable value), which React will render as the text "0" in the DOM. This is because
        JavaScript's <code>&&</code> returns the first falsy operand, and React renders numbers.
      </p>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        File Organization: One Component vs. Many
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Svelte enforces a strict one-component-per-file rule. Each <code>.svelte</code> file is
        exactly one component. React has no such constraint. A single <code>.tsx</code> file can
        export multiple components, helper functions, types, and constants.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Icon.svelte -->
<script lang="ts">
  let { name, size = 24 }: {
    name: string;
    size?: number;
  } = $props();
</script>

<svg width={size} height={size}>
  <use href="#icon-{name}" />
</svg>

<!-- IconButton.svelte (separate file!) -->
<script lang="ts">
  import Icon from './Icon.svelte';

  let { icon, label, onclick }: {
    icon: string;
    label: string;
    onclick: () => void;
  } = $props();
</script>

<button on:click={onclick}>
  <Icon name={icon} size={16} />
  <span>{label}</span>
</button>`,
          filename: 'Icon.svelte + IconButton.svelte',
        }}
        react={{
          code: `// Both components in one file

interface IconProps {
  name: string;
  size?: number;
}

function Icon({ name, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size}>
      <use href={\`#icon-\${name}\`} />
    </svg>
  );
}

interface IconButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button onClick={onClick}>
      <Icon name={icon} size={16} />
      <span>{label}</span>
    </button>
  );
}

// Icon is private to this file
// Only IconButton is exported`,
          filename: 'IconButton.tsx',
          highlight: [8, 22, 31, 32],
        }}
        note="React's file organization is flexible. Small helper components often live in the same file as their parent. Only export what other files need. This reduces file count and keeps tightly coupled components together."
      />

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
        When to Split Files in React
      </h3>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        There is no hard rule, but common conventions include: split when a component is reused
        across multiple files, split when a file exceeds roughly 200-300 lines, and split when
        a component has its own complex state or side effects. Co-located helper components that
        are only used by their parent are fine to keep in the same file.
      </p>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Fragments: Wrapping Without a Wrapper
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        In Svelte, a component's template can have multiple root elements naturally. React
        requires a single root element from every component's return statement. Fragments solve
        this by providing an invisible wrapper.
      </p>

      <CodeComparison
        svelte={{
          code: `<script lang="ts">
  let { title, subtitle }: {
    title: string;
    subtitle: string;
  } = $props();
</script>

<!-- Multiple root elements: just works -->
<h1>{title}</h1>
<p>{subtitle}</p>
<hr />`,
          filename: 'Header.svelte',
          highlight: [9, 10, 11],
        }}
        react={{
          code: `interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  // Must return a single root element
  // Fragment (<></>) wraps without adding DOM nodes
  return (
    <>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <hr />
    </>
  );

  // Long form: <React.Fragment>...</React.Fragment>
  // Use long form when you need a key prop:
  // <Fragment key={id}>...</Fragment>
}`,
          filename: 'Header.tsx',
          highlight: [10, 14],
        }}
        note="The short fragment syntax <></> is syntactic sugar for <React.Fragment>. Use the long form <Fragment key={id}> when you need to add a key prop, such as inside a .map() call."
      />

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Children: React's Answer to Slots
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Svelte uses <code>&lt;slot /&gt;</code> for content projection. React uses the
        implicit <code>children</code> prop. Named slots in Svelte map to named props in React.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Card.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { header, children, footer }: {
    header: Snippet;
    children: Snippet;
    footer?: Snippet;
  } = $props();
</script>

<div class="card">
  <div class="card-header">
    {@render header()}
  </div>
  <div class="card-body">
    {@render children()}
  </div>
  {#if footer}
    <div class="card-footer">
      {@render footer()}
    </div>
  {/if}
</div>`,
          filename: 'Card.svelte',
          highlight: [5, 6, 7, 8, 14, 17, 21],
        }}
        react={{
          code: `import { ReactNode } from 'react';

interface CardProps {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Card({
  header,
  children,
  footer,
}: CardProps) {
  return (
    <div className="card">
      <div className="card-header">
        {header}
      </div>
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

// Usage:
// <Card
//   header={<h2>Title</h2>}
//   footer={<button>Save</button>}
// >
//   <p>Card body content goes here</p>
// </Card>`,
          filename: 'Card.tsx',
          highlight: [4, 5, 6, 17, 20, 24],
        }}
        note="Svelte 5's Snippet type for named slots maps directly to React's ReactNode prop type. The children prop is special -- JSX nested inside a component tag is automatically passed as children."
      />

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Class and Style Differences
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        A few syntactic differences in JSX trip up every Svelte developer. JSX uses JavaScript
        property names, not HTML attribute names. Here are the key differences.
      </p>

      <CodeBlock
        code={`// HTML attribute → JSX prop
class       → className
for         → htmlFor
tabindex    → tabIndex
readonly    → readOnly
maxlength   → maxLength

// Styles: string → object with camelCase properties
// Svelte:  style="font-size: 14px; background-color: red;"
// React:   style={{ fontSize: '14px', backgroundColor: 'red' }}

// Boolean attributes
// Svelte:  <input disabled />
// React:   <input disabled />  (same!)
// React:   <input disabled={isDisabled} />  (dynamic)

// Event handlers: lowercase → camelCase
// Svelte:  on:click, on:mouseover, on:keydown
// React:   onClick, onMouseOver, onKeyDown

// data-* and aria-* attributes keep their kebab-case
// <div data-testid="my-id" aria-label="Close" />`}
        language="tsx"
        filename="jsx-differences.tsx"
      />

      <Callout type="gotcha" title="class vs className">
        Using <code>class</code> instead of <code>className</code> in JSX is the single most
        common syntax error when transitioning from Svelte. Modern React (since v19) actually
        accepts <code>class</code> as well, but <code>className</code> remains the conventional
        and recommended usage. Your linter will flag <code>class</code> in JSX.
      </Callout>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Template Syntax: Complete Reference
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Here is a comprehensive mapping of Svelte's template syntax to JSX equivalents.
        Keep this table handy during your first weeks writing React.
      </p>

      <ComparisonTable
        headers={['Svelte Template', 'JSX Equivalent', 'Notes']}
        rows={[
          [
            '{expression}',
            '{expression}',
            'Identical syntax for interpolation',
          ],
          [
            '{#if cond}...{/if}',
            '{cond && <.../>}',
            'Logical AND for simple conditionals',
          ],
          [
            '{#if cond}...{:else}...{/if}',
            '{cond ? <A/> : <B/>}',
            'Ternary operator for if/else',
          ],
          [
            '{#each arr as item (key)}',
            '{arr.map(item => <X key={key}/>)}',
            'Array.map() with explicit key prop',
          ],
          [
            '{#each arr as item, i}',
            '{arr.map((item, i) => ...)}',
            'Index available as second param of map',
          ],
          [
            '{@html rawHtml}',
            'dangerouslySetInnerHTML={{__html: raw}}',
            'React naming emphasizes the XSS risk',
          ],
          [
            '{@render snippet()}',
            '{prop} or {children}',
            'Snippets become ReactNode props',
          ],
          [
            'on:click={handler}',
            'onClick={handler}',
            'camelCase event names, no colon',
          ],
          [
            'on:click|preventDefault',
            'onClick={e => { e.preventDefault(); ... }}',
            'No event modifiers; handle in the callback',
          ],
          [
            'on:click|stopPropagation',
            'onClick={e => { e.stopPropagation(); ... }}',
            'Must call methods explicitly',
          ],
          [
            'bind:value={val}',
            'value={val} onChange={...}',
            'Two-way binding becomes value + handler pair',
          ],
          [
            'bind:this={ref}',
            'ref={myRef}',
            'useRef() hook instead of let variable',
          ],
          [
            'class:active={isActive}',
            'className={isActive ? "active" : ""}',
            'No directive; use string interpolation or clsx',
          ],
          [
            'style:color={val}',
            'style={{ color: val }}',
            'Object with camelCase properties',
          ],
          [
            'transition:fade',
            'No built-in; use Framer Motion / react-spring',
            'React has no built-in transitions',
          ],
          [
            'use:action',
            'Custom hook + ref',
            'Actions become hooks with useRef and useEffect',
          ],
        ]}
        caption="Svelte Template Syntax to JSX: Complete Reference"
      />

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
        Putting It Together: A Realistic Component
      </h2>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Let us look at a more complete component that combines several of these concepts: props,
        local state, conditional rendering, list iteration, event handling, and composition.
      </p>

      <CodeComparison
        svelte={{
          code: `<script lang="ts">
  interface Todo {
    id: number;
    text: string;
    done: boolean;
  }

  let { title = 'My Todos' }: { title?: string } = $props();

  let todos = $state<Todo[]>([]);
  let input = $state('');

  function addTodo() {
    if (!input.trim()) return;
    todos.push({
      id: Date.now(),
      text: input,
      done: false,
    });
    input = '';
  }

  function toggleTodo(id: number) {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  }

  let remaining = $derived(
    todos.filter(t => !t.done).length
  );
</script>

<div>
  <h2>{title}</h2>
  <form on:submit|preventDefault={addTodo}>
    <input bind:value={input} placeholder="New todo" />
    <button type="submit">Add</button>
  </form>
  <ul>
    {#each todos as todo (todo.id)}
      <li class:done={todo.done}>
        <input
          type="checkbox"
          checked={todo.done}
          on:change={() => toggleTodo(todo.id)}
        />
        {todo.text}
      </li>
    {/each}
  </ul>
  <p>{remaining} remaining</p>
</div>`,
          filename: 'TodoList.svelte',
        }}
        react={{
          code: `import { useState, useMemo, FormEvent } from 'react';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TodoListProps {
  title?: string;
}

export default function TodoList({ title = 'My Todos' }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  function addTodo(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text: input, done: false },
    ]);
    setInput('');
  }

  function toggleTodo(id: number) {
    setTodos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  }

  const remaining = useMemo(
    () => todos.filter(t => !t.done).length,
    [todos]
  );

  return (
    <div>
      <h2>{title}</h2>
      <form onSubmit={addTodo}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="New todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              textDecoration: todo.done ? 'line-through' : 'none',
            }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.text}
          </li>
        ))}
      </ul>
      <p>{remaining} remaining</p>
    </div>
  );
}`,
          filename: 'TodoList.tsx',
        }}
        note="The React version is longer primarily because of immutable state updates (spreading arrays and objects) and the explicit onChange handlers. The logic is identical -- only the expression style differs."
      />

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Study this side-by-side carefully. Every significant difference between Svelte and React
        components is visible here: the <code>[value, setter]</code> tuple pattern, immutable
        array updates with spread and <code>.map()</code>, explicit event prevention
        instead of <code>|preventDefault</code>, and controlled inputs
        with <code>value</code> + <code>onChange</code> instead of <code>bind:value</code>.
      </p>

      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        In the next chapter, we will explore props and state in depth -- including prop drilling
        vs. context, state lifting, and how React's unidirectional data flow compares to Svelte's
        two-way binding capabilities.
      </p>

      <CodeExercise
        id="components-fix-key"
        title="Fix the List Key"
        type="fix-the-bug"
        description="This filterable list uses array index as the key prop. When items are filtered, React confuses which elements changed. Fix the key to use a stable identifier."
        initialCode={`function UserList({ users }) {
  const [filter, setFilter] = useState('');
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(filter)
  );

  return (
    <div>
      <input onChange={e => setFilter(e.target.value)} />
      <ul>
        {filtered.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}`}
        solution={`function UserList({ users }) {
  const [filter, setFilter] = useState('');
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(filter)
  );

  return (
    <div>
      <input onChange={e => setFilter(e.target.value)} />
      <ul>
        {filtered.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}`}
        validationPatterns={["key={user.id}"]}
        hints={[
          "Array indices change when items are filtered, added, or removed",
          "Use a stable, unique identifier from the data itself",
          "Replace key={index} with key={user.id}"
        ]}
        buggyPreview={<BuggyUserList />}
        solvedPreview={<FixedUserList />}
      />
    </ChapterLayout>
  );
}
