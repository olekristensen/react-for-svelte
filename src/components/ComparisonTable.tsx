interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

// Explicit per-header-set column formatting.
// true = monospace (code), false = sans-serif (prose)
// Key is the joined headers, value is array of booleans per column.
const COLUMN_FORMAT: Record<string, boolean[]> = {
  // Svelte vs React code comparisons — code in framework columns
  'Concept|Svelte 5|React': [false, true, true],
  'Concept|Svelte|React': [false, true, true],
  'Pattern|Svelte 5|React': [false, true, true],
  'Pattern|Svelte|React': [false, true, true],
  'Optimization|Svelte|React': [false, true, true],

  // Template/syntax references — all code except notes
  'Svelte Template|JSX Equivalent|Notes': [true, true, false],
  'Svelte Built-in|React Equivalent|Notes': [true, true, false],
  'Svelte Concept|React Equivalent|Key Difference': [true, true, false],
  'Svelte Pattern|Zustand Equivalent|Jotai Equivalent': [true, true, true],

  // Framework feature comparisons — col 0 is prose label, rest is mixed prose
  'Concept|SvelteKit|Next.js App Router': [false, true, true],
  'Concept|SvelteKit|React + Libraries': [false, true, true],
  'Feature|Svelte|React': [false, true, true],
  'Feature|SvelteKit|Next.js App Router': [false, false, false],
  'Feature|SvelteKit|Next.js': [false, false, false],
  'Feature|Svelte Built-in|CSS Transitions|Framer Motion|React Spring': [false, false, false, false, false],
  'Feature|React Router|TanStack Router|Next.js App Router|SvelteKit': [false, false, false, false, false],
  'Feature|Svelte|React Hook Form|TanStack Form|Raw React': [false, false, false, false, false],
  'Strategy|SvelteKit|Next.js App Router': [false, false, false],
  'Dimension|Svelte (Compiler)|React (Runtime)': [false, false, false],

  // Library/tool overviews — col 0 is library name (mono), rest prose
  'Library|Mental Model|Bundle Size|Best For': [true, false, false, false],
  'Library|Approach|Styling|Accessibility|Best For': [true, false, false, false, false],

  // Decision/recommendation tables — col 1 has API names (mono)
  'Concern|Solution|Why': [false, true, false],
  'Scenario|Recommended|Why': [false, true, false],
  'Scenario|Approach|Why': [false, true, false],

  // Styling approaches — all prose
  'Approach|Scoping|Pros|Cons': [false, false, false, false],
};

function getColumnFormats(headers: string[]): boolean[] {
  const key = headers.join('|');
  return COLUMN_FORMAT[key] || headers.map(() => false);
}

export function ComparisonTable({ headers, rows, caption }: ComparisonTableProps) {
  const columnIsMono = getColumnFormats(headers);

  return (
    <div style={{ margin: '1.5rem 0', overflowX: 'auto' }}>
      {caption && (
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          marginBottom: '0.5rem',
        }}>
          {caption}
        </div>
      )}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.85rem',
      }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: 'left',
                padding: '0.5rem 0.75rem 0.5rem 0',
                fontWeight: 500,
                color: 'var(--color-text)',
                borderBottom: '1px solid var(--color-text-muted)',
                fontSize: '0.82rem',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => {
                const mono = columnIsMono[ci];
                return (
                  <td key={ci} style={{
                    padding: '0.5rem 0.75rem 0.5rem 0',
                    color: ci === 0 ? 'var(--color-text)' : 'var(--color-text-secondary)',
                    borderBottom: '1px solid var(--color-border)',
                    fontFamily: mono ? 'var(--font-mono)' : 'inherit',
                    fontSize: mono ? '0.78rem' : '0.85rem',
                    verticalAlign: 'top',
                    lineHeight: 1.5,
                  }}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
