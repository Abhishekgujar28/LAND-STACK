import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Main Navigation bar
 * Displays navigation links on the left and login buttons on the right
 */
export const Navbar = ({ items = [], actions = null, className = '' }) => {
  const defaultItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Help', path: '/help' },
    { label: 'Contact', path: '/contact' },
  ];

  const navItems = items.length > 0 ? items : defaultItems;

  return (
    <nav
      className={`navbar-main ${className}`.trim()}
      style={{
        background: 'var(--primary, #064e3b)',
        color: '#ffffff',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div
        className="ux4g-container d-flex align-center justify-between"
        style={{ minHeight: '38px', flexWrap: 'wrap' }}
      >
        <div className="d-flex align-center" style={{ flexWrap: 'wrap' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                color: '#ffffff',
                padding: '0.5rem 0.95rem',
                display: 'inline-block',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: isActive ? '3px solid var(--secondary, #ea580c)' : '3px solid transparent',
                backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                transition: 'all 0.15s ease-in-out',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right side of navbar: Login buttons */}
        {actions && (
          <div
            className="navbar-actions d-flex align-center gap-2"
            style={{ marginLeft: 'auto', padding: '0.2rem 0' }}
          >
            {actions}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
