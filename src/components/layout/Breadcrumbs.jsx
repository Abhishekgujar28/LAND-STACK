import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Breadcrumb from '../ui/Breadcrumb';

/**
 * Route-aware Breadcrumbs
 */
export const Breadcrumbs = ({ customItems = null, className = '' }) => {
  const location = useLocation();

  if (customItems) {
    return <Breadcrumb items={customItems} className={className} />;
  }

  const pathnames = location.pathname.split('/').filter((x) => x);
  const items = [{ label: 'Home', href: '/' }];

  let currentPath = '';
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = segment
      .replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase());
    items.push({ label, href: currentPath });
  });

  return <Breadcrumb items={items} className={className} />;
};

export default Breadcrumbs;
