interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export function ComparisonTable({ headers, rows, caption }: ComparisonTableProps) {
  return (
    <div style={{ marginBottom: '1.5rem', overflow: 'auto' }}>
      {caption && (
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          marginBottom: '0.5rem',
        }}>
          {caption}
        </div>
      )}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.85rem',
        lineHeight: 1.6,
      }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: '0.6rem 1rem',
                textAlign: 'left',
                background: 'var(--color-bg-tertiary)',
                borderBottom: '2px solid var(--color-border)',
                fontWeight: 600,
                color: 'var(--color-text)',
                whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: '0.6rem 1rem',
                  borderBottom: '1px solid var(--color-border)',
                  color: j === 0 ? 'var(--color-text)' : 'var(--color-text-secondary)',
                  fontWeight: j === 0 ? 500 : 400,
                  fontFamily: j > 0 ? 'var(--font-mono)' : undefined,
                  fontSize: j > 0 ? '0.8rem' : undefined,
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
