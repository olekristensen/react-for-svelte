import type { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'insight' | 'gotcha';
  title?: string;
  children: ReactNode;
}

const typeLabels: Record<string, string> = {
  info: 'Note',
  warning: 'Warning',
  insight: 'Insight',
  gotcha: 'Gotcha',
};

const typeColors: Record<string, string> = {
  info: 'var(--color-accent)',
  warning: 'var(--color-warning)',
  insight: 'var(--color-accent)',
  gotcha: 'var(--color-error)',
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const label = title || typeLabels[type];
  const color = typeColors[type] || typeColors.info;
  const isInsight = type === 'insight';

  if (isInsight) {
    // Pull-quote style: indented with a left accent rule
    return (
      <aside style={{
        margin: '2rem 0',
        paddingLeft: '1.25rem',
        borderLeft: `2px solid ${color}`,
      }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 500,
          color,
          marginBottom: '0.4rem',
          letterSpacing: '0.02em',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '0.92rem',
          color: 'var(--color-text)',
          lineHeight: 1.75,
          fontWeight: 400,
        }}>
          {children}
        </div>
      </aside>
    );
  }

  // Default callouts: thin top border
  return (
    <aside style={{
      margin: '1.5rem 0',
      paddingTop: '0.75rem',
      borderTop: `1px solid ${color}`,
    }}>
      <div style={{
        fontSize: '0.7rem',
        fontWeight: 500,
        color,
        marginBottom: '0.4rem',
        letterSpacing: '0.02em',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '0.88rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.75,
      }}>
        {children}
      </div>
    </aside>
  );
}
