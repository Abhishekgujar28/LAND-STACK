import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Plus,
  Bell,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import watchlistService from '../../services/watchlistService';
import parcelService from '../../services/parcelService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import WatchlistCard from '../../components/citizen/WatchlistCard';

export const WatchlistPage = () => {
  const { user } = useAuth();
  const currentCitizen = user || {};

  const [watchlistItems, setWatchlistItems] = useState([]);
  const [allParcels, setAllParcels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUlpin, setSelectedUlpin] = useState('');
  const [alertOnMutation, setAlertOnMutation] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchWatchlist = async () => {
    if (!currentCitizen.id) return;
    setLoading(true);
    try {
      const res = await watchlistService.getWatchlist(currentCitizen.id);
      const items = Array.isArray(res) ? res : res?.data || [];
      setWatchlistItems(items);
    } catch (err) {
      console.warn('[WatchlistPage] Error loading watchlist:', err);
      setWatchlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();

    parcelService.getParcels()
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.items || res?.data || [];
        setAllParcels(list);
      })
      .catch((err) => {
        console.warn('[WatchlistPage] Error loading parcels catalog:', err);
      });
  }, [currentCitizen.id]);

  const handleRemove = async (id) => {
    try {
      await watchlistService.removeFromWatchlist(id);
      setWatchlistItems((prev) => prev.filter((item) => item.id !== id));
      setToastMsg('Parcel removed from your watchlist.');
    } catch (err) {
      console.error('[WatchlistPage] Remove watchlist error:', err);
      setToastMsg('Failed to remove parcel from watchlist.');
    }
  };

  const handleAddWatchlist = async (e) => {
    e.preventDefault();
    if (!selectedUlpin) return;
    setSubmitting(true);

    const parcel = allParcels.find((p) => p.ulpin === selectedUlpin) || {
      ulpin: selectedUlpin,
      villageName: 'Wagholi',
      status: 'CLEAR',
    };

    try {
      const payload = {
        citizenId: currentCitizen.id,
        parcelId: parcel.ulpin,
        label: `Monitored Gat ${parcel.gatNumber || parcel.gat_number || parcel.surveyNumber || parcel.ulpin.slice(-4)} (${parcel.villageName || parcel.village_name || 'Wagholi'})`,
        notifyMutations: alertOnMutation,
      };

      await watchlistService.addToWatchlist(payload);
      setShowAddModal(false);
      setSelectedUlpin('');
      setToastMsg(`Registered ${parcel.ulpin} in your database watchlist with 24/7 fraud monitoring.`);
      // Refresh strictly from backend database
      fetchWatchlist();
    } catch (err) {
      console.error('[WatchlistPage] Add watchlist error:', err);
      setToastMsg('Failed to add parcel to database watchlist. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-watchlist" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Real-Time Cadastral Intelligence &amp; Monitoring
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
      {loading ? (
        <Card style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0 }}>
            Loading your database monitored parcels...
          </p>
        </Card>
      ) : watchlistItems.length === 0 ? (
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
                <option value="">-- Choose Cadastral Parcel to Monitor --</option>
                {allParcels.map((p) => {
                  const gat = p.gatNumber || p.gat_number || p.surveyNumber || p.survey_number || 'N/A';
                  const village = p.villageName || p.village_name || 'Wagholi';
                  return (
                    <option key={p.ulpin} value={p.ulpin}>
                      Gat {gat} &bull; {p.ulpin} ({village})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="ux4g-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={alertOnMutation}
                  onChange={(e) => setAlertOnMutation(e.target.checked)}
                />
                <span>Enable high-priority SMS &amp; Email alerts on any Form 6/135D e-Ferfar mutation attempt</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting || !selectedUlpin}>
                {submitting ? 'Registering...' : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Add to Watchlist
                    <ArrowRight size={14} />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default WatchlistPage;
