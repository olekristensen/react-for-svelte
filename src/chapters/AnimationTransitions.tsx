import { useState, useEffect, useRef, useCallback } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';
import { CodeComparison } from '../components/CodeComparison';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { ComparisonTable } from '../components/ComparisonTable';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { CodeExercise } from '../components/CodeExercise';

const h2Style = { marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.4rem' };
const h3Style = { marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' };
const pStyle = { marginBottom: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 };

// ---------------------------------------------------------------------------
// Demo Components
// ---------------------------------------------------------------------------

function CSSTransitionDemo() {
  const [visible, setVisible] = useState(true);
  const [variant, setVariant] = useState<'fade' | 'scale'>('fade');

  const fadeStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(-20px)',
    transition: 'all 0.4s ease',
    padding: '1.5rem',
    background: 'var(--color-accent)',
    color: '#fff',
    borderRadius: 0,
    fontWeight: 600,
    textAlign: 'center',
    marginTop: '1rem',
  };

  const scaleStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-10deg)',
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    padding: '1.5rem',
    background: 'var(--color-ecosystem)',
    color: '#fff',
    borderRadius: 0,
    fontWeight: 600,
    textAlign: 'center',
    marginTop: '1rem',
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setVisible(v => !v)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 0,
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
        <button
          onClick={() => setVariant(v => (v === 'fade' ? 'scale' : 'fade'))}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 0,
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Variant: {variant}
        </button>
      </div>
      <div style={variant === 'fade' ? fadeStyle : scaleStyle}>
        {variant === 'fade' ? 'Fade + Slide' : 'Scale + Rotate'}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

let notifId = 0;
interface Notification {
  id: number;
  text: string;
  exiting: boolean;
}

function EnterExitDemo() {
  const [items, setItems] = useState<Notification[]>([]);
  const messages = ['File saved', 'Message sent', 'Upload complete', 'Settings updated', 'Connection restored'];

  const addNotification = () => {
    const text = messages[notifId % messages.length];
    notifId++;
    setItems(prev => [...prev, { id: notifId, text, exiting: false }]);
  };

  const dismiss = (id: number) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, exiting: true } : item)));
  };

  const handleTransitionEnd = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div>
      <button
        onClick={addNotification}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: 0,
          border: '1px solid var(--color-border)',
          background: 'var(--color-success)',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Add Notification
      </button>
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map(item => (
          <div
            key={item.id}
            onTransitionEnd={() => {
              if (item.exiting) handleTransitionEnd(item.id);
            }}
            style={{
              opacity: item.exiting ? 0 : 1,
              transform: item.exiting ? 'translateX(60px)' : 'translateX(0)',
              transition: 'all 0.35s ease',
              padding: '0.75rem 1rem',
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.9rem',
              color: 'var(--color-text)',
            }}
          >
            <span>{item.text}</span>
            <button
              onClick={() => dismiss(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0 0.25rem',
              }}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

const COLORS = ['var(--color-accent)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-ecosystem)', '#f472b6', '#a78bfa'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let listItemId = 6;

function ListAnimationDemo() {
  interface ListItem {
    id: number;
    color: string;
    entering: boolean;
    exiting: boolean;
  }

  const [items, setItems] = useState<ListItem[]>(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      color: COLORS[i % COLORS.length],
      entering: false,
      exiting: false,
    }))
  );

  // Refs to store DOM positions for FLIP animation
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const prevPositions = useRef<Record<number, { x: number; y: number }>>({});

  // Capture positions before update
  const capturePositions = () => {
    const positions: Record<number, { x: number; y: number }> = {};
    for (const [id, el] of Object.entries(itemRefs.current)) {
      if (el) {
        const rect = el.getBoundingClientRect();
        positions[Number(id)] = { x: rect.left, y: rect.top };
      }
    }
    prevPositions.current = positions;
  };

  // Animate from old positions to new positions (FLIP)
  useEffect(() => {
    const prev = prevPositions.current;
    if (Object.keys(prev).length === 0) return;

    for (const [id, el] of Object.entries(itemRefs.current)) {
      if (!el) continue;
      const numId = Number(id);
      const oldPos = prev[numId];
      if (!oldPos) continue;

      const newRect = el.getBoundingClientRect();
      const dx = oldPos.x - newRect.left;
      const dy = oldPos.y - newRect.top;

      if (dx === 0 && dy === 0) continue;

      // Invert: move to old position instantly
      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px)`;

      // Play: animate back to new position
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
          el.style.transform = 'translate(0, 0)';
        });
      });
    }

    prevPositions.current = {};
  });

  const addItem = () => {
    capturePositions();
    listItemId++;
    const newItem: ListItem = {
      id: listItemId,
      color: COLORS[listItemId % COLORS.length],
      entering: true,
      exiting: false,
    };
    setItems(prev => [...prev, newItem]);
    // Clear entering flag after animation
    setTimeout(() => {
      setItems(prev => prev.map(it => it.id === newItem.id ? { ...it, entering: false } : it));
    }, 50);
  };

  const removeItem = () => {
    if (items.length <= 1) return;
    const target = items[items.length - 1];
    // Mark as exiting
    setItems(prev => prev.map(it => it.id === target.id ? { ...it, exiting: true } : it));
    // Remove after animation
    setTimeout(() => {
      capturePositions();
      setItems(prev => prev.filter(it => it.id !== target.id));
    }, 300);
  };

  const shuffleItems = () => {
    capturePositions();
    setItems(prev => shuffle(prev));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={shuffleItems} style={btnStyle}>Shuffle</button>
        <button onClick={addItem} style={btnStyle}>Add</button>
        <button onClick={removeItem} style={btnStyle}>Remove</button>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', position: 'relative' }}>
        {items.map(item => (
          <div
            key={item.id}
            ref={el => { itemRefs.current[item.id] = el; }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 0,
              background: item.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              opacity: item.exiting ? 0 : item.entering ? 0 : 1,
              transform: item.exiting ? 'scale(0.5)' : item.entering ? 'scale(0.5)' : undefined,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            {item.id}
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '0.4rem 0.85rem',
  borderRadius: 0,
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-secondary)',
  color: 'var(--color-text)',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 600,
};

// ---------------------------------------------------------------------------

function ScrollFadeDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = Number((entry.target as HTMLElement).dataset.id);
          if (entry.isIntersecting) {
            setVisible(prev => ({ ...prev, [id]: true }));
          }
        });
      },
      { root: container, threshold: 0.3 }
    );

    const cards = container.querySelectorAll('[data-id]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const resetScroll = () => {
    setVisible({});
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const cardItems = [
    { id: 1, title: 'First Card', color: 'var(--color-accent)' },
    { id: 2, title: 'Second Card', color: 'var(--color-success)' },
    { id: 3, title: 'Third Card', color: 'var(--color-warning)' },
    { id: 4, title: 'Fourth Card', color: 'var(--color-ecosystem)' },
  ];

  return (
    <div>
      <button onClick={resetScroll} style={{ ...btnStyle, marginBottom: '0.75rem' }}>
        Reset &amp; Scroll Again
      </button>
      <div
        ref={containerRef}
        style={{
          maxHeight: 220,
          overflowY: 'auto',
          border: '1px solid var(--color-border)',
          borderRadius: 0,
          padding: '1rem',
        }}
      >
        {cardItems.map(card => (
          <div
            key={card.id}
            data-id={card.id}
            style={{
              opacity: visible[card.id] ? 1 : 0,
              transform: visible[card.id] ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.5s ease',
              padding: '1.25rem',
              marginBottom: '1rem',
              background: card.color,
              borderRadius: 0,
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            {card.title} -- scroll to reveal
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function DragDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 60, y: 40 });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    offsetRef.current = {
      x: e.clientX - rect.left - pos.x,
      y: e.clientY - rect.top - pos.y,
    };
    setDragging(true);
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const newX = Math.max(0, Math.min(rect.width - 60, e.clientX - rect.left - offsetRef.current.x));
      const newY = Math.max(0, Math.min(rect.height - 60, e.clientY - rect.top - offsetRef.current.y));
      setPos({ x: newX, y: newY });
    };

    const handleUp = () => setDragging(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: 200,
        border: '2px dashed var(--color-border)',
        borderRadius: 0,
        overflow: 'hidden',
        cursor: dragging ? 'grabbing' : 'default',
        touchAction: 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'var(--color-text-secondary)',
        fontSize: '0.8rem',
        opacity: 0.5,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        Drag the box around
      </div>
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: 60,
          height: 60,
          borderRadius: 0,
          background: dragging ? 'var(--color-warning)' : 'var(--color-accent)',
          cursor: dragging ? 'grabbing' : 'grab',
          transition: dragging ? 'none' : 'background 0.2s ease, transform 0.2s ease',
          transform: hovered && !dragging ? 'scale(1.1)' : 'scale(1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.75rem',
          userSelect: 'none',
          boxShadow: dragging ? '0 8px 24px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {dragging ? 'Drop' : 'Drag'}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function SpringDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState({ x: 120, y: 80 });
  const currentRef = useRef({ x: 120, y: 80 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const [rendered, setRendered] = useState({ x: 120, y: 80 });
  const [stiffness, setStiffness] = useState(0.08);
  const [damping, setDamping] = useState(0.78);
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const cur = currentRef.current;
    const vel = velocityRef.current;

    vel.x += (target.x - cur.x) * stiffness;
    vel.y += (target.y - cur.y) * stiffness;
    vel.x *= damping;
    vel.y *= damping;
    cur.x += vel.x;
    cur.y += vel.y;

    setRendered({ x: cur.x, y: cur.y });

    if (Math.abs(vel.x) > 0.01 || Math.abs(vel.y) > 0.01 || Math.abs(target.x - cur.x) > 0.1 || Math.abs(target.y - cur.y) > 0.1) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [target, stiffness, damping]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTarget({ x: e.clientX - rect.left - 16, y: e.clientY - rect.top - 16 });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Stiffness
          <input
            type="range"
            min="0.01"
            max="0.2"
            step="0.01"
            value={stiffness}
            onChange={e => setStiffness(Number(e.target.value))}
            style={{ width: 100 }}
          />
          <span style={{ fontFamily: 'monospace', minWidth: 36 }}>{stiffness.toFixed(2)}</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Damping
          <input
            type="range"
            min="0.5"
            max="0.98"
            step="0.01"
            value={damping}
            onChange={e => setDamping(Number(e.target.value))}
            style={{ width: 100 }}
          />
          <span style={{ fontFamily: 'monospace', minWidth: 36 }}>{damping.toFixed(2)}</span>
        </label>
      </div>
      <div
        ref={containerRef}
        onClick={handleClick}
        style={{
          position: 'relative',
          height: 200,
          border: '2px dashed var(--color-border)',
          borderRadius: 0,
          cursor: 'crosshair',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'var(--color-text-secondary)',
          fontSize: '0.8rem',
          opacity: 0.5,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          Click anywhere to set target
        </div>
        {/* Target marker */}
        <div style={{
          position: 'absolute',
          left: target.x + 8,
          top: target.y + 8,
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '2px solid var(--color-text-secondary)',
          opacity: 0.3,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />
        {/* Spring circle */}
        <div style={{
          position: 'absolute',
          left: rendered.x,
          top: rendered.y,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'var(--color-ecosystem)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

// ===========================================================================
// Main Chapter Component
// ===========================================================================

export default function AnimationTransitions() {
  return (
    <ChapterLayout id="animation-transitions">
      {/* ===== Opening ===== */}
      <p style={pStyle}>
        Svelte ships with a batteries-included animation story: <code>transition:fade</code>,{' '}
        <code>transition:fly</code>, <code>animate:flip</code>, and the <code>spring()</code> and{' '}
        <code>tweened()</code> stores from <code>svelte/motion</code>. You add a directive, and
        things move. React has exactly zero built-in animation primitives. This is not an oversight
        -- it is a deliberate design choice. React manages state and rendering; how you animate the
        resulting DOM is up to you. That freedom means more choices, but also more power. This
        chapter covers the full spectrum: from CSS transitions (the simplest approach) through
        manual spring physics to the Framer Motion and React Spring libraries that give you
        capabilities Svelte cannot match out of the box.
      </p>

      {/* ===== CSS Transitions — The Foundation ===== */}
      <h2 style={h2Style}>CSS Transitions -- The Foundation</h2>
      <p style={pStyle}>
        The simplest way to animate in React is the same as in plain HTML: use the CSS{' '}
        <code>transition</code> property. You change a style value via state, and the browser
        handles the interpolation. No libraries, no extra dependencies, no bundle cost.
      </p>

      <h3 style={h3Style}>Svelte transition:fade vs React CSS transition</h3>
      <p style={pStyle}>
        In Svelte, you attach <code>transition:fade</code> to an element and the compiler generates
        the enter/exit animation for you. In React, you achieve the same visual result by binding
        style properties to state and letting CSS transitions handle the interpolation.
      </p>

      <CodeComparison
        svelte={{
          code: `<script>
  import { fade } from 'svelte/transition';
  let visible = $state(true);
</script>

<button onclick={() => visible = !visible}>
  Toggle
</button>

{#if visible}
  <div transition:fade={{ duration: 400 }}>
    Hello, animation!
  </div>
{/if}`,
          filename: 'FadeExample.svelte',
        }}
        react={{
          code: `function FadeExample() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <button onClick={() => setVisible(v => !v)}>
        Toggle
      </button>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0)'
          : 'translateY(-20px)',
        transition: 'all 0.4s ease',
      }}>
        Hello, animation!
      </div>
    </>
  );
}`,
          filename: 'FadeExample.tsx',
        }}
        note="Svelte uses a directive; React uses state-driven inline styles with CSS transitions."
      />

      <InteractiveDemo title="CSS Transition Demo" code={`function CSSTransitionDemo() {
  const [visible, setVisible] = useState(true);
  const [variant, setVariant] = useState('fade');

  const fadeStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(-20px)',
    transition: 'all 0.4s ease',
    padding: '1.5rem',
    background: 'var(--color-accent)',
    borderRadius: 0,
  };

  const scaleStyle = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'scale(1) rotate(0deg)'
      : 'scale(0.5) rotate(-10deg)',
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    padding: '1.5rem',
    background: 'var(--color-ecosystem)',
    borderRadius: 0,
  };

  return (
    <div>
      <button onClick={() => setVisible(v => !v)}>
        {visible ? 'Hide' : 'Show'}
      </button>
      <button onClick={() => setVariant(v =>
        v === 'fade' ? 'scale' : 'fade'
      )}>
        Variant: {variant}
      </button>
      <div style={variant === 'fade' ? fadeStyle : scaleStyle}>
        {variant === 'fade' ? 'Fade + Slide' : 'Scale + Rotate'}
      </div>
    </div>
  );
}`}>
        <CSSTransitionDemo />
      </InteractiveDemo>

      <h3 style={h3Style}>The className toggling pattern</h3>
      <p style={pStyle}>
        Instead of inline styles, you can toggle CSS classes. This is useful when you want to keep
        your animation definitions in a stylesheet or CSS module, keeping your component code cleaner.
      </p>

      <CodeBlock
        language="tsx"
        filename="ClassNameToggle.tsx"
        code={`// Component toggles a className based on state
