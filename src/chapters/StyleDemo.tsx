import { useState } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';

const chapters = ['Components & JSX', 'Reactivity & State', 'Props & Data Flow', 'Events & Callbacks'];
const sections = ['Foundations', 'Intermediate', 'Advanced', 'Ecosystem', 'Next.js'];

const svelteCode = '<script>\n  let count = $state(0);\n</script>\n\n<button onclick=\n  {() => count++}>\n  {count}\n</button>';
const reactCode = 'function Counter() {\n  const [count, setCount]\n    = useState(0);\n\n  return (\n    <button onClick=\n      {() =>\n        setCount(c => c+1)\n      }>\n      {count}\n    </button>\n  );\n}';


// ═══════════════════════════════════════════════════════════════════════════
// A — Swiss Rational
// International Typographic Style. Grid-strict, one structural red,
// stark contrast, no radius. Inter + IBM Plex Mono. Numbered sections.
// ═══════════════════════════════════════════════════════════════════════════

function DirectionA({ mode }: { mode: 'dark' | 'light' }) {
  const [tab, setTab] = useState(0);
  const d = mode === 'dark';
  const bg = d ? '#111111' : '#ffffff';
  const border = d ? '#2a2a2a' : '#e0e0e0';
  const text = d ? '#f0f0f0' : '#111111';
  const t2 = d ? '#999999' : '#555555';
  const t3 = d ? '#555555' : '#aaaaaa';
  const red = '#e03020';
  const codeBg = d ? '#151515' : '#fafafa';

  return (
    <div style={{ background: bg, overflow: 'hidden', border: `1px solid ${border}`, color: text, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', minHeight: 540 }}>
        <div style={{ width: 220, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '1.5rem 1.25rem', borderBottom: `1px solid ${border}` }}>
            <div style={{ fontSize: '0.65rem', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, color: t3, marginBottom: '0.1rem' }}>tutorial</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 }}>React for<br />Svelte Devs</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {sections.map((s, si) => (
              <div key={si}>
                <div style={{ padding: '0.5rem 1.25rem 0.25rem', fontSize: '0.55rem', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: si === 0 ? red : t3, borderTop: si > 0 ? `1px solid ${border}` : 'none' }}>
                  {String(si + 1).padStart(2, '0')} {s}
                </div>
                {si === 0 && chapters.map((ch, ci) => (
                  <div key={ci} onClick={() => setTab(ci)} style={{ padding: '0.3rem 1.25rem', fontSize: '0.8rem', color: tab === ci ? text : t3, fontWeight: tab === ci ? 600 : 400, cursor: 'pointer', background: tab === ci ? (d ? '#1e1e1e' : '#f0f0f0') : 'transparent' }}>{ch}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ padding: '0.75rem 1.25rem', borderTop: `1px solid ${border}`, fontSize: '0.6rem', fontFamily: "'IBM Plex Mono', monospace", color: t3 }}>4 / 30 complete</div>
        </div>

        <div style={{ flex: 1, padding: '2rem', overflow: 'hidden' }}>
          <div style={{ fontSize: '0.55rem', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', color: red, marginBottom: '0.75rem' }}>01 Foundations</div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1rem' }}>{chapters[tab]}</h2>
          <p style={{ fontSize: '0.88rem', color: t2, lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '36em' }}>
            In Svelte, every component lives in its own <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.82rem', background: d ? '#222' : '#f0f0f0', padding: '0.12em 0.35em', color: text }}>.svelte</code> file. React takes a different approach.
          </p>
          <div style={{ display: 'flex', borderTop: `2px solid ${red}`, marginBottom: '1.5rem' }}>
            {[{ l: 'Svelte', c: svelteCode }, { l: 'React', c: reactCode }].map((col, i) => (
              <div key={i} style={{ flex: 1, borderLeft: i > 0 ? `1px solid ${border}` : 'none' }}>
                <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.55rem', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: t3, borderBottom: `1px solid ${border}` }}>{col.l}</div>
                <pre style={{ padding: '0.75rem', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem', lineHeight: 1.65, color: t2, margin: 0, whiteSpace: 'pre-wrap', background: codeBg }}>{col.c}</pre>
              </div>
            ))}
          </div>
          <div style={{ borderLeft: `3px solid ${red}`, paddingLeft: '1rem' }}>
            <div style={{ fontSize: '0.55rem', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', color: red, marginBottom: '0.3rem' }}>Note</div>
            <p style={{ fontSize: '0.84rem', color: t2, lineHeight: 1.7, margin: 0 }}>Svelte compiles reactivity away at build time. React tracks it at runtime. This shapes every pattern.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// B — Danish Functionalist
// The warmth of Jacobsen and Wegner in digital form. Keep Swiss structure
// but warm it: off-white → cream, black → charcoal, red → burnt terracotta.
// Slightly softer radius (3px — like furniture edges). DM Sans for its
// humanist warmth. Sidebar has a warm gray tone. Code blocks in a
// dark warm-charcoal. Callouts with a warm amber-left border.
// ═══════════════════════════════════════════════════════════════════════════

function DirectionB({ mode }: { mode: 'dark' | 'light' }) {
  const [tab, setTab] = useState(0);
  const d = mode === 'dark';
  const bg = d ? '#1a1816' : '#f8f6f1';
  const bgSide = d ? '#1f1d1a' : '#f0ede6';
  const border = d ? '#302c28' : '#d8d2c6';
  const text = d ? '#e8e4dc' : '#28241e';
  const t2 = d ? '#a09888' : '#5a5448';
  const t3 = d ? '#5a5448' : '#a09888';
  const terra = d ? '#c87050' : '#a85838';
  const terraSoft = d ? 'rgba(200, 112, 80, 0.1)' : 'rgba(168, 88, 56, 0.06)';
  const codeBg = d ? '#161412' : '#fdfbf7';
  const sColors = d ? ['#c87050', '#7a9a6a', '#7088a8', '#a888b8', '#8a8478'] : ['#a85838', '#3a6830', '#305880', '#6a3a80', '#5a5448'];

  return (
    <div style={{ background: bg, overflow: 'hidden', border: `1px solid ${border}`, borderRadius: 3, color: text, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', minHeight: 540 }}>
        <div style={{ width: 220, background: bgSide, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '1.5rem 1.25rem', borderBottom: `1px solid ${border}` }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>React for<br />Svelte Devs</div>
            <div style={{ fontSize: '0.65rem', color: t3, marginTop: '0.3rem' }}>A practical guide</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {sections.map((s, si) => (
              <div key={si}>
                <div style={{ padding: '0.5rem 1.25rem 0.25rem', fontSize: '0.58rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: sColors[si], borderTop: si > 0 ? `1px solid ${border}` : 'none' }}>
                  {s}
                </div>
                {si === 0 && chapters.map((ch, ci) => (
                  <div key={ci} onClick={() => setTab(ci)} style={{
                    padding: '0.35rem 1.25rem 0.35rem 1.5rem', fontSize: '0.8rem',
                    color: tab === ci ? text : t3, fontWeight: tab === ci ? 600 : 400, cursor: 'pointer',
                    borderLeft: tab === ci ? `2px solid ${terra}` : '2px solid transparent',
                  }}>{ch}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ padding: '0.75rem 1.25rem', borderTop: `1px solid ${border}`, fontSize: '0.62rem', color: t3 }}>
            <span style={{ color: terra }}>●</span> 4 of 30 read
          </div>
        </div>

        <div style={{ flex: 1, padding: '2rem 2.25rem', overflow: 'hidden' }}>
          <div style={{ fontSize: '0.58rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: sColors[0], marginBottom: '0.6rem' }}>Foundations</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>{chapters[tab]}</h2>
          <div style={{ width: 32, height: 2, background: terra, borderRadius: 1, marginBottom: '1.25rem' }} />
          <p style={{ fontSize: '0.9rem', color: t2, lineHeight: 1.85, marginBottom: '1.5rem', maxWidth: '38em' }}>
            In Svelte, every component lives in its own <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.82rem', background: terraSoft, padding: '0.15em 0.4em', borderRadius: 3, color: terra }}>.svelte</code> file. React takes a different approach.
          </p>

          <div style={{ display: 'flex', gap: '1px', borderRadius: 3, overflow: 'hidden', background: border, marginBottom: '1.5rem' }}>
            {[{ l: 'Svelte', dot: '#d86030', c: svelteCode }, { l: 'React', dot: terra, c: reactCode }].map((col, i) => (
              <div key={i} style={{ flex: 1, background: codeBg }}>
                <div style={{ padding: '0.45rem 0.75rem', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: t3, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: col.dot }} />{col.l}
                </div>
                <pre style={{ padding: '0.75rem', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem', lineHeight: 1.65, color: t2, margin: 0, whiteSpace: 'pre-wrap' }}>{col.c}</pre>
              </div>
            ))}
          </div>

          <div style={{ borderLeft: `3px solid ${terra}`, paddingLeft: '1rem', background: terraSoft, padding: '0.85rem 1rem 0.85rem 1.15rem', borderRadius: '0 3px 3px 0' }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: terra, marginBottom: '0.3rem' }}>Insight</div>
            <p style={{ fontSize: '0.86rem', color: t2, lineHeight: 1.75, margin: 0 }}>Svelte compiles reactivity away at build time. React tracks it at runtime. This shapes every pattern.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// C — New Nordic
// Ultra-refined, barely-there. Maximum whitespace, whisper-quiet typography.
// One desaturated sage green accent. Near-invisible borders (dotted or very
// light). Heading at a surprisingly delicate weight. Monochrome with one
// muted tone. Inspired by Kinfolk, Louisiana Museum, Norse Projects.
// Like handling a perfectly considered object — nothing extra.
// ═══════════════════════════════════════════════════════════════════════════

function DirectionC({ mode }: { mode: 'dark' | 'light' }) {
  const [tab, setTab] = useState(0);
  const d = mode === 'dark';
  const bg = d ? '#141614' : '#f6f7f4';
  const bgSide = d ? '#181a18' : '#eff0ec';
  const border = d ? '#252825' : '#d8dbd4';
  const borderFaint = d ? '#1e201e' : '#e6e8e2';
  const text = d ? '#e4e6e2' : '#1a1c1a';
  const t2 = d ? '#868a84' : '#5a5e58';
  const t3 = d ? '#484c48' : '#a0a49c';
  const sage = d ? '#7a9a78' : '#4a7048';
  const sageSoft = d ? 'rgba(122, 154, 120, 0.08)' : 'rgba(74, 112, 72, 0.05)';
  const codeBg = d ? '#121412' : '#fafbf8';
  const sColors = d ? ['#7a9a78', '#7a9a78', '#7a9a78', '#7a9a78', '#7a9a78'] : ['#4a7048', '#4a7048', '#4a7048', '#4a7048', '#4a7048'];

  return (
    <div style={{ background: bg, overflow: 'hidden', border: `1px solid ${borderFaint}`, color: text, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', minHeight: 540 }}>
        <div style={{ width: 210, background: bgSide, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '2rem 1.5rem 1.75rem' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3, color: text }}>React for<br />Svelte Developers</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {sections.map((s, si) => (
              <div key={si}>
                <div style={{ padding: '0.6rem 1.5rem 0.2rem', fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.06em', color: sColors[si], textTransform: 'uppercase', marginTop: si > 0 ? '0.3rem' : 0 }}>
                  {s}
                </div>
                {si === 0 && chapters.map((ch, ci) => (
                  <div key={ci} onClick={() => setTab(ci)} style={{
                    padding: '0.35rem 1.5rem', fontSize: '0.78rem',
                    color: tab === ci ? text : t3, fontWeight: tab === ci ? 500 : 400, cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}>{tab === ci && <span style={{ color: sage, marginRight: '0.35rem', fontSize: '0.5rem' }}>—</span>}{ch}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ padding: '1rem 1.5rem', fontSize: '0.6rem', color: t3 }}>4 / 30</div>
        </div>

        {/* Faint vertical separator — not a full border */}
        <div style={{ width: 1, background: borderFaint, flexShrink: 0 }} />

        <div style={{ flex: 1, padding: '2.5rem 2.5rem', overflow: 'hidden' }}>
          <div style={{ fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.06em', color: sage, textTransform: 'uppercase', marginBottom: '1rem' }}>Foundations</div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '0.5rem', color: text }}>{chapters[tab]}</h2>
          <div style={{ width: '100%', height: 1, background: borderFaint, marginBottom: '1.25rem' }} />

          <p style={{ fontSize: '0.9rem', color: t2, lineHeight: 1.9, marginBottom: '1.75rem', maxWidth: '38em' }}>
            In Svelte, every component lives in its own <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.82rem', color: sage, fontWeight: 500 }}>.svelte</code> file. React takes a different approach — components are functions.
          </p>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.75rem' }}>
            {[{ l: 'Svelte', c: svelteCode }, { l: 'React', c: reactCode }].map((col, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: t3, marginBottom: '0.4rem' }}>{col.l}</div>
                <pre style={{ padding: '1rem', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem', lineHeight: 1.7, color: t2, margin: 0, whiteSpace: 'pre-wrap', background: codeBg, border: `1px solid ${borderFaint}` }}>{col.c}</pre>
              </div>
            ))}
          </div>

          <div style={{ padding: '1rem 0', borderTop: `1px solid ${borderFaint}` }}>
            <div style={{ fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.06em', color: sage, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Insight</div>
            <p style={{ fontSize: '0.88rem', color: t2, lineHeight: 1.85, margin: 0 }}>Svelte compiles reactivity away at build time. React tracks it at runtime. This shapes every pattern.</p>
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
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button onClick={() => setMode('dark')} style={btnStyle(mode === 'dark')}>Dark</button>
        <button onClick={() => setMode('light')} style={btnStyle(mode === 'light')}>Light</button>
      </div>

      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>A — Swiss Rational</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem', maxWidth: '50em' }}>
          International Typographic Style. <strong>Inter</strong> + <strong>IBM Plex Mono</strong>. One structural red accent.
          No radius anywhere. Stark contrast. Numbered monospace section labels. Big type-size jumps.
        </p>
        <DirectionA mode={mode} />
      </div>

      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>B — Danish Functionalist</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem', maxWidth: '50em' }}>
          The warmth of Jacobsen and Wegner. Same structure as Swiss but warmed up: <strong>DM Sans</strong> for humanist tone,
          charcoal instead of black, cream instead of white, burnt terracotta instead of red.
          Soft 3px radius like furniture edges. Warm code tinting. Earth-tone section palette.
        </p>
        <DirectionB mode={mode} />
      </div>

      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 400, marginBottom: '0.3rem', letterSpacing: '-0.01em' }}>C — New Nordic</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem', maxWidth: '50em' }}>
          Ultra-refined restraint. <strong>DM Sans</strong> at light weight, maximum whitespace, barely-there borders.
          One desaturated sage green accent — same for all sections. Code blocks separated by space instead of frames.
          No sidebar border — just a faint line. Heading at weight 400. Like handling a perfectly considered object.
          Inspired by Kinfolk, Louisiana Museum, Norse Projects.
        </p>
        <DirectionC mode={mode} />
      </div>
    </ChapterLayout>
  );
}
