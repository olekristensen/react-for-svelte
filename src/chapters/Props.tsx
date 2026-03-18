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

// -- Interactive Card Demo Components --
function DemoCard({
  title,
  variant = 'default',
  children,
}: {
  title: string;
  variant?: 'default' | 'outlined' | 'elevated';
  children: ReactNode;
}) {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'var(--color-bg-tertiary)',
      border: '1px solid var(--color-border)',
    },
    outlined: {
      background: 'transparent',
      border: '2px solid var(--color-accent)',
    },
    elevated: {
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
  };

  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        ...variantStyles[variant],
      }}
    >
      <h4
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--color-text)',
        }}
      >
        {title}
      </h4>
      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}

function CardDemo() {
  const [variant, setVariant] = useState<'default' | 'outlined' | 'elevated'>('default');

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['default', 'outlined', 'elevated'] as const).map(v => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: variant === v ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              background: variant === v ? 'rgba(56, 189, 248, 0.12)' : 'var(--color-bg-tertiary)',
              color: variant === v ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              textTransform: 'capitalize',
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <DemoCard title="Example Card" variant={variant}>
        This card accepts <strong>title</strong>, <strong>variant</strong>, and{' '}
        <strong>children</strong> as props. Toggle the variant buttons above to see how the
        same component renders differently based on the variant prop.
      </DemoCard>
    </div>
  );
}

const cardDemoCode = `function Card({ title, variant = 'default', children }) {
  const variantStyles = {
    default: {
      background: 'var(--color-bg-tertiary)',
      border: '1px solid var(--color-border)',
    },
    outlined: {
      background: 'transparent',
      border: '2px solid var(--color-accent)',
    },
    elevated: {
      background: 'var(--color-surface)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    },
  };

  return (
    <div style={{ borderRadius: 8, padding: '1.25rem', ...variantStyles[variant] }}>
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
}

// Usage:
<Card title="Example" variant="elevated">
  <p>Any React elements as children.</p>
</Card>`;

export default function Props() {
  return (
    <ChapterLayout id="props">
      <p style={pStyle}>
        Props are the lifeblood of component composition. Both Svelte and React share the concept of
        passing data down from parent to child, but the mechanics differ significantly. In Svelte,
        props have historically been declared with <code>export let</code> and in Svelte 5 with
        the <code>$props()</code> rune. In React, props are simply the parameters of your component
        function. This chapter maps every prop pattern you know from Svelte to its React equivalent.
      </p>

      {/* ===== Basic Props ===== */}
      <h2 style={h2Style}>Basic Props</h2>
      <p style={pStyle}>
        In Svelte 4, you declare a prop with <code>export let</code>. In Svelte 5, you use the
        <code> $props()</code> rune and destructure the props you need. In React, your component is
        just a function, and props arrive as the first argument -- typically destructured inline.
        There is no special keyword or rune. It is plain JavaScript all the way down.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte 4 -->
<script>
  export let name;
  export let greeting;
</script>

<h1>{greeting}, {name}!</h1>

<!-- Svelte 5 -->
<script>
  let { name, greeting } = $props();
</script>

<h1>{greeting}, {name}!</h1>`,
          filename: 'Greeting.svelte',
          highlight: [3, 4, 11],
        }}
        react={{
          code: `// Props are just function parameters
function Greeting({ name, greeting }) {
  return <h1>{greeting}, {name}!</h1>;
}

// Usage in a parent component
function App() {
  return <Greeting name="world" greeting="Hello" />;
}`,
          filename: 'Greeting.tsx',
          highlight: [2],
        }}
        note="In React, there is no compilation step that transforms prop declarations. Props are a plain object, and destructuring is just JavaScript."
      />

      {/* ===== Default Props ===== */}
      <h2 style={h2Style}>Default Props</h2>
      <p style={pStyle}>
        Default values work identically in concept but differ in syntax. Svelte uses assignment
        on the export declaration (Svelte 4) or destructuring defaults (Svelte 5). React uses
        JavaScript default parameters in the destructuring -- nothing framework-specific.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte 4 -->
<script>
  export let color = 'blue';
  export let size = 'md';
</script>

<!-- Svelte 5 -->
<script>
  let { color = 'blue', size = 'md' } = $props();
</script>

<div class="badge {color} {size}">
  <slot />
</div>`,
          filename: 'Badge.svelte',
          highlight: [3, 4, 9],
        }}
        react={{
          code: `// Default values via destructuring defaults
function Badge({ color = 'blue', size = 'md', children }) {
  return (
    <div className={\`badge \${color} \${size}\`}>
      {children}
    </div>
  );
}

// Usage -- color defaults to 'blue', size to 'md'
<Badge>New</Badge>
<Badge color="red" size="lg">Alert</Badge>`,
          filename: 'Badge.tsx',
          highlight: [2],
        }}
        note="React once had a static defaultProps property on class components. With function components, destructuring defaults are the idiomatic approach and defaultProps is deprecated."
      />

      {/* ===== Destructuring and Rest Props ===== */}
      <h2 style={h2Style}>Destructuring and Rest Props</h2>
      <p style={pStyle}>
        Both frameworks support extracting known props and forwarding the rest. In Svelte, you use
        <code> $$restProps</code> (Svelte 4) or rest syntax in <code>$props()</code> (Svelte 5) to
        capture and spread any additional attributes onto an element. In React, you use standard
        JavaScript rest syntax in the destructuring and spread onto JSX elements.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte 4 -->
