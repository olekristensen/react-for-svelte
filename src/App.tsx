import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { sections, allChapters } from './data/chapters';

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
import EcosystemState from './chapters/EcosystemState';
import EcosystemData from './chapters/EcosystemData';
import EcosystemForms from './chapters/EcosystemForms';
import EcosystemUI from './chapters/EcosystemUI';
import EcosystemDecisions from './chapters/EcosystemDecisions';
import NextjsIntro from './chapters/NextjsIntro';
import NextjsRouting from './chapters/NextjsRouting';
import NextjsData from './chapters/NextjsData';
import NextjsRendering from './chapters/NextjsRendering';
import NextjsServerActions from './chapters/NextjsServerActions';
import NextjsMiddleware from './chapters/NextjsMiddleware';
import NuxtIntro from './chapters/NuxtIntro';
import NuxtReactivity from './chapters/NuxtReactivity';
import NuxtRouting from './chapters/NuxtRouting';
import NuxtComparison from './chapters/NuxtComparison';

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
  'ecosystem-state': EcosystemState,
  'ecosystem-data': EcosystemData,
  'ecosystem-forms': EcosystemForms,
  'ecosystem-ui': EcosystemUI,
  'ecosystem-decisions': EcosystemDecisions,
  'nextjs-intro': NextjsIntro,
  'nextjs-routing': NextjsRouting,
  'nextjs-data': NextjsData,
  'nextjs-rendering': NextjsRendering,
  'nextjs-server-actions': NextjsServerActions,
  'nextjs-middleware': NextjsMiddleware,
  'nuxt-intro': NuxtIntro,
  'nuxt-reactivity': NuxtReactivity,
  'nuxt-routing': NuxtRouting,
  'nuxt-comparison': NuxtComparison,
};

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace('/', '');

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
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--color-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'linear-gradient(135deg, var(--color-react), var(--color-accent))',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0f172a',
            }}>R</span>
            React for Svelte Devs
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            marginTop: '0.35rem',
          }}>
            A comprehensive interactive guide
          </div>
        </div>

        <nav style={{ padding: '0.75rem 0', flex: 1, overflowY: 'auto' }}>
          {sections.map(section => (
            <div key={section.title} style={{ marginBottom: '0.5rem' }}>
              <div style={{
                padding: '0.4rem 1.25rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
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
                      onClose();
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.4rem 1.25rem 0.4rem 1.75rem',
                      background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                      border: 'none',
                      borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                      color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                      lineHeight: 1.5,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.background = 'var(--color-surface-hover)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {ch.title}
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
          {allChapters.length} chapters &middot; Built with React + Vite
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
        background: 'linear-gradient(90deg, var(--color-react), var(--color-accent))',
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: '100vh' }}>
      <ProgressBar />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header style={{
        position: 'fixed',
        top: 3,
        left: sidebarOpen ? 'var(--sidebar-width)' : 0,
        right: 0,
        height: 'var(--header-height)',
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
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
          {sidebarOpen ? '\u2190' : '\u2630'}
        </button>
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          fontWeight: 500,
        }}>
          React for Svelte Developers
        </span>
      </header>

      <main style={{
        marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0,
        paddingTop: 'calc(var(--header-height) + 3px)',
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
