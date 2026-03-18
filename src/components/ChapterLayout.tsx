import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { allChapters } from '../data/chapters';

interface ChapterLayoutProps {
  id: string;
  children: ReactNode;
}

export function ChapterLayout({ id, children }: ChapterLayoutProps) {
  const navigate = useNavigate();
  const idx = allChapters.findIndex(c => c.id === id);
  const prev = idx > 0 ? allChapters[idx - 1] : null;
  const next = idx < allChapters.length - 1 ? allChapters[idx + 1] : null;
  const chapter = allChapters[idx];

  return (
    <article style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem',
        }}>
          {chapter?.section}
        </div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, var(--color-text), var(--color-accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {chapter?.title}
        </h1>
        <p style={{
          fontSize: '1.05rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
        }}>
          {chapter?.description}
        </p>
      </header>

      <div style={{ fontSize: '0.95rem' }}>
        {children}
      </div>

      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--color-border)',
      }}>
        {prev ? (
          <button
            onClick={() => navigate(`/${prev.id}`)}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>Previous</div>
            <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{prev.title}</div>
          </button>
        ) : <div />}
        {next ? (
          <button
            onClick={() => navigate(`/${next.id}`)}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              textAlign: 'right',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>Next</div>
            <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{next.title}</div>
          </button>
        ) : <div />}
      </nav>
    </article>
  );
}
