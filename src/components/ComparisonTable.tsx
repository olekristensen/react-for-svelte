interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

// Heuristic: a cell looks like code if it's short-ish and contains
// code-like characters, or looks like an API/syntax reference.
function looksLikeCode(text: string): boolean {
  const trimmed = text.trim();
  // Prose tends to be longer with natural language
  if (trimmed.length > 60) return false;
  // Contains code indicators
  if (/[{}()<>=/|$@#`]/.test(trimmed)) return true;
  // Contains camelCase or dot notation
  if (/[a-z][A-Z]|[a-z]\.[a-z]/.test(trimmed)) return true;
  // Starts with a code keyword or looks like an identifier
  if (/^(const |let |var |function |import |export |use[A-Z])/.test(trimmed)) return true;
  return false;
}

// Headers that indicate prose content
function isProseHeader(header: string): boolean {
  return /notes?|description|why|best for|when|purpose|comment/i.test(header);
}

export function ComparisonTable({ headers, rows, caption }: ComparisonTableProps) {
  // Pre-compute which columns are prose based on headers
  const proseColumns = headers.map((h) => isProseHeader(h));

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
                const isMono = !proseColumns[ci] && looksLikeCode(cell);
                return (
                  <td key={ci} style={{
                    padding: '0.5rem 0.75rem 0.5rem 0',
                    color: ci === 0 ? 'var(--color-text)' : 'var(--color-text-secondary)',
                    borderBottom: '1px solid var(--color-border)',
                    fontFamily: isMono ? 'var(--font-mono)' : 'inherit',
                    fontSize: isMono ? '0.78rem' : '0.85rem',
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
