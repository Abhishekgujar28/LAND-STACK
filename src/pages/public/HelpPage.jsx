import React, { useState } from 'react';
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
  MessageSquareText,
  ExternalLink,
  Bot,
} from 'lucide-react';
import Card from '../../components/ui/Card';

/**
 * HelpPage - Searchable FAQs, Citizen Guides, Escalation Paths & Virtual Helpdesk
 * Standardized per BharatBhumi Design System
 */
export const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      category: 'ULPIN & Identification',
      question: 'What is ULPIN (Unique Land Parcel Identification Number) / Bhu-Aadhaar?',
      answer:
        'ULPIN is a 14-digit alphanumeric unique identifier for every land parcel in India, generated from the latitude-longitude coordinates of the polygon vertices. It acts as the "Aadhaar for Land" and unifies diverse state identifiers like Survey Number, Gat Number, Khasra Number, and CTS Number.',
    },
    {
      category: 'Extracts & RoR',
      question: 'Are digitally signed 7/12 & 8A extracts court-admissible?',
      answer:
        'Yes. Digitally signed extracts generated via BharatBhumi comply with Section 65B of the Indian Evidence Act and the Information Technology Act 2000. They include cryptographic QR codes and e-Mudhra Sub-CA digital signature hashes, eliminating the need for physical ink signatures from the Talathi.',
    },
    {
      category: 'e-Ferfar Mutations',
      question: 'What is the 15-day statutory Form 135D notice window during e-Ferfar?',
      answer:
        'Under state Land Revenue Codes, when a mutation application is submitted (following sale, inheritance, or partition), a provisional pencil entry (Form 6) is registered, and a mandatory 15-day public notice (Form 135D) is issued to all recorded co-sharers. If no objections are received within 15 days, the Circle Officer / Mandal Adhikari issues the final sanction order.',
    },
    {
      category: 'Bank Liens & Encumbrances',
      question: 'How do I remove a satisfied bank loan (Boja Kami) from my Form 7/12?',
      answer:
        'Once a bank loan is fully repaid, the financial institution issues a digital No Due Certificate (NDC). You can submit an online "Bank Lien Removal (Boja Kami)" request through the Citizen Portal. The Talathi verifies the satisfaction record with CERSAI and updates the other rights column (Itar Hakka).',
    },
    {
      category: 'Due Diligence',
      question: 'How is the Due Diligence 360° composite title risk score calculated?',
      answer:
        'BharatBhumi cross-references 8 government databases in real-time: (1) Form 8A Khata ownership, (2) CERSAI mortgage charges, (3) Section 36A tribal/environmental restrictions, (4) e-Courts litigation, (5) Revenue tribunal appeals, (6) Land revenue Akar tax dues, (7) Town planning zoning, and (8) Cadastral geometry QA.',
    },
    {
      category: 'Grievance Redressal',
      question: 'What should I do if my mutation application exceeds the Right to Services (RTS) SLA?',
      answer:
        'If a revenue service exceeds the statutory SLA (typically 15 to 30 days), citizens can lodge an e-Lokshahi grievance ticket directly on the Grievances portal. The ticket is escalated to the Sub-Divisional Officer (SDO) and District Collectorate for time-bound disposal.',
    },
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = activeCategory === 'ALL' || f.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="page-help ux4g-container" style={{ padding: '2.5rem 1rem 3.5rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* 1. Header & Intro */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dcf2e8', color: '#0f4d3a', padding: '0.25rem 0.85rem', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 750, marginBottom: '0.6rem' }}>
          <span>💡</span>
          <span>नागरिक साहाय्यता केंद्र | Citizen Support & Knowledge Base</span>
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontSize: '2.2rem', fontWeight: 850, color: '#0d382f', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
          Help, Citizen FAQs &amp; Support Directory
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#526b63', maxWidth: '720px', margin: '0 auto', lineHeight: 1.55 }}>
          Search quick answers on land records, mutation statutory timelines, certified extracts, and official grievance escalation channels.
        </p>
      </div>

      {/* 2. Primary Action: Searchable FAQ Box */}
      <Card style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
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
                fontFamily: "'Inter', sans-serif",
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
                  border: activeCategory === cat ? '1px solid #1b4d3e' : '1px solid #e2e8f0',
                  background: activeCategory === cat ? '#1b4d3e' : '#f8fafc',
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

      {/* 3. FAQ Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '3rem' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: '#dcf2e8',
                        color: '#0f4d3a',
                        flexShrink: 0,
                      }}
                    >
                      {faq.category}
                    </span>
                    <h2
                      style={{
                        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
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
                      color: '#475569',
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
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            No questions found matching "{searchQuery}". Please check the escalation channels below.
          </div>
        )}
      </div>

      {/* 4. Clear Official Escalation Paths */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: '1.45rem', fontWeight: 800, color: '#0f2e24', margin: '0 0 0.35rem' }}>
            Official Support &amp; Escalation Channels
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
            If your query is unresolved, reach out through our statutory escalation channels.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem' }}>
          {/* Channel 1: Toll-Free */}
          <Card
            style={{
              padding: '1.5rem',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              borderTop: '3.5px solid #1b4d3e',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <Phone size={20} color="#1b4d3e" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f2e24', margin: 0 }}>
                National Toll-Free Desk
              </h3>
            </div>
            <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1b4d3e', margin: '0 0 0.4rem' }}>
              1800-120-8040
            </p>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.85rem', lineHeight: 1.4 }}>
              Hours: 9:30 AM – 6:00 PM (Mon–Sat)<br />
              <strong>Expected Wait:</strong> &lt; 2 minutes
            </p>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', background: '#dcf2e8', padding: '3px 8px', borderRadius: '4px' }}>
              Immediate Voice Assistance
            </span>
          </Card>

          {/* Channel 2: Email */}
          <Card
            style={{
              padding: '1.5rem',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              borderTop: '3.5px solid #0284c7',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <Mail size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f2e24', margin: 0 }}>
                Helpdesk Email Desk
              </h3>
            </div>
            <p style={{ fontSize: '0.92rem', fontWeight: 750, color: '#0284c7', margin: '0 0 0.4rem' }}>
              support.bharatbhumi@gov.in
            </p>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.85rem', lineHeight: 1.4 }}>
              Official technical and database support<br />
              <strong>Expected Response:</strong> 24–48 hours
            </p>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '3px 8px', borderRadius: '4px' }}>
              Written Audit Record
            </span>
          </Card>

          {/* Channel 3: CPGRAMS Grievance */}
          <Card
            style={{
              padding: '1.5rem',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              borderTop: '3.5px solid #e65100',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <ShieldAlert size={20} color="#e65100" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f2e24', margin: 0 }}>
                CPGRAMS Grievance Portal
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', fontWeight: 750, color: '#e65100', margin: '0 0 0.4rem' }}>
              Right to Public Services (RTS)
            </p>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.85rem', lineHeight: 1.4 }}>
              Statutory escalations to Collectorate &amp; SDO<br />
              <strong>Resolution TAT:</strong> 15–30 Days
            </p>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#9a3412',
                background: '#ffedd5',
                padding: '3px 8px',
                borderRadius: '4px',
                textDecoration: 'none',
              }}
            >
              <span>Lodge Official Grievance</span>
              <ArrowRight size={11} />
            </Link>
          </Card>
        </div>
      </div>

      {/* 5. Distinct Virtual Assistant AI Banner */}
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
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#edf7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b4d3e', flexShrink: 0 }}>
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
        <Link to="/contact" style={{ textDecoration: 'none' }}>
          <button
            type="button"
            style={{
              background: '#e65100',
              border: 'none',
              color: '#ffffff',
              padding: '0.55rem 1.15rem',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(230, 81, 0, 0.3)',
            }}
          >
            Start Assistant Chat →
          </button>
        </Link>
      </Card>
    </div>
  );
};

export default HelpPage;
