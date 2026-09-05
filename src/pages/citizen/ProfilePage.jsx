import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Layers,
  Settings,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Globe,
  Bell,
  ShieldCheck,
  Smartphone,
  Mail,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import citizensData from '../../data/users/citizens.json';
import ownershipData from '../../data/parcels/ownership.json';
import parcelsData from '../../data/parcels/parcels.json';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loginAsCitizen, logout } = useAuth();

  const currentCitizen =
    citizensData.find((c) => c.id === user?.id) ||
    citizensData[0];

  const [savedAlert, setSavedAlert] = useState(false);
  const [preferredLang, setPreferredLang] = useState('en');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  const userHoldings = ownershipData.filter((o) => o.ownerId === currentCitizen.id);
  const ownedParcelIds = userHoldings.map((h) => h.parcelId);
  const userParcels = parcelsData.filter((p) => ownedParcelIds.includes(p.ulpin));
  const totalArea = userParcels.reduce((acc, p) => acc + (p.area || 0), 0);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 4000);
  };

  const handleSwitchCitizen = (citizenId) => {
    loginAsCitizen(citizenId);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 4000);
  };

  return (
    <div className="page-profile" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            DigiLocker & MeriPehchan Citizen Account
          </span>
          <Badge variant="success">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={12} strokeWidth={2.5} />
              e-KYC VERIFIED
            </span>
          </Badge>
        </div>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0, fontWeight: 700 }}>
          Citizen Profile & Landholder Settings
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
          Manage your Aadhaar-linked land identity, communication preferences, and landholder portfolio.
        </p>
      </div>

      {savedAlert && (
        <Alert variant="success">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} />
            Profile & notification settings updated successfully.
          </span>
        </Alert>
      )}

      {/* Switch Demo Citizen Selector */}
      <Card style={{ padding: '1rem', background: 'var(--ux4g-surface-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ux4g-primary)' }}>
              Demo Khatedar Persona Switcher:
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)', marginLeft: '0.5rem' }}>
              Switch between simulated landholders across Maharashtra and Rajasthan
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {citizensData.slice(0, 5).map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant={currentCitizen.id === c.id ? 'primary' : 'outline'}
                onClick={() => handleSwitchCitizen(c.id)}
              >
                {c.name.split(' ')[0]} ({c.stateCode})
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Grid: Profile Identity & Land Portfolio */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Personal & KYC Identity */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--ux4g-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {currentCitizen.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--ux4g-primary)', fontWeight: 700 }}>
                {currentCitizen.name}
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)' }}>
                {currentCitizen.localName} &bull; Citizen ID: <strong>{currentCitizen.id}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--ux4g-border-subtle)' }}>
              <span style={{ color: 'var(--ux4g-text-muted)' }}>Aadhaar Identity Hash:</span>
              <code style={{ fontWeight: 600 }}>{currentCitizen.aadhaarHash}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--ux4g-border-subtle)' }}>
              <span style={{ color: 'var(--ux4g-text-muted)' }}>PAN Number:</span>
              <code style={{ fontWeight: 600 }}>{currentCitizen.pan}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--ux4g-border-subtle)' }}>
              <span style={{ color: 'var(--ux4g-text-muted)' }}>Registered Mobile:</span>
              <strong>{currentCitizen.mobile}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--ux4g-border-subtle)' }}>
              <span style={{ color: 'var(--ux4g-text-muted)' }}>Email ID:</span>
              <strong>{currentCitizen.email}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--ux4g-border-subtle)' }}>
              <span style={{ color: 'var(--ux4g-text-muted)' }}>Registered Address:</span>
              <div style={{ textAlign: 'right', maxWidth: '200px' }}>{currentCitizen.address}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--ux4g-text-muted)' }}>DigiLocker Status:</span>
              <Badge variant="success">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  Linked & Verified
                </span>
              </Badge>
            </div>
          </div>
        </Card>

        {/* Land Portfolio Summary */}
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: 'var(--ux4g-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={18} />
            Landholding Portfolio Summary
          </h3>

          <div
            style={{
              background: 'var(--ux4g-surface-muted)',
              padding: '1rem',
              borderRadius: 'var(--ux4g-radius-md)',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Parcels Owned:</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ux4g-primary)' }}>
                  {userParcels.length} Parcels
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Total Area:</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ux4g-success)' }}>
                  {totalArea.toFixed(2)} Ha
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--ux4g-text)' }}>Registered Land Parcels (Form 8A):</span>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
              {userParcels.map((p) => (
                <li key={p.ulpin} style={{ marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--ux4g-font-mono)', fontWeight: 600 }}>{p.ulpin}</span> — {p.villageName} (Gat {p.gatNumber || p.surveyNumber}, {p.area} {p.areaUnit})
                </li>
              ))}
            </ul>
          </div>

          <Button variant="outline" size="sm" onClick={() => navigate('/citizen/parcels')} style={{ width: '100%' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', width: '100%' }}>
              Manage Landholdings & Form 8A
              <ArrowRight size={14} />
            </span>
          </Button>
        </Card>
      </div>

      {/* Preferences Form */}
      <Card style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: 'var(--ux4g-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Settings size={18} />
          Notification & Language Preferences
        </h3>

        <form onSubmit={handleSavePreferences}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="ux4g-form-group" style={{ margin: 0 }}>
              <label className="ux4g-label">Preferred Portal Language</label>
              <select
                className="ux4g-select"
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value)}
              >
                <option value="en">English</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            <div>
              <label className="ux4g-label">Communication Channels</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.35rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                  />
                  <span>SMS Alerts for e-Ferfar mutation notices & status changes</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  />
                  <span>WhatsApp instant delivery for 7/12 & 8A PDF extracts</span>
                </label>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--ux4g-border-subtle)', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Button
              type="button"
              variant="outline"
              style={{ color: 'var(--ux4g-danger)', borderColor: 'var(--ux4g-danger)' }}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <LogOut size={15} />
                Sign Out from Citizen Portal
              </span>
            </Button>
            <Button type="submit" variant="primary">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={15} />
                Save Preferences
              </span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
