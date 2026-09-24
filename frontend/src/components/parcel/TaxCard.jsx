import React, { useState } from 'react';
import { IndianRupee, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Alert from '../ui/Alert';

/**
 * TaxCard - Land revenue, cess, Gram Panchayat property tax & e-Challan payment simulation with Lucide icons
 */
export const TaxCard = ({ tax, onPay, className = '' }) => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [paidAlert, setPaidAlert] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!tax) return null;

  const handleOnlinePay = (e) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowPayModal(false);
      setPaidAlert(`e-Challan payment of ₹${tax.outstandingDues || 180} successful! GRAS Challan Receipt: MH-GRAS-2025-${Math.floor(100000 + Math.random() * 900000)}`);
      setTimeout(() => setPaidAlert(''), 8000);
    }, 1200);
  };

  return (
    <>
      <Card className={`parcel-tax ${className}`.trim()} header={<strong>Land Revenue & Local Taxes (Akar / Cess)</strong>}>
        {paidAlert && <Alert variant="success">{paidAlert}</Alert>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ux4g-text-muted)' }}>Annual Assessment (Akar):</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--ux4g-primary)', display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
              <span>₹{tax.annualAssessment || '180'}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>/ year</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.2rem' }}>
              Outstanding Dues:{' '}
              <strong style={{ color: tax.outstandingDues > 0 && !paymentSuccess ? 'var(--ux4g-danger)' : 'var(--ux4g-success)' }}>
                ₹{paymentSuccess ? 0 : tax.outstandingDues || '0'}
              </strong>{' '}
              &bull; Assessment Year: {tax.financialYear || '2024-25'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Badge variant={tax.outstandingDues > 0 && !paymentSuccess ? 'warning' : 'success'}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                {tax.outstandingDues > 0 && !paymentSuccess ? (
                  <>
                    <AlertCircle size={13} strokeWidth={2.5} />
                    Dues Pending
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                    Taxes Paid (NOC Valid)
                  </>
                )}
              </span>
            </Badge>
            {tax.outstandingDues > 0 && !paymentSuccess && (
              <Button variant="primary" size="sm" onClick={() => setShowPayModal(true)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Pay Online (e-Challan)
                  <ArrowRight size={14} />
                </span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Payment Modal */}
      {showPayModal && (
        <Modal
          isOpen={showPayModal}
          onClose={() => setShowPayModal(false)}
          title="Government e-GRAS / MahaKosh Payment Gateway"
        >
          <form onSubmit={handleOnlinePay}>
            <div style={{ background: 'var(--ux4g-primary-light)', padding: '0.85rem', borderRadius: 'var(--ux4g-radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div><strong>Department:</strong> Revenue & Forest Department, Maharashtra</div>
              <div><strong>Major Head:</strong> 0029 — Land Revenue (Akar & Zilla Parishad Cess)</div>
              <div><strong>Target Parcel:</strong> <code>{tax.parcelId || 'N/A'}</code></div>
              <div style={{ marginTop: '0.4rem' }}>
                <strong>Total Payable Amount:</strong>{' '}
                <strong style={{ fontSize: '1.15rem', color: 'var(--ux4g-primary)' }}>₹{tax.outstandingDues || 180}</strong>
              </div>
            </div>

            <div className="ux4g-form-group">
              <label className="ux4g-label ux4g-label-required">Payment Method</label>
              <select className="ux4g-select" defaultValue="UPI">
                <option value="UPI">UPI / BHIM / QR Code (Zero Transaction Charge)</option>
                <option value="NET_BANKING">State Bank of India / All Major Netbanking</option>
                <option value="DEBIT_CARD">Debit / RuPay Card</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowPayModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Proceed to Pay ₹{tax.outstandingDues || 180}
                  <ArrowRight size={14} />
                </span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default TaxCard;
