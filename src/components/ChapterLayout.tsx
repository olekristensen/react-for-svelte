import { type ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { allChapters } from '../data/chapters';
import { useProgress } from '../hooks/useProgress';

interface ChapterLayoutProps {
  id: string;
  children: ReactNode;
}

export function ChapterLayout({ id, children }: ChapterLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { markVisited } = useProgress();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Mark chapter as read when user scrolls near the bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      // Trigger when within 200px of the bottom
      if (pageHeight - scrollPosition < 200) {
        markVisited(id);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also check immediately in case page is short enough to not need scrolling
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id, markVisited]);

  const idx = allChapters.findIndex(c => c.id === id);
  const prev = idx > 0 ? allChapters[idx - 1] : null;
  const next = idx < allChapters.length - 1 ? allChapters[idx + 1] : null;
  const chapter = allChapters[idx];

  return (
    <article style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto', width: '100%' }}>
      <style>{`
        .nav-link { transition: color 0.2s ease; }
        .nav-link:hover { color: var(--color-accent) !important; }
        .nav-link .nav-arrow {
          display: inline-block;
          width: 0;
          overflow: hidden;
          opacity: 0;
          transition: width 0.2s ease, opacity 0.2s ease;
          vertical-align: text-bottom;
          position: relative;
          top: -0.05em;
        }
        .nav-link:hover .nav-arrow {
          opacity: 1;
        }
        .nav-link:hover .nav-arrow-left {
          width: 1.1em;
        }
        .nav-link:hover .nav-arrow-right {
          width: 1.1em;
        }
      `}</style>
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          marginBottom: '0.5rem',
          letterSpacing: '0.02em',
        }}>
          {chapter?.section}
        </div>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 400,
          lineHeight: 1.2,
          marginBottom: '0.75rem',
          color: 'var(--color-text)',
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
            className="nav-link"
            onClick={() => navigate(`/${prev.id}`)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-sans)',
              padding: 0,
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>
              <span className="nav-arrow nav-arrow-left">&larr; </span>
              Previous
            </div>
            <div style={{ fontSize: '0.88rem' }}>{prev.title}</div>
          </button>
        ) : <div />}
        {next ? (
          <button
            className="nav-link"
            onClick={() => navigate(`/${next.id}`)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'right',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-sans)',
              padding: 0,
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>
              Next
              <span className="nav-arrow nav-arrow-right"> &rarr;</span>
            </div>
            <div style={{ fontSize: '0.88rem' }}>{next.title}</div>
          </button>
        ) : <div />}
      </nav>
    </article>
  );
}
