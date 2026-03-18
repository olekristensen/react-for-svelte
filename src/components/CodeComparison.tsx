import { CodeBlock } from './CodeBlock';

interface CodeComparisonProps {
  svelte: { code: string; filename?: string; language?: string; highlight?: number[] };
  react: { code: string; filename?: string; language?: string; highlight?: number[] };
  note?: string;
}

function Column({ label, code, language, highlight }: {
  label: string;
  code: string;
  language: string;
  highlight?: number[];
}) {
  return (
    <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        fontSize: '0.72rem',
        fontWeight: 500,
        color: 'var(--color-text-muted)',
        paddingBottom: '0.35rem',
      }}>
        {label}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CodeBlock code={code} language={language} highlight={highlight} noMargin stretch />
      </div>
    </div>
  );
}

export function CodeComparison({ svelte, react, note }: CodeComparisonProps) {
  return (
    <div style={{
      margin: '1.5rem 0',
      marginLeft: 'min(-3rem, calc((100% - 100vw + var(--sidebar-width) + 5rem) / 2))',
      marginRight: 'min(-3rem, calc((100% - 100vw + var(--sidebar-width) + 5rem) / 2))',
    }}>
      {/* Code columns */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: note ? '0.5rem' : 0,
      }}>
        <Column
          label={svelte.filename || 'Svelte'}
          code={svelte.code}
          language={svelte.language || 'svelte'}
          highlight={svelte.highlight}
        />
        <Column
          label={react.filename || 'React'}
          code={react.code}
          language={react.language || 'tsx'}
          highlight={react.highlight}
        />
      </div>

      {/* Insight — same container width as the code */}
      {note && (
        <div style={{
          padding: '0.5rem 0 0.75rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.7,
          borderBottom: '1px solid var(--color-border)',
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
