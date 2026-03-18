import { useState, type FormEvent } from 'react';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { ChapterLayout } from '../components/ChapterLayout';
import { ComparisonTable } from '../components/ComparisonTable';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

// -- Interactive Signup Form Demo --
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  terms?: string;
}

function SignupFormDemo() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'developer',
    terms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setSubmitted(false);
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (form.username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    if (!form.terms) {
      errs.terms = 'You must accept the terms';
    }
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    setErrors({});
  };

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-sm)',
    border: `1px solid ${hasError ? '#fb7185' : 'var(--color-border)'}`,
    background: 'var(--color-bg-secondary)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    boxSizing: 'border-box' as const,
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600 as const,
    color: 'var(--color-text)',
    marginBottom: '0.25rem',
  };

  const errorStyle = {
    fontSize: '0.8rem',
    color: '#fb7185',
    marginTop: '0.25rem',
  };

  if (submitted) {
    return (
      <div style={{
        padding: '1.5rem',
        background: 'rgba(74, 222, 128, 0.08)',
        border: '1px solid rgba(74, 222, 128, 0.3)',
        borderRadius: 'var(--radius-sm)',
        textAlign: 'center',
      }}>
        <p style={{ fontWeight: 600, color: 'var(--color-success)', marginBottom: '0.5rem' }}>
          Account created successfully!
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          Welcome, {form.username}. You signed up as a {form.role}.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ username: '', email: '', password: '', role: 'developer', terms: false }); }}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Reset Form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={labelStyle}>Username</label>
        <input
          type="text"
          value={form.username}
          onChange={e => updateField('username', e.target.value)}
          placeholder="Enter username"
          style={inputStyle(!!errors.username)}
        />
        {errors.username && <p style={errorStyle}>{errors.username}</p>}
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => updateField('email', e.target.value)}
          placeholder="you@example.com"
          style={inputStyle(!!errors.email)}
        />
        {errors.email && <p style={errorStyle}>{errors.email}</p>}
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={labelStyle}>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={e => updateField('password', e.target.value)}
          placeholder="At least 8 characters"
          style={inputStyle(!!errors.password)}
        />
        {errors.password && <p style={errorStyle}>{errors.password}</p>}
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={labelStyle}>Role</label>
        <select
          value={form.role}
          onChange={e => updateField('role', e.target.value)}
          style={{
            ...inputStyle(false),
            appearance: 'auto' as const,
          }}
        >
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.terms}
            onChange={e => updateField('terms', e.target.checked)}
          />
          I accept the terms and conditions
        </label>
        {errors.terms && <p style={errorStyle}>{errors.terms}</p>}
      </div>
      <button
        type="submit"
        style={{
          padding: '0.5rem 1.5rem',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          background: 'var(--color-accent)',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.9rem',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Create Account
      </button>
    </form>
  );
}

const signupDemoCode = `function SignupForm() {
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    role: 'developer', terms: false,
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => { /* validation logic */ };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.username}
        onChange={e => updateField('username', e.target.value)} />
      <input value={form.email}
        onChange={e => updateField('email', e.target.value)} />
      <select value={form.role}
        onChange={e => updateField('role', e.target.value)}>
        <option value="developer">Developer</option>
      </select>
      <input type="checkbox" checked={form.terms}
        onChange={e => updateField('terms', e.target.checked)} />
      <button type="submit">Create Account</button>
    </form>
  );
}`;

function BuggyNameForm() {
  const [name] = useState('');
  return (
    <div>
      <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        Name: <input type="text" placeholder="Type here..." style={{ padding: '0.4rem', borderRadius: 0, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', marginLeft: '0.5rem' }} />
      </label>
      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--color-text)' }}>Hello, {name || 'stranger'}!</p>
      <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>Typing doesn't update the greeting — input is uncontrolled</p>
    </div>
  );
}

function FixedNameForm() {
  const [name, setName] = useState('');
  return (
    <div>
      <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        Name: <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Type here..." style={{ padding: '0.4rem', borderRadius: 0, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', marginLeft: '0.5rem' }} />
      </label>
      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--color-text)' }}>Hello, {name || 'stranger'}!</p>
    </div>
  );
}

