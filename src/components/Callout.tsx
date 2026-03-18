import { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'insight' | 'gotcha';
  title?: string;
  children: ReactNode;
}

const config = {
  info: { bg: 'rgba(96, 165, 250, 0.08)', border: 'rgba(96, 165, 250, 0.3)', icon: 'i', color: '#60a5fa' },
  warning: { bg: 'rgba(251, 191, 36, 0.08)', border: 'rgba(251, 191, 36, 0.3)', icon: '!', color: '#fbbf24' },
  insight: { bg: 'rgba(74, 222, 128, 0.08)', border: 'rgba(74, 222, 128, 0.3)', icon: '*', color: '#4ade80' },
  gotcha: { bg: 'rgba(251, 113, 133, 0.08)', border: 'rgba(251, 113, 133, 0.3)', icon: '~', color: '#fb7185' },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const c = config[type];
  return (
    <div style={{
      padding: '1rem 1.25rem',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderLeft: `3px solid ${c.color}`,
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
