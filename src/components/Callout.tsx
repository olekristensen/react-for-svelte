import type { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'insight' | 'gotcha';
  title?: string;
  children: ReactNode;
}

const config = {
  info: { bg: 'rgba(96, 165, 250, 0.05)', border: 'var(--color-accent)', color: 'var(--color-accent)' },
  warning: { bg: 'rgba(251, 191, 36, 0.05)', border: 'var(--color-warning)', color: 'var(--color-warning)' },
  insight: { bg: 'rgba(96, 165, 250, 0.05)', border: 'var(--color-accent)', color: 'var(--color-accent)' },
  gotcha: { bg: 'rgba(192, 96, 80, 0.05)', border: 'var(--color-error)', color: 'var(--color-error)' },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const c = config[type];
  return (
    <div style={{
      padding: '1rem 1.25rem',
      background: c.bg,
      border: 'none',
      borderLeft: `3px solid ${c.border}`,
      borderRadius: 'var(--radius-sm)',
      marginBottom: '1.5rem',
      fontSize: '0.9rem',
      lineHeight: 1.7,
    }}>
      {title && (
        <div style={{
          fontWeight: 600,
          color: c.color,
          marginBottom: '0.35rem',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}>
          {title}
        </div>
      )}
      <div style={{ color: 'var(--color-text-secondary)' }}>{children}</div>
    </div>
  );
}