export default function Forms() {
  return (
    <ChapterLayout id="forms">
      <p style={pStyle}>
        Form handling is one of the areas where Svelte's ergonomics shine brightest. Two-way
        binding with <code>bind:value</code> makes form inputs feel effortless -- the variable
        and the input stay in sync automatically. React takes a fundamentally different approach:
        inputs are either "controlled" (driven entirely by state) or "uncontrolled" (managed by
        the DOM). Understanding this distinction, and why React chose it, is essential for
        writing forms that behave predictably.
      </p>

      {/* ===== bind:value vs Controlled Components ===== */}
      <h2 style={h2Style}>bind:value vs Controlled Components</h2>
      <p style={pStyle}>
        In Svelte, <code>bind:value</code> creates a two-way binding between a variable and an
        input element. Change the variable, and the input updates. Type in the input, and the
        variable updates. In React, you must do both sides explicitly: you set the input's
        <code> value</code> prop from state, and you handle the <code>onChange</code> event to
        update state. This is called the "controlled component" pattern.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let name = $state('');
  let email = $state('');
</script>

<input bind:value={name} placeholder="Name" />
<input bind:value={email} type="email" placeholder="Email" />

<p>Hello, {name}! Your email is {email}.</p>`,
          filename: 'BasicForm.svelte',
          highlight: [6, 7],
        }}
        react={{
          code: `function BasicForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
      />
      <p>Hello, {name}! Your email is {email}.</p>
    </div>
  );
}`,
          filename: 'BasicForm.tsx',
          highlight: [8, 9, 13, 14],
        }}
        note="Every React input needs both value and onChange. Forget onChange and the input becomes read-only. Forget value and you lose the controlled behavior."
      />

      <Callout type="insight" title="What bind:value Really Does">
        Svelte's <code>bind:value</code> is syntactic sugar for{' '}
        <code>value={'{x}'} on:input={'{e => x = e.target.value}'}</code>. React makes you write
        that sugar yourself -- and this is deliberate. By making the data flow explicit, React
        ensures you always know where state changes originate. There is no hidden bidirectional
        flow, no magic updating -- just a value prop flowing down and a callback prop flowing up.
        This pattern, called "unidirectional data flow," is a core React principle.
      </Callout>

      {/* ===== Controlled vs Uncontrolled ===== */}
      <h2 style={h2Style}>Controlled vs Uncontrolled Components</h2>
      <p style={pStyle}>
        React distinguishes between two approaches to form inputs. A <strong>controlled</strong>
        {' '}component has its value driven by React state -- you set the <code>value</code> prop and
        handle <code>onChange</code>. An <strong>uncontrolled</strong> component lets the DOM manage
        the value internally -- you read it via a ref when you need it (typically on form submit).
      </p>

      <h3 style={h3Style}>When to Use Controlled Components</h3>
      <p style={pStyle}>
        Controlled is the default recommendation and covers most use cases. Use controlled when
        you need to: validate input on every keystroke, conditionally disable a submit button,
        format input as the user types (e.g., credit card numbers), or synchronize multiple
        fields. This is the React equivalent of Svelte's <code>bind:value</code>.
      </p>

      <h3 style={h3Style}>When Uncontrolled Is Acceptable</h3>
      <p style={pStyle}>
        Uncontrolled components using <code>useRef</code> are appropriate when you only need the
        value on submit and do not need to react to every keystroke. They are also useful for
        integrating with non-React libraries that manage their own DOM, or for file inputs
        (which are always uncontrolled in React because their value is read-only for security
        reasons).
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte doesn't have this distinction.
     bind:value always gives you reactive two-way binding.
     The closest to "uncontrolled" is reading the DOM directly -->

<script>
  let inputEl;
  let name = $state('');

  function handleSubmit() {
    // With bind: always have the latest value
    console.log(name);

    // Or read from DOM (rare in Svelte)
    console.log(inputEl.value);
  }
</script>

<input bind:value={name} bind:this={inputEl} />
<button on:click={handleSubmit}>Submit</button>`,
          filename: 'FormApproaches.svelte',
        }}
        react={{
          code: `import { useState, useRef, FormEvent } from 'react';

// Controlled -- React manages the value
function ControlledForm() {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(name); // always up to date
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}

// Uncontrolled -- DOM manages the value
function UncontrolledForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(inputRef.current?.value); // read on submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}`,
          filename: 'FormApproaches.tsx',
          highlight: [5, 14, 22, 31],
        }}
        note="Notice 'defaultValue' for uncontrolled inputs -- this sets the initial value without making React the source of truth. Using 'value' without onChange will lock the input."
      />

      {/* ===== Multiple Fields ===== */}
      <h2 style={h2Style}>Forms with Multiple Fields</h2>
      <p style={pStyle}>
        In Svelte, you simply <code>bind:value</code> each input to a different variable and you
        are done. In React, having a separate <code>useState</code> for every field gets tedious
        quickly. The standard pattern is to hold the entire form in a single state object and
        create a generic update function that uses the field name as a computed property key.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let username = $state('');
  let email = $state('');
  let bio = $state('');
  let role = $state('developer');

  function handleSubmit() {
    const data = { username, email, bio, role };
    console.log(data);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={username} placeholder="Username" />
  <input bind:value={email} type="email" />
  <textarea bind:value={bio}></textarea>
  <select bind:value={role}>
    <option value="developer">Developer</option>
    <option value="designer">Designer</option>
  </select>
  <button type="submit">Save</button>
</form>`,
          filename: 'MultiFieldForm.svelte',
        }}
        react={{
          code: `function MultiFieldForm() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    bio: '',
    role: 'developer',
  });

  // Generic updater using computed property names
  const updateField = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement |
      HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.username}
        onChange={updateField('username')} placeholder="Username" />
      <input value={form.email}
        onChange={updateField('email')} type="email" />
      <textarea value={form.bio}
        onChange={updateField('bio')} />
      <select value={form.role}
        onChange={updateField('role')}>
        <option value="developer">Developer</option>
        <option value="designer">Designer</option>
      </select>
      <button type="submit">Save</button>
    </form>
  );
}`,
          filename: 'MultiFieldForm.tsx',
          highlight: [10, 11, 12, 13, 14],
        }}
        note="The generic updateField pattern is the React workhorse for multi-field forms. It replaces N separate setter functions with one reusable factory function."
      />

      {/* ===== Select, Checkbox, Radio ===== */}
      <h2 style={h2Style}>Select, Checkbox, and Radio Inputs</h2>
      <p style={pStyle}>
        Each input type has slightly different binding mechanics. Svelte handles them all with
        <code> bind:value</code> or <code>bind:checked</code> and <code>bind:group</code>. React
        uses <code>value</code>/<code>onChange</code> for text inputs and selects,
        <code> checked</code>/<code>onChange</code> for checkboxes, and a manual matching pattern
        for radio buttons.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  let color = $state('red');
  let agree = $state(false);
  let size = $state('medium');
  let toppings = $state([]);
</script>

<!-- Select -->
<select bind:value={color}>
  <option value="red">Red</option>
  <option value="blue">Blue</option>
  <option value="green">Green</option>
</select>

<!-- Checkbox -->
<label>
  <input type="checkbox" bind:checked={agree} />
  I agree
</label>

<!-- Radio group -->
{#each ['small', 'medium', 'large'] as s}
  <label>
    <input type="radio" bind:group={size} value={s} />
    {s}
  </label>
{/each}

<!-- Checkbox group (multiple selection) -->
{#each ['cheese', 'pepperoni', 'mushroom'] as t}
  <label>
    <input type="checkbox" bind:group={toppings} value={t} />
    {t}
  </label>
{/each}`,
          filename: 'InputTypes.svelte',
          highlight: [9, 17, 23, 31],
        }}
        react={{
          code: `function InputTypes() {
  const [color, setColor] = useState('red');
  const [agree, setAgree] = useState(false);
  const [size, setSize] = useState('medium');
  const [toppings, setToppings] = useState<string[]>([]);

  const toggleTopping = (topping: string) => {
    setToppings(prev =>
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };

  return (
    <div>
      {/* Select */}
      <select value={color}
        onChange={e => setColor(e.target.value)}>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </select>

      {/* Checkbox */}
      <label>
        <input type="checkbox" checked={agree}
          onChange={e => setAgree(e.target.checked)} />
        I agree
      </label>

      {/* Radio group */}
      {['small', 'medium', 'large'].map(s => (
        <label key={s}>
          <input type="radio" value={s}
            checked={size === s}
            onChange={() => setSize(s)} />
          {s}
        </label>
      ))}

      {/* Checkbox group (manual) */}
      {['cheese', 'pepperoni', 'mushroom'].map(t => (
        <label key={t}>
          <input type="checkbox"
            checked={toppings.includes(t)}
            onChange={() => toggleTopping(t)} />
          {t}
        </label>
      ))}
    </div>
  );
}`,
          filename: 'InputTypes.tsx',
          highlight: [7, 8, 9, 10, 11, 28, 29, 36, 37, 38, 47, 48, 49],
        }}
        note="Svelte's bind:group handles radio and checkbox groups automatically. In React, you must manually check the 'checked' prop and handle the toggle logic for checkbox groups yourself."
      />

      <p style={pStyle}>
        The checkbox group pattern is where React's verbosity is most noticeable. Svelte's
        <code> bind:group</code> automatically manages adding and removing values from an array.
        In React, you must implement the toggle logic explicitly -- checking whether the value
        exists in the array and either adding or removing it. This is straightforward but
        repetitive, which is one reason form libraries are so popular in the React ecosystem.
      </p>

      {/* ===== Form Libraries ===== */}
      <h2 style={h2Style}>Form Libraries: Compensating for the Verbosity</h2>
      <p style={pStyle}>
        The React ecosystem has produced several mature form libraries that bring back much of the
        convenience Svelte developers enjoy with <code>bind:value</code>. These libraries handle
        state management, validation, error display, and submission -- all with significantly
        less boilerplate than raw controlled components.
      </p>

      <h3 style={h3Style}>React Hook Form</h3>
      <p style={pStyle}>
        React Hook Form is the most popular form library in the React ecosystem. It uses
        uncontrolled components with refs under the hood for performance, but gives you a clean API
        that feels almost as simple as Svelte's binding. It integrates well with validation
        libraries like Zod and Yup.
      </p>

      <CodeBlock
        code={`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3, 'At least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder="Username" />
      {errors.username && <span>{errors.username.message}</span>}

      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Sign Up</button>
    </form>
  );
}`}
        language="tsx"
        filename="react-hook-form-example.tsx"
        highlight={[12, 13, 20, 23, 26]}
      />

      <h3 style={h3Style}>Formik</h3>
      <p style={pStyle}>
        Formik was the original heavyweight form library for React. It uses controlled components
        and provides a more declarative API with component-based patterns. While it has been
        somewhat superseded by React Hook Form in new projects, it is still widely used in
        existing codebases.
      </p>

      <CodeBlock
        code={`import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object({
  username: Yup.string().min(3).required(),
  email: Yup.string().email().required(),
});

function SignupForm() {
  return (
    <Formik
      initialValues={{ username: '', email: '' }}
      validationSchema={schema}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <Field name="username" placeholder="Username" />
        <ErrorMessage name="username" component="span" />

        <Field name="email" type="email" />
        <ErrorMessage name="email" component="span" />

        <button type="submit">Sign Up</button>
      </Form>
    </Formik>
  );
}`}
        language="tsx"
        filename="formik-example.tsx"
        highlight={[11, 12, 13, 14, 17, 18]}
      />

      <Callout type="info" title="Choosing a Form Library">
        React Hook Form is generally recommended for new projects -- it is faster (uses uncontrolled
        components), has a smaller bundle size, and produces fewer re-renders. Formik is a solid
        choice if you prefer a more declarative, component-based API. Both libraries solve the
        same fundamental problem: making React forms as ergonomic as Svelte's <code>bind:value</code>
        while adding powerful validation and error handling.
      </Callout>

      {/* ===== Interactive Demo ===== */}
      <h2 style={h2Style}>Interactive Demo</h2>
      <p style={pStyle}>
        This demo shows a complete signup form using React's controlled component pattern with
        client-side validation. Every input is controlled -- its value comes from state, and its
        <code> onChange</code> handler updates state. Validation runs on submit and clears per-field
        errors as you correct them. Try submitting with empty fields to see the error states.
      </p>

      <InteractiveDemo title="Signup Form with Validation" code={signupDemoCode}>
        <SignupFormDemo />
      </InteractiveDemo>

      {/* ===== Comparison Table ===== */}
      <h2 style={h2Style}>Form Handling at a Glance</h2>

      <ComparisonTable
        caption="Svelte vs React form patterns"
        headers={['Pattern', 'Svelte', 'React']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['Text input binding', 'bind:value={name}', 'value={name} onChange={e => setName(e.target.value)}'],
          ['Checkbox binding', 'bind:checked={agreed}', 'checked={agreed} onChange={e => setAgreed(e.target.checked)}'],
          ['Radio group', 'bind:group={selected}', 'checked={selected === val} onChange={() => set(val)}'],
          ['Select binding', 'bind:value={choice}', 'value={choice} onChange={e => setChoice(e.target.value)}'],
          ['Textarea', 'bind:value={text}', 'value={text} onChange={e => setText(e.target.value)}'],
          ['Form submit', 'on:submit|preventDefault', 'onSubmit={e => { e.preventDefault(); ... }}'],
          ['Two-way binding', 'Built-in (bind:)', 'Manual (value + onChange)'],
          ['Uncontrolled input', 'bind:this={el} (rare)', 'ref={inputRef} + defaultValue'],
          ['Checkbox group', 'bind:group={arr}', 'Manual toggle logic with array state'],
          ['Form validation', 'Custom logic or libraries', 'React Hook Form, Formik, or custom'],
          ['File input', 'bind:files', 'ref={fileRef} (always uncontrolled)'],
        ]}
      />

      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        Forms are where you will miss Svelte's <code>bind:value</code> the most. React's controlled
        component pattern requires more code for every input -- a value prop, an onChange handler,
        and a state setter. But this verbosity carries a principle: in React, data always flows in
        one direction (parent to child via props), and changes always flow in one direction
        (child to parent via callbacks). There is no hidden bidirectional synchronization. For
        simple forms, the boilerplate feels excessive. For complex forms with validation,
        conditional fields, and dynamic sections, the explicit control pays dividends. And when
        the raw pattern gets too verbose, libraries like React Hook Form bring back Svelte-level
        ergonomics with the added bonus of schema-based validation and performant uncontrolled
        rendering under the hood.
      </p>

      <CodeExercise
        id="forms-complete-controlled"
        title="Wire Up Controlled Input"
        type="complete-the-code"
        description="This input is missing its value and onChange props, making it an uncontrolled component. In Svelte you'd use bind:value. Complete the React controlled input pattern."
        initialCode={`function NameForm() {
  const [name, setName] = useState('');

  return (
    <div>
      <label>
        Name:
        <input
          type="text"
          // TODO: Add value and onChange props
        />
      </label>
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}`}
        solution={`function NameForm() {
  const [name, setName] = useState('');

  return (
    <div>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}`}
        validationPatterns={["value={name}", "onChange={e => setName(e.target.value)}"]}
        hints={[
          "Svelte uses bind:value={name}. React needs two separate props.",
          "The value prop sets what the input displays. onChange handles user typing.",
          "Add value={name} and onChange={e => setName(e.target.value)}"
        ]}
        buggyPreview={<BuggyNameForm />}
        solvedPreview={<FixedNameForm />}
      />
    </ChapterLayout>
  );
}