<script>
  export let variant = 'primary';
  // $$restProps captures everything else
</script>

<button class="btn btn-{variant}" {...$$restProps}>
  <slot />
</button>

<!-- Svelte 5 -->
<script>
  let { variant = 'primary', ...rest } = $props();
</script>

<button class="btn btn-{variant}" {...rest}>
  <slot />
</button>`,
          filename: 'Button.svelte',
          highlight: [7, 13, 16],
        }}
        react={{
          code: `// Rest syntax captures extra props
function Button({ variant = 'primary', children, ...rest }) {
  return (
    <button className={\`btn btn-\${variant}\`} {...rest}>
      {children}
    </button>
  );
}

// Usage -- onClick, disabled, etc. pass through
<Button variant="danger" onClick={handleDelete} disabled>
  Delete
</Button>`,
          filename: 'Button.tsx',
          highlight: [2, 4],
        }}
        note="Spreading rest props is how React components build 'transparent wrappers' -- components that enhance an element but forward all native attributes."
      />

      <h3 style={h3Style}>A Note on Prop Immutability</h3>
      <p style={pStyle}>
        In React, props are read-only. A child component cannot and should not modify props.
        If a child needs to communicate a change back to its parent, the parent passes a callback
        function as a prop. This is the foundation of React's unidirectional data flow and a
        significant departure from Svelte's <code>bind:</code> directive on components.
      </p>

      <Callout type="info" title="Unidirectional Data Flow">
        React's unidirectional data flow is enforced. There is no <code>bind:value</code> on
        custom components -- you pass a <code>value</code> and an <code>onChange</code> callback.
        The parent owns the state, the child reports changes. This makes data flow explicit and
        traceable, especially in larger applications.
      </Callout>

      {/* ===== Children as Props ===== */}
      <h2 style={h2Style}>Children as Props</h2>
      <p style={pStyle}>
        One of the most fundamental differences between Svelte and React is how they handle
        component composition. Svelte uses <code>&lt;slot /&gt;</code> -- a concept borrowed from
        Web Components. React treats children as a regular prop called <code>children</code> that
        receives whatever JSX is placed between the component's opening and closing tags.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: slots for composition -->
<script>
  let { title } = $props();
</script>

<div class="panel">
  <h2>{title}</h2>
  <div class="panel-body">
    <slot />
    <!-- Named slot for footer -->
    <slot name="footer" />
  </div>
</div>

<!-- Usage -->
<Panel title="Settings">
  <p>Main content goes here.</p>
  <svelte:fragment slot="footer">
    <button>Save</button>
  </svelte:fragment>
</Panel>`,
          filename: 'Panel.svelte',
          highlight: [9, 11],
        }}
        react={{
          code: `// React: children is just a prop
function Panel({ title, children, footer }) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      <div className="panel-body">
        {children}
        {footer && <div className="panel-footer">{footer}</div>}
      </div>
    </div>
  );
}

// Usage
<Panel
  title="Settings"
  footer={<button>Save</button>}
>
  <p>Main content goes here.</p>