function SlidePanel({ open }: { open: boolean }) {
  return (
    <div
      className={\`panel \${open ? 'panel--open' : ''}\`}
      style={{
        // Fallback inline transition if no CSS file
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        width: '300px',
        height: '100vh',
      }}
    >
      Panel content
    </div>
  );
}

/* In your CSS module or stylesheet:
.panel {
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
.panel--open {
  transform: translateX(0);
}
*/`}
      />

      <Callout type="insight">
        CSS transitions handle roughly 80% of animation needs in a typical application. Before
        reaching for a library, ask yourself: can I achieve this by transitioning a CSS property
        driven by React state? If yes, you are done.
      </Callout>

      {/* ===== Enter/Exit Animations ===== */}
      <h2 style={h2Style}>Enter/Exit Animations</h2>
      <p style={pStyle}>
        Here is where things diverge sharply from Svelte. CSS transitions only work while an element
        is in the DOM. When you conditionally render with <code>{'{#if}'}</code> in Svelte and attach{' '}
        <code>transition:fade</code>, Svelte delays removing the element until the exit animation
        finishes. React does not do this -- when state says "unmount", the element is gone immediately.
      </p>
      <p style={pStyle}>
        You have two strategies: keep the element mounted and animate it to "invisible", or delay
        unmounting until the exit animation completes. The first approach is simpler (what we did
        above -- the element is always in the DOM, just transparent). The second is necessary when
        you truly need to remove elements, such as in notification lists or route transitions.
      </p>

      <h3 style={h3Style}>Framer Motion's AnimatePresence (the standard solution)</h3>

      <CodeComparison
        svelte={{
          code: `<script>
  import { fly } from 'svelte/transition';
  let visible = $state(true);
</script>

<button onclick={() => visible = !visible}>
  Toggle
</button>

{#if visible}
  <div transition:fly={{ y: -20, duration: 300 }}>
    I animate in AND out!
  </div>
{/if}`,
          filename: 'EnterExit.svelte',
        }}
        react={{
          code: `import { AnimatePresence, motion } from 'framer-motion';

function EnterExit() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <button onClick={() => setVisible(v => !v)}>
        Toggle
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            I animate in AND out!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}`,
          filename: 'EnterExit.tsx',
        }}
        note="Svelte handles exit animations automatically. React needs AnimatePresence to delay unmount."
      />

      <h3 style={h3Style}>The manual approach: delay unmount with onTransitionEnd</h3>
      <p style={pStyle}>
        Without Framer Motion, you can build enter/exit yourself: set an "exiting" flag, wait for
        the CSS transition to finish via <code>onTransitionEnd</code>, then remove the element from
        state. This demo shows the pattern with a notification list.
      </p>

      <InteractiveDemo title="Enter/Exit with onTransitionEnd" code={`function EnterExitDemo() {
  const [items, setItems] = useState([]);
  let id = 0;

  const addNotification = () => {
    id++;
    setItems(prev => [...prev,
      { id, text: 'Notification', exiting: false }
    ]);
  };

  const dismiss = (id) => {
    // Step 1: Mark as exiting (triggers CSS transition)
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, exiting: true }
        : item
    ));
  };

  const handleTransitionEnd = (id) => {
    // Step 2: Remove from DOM after animation
    setItems(prev => prev.filter(item =>
      item.id !== id
    ));
  };

  return (
    <div>
      <button onClick={addNotification}>
        Add Notification
      </button>
      {items.map(item => (
        <div
          key={item.id}
          onTransitionEnd={() => {
            if (item.exiting)
              handleTransitionEnd(item.id);
          }}
          style={{
            opacity: item.exiting ? 0 : 1,
            transform: item.exiting
              ? 'translateX(60px)'
              : 'translateX(0)',
            transition: 'all 0.35s ease',
          }}
        >
          {item.text}
          <button onClick={() => dismiss(item.id)}>
            x
          </button>
        </div>
      ))}
    </div>
  );
}`}>
        <EnterExitDemo />
      </InteractiveDemo>

      <Callout type="gotcha">
        In Svelte, exit animations are free. Add <code>transition:fade</code> and the element
        animates out before removal. In React, you must keep elements mounted during their exit
        animation -- that is exactly what Framer Motion's <code>AnimatePresence</code> automates.
        The manual <code>onTransitionEnd</code> pattern works but gets unwieldy with complex
        animations.
      </Callout>

      {/* ===== List Animations ===== */}
      <h2 style={h2Style}>List Animations</h2>
      <p style={pStyle}>
        Animating list reorders is one of the trickiest problems in UI animation. When items change
        position, you need to calculate where each element was, where it is now, and animate between
        the two. Svelte solves this with the built-in <code>animate:flip</code> directive. React has
        no equivalent -- you either implement the FLIP technique manually or reach for Framer
        Motion's <code>layout</code> prop.
      </p>

      <h3 style={h3Style}>Svelte animate:flip vs Framer Motion layout</h3>

      <CodeComparison
        svelte={{
          code: `<script>
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
  let items = $state([
    { id: 1, text: 'Apple' },
    { id: 2, text: 'Banana' },
    { id: 3, text: 'Cherry' },
  ]);

  function shuffleItems() {
    items = items.sort(() => Math.random() - 0.5);
  }
</script>

<button onclick={shuffleItems}>Shuffle</button>

{#each items as item (item.id)}
  <div
    animate:flip={{ duration: 300 }}
    transition:fade
  >
    {item.text}
  </div>
{/each}`,
          filename: 'ListAnim.svelte',
        }}
        react={{
          code: `import { motion, AnimatePresence } from 'framer-motion';

function ListAnim() {
  const [items, setItems] = useState([
    { id: 1, text: 'Apple' },
    { id: 2, text: 'Banana' },
    { id: 3, text: 'Cherry' },
  ]);

  const shuffleItems = () => {
    setItems(prev =>
      [...prev].sort(() => Math.random() - 0.5)
    );
  };

  return (
    <>
      <button onClick={shuffleItems}>
        Shuffle
      </button>
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}`,
          filename: 'ListAnim.tsx',
        }}
        note="Svelte's animate:flip is FLIP built-in. Framer Motion's layout prop does the same with one word."
      />

      <InteractiveDemo title="List Animation Demo" code={`function ListAnimationDemo() {
  const [items, setItems] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      color: COLORS[i % COLORS.length],
    }))
  );

  return (
    <div>
      <button onClick={() =>
        setItems(shuffle(items))
      }>Shuffle</button>
      <button onClick={addItem}>Add</button>
      <button onClick={removeItem}>Remove</button>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              width: 48, height: 48,
              borderRadius: 0,
              background: item.color,
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {item.id}
          </div>
        ))}
      </div>
    </div>
  );
}`}>
        <ListAnimationDemo />
      </InteractiveDemo>

      <Callout type="insight">
        Svelte's <code>animate:flip</code> implements the FLIP technique (First, Last, Invert, Play)
        built into the framework. In React, Framer Motion's <code>layout</code> prop uses the same
        algorithm under the hood. Without a library, achieving smooth positional animations on
        reorder requires measuring DOM positions with <code>getBoundingClientRect</code> before and
        after the update -- doable, but tedious.
      </Callout>

      {/* ===== Scroll-Triggered Animations ===== */}
      <h2 style={h2Style}>Scroll-Triggered Animations</h2>
      <p style={pStyle}>
        Revealing content as the user scrolls is a common animation pattern. The modern approach
        uses the <code>IntersectionObserver</code> API to detect when elements enter the viewport,
        then applies CSS transitions. No library needed.
      </p>

      <h3 style={h3Style}>IntersectionObserver + CSS Transitions</h3>
      <p style={pStyle}>
        The pattern is straightforward: create an observer, watch each element, set a "visible"
        state when it intersects, and use that state to drive CSS transitions. The demo below uses
        a scrollable container so you can see it work without scrolling the whole page.
      </p>

      <InteractiveDemo title="Scroll-Triggered Fade In" code={`function ScrollFadeDemo() {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.dataset.id;
          if (entry.isIntersecting) {
            setVisible(prev => ({
              ...prev, [id]: true
            }));
          }
        });
      },
      { root: containerRef.current, threshold: 0.3 }
    );

    containerRef.current
      .querySelectorAll('[data-id]')
      .forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}
      style={{ maxHeight: 220, overflowY: 'auto' }}>
      {cards.map(card => (
        <div
          key={card.id}
          data-id={card.id}
          style={{
            opacity: visible[card.id] ? 1 : 0,
            transform: visible[card.id]
              ? 'translateY(0)'
              : 'translateY(30px)',
            transition: 'all 0.5s ease',
          }}
        >
          {card.title}
        </div>
      ))}
    </div>
  );
}`}>
        <ScrollFadeDemo />
      </InteractiveDemo>

      <h3 style={h3Style}>Framer Motion whileInView</h3>
      <p style={pStyle}>
        Framer Motion wraps IntersectionObserver in a declarative API. The <code>whileInView</code>{' '}
        prop triggers animations when elements scroll into view.
      </p>

      <CodeBlock
        language="tsx"
        filename="ScrollReveal.tsx"
        code={`import { motion } from 'framer-motion';

function ScrollReveal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      I fade in when you scroll to me!
    </motion.div>
  );
}`}
      />

      {/* ===== Gesture Animations ===== */}
      <h2 style={h2Style}>Gesture Animations</h2>
      <p style={pStyle}>
        Both Svelte and React require manual work for gesture-driven animations like dragging,
        hovering, and pressing. Svelte uses actions (<code>use:draggable</code>); React uses event
        handlers or Framer Motion's gesture props. The concepts are similar, but Framer Motion
        provides a remarkably concise API.
      </p>

      <h3 style={h3Style}>Svelte action vs Framer Motion gesture props</h3>

      <CodeComparison
        svelte={{
          code: `<script>
  // Custom Svelte action for dragging
  function draggable(node) {
    let x = 0, y = 0;
    let startX, startY;

    function handleMouseDown(e) {
      startX = e.clientX - x;
      startY = e.clientY - y;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(e) {
      x = e.clientX - startX;
      y = e.clientY - startY;
      node.style.transform = \`translate(\${x}px, \${y}px)\`;
    }

    function handleMouseUp() {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    node.addEventListener('mousedown', handleMouseDown);
    return {
      destroy() {
        node.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }
</script>

<div use:draggable>Drag me</div>`,
          filename: 'Draggable.svelte',
        }}
        react={{
          code: `import { motion } from 'framer-motion';

// Framer Motion: one prop
function Draggable() {
  return (
    <motion.div
      drag
      dragConstraints={{
        top: 0, left: 0,
        right: 200, bottom: 200,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      whileDrag={{ scale: 1.1 }}
    >
      Drag me
    </motion.div>
  );
}`,
          filename: 'Draggable.tsx',
        }}
        note="Svelte needs a custom action (20+ lines). Framer Motion does it in one prop."
      />

      <InteractiveDemo title="Drag & Hover Demo (Pure CSS + JS)" code={`function DragDemo() {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 60, y: 40 });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left - pos.x,
      y: e.clientY - rect.top - pos.y,
    };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      setPos({
        x: Math.max(0, Math.min(rect.width - 60,
          e.clientX - rect.left - offsetRef.current.x)),
        y: Math.max(0, Math.min(rect.height - 60,
          e.clientY - rect.top - offsetRef.current.y)),
      });
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging]);

  return (
    <div ref={containerRef} style={{
      position: 'relative', height: 200,
      border: '2px dashed var(--color-border)',
    }}>
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'absolute',
          left: pos.x, top: pos.y,
          width: 60, height: 60,
          borderRadius: 0,
          background: dragging
            ? 'var(--color-warning)'
            : 'var(--color-accent)',
          cursor: dragging ? 'grabbing' : 'grab',
          transition: dragging
            ? 'none'
            : 'background 0.2s, transform 0.2s',
          transform: hovered && !dragging
            ? 'scale(1.1)' : 'scale(1)',
        }}
      />
    </div>
  );
}`}>
        <DragDemo />
      </InteractiveDemo>

      <h3 style={h3Style}>Framer Motion gesture props</h3>
      <p style={pStyle}>
        Compare the manual drag implementation above with Framer Motion's declarative API. The
        library handles all the pointer tracking, boundary enforcement, and physics for you.
      </p>

      <CodeBlock
        language="tsx"
        filename="GestureProps.tsx"
        code={`import { motion } from 'framer-motion';

function GestureExample() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {/* Hover + tap animations */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#60a5fa' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        Press me
      </motion.button>

      {/* Draggable with spring return */}
      <motion.div
        drag
        dragSnapToOrigin
        dragElastic={0.2}
        whileDrag={{ scale: 1.1, rotate: 5 }}
        style={{
          width: 80, height: 80,
          borderRadius: 12,
          background: '#4ade80',
          cursor: 'grab',
        }}
      />
    </div>
  );
}`}
      />

      {/* ===== Spring Physics ===== */}
      <h2 style={h2Style}>Spring Physics</h2>
      <p style={pStyle}>
        Linear easing feels mechanical. Spring physics produce motion that feels natural -- objects
        overshoot, settle, and bounce like real-world objects. Svelte provides <code>spring()</code>{' '}
        from <code>svelte/motion</code>. React Spring and Framer Motion both offer spring-based
        animation, or you can roll your own with <code>requestAnimationFrame</code>.
      </p>

      <h3 style={h3Style}>Svelte spring() vs React Spring useSpring</h3>

      <CodeComparison
        svelte={{
          code: `<script>
  import { spring } from 'svelte/motion';

  let coords = spring(
    { x: 0, y: 0 },
    { stiffness: 0.1, damping: 0.25 }
  );

  function handleMouseMove(e) {
    coords.set({ x: e.clientX, y: e.clientY });
  }
</script>

<svelte:window onmousemove={handleMouseMove} />

<div style="
  transform: translate({$coords.x}px, {$coords.y}px);
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #4ade80;
" />`,
          filename: 'SpringCircle.svelte',
        }}
        react={{
          code: `import { useSpring, animated } from '@react-spring/web';

function SpringCircle() {
  const [{ x, y }, api] = useSpring(() => ({
    x: 0, y: 0,
    config: { tension: 120, friction: 14 },
  }));

  const handleMouseMove = (e) => {
    api.start({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <animated.div
        style={{
          transform: x.to((xVal) =>
            \`translate(\${xVal}px, \${y.get()}px)\`
          ),
          width: 32, height: 32,
          borderRadius: '50%',
          background: '#4ade80',
        }}
      />
    </div>
  );
}`,
          filename: 'SpringCircle.tsx',
        }}
        note="Both use spring physics with stiffness/damping. The APIs are remarkably similar."
      />

      <h3 style={h3Style}>Manual spring with requestAnimationFrame</h3>
      <p style={pStyle}>
        You do not need a library for spring physics. The core algorithm is simple: apply a force
        toward the target proportional to stiffness, then multiply velocity by a damping factor.
        Run this in a <code>requestAnimationFrame</code> loop and you have a spring.
      </p>

      <InteractiveDemo title="Spring Physics (Pure JS)" code={`function SpringDemo() {
  const [target, setTarget] = useState({ x: 120, y: 80 });
  const currentRef = useRef({ x: 120, y: 80 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const [rendered, setRendered] = useState({ x: 120, y: 80 });
  const [stiffness, setStiffness] = useState(0.08);
  const [damping, setDamping] = useState(0.78);

  const animate = useCallback(() => {
    const cur = currentRef.current;
    const vel = velocityRef.current;
    // Spring equation
    vel.x += (target.x - cur.x) * stiffness;
    vel.y += (target.y - cur.y) * stiffness;
    vel.x *= damping;
    vel.y *= damping;
    cur.x += vel.x;
    cur.y += vel.y;
    setRendered({ x: cur.x, y: cur.y });

    if (Math.abs(vel.x) > 0.01 || Math.abs(vel.y) > 0.01) {
      requestAnimationFrame(animate);
    }
  }, [target, stiffness, damping]);

  useEffect(() => {
    requestAnimationFrame(animate);
  }, [animate]);

  return (
    <div onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTarget({
        x: e.clientX - rect.left - 16,
        y: e.clientY - rect.top - 16,
      });
    }}>
      {/* Sliders for stiffness and damping */}
      {/* Spring circle at rendered.x, rendered.y */}
    </div>
  );
}`}>
        <SpringDemo />
      </InteractiveDemo>

      <Callout type="info">
        If you love Svelte's <code>spring()</code> from <code>svelte/motion</code>, React Spring
        gives you the same physics-based approach with a very similar mental model. The configuration
        parameters map almost directly: Svelte's stiffness/damping correspond to React Spring's
        tension/friction.
      </Callout>

      <h3 style={h3Style}>React Spring examples</h3>
      <p style={pStyle}>
        React Spring provides hooks that feel natural to React developers. The <code>useSpring</code>{' '}
        hook animates values, while <code>useTransition</code> handles enter/exit animations for
        lists and conditional elements.
      </p>

      <CodeBlock
        language="tsx"
        filename="ReactSpringExamples.tsx"
        code={`import { useSpring, useTransition, animated } from '@react-spring/web';

// Simple spring animation
function ToggleBox() {
  const [open, setOpen] = useState(false);
  const styles = useSpring({
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0px)' : 'translateY(-40px)',
    config: { tension: 200, friction: 20 },
  });

  return (
    <>
      <button onClick={() => setOpen(o => !o)}>Toggle</button>
      <animated.div style={styles}>
        Spring-animated content
      </animated.div>
    </>
  );
}

// List enter/exit transitions
function NotificationList({ items }) {
  const transitions = useTransition(items, {
    from: { opacity: 0, transform: 'translateX(100%)' },
    enter: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: 'translateX(100%)' },
    config: { tension: 220, friction: 24 },
  });

  return transitions((style, item) => (
    <animated.div style={style}>
      {item.text}
    </animated.div>
  ));
}`}
      />

      {/* ===== Layout Animations ===== */}
      <h2 style={h2Style}>Layout Animations</h2>
      <p style={pStyle}>
        Layout animations are perhaps Framer Motion's most impressive feature. When an element
        changes size or position in the document flow -- due to content changes, sibling additions,
        or container resizing -- Framer Motion automatically detects the change and animates the
        transition. Svelte has no built-in equivalent for this.
      </p>

      <CodeBlock
        language="tsx"
        filename="LayoutAnimation.tsx"
        code={`import { motion } from 'framer-motion';

// Elements automatically animate when layout changes
function ExpandableCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setExpanded(e => !e)}
      style={{
        width: expanded ? 300 : 150,
        height: expanded ? 200 : 80,
        borderRadius: 12,
        background: '#60a5fa',
        cursor: 'pointer',
      }}
    >
      <motion.h3 layout="position">
        Click to {expanded ? 'collapse' : 'expand'}
      </motion.h3>
    </motion.div>
  );
}

// Shared layout: elements animate between different positions
function TabContent({ activeTab }) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setActive(tab.id)}>
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-indicator"
              style={{
                height: 3,
                background: '#4ade80',
                borderRadius: 2,
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}`}
      />

      <Callout type="insight">
        Framer Motion's layout animations have no Svelte equivalent. Elements automatically animate
        when they change size or position in the DOM. The <code>layoutId</code> prop even lets
        elements animate seamlessly between completely different parts of the component tree -- a
        feature unique to Framer Motion in the React ecosystem.
      </Callout>

      {/* ===== Page Transitions ===== */}
      <h2 style={h2Style}>Page Transitions</h2>
      <p style={pStyle}>
        Page transitions animate the switch between routes. In SvelteKit, you can use the View
        Transitions API or custom transitions at the layout level. In React, Framer Motion combined
        with React Router provides the most polished solution.
      </p>

      <CodeBlock
        language="tsx"
        filename="PageTransitions.tsx"
        code={`import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, Routes, Route } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <AboutPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}`}
      />

      <Callout type="info">
        SvelteKit page transitions leverage the View Transitions API natively. In React, you have
        two options: Framer Motion's <code>AnimatePresence</code> (the battle-tested choice) or the
        experimental View Transitions API (supported in Chrome, coming to other browsers). Next.js
        is adding built-in View Transition support.
      </Callout>

      {/* ===== Orchestrated Animations ===== */}
      <h2 style={h2Style}>Orchestrated Animations</h2>
      <p style={pStyle}>
        Sometimes you need multiple elements to animate in sequence or with staggered timing.
        Svelte handles this with the <code>delay</code> parameter on transitions. Framer Motion
        provides a more powerful orchestration system through variants.
      </p>

      <h3 style={h3Style}>Staggered children with variants</h3>

      <CodeBlock
        language="tsx"
        filename="StaggeredList.tsx"
        code={`import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function StaggeredList({ items }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.text}
        </motion.li>
      ))}
    </motion.ul>
  );
}`}
      />

      <h3 style={h3Style}>Timeline-style sequences</h3>
      <p style={pStyle}>
        For complex multi-step animations, Framer Motion's <code>animate</code> function
        (imperative API) lets you build sequences with async/await. Svelte's equivalent would
        require chaining multiple transitions with calculated delays.
      </p>

      <CodeBlock
        language="tsx"
        filename="AnimationSequence.tsx"
        code={`import { useAnimate } from 'framer-motion';

function SequenceExample() {
  const [scope, animate] = useAnimate();

  async function runSequence() {
    // Step 1: Fade in the title
    await animate('.title', { opacity: 1, y: 0 }, { duration: 0.4 });
    // Step 2: Slide in the description
    await animate('.desc', { opacity: 1, x: 0 }, { duration: 0.3 });
    // Step 3: Scale up the button
    await animate('.cta', { scale: 1 }, {
      type: 'spring', stiffness: 300,
    });
  }

  return (
    <div ref={scope}>
      <h2 className="title" style={{ opacity: 0, y: -20 }}>
        Welcome
      </h2>
      <p className="desc" style={{ opacity: 0, x: -30 }}>
        Check out our product
      </p>
      <button className="cta" style={{ scale: 0 }}
        onClick={runSequence}
      >
        Get Started
      </button>
    </div>
  );
}`}
      />

      <CodeComparison
        svelte={{
          code: `<script>
  import { fade, fly, scale } from 'svelte/transition';
  let show = $state(false);
</script>

<button onclick={() => show = true}>
  Start Sequence
</button>

{#if show}
  <!-- Stagger with delay parameter -->
  <h2 transition:fly={{ y: -20, delay: 0 }}>
    Welcome
  </h2>
  <p transition:fly={{ x: -30, delay: 400 }}>
    Check out our product
  </p>
  <button transition:scale={{ delay: 700 }}>
    Get Started
  </button>
{/if}`,
          filename: 'Sequence.svelte',
        }}
        react={{
          code: `// Framer Motion variants handle this declaratively
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Sequence() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={item}>Welcome</motion.h2>
      <motion.p variants={item}>
        Check out our product
      </motion.p>
      <motion.button variants={item}>
        Get Started
      </motion.button>
    </motion.div>
  );
}`,
          filename: 'Sequence.tsx',
        }}
        note="Svelte uses delay offsets. Framer Motion uses staggerChildren for automatic sequencing."
      />

      {/* ===== Comprehensive Comparison Table ===== */}
      <h2 style={h2Style}>Animation Approaches Compared</h2>
      <p style={pStyle}>
        Each animation approach has trade-offs. CSS transitions are free but limited. Framer Motion
        is powerful but adds bundle weight. Here is how they stack up across every common animation
        need.
      </p>

      <ComparisonTable
        headers={['Feature', 'Svelte Built-in', 'CSS Transitions', 'Framer Motion', 'React Spring']}
        rows={[
          ['Enter/exit', 'transition:fade/fly/slide', 'Manual onTransitionEnd', 'AnimatePresence', 'useTransition'],
          ['List reorder', 'animate:flip', 'Limited (no FLIP)', 'layout prop', 'useSprings'],
          ['Spring physics', 'spring() store', 'Not supported', 'type: "spring"', 'useSpring (core focus)'],
          ['Gestures', 'use:action (custom)', 'Manual events', 'drag, whileHover, whileTap', 'useDrag (with use-gesture)'],
          ['Layout animation', 'None', 'None', 'layout, layoutId', 'None'],
          ['Scroll-triggered', 'Manual (observer)', 'Manual (observer)', 'whileInView', 'Manual (observer)'],
          ['Page transitions', 'View Transitions API', 'Manual', 'AnimatePresence + Routes', 'useTransition'],
          ['Orchestration', 'delay parameter', 'transition-delay', 'variants, staggerChildren', 'useChain'],
          ['Bundle cost', '0 KB (compiled)', '0 KB', '~33 KB gzipped', '~17 KB gzipped'],
          ['Learning curve', 'Low (directives)', 'Low (CSS)', 'Medium', 'Medium-high'],
        ]}
      />

      {/* ===== Exercise ===== */}
      <h2 style={h2Style}>Exercise</h2>

      <CodeExercise
        id="animation-complete-transition"
        title="Add CSS Transition"
        type="complete-the-code"
        description="This box appears and disappears instantly. Add a CSS transition property to make it fade in and slide down smoothly over 0.3 seconds."
        initialCode={`function FadeBox({ visible }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-20px)',
      // TODO: Add transition property here
      padding: '1rem',
      background: '#38bdf8',
      borderRadius: 0,
    }}>
      Hello, animation!
    </div>
  );
}`}
        solution={`function FadeBox({ visible }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-20px)',
      transition: 'all 0.3s ease',
      padding: '1rem',
      background: '#38bdf8',
      borderRadius: 0,
    }}>
      Hello, animation!
    </div>
  );
}`}
        validationPatterns={['transition:', '0.3s']}
        hints={[
          "CSS transitions are added via the 'transition' style property",
          "The value should specify which properties to animate, the duration, and the easing",
          "Try: transition: 'all 0.3s ease'",
        ]}
      />

      {/* ===== Key Takeaways ===== */}
      <h2 style={h2Style}>Key Takeaways</h2>
      <p style={pStyle}>
        Svelte gives you a curated, built-in animation toolkit: transitions for enter/exit, flip
        for list reorder, and spring/tweened stores for physics. React gives you nothing -- by
        design. Start with CSS transitions for simple state-driven animations (opacity, transform,
        color). Use <code>onTransitionEnd</code> or Framer Motion's <code>AnimatePresence</code>{' '}
        when you need true enter/exit animations. Reach for Framer Motion when you need layout
        animations, gestures, or orchestration -- these are areas where it surpasses even Svelte's
        built-in capabilities. React Spring is excellent when spring physics are your primary need.
        The key insight: CSS transitions are your default, libraries are your escape hatch, and
        the React ecosystem offers animation power that no single framework can match out of the box.
      </p>
    </ChapterLayout>
  );
}
