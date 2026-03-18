import { useState } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';

const chapters = ['Components & JSX', 'Reactivity & State', 'Props & Data Flow', 'Events & Callbacks'];
const sections = ['Foundations', 'Intermediate', 'Advanced', 'Ecosystem', 'Next.js'];

const svelteCode = '<script>\n  let count = $state(0);\n</script>\n\n<button onclick=\n  {() => count++}>\n  {count}\n</button>';
const reactCode = 'function Counter() {\n  const [count, setCount]\n    = useState(0);\n\n  return (\n    <button onClick=\n      {() =>\n        setCount(c => c+1)\n      }>\n      {count}\n    </button>\n  );\n}';

// ═══════════════════════════════════════════════════════════════════════════
// OKLCH accent definitions with RGB fallbacks
// ═══════════════════════════════════════════════════════════════════════════

interface AccentDef {
  label: string;
  oklch: string;        // oklch() value for the vivid accent
  oklchLight: string;   // oklch() slightly deeper for light mode
  rgb: string;          // sRGB fallback
  rgbLight: string;     // sRGB fallback for light mode
  svelteDot: string;
}

const neonGreen: AccentDef = {
  label: 'Neon Green',
  oklch: 'oklch(0.85 0.25 145)',
  oklchLight: 'oklch(0.55 0.22 145)',
  rgb: '#39ff14',
  rgbLight: '#1a8a10',
  svelteDot: '#e86030',
};

const signalRed: AccentDef = {
  label: 'Signal Red',
  oklch: 'oklch(0.65 0.28 25)',
  oklchLight: 'oklch(0.52 0.24 25)',
  rgb: '#ff2a1a',
  rgbLight: '#c82010',
  svelteDot: '#ff2a1a',
};

const brightBlue: AccentDef = {
  label: 'Bright Blue',
  oklch: 'oklch(0.7 0.22 250)',
  oklchLight: 'oklch(0.5 0.2 250)',
  rgb: '#1a8aff',
  rgbLight: '#0055cc',
  svelteDot: '#e86030',
};

// Helper: returns oklch with rgb fallback as a CSS value
// Since React inline styles don't support @supports, we use oklch directly
// (browsers that don't support it fall back gracefully)
function ac(def: AccentDef, dark: boolean): string {
  return dark ? def.oklch : def.oklchLight;
}
function acFall(def: AccentDef, dark: boolean): string {
  return dark ? def.rgb : def.rgbLight;
}


// ═══════════════════════════════════════════════════════════════════════════
// New Nordic base — parameterised by accent
// ═══════════════════════════════════════════════════════════════════════════

