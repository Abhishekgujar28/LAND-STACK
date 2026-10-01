import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Phone,
  Mail,
  ShieldAlert,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  Clock,
  MapPin,
  Landmark,
  Building,
  Send,
  CheckCircle2,
  AlertCircle,
  Bot,
  ExternalLink,
} from 'lucide-react';
import Card from '../../components/ui/Card';

/**
 * HelpPage - Unified Help, Support, FAQs, Contact Directory & Grievance Submission
 * Merges comprehensive Contact Us facilities into Help & Support
 * Standardized per BharatBhumi Design System & GIGW 3.0
 */
export const HelpPage = () => {
  // FAQ state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [openIndex, setOpenIndex] = useState(0);

  // Inquiry form state
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [stateCode, setStateCode] = useState('MH');
  const [district, setDistrict] = useState('');
  const [queryCategory, setQueryCategory] = useState('712_ISSUE');
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  // State offices directory search state
  const [stateSearchQuery, setStateSearchQuery] = useState('');

  const faqs = [
    {
      category: 'ULPIN & Identification',
      question: 'What is ULPIN (Unique Land Parcel Identification Number) / Bhu-Aadhaar?',
      statusType: 'certified',
      answer:
        'ULPIN is a 14-digit alphanumeric unique identifier for every land parcel in India, generated from the latitude-longitude coordinates of the polygon vertices. It acts as the "Aadhaar for Land" and unifies diverse state identifiers like Survey Number, Gat Number, Khasra Number, and CTS Number.',
    },
    {
      category: 'Extracts & RoR',
      question: 'Are digitally signed 7/12 & 8A extracts court-admissible?',
      statusType: 'certified',
      answer:
        'Yes. Digitally signed extracts generated via BharatBhumi comply with Section 65B of the Indian Evidence Act and the Information Technology Act 2000. They include cryptographic QR codes and e-Mudhra Sub-CA digital signature hashes, eliminating the need for physical ink signatures from the Talathi.',
    },
    {
      category: 'e-Ferfar Mutations',
      question: 'What is the 15-day statutory Form 135D notice window during e-Ferfar?',
      statusType: 'action',
      answer:
        'Under state Land Revenue Codes, when a mutation application is submitted (following sale, inheritance, or partition), a provisional pencil entry (Form 6) is registered, and a mandatory 15-day public notice (Form 135D) is issued to all recorded co-sharers. If no objections are received within 15 days, the Circle Officer / Mandal Adhikari issues the final sanction order.',
    },
    {
      category: 'Bank Liens & Encumbrances',
      question: 'How do I remove a satisfied bank loan (Boja Kami) from my Form 7/12?',
      statusType: 'action',
      answer:
        'Once a bank loan is fully repaid, the financial institution issues a digital No Due Certificate (NDC). You can submit an online "Bank Lien Removal (Boja Kami)" request through the Citizen Portal. The Talathi verifies the satisfaction record with CERSAI and updates the other rights column (Itar Hakka).',
    },
    {
      category: 'Due Diligence',
      question: 'How is the Due Diligence 360° composite title risk score calculated?',
      statusType: 'certified',
      answer:
        'BharatBhumi cross-references 8 government databases in real-time: (1) Form 8A Khata ownership, (2) CERSAI mortgage charges, (3) Section 36A tribal/environmental restrictions, (4) e-Courts litigation, (5) Revenue tribunal appeals, (6) Land revenue Akar tax dues, (7) Town planning zoning, and (8) Cadastral geometry QA.',
    },
    {
      category: 'Grievance Redressal',
      question: 'What should I do if my mutation application exceeds the Right to Services (RTS) SLA?',
      statusType: 'action',
      answer:
        'If a revenue service exceeds the statutory SLA (typically 15 to 30 days), citizens can lodge an e-Lokshahi grievance ticket directly on the Grievances portal. The ticket is escalated to the Sub-Divisional Officer (SDO) and District Collectorate for time-bound disposal.',
    },
  ];

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

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchesCategory = activeCategory === 'ALL' || f.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const filteredOffices = useMemo(() => {
    return stateNodalOffices.filter(
      (off) =>
        !stateSearchQuery ||
        off.state.toLowerCase().includes(stateSearchQuery.toLowerCase()) ||
        off.office.toLowerCase().includes(stateSearchQuery.toLowerCase()) ||
        off.address.toLowerCase().includes(stateSearchQuery.toLowerCase())
    );
  }, [stateSearchQuery]);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim() || !message.trim()) {
      setValidationError('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }
    setValidationError('');
    const generatedId = `HLP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketId(generatedId);
    setSubmitted(true);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="page-help ux4g-container" style={{ padding: '2.5rem 1rem 3.5rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* 1. Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--color-certified-bg, #ecfdf5)',
            color: 'var(--color-certified-text, #065f46)',
            padding: '0.25rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 750,
            marginBottom: '0.6rem',
            border: '1px solid var(--color-certified-border, #a7f3d0)',
          }}
        >
          <span>💡</span>
          <span>Unified Citizen Support, FAQs &amp; Helpdesk Directory</span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--ux4g-font-sans)',
            fontSize: '2.2rem',
            fontWeight: 800,
            color: 'var(--ux4g-text-heading, #0f2e24)',
            margin: '0 0 0.45rem',
            letterSpacing: '-0.02em',
          }}
        >
          Help &amp; Support Center
        </h1>
        <p style={{ fontSize: '0.94rem', color: 'var(--ux4g-text-body, #334155)', maxWidth: '780px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Search land record FAQs, submit online support tickets, connect directly with Department of Land Resources (DoLR) headquarters, and find state revenue nodal centers.
        </p>

        {/* Quick Section Jump Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => scrollToSection('section-faqs')}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: '#f1f5f9',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <HelpCircle size={14} color="#064e3b" />
            <span>Search FAQs</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('section-inquiry')}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Send size={14} color="#065f46" />
            <span>Submit Support Ticket</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('section-headquarters')}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: '#fff7ed',
              color: '#c2410c',
              border: '1px solid #fed7aa',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Phone size={14} color="#ea580c" />
            <span>Contact Headquarters</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('section-nodal-directory')}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Landmark size={14} color="#2563eb" />
            <span>State Nodal Directory</span>
          </button>
        </div>
      </div>

      {/* 2. Searchable FAQs Section */}
      <div id="section-faqs" style={{ scrollMarginTop: '80px', marginBottom: '3rem' }}>
        <Card style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Type your question (e.g., How to apply for 7/12? What is Form 135D? How to remove bank loan?)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--ux4g-font-sans)',
                }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                'ALL',
                'ULPIN & Identification',
                'Extracts & RoR',
                'e-Ferfar Mutations',
                'Bank Liens & Encumbrances',
                'Due Diligence',
                'Grievance Redressal',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIndex(0);
                  }}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: activeCategory === cat ? '1px solid var(--primary, #064e3b)' : '1px solid #e2e8f0',
                    background: activeCategory === cat ? 'var(--primary, #064e3b)' : '#f8fafc',
                    color: activeCategory === cat ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <Card
                  key={index}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    style={{
                      width: '100%',
                      padding: '1.2rem 1.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, flexWrap: 'wrap' }}>
                      <span
                        className={faq.statusType === 'action' ? 'badge-action' : 'badge-certified'}
                        style={{ flexShrink: 0 }}
                      >
                        {faq.category}
                      </span>
                      <h2
                        style={{
                          fontFamily: 'var(--ux4g-font-sans)',
                          fontSize: '1rem',
                          fontWeight: 750,
                          color: '#0f2e24',
                          margin: 0,
                          lineHeight: 1.35,
                        }}
                      >
                        {faq.question}
                      </h2>
                    </div>
                    <div style={{ color: '#64748b', flexShrink: 0 }}>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.4rem 1.25rem',
                        color: 'var(--ux4g-text-body, #334155)',
                        fontSize: '0.88rem',
                        lineHeight: 1.6,
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: '1rem',
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              No questions found matching "{searchQuery}". Please check the contact and escalation channels below.
            </div>
          )}
        </div>
      </div>

      {/* 3. Contact Headquarters & Online Inquiry Form */}
      <div id="section-headquarters" style={{ scrollMarginTop: '80px', marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontFamily: 'var(--ux4g-font-sans)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--ux4g-text-heading, #0f2e24)', margin: '0 0 0.35rem' }}>
            Contact &amp; Grievance Submission
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
            Reach national headquarters directly or submit an online support inquiry with automatic reference tracking.
          </p>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div
            style={{
              background: 'var(--color-certified-bg, #ecfdf5)',
              border: '1.5px solid var(--color-certified-border, #a7f3d0)',
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
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#065f46', margin: '0 0 0.25rem' }}>
                Support Ticket Logged Successfully!
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#065f46', margin: '0 0 0.4rem', lineHeight: 1.5 }}>
                Thank you, <strong>{fullName}</strong>. Your inquiry has been assigned Reference ID: <strong style={{ textDecoration: 'underline' }}>{ticketId}</strong>.
              </p>
              <div style={{ fontSize: '0.78rem', color: '#047857' }}>
                • <strong>SLA Response Window:</strong> 2 business days<br />
                • An acknowledgment SMS and email with tracking link has been dispatched to <strong>{mobile}</strong> and <strong>{email || 'your email'}</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {validationError && (
          <div
            style={{
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              borderRadius: '10px',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#991b1b',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <AlertCircle size={18} />
            <span>{validationError}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {/* Left Column: National Headquarters Details & Escalation Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Headquarters Card */}
            <Card
              style={{
                padding: '1.6rem',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid var(--primary, #064e3b)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#edf7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#064e3b' }}>
                  <Landmark size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--ux4g-font-sans)', fontSize: '1.12rem', fontWeight: 800, color: '#0f2e24', margin: 0 }}>
                    National Headquarters (DoLR)
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Ministry of Rural Development, Government of India</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <MapPin size={17} color="#064e3b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>NBO Building, Nirman Bhawan, Maulana Azad Road, New Delhi - 110011</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={17} color="#064e3b" style={{ flexShrink: 0 }} />
                  <span><strong>National Toll-Free Helpline:</strong> 1800-120-8040</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={17} color="#064e3b" style={{ flexShrink: 0 }} />
                  <span><strong>Email:</strong> support.bharatbhumi@gov.in</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={17} color="#064e3b" style={{ flexShrink: 0 }} />
                  <span><strong>Helpdesk Timings:</strong> 9:30 AM – 6:00 PM (Monday to Saturday)</span>
                </div>
              </div>
            </Card>

            {/* Quick Escalation Badges Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#064e3b', fontWeight: 750, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <Phone size={16} />
                  <span>Toll-Free Desk</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>1800-120-8040</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>Wait: &lt; 2 minutes</div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ea580c', fontWeight: 750, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <ShieldAlert size={16} />
                  <span>CPGRAMS Portal</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 750, color: '#0f172a' }}>RTS Statutory SLA</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>Resolution: 15–30 Days</div>
              </div>
            </div>
          </div>

          {/* Right Column: Citizen Inquiry Form */}
          <div id="section-inquiry" style={{ scrollMarginTop: '80px' }}>
            <Card
              style={{
                padding: '1.75rem',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--ux4g-font-sans)', fontSize: '1.2rem', fontWeight: 800, color: '#0f2e24', margin: '0 0 1.15rem' }}>
                Submit an Online Support Inquiry
              </h3>

              <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Full Name & Mobile */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Full Name <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patil"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Mobile Number <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                      maxLength={10}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Email & State */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="citizen@example.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      State / UT <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        backgroundColor: '#fff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="MH">Maharashtra (Mahabhumi)</option>
                      <option value="RJ">Rajasthan (Apna Khata)</option>
                      <option value="KA">Karnataka (Bhoomi)</option>
                      <option value="UP">Uttar Pradesh (Bhulekh)</option>
                      <option value="GJ">Gujarat (AnyRoR)</option>
                      <option value="TN">Tamil Nadu (Patta Chitta)</option>
                      <option value="OTHER">Other States / UTs</option>
                    </select>
                  </div>
                </div>

                {/* Category & District */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      District / Tehsil
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pune / Haveli"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Query Category <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select
                      value={queryCategory}
                      onChange={(e) => setQueryCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        backgroundColor: '#fff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="712_ISSUE">7/12 &amp; 8A Extract Issue</option>
                      <option value="MUTATION_DELAY">e-Ferfar Mutation Delay / Notice</option>
                      <option value="LIEN_REMOVAL">Bank Loan (Boja Kami) Release</option>
                      <option value="ULPIN_MISMATCH">ULPIN / Spatial Geometry Inquiry</option>
                      <option value="TECHNICAL">Portal Technical / Login Issue</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Describe your Issue / Inquiry <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details such as ULPIN, Survey number, village name, or mutation application ID..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#064e3b',
                    color: '#ffffff',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 6px rgba(6,78,59,0.25)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#04382a')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#064e3b')}
                >
                  <Send size={15} />
                  <span>Submit Inquiry Ticket →</span>
                </button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* 4. State Land Records & Nodal Revenue Directory */}
      <div id="section-nodal-directory" style={{ scrollMarginTop: '80px', marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--ux4g-font-sans)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--ux4g-text-heading, #0f2e24)', margin: '0 0 0.35rem' }}>
            State Land Records &amp; Nodal Revenue Directory
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
            Official state headquarters, Settlement Commissionerates, and technical helpdesks.
          </p>
        </div>

        {/* Directory Search Bar */}
        <div style={{ maxWidth: '550px', margin: '0 auto 1.5rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="Filter by state name or revenue department (e.g. Maharashtra, Rajasthan)..."
            value={stateSearchQuery}
            onChange={(e) => setStateSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.4rem',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* State Offices Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredOffices.map((off) => (
            <Card
              key={off.stateCode}
              style={{
                padding: '1.35rem',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f2e24' }}>{off.state}</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 750, background: '#edf7f3', color: '#064e3b' }}>
                    {off.stateCode}
                  </span>
                </div>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#064e3b', margin: '0 0 0.5rem' }}>
                  {off.office}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', marginBottom: '0.3rem' }}>
                    <MapPin size={14} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{off.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.3rem' }}>
                    <Phone size={14} color="#64748b" style={{ flexShrink: 0 }} />
                    <span>{off.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} color="#64748b" style={{ flexShrink: 0 }} />
                    <span>{off.email}</span>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Portal:</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb' }}>{off.portal}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. BhumiSeva Automated Citizen Assistant Banner */}
      <Card
        style={{
          padding: '1.6rem 2rem',
          background: 'linear-gradient(135deg, #075037 0%, #032b1e 100%)',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(7, 80, 55, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#edf7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#064e3b', flexShrink: 0 }}>
            <Bot size={24} />
          </div>
          <div>
            <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.25rem' }}>
              BhumiSeva Automated Citizen Assistant
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.84rem', margin: 0, lineHeight: 1.4 }}>
              Instant AI assistance in Hindi &amp; English for 7/12 extract downloads, ULPIN lookup, and e-Ferfar mutation status tracking.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => scrollToSection('section-inquiry')}
          style={{
            background: 'var(--secondary, #ea580c)',
            border: 'none',
            color: '#ffffff',
            padding: '0.55rem 1.15rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)',
          }}
        >
          Submit Support Ticket →
        </button>
      </Card>
    </div>
  );
};

export default HelpPage;
