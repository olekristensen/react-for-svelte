import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

export default function NextjsMiddleware() {
  return (
    <ChapterLayout id="nextjs-middleware">
      <p style={pStyle}>
        Middleware is the code that runs before a request reaches your page or API route. It is
        the place for authentication checks, redirects, header manipulation, logging, and other
        cross-cutting concerns. SvelteKit uses <code>hooks.server.ts</code> with a
        <code> handle</code> function. Next.js uses a <code>middleware.ts</code> file at the
        project root. The concepts are parallel, but the execution environments differ
        significantly — and this difference affects what you can do in each.
      </p>

      <h2 style={h2Style}>
        Middleware: The Request Interceptor
      </h2>

      <p style={pStyle}>
        In SvelteKit, the <code>handle</code> function in <code>src/hooks.server.ts</code>
        intercepts every server request. It receives the event and a <code>resolve</code>
        function. You can modify the request, add data to <code>event.locals</code>, check
        authentication, or return a response early. The pattern is similar to Express middleware
        but with a functional composition style.
      </p>

      <p style={pStyle}>
        In Next.js, <code>middleware.ts</code> sits at the root of your project (or inside
        <code> src/</code>) and runs on every request that matches its configured pattern.
        By default, it runs on all routes. You can limit its scope using the
        <code> config.matcher</code> export.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({
  event,
  resolve,
}) => {
  // 1. Run before the route handler
  const start = performance.now();

  // 2. Read/modify cookies
  const sessionId = event.cookies.get('session');

  // 3. Set data available to all routes
  if (sessionId) {
    const user = await getUser(sessionId);
    event.locals.user = user;
  }

  // 4. Continue to the route handler
  const response = await resolve(event);

  // 5. Run after the route handler
  const duration = performance.now() - start;
  console.log(\`\${event.url.pathname} - \${duration}ms\`);

  // 6. Modify response headers
  response.headers.set('X-Request-Duration',
    \`\${duration}ms\`
  );

  return response;
};

// Sequence multiple hooks:
import { sequence } from '@sveltejs/kit/hooks';
import { handleAuth } from './hooks/auth';
import { handleLogger } from './hooks/logger';

export const handle = sequence(
  handleAuth,
  handleLogger
);`,
          filename: 'src/hooks.server.ts',
        }}
        react={{
          code: `// middleware.ts (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Run before route handlers
  const start = Date.now();

  // 2. Read cookies
  const sessionId = request.cookies.get('session');

  // 3. Modify request headers (for downstream use)
  const requestHeaders = new Headers(request.headers);
  if (sessionId) {
    requestHeaders.set('x-user-session',
      sessionId.value
    );
  }

  // 4. Continue with modified headers
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 5. Set response headers
  const duration = Date.now() - start;
  response.headers.set('X-Request-Duration',
    \`\${duration}ms\`
  );

  return response;
}

// Configure which routes middleware applies to
export const config = {
  matcher: [
    // Match all routes except static files and _next
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};`,
          filename: 'middleware.ts',
          highlight: [2, 3, 5, 34, 35, 36, 37, 38, 39],
        }}
        note="SvelteKit's handle runs on the Node.js server with full access to event.locals. Next.js middleware runs at the edge by default with a limited Web API runtime. SvelteKit uses sequence() to compose multiple hooks; Next.js has a single middleware function."
      />

      <Callout type="gotcha" title="Edge vs Node.js Runtime">
        Next.js middleware runs at the edge by default. SvelteKit hooks run on your Node.js server.
        This affects what APIs are available. Edge middleware cannot use Node.js APIs like
        <code> fs</code>, <code>crypto</code> (full API), or most npm packages that depend on Node.
        You can only use Web standard APIs (fetch, Request, Response, Headers, crypto.subtle).
        SvelteKit hooks have full Node.js access because they run in your server process.
        This is a critical difference when choosing what logic to put in middleware.
      </Callout>

      <h2 style={h2Style}>
        Auth Middleware
      </h2>

      <p style={pStyle}>
        The most common middleware pattern is authentication — checking if a user is logged in
        and redirecting them if not. Both frameworks handle this similarly, but the implementation
        details reflect their different runtime environments.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/hooks.server.ts — auth middleware
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/server/auth';

export const handle: Handle = async ({
  event,
  resolve,
}) => {
  // Extract token from cookies
  const token = event.cookies.get('auth_token');

  // Verify the token (full Node.js — can use DB)
  if (token) {
    try {
      const user = await verifyToken(token);
      event.locals.user = user;
    } catch {
      event.cookies.delete('auth_token', { path: '/' });
    }
  }

  // Protect routes
  if (event.url.pathname.startsWith('/dashboard')) {
    if (!event.locals.user) {
      throw redirect(303, '/login');
    }
  }

  if (event.url.pathname.startsWith('/admin')) {
    if (event.locals.user?.role !== 'admin') {
      throw redirect(303, '/unauthorized');
    }
  }

  return resolve(event);
};

// In your routes, access user via locals:
// +page.server.ts
export const load = async ({ locals }) => {
  return { user: locals.user };
};`,
          filename: 'SvelteKit auth middleware',
        }}
        react={{
          code: `// middleware.ts — auth middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth-edge';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  // Protected route patterns
  const protectedPaths = ['/dashboard', '/admin'];
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // No token — redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'redirect',
      request.nextUrl.pathname
    );
    return NextResponse.redirect(loginUrl);
  }

  // Verify token (edge-compatible only!)
  try {
    const user = await verifyToken(token.value);

    // Pass user data via headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', user.role);

    // Check admin access
    if (
      request.nextUrl.pathname.startsWith('/admin') &&
      user.role !== 'admin'
    ) {
      return NextResponse.redirect(
        new URL('/unauthorized', request.url)
      );
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    // Invalid token — clear and redirect
    const response = NextResponse.redirect(
      new URL('/login', request.url)
    );
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};`,
          filename: 'Next.js auth middleware',
          highlight: [4, 6, 33, 34, 35, 59, 60],
        }}
        note="SvelteKit sets event.locals.user which is available in all load functions. Next.js passes user data via request headers because middleware cannot directly modify the request context. SvelteKit can use any Node.js auth library; Next.js middleware needs edge-compatible verification."
      />

      <h2 style={h2Style}>
        API Routes
      </h2>

      <p style={pStyle}>
        Both frameworks support defining API endpoints alongside your pages. These are useful
        for webhooks, third-party integrations, or any endpoint that needs to return JSON instead
        of HTML. The APIs are remarkably similar — both export named functions for HTTP methods.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/routes/api/posts/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';

export const GET: RequestHandler = async ({
  url,
  locals,
}) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const page = Number(url.searchParams.get('page') ?? '1');
  const limit = 10;

  const posts = await db.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await db.post.count();

  return json({
    posts,
    page,
    totalPages: Math.ceil(total / limit),
  });
};

export const POST: RequestHandler = async ({
  request,
  locals,
}) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const body = await request.json();
  const post = await db.post.create({
    data: {
      ...body,
      authorId: locals.user.id,
    },
  });

  return json(post, { status: 201 });
};

export const DELETE: RequestHandler = async ({
  url,
  locals,
}) => {
  const id = url.searchParams.get('id');
  if (!id) throw error(400, 'Missing id');

  await db.post.delete({ where: { id } });
  return new Response(null, { status: 204 });
};`,
          filename: 'src/routes/api/posts/+server.ts',
          language: 'typescript',
        }}
        react={{
          code: `// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { getUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const page = Number(
    request.nextUrl.searchParams.get('page') ?? '1'
  );
  const limit = 10;

  const posts = await db.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await db.post.count();

  return NextResponse.json({
    posts,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const post = await db.post.create({
    data: {
      ...body,
      authorId: user.id,
    },
  });

  return NextResponse.json(post, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { error: 'Missing id' },
      { status: 400 }
    );
  }

  await db.post.delete({ where: { id } });
  return new Response(null, { status: 204 });
}`,
          filename: 'app/api/posts/route.ts',
          language: 'typescript',
          highlight: [2, 6, 35, 54],
        }}
        note="Nearly identical APIs. SvelteKit uses json() and error() helpers from @sveltejs/kit, passes locals for auth. Next.js uses NextResponse.json() and calls a getUser() helper. Both export named functions matching HTTP methods."
      />

      <h3 style={h3Style}>
        Dynamic API Routes
      </h3>

      <p style={pStyle}>
        Both frameworks support dynamic parameters in API routes. The parameter is accessed
        through the route params in SvelteKit and as a second argument to the handler in Next.js.
      </p>

      <CodeComparison
        svelte={{
          code: `// src/routes/api/posts/[id]/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({
  params,
}) => {
  const post = await db.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    throw error(404, 'Post not found');
  }

  return json(post);
};

export const PATCH: RequestHandler = async ({
  params,
  request,
}) => {
  const body = await request.json();
  const post = await db.post.update({
    where: { id: params.id },
    data: body,
  });
  return json(post);
};`,
          filename: 'src/routes/api/posts/[id]/+server.ts',
          language: 'typescript',
        }}
        react={{
          code: `// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await db.post.findUnique({
    where: { id },
  });

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const post = await db.post.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(post);
}`,
          filename: 'app/api/posts/[id]/route.ts',
          language: 'typescript',
          highlight: [4, 5, 6, 7, 8, 23, 24, 25, 26, 27],
        }}
        note="SvelteKit passes params as a property of the event object. Next.js passes params as a second argument to the handler function. The params are typed differently — Next.js wraps them in a Promise in the App Router."
      />

      <h2 style={h2Style}>
        Additional Hook Types
      </h2>

      <p style={pStyle}>
        SvelteKit provides several hook types beyond the <code>handle</code> function. These
        cover error handling, fetching modifications, and client-side hooks. Next.js handles
        some of these differently, using error boundaries and configuration instead of hooks.
      </p>

      <CodeBlock
        code={`// SvelteKit additional hooks

// src/hooks.server.ts
export const handleError = async ({ error, event }) => {
  // Log server errors, report to error tracking
  console.error('Server error:', error);
  await reportToSentry(error, {
    url: event.url.pathname,
  });
  return {
    message: 'Something went wrong',
    code: 'INTERNAL_ERROR',
  };
};

export const handleFetch = async ({ event, request, fetch }) => {
  // Modify outgoing fetch requests
  // Useful for adding auth headers to internal API calls
  if (request.url.startsWith('https://api.internal.com')) {
    request = new Request(request.url.replace(
      'https://api.internal.com',
      'http://localhost:3001'
    ), request);
  }
  return fetch(request);
};

// src/hooks.client.ts
export const handleError = async ({ error }) => {
  // Log client errors, report to error tracking
  console.error('Client error:', error);
  await reportToSentry(error);
  return {
    message: 'Something went wrong on the client',
  };
};`}
        language="typescript"
        filename="SvelteKit hook types"
      />

      <CodeBlock
        code={`// Next.js equivalents for SvelteKit hooks

// Error handling: use error.tsx files (Error Boundaries)
// app/error.tsx — handles runtime errors
// app/global-error.tsx — handles root layout errors

// Global error reporting (instrumentation):
// instrumentation.ts (project root)
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize server-side error tracking
    initSentry();
  }
}

export function onRequestError(
  error: Error,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string }
) {
  // Report errors from Server Components, Route Handlers,
  // Middleware, and Server Actions
  reportToSentry(error, {
    path: request.path,
    method: request.method,
    routerKind: context.routerKind,
  });
}

// Fetch modification: not supported at middleware level
// Use wrapper functions instead:
async function apiFetch(path: string, init?: RequestInit) {
  return fetch(\`\${process.env.API_URL}\${path}\`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: \`Bearer \${getToken()}\`,
    },
  });
}`}
        language="typescript"
        filename="Next.js equivalents"
      />

      <h2 style={h2Style}>
        Middleware Patterns
      </h2>

      <h3 style={h3Style}>
        Redirects and Rewrites
      </h3>

      <p style={pStyle}>
        Both frameworks support redirects and rewrites in middleware. Redirects change the URL
        in the browser. Rewrites serve content from a different path without changing the visible
        URL — useful for proxying or A/B testing.
      </p>

      <CodeComparison
        svelte={{
          code: `// SvelteKit redirects and rewrites
// src/hooks.server.ts
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
  // Redirect
  if (event.url.pathname === '/old-page') {
    throw redirect(301, '/new-page');
  }

  // Rewrite (resolve a different route)
  if (event.url.pathname === '/docs') {
    // Internally serve /documentation
    const newUrl = new URL(event.url);
    newUrl.pathname = '/documentation';
    return resolve(event);
  }

  // Locale-based routing
  const locale = event.cookies.get('locale') ?? 'en';
  if (!event.url.pathname.startsWith(\`/\${locale}\`)) {
    throw redirect(302, \`/\${locale}\${event.url.pathname}\`);
  }

  return resolve(event);
};`,
          filename: 'SvelteKit redirects',
          language: 'typescript',
        }}
        react={{
          code: `// Next.js redirects and rewrites
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect
  if (request.nextUrl.pathname === '/old-page') {
    return NextResponse.redirect(
      new URL('/new-page', request.url),
      301
    );
  }

  // Rewrite (serve different content, same URL)
  if (request.nextUrl.pathname === '/docs') {
    return NextResponse.rewrite(
      new URL('/documentation', request.url)
    );
  }

  // Locale-based routing
  const locale = request.cookies.get('locale')?.value
    ?? 'en';
  if (!request.nextUrl.pathname.startsWith(\`/\${locale}\`)) {
    return NextResponse.redirect(
      new URL(
        \`/\${locale}\${request.nextUrl.pathname}\`,
        request.url
      ),
      302
    );
  }

  return NextResponse.next();
}`,
          filename: 'Next.js redirects and rewrites',
          highlight: [9, 10, 11, 12, 17, 18, 19],
        }}
        note="Both frameworks support redirects and rewrites in middleware. Next.js also supports defining redirects in next.config.js for simple cases. SvelteKit can additionally use its handle hook for more complex rewrite logic."
      />

      <h3 style={h3Style}>
        Rate Limiting and Security Headers
      </h3>

      <CodeBlock
        code={`// Next.js middleware: security headers + rate limiting
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter (edge-compatible)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

export function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const now = Date.now();
    const windowData = rateLimit.get(ip);

    if (windowData && now - windowData.timestamp < WINDOW_MS) {
      if (windowData.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }
      windowData.count++;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }
  }

  // Security headers for all responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}`}
        language="typescript"
        filename="Security middleware pattern"
      />

      <h2 style={h2Style}>
        When to Use Middleware vs Route Handlers vs Server Actions
      </h2>

      <p style={pStyle}>
        With multiple places to put server-side logic, it can be confusing to know which one to
        use. Here is a decision framework that applies to both SvelteKit and Next.js.
      </p>

      <ul style={{ ...pStyle, paddingLeft: '1.5rem' }}>
        <li><strong>Middleware</strong> (hooks.server.ts / middleware.ts): Authentication checks,
          redirects, header manipulation, logging. Code that needs to run before every request
          or a broad set of routes. Keep it fast — it adds latency to every matched request.</li>
        <li><strong>API Routes</strong> (+server.ts / route.ts): Webhooks, third-party integrations,
          endpoints consumed by external services, any endpoint that returns JSON/data instead
          of HTML.</li>
        <li><strong>Server Actions / Form Actions</strong>: Mutations triggered by user interaction
          (form submissions, button clicks). Use these when you need to modify data and update
          the UI.</li>
        <li><strong>Server Components / Load Functions</strong>: Reading data for page rendering.
          This is where the bulk of your data fetching should live.</li>
      </ul>

      <h2 style={h2Style}>
        Middleware and API Routes Comparison
      </h2>

      <ComparisonTable
        caption="Middleware and API Routes: SvelteKit vs Next.js"
        headers={['Feature', 'SvelteKit', 'Next.js']}
        columnFormat={['prose', 'code', 'code']}
        rows={[
          ['Middleware file', 'src/hooks.server.ts', 'middleware.ts (project root)'],
          ['Middleware function', 'handle({ event, resolve })', 'middleware(request)'],
          ['Runtime', 'Node.js (your server)', 'Edge by default (Web APIs only)'],
          ['Auth data passing', 'event.locals', 'Request headers'],
          ['Composing middleware', 'sequence() from @sveltejs/kit/hooks', 'Manual (if/else or helper functions)'],
          ['Error hook', 'handleError in hooks.server.ts', 'instrumentation.ts onRequestError'],
          ['Fetch hook', 'handleFetch in hooks.server.ts', 'No equivalent (use wrapper functions)'],
          ['Client hooks', 'src/hooks.client.ts', 'No equivalent (use Error Boundaries)'],
          ['Route matching', 'Runs on all server requests', 'config.matcher export'],
          ['API route file', '+server.ts', 'route.ts'],
          ['API method exports', 'GET, POST, PUT, PATCH, DELETE', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS'],
          ['API params access', 'event.params', 'Second argument { params }'],
          ['API response helper', 'json() from @sveltejs/kit', 'NextResponse.json()'],
          ['API error helper', 'error() from @sveltejs/kit', 'NextResponse.json({ error }, { status })'],
          ['Redirect helper', 'redirect(status, url)', 'NextResponse.redirect(url, status)'],
          ['Rewrite support', 'Via resolve event modification', 'NextResponse.rewrite(url)'],
        ]}
      />

      <Callout type="info" title="Edge vs Node.js: Practical Implications">
        The edge runtime limitation in Next.js middleware is important to internalize. You cannot
        use most npm packages, access the filesystem, or run long-lived processes. If your
        middleware logic requires full Node.js (database queries, complex auth with JWT
        verification using Node crypto), consider moving that logic to a Server Component or
        API route instead. Alternatively, use edge-compatible JWT libraries like <code>jose</code>
        that work with Web Crypto. SvelteKit does not have this constraint because hooks run in
        your Node.js process.
      </Callout>

      <p style={pStyle}>
        Middleware and API routes complete the server-side picture for both frameworks. Combined
        with the routing, data fetching, rendering, and form handling covered in the previous
        chapters, you now have a comprehensive understanding of how SvelteKit concepts map to
        Next.js. The frameworks are more alike than they are different — both are modern,
        full-stack meta-frameworks that solve the same problems with slightly different syntax
        and conventions. Your SvelteKit experience translates directly. The biggest adjustments
        are learning React's component model (covered in the earlier chapters of this guide) and
        understanding the Server Component / Client Component boundary that Next.js introduces.
        Everything else is a matter of looking up the equivalent API.
      </p>
    </ChapterLayout>
  );
}