</Panel>`,
          filename: 'Panel.tsx',
          highlight: [2, 7, 8, 16],
        }}
        note="React has no named slots. Instead, you pass additional content as named props. Svelte's <slot name='footer' /> becomes a 'footer' prop that receives JSX."
      />

      <h3 style={h3Style}>The Render Props Pattern</h3>
      <p style={pStyle}>
        React takes the children-as-prop concept further with render props -- passing a function
        as <code>children</code> (or any prop) that the component calls with data. This pattern
        is used for inversion of control, where the parent decides how to render but the child
        provides the data. Svelte achieves similar patterns with slot props.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: slot props -->
<script>
  let { items } = $props();
</script>

{#each items as item}
  <slot {item} />
{/each}

<!-- Usage -->
<List items={users}>
  <div slot="default" let:item>
    <strong>{item.name}</strong>
  </div>
</List>`,
          filename: 'List.svelte',
        }}
        react={{
          code: `// React: render prop (function as children)
function List({ items, children }) {
  return (
    <>
      {items.map(item => (
        <div key={item.id}>
          {children(item)}
        </div>
      ))}
    </>
  );
}

// Usage
<List items={users}>
  {(item) => <strong>{item.name}</strong>}
</List>`,
          filename: 'List.tsx',
          highlight: [2, 7, 16],
        }}
      />

      {/* ===== TypeScript Prop Typing ===== */}
      <h2 style={h2Style}>TypeScript Prop Typing</h2>
      <p style={pStyle}>
        Both frameworks have excellent TypeScript support, but the ergonomics differ. In Svelte 5,
        you define a props interface and pass it as a generic to <code>$props()</code>. In React,
        you type the props object directly in the function signature or define a separate interface.
        The older <code>React.FC</code> generic is falling out of favor -- inline typing is now
        preferred.
      </p>

      <CodeComparison
        svelte={{
          code: `<script lang="ts">
  interface Props {
    title: string;
    count?: number;
    variant: 'primary' | 'secondary';
    onAction: (id: string) => void;
    children?: import('svelte').Snippet;
  }

  let {
    title,
    count = 0,
    variant,
    onAction,
    children,
  }: Props = $props();
</script>`,
          filename: 'TypedComponent.svelte',
          language: 'typescript',
          highlight: [2, 3, 4, 5, 6, 7],
        }}
        react={{
          code: `import { ReactNode } from 'react';

// Define the interface separately
interface TypedComponentProps {
  title: string;
  count?: number;
  variant: 'primary' | 'secondary';
  onAction: (id: string) => void;
  children?: ReactNode;
}

// Type inline in the function signature
function TypedComponent({
  title,
  count = 0,
  variant,
  onAction,
  children,
}: TypedComponentProps) {
  return <div>...</div>;
}

// Alternative: React.FC (less common now)
const TypedComponent2: React.FC<TypedComponentProps> = ({
  title, count = 0, variant, onAction, children
}) => {
  return <div>...</div>;
};`,
          filename: 'TypedComponent.tsx',
          highlight: [4, 5, 6, 7, 8, 9, 13, 19],
        }}
        note="React.FC used to be the standard, but inline typing is now preferred because FC adds an implicit children prop (removed in React 18 types) and makes generics awkward."
      />

      <h3 style={h3Style}>Generic Props</h3>
      <p style={pStyle}>
        Both frameworks support generic components. In React, you write a generic function and
        TypeScript infers the type from usage. This is useful for reusable list, table, or
        select components that work with any data type.
      </p>

      <CodeBlock
        code={`// A generic select component
interface SelectProps<T> {
  items: T[];
  selected: T | null;
  getLabel: (item: T) => string;
  onSelect: (item: T) => void;
}

function Select<T>({ items, selected, getLabel, onSelect }: SelectProps<T>) {
  return (
    <ul>
      {items.map((item, i) => (
        <li
          key={i}
          onClick={() => onSelect(item)}
          style={{ fontWeight: item === selected ? 'bold' : 'normal' }}
        >
          {getLabel(item)}
        </li>
      ))}
    </ul>
  );
}

// TypeScript infers T as User from the items array
<Select
  items={users}
  selected={currentUser}
  getLabel={u => u.name}
  onSelect={u => setCurrentUser(u)}
/>`}
        language="tsx"
        filename="GenericSelect.tsx"
        highlight={[2, 9]}
      />

      {/* ===== Prop Spreading ===== */}
      <h2 style={h2Style}>Prop Spreading Patterns</h2>
      <p style={pStyle}>
        Spreading props is common in both frameworks for building wrapper components. But there
        are some key differences in how each framework handles prop merging, especially around
        class names and event handlers.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let { class: className = '', ...rest } = $props();
</script>