function NordicVariant({ mode, accent }: { mode: 'dark' | 'light'; accent: AccentDef }) {
  const [tab, setTab] = useState(0);
  const d = mode === 'dark';

  const bg = d ? '#141614' : '#f6f7f4';
  const bgSide = d ? '#181a18' : '#eff0ec';
  const borderFaint = d ? '#1e201e' : '#e6e8e2';
  const text = d ? '#e4e6e2' : '#1a1c1a';
  const t2 = d ? '#868a84' : '#5a5e58';
  const t3 = d ? '#484c48' : '#a0a49c';
  const codeBg = d ? '#121412' : '#fafbf8';

  // Use oklch with fallback
  const accentColor = acFall(accent, d);
  const accentOklch = ac(accent, d);

  // We'll use a CSS custom property trick via a <style> tag for oklch support
  const cssId = `nordic-${accent.label.replace(/\s/g, '-').toLowerCase()}`;

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        .${cssId} { --ac: ${accentColor}; }
        @supports (color: oklch(0 0 0)) {
          .${cssId} { --ac: ${accentOklch}; }
        }
      `}</style>
      <div className={cssId} style={{
        background: bg, overflow: 'hidden',
        border: `1px solid ${borderFaint}`,
        color: text, fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ display: 'flex', minHeight: 540 }}>
          {/* Sidebar */}
          <div style={{ width: 210, background: bgSide, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '2rem 1.5rem 1.75rem' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3, color: text }}>
                React for<br />Svelte Developers
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {sections.map((s, si) => (
                <div key={si}>
                  <div style={{
                    padding: '0.6rem 1.5rem 0.2rem',
                    fontSize: '0.55rem', fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: si === 0 ? 'var(--ac)' : t3,
                    textTransform: 'uppercase',
                    marginTop: si > 0 ? '0.3rem' : 0,
                  }}>{s}</div>
                  {si === 0 && chapters.map((ch, ci) => (
                    <div key={ci} onClick={() => setTab(ci)} style={{
                      padding: '0.35rem 1.5rem', fontSize: '0.78rem',
                      color: tab === ci ? text : t3,
                      fontWeight: tab === ci ? 500 : 400,
                      cursor: 'pointer', transition: 'color 0.2s',
                    }}>
                      {tab === ci && <span style={{ color: 'var(--ac)', marginRight: '0.35rem', fontSize: '0.5rem' }}>—</span>}
                      {ch}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ padding: '1rem 1.5rem', fontSize: '0.6rem', color: t3 }}>4 / 30</div>
          </div>

          {/* Faint separator */}
          <div style={{ width: 1, background: borderFaint, flexShrink: 0 }} />

          {/* Content */}
          <div style={{ flex: 1, padding: '2.5rem 2.5rem', overflow: 'hidden' }}>
            <div style={{
              fontSize: '0.55rem', fontWeight: 500,
              letterSpacing: '0.06em', color: 'var(--ac)',
              textTransform: 'uppercase', marginBottom: '1rem',
            }}>Foundations</div>

            <h2 style={{
              fontSize: '1.9rem', fontWeight: 400,
              lineHeight: 1.15, letterSpacing: '-0.02em',
              marginBottom: '0.5rem', color: text,
            }}>{chapters[tab]}</h2>
            <div style={{ width: '100%', height: 1, background: borderFaint, marginBottom: '1.25rem' }} />

            <p style={{ fontSize: '0.9rem', color: t2, lineHeight: 1.9, marginBottom: '1.75rem', maxWidth: '38em' }}>
              In Svelte, every component lives in its own{' '}
              <code style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.82rem', color: 'var(--ac)', fontWeight: 500,
              }}>.svelte</code>{' '}
              file. React takes a different approach — components are functions.
            </p>

            {/* Code blocks */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.75rem' }}>
              {[
                { l: 'Svelte', dot: accent.svelteDot, c: svelteCode },
                { l: 'React', dot: 'var(--ac)', c: reactCode },
              ].map((col, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.55rem', fontWeight: 500,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: t3, marginBottom: '0.4rem',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: col.dot }} />
                    {col.l}
                  </div>
                  <pre style={{
                    padding: '1rem',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.72rem', lineHeight: 1.7,
                    color: t2, margin: 0, whiteSpace: 'pre-wrap',
                    background: codeBg, border: `1px solid ${borderFaint}`,
                  }}>{col.c}</pre>
                </div>
              ))}
            </div>

            {/* Callout */}
            <div style={{ padding: '1rem 0', borderTop: `1px solid ${borderFaint}` }}>
              <div style={{
                fontSize: '0.55rem', fontWeight: 500,
                letterSpacing: '0.06em', color: 'var(--ac)',
                textTransform: 'uppercase', marginBottom: '0.4rem',
              }}>Insight</div>
              <p style={{ fontSize: '0.88rem', color: t2, lineHeight: 1.85, margin: 0 }}>
                Svelte compiles reactivity away at build time. React tracks it at runtime. This shapes every pattern.
              </p>
            </div>

            {/* Accent swatch with oklch value */}
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ac)' }} />
              <div>
                <div style={{ fontSize: '0.65rem', fontFamily: "'IBM Plex Mono', monospace", color: t3 }}>
                  {d ? accent.oklch : accent.oklchLight}
                </div>
                <div style={{ fontSize: '0.55rem', fontFamily: "'IBM Plex Mono', monospace", color: t3, opacity: 0.6 }}>
                  fallback: {d ? accent.rgb : accent.rgbLight}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// DEMO PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function StyleDemo() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  const btnStyle = (active: boolean) => ({
    padding: '0.4rem 1.1rem',
    background: active ? 'var(--color-text)' : 'transparent',
    color: active ? 'var(--color-bg)' : 'var(--color-text-secondary)',
    border: `1px solid ${active ? 'var(--color-text)' : 'var(--color-border)'}`,
    borderRadius: '4px',
    cursor: 'pointer' as const,
    fontWeight: 500,
    fontSize: '0.82rem',
    fontFamily: 'var(--font-sans)',
  });

  return (
    <ChapterLayout id="style-demo">
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '50em' }}>
        New Nordic base with three high-gamut accent colors defined in OKLCH
        (with sRGB fallbacks). Same quiet structure — the accent is the only color on the page.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
        <button onClick={() => setMode('dark')} style={btnStyle(mode === 'dark')}>Dark</button>
        <button onClick={() => setMode('light')} style={btnStyle(mode === 'light')}>Light</button>
      </div>

      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 400, marginBottom: '0.3rem' }}>Neon Green</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', maxWidth: '50em' }}>
          High-energy, terminal-adjacent. The OKLCH gamut pushes this green well beyond sRGB on
          wide-gamut displays — electric and alive against the muted Nordic palette.
        </p>
        <NordicVariant mode={mode} accent={neonGreen} />
      </div>

      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 400, marginBottom: '0.3rem' }}>Signal Red</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', maxWidth: '50em' }}>
          Urgent, direct, confident. Shares Svelte's hue — the orange dot and the accent feel like
          one language. On wide-gamut displays the OKLCH red is more saturated than any sRGB red can be.
        </p>
        <NordicVariant mode={mode} accent={signalRed} />
      </div>

      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 400, marginBottom: '0.3rem' }}>Bright Blue</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', maxWidth: '50em' }}>
          Clear, precise, trustworthy. Classic contrast with the Svelte orange. The OKLCH definition
          is perceptually uniform — equally vivid in dark and light modes without manual tuning.
        </p>
        <NordicVariant mode={mode} accent={brightBlue} />
      </div>
    </ChapterLayout>
  );
}
