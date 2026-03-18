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
    <>
      <style>{`
        .code-cmp {
          margin: 1.5rem 0;
          /* Break out of text column, centered, capped at available space */
          margin-left: max(-3rem, calc((var(--content-max-width) - 100vw + var(--sidebar-width) + 5rem) / 2));
          margin-right: max(-3rem, calc((var(--content-max-width) - 100vw + var(--sidebar-width) + 5rem) / 2));
        }
        .code-cmp-cols {
          display: flex;
          gap: 1.5rem;
        }
        /* When sidebar is closed, recalculate without sidebar width */
        @media (max-width: 1100px) {
          .code-cmp {
            margin-left: max(-1.5rem, calc((var(--content-max-width) - 100vw + 5rem) / 2));
            margin-right: max(-1.5rem, calc((var(--content-max-width) - 100vw + 5rem) / 2));
          }
        }
        /* No breakout when tight — stay with text margins */
        @media (max-width: 960px) {
          .code-cmp {
            margin-left: 0;
            margin-right: 0;
          }
        }
        /* Stack columns */
        @media (max-width: 860px) {
          .code-cmp-cols {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
      <div className="code-cmp">
        <div className="code-cmp-cols" style={{ marginBottom: note ? '0.5rem' : 0 }}>
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
    </>
  );
}
