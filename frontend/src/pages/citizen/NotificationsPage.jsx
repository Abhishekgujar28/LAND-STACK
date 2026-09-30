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
    const isRead = n.is_read != null ? n.is_read : n.read;
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'UNREAD') return !isRead;
    return n.type === selectedFilter;
  });

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.debug('Mark as read error:', err);
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true, is_read: true } : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(currentCitizen.id);
    } catch (err) {
      console.debug('Mark all read error:', err);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, is_read: true })));
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

  const getNotifCardClass = (type) => {
    const map = { MUTATION: 'notif-card-mutation', SECURITY: 'notif-card-security', COURT: 'notif-card-court', TAX: 'notif-card-tax', DOCUMENT: 'notif-card-document' };
    return map[type] || '';
  };

  const getIconClass = (type) => {
    const map = { MUTATION: 'mutation', SECURITY: 'security', COURT: 'court', TAX: 'tax', DOCUMENT: 'document' };
    return map[type] || 'default';
  };

  return (
    <div className="page-notifications" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Citizen Landholder Alerts &amp; Notices
            </span>
            <Badge variant="info">Real-Time Event Mesh</Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0, fontWeight: 700 }}>
            Notifications &amp; Official Alerts
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Official alerts regarding e-Ferfar mutation sanctions, Form 135D notices, document generation, and land revenue dues.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCheck size={14} /> Mark All as Read
          </span>
        </Button>
      </div>

      {toastMsg && (
        <Alert variant="success">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} /> {toastMsg}
          </span>
        </Alert>
      )}

      {/* Filter Tabs */}
      <div className="ux4g-tab-strip">
        {[
          { key: 'ALL', label: `All (${notifications.length})` },
          { key: 'UNREAD', label: `Unread (${notifications.filter((n) => !(n.is_read ?? n.read)).length})` },
          { key: 'DOCUMENT', label: 'Documents' },
          { key: 'MUTATION', label: 'Mutations' },
          { key: 'SECURITY', label: 'Security' },
          { key: 'TAX', label: 'Tax & Dues' },
          { key: 'COURT', label: 'Court Notices' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`ux4g-tab-btn${selectedFilter === tab.key ? ' active' : ''}`}
            onClick={() => setSelectedFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <Card style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--ux4g-surface-muted)', color: 'var(--ux4g-text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Bell size={30} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>No Notifications Found</h3>
          <p style={{ color: 'var(--ux4g-text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            You're all caught up. Alerts for mutations, tax dues, and document updates will appear here.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredNotifs.map((notif) => {
            const isRead = notif.is_read != null ? notif.is_read : notif.read;
            const notifDate = notif.created_at || notif.date;
            return (
              <Card
                key={notif.id}
                className={`ux4g-card-hover ${getNotifCardClass(notif.type)} ${!isRead ? 'notif-card-unread' : ''}`}
                style={{ padding: '1rem 1.25rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                    {/* Icon container with type-specific color */}
                    <div className={`notif-icon-wrap ${getIconClass(notif.type)}`} style={{ marginTop: '2px' }}>
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ux4g-primary)', fontWeight: 700, lineHeight: 1.3 }}>
                          {notif.title}
                        </h4>
                        <Badge variant={getTypeBadgeVariant(notif.type)}>{notif.type}</Badge>
                        {!isRead && (
                          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--ux4g-warning)', flexShrink: 0 }} />
                        )}
                      </div>
                      <p style={{ margin: '0.2rem 0 0.4rem', fontSize: '0.85rem', color: 'var(--ux4g-text)', lineHeight: 1.5 }}>
                        {notif.message}
                      </p>
                      <div style={{ fontSize: '0.73rem', color: 'var(--ux4g-text-muted)' }}>
                        {notifDate ? new Date(notifDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'}
                        {notif.parcelId && (
                          <span> · ULPIN: <code style={{ color: 'var(--ux4g-primary)', fontFamily: 'var(--ux4g-font-mono)' }}>{notif.parcelId}</code></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
                    {!isRead && (
                      <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notif.id)}>
                        Mark Read
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => navigate(getActionRoute(notif))}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        View <ArrowRight size={13} />
                      </span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
