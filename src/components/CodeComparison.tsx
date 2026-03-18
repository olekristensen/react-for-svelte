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
    }}>
      {/* Labels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '0.35rem',
      }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
        }}>
          {svelte.filename || 'Svelte'}
        </div>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
        }}>
          {react.filename || 'React'}
        </div>
      </div>

      {/* Code blocks side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
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

      {/* Insight note — sits directly below as a continuation */}
      {note && (
        <div style={{
          marginTop: '-0.5rem',
          paddingTop: '0.6rem',
          borderTop: '1px solid var(--color-accent)',
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