<!-- $$restProps in Svelte 4, ...rest in Svelte 5 -->
<div class="wrapper {className}" {...rest}>
  <slot />
</div>

<!-- Usage -->
<Wrapper class="extra" data-testid="my-wrapper">
  Content
</Wrapper>`,
          filename: 'Wrapper.svelte',
          highlight: [2, 6],
        }}
        react={{
          code: `function Wrapper({ className = '', children, ...rest }) {
  return (
    <div className={\`wrapper \${className}\`} {...rest}>
      {children}
    </div>
  );
}

// Usage
<Wrapper className="extra" data-testid="my-wrapper">
  Content
</Wrapper>`,
          filename: 'Wrapper.tsx',
          highlight: [1, 3],
        }}
        note="In Svelte, 'class' is a reserved word so you use class: as a prop name. In React, it is className everywhere -- both on the component prop and the JSX attribute."
      />

      {/* ===== Interactive Demo ===== */}
      <h2 style={h2Style}>Interactive Demo</h2>
      <p style={pStyle}>
        This demo shows a <code>Card</code> component that accepts <code>title</code> (string),
        <code> variant</code> (union type with a default), and <code>children</code> (ReactNode).
        Toggle between the variant buttons to see how the same component renders with different
        prop values. The children content stays the same -- only the visual style changes.
      </p>

      <InteractiveDemo title="Card Component with Props" code={cardDemoCode}>
        <CardDemo />
      </InteractiveDemo>

      {/* ===== Callback Props ===== */}
      <h2 style={h2Style}>Callback Props (The onChange Pattern)</h2>
      <p style={pStyle}>
        In Svelte, you can use <code>bind:value</code> to create two-way binding between a parent
        and child. React has no two-way binding. Instead, the canonical pattern is the controlled
        component: the parent passes a <code>value</code> prop and an <code>onChange</code> callback.
        The child calls <code>onChange</code> when the user interacts, and the parent updates its own
        state, which flows back down as the new <code>value</code>.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: two-way binding -->
<script>
  let { value = $bindable() } = $props();
</script>

<input bind:value />

<!-- Parent: bidirectional -->
<script>
  let name = $state('');
</script>
<TextInput bind:value={name} />`,
          filename: 'TextInput.svelte',
          highlight: [3, 6],
        }}
        react={{
          code: `// React: controlled component pattern
function TextInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

// Parent: explicit state + callback
function Parent() {
  const [name, setName] = useState('');
  return <TextInput value={name} onChange={setName} />;
}`,
          filename: 'TextInput.tsx',
          highlight: [2, 5, 6, 14],
        }}
        note="React's approach is more verbose but makes data flow completely traceable. You can always find where state lives and how it changes by following the callback chain."
      />

      {/* ===== Comparison Table ===== */}
      <h2 style={h2Style}>Prop Patterns at a Glance</h2>

      <ComparisonTable
        caption="Svelte vs React prop patterns"
        headers={['Pattern', 'Svelte 5', 'React']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['Declare props', 'let { x } = $props()', 'function Comp({ x })'],
          ['Default value', 'let { x = 5 } = $props()', 'function Comp({ x = 5 })'],
          ['Required prop', 'TypeScript interface (no default)', 'TypeScript interface (no default)'],
          ['Rest/spread props', 'let { a, ...rest } = $props()', '({ a, ...rest }) + {...rest}'],
          ['Children', '<slot />', '{children} (implicit prop)'],
          ['Named slots', '<slot name="x" />', 'Named props: footer={<X/>}'],
          ['Two-way binding', 'bind:value', 'value + onChange callback'],
          ['Class forwarding', 'class: className', 'className prop'],
          ['Type safety', 'interface + $props<T>()', 'interface + function params'],
          ['Prop immutability', 'Mutable (but discouraged)', 'Enforced (read-only)'],
        ]}
      />

      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        If you are coming from Svelte, React props will feel immediately familiar in concept but
        subtly different in execution. The biggest adjustments are: no <code>bind:</code> on
        custom components (you must always use the value-plus-callback pattern), no named slots
        (use named props instead), and children are just another prop rather than a separate
        slot mechanism. The upside is that everything is plain JavaScript -- no special syntax
        to learn, no compiler magic. Props are objects, children are expressions, callbacks are
        functions. Once you internalize this simplicity, building composed component APIs in
        React becomes a natural extension of writing functions.
      </p>
    </ChapterLayout>
  );
}
