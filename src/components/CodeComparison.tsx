import { CodeBlock } from './CodeBlock';

interface CodeComparisonProps {
  svelte: { code: string; filename?: string; language?: string; highlight?: number[] };
  react: { code: string; filename?: string; language?: string; highlight?: number[] };
  note?: string;
}

export function CodeComparison({ svelte, react, note }: CodeComparisonProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--color-svelte)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-svelte)',
            }} />
            Svelte
          </div>
          <CodeBlock
            code={svelte.code}
            language={svelte.language || 'svelte'}
            filename={svelte.filename}
            highlight={svelte.highlight}
          />
        </div>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--color-react)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-react)',
            }} />
            React
          </div>
          <CodeBlock
            code={react.code}
            language={react.language || 'tsx'}
            filename={react.filename}
            highlight={react.highlight}
          />
        </div>
      </div>
      {note && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--color-accent)' }}>Insight: </strong>{note}
        </div>
      )}
    </div>
  );
}
