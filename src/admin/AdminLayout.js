import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/users', label: 'Users' },
  ];

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <h2 style={styles.logo}>TechZone</h2>
          <p style={styles.adminBadge}>Admin Panel</p>
        </div>

        <nav style={styles.nav}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.activeLink : {}) })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <p style={styles.userName}>{user?.name}</p>
          <NavLink to="/" style={styles.viewSite}>View Site</NavLink>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#ffffff' },
  sidebar: { width: '240px', background: '#1e293b', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' },
  logoArea: { padding: '24px 20px', borderBottom: '1px solid #334155' },
  logo: { color: '#ffffff', margin: 0, fontSize: '20px', fontWeight: '800' },
  adminBadge: { color: '#94a3b8', fontSize: '12px', margin: '4px 0 0', fontWeight: '600' },
  nav: { flex: 1, padding: '16px 0' },
  navLink: { display: 'block', padding: '12px 20px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '500', borderLeft: '3px solid transparent', transition: 'all 0.2s' },
  activeLink: { color: '#ffffff', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '3px solid #ffffff' },
  sidebarBottom: { padding: '20px', borderTop: '1px solid #334155' },
  userName: { color: '#cbd5e1', fontSize: '13px', margin: '0 0 12px' },
  viewSite: { display: 'block', color: '#94a3b8', textDecoration: 'none', fontSize: '13px', marginBottom: '8px' },
  logoutBtn: { width: '100%', background: 'transparent', color: '#cbd5e1', border: '1px solid #475569', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' },
  main: { flex: 1, padding: '32px', overflow: 'auto' },
};

export default AdminLayout;
