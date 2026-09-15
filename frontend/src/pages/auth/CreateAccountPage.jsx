import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Smartphone,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthSplitCard from '../../components/auth/AuthSplitCard';
import SecurityCaptcha from '../../components/auth/SecurityCaptcha';
import authService from '../../services/authService';


const DEFAULT_STATES = [
  { code: 'MH', name: 'Maharashtra', localName: 'महाराष्ट्र' },
  { code: 'RJ', name: 'Rajasthan', localName: 'राजस्थान' },
  { code: 'UP', name: 'Uttar Pradesh', localName: 'उत्तर प्रदेश' },
  { code: 'MP', name: 'Madhya Pradesh', localName: 'मध्य प्रदेश' },
  { code: 'GJ', name: 'Gujarat', localName: 'गुजरात' },
  { code: 'KA', name: 'Karnataka', localName: 'कर्नाटक' },
];

const DEFAULT_DISTRICTS = [
  { code: 'DIST-PUN', name: 'Pune', localName: 'पुणे', stateCode: 'MH' },
  { code: 'DIST-MUM', name: 'Mumbai Suburban', localName: 'मुंबई उपनगर', stateCode: 'MH' },
  { code: 'DIST-NAG', name: 'Nagpur', localName: 'नागपूर', stateCode: 'MH' },
  { code: 'DIST-JAI', name: 'Jaipur', localName: 'जयपुर', stateCode: 'RJ' },
];

const DEFAULT_TEHSILS = [
  { code: 'TEH-HAV', name: 'Haveli', localName: 'हवेली', districtCode: 'DIST-PUN' },
  { code: 'TEH-PUN', name: 'Pune City', localName: 'पुणे शहर', districtCode: 'DIST-PUN' },
  { code: 'TEH-JHO', name: 'Jhotwara', localName: 'झोटवाड़ा', districtCode: 'DIST-JAI' },
];

