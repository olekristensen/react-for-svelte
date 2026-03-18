import { useState } from 'react';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { expect } from '../utils/codeValidator';
import { ChapterLayout } from '../components/ChapterLayout';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

// -- Interactive Todo Demo Component --
function TodoDemo() {
  const [todos, setTodos] = useState<{ id: number; text: string }[]>([
    { id: 1, text: 'Learn useState' },
    { id: 2, text: 'Understand immutable updates' },
  ]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos(prev => [...prev, { id: Date.now(), text: trimmed }]);
    setInput('');
  };

  const removeTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a todo..."
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'var(--color-accent)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0.75rem',
              marginBottom: '0.35rem',
              background: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              color: 'var(--color-text)',
            }}
          >
            <span>{todo.text}</span>
            <button
              onClick={() => removeTodo(todo.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '2px 6px',
              }}
            >
              remove
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
          No todos yet. Add one above.
        </p>
      )}
    </div>
  );
}

const todoDemoCode = `function TodoDemo() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn useState' },
    { id: 2, text: 'Understand immutable updates' },
  ]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos(prev => [...prev, { id: Date.now(), text: trimmed }]);
    setInput('');
  };

  const removeTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`;

function BuggyCounter() {
  let count = 0;
  return (
    <button onClick={() => { count++; }} style={{ padding: '0.5rem 1rem', background: 'var(--color-accent)', color: '#ffffff', border: 'none', borderRadius: 0, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
      Count: {count}
    </button>
  );
}

function FixedCounter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)} style={{ padding: '0.5rem 1rem', background: 'var(--color-accent)', color: '#ffffff', border: 'none', borderRadius: 0, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
      Count: {count}
    </button>
  );
}

