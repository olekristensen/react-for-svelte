import { transform } from 'sucrase';

// ─────────────────────────────────────────────────────────────────
// Exercise test runner
// Compiles user JSX, runs it with mocked React, checks behavior
// ─────────────────────────────────────────────────────────────────

export interface ExerciseTest {
  name: string;
  test: (ctx: TestContext) => void;
}

export interface TestResult {
  passed: boolean;
  results: { name: string; passed: boolean; error?: string }[];
}

interface StateSlot {
  value: unknown;
  setter: (v: unknown) => void;
  updates: unknown[];
}

interface TestContext {
  /** Call the component function, returns the element tree */
  render: () => ElementNode;
  /** Find an element by type name and simulate a click */
  click: (selector: string) => void;
  /** Find an element by type and call onSubmit */
  submit: (selector: string) => void;
  /** Get all state updates for the nth useState call */
  stateUpdates: (index?: number) => unknown[];
  /** Get current state value for the nth useState call */
  stateValue: (index?: number) => unknown;
  /** Re-render after state changes */
  rerender: () => ElementNode;
  /** Check if an effect cleanup was registered */
  hasEffectCleanup: boolean;
  /** Run effect cleanups */
  runCleanups: () => void;
  /** Advance time for setTimeout/setInterval */
  advanceTime: (ms: number) => void;
  /** Whether preventDefault was called during the last submit */
  preventDefaultCalled: boolean;
}

interface ElementNode {
  type: string;
  props: Record<string, unknown>;
  children: unknown[];
}

function compileJSX(code: string): string | null {
  try {
    const result = transform(code, {
      transforms: ['jsx', 'typescript'],
      jsxRuntime: 'classic',
      production: true,
    });
    return result.code;
  } catch {
    return null;
  }
}

