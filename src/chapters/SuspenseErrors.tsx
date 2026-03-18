import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function SuspenseErrors() {
  return (
    <ChapterLayout id="suspense-errors">
      <p style={pStyle}>
        Handling loading states and errors gracefully is a universal challenge. Svelte offers the
        elegant <code>{'{#await}'}</code> block that handles promise states inline. React takes a
        different, more architectural approach with two primitives: <code>Suspense</code> for loading
        states and <code>ErrorBoundary</code> for error handling. These work at the component tree
        level rather than the template level, which gives them broader reach — but also makes them
        more conceptually demanding.
      </p>

      {/* ─── Suspense ─── */}
      <h2 style={h2Style}>Suspense — Declarative Loading States</h2>
      <p style={pStyle}>
        <code>Suspense</code> lets you declaratively specify a fallback UI while a child component
        is "not ready." The most common use case today is code splitting with <code>React.lazy</code>,
        which loads a component's code on demand. When the lazy component is still loading, Suspense
        catches the loading state and shows the fallback. When it finishes, the real component
        appears automatically.
      </p>
      <p style={pStyle}>
        This is fundamentally different from the imperative pattern of tracking a <code>loading</code>
        boolean in state. Suspense moves loading handling out of individual components and into
        the component tree structure itself. A single Suspense boundary can handle loading states
        for an entire subtree of components.
      </p>

      <h3 style={h3Style}>Code Splitting with React.lazy</h3>
      <CodeBlock
        code={`import { Suspense, lazy } from 'react';

// React.lazy wraps a dynamic import
// The component is only fetched when first rendered
const HeavyChart = lazy(() => import('./HeavyChart'));
const AdminPanel = lazy(() => import('./AdminPanel'));
const UserSettings = lazy(() => import('./UserSettings'));

function App() {
  return (
    <div>
      <nav>
        <h1>My Application</h1>
      </nav>

      {/* Suspense catches the loading state of lazy children */}
      <Suspense fallback={<LoadingSpinner />}>
        <main>
          {/* Only the route that renders will trigger its import */}
          <Routes>
            <Route path="/charts" element={<HeavyChart />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/settings" element={<UserSettings />} />
          </Routes>
        </main>
      </Suspense>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '3rem',
    }}>
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
}`}
        language="tsx"
        filename="App.tsx"
        highlight={[5, 6, 7, 17]}
      />

      <h3 style={h3Style}>Nested Suspense Boundaries</h3>
      <p style={pStyle}>
        You can nest Suspense boundaries to create granular loading states. The outermost Suspense
        catches any loading state not handled by a closer boundary. This lets you show a page-level
        skeleton while independently loading sidebar content, charts, and other sections.
      </p>
      <CodeBlock
        code={`function Dashboard() {
  return (
    <div className="dashboard">
      {/* Page-level fallback */}
      <Suspense fallback={<PageSkeleton />}>
        <Header />

        <div className="content">
          {/* Sidebar loads independently */}
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar />
          </Suspense>

          {/* Main content loads independently */}
          <Suspense fallback={<ContentSkeleton />}>
            <MainContent />

            {/* Chart has its own loading state */}
            <Suspense fallback={<ChartPlaceholder />}>
              <HeavyChart />
            </Suspense>
          </Suspense>
        </div>
      </Suspense>
    </div>
  );
}`}
        language="tsx"
        filename="NestedSuspense.tsx"
        highlight={[5, 10, 15, 19]}
      />

      {/* ─── Error Boundaries ─── */}
      <h2 style={h2Style}>Error Boundaries</h2>
      <p style={pStyle}>
        Error Boundaries are React's mechanism for catching JavaScript errors in a component tree,
        logging them, and displaying a fallback UI instead of crashing the entire application. They
        are the <code>try/catch</code> of the component world. Without an error boundary, a single
        thrown error in any component brings down the whole React application with a blank screen.
      </p>
      <p style={pStyle}>
        Here is the crucial detail that surprises many developers: Error Boundaries must be class
        components. There is no hook equivalent for <code>componentDidCatch</code> or
        <code> getDerivedStateFromError</code>. This is one of the very few remaining use cases for
        class components in modern React. The React team has not yet added a hook-based API for
        error boundaries, so the community has converged on writing a single reusable ErrorBoundary
        class or using a library like <code>react-error-boundary</code>.
      </p>

      <h3 style={h3Style}>ErrorBoundary Implementation</h3>
      <CodeBlock
        code={`import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Called during rendering to update state when an error occurs
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  // Called after the error has been rendered — use for logging
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#ef4444',
        }}>
          <h2>Something went wrong</h2>
          <pre style={{ fontSize: '0.85rem', color: '#888' }}>
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => this.setState({
              hasError: false, error: null,
            })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;`}
        language="tsx"
        filename="ErrorBoundary.tsx"
        highlight={[14, 24, 30, 36]}
      />

      <p style={pStyle}>
        The class has two key lifecycle methods. <code>getDerivedStateFromError</code> is a static
        method called during the render phase — it receives the error and returns new state. This
        is where you flip a flag to show the fallback UI. <code>componentDidCatch</code> is called
        after the error UI is committed to the DOM — this is where you log to an error reporting
        service like Sentry. Note that Error Boundaries do not catch errors in event handlers,
        async code, or server-side rendering — only errors thrown during rendering.
      </p>

      {/* ─── Svelte vs React ─── */}
      <h2 style={h2Style}>Svelte's {'{#await}'} vs React's Suspense</h2>
      <p style={pStyle}>
        Svelte handles async data with the <code>{'{#await}'}</code> template block — you pass it
        a promise and it provides blocks for pending, fulfilled, and rejected states all in one
        place. React's Suspense is architecturally different: it works at the component boundary
        level and relies on the child component to "suspend" (either via <code>React.lazy</code>,
        or a Suspense-compatible data fetching library).
      </p>
      <CodeComparison
        svelte={{
          code: `<script>
  let promise = fetch('/api/user')
    .then(r => r.json());
</script>

<!-- All three states handled in one block -->
{#await promise}
  <p>Loading user data...</p>
{:then user}
  <div class="profile">
    <h2>{user.name}</h2>
    <p>{user.email}</p>
    <img src={user.avatar} alt={user.name} />
  </div>
{:catch error}
  <div class="error">
    <p>Failed to load user: {error.message}</p>
    <button on:click={() => {
      promise = fetch('/api/user')
        .then(r => r.json());
    }}>
      Retry
    </button>
  </div>
{/await}`,
          filename: 'UserProfile.svelte',
        }}
        react={{
          code: `import { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

// With a Suspense-compatible library
// (TanStack Query, SWR, or use() in React 19)

function UserProfile() {
  return (
    <ErrorBoundary
      fallback={
        <div className="error">
          <p>Failed to load user</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      }
    >
      <Suspense fallback={<p>Loading user data...</p>}>
        <UserContent />
      </Suspense>
    </ErrorBoundary>
  );
}

// This component suspends while data loads
function UserContent() {
  // useSuspenseQuery from TanStack Query, or
  // the use() hook in React 19
  const user = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: () =>
      fetch('/api/user').then(r => r.json()),
  });

  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <img src={user.avatar} alt={user.name} />
    </div>
  );
}`,
          filename: 'UserProfile.tsx',
        }}
        note="Svelte's {#await} is more concise for simple cases. React's Suspense + ErrorBoundary pattern is more structural — the boundaries exist in the component tree and can wrap many children. React 19's use() hook brings Suspense closer to Svelte's elegance."
      />

      <Callout type="info" title="Suspense Goes Beyond Promises">
        Svelte's <code>{'{#await}'}</code> block is elegant but limited to promises. React's
        Suspense is a deeper primitive that handles code splitting, data fetching (with compatible
        libraries like TanStack Query), and streaming SSR. A single Suspense boundary can catch
        loading states from multiple sources — lazy-loaded components, suspended data fetches,
        and server-streamed content — all with one fallback UI.
      </Callout>

      {/* ─── Combined Pattern ─── */}
      <h2 style={h2Style}>The Combined Pattern: ErrorBoundary + Suspense</h2>
      <p style={pStyle}>
        In production React applications, you almost always pair ErrorBoundary with Suspense.
        The ErrorBoundary catches rendering errors, and Suspense handles loading states. Together
        they provide a complete safety net for async component trees. The order matters:
        ErrorBoundary goes on the outside so it can catch errors thrown by both the Suspense
        fallback and the suspended children.
      </p>
      <CodeBlock
        code={`import { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

const Dashboard = lazy(() => import('./Dashboard'));
const Analytics = lazy(() => import('./Analytics'));
const Reports = lazy(() => import('./Reports'));

function App() {
  return (
    <div className="app">
      <Header />

      {/* Top-level error boundary catches everything */}
      <ErrorBoundary
        fallback={<FullPageError />}
        onError={(err) => reportToSentry(err)}
      >
        {/* Top-level suspense for initial page load */}
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                // Route-level boundaries for isolation
                <ErrorBoundary fallback={<RouteError />}>
                  <Suspense fallback={<DashboardSkeleton />}>
                    <Dashboard />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/analytics"
              element={
                <ErrorBoundary fallback={<RouteError />}>
                  <Suspense fallback={<AnalyticsSkeleton />}>
                    <Analytics />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/reports"
              element={
                <ErrorBoundary fallback={<RouteError />}>
                  <Suspense fallback={<ReportsSkeleton />}>
                    <Reports />
                  </Suspense>
                </ErrorBoundary>
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}`}
        language="tsx"
        filename="App.tsx"
        highlight={[14, 19, 25, 26, 35, 36, 45, 46]}
      />

      <h3 style={h3Style}>A Reusable AsyncBoundary Component</h3>
      <p style={pStyle}>
        Since the ErrorBoundary + Suspense pairing is so common, many teams create a wrapper
        component that combines both. This reduces boilerplate and makes the pattern easier to
        apply consistently across the application.
      </p>
      <CodeBlock
        code={`import { Suspense, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface AsyncBoundaryProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  onError?: (error: Error) => void;
}

function AsyncBoundary({
  children,
  loadingFallback = <DefaultSpinner />,
  errorFallback = <DefaultError />,
  onError,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary fallback={errorFallback} onError={onError}>
      <Suspense fallback={loadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Usage — clean and declarative
function ProductPage() {
  return (
    <AsyncBoundary
      loadingFallback={<ProductSkeleton />}
      errorFallback={<ProductError />}
    >
      <ProductDetails />
      <ProductReviews />
      <RelatedProducts />
    </AsyncBoundary>
  );
}`}
        language="tsx"
        filename="AsyncBoundary.tsx"
        highlight={[11, 18, 19, 29]}
      />

      <h3 style={h3Style}>Error Handling in Event Handlers</h3>
      <p style={pStyle}>
        A critical limitation to understand: Error Boundaries do not catch errors in event handlers.
        If a button's <code>onClick</code> throws an error, the ErrorBoundary will not catch it.
        Event handler errors must be caught with standard <code>try/catch</code> blocks. Only errors
        that occur during React's rendering phase — in the component body, lifecycle methods,
        or constructors — are caught by Error Boundaries.
      </p>
      <CodeBlock
        code={`function FormWithErrors() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setError(null);
      await submitForm();
    } catch (err) {
      // Event handler errors need try/catch
      // ErrorBoundary won't catch this!
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      {/* form fields... */}
      <button type="submit">Submit</button>
    </form>
  );
}`}
        language="tsx"
        filename="EventHandlerErrors.tsx"
        highlight={[5, 8, 9, 10]}
      />

      {/* ─── Comparison Table ─── */}
      <h2 style={h2Style}>Error and Loading Handling at a Glance</h2>
      <ComparisonTable
        caption="Svelte vs React Error and Loading Patterns"
        headers={['Concept', 'Svelte', 'React']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['Promise loading state', '{#await promise}...{/await}', '<Suspense fallback={...}>'],
          ['Promise error state', '{#await promise}{:catch error}', '<ErrorBoundary fallback={...}>'],
          ['Promise success state', '{:then data}', 'Component renders normally after suspend'],
          ['Code splitting', 'Dynamic import() (auto in SvelteKit)', 'React.lazy() + Suspense'],
          ['Error catching scope', 'Per-promise with {#await}', 'Component subtree with ErrorBoundary'],
          ['Nested loading states', 'Nested {#await} blocks', 'Nested <Suspense> boundaries'],
          ['Error recovery', 'Re-assign the promise variable', 'Reset ErrorBoundary state (key prop trick)'],
          ['SSR streaming', 'SvelteKit streaming load()', 'renderToPipeableStream + Suspense'],
          ['Event handler errors', 'try/catch in handler', 'try/catch in handler (same)'],
          ['Error logging', 'Manual in {:catch}', 'componentDidCatch lifecycle method'],
          ['Class component required?', 'No', 'Yes, for ErrorBoundary only'],
          ['Library alternative', 'Not commonly needed', 'react-error-boundary package'],
        ]}
      />

      <p style={pStyle}>
        The biggest conceptual shift is moving from Svelte's template-level async handling to
        React's tree-level boundaries. In Svelte, you handle each promise exactly where you
        use it. In React, you establish boundaries higher in the tree that catch loading and
        error states from any descendant. This boundary-based approach scales well in large
        applications — a single ErrorBoundary at a route level can catch errors from dozens
        of child components without each one needing its own error handling. But it requires
        thinking about your component tree's error isolation strategy up front, rather than
        handling each async operation in isolation.
      </p>
    </ChapterLayout>
  );
}