function BuggyTodoList() {
  const items = ['Learn React', 'Learn Hooks'];
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input disabled placeholder="Can't add items..." style={{ padding: '0.4rem', borderRadius: 0, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', flex: 1 }} />
        <button disabled style={{ padding: '0.4rem 0.8rem', background: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)', border: 'none', borderRadius: 0 }}>Add</button>
      </div>
      <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
        {items.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function FixedTodoList() {
  const [items, setItems] = useState(['Learn React', 'Learn Hooks']);
  const [text, setText] = useState('');
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="New todo..." style={{ padding: '0.4rem', borderRadius: 0, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', flex: 1 }} />
        <button onClick={() => { if(text) { setItems(p => [...p, text]); setText(''); }}} style={{ padding: '0.4rem 0.8rem', background: 'var(--color-accent)', color: '#ffffff', border: 'none', borderRadius: 0, cursor: 'pointer', fontWeight: 600 }}>Add</button>
      </div>
      <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
        {items.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export default function State() {
  return (
    <ChapterLayout id="state">
      <p style={pStyle}>
        Reactivity is where Svelte and React diverge most sharply. In Svelte 5, the compiler
        understands your <code>$state</code> runes and surgically updates exactly the DOM nodes
        that depend on them. React takes a fundamentally different approach: you tell React what
        changed by calling setter functions, and React schedules a re-render of the entire
        component, diffing the virtual DOM to determine what actually needs updating in the
        real DOM. Coming from Svelte, this feels verbose -- but it is explicit, predictable,
        and scales to extremely large applications.
      </p>

      {/* ===== Basic State ===== */}
      <h2 style={h2Style}>Basic State: useState vs $state</h2>
      <p style={pStyle}>
        The simplest possible state is a single value -- a counter. In Svelte 5, you declare it
        with <code>let count = $state(0)</code> and mutate it directly. In React, you call
        <code> useState</code> which returns a tuple: the current value and a setter function.
        You never mutate state directly; you always go through the setter.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let count = $state(0);
</script>

<button on:click={() => count++}>
  Clicked {count} times
</button>`,
          filename: 'Counter.svelte',
        }}
        react={{
          code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
          filename: 'Counter.tsx',
          highlight: [4],
        }}
        note="useState returns an array that you destructure. The convention [thing, setThing] is universal in React codebases."
      />

      <h3 style={h3Style}>Functional Updates</h3>
      <p style={pStyle}>
        When your next state depends on the previous state, you should pass a function to the
        setter. This avoids stale closure bugs -- one of the most common pitfalls for developers
        coming from Svelte, where closures over reactive state are not an issue because the
        compiler rewires them.
      </p>

      <CodeBlock
        code={`// Dangerous -- uses stale count if batched
setCount(count + 1);
setCount(count + 1); // still just count + 1, not count + 2!

// Safe -- always uses the latest state
setCount(prev => prev + 1);
setCount(prev => prev + 1); // correctly yields count + 2`}
        language="tsx"
        filename="functional-updates.tsx"
        highlight={[2, 3, 6, 7]}
      />

      <Callout type="gotcha" title="Batched Updates">
        React state updates are batched and asynchronous. Calling <code>setCount(count + 1)</code> twice
        in the same event handler will not give you <code>count + 2</code>. Both calls see the
        same <code>count</code> value from that render. Use the functional form{' '}
        <code>setCount(prev =&gt; prev + 1)</code> when you need to stack updates.
      </Callout>

      {/* ===== Object & Array State ===== */}
      <h2 style={h2Style}>Object and Array State</h2>
      <p style={pStyle}>
        This is where the mental model difference hits hardest. In Svelte, you just mutate objects
        and arrays directly -- <code>user.name = 'Alice'</code> or <code>items.push(newItem)</code> --
        and the compiler picks up the change. In React, state is treated as immutable. You must create
        new references for React to detect the change. This means spreading objects and creating
        new arrays instead of pushing or splicing.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let user = $state({ name: 'Alice', age: 30 });
  let items = $state(['Apple', 'Banana']);

  function updateName() {
    user.name = 'Bob'; // direct mutation works
  }

  function addItem() {
    items.push('Cherry'); // direct push works
  }
</script>`,
          filename: 'MutableState.svelte',
          highlight: [6, 10],
        }}
        react={{
          code: `import { useState } from 'react';

function ImmutableState() {
  const [user, setUser] = useState({ name: 'Alice', age: 30 });
  const [items, setItems] = useState(['Apple', 'Banana']);

  function updateName() {
    // Must create a new object
    setUser({ ...user, name: 'Bob' });
  }

  function addItem() {
    // Must create a new array
    setItems([...items, 'Cherry']);
  }

  return <div>...</div>;
}`,
          filename: 'ImmutableState.tsx',
          highlight: [9, 14],
        }}
        note="React uses referential equality to detect changes. If you mutate an object and pass the same reference to setState, React will skip the re-render because Object.is(oldState, newState) returns true."
      />

      <h3 style={h3Style}>Updating Nested Objects</h3>
      <p style={pStyle}>
        Nested state updates are the most tedious part of React's immutable model. Every level of
        nesting requires its own spread. Svelte developers coming to React often reach for
        libraries like Immer to regain a mutable-feeling API while still producing immutable updates
        under the hood.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let form = $state({
    user: {
      address: {
        city: 'Copenhagen'
      }
    }
  });

  function updateCity() {
    form.user.address.city = 'Aarhus';
  }
</script>`,
          filename: 'NestedState.svelte',
        }}
        react={{
          code: `function NestedState() {
  const [form, setForm] = useState({
    user: {
      address: {
        city: 'Copenhagen'
      }
    }
  });

  function updateCity() {
    setForm({
      ...form,
      user: {
        ...form.user,
        address: {
          ...form.user.address,
          city: 'Aarhus'
        }
      }
    });
  }

  return <div>...</div>;
}`,
          filename: 'NestedState.tsx',
          highlight: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        }}
        note="This is admittedly verbose. Libraries like Immer (use-immer) let you write mutation-style code that produces immutable updates: produce(form, draft => { draft.user.address.city = 'Aarhus' })."
      />

      {/* ===== Derived State ===== */}
      <h2 style={h2Style}>Derived State</h2>
      <p style={pStyle}>
        Derived state is a value computed from other state. In Svelte 5, you declare it with
        <code> $derived</code> and the compiler tracks its dependencies automatically. In React, the
        simplest approach is just computing the value in the render body -- it recalculates every
        render. For expensive computations, you wrap it with <code>useMemo</code> to cache the result
        and only recompute when dependencies change.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let items = $state([
    { name: 'Milk', price: 12 },
    { name: 'Bread', price: 8 },
    { name: 'Cheese', price: 45 },
  ]);

  // Automatically tracks items dependency
  let total = $derived(
    items.reduce((sum, item) => sum + item.price, 0)
  );

  let expensive = $derived(
    items.filter(item => item.price > 10)
  );
</script>

<p>Total: {total} kr</p>
<p>{expensive.length} expensive items</p>`,
          filename: 'Derived.svelte',
          highlight: [9, 10, 11, 13, 14, 15],
        }}
        react={{
          code: `import { useState, useMemo } from 'react';

function Derived() {
  const [items, setItems] = useState([
    { name: 'Milk', price: 12 },
    { name: 'Bread', price: 8 },
    { name: 'Cheese', price: 45 },
  ]);

  // Simple derivation -- recalculates every render
  const total = items.reduce(
    (sum, item) => sum + item.price, 0
  );

  // Memoized -- only recalculates when items changes
  const expensive = useMemo(
    () => items.filter(item => item.price > 10),
    [items]
  );

  return (
    <>
      <p>Total: {total} kr</p>
      <p>{expensive.length} expensive items</p>
    </>
  );
}`,
          filename: 'Derived.tsx',
          highlight: [11, 12, 13, 16, 17, 18, 19],
        }}
        note="For cheap computations, skip useMemo and just compute inline. useMemo itself has overhead -- it is an optimization, not a semantic guarantee. Svelte's $derived is both semantic and optimized."
      />

      <h3 style={h3Style}>When to useMemo vs Inline Computation</h3>
      <p style={pStyle}>
        A common mistake for newcomers is wrapping everything in <code>useMemo</code>. The React
        team's guidance is clear: compute inline by default, and only reach for <code>useMemo</code>{' '}
        when you can measure that the computation is expensive (filtering/sorting large lists,
        creating complex objects, or running regex over large strings). If the dependency array
        is wrong, <code>useMemo</code> will return stale values -- a bug category that does not
        exist in Svelte's compiler-driven model.
      </p>

      {/* ===== useReducer ===== */}
      <h2 style={h2Style}>useReducer for Complex State</h2>
      <p style={pStyle}>
        When state logic gets complex -- multiple sub-values, state transitions that depend on
        the current state, or actions that should be dispatched from deeply nested components --
        React offers <code>useReducer</code>. This is inspired by Redux and the Elm architecture.
        You define a reducer function that takes the current state and an action, and returns new
        state. The component dispatches actions instead of calling setters directly.
      </p>
      <p style={pStyle}>
        Svelte does not have a direct equivalent because mutable state and the compiler's
        fine-grained reactivity make reducer patterns less necessary. But if you have used Svelte
        stores with a custom <code>update</code> pattern, the concept will feel familiar.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let todos = $state([]);
  let filter = $state('all');

  function addTodo(text) {
    todos.push({ id: Date.now(), text, done: false });
  }

  function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  }

  function removeTodo(id) {
    const idx = todos.findIndex(t => t.id === id);
    if (idx !== -1) todos.splice(idx, 1);
  }

  let filtered = $derived(
    filter === 'all' ? todos
      : filter === 'done' ? todos.filter(t => t.done)
      : todos.filter(t => !t.done)
  );
</script>`,
          filename: 'TodoStore.svelte',
        }}
        react={{
          code: `import { useReducer } from 'react';

type Todo = { id: number; text: string; done: boolean };
type State = { todos: Todo[]; filter: 'all' | 'done' | 'active' };

type Action =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'REMOVE'; id: number }
  | { type: 'SET_FILTER'; filter: State['filter'] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        todos: [...state.todos,
          { id: Date.now(), text: action.text, done: false }],
      };
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, done: !t.done } : t
        ),
      };
    case 'REMOVE':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.id),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(reducer, {
    todos: [],
    filter: 'all',
  });

  const filtered = state.filter === 'all'
    ? state.todos
    : state.todos.filter(t =>
        state.filter === 'done' ? t.done : !t.done
      );

  return <div>...</div>;
}`,
          filename: 'TodoReducer.tsx',
          highlight: [12, 40, 41],
        }}
        note="useReducer shines when you need to pass dispatch to child components. Because dispatch identity is stable across renders, children receiving it do not need to re-render when parent state changes."
      />

      <Callout type="insight" title="Compile-Time vs Runtime Reactivity">
        Svelte's compiler tracks dependencies at build time. It knows which variables your template
        reads and wires up surgical updates. React's hooks are a runtime contract -- the call order
        must be identical on every render, and dependency arrays are your manual equivalent of
        Svelte's automatic tracking. This is the deepest philosophical difference between the two
        frameworks.
      </Callout>

      {/* ===== Interactive Demo ===== */}
      <h2 style={h2Style}>Interactive Demo</h2>
      <p style={pStyle}>
        This demo shows <code>useState</code> with an array, a controlled input, and immutable
        update patterns in action. Notice how adding a todo creates a new array with the spread
        operator, and removing filters to produce a new array reference.
      </p>

      <InteractiveDemo title="Todo List with useState" code={todoDemoCode}>
        <TodoDemo />
      </InteractiveDemo>

      {/* ===== Comparison Table ===== */}
      <h2 style={h2Style}>State Management at a Glance</h2>

      <ComparisonTable
        caption="Svelte vs React state management approaches"
        headers={['Concept', 'Svelte 5', 'React']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['Declare state', 'let x = $state(value)', 'const [x, setX] = useState(value)'],
          ['Update state', 'x = newValue (direct mutation)', 'setX(newValue) (setter function)'],
          ['Update object', 'obj.key = value', 'setObj({ ...obj, key: value })'],
          ['Update array', 'arr.push(item)', 'setArr([...arr, item])'],
          ['Derived value', 'let y = $derived(expr)', 'const y = useMemo(() => expr, [deps])'],
          ['Complex state', 'Multiple $state + functions', 'useReducer(reducer, initial)'],
          ['Dependency tracking', 'Automatic (compiler)', 'Manual (dependency arrays)'],
          ['Update timing', 'Synchronous (microtask batched)', 'Asynchronous (batched by React)'],
          ['Mutation model', 'Mutable (compiler proxies)', 'Immutable (new references)'],
          ['Stale closures', 'Not an issue (compiler rewires)', 'Common pitfall (use functional updates)'],
        ]}
      />

      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        The transition from Svelte's reactivity to React's state management is the single
        biggest mental shift you will make. In Svelte, the compiler is your co-pilot -- it
        tracks dependencies and makes mutations "just work." In React, you are in full control:
        you decide when state changes, how it changes, and what depends on what. This explicitness
        is not a limitation -- it is a design choice that makes state flow auditable and
        predictable in large teams. Once you internalize the immutable update pattern and the
        functional setter form, React state management becomes second nature.
      </p>

      <CodeExercise
        id="state-fix-setter"
        title="Fix the State Setter"
        type="fix-the-bug"
        description="This counter tries to increment using direct mutation. In React, state must be updated immutably using the setter function. Fix the bug."
        initialCode={`function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    count++;  // Bug: direct mutation!
  }

  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}`}
        solution={`function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}`}
        validationPatterns={["setCount("]}
        tests={[
          {
            name: 'Counter starts at 0',
            test: (ctx) => { ctx.render(); expect(ctx.stateValue(0)).toBe(0); }
          },
          {
            name: 'Counter increments on click',
            test: (ctx) => { ctx.render(); ctx.click('button'); expect(ctx.stateUpdates(0)[0]).toBe(1); }
          },
        ]}
        hints={[
          "In React, you cannot modify state variables directly — they are read-only",
          "Use the setter function returned by useState to update state",
          "Replace count++ with setCount(count + 1) or setCount(c => c + 1)"
        ]}
        buggyPreview={<BuggyCounter />}
        solvedPreview={<FixedCounter />}
      />

      <CodeExercise
        id="state-complete-array"
        title="Immutable Array Update"
        type="complete-the-code"
        description="Complete the addItem function to add a new todo to the list. Remember: in React, you must create a new array rather than mutating the existing one."
        initialCode={`function TodoList() {
  const [items, setItems] = useState(['Learn React', 'Learn Hooks']);
  const [text, setText] = useState('');

  function addItem() {
    // TODO: Add text to items immutably
    // Then clear the text input
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addItem}>Add</button>
      <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}`}
        solution={`function TodoList() {
  const [items, setItems] = useState(['Learn React', 'Learn Hooks']);
  const [text, setText] = useState('');

  function addItem() {
    setItems([...items, text]);
    setText('');
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addItem}>Add</button>
      <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}`}
        validationPatterns={["setItems([...items, text])", "setText('')"]}
        tests={[
          {
            name: 'Items list starts with initial values',
            test: (ctx) => { ctx.render(); expect(Array.isArray(ctx.stateValue(0))).toBeTruthy(); }
          },
          {
            name: 'Add item creates new array with spread',
            test: (ctx) => {
              ctx.render();
              ctx.click('button');
              const updates = ctx.stateUpdates(0);
              expect(updates.length).toBeGreaterThan(0);
            }
          },
        ]}
        hints={[
          "Use the spread operator to create a new array with all existing items plus the new one",
          "setItems([...items, text]) creates a new array",
          "Don't forget to clear the text input with setText('')"
        ]}
        buggyPreview={<BuggyTodoList />}
        solvedPreview={<FixedTodoList />}
      />
    </ChapterLayout>
  );
}
