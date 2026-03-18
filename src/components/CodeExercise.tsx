import { useState, useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Highlight, themes } from 'prism-react-renderer';
import { useProgress } from '../hooks/useProgress';
import { IconCheck, IconExpand, IconCollapse } from './Icons';

function Confetti() {
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360 + (Math.random() * 30 - 15);
    const distance = 80 + Math.random() * 120;
    const size = 3 + Math.random() * 4;
    const dx = Math.cos((angle * Math.PI) / 180) * distance;
    const dy = Math.sin((angle * Math.PI) / 180) * distance - 40;
    const delay = Math.random() * 0.15;
    const hue = 130 + Math.random() * 30; // green range
    const lightness = 40 + Math.random() * 25;
    return { dx, dy, size, delay, hue, lightness, id: i };
  });

  return (
    <>
      <style>{`
        @keyframes confetti-burst {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        {particles.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              background: `hsl(${p.hue}, 60%, ${p.lightness}%)`,
              animation: `confetti-burst 1.2s cubic-bezier(0.2, 0.8, 0.3, 1) ${p.delay}s forwards`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}

function useIsLightMode() {
  const [light, setLight] = useState(() => document.documentElement.getAttribute('data-theme') === 'light');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLight(document.documentElement.getAttribute('data-theme') === 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return light;
}

interface CodeExerciseProps {
  id: string;
  title: string;
  type: 'fix-the-bug' | 'complete-the-code';
  description: string;
  initialCode: string;
  solution: string;
  validationPatterns: string[];
  hints: string[];
  language?: string;
  /** Live preview of the BROKEN/incomplete version */
  buggyPreview?: ReactNode;
  /** Live preview of the CORRECT version (shown when solved or as goal) */
  solvedPreview?: ReactNode;
}

function normalize(code: string): string {
  return code.replace(/\s+/g, ' ').trim().toLowerCase();
}

function validate(userCode: string, patterns: string[]): boolean {
  const normalized = normalize(userCode);
  return patterns.every(pattern => normalized.includes(normalize(pattern)));
}

// Shared editor + preview content, used both inline and in modal
function ExerciseContent({
  type,
  title,
  description,
  userCode,
  setUserCode,
  status,
  setStatus,
  hintIndex,
  setHintIndex: _unusedSetHintIndex,
  attempts,
  showSolution,
  shaking,
  hints,
  handleCheck,
  handleHint,
  handleReset,
  handleShowSolution,
  textareaRef,
  buggyPreview,
  solvedPreview,
  isModal,
  onToggleModal,
}: {
  type: 'fix-the-bug' | 'complete-the-code';
  title: string;
  description: string;
  userCode: string;
  setUserCode: (code: string) => void;
  status: 'idle' | 'correct' | 'incorrect';
  setStatus: (s: 'idle' | 'correct' | 'incorrect') => void;
  hintIndex: number;
  setHintIndex: (n: number) => void;
  attempts: number;
  showSolution: boolean;
  shaking: boolean;
  hints: string[];
  handleCheck: () => void;
  handleHint: () => void;
  handleReset: () => void;
  handleShowSolution: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  buggyPreview?: ReactNode;
  solvedPreview?: ReactNode;
  isModal: boolean;
  onToggleModal: () => void;
}) {
  const lineCount = userCode.split('\n').length;
  const isLightMode = useIsLightMode();
  const hasPreview = !!(buggyPreview || solvedPreview);

  const typeBadgeStyle = {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 0,
    fontSize: '0.7rem',
    fontWeight: 600 as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    background: 'var(--color-accent-dim)',
    color: 'var(--color-accent)',
  };

  const borderColor =
    status === 'correct' ? 'var(--color-success)' :
    status === 'incorrect' ? 'var(--color-error)' :
    'var(--color-border)';

  const editorPanel = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, minWidth: 0 }}>
      {/* Code Editor Area */}
      <div style={{ position: 'relative', display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Line numbers */}
        <div style={{
          padding: '1rem 0',
          paddingRight: '0.5rem',
          paddingLeft: '0.75rem',
          background: 'var(--color-code-bg)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          lineHeight: 1.65,
          textAlign: 'right' as const,
          userSelect: 'none' as const,
          borderRight: '1px solid var(--color-border)',
          minWidth: '2.5rem',
          overflow: 'hidden',
        }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Highlighted editor: pre behind transparent textarea */}
        <div style={{ flex: 1, position: 'relative', minHeight: isModal ? 0 : '120px' }}>
          <Highlight
            theme={isLightMode ? themes.github : themes.nightOwl}
            code={userCode}
            language="tsx"
          >
            {({ tokens, getLineProps, getTokenProps }) => (
              <pre
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  margin: 0,
                  padding: '1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  lineHeight: 1.65,
                  background: 'var(--color-code-bg)',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  tabSize: 2,
                  whiteSpace: 'pre',
                }}
              >
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line });
                  return (
                    <div key={i} {...lineProps} style={{ ...lineProps.style, background: 'transparent' }}>
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token });
                        const types = token.types;
                        const isComment = types.includes('comment');
                        const isKeyword = types.includes('keyword') || types.includes('tag') || types.includes('builtin') || types.includes('operator') || types.includes('boolean') || types.includes('important');
                        const isFunction = types.includes('function') || types.includes('class-name');
                        const isPunctuation = types.includes('punctuation') || types.includes('plain');

                        if (isComment) {
                          tokenProps.style = { color: 'var(--color-code-comment)', fontStyle: 'italic', fontWeight: 400 };
                        } else if (isKeyword) {
                          tokenProps.style = { color: 'var(--color-code-keyword)', fontWeight: 700 };
                        } else if (isFunction) {
                          tokenProps.style = { color: 'var(--color-code-function)', fontWeight: 500 };
                        } else if (isPunctuation) {
                          tokenProps.style = { color: 'var(--color-code-comment)', fontWeight: 400 };
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
          <textarea
            ref={textareaRef}
            value={userCode}
            onChange={(e) => {
              setUserCode(e.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
            spellCheck={false}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              background: 'transparent',
              color: 'transparent',
              caretColor: isLightMode ? '#1a1c1a' : '#e8eae6',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              lineHeight: 1.65,
              padding: '1rem',
              border: 'none',
              outline: 'none',
              resize: 'none' as const,
              overflow: isModal ? 'auto' : 'hidden',
              minHeight: isModal ? 0 : '120px',
              tabSize: 2,
              whiteSpace: 'pre',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;
                const newCode = userCode.substring(0, start) + '  ' + userCode.substring(end);
                setUserCode(newCode);
                requestAnimationFrame(() => {
                  if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
                  }
                });
              }
            }}
            onScroll={(e) => {
              // Sync scroll between textarea and highlighted pre
              const pre = e.currentTarget.previousElementSibling as HTMLElement;
              if (pre) {
                pre.scrollTop = e.currentTarget.scrollTop;
                pre.scrollLeft = e.currentTarget.scrollLeft;
              }
            }}
          />
        </div>
      </div>

      {/* Feedback */}
      {status === 'correct' && (
        <div style={{
          padding: '0.5rem 1rem',
          background: 'rgba(74, 222, 128, 0.1)',
          color: 'var(--color-success)',
          fontSize: '0.85rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0,
        }}>
          <IconCheck size={12} /> {showSolution ? 'Solution revealed' : 'Correct! Well done.'}
        </div>
      )}
      {status === 'incorrect' && (
        <div style={{
          padding: '0.5rem 1rem',
          background: 'rgba(192, 96, 80, 0.1)',
          color: 'var(--color-error)',
          fontSize: '0.85rem',
          fontWeight: 500,
          flexShrink: 0,
        }}>
          Not quite — try again. {attempts >= 2 && hints.length > hintIndex && 'Try using a hint!'}
        </div>
      )}

      {/* Hints */}
      {hintIndex > 0 && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--color-bg-tertiary)',
          borderTop: '1px solid var(--color-border)',
          flexShrink: 0,
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-warning)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.4rem',
          }}>
            Hints
          </div>
          {hints.slice(0, hintIndex).map((hint, i) => (
            <div key={i} style={{
              fontSize: '0.78rem',
              color: 'var(--color-text-secondary)',
              padding: '0.2rem 0',
              paddingLeft: '1rem',
              borderLeft: '2px solid var(--color-warning)',
              marginBottom: '0.3rem',
            }}>
              {i + 1}. {hint}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const previewPanel = hasPreview ? (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      minWidth: 0,
      borderLeft: isModal ? '1px solid var(--color-border)' : undefined,
      borderTop: isModal ? undefined : '1px solid var(--color-border)',
    }}>
      <div style={{
        padding: '0.5rem 1rem',
        background: 'var(--color-bg-tertiary)',
        borderBottom: '1px solid var(--color-border)',
        fontSize: '0.7rem',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        color: status === 'correct' ? 'var(--color-success)' : 'var(--color-text-muted)',
        flexShrink: 0,
      }}>
        {status === 'correct' ? 'Preview — Fixed' : 'Preview — Current Behavior'}
      </div>
      <div style={{
        flex: 1,
        padding: '1rem',
        overflow: 'auto',
        background: 'var(--color-bg)',
      }}>
        {status === 'correct' && solvedPreview ? solvedPreview : (buggyPreview || solvedPreview)}
      </div>
    </div>
  ) : null;

  return (
    <div style={{
      border: isModal ? 'none' : `1px solid ${borderColor}`,
      borderRadius: isModal ? 0 : 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'border-color 0.3s ease',
      animation: shaking ? 'shake 0.4s ease-in-out' : undefined,
      display: 'flex',
      flexDirection: 'column' as const,
      height: isModal ? '100%' : undefined,
    }}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '0.75rem 1rem',
        background: 'var(--color-bg-tertiary)',
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        transition: 'border-color 0.3s ease',
        flexShrink: 0,
      }}>
        <span style={typeBadgeStyle}>
          {type === 'fix-the-bug' ? 'Fix the Bug' : 'Complete the Code'}
        </span>
        <span style={{
          fontWeight: 600,
          fontSize: '0.9rem',
          color: 'var(--color-text)',
          flex: 1,
        }}>
          {title}
        </span>
        {status === 'correct' && (
          <span style={{ color: 'var(--color-success)', fontSize: '1.1rem' }} title="Solved!"><IconCheck size={12} /></span>
        )}
        <button
          onClick={onToggleModal}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '0.15rem 0.35rem',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          title={isModal ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isModal ? <IconCollapse size={13} /> : <IconExpand size={13} />}
        </button>
      </div>

      {/* Description */}
      <div style={{
        padding: '0.75rem 1rem',
        fontSize: '0.85rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.6,
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
      }}>
        {description}
      </div>

      {/* Main content: editor + preview */}
      <div style={{
        display: 'flex',
        flexDirection: isModal ? 'row' as const : 'column' as const,
        flex: 1,
        minHeight: 0,
      }}>
        {editorPanel}
        {previewPanel}
      </div>

      {/* Button Row */}
      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap' as const,
        flexShrink: 0,
        background: 'var(--color-bg-tertiary)',
      }}>
        <button
          onClick={handleCheck}
          disabled={status === 'correct'}
          style={{
            padding: '0.4rem 1rem',
            background: status === 'correct' ? 'var(--color-bg-tertiary)' : 'var(--color-accent)',
            color: status === 'correct' ? 'var(--color-text-muted)' : '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: status === 'correct' ? 'default' : 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          Check
        </button>
        <button
          onClick={handleHint}
          disabled={hintIndex >= hints.length}
          style={{
            padding: '0.4rem 1rem',
            background: 'var(--color-bg-tertiary)',
            color: hintIndex >= hints.length ? 'var(--color-text-muted)' : 'var(--color-text)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            fontWeight: 500,
            cursor: hintIndex >= hints.length ? 'default' : 'pointer',
          }}
        >
          Hint {hintIndex > 0 ? `(${hintIndex}/${hints.length})` : ''}
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '0.4rem 1rem',
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
        {attempts >= 3 && status !== 'correct' && (
          <button
            onClick={handleShowSolution}
            style={{
              padding: '0.4rem 1rem',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            Show Solution
          </button>
        )}
      </div>
    </div>
  );
}

export function CodeExercise({
  id,
  title,
  type,
  description,
  initialCode,
  solution,
  validationPatterns,
  hints,
  buggyPreview,
  solvedPreview,
}: CodeExerciseProps) {
  const { saveExercise, getExercise } = useProgress();
  const savedData = getExercise(id);

  const [userCode, setUserCode] = useState(savedData?.userCode || initialCode);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(
    savedData?.solved ? 'correct' : 'idle'
  );
  const [hintIndex, setHintIndex] = useState(0);
  const [attempts, setAttempts] = useState(savedData?.attempts || 0);
  const [showSolution, setShowSolution] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save user code on change
  useEffect(() => {
    const timer = setTimeout(() => {
      saveExercise(id, {
        userCode,
        solved: status === 'correct',
        attempts,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [userCode, status, attempts, id, saveExercise]);

  // Auto-resize textarea (only when not in modal)
  useEffect(() => {
    if (!isModal && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [userCode, isModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isModal]);

  // Escape key closes modal
  useEffect(() => {
    if (!isModal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModal(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isModal]);

  const handleCheck = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (validate(userCode, validationPatterns)) {
      setStatus('correct');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
      saveExercise(id, { userCode, solved: true, attempts: newAttempts });
    } else {
      setStatus('incorrect');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      saveExercise(id, { userCode, solved: false, attempts: newAttempts });
    }
  };

  const handleReset = () => {
    setUserCode(initialCode);
    setStatus('idle');
    setHintIndex(0);
    setShowSolution(false);
  };

  const handleShowSolution = () => {
    setUserCode(solution);
    setShowSolution(true);
    setStatus('correct');
    saveExercise(id, { userCode: solution, solved: true, attempts });
  };

  const handleHint = () => {
    if (hintIndex < hints.length) {
      setHintIndex(hintIndex + 1);
    }
  };

  const sharedProps = {
    type,
    title,
    description,
    userCode,
    setUserCode,
    status,
    setStatus,
    hintIndex,
    setHintIndex,
    attempts,
    showSolution,
    shaking,
    hints,
    handleCheck,
    handleHint,
    handleReset,
    handleShowSolution,
    textareaRef,
    buggyPreview,
    solvedPreview,
  };

  // Modal view via portal
  if (isModal) {
    return (
      <>
        {/* Placeholder in the flow so the page doesn't jump */}
        <div style={{
          margin: '1.5rem 0',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.85rem',
          background: 'var(--color-bg-tertiary)',
        }}>
          Exercise open in fullscreen — <button
            onClick={() => setIsModal(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              textDecoration: 'underline',
            }}
          >close</button>
        </div>
        {createPortal(
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <ExerciseContent
              {...sharedProps}
              isModal={true}
              onToggleModal={() => setIsModal(false)}
            />
          </div>,
          document.body
        )}
      </>
    );
  }

  // Inline view
  return (
    <div style={{ margin: '1.5rem 0', position: 'relative' }}>
      {showConfetti && <Confetti />}
      <ExerciseContent
        {...sharedProps}
        isModal={false}
        onToggleModal={() => setIsModal(true)}
      />
    </div>
  );
}
