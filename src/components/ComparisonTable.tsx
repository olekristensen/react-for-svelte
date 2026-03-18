interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
  /** Per-column format: 'code' for monospace, 'prose' (default) for body font */
  columnFormat?: ('code' | 'prose')[];
}

export function ComparisonTable({ headers, rows, caption, columnFormat }: ComparisonTableProps) {
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
                const mono = columnFormat?.[ci] === 'code';
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
