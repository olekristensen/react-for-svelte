import { useState, useEffect, useRef, type ReactNode } from 'react';

interface ConsoleEntry {
  id: number;
  args: unknown[];
  timestamp: number;
}

interface ConsoleCaptureProps {
  children: ReactNode;
  /** Max entries to show before scrolling */
  maxEntries?: number;
}

let nextId = 0;

// Capture the true console.log once at module load — before any component can wrap it
const nativeLog = console.log.bind(console);

/**
 * Wraps children and captures console.log calls made within,
 * displaying them in a small inline panel below the content.
 */
export function ConsoleCapture({ children, maxEntries = 20 }: ConsoleCaptureProps) {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    const prevLog = console.log;

    console.log = (...args: unknown[]) => {
      // Always forward to the real native log
      nativeLog(...args);
      // Only capture if this instance is still mounted
      if (activeRef.current) {
        setEntries(prev => {
          const next = [...prev, { id: nextId++, args, timestamp: Date.now() }];
          return next.slice(-maxEntries);
        });
      }
    };

    return () => {
      activeRef.current = false;
      // Only restore if console.log is still our wrapper
      // (another ConsoleCapture may have wrapped it since)
      console.log = prevLog;
    };
  }, [maxEntries]);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  const formatArg = (arg: unknown): string => {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
    try {
      return JSON.stringify(arg, null, 2);
    } catch {
      return String(arg);
    }
  };

  const formatEntry = (entry: ConsoleEntry): string => {
    return entry.args.map(formatArg).join(' ');
  };

  return (
    <div>
      {children}
      {entries.length > 0 && (
        <div
          ref={scrollRef}
          style={{
            marginTop: '0',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-code-bg)',
            maxHeight: '8rem',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            lineHeight: 1.6,
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.25rem 0.75rem',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-sans)',
            }}>
              CONSOLE
            </span>
            <button
              onClick={() => setEntries([])}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                padding: 0,
              }}
            >
              clear
            </button>
          </div>
          {entries.map(entry => (
            <div
              key={entry.id}
              style={{
                padding: '0.15rem 0.75rem',
                color: 'var(--color-text-secondary)',
                borderBottom: '1px solid var(--color-border)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {formatEntry(entry)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
