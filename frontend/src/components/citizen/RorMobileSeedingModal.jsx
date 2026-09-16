import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  CreditCard,
  QrCode,
  ShieldCheck,
  Receipt,
  Download,
  AlertCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export const RorMobileSeedingModal = ({ isOpen, onClose, citizen, onSeedSuccess }) => {
  const [step, setStep] = useState(1); // 1: Details & Mobile, 2: OTP & Payment, 3: Success Receipt

  // Form State
  const [surveyNumber, setSurveyNumber] = useState('104');
  const [gatNumber, setGatNumber] = useState('42');
  const [villageName, setVillageName] = useState('Wagholi, Haveli, Pune');
  const [mobileNumber, setMobileNumber] = useState(citizen?.mobile || '+91 98230 45891');
  const [otpCode, setOtpCode] = useState('123456');
  const [paymentMode, setPaymentMode] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Generated Receipt Info
  const [receiptData, setReceiptData] = useState(null);

  if (!isOpen) return null;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayAndSeed = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedReceipt = {
        ackNo: `BB-SEED-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        txnId: `TXN-BB-${Math.floor(10000000 + Math.random() * 90000000)}`,
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        citizenName: citizen?.name || 'Abhishek Gujar',
        mobile: mobileNumber,
        parcelId: 'TEST_ULPIN_MH_PUN_001',
        surveyNo: surveyNumber,
        gatNo: gatNumber,
        village: villageName,
        fee: '₹10.00',
        feeWords: 'Ten Indian Rupees Only',
        status: 'PAID & SEEDED',
      };
      setReceiptData(generatedReceipt);
      setIsProcessing(false);
      setStep(3);
      if (onSeedSuccess) {
        onSeedSuccess(generatedReceipt);
      }
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(2, 35, 25, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header Strip with Primary Green */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #04382a 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.5rem',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
              <Badge variant="warning" style={{ backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 700 }}>
                DILRMP e-HAKK SERVICE
              </Badge>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)' }}>
                Rule 14 MLR Code
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
              Link Mobile Number to 7/12 RoR
            </h3>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.2rem' }}>
              मोबाईल क्रमांक ७/१२ व ८-अ नोंदणी व प्रमाणीकरण
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem' }}>
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  color: '#166534',
                  lineHeight: 1.45,
                }}
              >
                <strong>Government Notice:</strong> Seeding your mobile number ensures you receive real-time SMS notifications for any mutation (e-Ferfar) notice, field mojani inspection, or title changes on your 7/12 RoR.
              </div>

              {/* Land Parcel Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                    Survey / Khasra No. <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={surveyNumber}
                    onChange={(e) => setSurveyNumber(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0.4rem 0.65rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                    Gat / Sub-Division No. <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={gatNumber}
                    onChange={(e) => setGatNumber(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0.4rem 0.65rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Village & Taluka
                </label>
                <input
                  type="text"
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0.4rem 0.65rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: '#f8fafc',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Mobile to Seed */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Mobile Number to be Seeded in RoR <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0.4rem 0.65rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.925rem',
                      fontWeight: 600,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Administrative Fee Summary (₹10) */}
              <div
                style={{
                  backgroundColor: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9a3412' }}>
                    Nominal Government Seeding Fee
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#c2410c' }}>
                    DILRMP administrative processing charge
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ux4g-secondary, #ea580c)' }}>
                    ₹10
                  </span>
                  <div style={{ fontSize: '0.7rem', color: '#9a3412' }}>Includes 18% GST</div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  backgroundColor: 'var(--ux4g-primary, #064e3b)',
                }}
              >
                <span>Proceed to Verification & Payment (₹10) &rarr;</span>
              </Button>
            </form>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* OTP Confirmation */}
              <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>
                    Enter OTP sent to {mobileNumber}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                    OTP Verified (123456)
                  </span>
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  style={{
                    width: '100%',
                    height: '42px',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    letterSpacing: '0.3em',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
                  Select Payment Method for ₹10 Administrative Fee:
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('upi')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: paymentMode === 'upi' ? '2px solid var(--ux4g-primary, #064e3b)' : '1px solid #cbd5e1',
                      backgroundColor: paymentMode === 'upi' ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left',
                    }}
                  >
                    <QrCode size={20} color={paymentMode === 'upi' ? '#064e3b' : '#64748b'} />
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>UPI / Bharat QR</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>GPay, PhonePe, BHIM</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('netbanking')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: paymentMode === 'netbanking' ? '2px solid var(--ux4g-primary, #064e3b)' : '1px solid #cbd5e1',
                      backgroundColor: paymentMode === 'netbanking' ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left',
                    }}
                  >
                    <CreditCard size={20} color={paymentMode === 'netbanking' ? '#064e3b' : '#64748b'} />
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>Net Banking</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>All Major Banks</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Total Summary */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.825rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: '#64748b' }}>
                  <span>DILRMP Mobile Seeding:</span>
                  <span>₹8.47</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: '#64748b' }}>
                  <span>CGST (9%) + SGST (9%):</span>
                  <span>₹1.53</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    color: 'var(--ux4g-primary, #064e3b)',
                    paddingTop: '0.35rem',
                    borderTop: '1px solid #e2e8f0',
                    fontSize: '0.925rem',
                  }}
                >
                  <span>Total Amount Payable:</span>
                  <span>₹10.00</span>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handlePayAndSeed}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--ux4g-primary, #064e3b)',
                }}
              >
                {isProcessing ? (
                  <span>Processing Payment of ₹10...</span>
                ) : (
                  <span>Pay ₹10.00 & Seed Mobile to 7/12 RoR</span>
                )}
              </Button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  &larr; Back to Parcel Details
                </button>
              </div>
            </div>
          )}

          {step === 3 && receiptData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Success Badge */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', color: '#15803d' }}>
                  Mobile Number Successfully Seeded!
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Official 7/12 RoR cadastral records updated in e-Mahabhumi registry.
                </div>
              </div>

              {/* Official e-Challan Receipt */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  fontFamily: 'var(--ux4g-font-sans)',
                  fontSize: '0.825rem',
                }}
              >
                <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.65rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--ux4g-primary, #064e3b)', fontSize: '0.9rem' }}>
                    GOVERNMENT OF MAHARASHTRA &bull; REVENUE DEPARTMENT
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    e-Receipt for Mobile Seeding to Record of Rights (Form 7/12 & 8A)
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <div><strong>Ack Receipt No:</strong> <code>{receiptData.ackNo}</code></div>
                  <div><strong>Transaction ID:</strong> <code>{receiptData.txnId}</code></div>
                  <div><strong>Date & Time:</strong> {receiptData.date}</div>
                  <div><strong>Payment Status:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>PAID (₹10.00)</span></div>
                  <div><strong>Landholder:</strong> {receiptData.citizenName}</div>
                  <div><strong>Seeded Mobile:</strong> {receiptData.mobile}</div>
                  <div><strong>Survey / Gat:</strong> No. {receiptData.surveyNo} / Gat {receiptData.gatNo}</div>
                  <div><strong>ULPIN Parcel:</strong> <code>{receiptData.parcelId}</code></div>
                </div>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#475569',
                  }}
                >
                  This is a digitally generated e-Challan receipt under Section 148A of the MLR Code 1966. Does not require physical signature.
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button
                  variant="outline"
                  style={{ flex: 1 }}
                  onClick={() => alert(`Downloaded receipt ${receiptData.ackNo}.pdf`)}
                >
                  <Download size={15} />
                  <span>Download Receipt</span>
                </Button>
                <Button
                  variant="primary"
                  style={{ flex: 1, backgroundColor: 'var(--ux4g-primary, #064e3b)' }}
                  onClick={onClose}
                >
                  <span>Return to Dashboard</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RorMobileSeedingModal;
