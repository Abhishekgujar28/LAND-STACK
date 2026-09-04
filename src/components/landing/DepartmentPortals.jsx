import React from 'react';
import { Link } from 'react-router-dom';

/**
 * DepartmentPortals - Grid of clickable department login/dashboard tiles
 */
export const DepartmentPortals = ({ departments = [], className = '' }) => {
  return (
    <section className={`department-portals ${className}`.trim()}>
      <div className="ux4g-container">
        <div className="section-header">
          <h2>Government Department Portals</h2>
          <p>Authorized officials can access their department-specific dashboards</p>
        </div>
        <div className="department-grid">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              to={dept.dashboardRoute}
              className="department-tile"
              style={{ '--dept-color': dept.color }}
            >
              <div className="dept-icon-wrapper" style={{ background: dept.color }}>
                <span className="dept-icon">{dept.icon}</span>
              </div>
              <div className="dept-info">
                <h3 className="dept-name">{dept.name}</h3>
                <p className="dept-description">{dept.description}</p>
                <div className="dept-roles">
                  {dept.roles.map((role) => (
                    <span key={role} className="dept-role-tag">{role.replace('_', ' ')}</span>
                  ))}
                </div>
              </div>
              <div className="dept-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentPortals;
