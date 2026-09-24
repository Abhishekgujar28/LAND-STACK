import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Eye, Trash2, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatusBadge from '../common/StatusBadge';

/**
 * WatchlistCard component for citizen's monitored parcels with Lucide icons
 * Accurately renders database properties from watchlist table & parcels join
 */
export const WatchlistCard = ({ item, onRemove, className = '' }) => {
  if (!item) return null;

  const ulpin = item.ulpin || item.parcelId || item.parcel_ulpin || 'N/A';
  const village = item.villageName || item.parcels?.village_name || item.village || 'Wagholi';
  const tehsil = item.tehsilName || item.parcels?.tehsil || 'Haveli';
  const status = item.status || item.parcels?.status || 'CLEAR';
  const addedDate = item.addedDate || (item.created_at || item.createdAt ? new Date(item.created_at || item.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'Recently');
  const alertActive = item.alertOnMutation ?? item.notify_mutations ?? item.notifyMutations ?? true;

  return (
    <Card className={`citizen-watchlist-card ${className}`.trim()} style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Bookmark size={12} color="var(--ux4g-primary, #064e3b)" />
            Monitored Title
          </span>
          <h4 style={{ margin: '0.2rem 0', fontFamily: 'var(--ux4g-font-mono)', color: 'var(--ux4g-primary, #064e3b)', fontWeight: 700 }}>
            {ulpin}
          </h4>
          <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
            {village}, Tehsil {tehsil}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--ux4g-text-muted)' }}>
        Monitored since: <strong>{addedDate}</strong> &bull; Fraud Alert: <strong>{alertActive ? 'Active (SMS/Email)' : 'Muted'}</strong>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
        {onRemove && (
          <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ux4g-danger, #dc2626)' }}>
              <Trash2 size={13} />
              Remove
            </span>
          </Button>
        )}
        <Link to={`/citizen/parcels/${ulpin}`}>
          <Button variant="outline" size="sm">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              View Title
              <ArrowRight size={13} />
            </span>
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default WatchlistCard;
