import * as acorn from 'acorn';

// Parse code permissively — wraps in function body if needed
function tryParse(code: string): acorn.Node | null {
  // Try parsing as module (handles import/export)
  try {
    return acorn.parse(code, { ecmaVersion: 2022, sourceType: 'module', allowReturnOutsideFunction: true });
  } catch { /* continue */ }

  // Try wrapping in a function body (handles bare statements, return, etc.)
  try {
    return acorn.parse(`function __wrapper__() {\n${code}\n}`, { ecmaVersion: 2022, sourceType: 'module' });
  } catch { /* continue */ }

  // Try as expression
  try {
    return acorn.parseExpressionAt(code, 0, { ecmaVersion: 2022, sourceType: 'module' });
  } catch { /* continue */ }

  return null;
}

// Normalize an AST node into a canonical form for comparison.
// Strips: positions, variable names (replaced with positional ids),
// extra whitespace differences, semicolons vs no semicolons.
interface NormalizedNode {
  type: string;
  children: NormalizedNode[];
  value?: string | number | boolean | null;
  operator?: string;
  kind?: string; // var/let/const
}

function normalizeNode(node: unknown, nameMap: Map<string, string> = new Map()): NormalizedNode {
  if (!node || typeof node !== 'object') {
    return { type: 'Literal', children: [], value: node as string | number | boolean | null };
  }

  const n = node as Record<string, unknown>;
  const type = n.type as string;

  if (!type) {
    return { type: 'Unknown', children: [] };
  }

  const result: NormalizedNode = { type, children: [] };

  // Normalize identifiers — map variable names to positional ids
  if (type === 'Identifier') {
    const name = n.name as string;
    // Keep well-known names (React APIs, built-ins)
    const wellKnown = new Set([
      'React', 'useState', 'useEffect', 'useRef', 'useContext', 'useMemo',
      'useCallback', 'useReducer', 'createContext', 'forwardRef',
      'console', 'log', 'error', 'warn', 'document', 'window',
      'localStorage', 'JSON', 'parse', 'stringify', 'getItem', 'setItem',
      'preventDefault', 'target', 'value', 'currentTarget',
      'map', 'filter', 'reduce', 'forEach', 'find', 'includes',
      'push', 'pop', 'shift', 'length', 'trim', 'split', 'join',
      'setTimeout', 'setInterval', 'clearInterval', 'clearTimeout',
      'Promise', 'fetch', 'then', 'catch', 'async', 'await',
      'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',
      'Array', 'Object', 'String', 'Number', 'Boolean', 'Math',
      'props', 'children', 'className', 'style', 'onClick', 'onChange',
      'onSubmit', 'href', 'type', 'key', 'ref', 'id', 'name',
      'Link', 'Component', 'Fragment',
    ]);
    if (wellKnown.has(name)) {
      result.value = name;
    } else {
      if (!nameMap.has(name)) {
        nameMap.set(name, `$${nameMap.size}`);
      }
      result.value = nameMap.get(name);
    }
    return result;
  }

  // Preserve literal values
  if (type === 'Literal') {
    result.value = n.value as string | number | boolean | null;
    return result;
  }

  // Preserve operators
  if (n.operator) {
    result.operator = n.operator as string;
  }

  // Preserve declaration kind
  if (n.kind) {
    result.kind = n.kind as string;
  }

  // Normalize UpdateExpression (count++) to equivalent patterns
  // count++ and count + 1 and count += 1 should all match
  if (type === 'UpdateExpression') {
    result.type = 'UpdateExpression';
    result.operator = n.operator as string;
    result.children = [normalizeNode(n.argument, nameMap)];
    return result;
  }

  // Recurse into children
  const childKeys = [
    'body', 'declarations', 'declaration', 'init', 'test', 'consequent',
    'alternate', 'argument', 'arguments', 'callee', 'object', 'property',
    'left', 'right', 'elements', 'properties', 'params', 'expression',
    'expressions', 'key', 'value', 'computed', 'tag', 'quasi', 'quasis',
    'block', 'handler', 'finalizer', 'discriminant', 'cases', 'label',
    'update', 'source', 'specifiers', 'local', 'exported', 'imported',
    'openingElement', 'closingElement', 'attributes', 'name', 'selfClosing',
  ];

  for (const k of childKeys) {
    const child = n[k];
    if (child === undefined || child === null) continue;
    if (Array.isArray(child)) {
      for (const item of child) {
        result.children.push(normalizeNode(item, nameMap));
      }
    } else if (typeof child === 'object' && (child as Record<string, unknown>).type) {
      result.children.push(normalizeNode(child, nameMap));
    }
  }

  return result;
}

// Deep-compare two normalized ASTs
function astEqual(a: NormalizedNode, b: NormalizedNode): boolean {
  if (a.type !== b.type) return false;
  if (a.value !== b.value) return false;
  if (a.operator !== b.operator) return false;
  if (a.kind !== b.kind) return false;
  if (a.children.length !== b.children.length) return false;
  return a.children.every((child, i) => astEqual(child, b.children[i]));
}

// Check structural equivalence between user code and solution
function structuralMatch(userCode: string, solution: string): boolean {
  const userAst = tryParse(userCode);
  const solutionAst = tryParse(solution);

  if (!userAst || !solutionAst) return false;

  const normalizedUser = normalizeNode(userAst);
  const normalizedSolution = normalizeNode(solutionAst, new Map());

  return astEqual(normalizedUser, normalizedSolution);
}

// Check if specific patterns exist in the AST (for partial checks)
function hasConstruct(code: string, construct: string): boolean {
  const ast = tryParse(code);
  if (!ast) return false;

  const normalized = JSON.stringify(normalizeNode(ast));

  // Check for common constructs
  switch (construct) {
    case 'calls-setState':
      return /CallExpression.*\$1/.test(normalized) || /CallExpression.*set[A-Z]/.test(normalized);
    case 'has-cleanup-return':
      return normalized.includes('"type":"ReturnStatement"') && normalized.includes('"type":"ArrowFunctionExpression"');
    case 'has-preventDefault':
      return normalized.includes('"value":"preventDefault"');
    case 'has-spread':
      return normalized.includes('"type":"SpreadElement"');
    case 'has-provider':
      return /Provider/.test(code);
    default:
      return false;
  }
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
 * Tries AST structural comparison first, falls back to pattern matching.
 */
export function validateCode(
  userCode: string,
  solution: string,
  validationPatterns: string[]
): boolean {
  // 1. Try full structural AST match
  if (structuralMatch(userCode, solution)) {
    return true;
  }

  // 2. Try AST-based construct checks from patterns
  // If patterns describe constructs (prefixed with 'ast:'), check those
  const astPatterns = validationPatterns.filter(p => p.startsWith('ast:'));
  const stringPatterns = validationPatterns.filter(p => !p.startsWith('ast:'));

  if (astPatterns.length > 0) {
    const astPassed = astPatterns.every(p => hasConstruct(userCode, p.slice(4)));
    if (astPassed && (stringPatterns.length === 0 || normalizedStringMatch(userCode, stringPatterns))) {
      return true;
    }
  }

  // 3. Fall back to normalized string matching
  return normalizedStringMatch(userCode, stringPatterns);
}
