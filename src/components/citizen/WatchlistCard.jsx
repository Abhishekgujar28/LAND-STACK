import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatusBadge from '../common/StatusBadge';

/**
 * WatchlistCard component for citizen's monitored parcels
 */
export const WatchlistCard = ({ item, onRemove, className = '' }) => {
  if (!item) return null;

  return (
    <Card className={`citizen-watchlist-card ${className}`.trim()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Watchlist Parcel</span>
          <h4 style={{ margin: '0.2rem 0', fontFamily: 'var(--ux4g-font-mono)', color: 'var(--ux4g-primary)' }}>
            {item.ulpin}
          </h4>
          <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
            {item.villageName}, Tehsil {item.tehsilName || 'Pune'}
          </div>
        </div>
        <StatusBadge status={item.status || 'CLEAR'} />
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>
        Added: {item.addedDate} &bull; Alert on mutations: {item.alertOnMutation ? 'Yes' : 'No'}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
        {onRemove && (
          <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
            Remove
          </Button>
        )}
        <Link to={`/citizen/parcels/${item.ulpin}`}>
          <Button variant="outline" size="sm">
            View Parcel
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default WatchlistCard;
