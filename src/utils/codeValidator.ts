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

// Normalized string comparison as fallback
function normalizedStringMatch(userCode: string, patterns: string[]): boolean {
  const normalized = userCode.replace(/\s+/g, ' ').trim().toLowerCase();
  return patterns.every(pattern =>
    normalized.includes(pattern.replace(/\s+/g, ' ').trim().toLowerCase())
  );
}

/**
 * Validate user code against solution.
 * 1. Try full AST structural match (ignores variable names, whitespace, formatting)
 * 2. Fall back to normalized string pattern matching
 */
export function validateCode(
  userCode: string,
  solution: string,
  validationPatterns: string[]
): boolean {
  if (structuralMatch(userCode, solution)) return true;
  return normalizedStringMatch(userCode, validationPatterns);
}
