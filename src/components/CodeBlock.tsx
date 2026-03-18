import { Highlight, themes } from 'prism-react-renderer';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlight?: number[];
}

export function CodeBlock({ code, language = 'tsx', filename, highlight = [] }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
      marginBottom: '1rem',
    }}>
      {filename && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          background: 'var(--color-bg-tertiary)',
          borderBottom: '1px solid var(--color-border)',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-text-secondary)',
        }}>
          <span>{filename}</span>
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-sans)',
              padding: '2px 8px',
              borderRadius: 4,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={{
            ...style,
            margin: 0,
            padding: '1rem',
            fontSize: '0.85rem',
            lineHeight: 1.65,
            overflow: 'auto',
            background: '#011627',
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
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
