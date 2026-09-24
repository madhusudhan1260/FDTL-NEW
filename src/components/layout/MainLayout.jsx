import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import LoadingState from '../common/LoadingState';

const COMPACT_BREAKPOINT = 1100;
const MOBILE_BREAKPOINT = 768;

const isCompactViewport = () => window.innerWidth < COMPACT_BREAKPOINT;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(isCompactViewport);
  const { pathname } = useLocation();

  // Collapse automatically when the viewport becomes narrow.
  useEffect(() => {
    const onResize = () => setCollapsed(isCompactViewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Scroll to top on page change.
  useEffect(() => {
    document.querySelector('.app-main')?.scrollTo(0, 0);
  }, [pathname]);

  const closeOnMobile = () => {
    if (window.innerWidth < MOBILE_BREAKPOINT) setCollapsed(true);
  };

  return (
    <div className={`app-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onNavigate={closeOnMobile} />
      {!collapsed && <div className="sidebar-backdrop" onClick={() => setCollapsed(true)} aria-hidden="true" />}
      <div className="app-shell__content">
        <Header onToggleSidebar={() => setCollapsed((current) => !current)} />
        <main className="app-main">
          {/* Keeps header & sidebar visible while a lazy page loads */}
          <Suspense fallback={<LoadingState message="Loading page…" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
