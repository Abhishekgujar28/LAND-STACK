import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  Smartphone,
  Lock,
  RotateCw,
  MapPin,
  FileText,
  Bell,
  Map,
  User,
  Wrench,
  Star,
  Phone,
  Landmark,
  Home,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import { DEFAULT_CITIZENS } from '../../context/authConstants';
import emblemSvg from '../../assets/logos/emblem.svg';

const DEFAULT_STATES = [
  { code: 'MH', name: 'Maharashtra', localName: 'Maharashtra' },
  { code: 'RJ', name: 'Rajasthan', localName: 'Rajasthan' },
  { code: 'UP', name: 'Uttar Pradesh', localName: 'Uttar Pradesh' },
  { code: 'MP', name: 'Madhya Pradesh', localName: 'Madhya Pradesh' },
  { code: 'GJ', name: 'Gujarat', localName: 'Gujarat' },
  { code: 'KA', name: 'Karnataka', localName: 'Karnataka' },
];

const DEFAULT_DISTRICTS = [
  { code: 'DIST-PUN', name: 'Pune', localName: 'Pune', stateCode: 'MH' },
  { code: 'DIST-MUM', name: 'Mumbai Suburban', localName: 'Mumbai Suburban', stateCode: 'MH' },
  { code: 'DIST-NAG', name: 'Nagpur', localName: 'Nagpur', stateCode: 'MH' },
  { code: 'DIST-JAI', name: 'Jaipur', localName: 'Jaipur', stateCode: 'RJ' },
];

const DEFAULT_TEHSILS = [
  { code: 'TEH-HAV', name: 'Haveli', localName: 'Haveli', districtCode: 'DIST-PUN' },
  { code: 'TEH-PUN', name: 'Pune City', localName: 'Pune City', districtCode: 'DIST-PUN' },
  { code: 'TEH-JHO', name: 'Jhotwara', localName: 'Jhotwara', districtCode: 'DIST-JAI' },
];

const DEFAULT_VILLAGES = [
  { code: 'VIL-WAG', name: 'Wagholi', localName: 'Wagholi', tehsilCode: 'TEH-HAV' },
  { code: 'VIL-LOH', name: 'Lohegaon', localName: 'Lohegaon', tehsilCode: 'TEH-HAV' },
  { code: 'VIL-MAN', name: 'Manjri Khurd', localName: 'Manjri Khurd', tehsilCode: 'TEH-HAV' },
  { code: 'VIL-HIN', name: 'Hinjawadi', localName: 'Hinjawadi', tehsilCode: 'TEH-HAV' },
];

