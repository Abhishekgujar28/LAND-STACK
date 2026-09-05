import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Accordion from '../../components/ui/Accordion';

export const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const faqs = [
    {
      category: 'ULPIN & Identification',
      question: 'What is ULPIN (Unique Land Parcel Identification Number) / Bhu-Aadhaar?',
      answer:
        'ULPIN is a 14-digit alphanumeric unique identifier for every land parcel in India, based on longitude and latitude coordinates of the plot vertices. It acts as the "Aadhaar for Land" and unifies diverse state identifiers like Survey Number, Gat Number, Khasra Number, and CTS Number.',
    },
    {
      category: 'Extracts & RoR',
      question: 'Are digitally signed 7/12 & 8A extracts court-admissible?',
      answer:
        'Yes. Digitally signed extracts generated via Land Stack comply with Section 65B of the Indian Evidence Act and the Information Technology Act 2000. They include cryptographic QR codes and e-Mudhra Sub-CA digital signature hashes, eliminating the need for physical ink signatures from the Talathi.',
    },
    {
      category: 'e-Ferfar Mutations',
      question: 'What is the 15-day statutory Form 135D notice window during e-Ferfar?',
      answer:
        'Under the Maharashtra Land Revenue Code (Sections 148-154), when a mutation application is submitted (following sale, inheritance, or partition), a provisional pencil entry (Form 6) is made, and a mandatory 15-day public notice (Form 135D) is issued to all recorded co-sharers and displayed on the Gram Panchayat notice board to invite objections. If no objections are received within 15 days, the Circle Officer / Mandal Adhikari issues the final sanction order.',
    },
    {
      category: 'Bank Liens & Encumbrances',
      question: 'How do I remove a satisfied bank loan (Boja Kami) from my Form 7/12?',
      answer:
        'Once a bank loan is fully repaid, the financial institution issues a No Due Certificate (NDC). You can submit an online "Bank Lien Removal (Boja Kami)" application through the Applications page with the NDC copy. The Talathi verifies the satisfaction record with CERSAI and updates the other rights column (Itar Hakka).',
    },
    {
      category: 'Due Diligence',
      question: 'How is the Due Diligence 360° composite title score calculated?',
      answer:
        'Land Stack cross-references 8 government databases in real-time: (1) Form 8A Khata ownership, (2) CERSAI mortgage charges, (3) Section 36A tribal and environmental buffer restrictions, (4) e-Courts civil litigation, (5) Revenue tribunal appeals, (6) Land revenue Akar tax dues, (7) PMRDA/PMC town planning zoning, and (8) Cadastral geometry QA. It generates an instant score from 0 to 100 with A+/B/C risk grading.',
    },
    {
      category: 'Grievance Redressal',
      question: 'What should I do if my mutation application exceeds the Right to Services (RTS) SLA?',
      answer:
        'If a revenue service exceeds the statutory SLA (typically 15 to 30 days), citizens can lodge an e-Lokshahi grievance ticket directly on the Grievances portal. The ticket is escalated to the Sub-Divisional Officer (SDO) and District Collectorate for time-bound disposal.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) => activeCategory === 'ALL' || f.category === activeCategory
  );

  const accordionItems = filteredFaqs.map((f) => ({
    title: f.question,
    content: (
      <div>
        <div style={{ marginBottom: '0.5rem' }}>
          <Badge variant="primary" style={{ fontSize: '0.7rem' }}>{f.category}</Badge>
        </div>
        <p style={{ margin: 0, color: 'var(--ux4g-text)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {f.answer}
        </p>
      </div>
    ),
  }));

  return (
    <div className="page-help ux4g-container" style={{ padding: '2.5rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ux4g-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Citizen Helpdesk & Knowledge Base
        </div>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--ux4g-primary)', marginBottom: '0.5rem' }}>
          Frequently Asked Questions & Citizen Guides
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--ux4g-text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
          Comprehensive guide to Indian land administration, e-Ferfar mutation statutory timelines, certified RoR extracts, and legal title due diligence.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
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
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              background: activeCategory === cat ? 'var(--ux4g-primary)' : 'var(--ux4g-surface-muted)',
              color: activeCategory === cat ? '#ffffff' : 'var(--ux4g-text)',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordions */}
      <Card style={{ padding: '1rem', marginBottom: '2.5rem' }}>
        <Accordion items={accordionItems} />
      </Card>

      {/* Helpline Contact Strip */}
      <Card style={{ padding: '2rem', background: '#fafbfc', border: '1px solid var(--ux4g-border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.35rem', color: 'var(--ux4g-primary)', fontSize: '1.25rem' }}>
              Still have questions or unresolved grievances?
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ux4g-text-secondary)' }}>
              Contact our national land helpline desk or submit an official grievance.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/contact">
              <Button variant="outline">Contact Helpline &bull; 1800-120-8040</Button>
            </Link>
            <Link to="/citizen/grievances">
              <Button variant="primary">Lodge Citizen Grievance →</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HelpPage;
