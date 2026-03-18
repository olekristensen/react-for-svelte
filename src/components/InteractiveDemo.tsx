import { useState, type ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';
import { ConsoleCapture } from './ConsoleCapture';

interface InteractiveDemoProps {
  title: string;
  children: ReactNode;
  code?: string;
}

export function InteractiveDemo({ title, children, code }: InteractiveDemoProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--color-accent)',
        paddingTop: '0.5rem',
        marginBottom: '0.75rem',
      }}>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 500,
          color: 'var(--color-accent)',
          letterSpacing: '0.02em',
        }}>
          {title}
        </span>
        {code && (
          <button
            onClick={() => setShowCode(v => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              padding: 0,
            }}
          >
            {showCode ? 'Hide code' : 'View code'}
          </button>
        )}
      </div>

      <div style={{
        padding: '1rem',
        border: '1px solid var(--color-border)',
      }}>
        <ConsoleCapture>
          {children}
        </ConsoleCapture>
      </div>

      {showCode && code && (
        <div style={{ marginTop: '-1px' }}>
          <CodeBlock code={code} language="tsx" />
        </div>
      )}
    </div>
  );
}
