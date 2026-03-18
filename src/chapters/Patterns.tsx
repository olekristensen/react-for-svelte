import { ChapterLayout } from '../components/ChapterLayout';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function Patterns() {
  return (
    <ChapterLayout id="patterns">
      <p style={pStyle}>
        React has a rich ecosystem of design patterns that have evolved over a decade of
        community experimentation. Some of these patterns — like Higher-Order Components and
        render props — predate hooks and are less common today, but understanding them is
        essential because you will encounter them in existing codebases and libraries. Other
        patterns — like compound components and controlled vs. uncontrolled inputs — remain
        core to how React applications are designed. This chapter covers the patterns you are
        most likely to encounter and explains how they relate to (or differ from) Svelte equivalents.
      </p>

      {/* ─── Higher-Order Components ─── */}
      <h2 style={h2Style}>Higher-Order Components (HOCs)</h2>
      <p style={pStyle}>
        A Higher-Order Component is a function that takes a component and returns a new component
        with additional behavior. It is the React equivalent of a decorator or a wrapper. Before
        hooks existed (pre-2019), HOCs were the primary mechanism for reusing stateful logic
        across components. You will still see them in older codebases, in libraries
        like <code>react-redux</code> (the <code>connect</code> function), and in a few cases
        where they remain the cleanest solution.
      </p>
      <p style={pStyle}>
        Svelte has no direct equivalent of HOCs. In Svelte, you compose behavior through stores,
        actions, and component composition. The concept of wrapping a component in a function
        to inject behavior is foreign to Svelte's model.
      </p>

      <h3 style={h3Style}>withAuth — A Classic HOC Pattern</h3>
      <CodeBlock
        code={`import { ComponentType, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WithAuthOptions {
  redirectTo?: string;
  requiredRole?: string;
}

// The HOC: wraps any component with auth logic
function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = '/login', requiredRole } = options;

  // Returns a new component with the same props
  return function AuthenticatedComponent(props: P) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      async function checkAuth() {
        try {
          const currentUser = await getCurrentUser();
          if (!currentUser) {
            navigate(redirectTo);
            return;
          }
          if (requiredRole && currentUser.role !== requiredRole) {
            navigate('/unauthorized');
            return;
          }
          setUser(currentUser);
        } catch {
          navigate(redirectTo);
        } finally {
          setLoading(false);
        }
      }
      checkAuth();
    }, [navigate]);

    if (loading) return <LoadingSpinner />;
    if (!user) return null;

    // Pass through all original props plus the user
    return <WrappedComponent {...props} user={user} />;
  };
}

// Usage: wrap your component
const ProtectedDashboard = withAuth(Dashboard);
const AdminPanel = withAuth(AdminContent, {
  requiredRole: 'admin',
});

// In your routes:
// <Route path="/dashboard" element={<ProtectedDashboard />} />
// <Route path="/admin" element={<AdminPanel />} />`}
        language="tsx"
        filename="withAuth.tsx"
        highlight={[10, 17, 48, 53, 54]}
      />

      <h3 style={h3Style}>HOC Downsides</h3>
      <p style={pStyle}>
        HOCs have several well-known problems. They create "wrapper hell" when multiple HOCs are
        stacked (<code>withAuth(withTheme(withRouter(Component)))</code>), they make it unclear
        where props originate, they can cause naming collisions between injected props, and they
        obscure the component tree in React DevTools. Hooks solve all of these problems, which is
        why the community has largely moved away from HOCs for new code.
      </p>
      <CodeBlock
        code={`// HOC approach: wrapper hell and unclear prop origins
const EnhancedComponent = withAuth(
  withTheme(
    withRouter(
      withLogger(MyComponent)
    )
  )
);

// Hook approach: flat, explicit, and composable
function MyComponent() {
  const user = useAuth();
  const theme = useTheme();
  const router = useRouter();
  useLogger('MyComponent');

  // All dependencies are visible right here
  return <div>...</div>;
}`}
        language="tsx"
        filename="hoc-vs-hooks.tsx"
        highlight={[2, 11, 12, 13, 14, 15]}
      />

      {/* ─── Compound Components ─── */}
      <h2 style={h2Style}>Compound Components</h2>
      <p style={pStyle}>
        Compound components are a pattern where a group of components work together to form a
        complete UI element, sharing implicit state through React Context. Think of
        HTML's <code>&lt;select&gt;</code> and <code>&lt;option&gt;</code> — they are separate
        elements that only make sense together, and the select manages the state for all its
        options. In React, you can build the same kind of API for your own component groups.
      </p>
      <p style={pStyle}>
        In Svelte, you might achieve something similar by passing stores down through context or
        using component composition with snippets. But React's compound component pattern is
        more formalized and more commonly used, especially in component libraries
        like Radix UI, Headless UI, and Reach UI.
      </p>

      <h3 style={h3Style}>Select/Option Compound Component</h3>
      <CodeBlock
        code={`import {
  createContext, useContext, useState,
  ReactNode, useCallback
} from 'react';

// Shared context between Select and Option
interface SelectContextType {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  toggle: () => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error('Select.Option must be used within a Select');
  }
  return ctx;
}

// Parent component: manages state
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  placeholder?: string;
}

function Select({ value, onChange, children, placeholder }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen(o => !o), []);

  const contextValue: SelectContextType = {
    value,
    onChange: (val: string) => {
      onChange(val);
      setIsOpen(false);
    },
    isOpen,
    toggle,
  };

  const displayLabel = value || placeholder || 'Select...';

  return (
    <SelectContext.Provider value={contextValue}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button onClick={toggle} className="select-trigger">
          {displayLabel}
          <span>{isOpen ? '\u25B2' : '\u25BC'}</span>
        </button>
        {isOpen && (
          <div className="select-dropdown">
            {children}
          </div>
        )}
      </div>
    </SelectContext.Provider>
  );
}

// Child component: reads state from context
interface OptionProps {
  value: string;
  children: ReactNode;
}

function Option({ value, children }: OptionProps) {
  const { value: selected, onChange } = useSelectContext();
  const isSelected = value === selected;

  return (
    <div
      onClick={() => onChange(value)}
      className={\`select-option \${isSelected ? 'selected' : ''}\`}
      role="option"
      aria-selected={isSelected}
    >
      {children}
      {isSelected && <span> \u2713</span>}
    </div>
  );
}

// Attach as static properties for clean API
Select.Option = Option;

// Usage — reads like natural HTML
function ColorPicker() {
  const [color, setColor] = useState('');

  return (
    <Select value={color} onChange={setColor} placeholder="Pick a color">
      <Select.Option value="red">Red</Select.Option>
      <Select.Option value="blue">Blue</Select.Option>
      <Select.Option value="green">Green</Select.Option>
    </Select>
  );
}`}
        language="tsx"
        filename="CompoundSelect.tsx"
        highlight={[15, 34, 50, 72, 89, 97, 98, 99]}
      />

      <p style={pStyle}>
        The beauty of compound components is the API ergonomics. The consumer does not need to
        pass callbacks to each Option or manage open/close state — the Select manages everything
        internally through Context, and Options just participate. This pattern scales well for
        complex components like Tabs, Accordions, Menus, and Form Groups.
      </p>

      {/* ─── Controlled vs Uncontrolled ─── */}
      <h2 style={h2Style}>Controlled vs Uncontrolled Components</h2>
      <p style={pStyle}>
        This is one of React's most important patterns, and it has no direct parallel in Svelte.
        In Svelte, <code>bind:value</code> creates two-way binding, and the framework manages the
        synchronization. React does not have two-way binding. Instead, every form element can
        operate in one of two modes:
      </p>
      <ul style={{ ...pStyle, paddingLeft: '1.5rem' }}>
        <li>
          <strong>Controlled:</strong> React state is the source of truth. The element's value
          is set by state, and changes are handled by an <code>onChange</code> handler that
          updates state. The component "controls" the input's value.
        </li>
        <li>
          <strong>Uncontrolled:</strong> The DOM is the source of truth. The element manages
          its own value internally, and you read it when needed (typically on submit)
          using a <code>ref</code>.
        </li>
      </ul>

      <h3 style={h3Style}>Controlled Component</h3>
      <CodeBlock
        code={`import { useState, FormEvent } from 'react';

function ControlledForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // You have full control: validate, transform, restrict
  function handleNameChange(value: string) {
    // Example: uppercase only
    setName(value.toUpperCase());
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Values are already in state — just use them
    console.log({ name, email });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={e => handleNameChange(e.target.value)}
        placeholder="Name (auto-uppercased)"
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      {/* Real-time validation */}
      {email && !email.includes('@') && (
        <p style={{ color: 'red' }}>Invalid email</p>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}`}
        language="tsx"
        filename="ControlledForm.tsx"
        highlight={[4, 5, 8, 22, 27]}
      />

      <h3 style={h3Style}>Uncontrolled Component</h3>
      <CodeBlock
        code={`import { useRef, FormEvent } from 'react';

function UncontrolledForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Read values from the DOM when needed
    const name = nameRef.current?.value ?? '';
    const email = emailRef.current?.value ?? '';
    console.log({ name, email });
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* defaultValue sets the initial value, then the DOM owns it */}
      <input
        ref={nameRef}
        defaultValue=""
        placeholder="Name"
      />
      <input
        ref={emailRef}
        defaultValue=""
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// When to use uncontrolled:
// - Simple forms where you only need values on submit
// - Integrating with non-React code or DOM APIs
// - File inputs (always uncontrolled in React)
// - Performance-critical forms with many fields`}
        language="tsx"
        filename="UncontrolledForm.tsx"
        highlight={[4, 5, 10, 11, 19, 24]}
      />

      <h3 style={h3Style}>When to Use Each Pattern</h3>
      <p style={pStyle}>
        Use controlled components when you need real-time validation, conditional
        disabling, value transformation, or any behavior that depends on the current input
        value. Use uncontrolled components for simple forms where you only need values on submit,
        or for file inputs (which are always uncontrolled in React). In practice, most React
        applications use controlled components for form inputs, and form libraries like React
        Hook Form provide optimized wrappers that give you the best of both approaches.
      </p>

      {/* ─── State Machines ─── */}
      <h2 style={h2Style}>State Machines with XState</h2>
      <p style={pStyle}>
        For complex stateful logic — multi-step forms, authentication flows, media players,
        drag-and-drop interactions — managing state with <code>useState</code> and conditionals
        quickly becomes tangled. State machines formalize the possible states and transitions,
        making impossible states unrepresentable. Both Svelte and React can use XState, but
        the React integration is particularly mature.
      </p>
      <CodeBlock
        code={`import { useMachine } from '@xstate/react';
import { createMachine, assign } from 'xstate';

// Define the machine
const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',
  context: { error: null as string | null },
  states: {
    idle: {
      on: { SUBMIT: 'loading' },
    },
    loading: {
      invoke: {
        src: 'loginService',
        onDone: 'success',
        onError: {
          target: 'error',
          actions: assign({
            error: (_, event) => event.data.message,
          }),
        },
      },
    },
    success: {
      type: 'final',
    },
    error: {
      on: {
        RETRY: 'loading',
        RESET: 'idle',
      },
    },
  },
});

// Use in a component
function LoginForm() {
  const [state, send] = useMachine(authMachine, {
    services: {
      loginService: async () => {
        const res = await fetch('/api/login', { method: 'POST' });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      },
    },
  });

  return (
    <div>
      {state.matches('idle') && (
        <button onClick={() => send('SUBMIT')}>Log In</button>
      )}
      {state.matches('loading') && <p>Authenticating...</p>}
      {state.matches('success') && <p>Welcome!</p>}
      {state.matches('error') && (
        <div>
          <p style={{ color: 'red' }}>{state.context.error}</p>
          <button onClick={() => send('RETRY')}>Retry</button>
          <button onClick={() => send('RESET')}>Start Over</button>
        </div>
      )}
    </div>
  );
}`}
        language="tsx"
        filename="AuthMachine.tsx"
        highlight={[1, 5, 39, 52, 53, 54, 55]}
      />

      <p style={pStyle}>
        The state machine guarantees that you can only be in one state at a time, and transitions
        between states are explicit. There is no possibility of <code>loading</code> being true
        while <code>error</code> is also set — the states are mutually exclusive by definition.
        This eliminates an entire category of UI bugs that are common in boolean-flag-based
        state management.
      </p>

      <Callout type="insight" title="HOCs Are Mostly Dead, Long Live Compound Components">
        Most HOC and render prop patterns have been replaced by hooks. But compound components
        remain a powerful React pattern with no direct Svelte equivalent. In Svelte, you can
        achieve similar ergonomics with context and component composition, but the "dot notation"
        API (<code>Select.Option</code>) and the enforced parent-child relationship via Context
        are distinctly React idioms that you will encounter frequently in React component libraries.
      </Callout>

      {/* ─── Comparison Table ─── */}
      <h2 style={h2Style}>Pattern Availability at a Glance</h2>
      <ComparisonTable
        caption="Design Patterns: Svelte vs React"
        headers={['Pattern', 'Svelte', 'React']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['Higher-Order Components', 'Not applicable', 'withX(Component) — legacy but still used'],
          ['Render Props', 'Snippets / slot props', 'children-as-function — replaced by hooks'],
          ['Custom Hooks / Logic Reuse', 'Store factories, rune helpers', 'use* custom hooks'],
          ['Compound Components', 'Context + composition (informal)', 'Context + dot notation (formalized)'],
          ['Controlled Inputs', 'bind:value (two-way)', 'value + onChange (one-way, explicit)'],
          ['Uncontrolled Inputs', 'bind:this + read DOM', 'ref + defaultValue'],
          ['State Machines', 'XState (@xstate/svelte)', 'XState (@xstate/react)'],
          ['Provider Pattern', 'setContext / getContext', 'createContext + Provider + useContext'],
          ['Container/Presentational', 'Script vs template separation', 'Smart component + dumb component'],
          ['Forwarding Refs', 'bind:this on component', 'forwardRef() or ref prop (React 19)'],
          ['Portals', 'Not built-in (use action)', '<createPortal(child, container)>'],
          ['Render callbacks', 'Snippet props', 'Function-as-child or render prop'],
        ]}
      />

      <p style={pStyle}>
        The landscape of React patterns is broader than Svelte's because React has been around
        longer and its minimal API surface invites creative solutions. Many patterns that were
        essential pre-hooks (HOCs, render props, mixins) are now historical, but understanding
        them helps you navigate legacy code. The patterns that endure — compound components,
        controlled components, state machines — solve real architectural problems and are worth
        mastering. As a Svelte developer, you will find that your instinct to keep things simple
        is an asset. Reach for complex patterns only when simpler approaches fall short.
      </p>
    </ChapterLayout>
  );
}