export const CreateAccountPage = () => {
  const navigate = useNavigate();
  const { loginAsCitizen } = useAuth();
  const [citizens, setCitizens] = useState(DEFAULT_CITIZENS);

  useEffect(() => {
    authService.getUsersByRole('CITIZEN').then((data) => {
      if (Array.isArray(data) && data.length > 0) setCitizens(data);
    }).catch(() => {});
  }, []);

  // Form State
  const [selectedState, setSelectedState] = useState('MH');
  const [selectedDistrict, setSelectedDistrict] = useState('DIST-PUN');
  const [selectedTehsil, setSelectedTehsil] = useState('TEH-HAV');
  const [selectedVillage, setSelectedVillage] = useState('VIL-WAG');

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isDigiLockerVerified, setIsDigiLockerVerified] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentCaptchaCode, setCurrentCaptchaCode] = useState('XbfL3');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const generateNewCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCurrentCaptchaCode(result);
  };

  // Filter cascading jurisdictions
  const availableDistricts = useMemo(() => {
    return DEFAULT_DISTRICTS.filter((d) => d.stateCode === selectedState);
  }, [selectedState]);

  const availableTehsils = useMemo(() => {
    return DEFAULT_TEHSILS.filter((t) => t.districtCode === selectedDistrict);
  }, [selectedDistrict]);

  const availableVillages = useMemo(() => {
    return DEFAULT_VILLAGES.filter((v) => v.tehsilCode === selectedTehsil);
  }, [selectedTehsil]);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const newDistricts = DEFAULT_DISTRICTS.filter((d) => d.stateCode === newState);
    const firstDistrict = newDistricts[0]?.code || '';
    setSelectedDistrict(firstDistrict);
    const newTehsils = DEFAULT_TEHSILS.filter((t) => t.districtCode === firstDistrict);
    const firstTehsil = newTehsils[0]?.code || '';
    setSelectedTehsil(firstTehsil);
    const newVillages = DEFAULT_VILLAGES.filter((v) => v.tehsilCode === firstTehsil);
    setSelectedVillage(newVillages[0]?.code || '');
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    const newTehsils = DEFAULT_TEHSILS.filter((t) => t.districtCode === newDistrict);
    const firstTehsil = newTehsils[0]?.code || '';
    setSelectedTehsil(firstTehsil);
    const newVillages = DEFAULT_VILLAGES.filter((v) => v.tehsilCode === firstTehsil);
    setSelectedVillage(newVillages[0]?.code || '');
  };

  const handleTehsilChange = (e) => {
    const newTehsil = e.target.value;
    setSelectedTehsil(newTehsil);
    const newVillages = DEFAULT_VILLAGES.filter((v) => v.tehsilCode === newTehsil);
    setSelectedVillage(newVillages[0]?.code || '');
  };

  const handleDigiLockerVerify = () => {
    setIsDigiLockerVerified(true);
    if (!fullName) {
      setFullName('Abhishek Gujar');
    }
    if (!aadhaarNumber) {
      setAadhaarNumber('XXXX-XXXX-8912');
    }
  };

  const handleQuickFill = (citizen) => {
    setFullName(citizen.name);
    setMobileNumber(citizen.mobile);
    setAadhaarNumber(citizen.aadhaarHash || 'XXXX-XXXX-8912');
    setIsDigiLockerVerified(true);
    setCaptchaInput(currentCaptchaCode || 'XbfL3');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to the digital public land records terms.');
      return;
    }
    navigate(`/login/citizen?mobile=${encodeURIComponent(mobileNumber.trim())}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'stretch',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1340px',
        margin: '0 auto',
        flexWrap: 'wrap',
      }}
    >
      {/* ── CARD 1: Left Brand Hero Card (Full Background citizenlogin.png) ── */}
      <div
        style={{
          flex: '0 0 295px',
          maxWidth: '300px',
          backgroundImage: `linear-gradient(180deg, rgba(6,78,59,0.48) 0%, rgba(6,78,59,0.18) 42%, rgba(6,78,59,0.6) 100%), url(/citizenlogin.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '16px',
          padding: '1.35rem 1.1rem 0.6rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 30px -5px rgba(6,78,59,0.35), 0 0 0 1px rgba(6,78,59,0.15)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Emblem Badge */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.6rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '5px',
            boxSizing: 'border-box',
          }}
        >
          <img src={emblemSvg} alt="Emblem of India" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Title & Subtitles */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, textAlign: 'center', letterSpacing: '0.03em' }}>
          <span style={{ color: '#ffffff' }}>BHARAT</span>
          <span style={{ color: '#ea580c' }}>BHUMI</span>
        </h2>
        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#facc15', textAlign: 'center', marginTop: '0.15rem' }}>
          Citizen Landholder Portal
        </div>
        <div style={{ fontSize: '0.68rem', color: '#e2e8f0', textAlign: 'center', marginTop: '0.1rem', marginBottom: '0.9rem' }}>
          Dept. of Land Resources • Govt. of India
        </div>

        {/* 3 Trust / Feature Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.6rem' }}>
          {/* Feature 1 */}
          <div
            style={{
              background: 'rgba(6,78,59,0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '10px',
              padding: '0.45rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#fff',
              }}
            >
              <Smartphone size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>DigiLocker &amp; MeriPehchan</div>
              <div style={{ fontSize: '0.64rem', color: '#cbd5e1' }}>Instant Aadhaar e-KYC validation</div>
            </div>
          </div>

          {/* Feature 2 */}
          <div
            style={{
              background: 'rgba(6,78,59,0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '10px',
              padding: '0.45rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#fff',
              }}
            >
              <FileCheck2 size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>Digital RoR 7/12 &amp; 8A</div>
              <div style={{ fontSize: '0.64rem', color: '#cbd5e1' }}>Real-time landholder linking</div>
            </div>
          </div>

          {/* Feature 3 */}
          <div
            style={{
              background: 'rgba(6,78,59,0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '10px',
              padding: '0.45rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#fff',
              }}
            >
              <MapPin size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>ULPIN GIS Seeding</div>
              <div style={{ fontSize: '0.64rem', color: '#cbd5e1' }}>14-digit geo-parcel identification</div>
            </div>
          </div>
        </div>

        {/* Spacer to push footer to bottom */}
        <div style={{ marginTop: 'auto' }} />

        {/* Bottom text footer */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: '0.4rem',
            paddingBottom: '0.2rem',
            textAlign: 'center',
            fontSize: '0.64rem',
            color: '#cbd5e1',
            letterSpacing: '0.02em',
          }}
        >
          Secure Access &bull; Efficient Governance &bull; Digital India
        </div>
      </div>

      {/* ── CARD 2: Center Main Registration Form Card (White) ── */}
      <div
        style={{
          flex: '1 1 470px',
          maxWidth: '540px',
          minWidth: '320px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* Stepper Status Bar at Top Center */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '2px 9px 2px 4px',
              backgroundColor: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: '999px',
            }}
          >
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              1
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d' }}>
              Citizen Landholder Registration &bull; Step 1
            </span>
          </div>
          <div style={{ width: '18px', height: '1px', backgroundColor: '#cbd5e1' }} />
          <span
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              color: '#64748b',
              fontSize: '0.68rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            2
          </span>
          <div style={{ width: '18px', height: '1px', backgroundColor: '#cbd5e1' }} />
          <span
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              color: '#64748b',
              fontSize: '0.68rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            3
          </span>
        </div>

        {/* Title and Subtitle */}
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', textAlign: 'center', margin: '0 0 0.15rem' }}>
          Create Citizen Account
        </h1>
        <p style={{ fontSize: '0.76rem', color: '#64748b', textAlign: 'center', margin: '0 0 0.9rem' }}>
          Unified National Landholder Registration &amp; e-KYC
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Row 1: State & District */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem', display: 'block' }}>
                1. State / UT <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  height: '35px',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0 0.5rem', color: '#15803d', display: 'flex', alignItems: 'center' }}>
                  <MapPin size={14} />
                </div>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  required
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    paddingRight: '1.5rem',
                    appearance: 'none',
                  }}
                >
                  {DEFAULT_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.localName})
                    </option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <ChevronDown size={13} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem', display: 'block' }}>
                2. District <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  height: '35px',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0 0.5rem', color: '#15803d', display: 'flex', alignItems: 'center' }}>
                  <Map size={14} />
                </div>
                <select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.78rem',
                    color: '#0f172a',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    paddingRight: '1.5rem',
                    appearance: 'none',
                  }}
                >
                  {availableDistricts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name} ({d.localName})
                    </option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <ChevronDown size={13} />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Tehsil & Village */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem', display: 'block' }}>
                3. Tehsil / Taluka <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  height: '35px',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0 0.5rem', color: '#15803d', display: 'flex', alignItems: 'center' }}>
                  <Landmark size={14} />
                </div>
                <select
                  value={selectedTehsil}
                  onChange={handleTehsilChange}
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.78rem',
                    color: '#0f172a',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    paddingRight: '1.5rem',
                    appearance: 'none',
                  }}
                >
                  {availableTehsils.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.name} ({t.localName})
                    </option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <ChevronDown size={13} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem', display: 'block' }}>
                4. Village / Mouza
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  height: '35px',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0 0.5rem', color: '#15803d', display: 'flex', alignItems: 'center' }}>
                  <Home size={14} />
                </div>
                <select
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.78rem',
                    color: '#0f172a',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    paddingRight: '1.5rem',
                    appearance: 'none',
                  }}
                >
                  {availableVillages.map((v) => (
                    <option key={v.code} value={v.code}>
                      {v.name} ({v.localName})
                    </option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <ChevronDown size={13} />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Full Name & Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem', display: 'block' }}>
                Full Name (as on Aadhaar) <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  height: '35px',
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0 0.55rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <User size={14} />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abhishek Gujar"
                  required
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.78rem',
                    color: '#0f172a',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem', display: 'block' }}>
                Mobile Number (+91) <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  height: '35px',
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0 0.55rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <Phone size={14} />
                </div>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 98230 45891"
                  required
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.78rem',
                    color: '#0f172a',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Row 4: Aadhaar Reference / VID */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                Aadhaar Reference / VID <span style={{ color: '#dc2626' }}>*</span>
              </label>
              {!isDigiLockerVerified ? (
                <button
                  type="button"
                  onClick={handleDigiLockerVerify}
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '4px',
                    color: '#1d4ed8',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <FileCheck2 size={11} />
                  <span>Verify DigiLocker e-KYC</span>
                  <ExternalLink size={10} />
                </button>
              ) : (
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <CheckCircle2 size={11} />
                  <span>KYC Verified</span>
                </span>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                height: '35px',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '0 0.55rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <ShieldCheck size={14} />
              </div>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="XXXX-XXXX-XXXX (DPDP 2023 Encrypted)"
                style={{
                  flex: 1,
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.78rem',
                  color: '#0f172a',
                  fontFamily: 'monospace',
                  backgroundColor: 'transparent',
                }}
              />
            </div>
          </div>

          {/* Security Verification */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                Security Verification <span style={{ color: '#dc2626' }}>* *</span>
              </label>
              <button
                type="button"
                onClick={() => setCaptchaInput(currentCaptchaCode || 'XbfL3')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <RotateCw size={11} /> Auto-fill Captcha
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <div
                style={{
                  width: '105px',
                  height: '34px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '0.22em',
                  fontFamily: 'monospace, Courier, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  color: '#065f46',
                  position: 'relative',
                  overflow: 'hidden',
                  userSelect: 'none',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '-10%',
                    right: '-10%',
                    height: '1px',
                    backgroundColor: '#6ee7b7',
                    transform: 'rotate(-4deg)',
                    pointerEvents: 'none',
                  }}
                />
                <span style={{ position: 'relative', zIndex: 2 }}>{currentCaptchaCode || 'XbfL3'}</span>
              </div>

              <button
                type="button"
                onClick={generateNewCaptcha}
                style={{
                  width: '34px',
                  height: '34px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569',
                  flexShrink: 0,
                }}
              >
                <RotateCw size={13} />
              </button>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  height: '34px',
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0 0.5rem', color: '#64748b' }}>
                  <Lock size={13} />
                </div>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter code"
                  maxLength={6}
                  required
                  style={{
                    flex: 1,
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.78rem',
                    color: '#0f172a',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.72rem', color: '#475569', cursor: 'pointer', marginTop: '0.1rem' }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ accentColor: '#064e3b', width: '14px', height: '14px' }}
              required
            />
            <span>
              I consent to BharatBhumi (DoLR, MoRD) linking my 7/12 RoR records &amp; sending SMS alerts.
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={!agreeTerms}
            style={{
              width: '100%',
              height: '40px',
              backgroundColor: '#064e3b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: agreeTerms ? 'pointer' : 'not-allowed',
              opacity: agreeTerms ? 1 : 0.7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: '0 3px 8px rgba(6,78,59,0.22)',
              transition: 'all 0.15s ease',
              marginTop: '0.15rem',
            }}
            onMouseEnter={(e) => agreeTerms && (e.currentTarget.style.backgroundColor = '#04382a')}
            onMouseLeave={(e) => agreeTerms && (e.currentTarget.style.backgroundColor = '#064e3b')}
          >
            <ShieldCheck size={16} />
            <span>Complete Registration &amp; Open Dashboard →</span>
          </button>

          {/* Return to Login */}
          <div style={{ textAlign: 'center', marginTop: '0.1rem', fontSize: '0.75rem', color: '#64748b' }}>
            Already registered?{' '}
            <Link
              to="/login/citizen"
              style={{ color: '#064e3b', fontWeight: 700, textDecoration: 'underline' }}
            >
              Sign In with Mobile OTP →
            </Link>
          </div>
        </form>
      </div>

      {/* ── CARD 3: Right Column (Split into 2 Distinct Stacked Cards) ── */}
      <div
        style={{
          flex: '1.1 1 340px',
          maxWidth: '380px',
          minWidth: '310px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Card 3A: CITIZEN BENEFITS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.1rem 1.15rem',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Star size={15} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>
                CITIZEN BENEFITS
              </span>
            </div>
            <span
              style={{
                backgroundColor: '#ffedd5',
                color: '#c2410c',
                padding: '2px 7px',
                borderRadius: '4px',
                fontSize: '0.64rem',
                fontWeight: 800,
              }}
            >
              BENEFITS
            </span>
          </div>

          <p style={{ fontSize: '0.71rem', color: '#64748b', margin: '0 0 0.65rem', lineHeight: 1.4 }}>
            Key land governance features unlocked with your registered citizen account:
          </p>

          {/* 3 Benefit Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {/* Benefit 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 0.55rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileText size={14} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                  Instant 7/12 &amp; 8A Extracts
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  Download legally admissible digitally signed extracts
                </div>
              </div>
            </div>

            {/* Benefit 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 0.55rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#dbeafe',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Map size={14} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                  ULPIN Cadastral Maps
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  High-resolution GIS boundary overlay on Google Maps
                </div>
              </div>
            </div>

            {/* Benefit 3 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 0.55rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#f3e8ff',
                  color: '#9333ea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bell size={14} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                  SMS Mutation Alerts
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  Real-time notifications for succession and title changes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3B: QUICK DEMO FILL */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.1rem 1.15rem',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <Wrench size={15} color="#ea580c" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>
              QUICK DEMO FILL
            </span>
          </div>

          <p style={{ fontSize: '0.71rem', color: '#64748b', margin: '0 0 0.65rem', lineHeight: 1.4 }}>
            Use demo accounts to explore the registration flow.
          </p>

          {/* 3 User Demo Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
            {DEFAULT_CITIZENS.map((c, idx) => {
              const theme =
                idx === 0
                  ? { bg: '#dcfce7', icon: '#16a34a', btnBg: '#ecfdf5', btnBorder: '#a7f3d0', btnColor: '#15803d' }
                  : idx === 1
                  ? { bg: '#dbeafe', icon: '#2563eb', btnBg: '#eff6ff', btnBorder: '#bfdbfe', btnColor: '#1d4ed8' }
                  : { bg: '#f3e8ff', icon: '#9333ea', btnBg: '#faf5ff', btnBorder: '#e9d5ff', btnColor: '#7e22ce' };

              return (
                <div
                  key={c.id}
                  style={{
                    padding: '0.5rem 0.35rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: theme.bg,
                      color: theme.icon,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <User size={15} />
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                    {c.name.split(' ')[0]}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickFill(c)}
                    style={{
                      width: '100%',
                      padding: '3px 0',
                      borderRadius: '5px',
                      border: `1px solid ${theme.btnBorder}`,
                      backgroundColor: theme.btnBg,
                      color: theme.btnColor,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.95)')}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
                  >
                    Use Demo
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
