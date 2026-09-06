import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Landmark,
  Building,
  Search,
  ChevronRight,
} from 'lucide-react';
import Card from '../../components/ui/Card';

/**
 * ContactPage - Official Support, State Office Directory & Grievance Submission
 * Standardized per BharatBhumi Design System
 */
export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [stateCode, setStateCode] = useState('MH');
  const [district, setDistrict] = useState('');
  const [queryCategory, setQueryCategory] = useState('712_ISSUE');
  const [message, setMessage] = useState('');
  const [stateSearchQuery, setStateSearchQuery] = useState('');

  const stateNodalOffices = [
    {
      state: 'Maharashtra',
      stateCode: 'MH',
      office: 'Settlement Commissioner & Director of Land Records',
      address: 'Central Building, Station Road, Pune - 411001',
      phone: '020-26050000',
      email: 'help.mahabhumi@maharashtra.gov.in',
      portal: 'mahabhulekh.maharashtra.gov.in',
    },
    {
      state: 'Rajasthan',
      stateCode: 'RJ',
      office: 'Board of Revenue for Rajasthan (Apna Khata)',
      address: 'Todarmal Marg, Civil Lines, Ajmer - 305001',
      phone: '0145-2627000',
      email: 'revenue.rajasthan@nic.in',
      portal: 'apnakhata.rajasthan.gov.in',
    },
    {
      state: 'Karnataka',
      stateCode: 'KA',
      office: 'Revenue Department & Survey Settlement (Bhoomi)',
      address: 'SSLR Building, K.R. Circle, Bengaluru - 560001',
      phone: '080-22113251',
      email: 'bhoomi.helpdesk@karnataka.gov.in',
      portal: 'landrecords.karnataka.gov.in',
    },
    {
      state: 'Uttar Pradesh',
      stateCode: 'UP',
      office: 'Board of Revenue & Land Records (Bhulekh UP)',
      address: 'Rajasva Bhawan, Guru Gobind Singh Marg, Lucknow - 226001',
      phone: '0522-2217103',
      email: 'bhulekh-up@gov.in',
      portal: 'upbhulekh.gov.in',
    },
    {
      state: 'Gujarat',
      stateCode: 'GJ',
      office: 'Revenue Department & Settlement Commissioner (AnyRoR)',
      address: 'Block 11, New Sachivalaya, Gandhinagar - 382010',
      phone: '079-23251501',
      email: 'revenue-sec@gujarat.gov.in',
      portal: 'anyror.gujarat.gov.in',
    },
    {
      state: 'Tamil Nadu',
      stateCode: 'TN',
      office: 'Directorate of Survey and Settlement (Patta Chitta)',
      address: 'Survey House, Chepauk, Chennai - 600005',
      phone: '044-28591900',
      email: 'survey.tn@nic.in',
      portal: 'eservices.tn.gov.in',
    },
  ];

  const filteredOffices = stateNodalOffices.filter(
    (off) =>
      !stateSearchQuery ||
      off.state.toLowerCase().includes(stateSearchQuery.toLowerCase()) ||
      off.office.toLowerCase().includes(stateSearchQuery.toLowerCase()) ||
      off.address.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedId = `HLP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketId(generatedId);
    setSubmitted(true);
  };

  return (
    <div className="page-contact ux4g-container" style={{ padding: '2.5rem 1rem 3.5rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* 1. Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dcf2e8', color: '#0f4d3a', padding: '0.25rem 0.85rem', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 750, marginBottom: '0.6rem' }}>
          <span>📞</span>
          <span>संपर्क व तक्रार निवारण | Support, Directory &amp; Helpdesk</span>
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontSize: '2.2rem', fontWeight: 850, color: '#0d382f', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
          Contact Department of Land Resources (DoLR)
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#526b63', maxWidth: '720px', margin: '0 auto', lineHeight: 1.55 }}>
          Direct communication channels, state revenue nodal centers, and citizen support ticket submission.
        </p>
      </div>

      {/* 2. Success Alert after Submission */}
      {submitted && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1.5px solid #10b981',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
          }}
        >
          <CheckCircle2 size={24} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#065f46', margin: '0 0 0.25rem' }}>
              Support Ticket Logged Successfully!
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#047857', margin: '0 0 0.4rem', lineHeight: 1.5 }}>
              Thank you, <strong>{fullName}</strong>. Your inquiry has been assigned Reference ID: <strong style={{ textDecoration: 'underline' }}>{ticketId}</strong>.
            </p>
            <div style={{ fontSize: '0.78rem', color: '#065f46' }}>
              • <strong>SLA Response Window:</strong> 2 business days<br />
              • An acknowledgment SMS and email with tracking link has been dispatched to <strong>{mobile}</strong> and <strong>{email || 'your email'}</strong>.
            </div>
          </div>
        </div>
      )}

      {/* 3. Top Row: Central Headquarters & Inquiry Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Left: National Headquarters & Direct Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card
            style={{
              padding: '1.6rem',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #1b4d3e',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#edf7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b4d3e' }}>
                <Landmark size={22} />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: '1.12rem', fontWeight: 800, color: '#0f2e24', margin: 0 }}>
                  National Headquarters (DoLR)
                </h2>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Ministry of Rural Development, Government of India</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={17} color="#1b4d3e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>NBO Building, Nirman Bhawan, Maulana Azad Road, New Delhi - 110011</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={17} color="#1b4d3e" style={{ flexShrink: 0 }} />
                <span><strong>National Toll-Free Helpline:</strong> 1800-120-8040</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={17} color="#1b4d3e" style={{ flexShrink: 0 }} />
                <span><strong>Email:</strong> support.bharatbhumi@gov.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={17} color="#1b4d3e" style={{ flexShrink: 0 }} />
                <span><strong>Helpdesk Timings:</strong> 9:30 AM – 6:00 PM (Monday to Saturday)</span>
              </div>
            </div>
          </Card>

          {/* Quick Notice Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f2e24', margin: '0 0 0.35rem' }}>
              Statutory Grievance Redressal (RTS)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              For service delays exceeding the Right to Public Services statutory timeline (15–30 days for mutations and corrections), complaints can be directly lodged with the Tehsildar or Sub-Divisional Officer.
            </p>
          </div>
        </div>

        {/* Right: Citizen Inquiry Form */}
        <Card
          style={{
            padding: '1.75rem',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#0f2e24', margin: '0 0 1.25rem' }}>
            Submit an Online Support Inquiry
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                Citizen Full Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav Patil"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Mobile Number <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98230 45891"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  State / UT <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: "'Inter', sans-serif",
                    background: '#ffffff',
                  }}
                >
                  <option value="MH">Maharashtra</option>
                  <option value="RJ">Rajasthan</option>
                  <option value="KA">Karnataka</option>
                  <option value="UP">Uttar Pradesh</option>
                  <option value="GJ">Gujarat</option>
                  <option value="TN">Tamil Nadu</option>
                  <option value="OTHER">Other State / UT</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Email ID
                </label>
                <input
                  type="email"
                  placeholder="citizen@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  District / Tehsil
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pune / Haveli"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                Inquiry Category <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={queryCategory}
                onChange={(e) => setQueryCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Inter', sans-serif",
                  background: '#ffffff',
                }}
              >
                <option value="712_ISSUE">Form 7/12 / 8A Extract Discrepancy</option>
                <option value="MUTATION_DELAY">e-Ferfar Mutation Delay / Inward Status</option>
                <option value="ULPIN_SEARCH">ULPIN / Bhu-Aadhaar Search Assistance</option>
                <option value="CERSAI_LIEN">Bank Lien / Mortgage Charge Release</option>
                <option value="CADASTRAL_MAP">Cadastral Boundary / Bhu-Naksha GIS Map</option>
                <option value="OTHER">General Technical Assistance</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                Message &amp; Parcel Details (ULPIN / Gat No.) <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Specify your ULPIN, survey/gat number, village, and description of your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Inter', sans-serif",
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                marginTop: '0.5rem',
                background: '#1b4d3e',
                color: '#ffffff',
                padding: '0.75rem',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 6px rgba(27, 77, 62, 0.2)',
                transition: 'background 0.15s ease',
              }}
            >
              <span>Submit Support Ticket</span>
              <Send size={15} />
            </button>
          </form>
        </Card>
      </div>

      {/* 4. Searchable State Revenue Nodal Centers Directory */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: '1.45rem', fontWeight: 800, color: '#0f2e24', margin: '0 0 0.25rem' }}>
              State Revenue Nodal Offices Directory
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
              Direct contact details for state settlement commissioners and land records directorates.
            </p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Filter by state name or city..."
              value={stateSearchQuery}
              onChange={(e) => setStateSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                borderRadius: '6px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.84rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filteredOffices.map((off) => (
            <Card
              key={off.stateCode}
              style={{
                padding: '1.4rem',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #1b4d3e',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#dcf2e8', color: '#0f4d3a', padding: '2px 7px', borderRadius: '4px' }}>
                    {off.state}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{off.portal}</span>
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f2e24', margin: '0 0 0.45rem' }}>
                  {off.office}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.6rem', lineHeight: 1.4 }}>
                  {off.address}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                  <div><strong>Phone:</strong> {off.phone}</div>
                  <div><strong>Email:</strong> {off.email}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
