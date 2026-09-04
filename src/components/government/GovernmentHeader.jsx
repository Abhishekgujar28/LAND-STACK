import React from 'react';
import Header from '../layout/Header';
import UserMenu from '../common/UserMenu';
import Badge from '../ui/Badge';

/**
 * GovernmentHeader component
 */
export const GovernmentHeader = ({ user, jurisdiction = 'Pune District / Haveli Tehsil', className = '' }) => {
  const actions = (
    <div className="d-flex align-center gap-3">
      <Badge variant="warning">{jurisdiction}</Badge>
      <UserMenu user={user || { name: 'Sanjay Deshmukh', role: 'TEHSILDAR' }} />
    </div>
  );

  return <Header actions={actions} className={className} />;
};

export default GovernmentHeader;
