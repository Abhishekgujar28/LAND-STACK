import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Main Navigation bar
 */
export const Navbar = ({ items = [], className = '' }) => {
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
      className={`ux4g-navbar ${className}`.trim()}
      style={{
        background: 'var(--ux4g-primary)',
        color: '#ffffff',
      }}
    >
      <div className="ux4g-container d-flex align-center justify-between">
        <div className="d-flex align-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                color: '#ffffff',
                padding: '0.75rem 1.1rem',
                display: 'inline-block',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: isActive ? '3px solid var(--ux4g-accent)' : '3px solid transparent',
                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
