import { useState, type ReactNode } from 'react';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { ChapterLayout } from '../components/ChapterLayout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

// -- Interactive Card Demo with header/body/footer slots --

function SlotCard({
  header,
  children,
  footer,
}: {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--color-bg-tertiary)',
      }}
    >
      {header && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--color-border)',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'var(--color-text)',
            background: 'var(--color-surface)',
          }}
        >
          {header}
        </div>
      )}
      <div
        style={{
          padding: '1.25rem',
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

function CardSlotDemo() {
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    border: active ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
    background: active ? 'rgba(56, 189, 248, 0.12)' : 'var(--color-bg-tertiary)',
    color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setShowHeader(h => !h)} style={btnStyle(showHeader)}>
          {showHeader ? 'Hide' : 'Show'} Header
        </button>
        <button onClick={() => setShowFooter(f => !f)} style={btnStyle(showFooter)}>
          {showFooter ? 'Hide' : 'Show'} Footer
        </button>
      </div>
      <SlotCard
        header={
          showHeader ? (
            <span>Card Title (header prop)</span>
          ) : undefined
        }
        footer={
          showFooter ? (
            <>
              <button
                style={{
                  padding: '0.4rem 0.85rem',
                  background: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: '0.4rem 0.85rem',
                  background: 'var(--color-accent)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                Confirm
              </button>
            </>
          ) : undefined
        }
      >
        This is the body content passed as <strong>children</strong>. The header and footer
        are separate named props that accept any JSX. Toggle the buttons above to see how
        the card adapts when slots are present or absent.
      </SlotCard>
    </div>
  );
}

const cardSlotDemoCode = `function Card({ header, children, footer }) {
  return (
    <div className="card">
      {header && (
        <div className="card-header">{header}</div>
      )}
      <div className="card-body">{children}</div>
      {footer && (
        <div className="card-footer">{footer}</div>
      )}
    </div>
  );
}

// Usage — named props replace named slots
<Card
  header={<h3>Card Title</h3>}
  footer={
    <>
      <button>Cancel</button>
      <button>Confirm</button>
    </>
  }
>
  <p>This is the body content (children).</p>
</Card>`;

export default function SlotsChildren() {
  return (
    <ChapterLayout id="slots-children">
      <p style={pStyle}>
        Component composition is what makes UI frameworks useful. You build small pieces, then
        combine them into larger structures by passing content into them. Svelte handles this
        with the <code>&lt;slot&gt;</code> element, borrowed from the Web Components spec. React
        has no slot concept at all. Instead, it treats everything as a prop -- including the
        content between a component's opening and closing tags, which arrives as the special
        <code> children</code> prop. This chapter maps every slot pattern you know from Svelte
        to its React equivalent and introduces render props, a powerful React pattern that has
        no direct Svelte parallel.
      </p>

      {/* ===== Default Slot vs children ===== */}
      <h2 style={h2Style}>Default Slot vs children</h2>
      <p style={pStyle}>
        Svelte's default <code>&lt;slot /&gt;</code> is the placeholder where parent-provided
        content is rendered inside a child component. In React, that content automatically becomes
        the <code>children</code> prop. You do not need to declare it explicitly (though you can
        type it as <code>ReactNode</code> in TypeScript). Just render <code>{'{children}'}</code>
        wherever the content should appear.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: default slot -->
<script>
  let { class: className = '' } = $props();
</script>

<div class="card {className}">
  <slot />
</div>

<!-- Fallback content -->
<div class="card">
  <slot>No content provided.</slot>
</div>

<!-- Usage -->
<Card>
  <p>Hello from the parent!</p>
</Card>`,
          filename: 'Card.svelte',
          highlight: [7, 12],
        }}
        react={{
          code: `import { ReactNode } from 'react';

// children is just another prop
function Card({ className = '', children }: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={\`card \${className}\`}>
      {children ?? 'No content provided.'}
    </div>
  );
}

// Usage — content between tags becomes children
<Card>
  <p>Hello from the parent!</p>
</Card>`,
          filename: 'Card.tsx',
          highlight: [4, 10],
        }}
        note="Svelte's fallback slot content (<slot>Fallback</slot>) maps to the nullish coalescing operator (??) or a simple conditional on children in React."
      />

      {/* ===== Named Slots vs Named Props ===== */}
      <h2 style={h2Style}>Named Slots vs Named Props</h2>
      <p style={pStyle}>
        Svelte provides named slots via <code>&lt;slot name="header" /&gt;</code> and consumers
        fill them with <code>slot="header"</code> or <code>&lt;svelte:fragment slot="header"&gt;</code>.
        React has no named slot mechanism. Instead, you define additional props that accept
        <code> ReactNode</code>. The names are up to you -- <code>header</code>, <code>footer</code>,
        <code>sidebar</code>, <code>icon</code>, whatever makes sense for your component's API.
        This is arguably more flexible because there is no special syntax to learn: it is just props.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: named slots -->
<script>
  let { title } = $props();
</script>

<div class="layout">
  <header>
    <slot name="header" />
  </header>
  <main>
    <slot />
  </main>
  <footer>
    <slot name="footer">
      <p>Default footer</p>
    </slot>
  </footer>
</div>

<!-- Usage -->
<Layout title="Dashboard">
  <svelte:fragment slot="header">
    <nav>Navigation here</nav>
  </svelte:fragment>

  <p>Main content goes here.</p>

  <svelte:fragment slot="footer">
    <p>Custom footer</p>
  </svelte:fragment>
</Layout>`,
          filename: 'Layout.svelte',
          highlight: [8, 11, 14],
        }}
        react={{
          code: `import { ReactNode } from 'react';

// Named "slots" are just props
function Layout({
  header,
  children,
  footer = <p>Default footer</p>,
}: {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="layout">
      {header && <header>{header}</header>}
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  );
}

// Usage — each "slot" is a prop
<Layout
  header={<nav>Navigation here</nav>}
  footer={<p>Custom footer</p>}
>
  <p>Main content goes here.</p>
</Layout>`,
          filename: 'Layout.tsx',
          highlight: [5, 6, 7, 15, 16, 17],
        }}
        note="Named slots become named props. Default slot content becomes a default parameter value. The pattern is identical to how you pass any other prop -- because in React, ReactNode is just another type."
      />

      {/* ===== Render Props ===== */}
      <h2 style={h2Style}>Render Props</h2>
      <p style={pStyle}>
        Here is where React diverges significantly from Svelte. A render prop is a prop whose
        value is a function that returns JSX. The component calls this function, often passing
        data as arguments, and renders whatever the function returns. This is a pattern of
        inversion of control: the child component owns the data or behavior, but the parent
        decides how to render it. This pattern has no direct Svelte equivalent -- it relies
        on the fact that React components are just functions and JSX is just function calls.
      </p>

      <h3 style={h3Style}>Basic Render Prop</h3>
      <p style={pStyle}>
        The simplest render prop pattern passes a function as <code>children</code>. The
        component calls <code>children(someData)</code> instead of just rendering
        <code> {'{children}'}</code>. The parent provides a function that receives the data
        and returns JSX.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte has no direct equivalent.
     The closest is slot props (see below).
     Render props rely on functions-as-children,
     which is a React-specific pattern. -->

<!-- You might achieve something similar
     with a Snippet in Svelte 5: -->
<script>
  import type { Snippet } from 'svelte';

  let { children }: {
    children: Snippet<[{ x: number; y: number }]>;
  } = $props();

  let pos = $state({ x: 0, y: 0 });

  function handleMove(e) {
    pos = { x: e.clientX, y: e.clientY };
  }
</script>

<div onpointermove={handleMove}>
  {@render children(pos)}
</div>`,
          filename: 'MouseTracker.svelte',
          highlight: [11, 12, 23],
        }}
        react={{
          code: `import { useState, ReactNode } from 'react';

// children is a FUNCTION, not a ReactNode
function MouseTracker({ children }: {
  children: (pos: { x: number; y: number }) => ReactNode;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      onPointerMove={e =>
        setPos({ x: e.clientX, y: e.clientY })
      }
      style={{ height: 200, border: '1px solid #444' }}
    >
      {children(pos)}
    </div>
  );
}

// Usage — parent decides rendering
<MouseTracker>
  {({ x, y }) => (
    <p>Mouse is at ({x}, {y})</p>
  )}
</MouseTracker>`,
          filename: 'MouseTracker.tsx',
          highlight: [4, 5, 16, 23, 24, 25],
        }}
        note="The render prop pattern lets a child component supply data while the parent controls presentation. In Svelte 5, Snippets with arguments achieve something similar, but the pattern originated in React."
      />

      <h3 style={h3Style}>Named Render Props</h3>
      <p style={pStyle}>
        A render prop does not have to be <code>children</code>. You can use any prop name.
        This is especially useful when a component needs multiple render functions for
        different parts of its UI.
      </p>

      <CodeBlock
        code={`// Named render props for a data table
function DataTable<T>({
  data,
  renderHeader,
  renderRow,
  renderEmpty,
}: {
  data: T[];
  renderHeader: () => ReactNode;
  renderRow: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
}) {
  if (data.length === 0 && renderEmpty) {
    return renderEmpty();
  }

  return (
    <table>
      <thead>{renderHeader()}</thead>
      <tbody>
        {data.map((item, i) => renderRow(item, i))}
      </tbody>
    </table>
  );
}

// Usage
<DataTable
  data={users}
  renderHeader={() => (
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
  )}
  renderRow={(user, i) => (
    <tr key={user.id}>
      <td>{user.name}</td>
      <td>{user.email}</td>
    </tr>
  )}
  renderEmpty={() => <p>No users found.</p>}
/>`}
        language="tsx"
        filename="DataTable.tsx"
        highlight={[9, 10, 11]}
      />

      {/* ===== Slot Props vs Render Props ===== */}
      <h2 style={h2Style}>Slot Props vs Render Prop Functions</h2>
      <p style={pStyle}>
        Svelte's slot props (the <code>let:</code> directive in Svelte 4, or snippet arguments
        in Svelte 5) allow a child component to expose data back to the parent through the slot.
        This is conceptually the same as React's render prop pattern -- the child owns the data
        and the parent decides how to render it. The difference is syntactic: Svelte uses
        template directives, while React uses plain function calls.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte 4: slot props with let: -->
<script>
  let { items } = $props();
  let hoveredIndex = $state(-1);
</script>

{#each items as item, i}
  <div
    on:mouseenter={() => hoveredIndex = i}
    on:mouseleave={() => hoveredIndex = -1}
  >
    <slot {item} hovered={hoveredIndex === i} />
  </div>
{/each}

<!-- Usage -->
<HoverList {items}>
  <div slot="default" let:item let:hovered>
    <span class:highlighted={hovered}>
      {item.name}
    </span>
  </div>
</HoverList>`,
          filename: 'HoverList.svelte',
          highlight: [12, 18],
        }}
        react={{
          code: `import { useState, ReactNode } from 'react';

// Render prop receives item + hovered state
function HoverList<T>({ items, children }: {
  items: T[];
  children: (item: T, hovered: boolean) => ReactNode;
}) {
  const [hoveredIndex, setHoveredIndex] =
    useState(-1);

  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(-1)}
        >
          {children(item, hoveredIndex === i)}
        </div>
      ))}
    </>
  );
}

