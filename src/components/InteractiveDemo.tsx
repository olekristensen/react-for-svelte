import { useState, type ReactNode } from 'react';

interface InteractiveDemoProps {
  title: string;
  children: ReactNode;
  code?: string;
}

export function InteractiveDemo({ title, children, code }: InteractiveDemoProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      marginBottom: '1.5rem',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1rem',
        background: 'var(--color-bg-tertiary)',
        borderBottom: '1px solid var(--color-border)',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--color-success)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        <span>Try it: {title}</span>
        {code && (
          <button
            onClick={() => setShowCode(v => !v)}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-sans)',
              padding: '3px 10px',
              borderRadius: 4,
            }}
          >
            {showCode ? 'Hide Code' : 'View Code'}
          </button>
        )}
      </div>
      <div style={{
        padding: '1.25rem',
        background: 'var(--color-surface)',
      }}>
        {children}
      </div>
      {showCode && code && (
        <pre style={{
          padding: '1rem',
          background: '#011627',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          overflow: 'auto',
          borderTop: '1px solid var(--color-border)',
          fontFamily: 'var(--font-mono)',
          color: '#d6deeb',
          margin: 0,
        }}>
          {code.trim()}
        </pre>
      )}
    </div>
  );
}