function createTestContext(code: string): TestContext | null {
  const compiled = compileJSX(code);
  if (!compiled) return null;

  const states: StateSlot[] = [];
  let stateIndex = 0;
  const effectCleanups: (() => void)[] = [];
  let hasCleanup = false;
  const timers: { id: number; fn: () => void; delay: number; interval: boolean; elapsed: number }[] = [];
  let timerIdCounter = 1;
  let lastElement: ElementNode | null = null;

  // Mock React API
  const mockReact = {
    createElement: (type: unknown, props: Record<string, unknown> | null, ...children: unknown[]): ElementNode => ({
      type: typeof type === 'function' ? type.name || 'Anonymous' : String(type),
      props: props || {},
      children: children.flat(),
    }),
  };

  const mockUseState = (initialValue: unknown) => {
    const idx = stateIndex++;
    if (idx >= states.length) {
      const slot: StateSlot = {
        value: typeof initialValue === 'function' ? (initialValue as () => unknown)() : initialValue,
        setter: () => {},
        updates: [],
      };
      slot.setter = (update: unknown) => {
        const newVal = typeof update === 'function'
          ? (update as (prev: unknown) => unknown)(slot.value)
          : update;
        slot.updates.push(newVal);
        slot.value = newVal;
      };
      states.push(slot);
    }
    return [states[idx].value, states[idx].setter];
  };

  const mockUseEffect = (fn: () => (() => void) | void, _deps?: unknown[]) => {
    const cleanup = fn();
    if (typeof cleanup === 'function') {
      hasCleanup = true;
      effectCleanups.push(cleanup);
    }
  };

  const mockUseRef = (initial: unknown) => ({ current: initial });
  const mockUseContext = () => undefined;
  const mockUseMemo = (fn: () => unknown) => fn();
  const mockUseCallback = (fn: unknown) => fn;
  const mockUseReducer = (reducer: (s: unknown, a: unknown) => unknown, initial: unknown) => {
    const [state, setState] = mockUseState(initial);
    const dispatch = (action: unknown) => {
      (setState as (v: unknown) => void)(reducer(state, action));
    };
    return [state, dispatch];
  };
  const mockCreateContext = (defaultValue: unknown) => ({
    Provider: ({ children }: { children: unknown }) => children,
    Consumer: () => null,
    _defaultValue: defaultValue,
  });

  const mockSetTimeout = (fn: () => void, delay: number) => {
    const id = timerIdCounter++;
    timers.push({ id, fn, delay, interval: false, elapsed: 0 });
    return id;
  };
  const mockSetInterval = (fn: () => void, delay: number) => {
    const id = timerIdCounter++;
    timers.push({ id, fn, delay, interval: true, elapsed: 0 });
    return id;
  };
  const mockClearInterval = (id: number) => {
    const idx = timers.findIndex(t => t.id === id);
    if (idx >= 0) timers.splice(idx, 1);
  };
  const mockClearTimeout = mockClearInterval;

  // Build the execution scope
  let ComponentFn: (() => ElementNode) | null = null;

  try {
    // Extract function name from compiled code
    const fnMatch = compiled.match(/function\s+(\w+)\s*\(/);
    const fnName = fnMatch?.[1] || 'Component';

    const wrappedCode = `
      ${compiled}
      return ${fnName};
    `;

    const factory = new Function(
      'React', 'useState', 'useEffect', 'useRef', 'useContext',
      'useMemo', 'useCallback', 'useReducer', 'createContext',
      'setTimeout', 'setInterval', 'clearInterval', 'clearTimeout',
      'console', 'localStorage', 'JSON', 'fetch',
      wrappedCode
    );

    ComponentFn = factory(
      mockReact, mockUseState, mockUseEffect, mockUseRef, mockUseContext,
      mockUseMemo, mockUseCallback, mockUseReducer, mockCreateContext,
      mockSetTimeout, mockSetInterval, mockClearInterval, mockClearTimeout,
      console, localStorage, JSON, fetch,
    ) as () => ElementNode;
  } catch {
    return null;
  }

  if (!ComponentFn) return null;

  function findElement(node: unknown, selector: string): ElementNode | null {
    if (!node || typeof node !== 'object') return null;
    const el = node as ElementNode;
    if (el.type === selector) return el;
    if (el.children) {
      for (const child of el.children) {
        const found = findElement(child, selector);
        if (found) return found;
      }
    }
    return null;
  }

  const render = () => {
    stateIndex = 0;
    lastElement = ComponentFn!();
    return lastElement;
  };

  let _preventDefaultCalled = false;

  return {
    render,
    rerender: render,
    click: (selector: string) => {
      const el = lastElement ? findElement(lastElement, selector) : null;
      if (el?.props?.onClick) {
        (el.props.onClick as (e?: unknown) => void)();
      }
    },
    submit: (selector: string) => {
      _preventDefaultCalled = false;
      const el = lastElement ? findElement(lastElement, selector) : null;
      if (el?.props?.onSubmit) {
        const mockEvent = {
          preventDefault: () => { _preventDefaultCalled = true; },
          target: {},
          currentTarget: {},
        };
        (el.props.onSubmit as (e: unknown) => void)(mockEvent);
      }
    },
    stateUpdates: (index = 0) => states[index]?.updates || [],
    stateValue: (index = 0) => states[index]?.value,
    get preventDefaultCalled() { return _preventDefaultCalled; },
    get hasEffectCleanup() { return hasCleanup; },
    runCleanups: () => { effectCleanups.forEach(fn => fn()); },
    advanceTime: (ms: number) => {
      for (const t of timers) {
        t.elapsed += ms;
        while (t.elapsed >= t.delay) {
          t.fn();
          t.elapsed -= t.delay;
          if (!t.interval) break;
        }
      }
    },
  };
}

/**
 * Run exercise tests against user code.
 * Returns detailed results for each test.
 */
export function runTests(code: string, tests: ExerciseTest[]): TestResult {
  const results: TestResult['results'] = [];

  for (const t of tests) {
    const ctx = createTestContext(code);
    if (!ctx) {
      results.push({ name: t.name, passed: false, error: 'Code could not be compiled' });
      continue;
    }
    try {
      t.test(ctx);
      results.push({ name: t.name, passed: true });
    } catch (e) {
      results.push({
        name: t.name,
        passed: false,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return {
    passed: results.every(r => r.passed),
    results,
  };
}

/**
 * Simple assertion helper for use in tests
 */
export function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, got ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(n: number) {
      if (typeof actual !== 'number' || actual <= n) {
        throw new Error(`Expected value greater than ${n}, got ${JSON.stringify(actual)}`);
      }
    },
    toContain(item: unknown) {
      if (!Array.isArray(actual) || !actual.includes(item)) {
        throw new Error(`Expected array to contain ${JSON.stringify(item)}`);
      }
    },
    toHaveLength(n: number) {
      if (!Array.isArray(actual) || actual.length !== n) {
        throw new Error(`Expected length ${n}, got ${Array.isArray(actual) ? actual.length : 'non-array'}`);
      }
    },
  };
}

// ─────────────────────────────────────────────────────────────────
// Legacy validation (pattern matching + AST comparison)
// Used as fallback when tests aren't defined
// ─────────────────────────────────────────────────────────────────

import * as acorn from 'acorn';
import jsx from 'acorn-jsx';

const JsxParser = acorn.Parser.extend(jsx());
const PARSE_OPTS = { ecmaVersion: 2022 as const, sourceType: 'module' as const, allowReturnOutsideFunction: true };

function tryParse(code: string): acorn.Node | null {
  try { return JsxParser.parse(code, PARSE_OPTS); } catch { /* */ }
  try { return JsxParser.parse(`function __w__(){\n${code}\n}`, PARSE_OPTS); } catch { /* */ }
  return null;
}

const WELL_KNOWN = new Set([
  'React', 'useState', 'useEffect', 'useRef', 'useContext', 'useMemo',
  'useCallback', 'useReducer', 'createContext',
  'console', 'log', 'document', 'window', 'localStorage', 'JSON',
  'parse', 'stringify', 'getItem', 'setItem',
  'preventDefault', 'target', 'value',
  'map', 'filter', 'forEach', 'find', 'includes', 'length',
  'setTimeout', 'setInterval', 'clearInterval', 'clearTimeout',
  'fetch', 'then', 'catch',
  'Array', 'Object', 'String', 'Number', 'Boolean', 'Math',
  'props', 'children', 'onClick', 'onChange', 'onSubmit',
  'href', 'type', 'key', 'ref', 'id', 'name',
  'Link', 'Provider',
]);
const SKIP_KEYS = new Set(['start', 'end', 'loc', 'range', 'raw', 'sourceType']);

function serialize(node: unknown, nameMap: Map<string, string>): unknown {
  if (node === null || node === undefined) return null;
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') return node;
  if (Array.isArray(node)) {
    return node.map(n => serialize(n, nameMap)).filter(n => {
      if (n && typeof n === 'object' && (n as Record<string, unknown>).type === 'JSXText') {
        return (n as Record<string, unknown>).value !== '';
      }
      return true;
    });
  }
  if (typeof node !== 'object') return null;
  const n = node as Record<string, unknown>;
  const type = n.type as string | undefined;
  if (!type) return null;
  const out: Record<string, unknown> = { type };

  if (type === 'Identifier') {
    const name = n.name as string;
    if (WELL_KNOWN.has(name)) { out.name = name; }
    else { if (!nameMap.has(name)) nameMap.set(name, `$${nameMap.size}`); out.name = nameMap.get(name); }
    return out;
  }
  if (type === 'JSXIdentifier') { out.name = n.name; return out; }
  if (type === 'JSXText') { out.value = (n.value as string).replace(/\s+/g, ' ').trim(); return out; }
  if (type === 'UpdateExpression' && (n.operator === '++' || n.operator === '--')) {
    return { type: 'BinaryExpression', operator: n.operator === '++' ? '+' : '-', left: serialize(n.argument, nameMap), right: 1 };
  }

  for (const [k, v] of Object.entries(n)) {
    if (k === 'type' || SKIP_KEYS.has(k)) continue;
    out[k] = serialize(v, nameMap);
  }
  return out;
}

function structuralMatch(userCode: string, solution: string): boolean {
  const userAst = tryParse(userCode);
  const solutionAst = tryParse(solution);
  if (!userAst || !solutionAst) return false;
  return JSON.stringify(serialize(userAst, new Map())) === JSON.stringify(serialize(solutionAst, new Map()));
}

function normalizedStringMatch(userCode: string, patterns: string[]): boolean {
  const normalized = userCode.replace(/\s+/g, ' ').trim().toLowerCase();
  return patterns.every(pattern => {
    const p = pattern.replace(/\s+/g, ' ').trim().toLowerCase();
    if (normalized.includes(p)) return true;
    const dotPattern = p.replace(/^[a-z_$][a-z0-9_$]*\./i, '___DOT___.');
    if (dotPattern !== p) {
      const flexRegex = new RegExp('[a-z_$][a-z0-9_$]*\\.' + p.split('.').slice(1).join('.').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      return flexRegex.test(normalized);
    }
    return false;
  });
}

export function validateCode(
  userCode: string,
  solution: string | string[],
  validationPatterns: string[]
): boolean {
  const solutions = Array.isArray(solution) ? solution : [solution];
  for (const s of solutions) {
    if (structuralMatch(userCode, s)) return true;
  }
  return normalizedStringMatch(userCode, validationPatterns);
}
