import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { navigation } from '../../routes/navigation';
import Logo from '../common/Logo';

function isGroupActive(item, pathname) {
  if (pathname.startsWith('/fdtl/configuration')) return false;
  return item.matches?.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default function Sidebar({ collapsed, onNavigate }) {
  const { pathname } = useLocation();
  const [openGroups, setOpenGroups] = useState({ FDTL: true });

  // Auto-expand the group containing the current page.
  useEffect(() => {
    navigation.forEach((item) => {
      if (item.children && isGroupActive(item, pathname)) {
        setOpenGroups((current) => ({ ...current, [item.label]: true }));
      }
    });
  }, [pathname]);

  const linkClass = ({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`;

  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="sidebar__brand">
        <Logo size={34} showText={!collapsed} subtitle="Operations" />
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          if (!item.children) {
            return (
              <NavLink key={item.path} to={item.path} className={linkClass} onClick={onNavigate} title={collapsed ? item.label : undefined}>
                <Icon size={19} />
                <span className="sidebar__label">{item.label}</span>
              </NavLink>
            );
          }

          const groupActive = isGroupActive(item, pathname);
          const isOpen = openGroups[item.label] && !collapsed;
          return (
            <div key={item.label} className="sidebar__group">
              {collapsed ? (
                <NavLink to={item.path} className={() => `sidebar__link ${groupActive ? 'is-active' : ''}`} onClick={onNavigate} title={item.label}>
                  <Icon size={19} />
                </NavLink>
              ) : (
                <button
                  type="button"
                  className={`sidebar__link sidebar__group-toggle ${groupActive ? 'is-group-active' : ''}`}
                  onClick={() => setOpenGroups((current) => ({ ...current, [item.label]: !current[item.label] }))}
                  aria-expanded={isOpen}
                >
                  <Icon size={19} />
                  <span className="sidebar__label">{item.label}</span>
                  <ChevronDown size={16} className={`sidebar__chevron ${isOpen ? 'is-open' : ''}`} />
                </button>
              )}
              {isOpen && (
                <div className="sidebar__children">
                  {item.children.map((child) => (
                    <NavLink key={child.path} to={child.path} end={child.end} className={({ isActive }) => `sidebar__sublink ${isActive ? 'is-active' : ''}`} onClick={onNavigate}>
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="sidebar__footer">
          <p>Rule pack: NSOP India 2025.01</p>
          <p>Prototype build · v0.1.0</p>
        </div>
      )}
    </aside>
  );
}
