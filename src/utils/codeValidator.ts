import * as acorn from 'acorn';
import jsx from 'acorn-jsx';

const JsxParser = acorn.Parser.extend(jsx());

const PARSE_OPTS = { ecmaVersion: 2022 as const, sourceType: 'module' as const, allowReturnOutsideFunction: true };

function tryParse(code: string): acorn.Node | null {
  try { return JsxParser.parse(code, PARSE_OPTS); } catch { /* */ }
  try { return JsxParser.parse(`function __w__(){\n${code}\n}`, PARSE_OPTS); } catch { /* */ }
  try { return JsxParser.parseExpressionAt(code, 0, PARSE_OPTS) as acorn.Node; } catch { /* */ }
  return null;
}

// Well-known identifiers that should NOT be renamed during normalization
const WELL_KNOWN = new Set([
  'React', 'useState', 'useEffect', 'useRef', 'useContext', 'useMemo',
  'useCallback', 'useReducer', 'createContext', 'forwardRef',
  'console', 'log', 'error', 'warn', 'document', 'window',
  'localStorage', 'JSON', 'parse', 'stringify', 'getItem', 'setItem',
  'removeItem', 'preventDefault', 'stopPropagation', 'target', 'value',
  'currentTarget', 'map', 'filter', 'reduce', 'forEach', 'find',
  'includes', 'push', 'pop', 'shift', 'slice', 'splice', 'concat',
  'length', 'trim', 'split', 'join', 'keys', 'values', 'entries',
  'setTimeout', 'setInterval', 'clearInterval', 'clearTimeout',
  'requestAnimationFrame', 'Promise', 'fetch', 'then', 'catch',
  'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',
  'Array', 'Object', 'String', 'Number', 'Boolean', 'Math',
  'props', 'children', 'className', 'style', 'onClick', 'onChange',
  'onSubmit', 'onMouseDown', 'onMouseUp', 'onMouseMove', 'onKeyDown',
  'href', 'type', 'key', 'ref', 'id', 'name', 'placeholder',
  'disabled', 'checked', 'selected', 'readOnly',
  'Link', 'Component', 'Fragment', 'Provider',
  'set', 'get', 'create', 'from', 'of', 'is',
  'json', 'ok', 'status', 'headers', 'body', 'method',
]);

// Keys to skip when serializing — positional/source info
const SKIP_KEYS = new Set(['start', 'end', 'loc', 'range', 'raw', 'sourceType', 'extra', 'trailingComments', 'leadingComments', 'comments']);

/**
 * Serialize an AST node into a canonical JSON-like structure.
 * Variable names are mapped to positional ids ($0, $1, ...).
 * Positions/comments are stripped. Everything else is preserved.
 */
function serialize(node: unknown, nameMap: Map<string, string>): unknown {
  if (node === null || node === undefined) return null;
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') return node;
  if (Array.isArray(node)) {
    return node
      .map(n => serialize(n, nameMap))
      .filter(n => {
        // Remove whitespace-only JSXText nodes
        if (n && typeof n === 'object' && (n as Record<string, unknown>).type === 'JSXText') {
          const val = (n as Record<string, unknown>).value as string;
          return val !== '';
        }
        return true;
      });
  }
  if (typeof node !== 'object') return null;

  const n = node as Record<string, unknown>;
  const type = n.type as string | undefined;
  if (!type) return null;

  const out: Record<string, unknown> = { type };

  // Handle identifiers: rename user-defined, keep well-known
  if (type === 'Identifier') {
    const name = n.name as string;
    if (WELL_KNOWN.has(name)) {
      out.name = name;
    } else {
      if (!nameMap.has(name)) nameMap.set(name, `$${nameMap.size}`);
      out.name = nameMap.get(name);
    }
    return out;
  }

  // JSX identifiers are always kept as-is (tag names, attribute names)
  if (type === 'JSXIdentifier') {
    out.name = n.name;
    return out;
  }

  // JSX text: normalize whitespace
  if (type === 'JSXText') {
    out.value = (n.value as string).replace(/\s+/g, ' ').trim();
    return out;
  }

  // Normalize equivalent React patterns before recursing:
  //
  // 1. setFoo(c => c + 1) → setFoo($arg + 1)
  //    Arrow-function updater with single param that just applies
  //    an operation on that param is equivalent to the direct form.
  if (type === 'CallExpression') {
    const args = n.arguments as unknown[];
    if (args?.length === 1) {
      const arg = args[0] as Record<string, unknown>;
      if (arg?.type === 'ArrowFunctionExpression') {
        const params = arg.params as Record<string, unknown>[];
        const body = arg.body as Record<string, unknown>;
        // Arrow with single param and expression body (not block)
        if (params?.length === 1 && body?.type && body.type !== 'BlockStatement') {
          const paramName = (params[0] as Record<string, unknown>).name as string;
          // Create a temporary nameMap entry so the param maps to
          // the same id as the outer variable would
          const innerMap = new Map(nameMap);
          // Find what the outer scope's equivalent variable maps to
          // by looking at the callee — if it's setFoo, map param to
          // the same id as foo would get
          const callee = n.callee as Record<string, unknown>;
          if (callee?.type === 'Identifier') {
            const setterName = callee.name as string;
            // Convention: setter is setX, state is x (lowercase first letter)
            const stateName = setterName.replace(/^set/, '').replace(/^./, c => c.toLowerCase());
            if (nameMap.has(stateName)) {
              innerMap.set(paramName, nameMap.get(stateName)!);
            }
          }
          // Serialize as a direct call with the body expression
          const serializedCallee = serialize(n.callee, nameMap);
          const serializedBody = serialize(body, innerMap);
          return { type: 'CallExpression', callee: serializedCallee, arguments: [serializedBody], optional: false };
        }
      }
    }
  }

  // 2. x++ / ++x → x + 1 (UpdateExpression → BinaryExpression)
  if (type === 'UpdateExpression' && n.operator === '++') {
    return {
      type: 'BinaryExpression',
      operator: '+',
      left: serialize(n.argument, nameMap),
      right: 1,
    };
  }
  if (type === 'UpdateExpression' && n.operator === '--') {
    return {
      type: 'BinaryExpression',
      operator: '-',
      left: serialize(n.argument, nameMap),
      right: 1,
    };
  }

  // Recurse all keys except positional ones
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

  const u = JSON.stringify(serialize(userAst, new Map()));
  const s = JSON.stringify(serialize(solutionAst, new Map()));
  return u === s;
}

// Normalized string comparison as fallback.
// Strips whitespace AND identifier prefixes before dots/parens
// so e.preventDefault() matches ev.preventDefault() matches event.preventDefault()
function normalizedStringMatch(userCode: string, patterns: string[]): boolean {
  // Collapse whitespace
  const normalized = userCode.replace(/\s+/g, ' ').trim().toLowerCase();
  return patterns.every(pattern => {
    const p = pattern.replace(/\s+/g, ' ').trim().toLowerCase();
    if (normalized.includes(p)) return true;
    // Try matching with flexible identifier before dots
    // e.g. "e.preventdefault()" matches "ev.preventdefault()" or "event.preventdefault()"
    const dotPattern = p.replace(/^[a-z_$][a-z0-9_$]*\./i, '___DOT___.');
    if (dotPattern !== p) {
      const flexRegex = new RegExp('[a-z_$][a-z0-9_$]*\\.' + escapeRegex(dotPattern.split('___DOT___.')[1]));
      return flexRegex.test(normalized);
    }
    return false;
  });
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate user code against one or more accepted solutions.
 * 1. Try full AST structural match against each solution
 * 2. Fall back to normalized string pattern matching
 */
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
