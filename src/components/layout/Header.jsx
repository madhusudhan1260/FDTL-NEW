import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, User, Settings, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getNotifications } from '../../services/fdtlService';
import useAsync from '../../hooks/useAsync';

const notificationIcons = { violation: XCircle, warning: AlertTriangle, info: Info };

/** Closes a dropdown when clicking outside of `ref`. */
function useClickOutside(ref, onOutside) {
  useEffect(() => {
    const handler = (event) => ref.current && !ref.current.contains(event.target) && onOutside();
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onOutside]);
}

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const { data: notifications } = useAsync(getNotifications, []);

  useClickOutside(menuRef, () => setOpenMenu(null));

  const toggle = (menu) => setOpenMenu((current) => (current === menu ? null : menu));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="app-header">
      <div className="app-header__left">
        <button type="button" className="icon-button icon-button--dark" onClick={onToggleSidebar} aria-label="Toggle navigation">
          <Menu size={20} />
        </button>
        <div className="app-header__title">
          <span className="app-header__brand">MADDY AVIATION</span>
          <span className="app-header__divider" aria-hidden="true" />
          <span className="app-header__app">FDTL Management System</span>
        </div>
      </div>

      <div className="app-header__right" ref={menuRef}>
        <div className="dropdown">
          <button type="button" className="icon-button icon-button--dark" onClick={() => toggle('notifications')} aria-label="Notifications">
            <Bell size={19} />
            {notifications?.length > 0 && <span className="notification-dot">{notifications.length}</span>}
          </button>
          {openMenu === 'notifications' && (
            <div className="dropdown__menu dropdown__menu--wide">
              <p className="dropdown__heading">Notifications</p>
              {notifications?.map((item) => {
                const Icon = notificationIcons[item.type];
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`notification notification--${item.type}`}
                    onClick={() => {
                      setOpenMenu(null);
                      navigate(item.type === 'info' ? '/fdtl/configuration' : '/fdtl/violations');
                    }}
                  >
                    <Icon size={16} />
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <time>{item.time}</time>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="dropdown">
          <button type="button" className="user-chip" onClick={() => toggle('user')} aria-haspopup="menu" aria-expanded={openMenu === 'user'}>
            <span className="avatar">{user?.initials ?? 'PT'}</span>
            <span className="user-chip__text">
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </span>
            <ChevronDown size={16} />
          </button>
          {openMenu === 'user' && (
            <div className="dropdown__menu" role="menu">
              <div className="dropdown__profile">
                <strong>{user?.name}</strong>
                <small>{user?.email}</small>
              </div>
              <button type="button" className="dropdown__item" role="menuitem" onClick={() => setOpenMenu(null)}>
                <User size={16} /> My Profile
              </button>
              <button type="button" className="dropdown__item" role="menuitem" onClick={() => { setOpenMenu(null); navigate('/fdtl/configuration'); }}>
                <Settings size={16} /> Configuration
              </button>
              <button type="button" className="dropdown__item dropdown__item--danger" role="menuitem" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
