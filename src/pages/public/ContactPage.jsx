import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [stateCode, setStateCode] = useState('MH');
  const [queryCategory, setQueryCategory] = useState('712_ISSUE');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-contact ux4g-container" style={{ padding: '2.5rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ux4g-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Citizen Support & Institutional Helpdesk
        </div>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--ux4g-primary)', marginBottom: '0.5rem' }}>
          Contact Department of Land Resources (DoLR)
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--ux4g-text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
          Reach out for technical assistance, ULPIN verification inquiries, or institutional federation support.
        </p>
      </div>

      {submitted && (
        <Alert variant="success" style={{ marginBottom: '2rem' }}>
          ✓ Thank you, {fullName}. Your support inquiry has been logged! Reference Ticket ID: <strong>HLP-2025-{Math.floor(10000 + Math.random() * 90000)}</strong>. Our nodal revenue officer will respond within 2 business days.
        </Alert>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Contact Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card style={{ padding: '1.5rem', borderLeft: '4px solid var(--ux4g-primary)' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--ux4g-primary)', margin: '0 0 0.5rem' }}>
              🏛️ National Headquarters (DoLR)
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--ux4g-text-secondary)', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
              Department of Land Resources (DoLR)<br />
              Ministry of Rural Development, Government of India<br />
              NBO Building, Nirman Bhawan, New Delhi - 110011
            </p>
            <div style={{ fontSize: '0.85rem' }}>
              <div><strong>National Toll-Free Helpline:</strong> 1800-120-8040</div>
              <div><strong>Email Support:</strong> support.landstack@gov.in</div>
              <div><strong>Working Hours:</strong> 9:30 AM to 6:00 PM (Monday to Saturday)</div>
            </div>
          </Card>

          <Card style={{ padding: '1.5rem', borderLeft: '4px solid #ff9933' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--ux4g-primary)', margin: '0 0 0.5rem' }}>
              🏢 State Revenue Nodal Centers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <strong>Maharashtra Nodal Office (e-Mahabhumi):</strong><br />
                Office of the Settlement Commissioner & Director of Land Records, Pune - 411001<br />
                Helpline: 020-26050000 &bull; Email: help.mahabhumi@maharashtra.gov.in
              </div>
              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--ux4g-border-subtle)' }}>
                <strong>Rajasthan Nodal Office (Apna Khata):</strong><br />
                Board of Revenue for Rajasthan, Todarmal Marg, Ajmer - 305001<br />
                Helpline: 0145-2627000 &bull; Email: revenue.rajasthan@nic.in
              </div>
            </div>
          </Card>
        </div>

        {/* Citizen Query Submission Form */}
        <Card style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--ux4g-primary)', margin: '0 0 1rem' }}>
            Submit an Online Support Inquiry
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Citizen Full Name</label>
              <input
                type="text"
                className="ux4g-input"
                placeholder="e.g. Aarav Patil"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="ux4g-form-group">
                <label className="ux4g-label ux4g-label-required">Mobile Number</label>
                <input
                  type="tel"
                  className="ux4g-input"
                  placeholder="+91 98230 45891"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <div className="ux4g-form-group">
                <label className="ux4g-label">State / UT</label>
                <select
                  className="ux4g-select"
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                >
                  <option value="MH">Maharashtra</option>
                  <option value="RJ">Rajasthan</option>
                  <option value="KA">Karnataka</option>
                  <option value="UP">Uttar Pradesh</option>
                </select>
              </div>
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label">Email ID</label>
              <input
                type="email"
                className="ux4g-input"
                placeholder="citizen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Inquiry Category</label>
              <select
                className="ux4g-select"
                value={queryCategory}
                onChange={(e) => setQueryCategory(e.target.value)}
              >
                <option value="712_ISSUE">Form 7/12 / 8A Extract Discrepancy</option>
                <option value="MUTATION_DELAY">e-Ferfar Mutation Delay / Inward Status</option>
                <option value="ULPIN_SEARCH">ULPIN / Bhu-Aadhaar Search Help</option>
                <option value="CERSAI_LIEN">Bank Lien / Mortgage Charge Release</option>
                <option value="OTHER">General Technical Help</option>
              </select>
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Message / Details of Parcel & Issue</label>
              <textarea
                className="ux4g-input"
                rows={3}
                placeholder="Specify your ULPIN, survey/gat number, village, and description of your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Submit Support Ticket →
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
