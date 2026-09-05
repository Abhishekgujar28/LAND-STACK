import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import citizensData from '../../data/users/citizens.json';
import watchlistData from '../../data/watchlist/watchlist.json';
import parcelsData from '../../data/parcels/parcels.json';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import WatchlistCard from '../../components/citizen/WatchlistCard';

export const WatchlistPage = () => {
  const { user } = useAuth();
  const currentCitizen =
    citizensData.find((c) => c.id === user?.id) ||
    citizensData[0];

  const [watchlistItems, setWatchlistItems] = useState(() =>
    watchlistData.filter((w) => w.userId === currentCitizen.id)
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUlpin, setSelectedUlpin] = useState('');
  const [alertOnMutation, setAlertOnMutation] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const handleRemove = (id) => {
    setWatchlistItems(watchlistItems.filter((item) => item.id !== id));
    setToastMsg('Parcel removed from your watchlist.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleAddWatchlist = (e) => {
    e.preventDefault();
    const parcel = parcelsData.find((p) => p.ulpin === selectedUlpin) || parcelsData[0];

    const newItem = {
      id: `WCH-0${String(watchlistItems.length + 11).padStart(2, '0')}`,
      userId: currentCitizen.id,
      ulpin: parcel.ulpin,
      villageName: parcel.villageName,
      tehsilName: parcel.tehsilCode || 'Haveli',
      status: parcel.status,
      addedDate: new Date().toISOString().split('T')[0],
      alertOnMutation,
    };

    setWatchlistItems([newItem, ...watchlistItems]);
    setShowAddModal(false);
    setSelectedUlpin('');
    setToastMsg(`Added ${parcel.ulpin} (${parcel.villageName}) to your active Watchlist.`);
    setTimeout(() => setToastMsg(''), 5000);
  };

  return (
    <div className="page-watchlist" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase' }}>
              Real-Time Cadastral Intelligence & Monitoring
            </span>
            <Badge variant="warning">Early Fraud Detection</Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0 }}>
            Land Parcel Watchlist
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Receive instant SMS and email notifications whenever an e-Ferfar mutation, mortgage charge, or court case is initiated on monitored lands.
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          + Add Parcel to Watchlist
        </Button>
      </div>

      {toastMsg && <Alert variant="info">{toastMsg}</Alert>}

      {/* Watchlist Grid */}
      {watchlistItems.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--ux4g-primary)' }}>No Monitored Parcels in Watchlist</h3>
          <p style={{ color: 'var(--ux4g-text-secondary)', maxWidth: '460px', margin: '0 auto 1.25rem', fontSize: '0.9rem' }}>
            Monitor your ancestral lands, prospective purchase plots, or family shares to prevent unauthorized entries.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            + Add Your First Parcel to Watchlist
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {watchlistItems.map((item) => (
            <WatchlistCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Land Parcel to Watchlist"
        >
          <form onSubmit={handleAddWatchlist}>
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Select Cadastral Parcel (ULPIN)</label>
              <select
                className="ux4g-select"
                value={selectedUlpin}
                onChange={(e) => setSelectedUlpin(e.target.value)}
                required
              >
                <option value="">Select a parcel to watch...</option>
                {parcelsData.map((p) => (
                  <option key={p.ulpin} value={p.ulpin}>
                    {p.ulpin} — {p.villageName} (Gat {p.gatNumber || p.surveyNumber}, {p.landUse})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ background: 'var(--ux4g-surface-muted)', padding: '0.85rem', borderRadius: 'var(--ux4g-radius-md)', margin: '1rem 0' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--ux4g-primary)' }}>
                Notification Preferences:
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.35rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={alertOnMutation}
                  onChange={(e) => setAlertOnMutation(e.target.checked)}
                />
                Instant alert on new e-Ferfar mutation / Form 135D notice
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                Alert on CERSAI Bank Lien or e-Courts litigation filing
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add to Watchlist →
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default WatchlistPage;