// Usage
<HoverList items={items}>
  {(item, hovered) => (
    <span style={{
      background: hovered ? '#333' : 'transparent'
    }}>
      {item.name}
    </span>
  )}
</HoverList>`,
          filename: 'HoverList.tsx',
          highlight: [6, 19, 28],
        }}
        note="Svelte's let:item and let:hovered become function parameters in React. The child exposes data by calling the function with arguments; the parent receives them and returns JSX."
      />

      <Callout type="insight" title="Everything Is a Prop">
        React's "everything is a prop" philosophy means slots, named slots, and slot props all
        collapse into a single concept: props that can be any type, including ReactNode or
        functions. There is no separate template language for composition. A "slot" is a prop
        typed as <code>ReactNode</code>. A "named slot" is a named prop typed as <code>ReactNode</code>.
        A "slot prop" is a prop typed as a function that returns <code>ReactNode</code>. Once you
        see this, React's composition model becomes remarkably simple.
      </Callout>

      {/* ===== Conditional Slots ===== */}
      <h2 style={h2Style}>Conditional Slots and Fallbacks</h2>
      <p style={pStyle}>
        In Svelte, you can check whether a slot was provided using the <code>$$slots</code> object
        (Svelte 4) or by checking the snippet prop (Svelte 5). In React, since slots are just
        props, you check them the same way you check any prop -- with a simple truthiness check.
        This makes conditional rendering of optional sections straightforward.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte 4 -->
<div class="alert">
  {#if $$slots.icon}
    <div class="alert-icon">
      <slot name="icon" />
    </div>
  {/if}
  <div class="alert-body">
    <slot />
  </div>
</div>

<!-- Svelte 5 -->
<script>
  import type { Snippet } from 'svelte';
  let { icon, children }: {
    icon?: Snippet;
    children: Snippet;
  } = $props();
</script>

<div class="alert">
  {#if icon}
    <div class="alert-icon">
      {@render icon()}
    </div>
  {/if}
  <div class="alert-body">
    {@render children()}
  </div>
</div>`,
          filename: 'Alert.svelte',
          highlight: [3, 24],
        }}
        react={{
          code: `import { ReactNode } from 'react';

function Alert({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="alert">
      {icon && (
        <div className="alert-icon">{icon}</div>
      )}
      <div className="alert-body">
        {children}
      </div>
    </div>
  );
}

// Usage
<Alert icon={<WarningIcon />}>
  Something went wrong!
</Alert>

// Without icon — the section won't render
<Alert>All systems operational.</Alert>`,
          filename: 'Alert.tsx',
          highlight: [7, 12],
        }}
        note="Checking for $$slots.icon in Svelte becomes a simple {icon && ...} in React. Because props are plain values, truthiness checks are all you need."
      />

      {/* ===== Interactive Demo ===== */}
      <h2 style={h2Style}>Interactive Demo</h2>
      <p style={pStyle}>
        This demo shows a <code>Card</code> component with three composition zones: a header
        (named prop), body (children), and footer (named prop). Toggle the header and footer
        on and off to see how the component adapts. In Svelte, these would be named slots. In
        React, they are just props typed as <code>ReactNode</code>.
      </p>

      <InteractiveDemo title="Card with Header / Body / Footer Slots" code={cardSlotDemoCode}>
        <CardSlotDemo />
      </InteractiveDemo>

      {/* ===== Compound Components ===== */}
      <h2 style={h2Style}>Compound Components: An Alternative to Slots</h2>
      <p style={pStyle}>
        React has another composition pattern that does not exist in Svelte: compound components.
        Instead of passing content through props, you compose components as direct children and
        the parent component scans its children to arrange them. Libraries like Radix UI and
        Headless UI use this pattern extensively.
      </p>

      <CodeBlock
        code={`// Compound component pattern
function Card({ children }: { children: ReactNode }) {
  return <div className="card">{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="card-header">{children}</div>;
};

Card.Body = function CardBody({ children }: { children: ReactNode }) {
  return <div className="card-body">{children}</div>;
};

Card.Footer = function CardFooter({ children }: { children: ReactNode }) {
  return <div className="card-footer">{children}</div>;
};

// Usage — reads like a natural hierarchy
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content goes here.</Card.Body>
  <Card.Footer>
    <button>Save</button>
  </Card.Footer>
</Card>`}
        language="tsx"
        filename="CompoundCard.tsx"
        highlight={[6, 10, 14]}
      />

      <p style={pStyle}>
        This pattern is especially powerful when the child components need to share implicit
        state through React Context. For example, a <code>Tabs</code> component might expose
        <code> Tabs.List</code>, <code>Tabs.Tab</code>, and <code>Tabs.Panel</code> as compound
        children that coordinate which tab is active without the consumer needing to manage any
        state.
      </p>

      {/* ===== Comparison Table ===== */}
      <h2 style={h2Style}>Slots and Composition at a Glance</h2>

      <ComparisonTable
        caption="Svelte Slots vs React Composition Patterns"
        headers={['Pattern', 'Svelte', 'React']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['Default slot', '<slot />', '{children}'],
          ['Named slot', '<slot name="header" />', 'header prop (ReactNode)'],
          ['Slot fallback', '<slot>Fallback</slot>', '{children ?? "Fallback"}'],
          ['Slot props', 'let:item on slot', 'Render prop: children(item)'],
          ['Check slot exists', '$$slots.name / if snippet', '{prop && <div>{prop}</div>}'],
          ['Named content', '<svelte:fragment slot="x">', 'header={<Nav />}'],
          ['Function composition', 'Snippets (Svelte 5)', 'Render props / function as children'],
          ['Compound components', 'Not idiomatic', 'Card.Header / Card.Body pattern'],
          ['Content projection', 'Compiler-based slots', 'Runtime props (ReactNode)'],
          ['Multiple children areas', 'Multiple named slots', 'Multiple named props'],
        ]}
      />

      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        Coming from Svelte, the lack of a <code>&lt;slot&gt;</code> element in React might feel
        like a missing feature. In practice, it is a simplification. React does not need a
        separate composition syntax because its composition mechanism is the same as its data
        passing mechanism: props. Default content is <code>children</code>. Named content is
        named props. Data flowing back from child to parent during rendering is a function prop.
        Once you internalize this, you will find that React's approach is extremely flexible --
        you can pass anything as a prop, including entire component trees, functions that return
        component trees, or even components themselves. The trade-off is that React does not
        provide the guardrails that Svelte's slot system offers (like compile-time checks for
        slot names), but the flexibility more than compensates in complex component architectures.
      </p>
    </ChapterLayout>
  );
}
