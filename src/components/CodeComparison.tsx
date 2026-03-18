import { CodeBlock } from './CodeBlock';

interface CodeComparisonProps {
  svelte: { code: string; filename?: string; language?: string; highlight?: number[] };
  react: { code: string; filename?: string; language?: string; highlight?: number[] };
  note?: string;
}

export function CodeComparison({ svelte, react, note }: CodeComparisonProps) {
  return (
    <div style={{
      margin: '1.5rem -2rem',
      padding: '0 2rem',
      borderBottom: '1px solid var(--color-border)',
      paddingBottom: note ? 0 : '0.5rem',
    }}>
      {/* Single grid for labels + code — columns stay aligned */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0 1.5rem',
      }}>
        {/* Row 1: labels */}
        <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-text-muted)', paddingBottom: '0.35rem' }}>
          {svelte.filename || 'Svelte'}
        </div>
        <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-text-muted)', paddingBottom: '0.35rem' }}>
          {react.filename || 'React'}
        </div>

        {/* Row 2: code blocks — minWidth 0 prevents grid blowout */}
        <div style={{ minWidth: 0 }}>
          <CodeBlock
            code={svelte.code}
            language={svelte.language || 'svelte'}
            highlight={svelte.highlight}
            noMargin
          />
        </div>
        <div style={{ minWidth: 0 }}>
          <CodeBlock
            code={react.code}
            language={react.language || 'tsx'}
            highlight={react.highlight}
            noMargin
          />
        </div>
      </div>

      {/* Insight */}
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
