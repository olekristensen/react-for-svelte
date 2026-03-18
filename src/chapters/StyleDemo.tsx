import { useState } from 'react';
import { ChapterLayout } from '../components/ChapterLayout';

// ─────────────────────────────────────────────────────────────────────────
// Direction A: "Ink & Paper" — Editorial, warm, high-contrast
// Inspired by technical books and literary magazines.
// Warm off-white background, deep ink-black text, amber/gold accents.
// Fonts: serif headings feel authoritative, body stays clean sans-serif.
// ─────────────────────────────────────────────────────────────────────────

const themeA = {
  dark: {
    bg: '#1a1a18',
    bgSecondary: '#232320',
    bgTertiary: '#2e2e2a',
    surface: '#232320',
    border: '#3a3a35',
    text: '#e8e4dc',
    textSecondary: '#b5b0a4',
    textMuted: '#7d7a70',
    accent: '#d4a046',
    accentDim: '#3d2e10',
    react: '#d4a046',
    svelte: '#e06030',
    success: '#7dba6a',
    warning: '#d4a046',
    ecosystem: '#b08fd8',
    sectionColors: ['#d4a046', '#c77d4f', '#7dba6a', '#b08fd8', '#9ca3af'],
  },
  light: {
    bg: '#faf8f4',
    bgSecondary: '#ffffff',
    bgTertiary: '#ede9e0',
    surface: '#ffffff',
    border: '#d6d0c4',
    text: '#1a1a18',
    textSecondary: '#4a473e',
    textMuted: '#8a8578',
    accent: '#b8860b',
    accentDim: '#f5e6c8',
    react: '#b8860b',
    svelte: '#c74b1a',
    success: '#3d7a2e',
    warning: '#b8860b',
    ecosystem: '#7c3aed',
    sectionColors: ['#b8860b', '#a0522d', '#3d7a2e', '#7c3aed', '#555555'],
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Direction B: "Nordic Mono" — Minimal, cool, restrained
// Scandinavian design: lots of breathing room, muted steel blues,
// single accent color (teal). Monochromatic with subtle warmth.
// Headings are clean sans-serif, slightly larger, ultra-light weight.
// ─────────────────────────────────────────────────────────────────────────

const themeB = {
  dark: {
    bg: '#121820',
    bgSecondary: '#1a2230',
    bgTertiary: '#243040',
    surface: '#1a2230',
    border: '#2a3a4a',
    text: '#e0e6ed',
    textSecondary: '#8b99ab',
    textMuted: '#556677',
    accent: '#2eb8a6',
    accentDim: '#0c3d35',
    react: '#2eb8a6',
    svelte: '#e86040',
    success: '#2eb8a6',
    warning: '#e0a840',
    ecosystem: '#7888cc',
    sectionColors: ['#2eb8a6', '#4da0cc', '#2eb8a6', '#7888cc', '#8b99ab'],
  },
  light: {
    bg: '#f5f7fa',
    bgSecondary: '#ffffff',
    bgTertiary: '#e8ecf2',
    surface: '#ffffff',
    border: '#c8d0dc',
    text: '#121820',
    textSecondary: '#4a5568',
    textMuted: '#8898aa',
    accent: '#1a8a7c',
    accentDim: '#d0f0ea',
    react: '#1a8a7c',
    svelte: '#c04030',
    success: '#1a8a7c',
    warning: '#b88c20',
    ecosystem: '#5060a0',
    sectionColors: ['#1a8a7c', '#3078a0', '#1a8a7c', '#5060a0', '#4a5568'],
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Direction C: "Terminal Glow" — Technical, vivid, developer-native
// Dark-first with high-saturation accents on charcoal. Feels like a
// premium dev tool. Green as primary accent (terminal energy),
// distinct vibrant colors per section. Slightly more compact.
// ─────────────────────────────────────────────────────────────────────────

const themeC = {
  dark: {
    bg: '#0c0e14',
    bgSecondary: '#14171f',
    bgTertiary: '#1e222e',
    surface: '#14171f',
    border: '#262b38',
    text: '#e2e8f0',
    textSecondary: '#8892a8',
    textMuted: '#505868',
    accent: '#22d97c',
    accentDim: '#0a3d22',
    react: '#22d97c',
    svelte: '#ff6b3d',
    success: '#22d97c',
    warning: '#f0b030',
    ecosystem: '#a78bfa',
    sectionColors: ['#22d97c', '#50b0e0', '#f0b030', '#a78bfa', '#e2e8f0'],
  },
  light: {
    bg: '#f8fafb',
    bgSecondary: '#ffffff',
    bgTertiary: '#eaeff4',
    surface: '#ffffff',
    border: '#d0d8e2',
    text: '#0c0e14',
    textSecondary: '#3a4258',
    textMuted: '#7a8298',
    accent: '#0f8050',
    accentDim: '#d0f0e0',
    react: '#0f8050',
    svelte: '#d04820',
    success: '#0f8050',
    warning: '#a07820',
    ecosystem: '#6a4ec0',
    sectionColors: ['#0f8050', '#2070a0', '#a07820', '#6a4ec0', '#3a4258'],
  },
};

type ThemeColors = typeof themeA.dark;

function DemoCard({ name, subtitle, colors, mode }: { name: string; subtitle: string; colors: ThemeColors; mode: 'dark' | 'light' }) {
  const [activeTab, setActiveTab] = useState(0);
  const sections = [
    { title: 'FOUNDATIONS', color: colors.sectionColors[0] },
    { title: 'INTERMEDIATE', color: colors.sectionColors[1] },
    { title: 'ADVANCED', color: colors.sectionColors[2] },
    { title: 'ECOSYSTEM', color: colors.sectionColors[3] },
    { title: 'NEXT.JS', color: colors.sectionColors[4] },
  ];
  const chapters = ['Components & JSX', 'Reactivity & State', 'Props & Data Flow', 'Events & Callbacks'];

  return (
    <div style={{
      background: colors.bg,
      borderRadius: '16px',
      overflow: 'hidden',
      border: `1px solid ${colors.border}`,
      marginBottom: '2rem',
      color: colors.text,
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: name === 'B' ? '50%' : name === 'C' ? 4 : 8,
          background: colors.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '0.85rem',
          color: colors.bg,
          fontFamily: 'var(--font-mono)',
        }}>R</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-serif)' }}>
            React for Svelte Devs
          </div>
          <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>{subtitle}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.accent, opacity: 0.6 }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.warning, opacity: 0.6 }} />
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 420 }}>
        {/* Sidebar */}
        <div style={{
          width: 200,
          background: colors.bgSecondary,
          borderRight: `1px solid ${colors.border}`,
          padding: '0.75rem 0',
          flexShrink: 0,
        }}>
          {sections.map((s, i) => (
            <div key={i}>
              <div style={{
                padding: '0.4rem 1rem',
                fontSize: '0.6rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: s.color,
                marginTop: i > 0 ? '0.4rem' : 0,
              }}>{s.title}</div>
              {i === 0 && chapters.map((ch, j) => (
                <div
                  key={j}
                  onClick={() => setActiveTab(j)}
                  style={{
                    padding: '0.3rem 1rem 0.3rem 1.25rem',
                    fontSize: '0.78rem',
                    color: activeTab === j ? colors.text : colors.textSecondary,
                    background: activeTab === j ? `${colors.accent}18` : 'transparent',
                    borderLeft: activeTab === j ? `2px solid ${colors.accent}` : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >{ch}</div>
              ))}
            </div>
          ))}
          <div style={{
            padding: '0.75rem 1rem',
            fontSize: '0.65rem',
            color: colors.textMuted,
            borderTop: `1px solid ${colors.border}`,
            marginTop: '0.5rem',
          }}>4/30 chapters read</div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: colors.sectionColors[0],
            marginBottom: '0.4rem',
            fontWeight: 600,
          }}>Foundations</div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.6rem',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '0.5rem',
            color: colors.text,
          }}>{chapters[activeTab]}</h2>
          <p style={{
            fontSize: '0.82rem',
            color: colors.textSecondary,
            lineHeight: 1.7,
            marginBottom: '1rem',
          }}>
            In Svelte, every component lives in its own <code style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              background: colors.bgTertiary,
              padding: '0.12em 0.35em',
              borderRadius: 4,
              color: colors.accent,
            }}>.svelte</code> file. React takes a different approach — components are just JavaScript functions that return JSX.
          </p>

          {/* Code comparison mock */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0.4rem 0.6rem',
                background: colors.bgTertiary,
                borderRadius: '6px 6px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.svelte }} />
                <span style={{ color: colors.textMuted }}>Svelte</span>
              </div>
              <div style={{
                background: '#011627',
                borderRadius: '0 0 6px 6px',
                padding: '0.6rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                lineHeight: 1.7,
                color: '#d6deeb',
              }}>
                <div><span style={{ color: '#c792ea' }}>{'<script>'}</span></div>
                <div>  <span style={{ color: '#82aaff' }}>let</span> <span style={{ color: '#addb67' }}>count</span> = <span style={{ color: '#f78c6c' }}>$state</span>(0);</div>
                <div><span style={{ color: '#c792ea' }}>{'</script>'}</span></div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0.4rem 0.6rem',
                background: colors.bgTertiary,
                borderRadius: '6px 6px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent }} />
                <span style={{ color: colors.textMuted }}>React</span>
              </div>
              <div style={{
                background: '#011627',
                borderRadius: '0 0 6px 6px',
                padding: '0.6rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                lineHeight: 1.7,
                color: '#d6deeb',
              }}>
                <div><span style={{ color: '#c792ea' }}>const</span> [<span style={{ color: '#addb67' }}>count</span>, <span style={{ color: '#addb67' }}>setCount</span>]</div>
                <div>  = <span style={{ color: '#82aaff' }}>useState</span>(<span style={{ color: '#f78c6c' }}>0</span>);</div>
                <div style={{ opacity: 0.3 }}>{'// ...'}</div>
              </div>
            </div>
          </div>

          {/* Callout mock */}
          <div style={{
            padding: '0.65rem 0.85rem',
            background: `${colors.accent}12`,
            borderLeft: `3px solid ${colors.accent}60`,
            borderRadius: '0 6px 6px 0',
            fontSize: '0.78rem',
            color: colors.textSecondary,
            lineHeight: 1.6,
          }}>
            <span style={{ fontWeight: 700, color: colors.accent, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Insight</span>
            <br />
            Svelte compiles reactivity away. React tracks it at runtime. This shapes everything.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StyleDemo() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  return (
    <ChapterLayout id="style-demo">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setMode('dark')}
          style={{
            padding: '0.4rem 1rem',
            background: mode === 'dark' ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
            color: mode === 'dark' ? '#0f172a' : 'var(--color-text)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >Dark</button>
        <button
          onClick={() => setMode('light')}
          style={{
            padding: '0.4rem 1rem',
            background: mode === 'light' ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
            color: mode === 'light' ? '#0f172a' : 'var(--color-text)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >Light</button>
      </div>

      {/* Direction A */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.4rem', marginTop: '1.5rem' }}>
        A — Ink &amp; Paper
      </h2>
      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
        Warm, editorial. Amber/gold accents on parchment tones. Feels like a well-designed
        technical book. High contrast, confident typography. Section colors are warm earth tones.
      </p>
      <DemoCard
        name="A"
        subtitle="An editorial guide to React"
        colors={mode === 'dark' ? themeA.dark : themeA.light}
        mode={mode}
      />

      {/* Direction B */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.4rem', marginTop: '1.5rem' }}>
        B — Nordic Mono
      </h2>
      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
        Cool, restrained, Scandinavian. Steel blues with a single teal accent. Lots of whitespace,
        muted palette, minimal borders. Section colors are close in hue — cohesive, not loud.
      </p>
      <DemoCard
        name="B"
        subtitle="A focused guide to React"
        colors={mode === 'dark' ? themeB.dark : themeB.light}
        mode={mode}
      />

      {/* Direction C */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.4rem', marginTop: '1.5rem' }}>
        C — Terminal Glow
      </h2>
      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
        Dark-first, developer-native. Charcoal backgrounds with vivid green accent (terminal energy).
        High-saturation section colors pop against the dark canvas. Feels like a premium dev tool.
      </p>
      <DemoCard
        name="C"
        subtitle="A developer's guide to React"
        colors={mode === 'dark' ? themeC.dark : themeC.light}
        mode={mode}
      />

      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.4rem', marginTop: '2rem' }}>
        Palette Comparison
      </h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {(['A — Ink & Paper', 'B — Nordic Mono', 'C — Terminal Glow'] as const).map((label, i) => {
          const palette = [themeA, themeB, themeC][i][mode];
          return (
            <div key={i} style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>{label}</div>
              <div style={{ display: 'flex', gap: 2, marginBottom: '0.3rem' }}>
                {[palette.bg, palette.bgSecondary, palette.bgTertiary, palette.surface].map((c, j) => (
                  <div key={j} style={{ width: 36, height: 24, background: c, borderRadius: 3, border: '1px solid var(--color-border)' }} title={c} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 2, marginBottom: '0.3rem' }}>
                {[palette.text, palette.textSecondary, palette.textMuted].map((c, j) => (
                  <div key={j} style={{ width: 36, height: 24, background: c, borderRadius: 3 }} title={c} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                {palette.sectionColors.map((c, j) => (
                  <div key={j} style={{ width: 36, height: 24, background: c, borderRadius: 3 }} title={c} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ChapterLayout>
  );
}