const DEFAULT_VILLAGES = [
  { code: 'VIL-WAG', name: 'Wagholi', localName: 'वाघोली', tehsilCode: 'TEH-HAV' },
  { code: 'VIL-LOH', name: 'Lohegaon', localName: 'लोहगाव', tehsilCode: 'TEH-HAV' },
  { code: 'VIL-MAN', name: 'Manjri Khurd', localName: 'मांजरी खुर्द', tehsilCode: 'TEH-HAV' },
  { code: 'VIL-HIN', name: 'Hinjawadi', localName: 'हिंजवडी', tehsilCode: 'TEH-HAV' },
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

  // Form State - State is the MANDATORY FIRST field
  const [selectedState, setSelectedState] = useState('MH');
  const [selectedDistrict, setSelectedDistrict] = useState('DIST-PUN');
  const [selectedTehsil, setSelectedTehsil] = useState('TEH-HAV');
  const [selectedVillage, setSelectedVillage] = useState('VIL-WAG');

  const [fullName, setFullName] = useState('Aarav Patil');
  const [mobileNumber, setMobileNumber] = useState('+91 98230 45891');
  const [aadhaarNumber, setAadhaarNumber] = useState('5489 1234 8912');
  const [isDigiLockerVerified, setIsDigiLockerVerified] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('XbfL3');
  const [agreeTerms, setAgreeTerms] = useState(true);

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

  // Handle State Change - Reset children
  const handleStateChange = (newCode) => {
    setSelectedState(newCode);
    const dists = DEFAULT_DISTRICTS.filter((d) => d.stateCode === newCode);
    const newDist = dists[0]?.code || '';
    setSelectedDistrict(newDist);
    const tehs = DEFAULT_TEHSILS.filter((t) => t.districtCode === newDist);
    const newTeh = tehs[0]?.code || '';
    setSelectedTehsil(newTeh);
    const vils = DEFAULT_VILLAGES.filter((v) => v.tehsilCode === newTeh);
    setSelectedVillage(vils[0]?.code || '');
  };

  const handleDistrictChange = (newDist) => {
    setSelectedDistrict(newDist);
    const tehs = DEFAULT_TEHSILS.filter((t) => t.districtCode === newDist);
    const newTeh = tehs[0]?.code || '';
    setSelectedTehsil(newTeh);
    const vils = DEFAULT_VILLAGES.filter((v) => v.tehsilCode === newTeh);
    setSelectedVillage(vils[0]?.code || '');
  };

  const handleTehsilChange = (newTeh) => {
    setSelectedTehsil(newTeh);
    const vils = DEFAULT_VILLAGES.filter((v) => v.tehsilCode === newTeh);
    setSelectedVillage(vils[0]?.code || '');
  };

  // Check if entered mobile matches any known RoR
  const rorMatch = useMemo(() => {
    const cleanMobile = mobileNumber.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) return null;

    const matchedCitizen = citizens.find((c) => {
      const cMobile = (c.mobile || '').replace(/[^0-9]/g, '');
      return cMobile.endsWith(cleanMobile.slice(-10));
    });

    if (matchedCitizen) {
      return {
        matched: true,
        citizen: matchedCitizen,
        parcel: { ulpin: 'ULPIN-MH-PUN-000001', gatNumber: '42', villageName: 'Wagholi' },
      };
    }

    return { matched: false };
  }, [mobileNumber, citizens]);

  // Simulate DigiLocker instant e-KYC
  const handleDigiLockerVerify = () => {
    setIsDigiLockerVerified(true);
    if (!fullName) {
      setFullName('Aarav Patil');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetCitizenId = rorMatch?.citizen?.id || 'CIT-001';
    loginAsCitizen(targetCitizenId);
    navigate('/citizen/dashboard');
  };

  return (
    <AuthSplitCard
      title="Create Citizen Account"
      subtitle="Digital Public Infrastructure for Land Governance • Unified National Landholder Registration"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Load Optimization Alert */}
        <div
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: '#166534',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.4rem',
          }}
        >
          <Sparkles size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Server Load Optimization:</strong> Selecting your State first routes to the designated State Cadastral Adapter and minimizes latency.
          </span>
        </div>

        {/* STEP 1: MANDATORY STATE SELECTION (FIRST FIELD) */}
        <div className="ux4g-form-group">
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--ux4g-primary, #064e3b)',
              marginBottom: '0.25rem',
              display: 'block',
            }}
          >
            1. Select State / Union Territory <span style={{ color: '#dc2626' }}>* (First Required Field)</span>
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            required
            style={{
              width: '100%',
              height: '38px',
              padding: '0.35rem 0.65rem',
              border: '1.5px solid var(--ux4g-primary, #064e3b)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: '#ffffff',
              color: 'var(--ux4g-primary, #064e3b)',
              outline: 'none',
            }}
          >
            {DEFAULT_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.localName})
              </option>
            ))}
          </select>
        </div>

        {/* Cascading Jurisdictions Row (District, Tehsil, Village) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
              District <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                padding: '0.35rem 0.5rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.825rem',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              {availableDistricts.length > 0 ? (
                availableDistricts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name} ({d.localName})
                  </option>
                ))
              ) : (
                <option value="">Default District</option>
              )}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
              Tehsil / Taluka <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              value={selectedTehsil}
              onChange={(e) => handleTehsilChange(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                padding: '0.35rem 0.5rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.825rem',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              {availableTehsils.length > 0 ? (
                availableTehsils.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name} ({t.localName})
                  </option>
                ))
              ) : (
                <option value="">Default Tehsil</option>
              )}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
              Village / Mouza
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                padding: '0.35rem 0.5rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.825rem',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              {availableVillages.length > 0 ? (
                availableVillages.map((v) => (
                  <option key={v.code} value={v.code}>
                    {v.name} ({v.localName})
                  </option>
                ))
              ) : (
                <option value="">All Villages</option>
              )}
            </select>
          </div>
        </div>

        {/* Full Name & Mobile Number */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
              Full Name (as on Aadhaar) <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aarav Patil"
              required
              style={{
                width: '100%',
                height: '40px',
                padding: '0.4rem 0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
              Mobile Number (+91) <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+91 98230 00000"
              required
              style={{
                width: '100%',
                height: '40px',
                padding: '0.4rem 0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* DigiLocker e-KYC Verification Option */}
        <div
          style={{
            padding: '0.85rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#0052cc',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.8rem',
              }}
            >
              DL
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                Verify with DigiLocker e-KYC
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Instant identity validation via MeriPehchan
              </div>
            </div>
          </div>

          {!isDigiLockerVerified ? (
            <button
              type="button"
              onClick={handleDigiLockerVerify}
              style={{
                padding: '0.45rem 0.85rem',
                backgroundColor: '#0052cc',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <FileCheck2 size={14} />
              <span>Verify DigiLocker</span>
            </button>
          ) : (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={14} />
              <span>DigiLocker KYC Verified</span>
            </div>
          )}
        </div>

        {/* Aadhaar Reference Token */}
        <div className="ux4g-form-group">
          <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
            Aadhaar Number / VID Reference <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="text"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            placeholder="XXXX-XXXX-XXXX"
            style={{
              width: '100%',
              height: '40px',
              padding: '0.4rem 0.65rem',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'monospace',
            }}
          />
          <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
            DPDP Act 2023 Compliant: Only an encrypted UIDAI reference token is stored. Raw Aadhaar is never saved.
          </span>
        </div>

        {/* RoR Linkage Status Notice based on Mobile */}
        {rorMatch?.matched ? (
          <div
            style={{
              padding: '0.75rem 0.85rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '8px',
              fontSize: '0.825rem',
              color: '#166534',
            }}
          >
            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} />
              <span>Record of Rights (7/12 RoR) Found!</span>
            </div>
            <div style={{ marginTop: '0.25rem', fontSize: '0.78rem', lineHeight: 1.4 }}>
              This mobile number matches <strong>{rorMatch.citizen?.name}</strong> with Land Parcel{' '}
              <code>{rorMatch.parcel?.ulpin || 'ULPIN-MH-PUN-000001'}</code> (Gat No. {rorMatch.parcel?.gatNumber || '42'}, {rorMatch.parcel?.villageName || 'Wagholi'}). It will be linked to your dashboard automatically.
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '0.75rem 0.85rem',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              fontSize: '0.825rem',
              color: '#92400e',
            }}
          >
            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={16} />
              <span>Notice: No RoR Land Record Currently Linked to this Mobile</span>
            </div>
            <div style={{ marginTop: '0.25rem', fontSize: '0.78rem', lineHeight: 1.4 }}>
              This mobile number is not yet seeded to any 7/12 RoR in the Cadastral Registry. You can link your mobile number to your 7/12 RoR for a nominal government fee of <strong>₹10 (Indian Rupees)</strong> directly in your Citizen Dashboard after signing up.
            </div>
          </div>
        )}

        {/* Security Captcha */}
        <SecurityCaptcha value={captchaInput} onChange={setCaptchaInput} />

        {/* Consent Checkbox */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.78rem', color: '#475569', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ accentColor: 'var(--ux4g-primary, #064e3b)', marginTop: '2px' }}
            required
          />
          <span>
            I hereby give consent to BharatBhumi (DoLR, MoRD) to authenticate my cadastral records and receive SMS alerts for mutations and RoR notices.
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={!agreeTerms}
          style={{
            width: '100%',
            height: '40px',
            backgroundColor: agreeTerms ? 'var(--ux4g-primary, #064e3b)' : '#94a3b8',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: agreeTerms ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            boxShadow: agreeTerms ? '0 3px 8px rgba(6, 78, 59, 0.2)' : 'none',
            transition: 'all 0.15s ease',
            marginTop: '0.2rem',
          }}
        >
          <ShieldCheck size={16} />
          <span>Complete Registration &amp; Open Dashboard</span>
          <ArrowRight size={15} />
        </button>

        {/* Return to Login */}
        <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.825rem', color: '#64748b' }}>
          Already have a citizen account?{' '}
          <Link
            to="/login/citizen"
            style={{ color: 'var(--ux4g-primary, #064e3b)', fontWeight: 700, textDecoration: 'underline' }}
          >
            Sign In with Mobile OTP
          </Link>
        </div>
      </form>
    </AuthSplitCard>
  );
};

export default CreateAccountPage;
