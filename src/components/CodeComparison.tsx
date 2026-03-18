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
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
          }}>
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
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
          }}>
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
          paddingTop: '0.6rem',
          marginTop: '0.5rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--color-accent)', marginRight: '0.4rem', letterSpacing: '0.02em' }}>Insight</span>{note}
        </div>
      )}
    </div>
  );
}
