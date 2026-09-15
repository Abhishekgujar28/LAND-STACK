import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  FileText,
  GitPullRequest,
  ShieldCheck,
  IndianRupee,
  Scale,
  Compass,
  CheckCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import notificationService from '../../services/notificationService';


import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentCitizen = user;

  const [notifications, setNotifications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    notificationService.getNotifications({ citizenId: currentCitizen.id }).then((data) => {
      if (Array.isArray(data)) setNotifications(data);
    }).catch(() => {});
  }, [currentCitizen.id]);

  const filteredNotifs = notifications.filter((n) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'UNREAD') return !n.read;
    return n.type === selectedFilter;
  });

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.debug('Mark as read error:', err);
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(currentCitizen.id);
    } catch (err) {
      console.debug('Mark all read error:', err);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToastMsg('All notifications marked as read.');
    
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'MUTATION':
        return 'primary';
      case 'SECURITY':
      case 'COURT':
        return 'danger';
      case 'TAX':
        return 'warning';
      case 'DOCUMENT':
        return 'success';
      default:
        return 'neutral';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'DOCUMENT':
        return <FileText size={20} className="text-primary" />;
      case 'MUTATION':
        return <GitPullRequest size={20} className="text-primary" />;
      case 'SECURITY':
        return <ShieldCheck size={20} className="text-danger" />;
      case 'TAX':
        return <IndianRupee size={20} className="text-warning" />;
      case 'COURT':
        return <Scale size={20} className="text-danger" />;
      case 'SURVEY':
        return <Compass size={20} className="text-info" />;
      default:
        return <Bell size={20} className="text-primary" />;
    }
  };

  const getActionRoute = (notif) => {
    if (notif.parcelId) return `/citizen/parcels/${notif.parcelId}`;
    if (notif.type === 'DOCUMENT') return '/citizen/documents';
    if (notif.type === 'MUTATION') return '/citizen/mutations';
    return '/citizen/dashboard';
  };

  return (
    <div className="page-notifications" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Citizen Landholder Alerts & Notices
            </span>
            <Badge variant="info">Real-Time Event Mesh</Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0, fontWeight: 700 }}>
            Notifications & Official Alerts
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Official alerts regarding e-Ferfar mutation sanctions, Form 135D notices, document generation, and land revenue dues.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCheck size={14} />
            Mark All as Read
          </span>
        </Button>
      </div>

      {toastMsg && (
        <Alert variant="success">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} />
            {toastMsg}
          </span>
        </Alert>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '1px solid var(--ux4g-border-subtle)' }}>
        {[
          { key: 'ALL', label: `All (${notifications.length})` },
          { key: 'UNREAD', label: `Unread (${notifications.filter((n) => !n.read).length})` },
          { key: 'DOCUMENT', label: 'Documents' },
          { key: 'MUTATION', label: 'Mutations' },
          { key: 'SECURITY', label: 'Security & Liens' },
          { key: 'TAX', label: 'Tax & Dues' },
          { key: 'COURT', label: 'Court Notices' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSelectedFilter(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderBottom: selectedFilter === tab.key ? '3px solid var(--ux4g-primary)' : '3px solid transparent',
              background: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: selectedFilter === tab.key ? 'var(--ux4g-primary)' : 'var(--ux4g-text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--ux4g-transition-fast)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
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
            <Bell size={28} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>No Notifications Found</h3>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            You are all caught up with your land records and alerts.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredNotifs.map((notif) => (
            <Card
              key={notif.id}
              style={{
                padding: '1.25rem',
                borderLeft: notif.read ? '1px solid var(--ux4g-border-subtle)' : '4px solid var(--ux4g-primary)',
                background: notif.read ? '#ffffff' : '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--ux4g-radius-md)',
                      background: 'var(--ux4g-surface-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--ux4g-primary)', fontWeight: 600 }}>
                        {notif.title}
                      </h4>
                      <Badge variant={getTypeBadgeVariant(notif.type)}>{notif.type}</Badge>
                      {!notif.read && <Badge variant="warning">NEW</Badge>}
                    </div>
                    <p style={{ margin: '0.25rem 0 0.5rem', fontSize: '0.875rem', color: 'var(--ux4g-text)' }}>
                      {notif.message}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>
                      {notif.date ? new Date(notif.date).toLocaleString('en-IN') : 'Recent'}
                      {notif.parcelId && (
                        <span> &bull; ULPIN: <code style={{ color: 'var(--ux4g-primary)' }}>{notif.parcelId}</code></span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {!notif.read && (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notif.id)}>
                      Mark as Read
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => navigate(getActionRoute(notif))}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      View Details
                      <ArrowRight size={13} />
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
