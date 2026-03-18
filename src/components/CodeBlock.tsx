import { Highlight, themes } from 'prism-react-renderer';
import { useState, useSyncExternalStore } from 'react';

function useIsLightMode() {
  return useSyncExternalStore(
    (cb) => {
      const observer = new MutationObserver(cb);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      return () => observer.disconnect();
    },
    () => document.documentElement.getAttribute('data-theme') === 'light'
  );
}

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlight?: number[];
  noMargin?: boolean;
  stretch?: boolean;
}

export function CodeBlock({ code, language = 'tsx', filename, highlight = [], noMargin, stretch }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const isLight = useIsLightMode();
  // Svelte isn't in prism-react-renderer's grammar set; HTML covers its syntax
  const lang = language === 'svelte' ? 'html' : language;

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      marginBottom: noMargin ? 0 : '1rem',
      ...(stretch ? { flex: 1, display: 'flex', flexDirection: 'column' as const } : {}),
    }}>
      {filename && (
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          paddingBottom: '0.35rem',
          fontSize: '0.72rem',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
        }}>
          <span>{filename}</span>
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-sans)',
              padding: 0,
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <div style={{
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        ...(stretch ? { flex: 1, display: 'flex', flexDirection: 'column' as const } : {}),
      }}>
        <Highlight theme={isLight ? themes.github : themes.nightOwl} code={code.trim()} language={lang}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={{
              ...style,
              margin: 0,
              padding: '1rem',
              fontSize: '0.78rem',
              lineHeight: 1.65,
              overflow: 'auto',
              background: 'var(--color-code-bg)',
              backgroundColor: 'var(--color-code-bg)',
              ...(stretch ? { flex: 1 } : {}),
            }}>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line });
                const isHighlighted = highlight.includes(i + 1);
                return (
                  <div
                    key={i}
                    {...lineProps}
                    style={{
                      ...lineProps.style,
                      background: isHighlighted ? 'rgba(56, 189, 248, 0.1)' : undefined,
                      borderLeft: isHighlighted ? '3px solid var(--color-accent)' : '3px solid transparent',
                      paddingLeft: '0.75rem',
                      marginLeft: '-0.75rem',
                    }}
                  >
                    {line.map((token, key) => {
                      const tokenProps = getTokenProps({ token });
                      const types = token.types;
                      const isComment = types.includes('comment');
                      const isKeyword = types.includes('keyword') || types.includes('tag') || types.includes('builtin') || types.includes('operator') || types.includes('boolean') || types.includes('important');
                      const isString = types.includes('string') || types.includes('attr-value') || types.includes('template-string');
                      const isFunction = types.includes('function') || types.includes('class-name');
                      const isPunctuation = types.includes('punctuation') || types.includes('plain');

                      if (isComment) {
                        tokenProps.style = { color: 'var(--color-text-muted)', fontStyle: 'italic', fontWeight: 400 };
                      } else if (isKeyword) {
                        tokenProps.style = { color: 'var(--color-accent)', fontWeight: 700 };
                      } else if (isFunction) {
                        tokenProps.style = { color: 'var(--color-accent)', fontWeight: 500 };
                      } else if (isString) {
                        tokenProps.style = { color: 'var(--color-code-text)', fontWeight: 400 };
                      } else if (isPunctuation) {
                        tokenProps.style = { color: 'var(--color-text-muted)', fontWeight: 400 };
                      } else {
                        tokenProps.style = { color: 'var(--color-code-text)', fontWeight: 400 };
                      }
                      return <span key={key} {...tokenProps} />;
                    })}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
