import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ChapterLayout } from '../components/ChapterLayout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function Styling() {
  return (
    <ChapterLayout id="styling">
      <p style={pStyle}>
        Svelte developers are spoiled. You write a <code>&lt;style&gt;</code> block at the bottom
        of your component, and the compiler scopes it automatically. No configuration, no naming
        conventions, no build tool plugins. It just works. React has no built-in styling solution.
        This is by design -- React is a UI library, not a framework, and it leaves styling
        decisions to you. The result is a rich but sometimes overwhelming ecosystem of options.
        This chapter maps Svelte's styling patterns to their closest React equivalents and walks
        through the trade-offs of each approach.
      </p>

      {/* ===== Scoped Styles vs CSS Modules ===== */}
      <h2 style={h2Style}>Scoped Styles vs CSS Modules</h2>
      <p style={pStyle}>
        Svelte's <code>&lt;style&gt;</code> block scopes CSS to the current component by adding
        a unique hash to each selector at compile time. The closest equivalent in React is
        CSS Modules, which achieve the same result through a different mechanism: the build tool
        (Vite, webpack) transforms class names in <code>.module.css</code> files into unique
        hashes, and you import them as a JavaScript object.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: styles are scoped automatically -->
<script>
  let { name } = $props();
</script>

<div class="card">
  <h2 class="title">{name}</h2>
  <p class="description">
    <slot />
  </p>
</div>

<style>
  .card {
    padding: 1.5rem;
    border: 1px solid #333;
    border-radius: 8px;
  }
  .title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  .description {
    color: #888;
    line-height: 1.6;
  }
</style>`,
          filename: 'Card.svelte',
          highlight: [13, 14, 15],
        }}
        react={{
          code: `// React: CSS Modules for scoped styles
import styles from './Card.module.css';

function Card({ name, children }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{name}</h2>
      <p className={styles.description}>
        {children}
      </p>
    </div>
  );
}

// Card.module.css
// .card { padding: 1.5rem; border: 1px solid #333; }
// .title { font-size: 1.2rem; margin-bottom: 0.5rem; }
// .description { color: #888; line-height: 1.6; }`,
          filename: 'Card.tsx',
          highlight: [2, 6, 7, 8],
        }}
        note="Svelte scoping is automatic. CSS Modules require a .module.css file and importing class names as an object. The result is the same: styles that do not leak across components."
      />

      {/* ===== CSS Modules Deep Dive ===== */}
      <h2 style={h2Style}>CSS Modules</h2>
      <p style={pStyle}>
        CSS Modules are the most popular scoping solution in React projects using Vite or
        Next.js. The convention is simple: any CSS file named <code>*.module.css</code> is
        treated as a module. The build tool rewrites class names to be globally unique (e.g.,
        <code>.card</code> becomes <code>.Card_card_1a2b3</code>), and the import gives you
        an object mapping your original names to the generated ones.
      </p>

      <h3 style={h3Style}>File Structure</h3>
      <p style={pStyle}>
        A typical component with CSS Modules has two files side by side:
      </p>

      <CodeBlock
        code={`// File: src/components/Button.module.css
.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.button:hover {
  opacity: 0.9;
}

.primary {
  background: #3b82f6;
  color: white;
}

.secondary {
  background: transparent;
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

.large {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}`}
        language="css"
        filename="Button.module.css"
      />

      <CodeBlock
        code={`// File: src/components/Button.tsx
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({
  variant = 'primary',
  size = 'default',
  children,
  onClick,
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size === 'large' ? styles.large : '',
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}`}
        language="tsx"
        filename="Button.tsx"
        highlight={[2, 17, 18, 19, 20]}
      />

      <h3 style={h3Style}>TypeScript Support</h3>
      <p style={pStyle}>
        By default, TypeScript does not know about <code>.module.css</code> imports. You need a
        type declaration file. Most Vite projects include this in <code>vite-env.d.ts</code>
        or a dedicated <code>css.d.ts</code> file:
      </p>

      <CodeBlock
        code={`// src/vite-env.d.ts or src/css.d.ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}`}
        language="typescript"
        filename="vite-env.d.ts"
      />

      {/* ===== Inline Styles ===== */}
      <h2 style={h2Style}>Inline Styles</h2>
      <p style={pStyle}>
        Both Svelte and React support inline styles, but with different syntax. Svelte uses the
        standard HTML <code>style</code> attribute (a string) plus the convenient
        <code> style:</code> directive for individual properties. React requires the
        <code> style</code> prop to be a JavaScript object with camelCase property names.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: style attribute (string) -->
