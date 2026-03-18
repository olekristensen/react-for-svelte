import { useState } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

function BuggyUserCard() {
  return (
    <div style={{ padding: '0.5rem', background: 'var(--color-bg-secondary)', borderRadius: 0 }}>
      <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: 0 }}>User Card</h3>
      <input placeholder="Update name..." style={{ padding: '0.3rem', borderRadius: 0, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', marginTop: '0.4rem', width: '100%' }} />
      <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.4rem' }}>Props typed as "any" — no autocomplete, no type safety</p>
    </div>
  );
}

function FixedUserCard() {
  const [name, setName] = useState('Alice');
  return (
    <div style={{ padding: '0.5rem', background: 'var(--color-bg-secondary)', borderRadius: 0 }}>
      <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: 0 }}>{name}</h3>
      <input value={name} onChange={e => setName(e.target.value)} style={{ padding: '0.3rem', borderRadius: 0, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', marginTop: '0.4rem', width: '100%' }} />
      <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.4rem' }}>Properly typed — full IntelliSense support</p>
    </div>
  );
}

export default function TypeScriptReact() {
  return (
    <ChapterLayout id="typescript">
      <p style={pStyle}>
        TypeScript support in React is mature, deeply integrated, and arguably the best in the
        frontend ecosystem. The type system covers everything from component props and state to
        event handlers and refs. Svelte has caught up significantly with <code>lang="ts"</code>
        in Svelte 5 and its rune types, but React's TypeScript story has had a decade to evolve,
        and the depth of inference — especially around hooks and JSX — remains unmatched. This
        chapter covers the TypeScript patterns you will use daily when writing React.
      </p>

      {/* ─── Typing Props ─── */}
      <h2 style={h2Style}>Typing Component Props</h2>
      <p style={pStyle}>
        The foundation of TypeScript in React is typing your component props. You define an
        interface (or type alias) for the props, then use it as the parameter type for your
        function component. The TypeScript compiler validates every usage site — if someone passes
        the wrong type or forgets a required prop, they get a compile error.
      </p>
      <CodeBlock
        code={`// Define the prop types with an interface
interface UserCardProps {
  name: string;
  email: string;
  age: number;
  avatar?: string;               // optional prop
  role: 'admin' | 'user' | 'guest'; // union literal type
  onEdit: (id: string) => void;  // callback prop
  children: React.ReactNode;     // accepts any renderable content
}

// Use the interface as the parameter type
function UserCard({
  name,
  email,
  age,
  avatar = '/default-avatar.png',  // default value
  role,
  onEdit,
  children,
}: UserCardProps) {
  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
      <span className={\`badge badge-\${role}\`}>{role}</span>
      <button onClick={() => onEdit(email)}>Edit</button>
      <div className="card-body">{children}</div>
    </div>
  );
}

// TypeScript catches errors at compile time:
// <UserCard name="Alice" />
//   Error: missing required props: email, age, role, onEdit, children
// <UserCard name={42} email="a@b.com" ... />
//   Error: Type 'number' is not assignable to type 'string'`}
        language="tsx"
        filename="UserCard.tsx"
        highlight={[2, 7, 8, 9, 13, 17]}
      />

      <h3 style={h3Style}>Common Prop Type Patterns</h3>
      <CodeBlock
        code={`import { ReactNode, CSSProperties, HTMLAttributes } from 'react';

// ReactNode — any renderable content
interface LayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}

// CSSProperties — type-safe inline styles
interface BoxProps {
  style?: CSSProperties;
  children: ReactNode;
}

// Extending native HTML attributes
interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

function Button({ variant, loading, children, ...rest }: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      disabled={loading}
      {...rest} // spreads onClick, className, aria-*, etc.
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

// ComponentPropsWithoutRef — derive props from a native element
type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  label: string;
  error?: string;
};

function TextField({ label, error, ...inputProps }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}`}
        language="tsx"
        filename="prop-patterns.tsx"
        highlight={[4, 11, 17, 36]}
      />

      {/* ─── Typing useState ─── */}
      <h2 style={h2Style}>Typing useState with Generics</h2>
      <p style={pStyle}>
        React's <code>useState</code> hook is a generic function. In many cases, TypeScript infers
        the type from the initial value. But when the initial value is <code>null</code>,
        an empty array, or does not represent the full range of possible values, you need to
        provide the generic type explicitly.
      </p>
      <CodeBlock
        code={`import { useState } from 'react';

// Inferred: string
const [name, setName] = useState('Alice');

// Inferred: number
const [count, setCount] = useState(0);

// Inferred: boolean
const [isOpen, setIsOpen] = useState(false);

// Needs generic: initial value is null, but will be User later
interface User {
  id: string;
  name: string;
  email: string;
}
const [user, setUser] = useState<User | null>(null);
// user is typed as User | null
// You must null-check before accessing: user?.name

// Needs generic: empty array doesn't tell TS the element type
const [items, setItems] = useState<string[]>([]);
// items is typed as string[]
// setItems(['a', 'b']) works
// setItems([1, 2]) errors

// Complex state with explicit type
interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

const [form, setForm] = useState<FormState>({
  values: {},
  errors: {},
  isSubmitting: false,
  isValid: true,
});

// Updating complex state while preserving types
setForm(prev => ({
  ...prev,
  isSubmitting: true,
  errors: {}, // TypeScript ensures this is Record<string, string>
}));`}
        language="tsx"
        filename="useState-generics.tsx"
        highlight={[19, 24, 37]}
      />

      {/* ─── Typing Events ─── */}
      <h2 style={h2Style}>Typing Events</h2>
      <p style={pStyle}>
        Event handling in React is strongly typed through React's synthetic event system. Each
        event handler has a specific type that includes the target element type. This gives you
        full autocompletion on <code>event.target</code> properties and catches common mistakes
        at compile time.
      </p>
      <CodeBlock
        code={`import { useState, FormEvent, ChangeEvent, MouseEvent, KeyboardEvent } from 'react';

function TypedEventsExample() {
  const [value, setValue] = useState('');

  // ChangeEvent — parameterized by the target element type
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // e.target is typed as HTMLInputElement
    // e.target.value is typed as string
    setValue(e.target.value);
  }

  // For select elements
  function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    // e.target is typed as HTMLSelectElement
    console.log(e.target.value, e.target.selectedIndex);
  }

  // For textareas
  function handleTextarea(e: ChangeEvent<HTMLTextAreaElement>) {
    console.log(e.target.value, e.target.rows);
  }

  // FormEvent for form submission
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(Object.fromEntries(formData));
  }

  // MouseEvent with element type
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    console.log(e.clientX, e.clientY);
    console.log(e.currentTarget.disabled); // typed!
  }

  // KeyboardEvent
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Submitted:', e.currentTarget.value);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <select onChange={handleSelect}>
        <option value="a">A</option>
        <option value="b">B</option>
      </select>
      <textarea onChange={handleTextarea} />
      <button onClick={handleClick} type="submit">
        Submit
      </button>
    </form>
  );
}

// Shorthand: inline handlers get inferred types automatically
// No need to annotate when the handler is inline:
// <input onChange={e => setValue(e.target.value)} />
// TypeScript knows e is ChangeEvent<HTMLInputElement> from context`}
        language="tsx"
        filename="typed-events.tsx"
        highlight={[7, 14, 20, 25, 32, 38]}
      />

      {/* ─── Svelte TS vs React TS ─── */}
      <h2 style={h2Style}>Svelte TypeScript vs React TypeScript</h2>
      <p style={pStyle}>
        Both frameworks support TypeScript, but the approaches differ in how deeply the type
        system integrates with the framework's patterns. Svelte uses <code>lang="ts"</code> in
        the script block and has introduced typed runes. React uses standard TypeScript throughout
        — there is no special language mode or compiler transformation for types.
      </p>
      <CodeComparison
        svelte={{
          code: `<script lang="ts">
  // Props typed via interface + $props()
  interface Props {
    items: string[];
    onSelect: (item: string) => void;
  }

  let { items, onSelect }: Props = $props();

  // State typed via rune generic
  let selected = $state<string | null>(null);

  // Derived — type is inferred
  let count = $derived(items.length);

  // Events: typed via the Event type
  function handleClick(e: MouseEvent) {
    // e.target needs assertion
    const el = e.target as HTMLButtonElement;
    console.log(el.textContent);
  }

  // Reactive effect — types inferred from usage
  $effect(() => {
    if (selected) {
      console.log(\`Selected: \${selected}\`);
    }
  });
</script>

<div>
  {#each items as item}
    <button
      on:click={handleClick}
      class:active={item === selected}
    >
      {item}
    </button>
  {/each}
  <p>Count: {count}</p>
</div>`,
          filename: 'ItemList.svelte',
        }}
        react={{
          code: `import {
  useState, useMemo, useEffect, MouseEvent
} from 'react';

// Props typed via interface
interface ItemListProps {
  items: string[];
  onSelect: (item: string) => void;
}

function ItemList({ items, onSelect }: ItemListProps) {
  // State typed via generic
  const [selected, setSelected] =
    useState<string | null>(null);

  // Derived — type is inferred from useMemo
  const count = useMemo(
    () => items.length, [items]
  );

  // Events: fully typed via React event generics
  function handleClick(
    e: MouseEvent<HTMLButtonElement>
  ) {
    // e.currentTarget is typed as HTMLButtonElement
    // No assertion needed!
    console.log(e.currentTarget.textContent);
  }

  // Effect — same TypeScript as any function
  useEffect(() => {
    if (selected) {
      console.log(\`Selected: \${selected}\`);
    }
  }, [selected]);

  return (
    <div>
      {items.map(item => (
        <button
          key={item}
          onClick={handleClick}
          className={item === selected ? 'active' : ''}
        >
          {item}
        </button>
      ))}
      <p>Count: {count}</p>
    </div>
  );
}`,
          filename: 'ItemList.tsx',
        }}
        note="React's event types are more precise — MouseEvent<HTMLButtonElement> means e.currentTarget is fully typed without casting. Svelte events use the DOM's native MouseEvent type, which requires manual assertions for target typing."
      />

      {/* ─── Generic Components ─── */}
      <h2 style={h2Style}>Generic Components</h2>
      <p style={pStyle}>
        One of TypeScript's most powerful features in React is the ability to create generic
        components — components whose prop types are parameterized. This is essential for building
        reusable components like lists, tables, select dropdowns, and form fields that work with
        any data type while preserving type safety.
      </p>
      <CodeBlock
        code={`// A generic List component that works with any item type
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items',
}: ListProps<T>) {
  if (items.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// Usage — TypeScript infers T from the items prop
interface User {
  id: number;
  name: string;
  email: string;
}

function UserDirectory({ users }: { users: User[] }) {
  return (
    <List
      items={users}  // T is inferred as User
      keyExtractor={user => user.id}  // user is typed as User
      renderItem={user => (
        <div>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
      )}
    />
  );
}

// A generic Select component
interface SelectOption<V> {
  value: V;
  label: string;
}

interface TypedSelectProps<V> {
  options: SelectOption<V>[];
  value: V;
  onChange: (value: V) => void;
}

function TypedSelect<V extends string | number>({
  options,
  value,
  onChange,
}: TypedSelectProps<V>) {
  return (
    <select
      value={String(value)}
      onChange={e => {
        const selected = options.find(
          o => String(o.value) === e.target.value
        );
        if (selected) onChange(selected.value);
      }}
    >
      {options.map(opt => (
        <option key={String(opt.value)} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// Usage
type StatusCode = 200 | 404 | 500;

function StatusPicker() {
  const [status, setStatus] = useState<StatusCode>(200);

  return (
    <TypedSelect<StatusCode>
      value={status}
      onChange={setStatus} // onChange(value: StatusCode) — fully typed!
      options={[
        { value: 200, label: 'OK' },
        { value: 404, label: 'Not Found' },
        { value: 500, label: 'Server Error' },
      ]}
    />
  );
}`}
        language="tsx"
        filename="GenericComponents.tsx"
        highlight={[2, 9, 40, 52, 59, 63, 89, 92]}
      />

      {/* ─── Discriminated Unions ─── */}
      <h2 style={h2Style}>Discriminated Unions for Props</h2>
      <p style={pStyle}>
        Discriminated unions are one of TypeScript's most powerful features for component design.
        They let you define variant props — where certain props are only valid when a discriminant
        prop has a specific value. This is perfect for components that have multiple modes or
        variants, and it makes impossible prop combinations unrepresentable at the type level.
      </p>
      <CodeBlock
        code={`// A notification component with variants
// Each variant requires different props

type NotificationProps =
  | {
      type: 'success';
      message: string;
      // success has no action
    }
  | {
      type: 'error';
      message: string;
      retry: () => void;  // error requires a retry callback
    }
  | {
      type: 'warning';
      message: string;
      dismissible: boolean; // warning has a dismiss option
    };

function Notification(props: NotificationProps) {
  const baseStyle = {
    padding: '1rem',
    borderRadius: 0,
    marginBottom: '1rem',
  };

  switch (props.type) {
    case 'success':
      return (
        <div style={{ ...baseStyle, background: '#dcfce7' }}>
          <span>Success: {props.message}</span>
        </div>
      );

    case 'error':
      // props.retry is available here — TS narrows the type
      return (
        <div style={{ ...baseStyle, background: '#fef2f2' }}>
          <span>Error: {props.message}</span>
          <button onClick={props.retry}>Retry</button>
        </div>
      );

    case 'warning':
      // props.dismissible is available here
      return (
        <div style={{ ...baseStyle, background: '#fffbeb' }}>
          <span>Warning: {props.message}</span>
          {props.dismissible && <button>Dismiss</button>}
        </div>
      );
  }
}

// TypeScript enforces correct prop combinations:

// Valid:
<Notification type="success" message="Saved!" />
<Notification type="error" message="Failed" retry={() => refetch()} />
<Notification type="warning" message="Low storage" dismissible={true} />

// Invalid — TypeScript errors:
// <Notification type="success" retry={() => {}} />
//   Error: 'retry' does not exist on type '{ type: "success"; message: string; }'
// <Notification type="error" message="Failed" />
//   Error: Property 'retry' is missing`}
        language="tsx"
        filename="DiscriminatedUnions.tsx"
        highlight={[4, 5, 10, 15, 28, 37, 46]}
      />

      <h3 style={h3Style}>Discriminated Unions for State</h3>
      <p style={pStyle}>
        This pattern also works brilliantly for component state, especially for async operations
        where the shape of your data changes depending on the current status.
      </p>
      <CodeBlock
        code={`// Instead of multiple boolean flags:
// const [loading, setLoading] = useState(false);
// const [error, setError] = useState<string | null>(null);
// const [data, setData] = useState<User | null>(null);
// Problem: loading=true AND error="something" is representable but invalid

// Use a discriminated union:
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });

  async function execute(promise: Promise<T>) {
    setState({ status: 'loading' });
    try {
      const data = await promise;
      setState({ status: 'success', data });
    } catch (err) {
      setState({
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return { state, execute };
}

// Usage
function UserProfile({ id }: { id: string }) {
  const { state, execute } = useAsync<User>();

  useEffect(() => {
    execute(fetch(\`/api/users/\${id}\`).then(r => r.json()));
  }, [id]);

  switch (state.status) {
    case 'idle':
      return null;
    case 'loading':
      return <Spinner />;
    case 'success':
      // state.data is typed as User — TS knows it exists here
      return <div>{state.data.name}</div>;
    case 'error':
      // state.error is typed as string — TS knows it exists here
      return <p className="error">{state.error}</p>;
  }
}`}
        language="tsx"
        filename="AsyncState.tsx"
        highlight={[8, 9, 10, 11, 12, 15, 41, 47, 50]}
      />

      <Callout type="insight" title="React's TypeScript Depth">
        React's TypeScript story is mature and excellent. Svelte has caught up with <code>lang="ts"</code>,
        but React's type inference for hooks and JSX is deeper. Generic components, discriminated union
        props, and the fully typed event system give you compile-time guarantees that catch entire
        categories of bugs. The <code>@types/react</code> package has been refined over years and
        provides precise types for every React API. If you value type safety, React's TypeScript
        integration will feel like a significant upgrade.
      </Callout>

      {/* ─── Comparison Table ─── */}
      <h2 style={h2Style}>TypeScript Features at a Glance</h2>
      <ComparisonTable
        caption="TypeScript in Svelte vs React"
        headers={['Feature', 'Svelte', 'React']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['Setup', 'lang="ts" in <script>', '.tsx file extension'],
          ['Prop types', 'interface + $props()', 'interface + function parameter'],
          ['State types', '$state<T>(value)', 'useState<T>(value)'],
          ['Event types', 'Native DOM Event (may need assertions)', 'React.ChangeEvent<HTMLInputElement> (precise)'],
          ['Children type', 'Snippet type from svelte', 'React.ReactNode'],
          ['Generic components', 'Supported but less common', 'Common and well-supported'],
          ['Discriminated unions', 'Works for props', 'Works for props and state'],
          ['Ref types', 'let el: HTMLDivElement', 'useRef<HTMLDivElement>(null)'],
          ['Context types', 'Typed via setContext/getContext generics', 'createContext<T> with typed Provider'],
          ['Hook return types', 'N/A (no hooks)', 'Inferred or explicit return types'],
          ['Third-party types', 'Growing ecosystem', '@types/* packages — massive ecosystem'],
          ['JSX type checking', 'Template expressions checked', 'Full JSX.IntrinsicElements validation'],
          ['Style types', 'String (CSS)', 'React.CSSProperties (typed object)'],
          ['Form data', 'Manual typing', 'FormEvent<HTMLFormElement> + FormData'],
        ]}
      />

      <h3 style={h3Style}>Helpful Utility Types</h3>
      <p style={pStyle}>
        React provides several utility types that are useful when building component libraries
        or working with complex prop patterns. Knowing these saves you from reinventing common
        type transformations.
      </p>
      <CodeBlock
        code={`import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  PropsWithChildren,
  PropsWithRef,
} from 'react';

// Extract props from any component
type ButtonProps = ComponentProps<'button'>;
type MyCompProps = ComponentProps<typeof MyComponent>;

// Props without ref — useful for wrapper components
type InputProps = ComponentPropsWithoutRef<'input'>;

// Add children to any props interface
type PanelProps = PropsWithChildren<{
  title: string;
  collapsible?: boolean;
}>;
// Equivalent to:
// { title: string; collapsible?: boolean; children?: ReactNode }

// Partial — make all props optional (useful for default props)
type OptionalUserCard = Partial<UserCardProps>;

// Required — make all props required
type StrictUserCard = Required<UserCardProps>;

// Pick / Omit — select or exclude specific props
type NameOnly = Pick<UserCardProps, 'name' | 'email'>;
type NoChildren = Omit<UserCardProps, 'children'>;

// Record — typed key-value objects
type FormErrors = Record<string, string>;
type FieldValues = Record<string, string | number | boolean>;`}
        language="tsx"
        filename="utility-types.tsx"
        highlight={[10, 14, 17, 25, 28, 31, 32, 35]}
      />

      <p style={pStyle}>
        TypeScript in React is not just about catching bugs — it is about creating a development
        experience where your editor becomes a knowledgeable collaborator. Autocomplete for
        props, inline error messages for type mismatches, and hover documentation for every
        hook parameter make it faster to write correct code than to write incorrect code. As
        a Svelte developer, you already appreciate type safety. In React, that appreciation
        will deepen because the type system reaches into every corner of the framework's API.
      </p>

      <CodeExercise
        id="typescript-fix-types"
        title="Fix the Types"
        type="fix-the-bug"
        description="This component uses 'any' types which defeats the purpose of TypeScript. Replace them with proper types for the props, state, and event handler."
        buggyPreview={<BuggyUserCard />}
        solvedPreview={<FixedUserCard />}
        initialCode={`interface UserCardProps {
  user: any;  // Fix this type
  onUpdate: any;  // Fix this type
}

function UserCard({ user, onUpdate }: UserCardProps) {
  const [editing, setEditing] = useState<any>(false);

  function handleChange(e: any) {
    onUpdate(user.id, e.target.value);
  }

  return (
    <div>
      <h3>{user.name}</h3>
      <input onChange={handleChange} />
    </div>
  );
}`}
        solution={`interface UserCardProps {
  user: { id: number; name: string };
  onUpdate: (id: number, value: string) => void;
}

function UserCard({ user, onUpdate }: UserCardProps) {
  const [editing, setEditing] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onUpdate(user.id, e.target.value);
  }

  return (
    <div>
      <h3>{user.name}</h3>
      <input onChange={handleChange} />
    </div>
  );
}`}
        validationPatterns={["user: { id: number; name: string }", "onUpdate: (id: number, value: string) => void", "useState<boolean>"]}
        hints={[
          "The user prop should describe its shape: { id: number; name: string }",
          "onUpdate is a function — type it as (id: number, value: string) => void",
          "useState<boolean> instead of useState<any>, and use React.ChangeEvent<HTMLInputElement> for the event"
        ]}
      />
    </ChapterLayout>
  );
}
