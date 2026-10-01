import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  FileText,
  Landmark,
  Layers,
  Award,
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
    { label: 'Schemes', path: '/schemes', icon: Award, hasDropdown: true },
    { label: 'About Us', path: '/about', icon: Landmark, hasDropdown: true },
    { label: 'Help & Support', path: '/help', icon: HelpCircle, hasDropdown: true },
  ];

  const navItems = items.length > 0 ? items : defaultItems;

  return (
    <nav
      className={`navbar-main ${className}`.trim()}
      style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '0.2rem 2rem',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          boxSizing: 'border-box',
        }}
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
