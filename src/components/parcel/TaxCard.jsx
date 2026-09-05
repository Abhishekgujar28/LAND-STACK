import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Alert from '../ui/Alert';

/**
 * TaxCard - Land revenue, cess, Gram Panchayat property tax & e-Challan payment simulation
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
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--ux4g-primary)' }}>
              ₹{tax.annualAssessment || '180'} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ux4g-text-secondary)' }}>/ year</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ux4g-text-secondary)', marginTop: '0.2rem' }}>
              Outstanding Dues: <strong style={{ color: tax.outstandingDues > 0 && !paymentSuccess ? 'var(--ux4g-danger)' : 'var(--ux4g-success)' }}>
                ₹{paymentSuccess ? 0 : tax.outstandingDues || '0'}
              </strong> &bull; Assessment Year: {tax.financialYear || '2024-25'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Badge variant={tax.outstandingDues > 0 && !paymentSuccess ? 'warning' : 'success'}>
              {tax.outstandingDues > 0 && !paymentSuccess ? '⚠️ Dues Pending' : '✓ Taxes Paid (NOC Valid)'}
            </Badge>
            {tax.outstandingDues > 0 && !paymentSuccess && (
              <Button variant="primary" size="sm" onClick={() => setShowPayModal(true)}>
                Pay Online (e-Challan) →
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
          title="Government e-Gras / MahaKosh Payment Gateway"
        >
          <form onSubmit={handleOnlinePay}>
            <div style={{ background: 'var(--ux4g-primary-light)', padding: '0.85rem', borderRadius: 'var(--ux4g-radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div><strong>Department:</strong> Revenue & Forest Department, Maharashtra</div>
              <div><strong>Major Head:</strong> 0029 — Land Revenue (Akar & Zilla Parishad Cess)</div>
              <div><strong>Target Parcel:</strong> <code>{tax.parcelId || 'ULPIN-MH-PUN-000001'}</code></div>
              <div><strong>Total Payable Amount:</strong> <strong style={{ fontSize: '1.1rem', color: 'var(--ux4g-primary)' }}>₹{tax.outstandingDues || 180}</strong></div>
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
                Proceed to Pay ₹{tax.outstandingDues || 180} →
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default TaxCard;
