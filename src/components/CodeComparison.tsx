import { CodeBlock } from './CodeBlock';

interface CodeComparisonProps {
  svelte: { code: string; filename?: string; language?: string; highlight?: number[] };
  react: { code: string; filename?: string; language?: string; highlight?: number[] };
  note?: string;
}

export function CodeComparison({ svelte, react, note }: CodeComparisonProps) {
  return (
    <div style={{
      marginBottom: '1.5rem',
      marginLeft: '-1rem',
      marginRight: '-1rem',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1px',
        background: 'var(--color-border)',
      }}>
        <div style={{ background: 'var(--color-bg)' }}>
          <div style={{
            padding: '0.4rem 0.75rem',
            fontSize: '0.7rem',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            background: 'var(--color-bg-tertiary)',
            borderBottom: '1px solid var(--color-border)',
          }}>
            {svelte.filename || 'Svelte'}
          </div>
          <CodeBlock
            code={svelte.code}
            language={svelte.language || 'svelte'}
            highlight={svelte.highlight}
          />
        </div>
        <div style={{ background: 'var(--color-bg)' }}>
          <div style={{
            padding: '0.4rem 0.75rem',
            fontSize: '0.7rem',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            background: 'var(--color-bg-tertiary)',
            borderBottom: '1px solid var(--color-border)',
          }}>
            {react.filename || 'React'}
          </div>
          <CodeBlock
            code={react.code}
            language={react.language || 'tsx'}
            highlight={react.highlight}
          />
        </div>
      </div>
      {note && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--color-accent-dim)',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.65,
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--color-accent)', marginRight: '0.4rem', letterSpacing: '0.02em' }}>Insight</span>
          {note}
        </div>
      )}
    </div>
  );
}
