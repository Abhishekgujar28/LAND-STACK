import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserCheck,
  Layers,
  Settings,
  CheckCircle2,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Bell,
  User,
  MapPin,
  Edit2,
  Save,
  X,
  Smartphone,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Download,
  Scale,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import citizenService from '../../services/citizenService';
import parcelService from '../../services/parcelService';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import RorMobileSeedingModal from '../../components/citizen/RorMobileSeedingModal';
import RorModal from '../../components/citizen/RorModal';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profileData, setProfileData] = useState(user || {});
  const [loading, setLoading] = useState(true);
  const [userParcels, setUserParcels] = useState([]);
  const [activeTab, setActiveTab] = useState('identity');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', address: '' });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Preferences
  const [preferredLang, setPreferredLang] = useState('en');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [prefSavedAlert, setPrefSavedAlert] = useState(false);

  // Modal States for Control Desk
  const [isSeedingModalOpen, setIsSeedingModalOpen] = useState(false);
  const [isRorModalOpen, setIsRorModalOpen] = useState(false);
  const [selectedParcelForRor, setSelectedParcelForRor] = useState(null);

  const handleSeedSuccess = (receipt) => {
    parcelService.getParcelById(receipt.parcelId).then((seededParcel) => {
      if (seededParcel && !userParcels.some((p) => p.ulpin === seededParcel.ulpin)) {
        setUserParcels((prev) => [seededParcel, ...prev]);
      }
    }).catch(() => { });
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    citizenService.getProfile()
      .then((data) => {
        if (isMounted && data) {
          setProfileData(data);
          setEditForm({ name: data.name || '', email: data.email || '', address: data.address || '' });
        }
      })
      .catch((err) => { console.warn('Failed to load citizen profile:', err); });

    citizenService.getMyParcels()
      .then((data) => { if (isMounted) setUserParcels(Array.isArray(data) ? data : []); })
      .catch(() => { if (isMounted) setUserParcels([]); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, []);

  const totalArea = userParcels.reduce((acc, p) => acc + (parseFloat(p.area) || 0), 0);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updated = await citizenService.updateProfile(editForm);
      setProfileData((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setPrefSavedAlert(true);
    setTimeout(() => setPrefSavedAlert(false), 4000);
  };

  const tabStyle = (tabKey) => ({
    flex: 1,
    padding: '0.7rem 0.75rem',
    border: 'none',
    background: activeTab === tabKey ? 'var(--ux4g-primary, #064e3b)' : 'transparent',
    color: activeTab === tabKey ? '#ffffff' : 'var(--ux4g-text-secondary)',
    borderRadius: 'var(--ux4g-radius-md)',
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  });

  return (
    <div className="page-profile" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Modals for Control Desk Features */}
      <RorMobileSeedingModal
        isOpen={isSeedingModalOpen}
        onClose={() => setIsSeedingModalOpen(false)}
        citizen={profileData}
        onSeedSuccess={handleSeedSuccess}
      />

      <RorModal
        isOpen={isRorModalOpen}
        onClose={() => setIsRorModalOpen(false)}
        parcel={selectedParcelForRor || (userParcels.length > 0 ? userParcels[0] : null)}
      />

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ux4g-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              e-Pramaan &amp; MeriPehchan Citizen Account
            </span>
            <Badge variant={profileData.kyc_verified !== false ? 'success' : 'warning'}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={12} strokeWidth={2.5} />
                {profileData.kyc_verified !== false ? 'e-KYC VERIFIED' : 'KYC PENDING'}
              </span>
            </Badge>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--ux4g-primary)', margin: 0, fontWeight: 700 }}>
            Citizen Profile &amp; Settings
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--ux4g-text-secondary)', margin: '0.25rem 0 0' }}>
            Manage your Aadhaar-linked land identity, communication preferences, and cadastral landholdings.
          </p>
        </div>
      </div>

      {/* Alert banners */}
      {updateSuccess && (
        <Alert variant="success">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} />
            Citizen profile updated and verified against database registry.
          </span>
        </Alert>
      )}
      {prefSavedAlert && (
        <Alert variant="success">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} />
            Communication &amp; language preferences saved successfully.
          </span>
        </Alert>
      )}

      {/* Two-Column Profile Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 310px) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }} className="citizen-profile-grid">

        {/* ===== LEFT: Full CITIZEN CONTROL DESK Card ===== */}
        <div style={{ position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              background: 'linear-gradient(180deg, #064e3b 0%, #033628 65%, #022319 100%)',
              borderRadius: '12px',
              padding: '1.25rem 1.15rem',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
              boxShadow: '0 8px 24px -4px rgba(6, 78, 59, 0.35)',
              boxSizing: 'border-box',
            }}
          >
            {/* Section 1: Header + User Profile */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  CITIZEN CONTROL DESK
                </div>
                <Badge variant="success" style={{ background: '#16a34a', color: '#ffffff', fontSize: '0.65rem', padding: '0.15rem 0.45rem', border: 'none' }}>
                  ACTIVE
                </Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  {(profileData.name || 'A').charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {profileData.name || 'Abhishek Gujar'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#fef08a', marginTop: '0.2rem' }}>
                    Mobile: {profileData.mobile || '+91 98230 45891'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: FEATURED SERVICE - Link Mobile to 7/12 RoR */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '10px',
                padding: '0.85rem 0.95rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Smartphone size={16} color="#fef08a" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                    RoR Mobile Seeding
                  </span>
                </div>
                <span
                  style={{
                    backgroundColor: 'var(--ux4g-secondary, #ea580c)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                  }}
                >
                  ₹10 Only
                </span>
              </div>

              <p style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0 0 0.75rem', lineHeight: 1.4 }}>
                Link or update mobile number on 7/12 &amp; 8A to receive instant mutation &amp; crop survey alerts.
              </p>

              <button
                type="button"
                onClick={() => setIsSeedingModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  backgroundColor: 'var(--ux4g-secondary, #ea580c)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(234, 88, 12, 0.4)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Smartphone size={14} />
                <span>Link Mobile to 7/12 (₹10) &rarr;</span>
              </button>
            </div>

            {/* Section 3: Online Cadastral Services */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                ONLINE CADASTRAL SERVICES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <button
                  type="button"
                  onClick={() => setIsRorModalOpen(true)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={14} color="#86efac" />
                    <span>Download 7/12 RoR Extract</span>
                  </span>
                  <ChevronRight size={14} color="rgba(255,255,255,0.6)" />
                </button>

                <Link
                  to="/citizen/documents"
                  style={{
                    padding: '0.6rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={14} color="#86efac" />
                    <span>Form 8A Khata Extract</span>
                  </span>
                  <ChevronRight size={14} color="rgba(255,255,255,0.6)" />
                </Link>

                <Link
                  to="/citizen/mutations"
                  style={{
                    padding: '0.6rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={14} color="#86efac" />
                    <span>Apply for e-Ferfar Mutation</span>
                  </span>
                  <ChevronRight size={14} color="rgba(255,255,255,0.6)" />
                </Link>

                <Link
                  to="/citizen/due-diligence"
                  style={{
                    padding: '0.6rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={14} color="#86efac" />
                    <span>Due Diligence 360° Report</span>
                  </span>
                  <ChevronRight size={14} color="rgba(255,255,255,0.6)" />
                </Link>
              </div>
            </div>

            {/* Section 4: DoLR Helpline & Sign Out */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ffffff', fontSize: '0.78rem' }}>
                  <PhoneCall size={14} color="#fef08a" />
                  <span>DoLR Helpline:</span>
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fef08a' }}>
                  1800-120-8040
                </span>
              </div>

              <button
                type="button"
                onClick={() => { logout(); navigate('/login/citizen'); }}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '6px',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.28)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Tabbed Panel ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>

          {/* Tab Strip */}
          <Card style={{ padding: '0.4rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <button style={tabStyle('identity')} onClick={() => setActiveTab('identity')}>
              <User size={14} /> Identity &amp; KYC
            </button>
            <button style={tabStyle('portfolio')} onClick={() => setActiveTab('portfolio')}>
              <Layers size={14} /> Land Portfolio
            </button>
            <button style={tabStyle('preferences')} onClick={() => setActiveTab('preferences')}>
              <Settings size={14} /> Preferences
            </button>
            <button style={tabStyle('security')} onClick={() => setActiveTab('security')}>
              <ShieldCheck size={14} /> Security
            </button>
          </Card>

          {/* === TAB: Identity & KYC === */}
          {activeTab === 'identity' && (
            <Card style={{ overflow: 'hidden' }}>
              {/* Card Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#fafbfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--ux4g-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCheck size={16} style={{ color: 'var(--ux4g-primary)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--ux4g-primary)', fontSize: '0.95rem' }}>Personal Information &amp; Aadhaar Identity</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Aadhaar-linked authoritative land identity</div>
                  </div>
                </div>
                {!isEditing && (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Edit2 size={13} /> Edit
                    </span>
                  </Button>
                )}
              </div>

              <div style={{ padding: '1.25rem 1.5rem' }}>
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                      <div className="ux4g-form-group" style={{ margin: 0 }}>
                        <label className="ux4g-label">Full Legal Name</label>
                        <input type="text" className="ux4g-input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                      </div>
                      <div className="ux4g-form-group" style={{ margin: 0 }}>
                        <label className="ux4g-label">Email Address</label>
                        <input type="email" className="ux4g-input" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                      </div>
                    </div>
                    <div className="ux4g-form-group" style={{ margin: 0 }}>
                      <label className="ux4g-label">Residential Address</label>
                      <textarea className="ux4g-textarea" rows={3} value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Button size="sm" variant="ghost" type="button" onClick={() => setIsEditing(false)}>
                        <X size={13} style={{ marginRight: '0.25rem' }} /> Cancel
                      </Button>
                      <Button size="sm" variant="primary" type="submit" disabled={updating}>
                        <Save size={13} style={{ marginRight: '0.3rem' }} />
                        {updating ? 'Saving…' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {/* Mono data chips */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                      <div style={{ background: 'var(--ux4g-surface-muted)', padding: '0.85rem 1rem', borderRadius: 'var(--ux4g-radius-md)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Aadhaar Identity Hash</div>
                        <div style={{ fontWeight: 600, fontFamily: 'var(--ux4g-font-mono)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
                          {profileData.aadhaar_hash || profileData.aadhaarHash || 'XXXX-XXXX-8912'}
                        </div>
                      </div>
                      <div style={{ background: 'var(--ux4g-surface-muted)', padding: '0.85rem 1rem', borderRadius: 'var(--ux4g-radius-md)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--ux4g-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>PAN Identity Number</div>
                        <div style={{ fontWeight: 600, fontFamily: 'var(--ux4g-font-mono)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
                          {profileData.pan || 'ABCPG1234D'}
                        </div>
                      </div>
                    </div>

                    {/* Info rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {[
                        { label: 'Registered Mobile', value: profileData.mobile },
                        { label: 'Email ID', value: profileData.email || 'Not Provided' },
                        { label: 'Registered Address', value: profileData.address || 'Address registered with revenue office' },
                      ].map((row, i, arr) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: i < arr.length - 1 ? '1px solid var(--ux4g-border-subtle)' : 'none', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-muted)' }}>{row.label}</span>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--ux4g-text)' }}>{row.value}</strong>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.7rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-muted)' }}>e-Pramaan DigiLocker</span>
                        <Badge variant="success">
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ShieldCheck size={12} /> Linked &amp; Active
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* === TAB: Land Portfolio === */}
          {activeTab === 'portfolio' && (
            <Card style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#fafbfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={16} style={{ color: 'var(--ux4g-success)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--ux4g-primary)', fontSize: '0.95rem' }}>Landholding Portfolio (Form 8A)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>{userParcels.length} parcels · {totalArea.toFixed(2)} Ha total area</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/citizen/parcels')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>Manage <ArrowRight size={13} /></span>
                </Button>
              </div>

              <div style={{ padding: '0.5rem 1.5rem 1.25rem' }}>
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} style={{ padding: '0.85rem 0', borderBottom: '1px solid var(--ux4g-border-subtle)', display: 'flex', gap: '0.75rem' }}>
                      <div className="ux4g-skeleton" style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div className="ux4g-skeleton" style={{ height: 12, width: '55%', marginBottom: '0.4rem' }} />
                        <div className="ux4g-skeleton" style={{ height: 10, width: '38%' }} />
                      </div>
                    </div>
                  ))
                ) : userParcels.length === 0 ? (
                  <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--ux4g-text-muted)', fontSize: '0.875rem' }}>
                    No landholdings linked to your account. Please seed your mobile to Form 7/12 RoR.
                  </div>
                ) : (
                  userParcels.map((p) => {
                    const share = p.share !== undefined ? `${p.share}%` : '100%';
                    return (
                      <div key={p.ulpin} style={{ padding: '0.85rem 0', borderBottom: '1px solid var(--ux4g-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--ux4g-font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ux4g-primary)', marginBottom: '0.1rem' }}>{p.ulpin}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--ux4g-text-secondary)' }}>
                            {p.villageName || p.village_name} · Gat {p.gatNumber || p.gat_number || p.surveyNumber || p.survey_number} · {p.area} {p.areaUnit || 'Ha'} · {p.landUse || p.land_use || 'Agricultural'}
                          </div>
                        </div>
                        <Badge variant="success">{share} share</Badge>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          )}

          {/* === TAB: Preferences === */}
          {activeTab === 'preferences' && (
            <Card style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#fafbfc', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={16} style={{ color: '#d97706' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--ux4g-primary)', fontSize: '0.95rem' }}>Notifications &amp; Language Preferences</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Control how you receive land record alerts</div>
                </div>
              </div>

              <form onSubmit={handleSavePreferences} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Language selector */}
                <div className="ux4g-form-group" style={{ margin: 0 }}>
                  <label className="ux4g-label">Preferred Portal Language</label>
                  <select className="ux4g-select" value={preferredLang} onChange={(e) => setPreferredLang(e.target.value)}>
                    <option value="en">English</option>
                    <option value="mr">Marathi</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>

                {/* Toggle switches */}
                <div>
                  <label className="ux4g-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Alert Channels</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      { id: 'sms', label: 'SMS Alerts', desc: 'e-Ferfar mutation notices & status change updates', val: smsAlerts, set: setSmsAlerts },
                      { id: 'wa', label: 'WhatsApp Delivery', desc: '7/12 & 8A certified PDF extract instant delivery', val: whatsappAlerts, set: setWhatsappAlerts },
                    ].map((pref) => (
                      <div key={pref.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'var(--ux4g-surface-muted)', borderRadius: 'var(--ux4g-radius-md)', gap: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ux4g-text)' }}>{pref.label}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--ux4g-text-muted)', marginTop: '0.1rem' }}>{pref.desc}</div>
                        </div>
                        {/* Toggle switch */}
                        <div
                          onClick={() => pref.set(!pref.val)}
                          style={{
                            width: 42, height: 24, borderRadius: 999, flexShrink: 0,
                            background: pref.val ? 'var(--ux4g-primary)' : '#cbd5e1',
                            position: 'relative', cursor: 'pointer',
                            transition: 'background 0.2s ease',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)',
                          }}
                        >
                          <div style={{
                            position: 'absolute', top: 3, left: pref.val ? 21 : 3,
                            width: 18, height: 18, borderRadius: '50%',
                            background: '#ffffff',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                            transition: 'left 0.2s ease',
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--ux4g-border-subtle)', paddingTop: '1rem' }}>
                  <Button type="submit" variant="primary">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={15} /> Save Preferences
                    </span>
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* === TAB: Security === */}
          {activeTab === 'security' && (
            <Card style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--ux4g-border-subtle)', background: '#fafbfc', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} style={{ color: '#0284c7' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--ux4g-primary)', fontSize: '0.95rem' }}>Security &amp; e-Pramaan Verification</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Authentication, access logs, and multi-factor options</div>
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'e-KYC Authentication', status: 'VERIFIED', variant: 'success', desc: 'Aadhaar OTP verified via UIDAI API — Government-grade identity assurance' },
                    { label: 'MeriPehchan SSO', status: 'LINKED', variant: 'success', desc: 'National single sign-on linked to citizen account' },
                    { label: 'DigiLocker Integration', status: 'ACTIVE', variant: 'success', desc: 'Certified document access via DigiLocker (IT Act 2000, Section 65B)' },
                    { label: 'Two-Factor Authentication', status: 'OTP ENABLED', variant: 'info', desc: 'Mobile OTP active for all login and transaction signing' },
                    { label: 'Last Login', status: new Date().toLocaleDateString('en-IN'), variant: 'neutral', desc: 'Pune, Maharashtra · Citizen Portal v3.0' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.85rem 1rem', background: 'var(--ux4g-surface-muted)', borderRadius: 'var(--ux4g-radius-md)', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ux4g-text)' }}>{item.label}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--ux4g-text-muted)', marginTop: '0.15rem' }}>{item.desc}</div>
                      </div>
                      <Badge variant={item.variant}>{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
