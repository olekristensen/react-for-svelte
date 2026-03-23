import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { sections, allChapters } from './data/chapters';
import { useProgress } from './hooks/useProgress';
import { totalExercisesForChapter } from './data/exercises';
import { IconMenu, IconArrowLeft, IconSun, IconMoon, IconSystem, IconCheck } from './components/Icons';

import Welcome from './chapters/Welcome';
import MentalModel from './chapters/MentalModel';
import Components from './chapters/Components';
import State from './chapters/State';
import Props from './chapters/Props';
import Events from './chapters/Events';
import Lifecycle from './chapters/Lifecycle';
import ConditionalRendering from './chapters/ConditionalRendering';
import Context from './chapters/Context';
import Forms from './chapters/Forms';
import SlotsChildren from './chapters/SlotsChildren';
import Styling from './chapters/Styling';
import RefsDom from './chapters/RefsDom';
import CustomHooks from './chapters/CustomHooks';
import Performance from './chapters/Performance';
import SuspenseErrors from './chapters/SuspenseErrors';
import Patterns from './chapters/Patterns';
import TypeScriptReact from './chapters/TypeScriptReact';
import StyleDemo from './chapters/StyleDemo';
import EcosystemState from './chapters/EcosystemState';
import EcosystemData from './chapters/EcosystemData';
import EcosystemForms from './chapters/EcosystemForms';
import EcosystemUI from './chapters/EcosystemUI';
import AnimationTransitions from './chapters/AnimationTransitions';
import EcosystemDecisions from './chapters/EcosystemDecisions';
import NextjsIntro from './chapters/NextjsIntro';
import NextjsRouting from './chapters/NextjsRouting';
import NextjsData from './chapters/NextjsData';
import NextjsRendering from './chapters/NextjsRendering';
import NextjsServerActions from './chapters/NextjsServerActions';
import NextjsMiddleware from './chapters/NextjsMiddleware';
import ReactEvolution from './chapters/ReactEvolution';