<div style="color: red; font-size: 1.2rem;">
  Hello
</div>

<!-- Svelte: style: directive (dynamic) -->
<script>
  let { color, size } = $props();
</script>

<div
  style:color={color}
  style:font-size="{size}px"
  style:opacity={color ? 1 : 0.5}
>
  Dynamic styles
</div>`,
          filename: 'InlineStyles.svelte',
          highlight: [12, 13, 14],
        }}
        react={{
          code: `// React: style prop is a JS object
// Properties are camelCase, values are strings/numbers

function InlineStyles({ color, size }) {
  return (
    <>
      {/* Static styles */}
      <div style={{ color: 'red', fontSize: '1.2rem' }}>
        Hello
      </div>

      {/* Dynamic styles */}
      <div
        style={{
          color: color,
          fontSize: \`\${size}px\`,
          opacity: color ? 1 : 0.5,
        }}
      >
        Dynamic styles
      </div>
    </>
  );
}`,
          filename: 'InlineStyles.tsx',
          highlight: [8, 14, 15, 16, 17],
        }}
        note="Svelte's style: directive lets you set individual CSS properties reactively. React requires a full style object. Note camelCase: font-size becomes fontSize, background-color becomes backgroundColor."
      />

      <h3 style={h3Style}>Gotchas with React Inline Styles</h3>
      <p style={pStyle}>
        React inline styles have a few sharp edges. Numeric values are automatically given
        <code>px</code> units for most properties (e.g., <code>width: 100</code> becomes
        <code>width: 100px</code>), but not all -- <code>lineHeight</code>, <code>opacity</code>,
        <code>zIndex</code>, and <code>flex</code> are unitless. Vendor prefixes use camelCase
        (<code>WebkitTransform</code>, <code>msFilter</code>). And critically, inline styles
        cannot express pseudo-selectors (<code>:hover</code>, <code>:focus</code>), media
        queries, or keyframe animations.
      </p>

      {/* ===== CSS-in-JS ===== */}
      <h2 style={h2Style}>CSS-in-JS</h2>
      <p style={pStyle}>
        CSS-in-JS libraries like styled-components and Emotion let you write actual CSS syntax
        inside JavaScript using tagged template literals. They generate unique class names at
        runtime (or build time with newer solutions) and inject the styles into the document.
        This approach was very popular in React from 2017-2022 but has fallen out of favor for
        performance reasons -- runtime CSS injection is slower than static CSS, especially in
        server-rendered applications.
      </p>

      <CodeBlock
        code={`// styled-components example
import styled from 'styled-components';

const Card = styled.div\`
  padding: 1.5rem;
  border: 1px solid #333;
  border-radius: 8px;

  &:hover {
    border-color: #3b82f6;
  }
\`;

const Title = styled.h2\`
  font-size: 1.2rem;
  color: \${props => props.$highlight ? '#3b82f6' : 'inherit'};
  margin-bottom: 0.5rem;
\`;

// Usage — styled components ARE React components
function ProfileCard({ user }) {
  return (
    <Card>
      <Title $highlight={user.isPremium}>
        {user.name}
      </Title>
      <p>{user.bio}</p>
    </Card>
  );
}`}
        language="tsx"
        filename="StyledExample.tsx"
        highlight={[4, 14, 16]}
      />

      <p style={pStyle}>
        While CSS-in-JS gives you the full power of CSS (including pseudo-selectors, media
        queries, and keyframes) with the scoping benefits of components, the trend in 2024-2025
        has shifted toward zero-runtime solutions like CSS Modules, Tailwind CSS, and newer
        compile-time CSS-in-JS libraries like Panda CSS and vanilla-extract.
      </p>

      {/* ===== Tailwind CSS ===== */}
      <h2 style={h2Style}>Tailwind CSS</h2>
      <p style={pStyle}>
        Tailwind CSS works identically in Svelte and React -- it is framework-agnostic. You
        apply utility classes directly in your markup. The only syntax difference is that Svelte
        uses <code>class</code> while React uses <code>className</code>. If you already know
        Tailwind from Svelte, the transition is seamless.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte with Tailwind -->
<script>
  let { title, description } = $props();
</script>

<div class="p-6 border border-gray-700
  rounded-lg hover:border-blue-500
  transition-colors">
  <h2 class="text-lg font-semibold mb-2">
    {title}
  </h2>
  <p class="text-gray-400 leading-relaxed">
    {description}
  </p>
</div>`,
          filename: 'TailwindCard.svelte',
          highlight: [6, 7, 8],
        }}
        react={{
          code: `// React with Tailwind — nearly identical
function TailwindCard({ title, description }) {
  return (
    <div className="p-6 border border-gray-700
      rounded-lg hover:border-blue-500
      transition-colors">
      <h2 className="text-lg font-semibold mb-2">
        {title}
      </h2>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}`,
          filename: 'TailwindCard.tsx',
          highlight: [4, 5, 6],
        }}
        note="class becomes className. That is literally the only change when porting Tailwind styles from Svelte to React. Tailwind's build process works the same way in both ecosystems."
      />

      {/* ===== Conditional Classes ===== */}
      <h2 style={h2Style}>Conditional Classes</h2>
      <p style={pStyle}>
        Svelte provides the <code>class:</code> directive for toggling individual classes based
        on a boolean expression. React has no built-in equivalent -- you construct class strings
        manually or use a utility library like <code>clsx</code> (or its predecessor
        <code> classnames</code>). The <code>clsx</code> library is tiny (less than 1 KB) and
        is used in virtually every React project that deals with conditional classes.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: class: directive -->
<script>
  let { active, disabled, size = 'md' } = $props();
</script>

<button
  class="btn btn-{size}"
  class:active
  class:disabled
  class:shake={active && !disabled}
>
  <slot />
</button>

<!-- Compiles to something like:
  class="btn btn-md active shake" -->`,
          filename: 'Button.svelte',
          highlight: [7, 8, 9, 10],
        }}
        react={{
          code: `import clsx from 'clsx';

function Button({ active, disabled, size = 'md', children }) {
  return (
    <button
      className={clsx(
        'btn',
        \`btn-\${size}\`,
        {
          active: active,
          disabled: disabled,
          shake: active && !disabled,
        }
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// clsx produces: "btn btn-md active shake"`,
          filename: 'Button.tsx',
          highlight: [1, 6, 7, 8, 9, 10, 11, 12, 13],
        }}
        note="Svelte's class: directive is elegant but limited to one class at a time. clsx handles arbitrarily complex class logic in a single call: strings, objects, arrays, and nested combinations."
      />

      <h3 style={h3Style}>clsx in Detail</h3>
      <p style={pStyle}>
        The <code>clsx</code> library accepts strings, objects, arrays, and falsy values. It
        filters out anything falsy and joins the rest with spaces. Here are the common usage
        patterns:
      </p>

      <CodeBlock
        code={`import clsx from 'clsx';

// Strings — concatenated
clsx('foo', 'bar');
// => 'foo bar'

// Objects — keys included when values are truthy
clsx({ active: true, disabled: false, 'text-lg': true });
// => 'active text-lg'

// Mixed — strings, objects, arrays
clsx('base', isActive && 'active', {
  'font-bold': isPrimary,
  'opacity-50': isDisabled,
});
// => 'base active font-bold' (when isActive and isPrimary)

// Arrays — flattened
clsx(['btn', isLarge && 'btn-lg', ['nested', 'works']]);
// => 'btn btn-lg nested works'

// With CSS Modules
import styles from './Button.module.css';
clsx(styles.button, styles[variant], {
  [styles.large]: size === 'large',
  [styles.disabled]: disabled,
});`}
        language="tsx"
        filename="clsx-examples.tsx"
        highlight={[8, 12, 13, 14, 24, 25, 26]}
      />

      <Callout type="info" title="CSS Modules + clsx = Svelte's Scoped Styles">
        Svelte's scoped styles are a luxury. In React, you have to choose a strategy. CSS
        Modules give the closest experience to Svelte's scoping. Combine them with
        <code> clsx</code> for conditional classes and you get a workflow that feels nearly
        identical to Svelte -- scoped styles with clean conditional logic. The main difference
        is that you have two files instead of one and you import class names as a JavaScript
        object instead of writing them directly in the template.
      </Callout>

      {/* ===== Global Styles ===== */}
      <h2 style={h2Style}>Global Styles</h2>
      <p style={pStyle}>
        In Svelte, you escape scoping with the <code>:global()</code> modifier. In React, global
        styles are simply regular CSS files imported without the <code>.module</code> suffix.
        Import them in your entry point or any component, and they apply globally. This is also
        how you import third-party CSS (e.g., a component library's stylesheet).
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: global styles -->
<style>
  /* Scoped to this component */
  .wrapper { padding: 1rem; }

  /* Escape scoping with :global() */
  :global(body) {
    margin: 0;
    font-family: system-ui;
  }

  .wrapper :global(.third-party-class) {
    color: red;
  }
</style>`,
          filename: 'App.svelte',
          highlight: [7, 12],
        }}
        react={{
          code: `// React: global CSS is just a regular import
import './globals.css';
// => applies globally, no scoping

// globals.css:
// body { margin: 0; font-family: system-ui; }
// .third-party-class { color: red; }

// Typically imported once in your entry point
// (main.tsx or App.tsx)

// For component-scoped styles, use .module.css
import styles from './App.module.css';
// => scoped to this component`,
          filename: 'App.tsx',
          highlight: [2, 13],
        }}
        note="In Svelte, scoping is the default and global is the escape hatch. In React, global is the default and CSS Modules are the opt-in scoping mechanism."
      />

      {/* ===== Comparison Table ===== */}
      <h2 style={h2Style}>Styling Approaches Compared</h2>

      <ComparisonTable
        caption="React Styling Strategies — Trade-offs"
        headers={['Approach', 'Scoping', 'Pros', 'Cons']}
        columnFormat={['prose', 'prose', 'prose', 'prose']}
        rows={[
          [
            'CSS Modules',
            'File-level (build time)',
            'Zero runtime, familiar CSS, TypeScript support',
            'Extra file per component, no dynamic styles in CSS',
          ],
          [
            'Inline styles',
            'Element-level',
            'No extra files, fully dynamic',
            'No pseudo-selectors, no media queries, verbose',
          ],
          [
            'Tailwind CSS',
            'Utility classes (global but atomic)',
            'Fast prototyping, consistent design, tree-shaken',
            'Long class strings, learning curve, HTML-heavy',
          ],
          [
            'styled-components / Emotion',
            'Component-level (runtime)',
            'Full CSS, dynamic props, co-located',
            'Runtime cost, bundle size, SSR complexity',
          ],
          [
            'vanilla-extract / Panda CSS',
            'File-level (build time)',
            'Type-safe, zero runtime, CSS variables',
            'Build setup required, newer ecosystem',
          ],
          [
            'Global CSS',
            'None',
            'Simple, no tooling needed',
            'Naming collisions, hard to maintain at scale',
          ],
        ]}
      />

      {/* ===== CSS Custom Properties ===== */}
      <h2 style={h2Style}>CSS Custom Properties (Variables)</h2>
      <p style={pStyle}>
        Both frameworks support CSS custom properties, but Svelte has the <code>style:</code>
        directive that makes setting them from JavaScript particularly clean. In React, you set
        them through the <code>style</code> prop object. Note that TypeScript requires a small
        workaround since CSS custom properties are not part of <code>CSSProperties</code> by
        default.
      </p>

      <CodeComparison
        svelte={{
          code: `<!-- Svelte: CSS variables via style: directive -->
<script>
  let { hue = 200, radius = 8 } = $props();
</script>

<div
  style:--card-hue={hue}
  style:--card-radius="{radius}px"
  class="themed-card"
>
  <slot />
</div>

<style>
  .themed-card {
    background: hsl(var(--card-hue), 50%, 15%);
    border-radius: var(--card-radius);
    padding: 1.5rem;
  }
</style>`,
          filename: 'ThemedCard.svelte',
          highlight: [7, 8],
        }}
        react={{
          code: `import styles from './ThemedCard.module.css';

function ThemedCard({ hue = 200, radius = 8, children }) {
  return (
    <div
      className={styles.themedCard}
      style={{
        '--card-hue': hue,
        '--card-radius': \`\${radius}px\`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// ThemedCard.module.css:
// .themedCard {
//   background: hsl(var(--card-hue), 50%, 15%);
//   border-radius: var(--card-radius);
//   padding: 1.5rem;
// }`,
          filename: 'ThemedCard.tsx',
          highlight: [7, 8, 9, 10],
        }}
        note="The 'as React.CSSProperties' cast is needed because TypeScript does not include custom properties in CSSProperties by default. This is a common pattern in React for CSS variable theming."
      />

      {/* ===== Key Takeaways ===== */}
      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        The biggest adjustment coming from Svelte is accepting that React does not make this
        choice for you. Svelte's scoped styles are the clear, obvious, zero-configuration answer.
        React asks you to evaluate your project's needs and pick a strategy. For most projects,
        the recommendation is straightforward: use CSS Modules for component-scoped styles, a
        global CSS file for resets and design tokens, and <code>clsx</code> for conditional
        class logic. If your team already uses Tailwind, it works identically in React. Avoid
        runtime CSS-in-JS for new projects unless you have a specific reason -- the performance
        cost is real and the ecosystem is moving toward build-time solutions. Whatever you choose,
        be consistent across your codebase. The worst styling situation is having three different
        approaches fighting each other in the same project.
      </p>
    </ChapterLayout>
  );
}
