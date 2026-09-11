import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Plus,
  Bell,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import watchlistService from '../../services/watchlistService';
import parcelService from '../../services/parcelService';
import { DEFAULT_CITIZENS } from '../../context/authConstants';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import WatchlistCard from '../../components/citizen/WatchlistCard';

export const WatchlistPage = () => {
  const { user } = useAuth();
  const currentCitizen = user || DEFAULT_CITIZENS[0];

  const [watchlistItems, setWatchlistItems] = useState([]);
  const [allParcels, setAllParcels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUlpin, setSelectedUlpin] = useState('');
  const [alertOnMutation, setAlertOnMutation] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    watchlistService.getWatchlist({ citizenId: currentCitizen.id }).then((items) => {
      if (Array.isArray(items)) setWatchlistItems(items);
    }).catch(() => {});

    parcelService.getParcels().then((parcels) => {
      if (Array.isArray(parcels)) setAllParcels(parcels);
    }).catch(() => {});
  }, [currentCitizen.id]);

  const handleRemove = async (id) => {
    try {
      await watchlistService.removeFromWatchlist(id);
    } catch {}
    setWatchlistItems((prev) => prev.filter((item) => item.id !== id));
    setToastMsg('Parcel removed from your watchlist.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleAddWatchlist = async (e) => {
    e.preventDefault();
    const parcel = allParcels.find((p) => p.ulpin === selectedUlpin) || allParcels[0] || { ulpin: selectedUlpin, villageName: 'Wagholi', status: 'CLEAR' };

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

    try {
      await watchlistService.addToWatchlist(newItem);
    } catch {}

    setWatchlistItems((prev) => [newItem, ...prev]);
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
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Real-Time Cadastral Intelligence & Monitoring
            </span>
            <Badge variant="warning">Early Fraud Detection</Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0, fontWeight: 700 }}>
            Land Parcel Watchlist
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Receive instant SMS and email notifications whenever an e-Ferfar mutation, mortgage charge, or court case is initiated on monitored lands.
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={16} />
            Add Parcel to Watchlist
          </span>
        </Button>
      </div>

      {toastMsg && (
        <Alert variant="info">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} />
            {toastMsg}
          </span>
        </Alert>
      )}

      {/* Watchlist Grid */}
      {watchlistItems.length === 0 ? (
        <Card style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--ux4g-surface-muted)',
              color: 'var(--ux4g-text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Bookmark size={28} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>No Monitored Parcels in Watchlist</h3>
          <p style={{ color: 'var(--ux4g-text-secondary)', maxWidth: '460px', margin: '0 auto 1.25rem', fontSize: '0.9rem' }}>
            Monitor your ancestral lands, prospective purchase plots, or family shares to prevent unauthorized entries.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Plus size={14} />
              Add Your First Parcel to Watchlist
            </span>
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

      {/* Add to Watchlist Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Land Parcel to Early Fraud Watchlist"
        >
          <form onSubmit={handleAddWatchlist}>
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Select Cadastral Parcel</label>
              <select
                className="ux4g-select"
                value={selectedUlpin}
                onChange={(e) => setSelectedUlpin(e.target.value)}
                required
              >
                <option value="">Select parcel to monitor...</option>
                {allParcels.map((p) => (
                  <option key={p.ulpin} value={p.ulpin}>
                    {p.ulpin} — {p.villageName} (Gat {p.gatNumber || p.surveyNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="ux4g-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={alertOnMutation}
                  onChange={(e) => setAlertOnMutation(e.target.checked)}
                />
                <span>Enable high-priority SMS & Email alerts on any Form 6/135D e-Ferfar mutation attempt</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Add to Watchlist
                  <ArrowRight size={14} />
                </span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default WatchlistPage;
