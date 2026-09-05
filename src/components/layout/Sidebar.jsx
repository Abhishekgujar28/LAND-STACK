import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Common Sidebar component with responsive nav support and count badges
 */
export const Sidebar = ({ title, items = [], className = '', onNavClick = null }) => {
  return (
    <aside
      className={`ux4g-sidebar ${className}`.trim()}
      style={{
        width: 'var(--ux4g-sidebar-width)',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--ux4g-border-subtle)',
        minHeight: 'calc(100vh - 120px)',
        padding: '1.25rem 0',
      }}
    >
      {title && (
        <div
          style={{
            padding: '0 1.25rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--ux4g-text-muted)',
          }}
        >
          {title}
        </div>
      )}
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                onClick={() => onNavClick && onNavClick(item)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 1.25rem',
                  color: isActive ? 'var(--ux4g-primary)' : 'var(--ux4g-text)',
                  backgroundColor: isActive ? 'var(--ux4g-primary-light)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  borderLeft: isActive ? '4px solid var(--ux4g-primary)' : '4px solid transparent',
                  transition: 'background-color var(--ux4g-transition-fast)',
                })}
              >
                {item.icon && <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      background: 'var(--ux4g-primary-light)',
                      color: 'var(--ux4g-primary)',
                      border: '1px solid rgba(11,60,93,0.15)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
