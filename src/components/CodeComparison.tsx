import { CodeBlock } from './CodeBlock';

interface CodeComparisonProps {
  svelte: { code: string; filename?: string; language?: string; highlight?: number[] };
  react: { code: string; filename?: string; language?: string; highlight?: number[] };
  note?: string;
}

export function CodeComparison({ svelte, react, note }: CodeComparisonProps) {
  return (
    <div style={{
      margin: '1.5rem 0',
      borderBottom: '1px solid var(--color-border)',
      paddingBottom: note ? 0 : '0.5rem',
    }}>
      {/* Labels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '0.35rem',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
          {svelte.filename || 'Svelte'}
        </div>
        <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
          {react.filename || 'React'}
        </div>
      </div>

      {/* Code blocks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: note ? '0.75rem' : 0,
      }}>
        <div>
          <CodeBlock
            code={svelte.code}
            language={svelte.language || 'svelte'}
            highlight={svelte.highlight}
          />
        </div>
        <div>
          <CodeBlock
            code={react.code}
            language={react.language || 'tsx'}
            highlight={react.highlight}
          />
        </div>
      </div>

      {/* Insight — inside the same bordered unit, no separator above */}
      {note && (
        <div style={{
          padding: '0.6rem 0 0.75rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.7,
        }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 500,
            color: 'var(--color-accent)',
            marginRight: '0.5rem',
            letterSpacing: '0.02em',
          }}>Insight</span>
          {note}
        </div>
      )}
    </div>
  );
}
