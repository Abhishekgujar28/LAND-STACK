import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  FileText,
  Landmark,
  Layers,
  HelpCircle,
  Phone,
  ChevronDown,
} from 'lucide-react';

/**
 * Main Navigation bar
 * Clean, official government portal navigation with Lucide icons, dropdown indicators, and auth actions
 */
export const Navbar = ({ items = [], actions = null, className = '' }) => {
  const defaultItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Services', path: '/services', icon: FileText, hasDropdown: true },
    { label: 'About Us', path: '/about', icon: Landmark, hasDropdown: true },
    { label: 'Resources', path: '/resources', icon: Layers, hasDropdown: true },
    { label: 'Help & Support', path: '/help', icon: HelpCircle, hasDropdown: true },
    { label: 'Contact Us', path: '/contact', icon: Phone },
  ];

  const navItems = items.length > 0 ? items : defaultItems;

  return (
    <nav
      className={`navbar-main ${className}`.trim()}
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      <div
        className="ux4g-container d-flex align-center justify-between"
        style={{ minHeight: '44px', flexWrap: 'wrap', gap: '0.5rem', padding: '0.2rem 1rem' }}
      >
        {/* Navigation Links */}
        <div className="d-flex align-center" style={{ flexWrap: 'wrap', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  color: isActive ? '#ea580c' : '#064e3b',
                  padding: '0.45rem 0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 600,
                  textDecoration: 'none',
                  borderRadius: '6px',
                  transition: 'all 0.15s ease-in-out',
                  letterSpacing: '0.01em',
                })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(6, 78, 59, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {IconComponent && <IconComponent size={15} strokeWidth={2.2} />}
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDown size={13} strokeWidth={2.5} style={{ opacity: 0.7, marginLeft: '-1px' }} />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Right side: Login buttons */}
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
