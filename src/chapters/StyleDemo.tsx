import { useState } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';

const chapters = ['Components & JSX', 'Reactivity & State', 'Props & Data Flow', 'Events & Callbacks'];
const sections = ['Foundations', 'Intermediate', 'Advanced', 'Ecosystem', 'Next.js'];

const svelteCode = '<script>\n  let count = $state(0);\n</script>\n\n<button onclick=\n  {() => count++}>\n  {count}\n</button>';
const reactCode = 'function Counter() {\n  const [count, setCount]\n    = useState(0);\n\n  return (\n    <button onClick=\n      {() =>\n        setCount(c => c+1)\n      }>\n      {count}\n    </button>\n  );\n}';


// ═══════════════════════════════════════════════════════════════════════════
// Shared New Nordic base — parameterised by accent color
// Ultra-refined, barely-there. Maximum whitespace, whisper-quiet typography.
// DM Sans at light weights. Monochrome base with one vivid accent.
// ═══════════════════════════════════════════════════════════════════════════

interface AccentPalette {
  vivid: string;       // the high-gamut accent in dark mode
  vividLight: string;  // the accent adapted for light mode (slightly deeper)
  soft: string;        // very faint tint for backgrounds (dark)
  softLight: string;   // very faint tint for backgrounds (light)
  svelteDot: string;   // svelte column dot color
}

function NordicVariant({ mode, accent, label }: { mode: 'dark' | 'light'; accent: AccentPalette; label: string }) {
  const [tab, setTab] = useState(0);
  const d = mode === 'dark';

  const bg = d ? '#141614' : '#f6f7f4';
  const bgSide = d ? '#181a18' : '#eff0ec';
  const border = d ? '#252825' : '#d8dbd4';
  const borderFaint = d ? '#1e201e' : '#e6e8e2';
  const text = d ? '#e4e6e2' : '#1a1c1a';
  const t2 = d ? '#868a84' : '#5a5e58';
  const t3 = d ? '#484c48' : '#a0a49c';
  const ac = d ? accent.vivid : accent.vividLight;
  const acSoft = d ? accent.soft : accent.softLight;
  const codeBg = d ? '#121412' : '#fafbf8';

  return (
    <div style={{ background: bg, overflow: 'hidden', border: `1px solid ${borderFaint}`, color: text, fontFamily: "'DM Sans', sans-serif" }}>
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
                  letterSpacing: '0.06em', color: si === 0 ? ac : t3,
                  textTransform: 'uppercase',
                  marginTop: si > 0 ? '0.3rem' : 0,
                }}>{s}</div>
                {si === 0 && chapters.map((ch, ci) => (
                  <div key={ci} onClick={() => setTab(ci)} style={{
                    padding: '0.35rem 1.5rem', fontSize: '0.78rem',
                    color: tab === ci ? text : t3,
                    fontWeight: tab === ci ? 500 : 400,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}>
                    {tab === ci && <span style={{ color: ac, marginRight: '0.35rem', fontSize: '0.5rem' }}>—</span>}
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
            letterSpacing: '0.06em', color: ac,
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
              fontSize: '0.82rem', color: ac, fontWeight: 500,
            }}>.svelte</code>{' '}
            file. React takes a different approach — components are functions.
          </p>

          {/* Code blocks — floating in whitespace */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.75rem' }}>
            {[
              { l: 'Svelte', dot: accent.svelteDot, c: svelteCode },
              { l: 'React', dot: ac, c: reactCode },
            ].map((col, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.55rem', fontWeight: 500,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: t3, marginBottom: '0.4rem',
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: col.dot,
                  }} />
                  {col.l}
                </div>
                <pre style={{
                  padding: '1rem',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.72rem', lineHeight: 1.7,
                  color: t2, margin: 0, whiteSpace: 'pre-wrap',
                  background: codeBg,
                  border: `1px solid ${borderFaint}`,
                }}>{col.c}</pre>
              </div>
            ))}
          </div>

          {/* Callout — barely there, accent only on the label */}
          <div style={{ padding: '1rem 0', borderTop: `1px solid ${borderFaint}` }}>
            <div style={{
              fontSize: '0.55rem', fontWeight: 500,
              letterSpacing: '0.06em', color: ac,
              textTransform: 'uppercase', marginBottom: '0.4rem',
            }}>Insight</div>
            <p style={{ fontSize: '0.88rem', color: t2, lineHeight: 1.85, margin: 0 }}>
              Svelte compiles reactivity away at build time. React tracks it at runtime. This shapes every pattern.
            </p>
          </div>

          {/* Accent swatch */}
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: ac }} />
            <span style={{ fontSize: '0.7rem', fontFamily: "'IBM Plex Mono', monospace", color: t3 }}>{ac} — {label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// Three accent palettes — high-gamut, vivid, each a single hue
// ═══════════════════════════════════════════════════════════════════════════

const accentElectricIndigo: AccentPalette = {
  vivid: '#7b61ff',
  vividLight: '#5a3ed8',
  soft: 'rgba(123, 97, 255, 0.07)',
  softLight: 'rgba(90, 62, 216, 0.05)',
  svelteDot: '#e86030',
};

const accentVermillion: AccentPalette = {
  vivid: '#f05030',
  vividLight: '#c83820',
  soft: 'rgba(240, 80, 48, 0.07)',
  softLight: 'rgba(200, 56, 32, 0.05)',
  svelteDot: '#f05030',
};

const accentCerulean: AccentPalette = {
  vivid: '#0095e0',
  vividLight: '#006ab0',
  soft: 'rgba(0, 149, 224, 0.07)',
  softLight: 'rgba(0, 106, 176, 0.05)',
  svelteDot: '#e86030',
};


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
        Three variations on the New Nordic base — same quiet, refined structure with
        a single high-gamut accent color punching through the monochrome palette.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button onClick={() => setMode('dark')} style={btnStyle(mode === 'dark')}>Dark</button>
        <button onClick={() => setMode('light')} style={btnStyle(mode === 'light')}>Light</button>
      </div>

      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 400, marginBottom: '0.3rem', letterSpacing: '-0.01em' }}>
          C1 — Electric Indigo
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem', maxWidth: '50em' }}>
          A vivid purple-violet. Energetic but not aggressive against the muted greens and grays.
          Reads as creative and contemporary. Good contrast in both modes.
        </p>
        <NordicVariant mode={mode} accent={accentElectricIndigo} label="electric indigo" />
      </div>

      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 400, marginBottom: '0.3rem', letterSpacing: '-0.01em' }}>
          C2 — Vermillion
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem', maxWidth: '50em' }}>
          A warm red-orange. The Svelte dot and the accent unify into one hue — the whole page
          feels like a bridge between the two frameworks. Assertive without overwhelming the quiet base.
        </p>
        <NordicVariant mode={mode} accent={accentVermillion} label="vermillion" />
      </div>

      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 400, marginBottom: '0.3rem', letterSpacing: '-0.01em' }}>
          C3 — Cerulean
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem', maxWidth: '50em' }}>
          A clear, saturated blue. Clean and technical without being cold — the warm Nordic base
          keeps it grounded. Classic contrast with the Svelte orange dot. Feels trustworthy and precise.
        </p>
        <NordicVariant mode={mode} accent={accentCerulean} label="cerulean" />
      </div>
    </ChapterLayout>
  );
}
