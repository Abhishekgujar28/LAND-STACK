import React from 'react';

/**
 * UX4G Breadcrumb Wrapper
 * @param {Array<{ label: string, href?: string, active?: boolean }>} items
 */
export const Breadcrumb = ({ items = [], separator = '/', className = '' }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`ux4g-breadcrumb ${className}`.trim()}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="ux4g-breadcrumb-item">
              {item.href && !isLast ? (
                <a href={item.href} className="text-secondary">
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  style={{ color: isLast ? 'var(--ux4g-primary)' : 'inherit', fontWeight: isLast ? 600 : 400 }}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span className="ux4g-breadcrumb-separator">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
