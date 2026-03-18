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

  return (
    <aside
      className="callout-aside"
      style={{
        margin: '1.5rem 0',
        paddingTop: '0.75rem',
        borderTop: `1px solid ${color}`,
        color,
      }}
    >
      <style>{`
        .callout-aside code {
          color: inherit !important;
          background: none !important;
        }
      `}</style>
      <div style={{
        fontSize: '0.7rem',
        fontWeight: 500,
        marginBottom: '0.4rem',
        letterSpacing: '0.02em',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '0.88rem',
        lineHeight: 1.75,
      }}>
        {children}
      </div>
    </aside>
  );
}
