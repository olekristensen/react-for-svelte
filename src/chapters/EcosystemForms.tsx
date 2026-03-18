import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function EcosystemForms() {
  return (
    <ChapterLayout id="ecosystem-forms">
      <p style={pStyle}>
        In the Forms chapter, we covered how React handles controlled components — the
        basic building blocks of <code>value</code>, <code>onChange</code>, and{' '}
        <code>useState</code>. That knowledge is essential, but it only tells half the
        story. Here we go deep into the library ecosystem that React developers actually
        rely on for real-world form development.
      </p>
      <p style={pStyle}>
        In Svelte, the language <em>is</em> the form library. <code>bind:value</code> does
        the heavy lifting, reactivity handles derived state, and you rarely reach for
        anything beyond what the framework gives you. In React, that simplicity doesn't
        come for free — you need a library to reclaim it.
      </p>

      {/* ------------------------------------------------------------------ */}
      <h2 style={h2Style}>Why Form Libraries Exist in React</h2>

      <p style={pStyle}>
        The gap becomes obvious the moment you build a form with more than two fields.
        Compare how Svelte and raw React handle a simple signup form with validation:
      </p>

      <CodeComparison
        svelte={{
          filename: 'SignupForm.svelte',
          language: 'svelte',
          code: `<script lang="ts">
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let errors = $state<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (name.length < 2) e.name = 'Name too short';
    if (!email.includes('@')) e.email = 'Invalid email';
    if (password.length < 8) e.password = 'Min 8 characters';
    errors = e;
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) {
      console.log('Submit:', { name, email, password });
    }
  }
</script>

<form onsubmit|preventDefault={handleSubmit}>
  <input bind:value={name} placeholder="Name" />
  {#if errors.name}<span class="error">{errors.name}</span>{/if}

  <input bind:value={email} type="email" placeholder="Email" />
  {#if errors.email}<span class="error">{errors.email}</span>{/if}

  <input bind:value={password} type="password" placeholder="Password" />
  {#if errors.password}<span class="error">{errors.password}</span>{/if}

  <button type="submit">Sign Up</button>
</form>`,
        }}
        react={{
          filename: 'SignupForm.tsx',
          language: 'tsx',
          code: `import { useState, FormEvent } from 'react';

export function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (name.length < 2) e.name = 'Name too short';
    if (!email.includes('@')) e.email = 'Invalid email';
    if (password.length < 8) e.password = 'Min 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (validate()) {
      console.log('Submit:', { name, email, password });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)}
        placeholder="Name" />
      {errors.name && <span className="error">{errors.name}</span>}

      <input value={email} onChange={e => setEmail(e.target.value)}
        type="email" placeholder="Email" />
      {errors.email && <span className="error">{errors.email}</span>}

      <input value={password} onChange={e => setPassword(e.target.value)}
        type="password" placeholder="Password" />
      {errors.password && <span className="error">{errors.password}</span>}

      <button type="submit">Sign Up</button>
    </form>
  );
}`,
        }}
        note="Three fields, three useState calls, three onChange handlers. The boilerplate scales linearly with field count."
      />

      <Callout type="insight" title="The Binding Gap">
        In Svelte, <code>bind:value</code> gives you two-way binding for free. In React,
        every input needs <code>onChange</code> + state + <code>value</code>. Form
        libraries exist to eliminate this boilerplate — they bring back the ergonomics
        that Svelte developers already take for granted.
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2 style={h2Style}>React Hook Form Deep Dive</h2>

      <p style={pStyle}>
        React Hook Form (RHF) is the most widely used form library in the React ecosystem.
        Its API is small, its performance is excellent, and it integrates cleanly with
        validation libraries like Zod. If you're coming from Svelte, think of RHF as
        the library that gives React something close to <code>bind:value</code> ergonomics.
      </p>

      <h3 style={h3Style}>Basic Usage: register, handleSubmit, errors</h3>

      <p style={pStyle}>
        The core of RHF is three things: <code>register</code> connects an input to the
        form, <code>handleSubmit</code> wraps your submission logic, and{' '}
        <code>formState.errors</code> gives you validation results.
      </p>

      <CodeBlock
        filename="ContactForm.tsx"
        language="tsx"
        code={`import { useForm } from 'react-hook-form';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'At least 2 characters' },
        })}
        placeholder="Your name"
      />
      {errors.name && <span className="error">{errors.name.message}</span>}

      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
            message: 'Invalid email address',
          },
        })}
        type="email"
        placeholder="Your email"
      />
      {errors.email && <span className="error">{errors.email.message}</span>}

      <textarea
        {...register('message', {
          required: 'Message is required',
          maxLength: { value: 500, message: 'Max 500 characters' },
        })}
        placeholder="Your message"
      />
      {errors.message && <span className="error">{errors.message.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}`}
      />

      <p style={pStyle}>
        Notice how <code>register</code> returns an object with <code>ref</code>,{' '}
        <code>onChange</code>, <code>onBlur</code>, and <code>name</code>. Spreading it
        onto the input is all you need — no <code>useState</code>, no manual wiring.
      </p>

      <h3 style={h3Style}>Schema Validation with Zod</h3>

      <p style={pStyle}>
        Inline validation rules work, but for complex forms you want a schema. Zod pairs
        perfectly with RHF through the <code>@hookform/resolvers</code> package. Define
        your shape once — get type inference and validation in a single pass.
      </p>

      <CodeBlock
        filename="RegistrationForm.tsx"
        language="tsx"
        code={`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registrationSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, and underscores only'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'admin', 'editor']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Infer the TypeScript type from the schema — no duplication
type RegistrationData = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { role: 'user' },
  });

  const onSubmit = (data: RegistrationData) => {
    console.log('Valid data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder="Username" />
      {errors.username && <p className="error">{errors.username.message}</p>}

      <input {...register('email')} type="email" placeholder="Email" />
      {errors.email && <p className="error">{errors.email.message}</p>}

      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <p className="error">{errors.password.message}</p>}

      <input {...register('confirmPassword')} type="password"
        placeholder="Confirm password" />
      {errors.confirmPassword && (
        <p className="error">{errors.confirmPassword.message}</p>
      )}

      <select {...register('role')}>
        <option value="user">User</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>
      {errors.role && <p className="error">{errors.role.message}</p>}

      <button type="submit">Register</button>
    </form>
  );
}`}
      />

      <h3 style={h3Style}>Dynamic Fields with useFieldArray</h3>

      <p style={pStyle}>
        One of RHF's strongest features is <code>useFieldArray</code> — it handles
        dynamic lists of fields (add, remove, reorder) with proper key management and
        zero re-renders of sibling fields.
      </p>

      <CodeBlock
        filename="InvoiceForm.tsx"
        language="tsx"
        code={`import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Required'),
  quantity: z.coerce.number().min(1, 'At least 1'),
  unitPrice: z.coerce.number().min(0.01, 'Must be positive'),
});

const invoiceSchema = z.object({
  client: z.string().min(1, 'Client name is required'),
  items: z.array(lineItemSchema).min(1, 'Add at least one item'),
  notes: z.string().optional(),
});

type InvoiceData = z.infer<typeof invoiceSchema>;

export function InvoiceForm() {
  const { register, control, handleSubmit, watch, formState: { errors } } =
    useForm<InvoiceData>({
      resolver: zodResolver(invoiceSchema),
      defaultValues: {
        client: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        notes: '',
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const total = watchedItems?.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  ) ?? 0;

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('client')} placeholder="Client name" />
      {errors.client && <p className="error">{errors.client.message}</p>}

      <h3>Line Items</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="line-item">
          <input {...register(\`items.\${index}.description\`)}
            placeholder="Description" />
          <input {...register(\`items.\${index}.quantity\`)}
            type="number" placeholder="Qty" />
          <input {...register(\`items.\${index}.unitPrice\`)}
            type="number" step="0.01" placeholder="Price" />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button"
        onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}>
        + Add Item
      </button>

      {errors.items?.message && (
        <p className="error">{errors.items.message}</p>
      )}

      <p className="total">Total: \${total.toFixed(2)}</p>

      <textarea {...register('notes')} placeholder="Notes (optional)" />
      <button type="submit">Create Invoice</button>
    </form>
  );
}`}
      />

      <h3 style={h3Style}>Multi-Step Form Wizard</h3>

      <p style={pStyle}>
        Multi-step forms are a common pattern. In Svelte, you track the step with a
        reactive variable and conditionally show sections. In React Hook Form, you use{' '}
        <code>watch</code> and <code>trigger</code> to validate individual steps before
        advancing.
      </p>

      <CodeComparison
        svelte={{
          filename: 'MultiStepForm.svelte',
          language: 'svelte',
          code: `<script lang="ts">
  let step = $state(1);

  let personal = $state({ name: '', email: '' });
  let address = $state({ street: '', city: '', zip: '' });
  let preferences = $state({ newsletter: false, theme: 'light' });

  let errors = $state<Record<string, string>>({});

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!personal.name) e.name = 'Required';
      if (!personal.email.includes('@')) e.email = 'Invalid';
    } else if (step === 2) {
      if (!address.street) e.street = 'Required';
      if (!address.city) e.city = 'Required';
    }
    errors = e;
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep()) step++;
  }

  function submit() {
    console.log({ ...personal, ...address, ...preferences });
  }
</script>

<form onsubmit|preventDefault={submit}>
  {#if step === 1}
    <h3>Personal Info</h3>
    <input bind:value={personal.name} placeholder="Name" />
    {#if errors.name}<span>{errors.name}</span>{/if}
    <input bind:value={personal.email} placeholder="Email" />
    {#if errors.email}<span>{errors.email}</span>{/if}
    <button type="button" onclick={next}>Next</button>

  {:else if step === 2}
    <h3>Address</h3>
    <input bind:value={address.street} placeholder="Street" />
    <input bind:value={address.city} placeholder="City" />
    <input bind:value={address.zip} placeholder="Zip" />
    <button type="button" onclick={() => step--}>Back</button>
    <button type="button" onclick={next}>Next</button>

  {:else}
    <h3>Preferences</h3>
    <label>
      <input type="checkbox" bind:checked={preferences.newsletter} />
      Subscribe to newsletter
    </label>
    <select bind:value={preferences.theme}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
    <button type="button" onclick={() => step--}>Back</button>
    <button type="submit">Submit</button>
  {/if}

  <p>Step {step} of 3</p>
</form>`,
        }}
        react={{
          filename: 'MultiStepForm.tsx',
          language: 'tsx',
          code: `import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  street: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  zip: z.string().optional(),
  newsletter: z.boolean(),
  theme: z.enum(['light', 'dark']),
});

type FormData = z.infer<typeof schema>;

const stepFields: Record<number, (keyof FormData)[]> = {
  1: ['name', 'email'],
  2: ['street', 'city', 'zip'],
  3: ['newsletter', 'theme'],
};

export function MultiStepForm() {
  const [step, setStep] = useState(1);
  const {
    register, handleSubmit, trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      newsletter: false,
      theme: 'light',
    },
  });

  const next = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = (data: FormData) => {
    console.log('Complete:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {step === 1 && (
        <>
          <h3>Personal Info</h3>
          <input {...register('name')} placeholder="Name" />
          {errors.name && <span>{errors.name.message}</span>}
          <input {...register('email')} placeholder="Email" />
          {errors.email && <span>{errors.email.message}</span>}
          <button type="button" onClick={next}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <h3>Address</h3>
          <input {...register('street')} placeholder="Street" />
          {errors.street && <span>{errors.street.message}</span>}
          <input {...register('city')} placeholder="City" />
          {errors.city && <span>{errors.city.message}</span>}
          <input {...register('zip')} placeholder="Zip" />
          <button type="button" onClick={() => setStep(s => s - 1)}>
            Back
          </button>
          <button type="button" onClick={next}>Next</button>
        </>
      )}

      {step === 3 && (
        <>
          <h3>Preferences</h3>
          <label>
            <input type="checkbox" {...register('newsletter')} />
            Subscribe to newsletter
          </label>
          <select {...register('theme')}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <button type="button" onClick={() => setStep(s => s - 1)}>
            Back
          </button>
          <button type="submit">Submit</button>
        </>
      )}

      <p>Step {step} of 3</p>
    </form>
  );
}`,
        }}
        note="RHF's trigger() lets you validate specific fields per step, keeping the same single form instance across all steps."
      />

      <Callout type="info" title="Uncontrolled Under the Hood">
        React Hook Form uses uncontrolled inputs internally. Inputs are registered via{' '}
        <code>ref</code> and don't re-render on every keystroke. This makes RHF
        significantly faster than Formik for large forms — the component tree stays
        stable while only the changed input updates. Svelte developers will appreciate
        this: it's closer to how the DOM actually works.
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2 style={h2Style}>TanStack Form</h2>

      <p style={pStyle}>
        TanStack Form is the newest major player in the React form ecosystem. Built by
        the same team behind TanStack Query and TanStack Router, it takes a different
        approach than RHF: fully controlled, type-safe to the core, and designed to work
        across frameworks (React, Vue, Solid, Angular). If you're already invested in
        the TanStack ecosystem, TanStack Form fits in naturally.
      </p>

      <h3 style={h3Style}>Field-Level API and Async Validation</h3>

      <CodeBlock
        filename="ProfileForm.tsx"
        language="tsx"
        code={`import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

export function ProfileForm() {
  const form = useForm({
    defaultValues: {
      username: '',
      displayName: '',
      bio: '',
    },
    onSubmit: async ({ value }) => {
      await fetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(value),
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="username"
        validators={{
          onChange: z.string().min(3, 'At least 3 characters'),
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            const res = await fetch(\`/api/check-username?u=\${value}\`);
            const { available } = await res.json();
            return available ? undefined : 'Username is already taken';
          },
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="error">{field.state.meta.errors.join(', ')}</p>
            )}
            {field.state.meta.isValidating && (
              <span className="hint">Checking availability...</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="displayName"
        validators={{
          onChange: z.string().min(1, 'Display name is required'),
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="error">{field.state.meta.errors.join(', ')}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="bio">
        {(field) => (
          <div>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              maxLength={160}
            />
            <span className="hint">{field.state.value.length}/160</span>
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}`}
      />

      <h3 style={h3Style}>RHF vs TanStack Form: API Comparison</h3>

      <p style={pStyle}>
        The two libraries solve the same problem differently. RHF is concise and
        spread-based; TanStack Form is explicit and render-prop-based. Here they are
        side by side:
      </p>

      <CodeComparison
        svelte={{
          filename: 'RHF Pattern',
          language: 'tsx',
          code: `// React Hook Form
import { useForm } from 'react-hook-form';

function MyForm() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<{ email: string }>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register spreads ref + onChange + onBlur + name */}
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
            message: 'Invalid email',
          },
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">Send</button>
    </form>
  );
}

// Strengths:
// - Minimal boilerplate (spread one object)
// - Uncontrolled = fewer re-renders
// - Massive community, rich ecosystem
// - First-class Zod/Yup resolver support`,
        }}
        react={{
          filename: 'TanStack Form Pattern',
          language: 'tsx',
          code: `// TanStack Form
import { useForm } from '@tanstack/react-form';

function MyForm() {
  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => onSubmit(value),
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      {/* Render-prop pattern: full control */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value ? 'Email is required'
            : !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)
            ? 'Invalid email'
            : undefined,
        }}
      >
        {(field) => (
          <>
            <input
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.length > 0 && (
              <p>{field.state.meta.errors[0]}</p>
            )}
          </>
        )}
      </form.Field>

      <button type="submit">Send</button>
    </form>
  );
}

// Strengths:
// - Full type safety (no string keys)
// - Built-in async validation
// - Framework-agnostic core
// - Fine-grained subscription model`,
        }}
        note="RHF is more concise; TanStack Form gives you more explicit control. Both work well with Zod."
      />

      <Callout type="info" title="TanStack Ecosystem Consistency">
        TanStack Form is newer and framework-agnostic. If you're already using TanStack
        Query for data fetching and TanStack Router for routing, TanStack Form completes
        the stack with consistent patterns — the same mental model of type-safe,
        declarative APIs across every layer of your application.
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2 style={h2Style}>Validation Libraries</h2>

      <p style={pStyle}>
        Both RHF and TanStack Form work with standalone validation libraries. The most
        popular is Zod — a TypeScript-first schema library that has become the de facto
        standard for validation in modern React applications.
      </p>

      <h3 style={h3Style}>Zod: Schema-First Validation</h3>

      <CodeBlock
        filename="schemas.ts"
        language="typescript"
        code={`import { z } from 'zod';

// Basic string validation
const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')
  .trim();

// Object schemas compose naturally
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'Use 2-letter state code'),
  zip: z.string().regex(/^\\d{5}(-\\d{4})?$/, 'Invalid zip code'),
  country: z.string().default('US'),
});

// Enums, unions, and optionals
const contactSchema = z.object({
  type: z.enum(['email', 'phone', 'mail']),
  value: z.string().min(1),
  isPrimary: z.boolean().default(false),
});

// Refinements for cross-field validation
const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine(
  (data) => data.endDate > data.startDate,
  { message: 'End date must be after start date', path: ['endDate'] }
);

// Transforms: parse input into a different shape
const csvInputSchema = z.string()
  .transform((val) => val.split(',').map((s) => s.trim()))
  .pipe(z.array(z.string().email('Invalid email in list')));

// Compose schemas together
const userProfileSchema = z.object({
  name: nameSchema,
  address: addressSchema,
  contacts: z.array(contactSchema).min(1, 'At least one contact'),
  availability: dateRangeSchema,
  tags: csvInputSchema.optional(),
});

// Infer TypeScript types from schemas
type UserProfile = z.infer<typeof userProfileSchema>;

// Use the same schema for API validation
export function validateApiPayload(body: unknown): UserProfile {
  return userProfileSchema.parse(body); // throws ZodError if invalid
}

// Or get a safe result without throwing
export function safeValidate(body: unknown) {
  return userProfileSchema.safeParse(body);
  // { success: true, data: UserProfile } | { success: false, error: ZodError }
}`}
      />

      <h3 style={h3Style}>Other Validation Libraries Worth Knowing</h3>

      <p style={pStyle}>
        <strong>Yup</strong> — The original schema library paired with Formik. It uses a
        similar chaining API but predates TypeScript-first design. You'll see it in older
        codebases and Formik projects. If you're starting fresh, Zod is the better choice.
      </p>

      <p style={pStyle}>
        <strong>Valibot</strong> — A newer alternative to Zod with a modular, tree-shakeable
        design. Where Zod bundles everything, Valibot lets bundlers strip unused
        validators. The result is significantly smaller bundle sizes for simple schemas.
        The API is function-based rather than method-chaining.
      </p>

      <Callout type="insight" title="One Schema, Three Use Cases">
        Zod schemas can be shared across form validation, API endpoint validation, and
        tRPC procedure definitions — one schema definition, three use cases. This is
        the killer feature. Define your data shape once, and it enforces types and
        validation everywhere: in the browser form, on the API route, and across the
        RPC boundary.
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <h2 style={h2Style}>When NOT to Use a Form Library</h2>

      <p style={pStyle}>
        Form libraries add a dependency and an abstraction layer. For simple cases, raw
        controlled components in React are perfectly fine — and arguably clearer. Don't
        reach for RHF to build a search bar.
      </p>

      <h3 style={h3Style}>The Rule of Thumb</h3>

      <p style={pStyle}>
        If your form has fewer than four fields with no cross-field validation, no dynamic
        fields, and no multi-step logic — raw <code>useState</code> is the right call.
        The moment you find yourself wiring up error states for multiple fields, tracking
        touched/dirty status, or adding dynamic rows, a library starts paying for itself.
      </p>

      <ComparisonTable
        headers={['Scenario', 'Approach', 'Why']}
        columnFormat={['prose', 'code', 'prose']}
        rows={[
          [
            'Login form (email + password)',
            'Raw useState',
            'Two fields, simple required validation — a library adds complexity without benefit',
          ],
          [
            'Search bar with filters',
            'Raw useState or useReducer',
            'Typically no validation needed, just state management for query params',
          ],
          [
            'Settings page (5-10 toggles)',
            'Raw useState or RHF',
            'Depends on complexity — if fields are independent, raw is fine; if there are dependencies, use RHF',
          ],
          [
            'Multi-step onboarding wizard',
            'React Hook Form + Zod',
            'Step validation, shared state across steps, and schema enforcement justify the library',
          ],
          [
            'Data entry application',
            'React Hook Form + Zod',
            'Many fields, complex validation rules, performance matters — this is where RHF shines',
          ],
          [
            'Survey builder with dynamic questions',
            'TanStack Form',
            'Dynamic field arrays, async validation for uniqueness checks, and type-safe nested structures',
          ],
        ]}
        caption="Match your tool to the complexity of the problem."
      />

      {/* ------------------------------------------------------------------ */}
      <h2 style={h2Style}>The Full Picture</h2>

      <p style={pStyle}>
        Coming from Svelte, the React form landscape can feel overwhelming. Here's a
        comprehensive comparison to help you map your existing knowledge to the right
        React tools:
      </p>

      <ComparisonTable
        headers={['Feature', 'Svelte', 'React Hook Form', 'TanStack Form', 'Raw React']}
        columnFormat={['prose', 'prose', 'prose', 'prose', 'prose']}
        rows={[
          [
            'Two-way binding',
            'bind:value — built into the language',
            'register() spread — one line per input',
            'field.handleChange — explicit wiring',
            'value + onChange — manual for every input',
          ],
          [
            'Validation',
            'Custom functions (or superforms)',
            'Inline rules or Zod/Yup resolver',
            'Built-in sync + async validators, Zod support',
            'Manual validate function, custom error state',
          ],
          [
            'Dynamic fields',
            '$state array + {#each} with keyed blocks',
            'useFieldArray — optimized add/remove/reorder',
            'Field arrays with type-safe push/remove',
            'Array state + manual key management',
          ],
          [
            'Multi-step forms',
            '$state for step + conditional rendering',
            'trigger() to validate per step, single form instance',
            'form.validateField() per step with subscriptions',
            'Multiple useState + step state + per-step validation',
          ],
          [
            'TypeScript support',
            'Good — typed via lang="ts" in script blocks',
            'Good — generic useForm<T>, inferred errors',
            'Excellent — fully type-safe field names and values',
            'Manual — you type everything yourself',
          ],
          [
            'Bundle size',
            '0 KB (built into compiler)',
            '~12 KB minified + gzipped',
            '~15 KB minified + gzipped',
            '0 KB (just React)',
          ],
          [
            'Learning curve',
            'Minimal — bind:value is intuitive',
            'Low — small API surface, great docs',
            'Medium — render-prop pattern, more concepts',
            'Low initially, scales poorly with complexity',
          ],
        ]}
        caption="How Svelte's built-in form handling compares to React's library ecosystem."
      />

      <Callout type="insight" title="The Svelte Developer's Shortcut">
        If you're used to Svelte's built-in form handling and want the closest experience
        in React, start with React Hook Form + Zod. The <code>register</code> pattern
        is the closest thing React has to <code>bind:value</code>, and Zod schemas give
        you the same kind of declarative validation that Svelte developers build with
        custom functions — but with automatic TypeScript type inference on top.
      </Callout>

      <p style={pStyle}>
        Remember: Svelte made the design decision to bake forms into the language. React
        made the design decision to keep the core small and let the ecosystem solve it.
        Neither approach is wrong — they're different trade-offs. The React ecosystem
        has converged on excellent solutions, and once you pick one, the day-to-day
        experience is very similar to what you already know.
      </p>
    </ChapterLayout>
  );
}