const chapterComponents: Record<string, React.FC> = {
  'welcome': Welcome,
  'mental-model': MentalModel,
  'components': Components,
  'state': State,
  'props': Props,
  'events': Events,
  'lifecycle': Lifecycle,
  'conditional-rendering': ConditionalRendering,
  'context': Context,
  'forms': Forms,
  'slots-children': SlotsChildren,
  'styling': Styling,
  'refs-dom': RefsDom,
  'custom-hooks': CustomHooks,
  'performance': Performance,
  'suspense-errors': SuspenseErrors,
  'patterns': Patterns,
  'typescript': TypeScriptReact,
  'style-demo': StyleDemo,
  'ecosystem-state': EcosystemState,
  'ecosystem-data': EcosystemData,
  'ecosystem-forms': EcosystemForms,
  'ecosystem-ui': EcosystemUI,
  'animation-transitions': AnimationTransitions,
  'ecosystem-decisions': EcosystemDecisions,
  'nextjs-intro': NextjsIntro,
  'nextjs-routing': NextjsRouting,
  'nextjs-data': NextjsData,
  'nextjs-rendering': NextjsRendering,
  'nextjs-server-actions': NextjsServerActions,
  'nextjs-middleware': NextjsMiddleware,
  'react-evolution': ReactEvolution,
};

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace('/', '');
  const { isVisited, visitedCount, solvedExercisesForChapter, resetProgress } = useProgress();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}
      <aside style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: open ? 0 : 'calc(-1 * var(--sidebar-width))',
        background: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        overflowY: 'auto',
        zIndex: 50,
        transition: 'left 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '1.25rem 1.25rem 1rem',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
        }}>
          <div style={{
            fontWeight: 500,
            fontSize: '0.95rem',
            color: 'var(--color-text)',
          }}>
            React for Svelte Devs
          </div>
        </div>

        <nav style={{ padding: '0.75rem 0', flex: 1, overflowY: 'auto' }}>
          {sections.map(section => (
            <div key={section.title} style={{ marginBottom: '0.5rem' }}>
              <div style={{
                padding: '0.4rem 1.25rem',
                fontSize: '0.7rem',
                fontWeight: 500,
                color: section.color,
              }}>
                {section.title}
              </div>
              {section.chapters.map(ch => {
                const isActive = currentPath === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      navigate(`/${ch.id}`);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.4rem 1.25rem 0.4rem 1.75rem',
                      background: 'transparent',
                      border: 'none',
                      borderLeft: isActive ? '1px solid var(--color-accent)' : '1px solid transparent',
                      color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {isVisited(ch.id) && (
                        <span style={{ color: 'var(--color-success)', fontSize: '0.7rem', flexShrink: 0 }}><IconCheck size={10} /></span>
                      )}
                      <span style={{ flex: 1 }}>{ch.title}</span>
                      {(() => {
                        const total = totalExercisesForChapter(ch.id);
                        if (total === 0) return null;
                        const solved = solvedExercisesForChapter(ch.id);
                        const allDone = solved === total;
                        return (
                          <span style={{
                            fontSize: '0.6rem',
                            color: allDone ? 'var(--color-success)' : 'var(--color-text-muted)',
                            fontWeight: 400,
                            flexShrink: 0,
                          }}>
                            {solved}/{total}
                          </span>
                        );
                      })()}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          flexShrink: 0,
        }}>
          <span>{visitedCount}/{allChapters.length} chapters read</span>
          {visitedCount > 0 && (
            <button
              onClick={() => { if (confirm('Reset all progress and exercises?')) resetProgress(); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                textDecoration: 'underline',
                padding: 0,
                marginLeft: '0.5rem',
              }}
            >
              reset
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

function ProgressBar() {
  const location = useLocation();
  const currentPath = location.pathname.replace('/', '');
  const idx = allChapters.findIndex(c => c.id === currentPath);
  const progress = idx >= 0 ? ((idx + 1) / allChapters.length) * 100 : 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      zIndex: 100,
      background: 'var(--color-bg-secondary)',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'var(--color-accent)',
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}

type ThemePreference = 'system' | 'light' | 'dark';

function getEffectiveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref !== 'system') return pref;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem('theme-preference');
    return (stored === 'light' || stored === 'dark') ? stored : 'system';
  });

  const applyTheme = useCallback((pref: ThemePreference) => {
    const effective = getEffectiveTheme(pref);
    document.documentElement.setAttribute('data-theme', effective);
  }, []);

  useEffect(() => {
    applyTheme(preference);
  }, [preference, applyTheme]);

  // Listen for OS theme changes when preference is 'system'
  useEffect(() => {
    if (preference !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference, applyTheme]);

  const cycle = useCallback(() => {
    setPreference(prev => {
      const next: ThemePreference = prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system';
      if (next === 'system') {
        localStorage.removeItem('theme-preference');
      } else {
        localStorage.setItem('theme-preference', next);
      }
      return next;
    });
  }, []);

  return { preference, cycle };
}

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  if (preference === 'light') return <IconSun />;
  if (preference === 'dark') return <IconMoon />;
  return <IconSystem />;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { preference, cycle } = useTheme();

  return (
    <div style={{ minHeight: '100vh' }}>
      <ProgressBar />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header style={{
        position: 'fixed',
        top: 3,
        left: sidebarOpen ? 'var(--sidebar-width)' : 0,
        right: 0,
        height: 48,
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        zIndex: 30,
        transition: 'left 0.25s ease',
        gap: '1rem',
      }}>
        <button
          onClick={() => setSidebarOpen(v => !v)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
          }}
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <IconArrowLeft size={16} /> : <IconMenu size={16} />}
        </button>
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          fontWeight: 500,
          flex: 1,
        }}>
          React for Svelte Developers
        </span>
        <button
          onClick={cycle}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '1.1rem',
            padding: '0.25rem 0.5rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ThemeIcon preference={preference} />
        </button>
      </header>

      <main style={{
        marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0,
        paddingTop: 'calc(48px + 3px)',
        transition: 'margin-left 0.25s ease',
        minHeight: '100vh',
      }}>
        <div style={{ padding: '2rem 2.5rem 4rem' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            {allChapters.map(ch => {
              const Comp = chapterComponents[ch.id];
              return Comp ? <Route key={ch.id} path={`/${ch.id}`} element={<Comp />} /> : null;
            })}
          </Routes>
        </div>
      </main>
    </div>
  );
}
