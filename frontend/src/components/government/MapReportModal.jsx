import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {
  Printer,
  Download,
  Compass,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  FileText,
} from 'lucide-react';

/**
 * MapReportModal - Official MahaBhunaksha Cadastral Map Extract (नकाशा प्रत)
 * Modeled after NIC MahaBhunaksha official Field Measurement Book (FMB) survey sheet.
 */
export const MapReportModal = ({ isOpen, onClose, parcel }) => {
  if (!parcel) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="गाव नमुना नकाशा व मोजणी प्रत (MahaBhunaksha Map Report)"
      maxWidth="840px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Reference: <code>BHUNAKSHA-MH-PUN-HVL-2026-042</code> &bull; NIC Cadastral Portal
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={onClose}>
              बंद करा (Close)
            </Button>
            <Button variant="primary" onClick={handlePrint} style={{ backgroundColor: '#064e3b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Printer size={15} />
              <span>प्रिंट / PDF डाऊनलोड</span>
            </Button>
          </div>
        </div>
      }
    >
      <div
        className="bhunaksha-print-sheet"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#0f172a',
          padding: '1.25rem',
          backgroundColor: '#ffffff',
          border: '2px solid #0f172a',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        {/* Government Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            महाराष्ट्र शासन &bull; महसूल व भूमी अभिलेख विभाग
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#064e3b', margin: '0.2rem 0' }}>
            गाव नमुना नकाशा व शेतजमीन भू-मापन प्रत (MahaBhunaksha)
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569' }}>
            राष्ट्रीय सूचना विज्ञान केंद्र (NIC) व भूकर पुनरीक्षण महामंडळ, भारत सरकार
          </div>
        </div>

        {/* Location & Khata Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '0.75rem',
            backgroundColor: '#f8fafc',
            fontSize: '0.82rem',
            marginBottom: '1rem',
          }}
        >
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>राज्य (State):</span>
            <div style={{ fontWeight: 800 }}>महाराष्ट्र (Maharashtra)</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>जिल्हा (District):</span>
            <div style={{ fontWeight: 800 }}>पुणे (Pune)</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>तालुका (Taluka):</span>
            <div style={{ fontWeight: 800 }}>हवेली (Haveli)</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>गाव (Village):</span>
            <div style={{ fontWeight: 800 }}>वाघोली (Wagholi)</div>
          </div>

          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>गट / सर्व्हे क्र. (Gat No):</span>
            <div style={{ fontWeight: 900, color: '#064e3b', fontSize: '0.95rem' }}>गट क्र. {parcel.gat || parcel.surveyNumber || '४२'}</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>पोटहिस्सा (Sub-division):</span>
            <div style={{ fontWeight: 800 }}>४२/१ (42/1)</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>क्षेत्र (Calculated Area):</span>
            <div style={{ fontWeight: 800 }}>{parcel.area} हेक्टर ({(parcel.area * 100).toFixed(0)} आर)</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>भू-आधार (ULPIN):</span>
            <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.75rem' }}>{parcel.ulpin}</div>
          </div>
        </div>

        {/* Primary Cadastral Drawing Container */}
        <div
          style={{
            position: 'relative',
            height: '320px',
            border: '2px solid #334155',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            marginBottom: '1rem',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* North Direction Arrow (Top Right) */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
            }}
          >
            <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#dc2626' }}>N ↑</span>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>उत्तर</span>
          </div>

          {/* Scale Indicator (Top Left) */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '16px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.7rem',
              color: '#334155',
            }}
          >
            <div>प्रमाण: १ सेमी = २० मीटर</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>Scale 1:2000 &bull; WGS84</div>
          </div>

          {/* SVG Cadastral Plot Drawing (Vector FMB) */}
          <svg width="100%" height="100%" viewBox="0 0 600 300" style={{ maxWidth: '560px' }}>
            {/* Adjoining Plot Outlines */}
            {/* North Adjoining: Gat 45 */}
            <polygon
              points="160,20 380,15 400,90 170,95"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text x="270" y="55" fill="#64748b" fontSize="12" fontWeight="700" textAnchor="middle">
              गट क्र. ४५ (उत्तर शेतजमीन)
            </text>

            {/* East Adjoining: Gat 43 */}
            <polygon
              points="400,90 530,95 520,240 390,230"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text x="450" y="170" fill="#64748b" fontSize="12" fontWeight="700" textAnchor="middle">
              गट क्र. ४३
            </text>

            {/* West Adjoining: Water Nala */}
            <path
              d="M 120,30 Q 150,140 110,270"
              fill="none"
              stroke="#0284c7"
              strokeWidth="4"
            />
            <text x="90" y="150" fill="#0284c7" fontSize="11" fontWeight="700" transform="rotate(-75 90,150)">
              ~~~ ओढा / नाला (Nala) ~~~
            </text>

            {/* South: Shetkari Rasta / Road */}
            <rect
              x="130"
              y="245"
              width="410"
              height="28"
              fill="#fed7aa"
              stroke="#ea580c"
              strokeWidth="1.5"
              strokeDasharray="6,4"
            />
            <text x="330" y="263" fill="#9a3412" fontSize="11" fontWeight="800" textAnchor="middle">
              ==== शेत रस्ता (६ मीटर रुंद पांदण रस्ता) ====
            </text>

            {/* TARGET PARCEL POLYGON: GAT 42 */}
            <polygon
              points="170,95 400,90 390,230 150,235"
              fill="#dcfce7"
              stroke="#15803d"
              strokeWidth="3.5"
            />

            {/* Dimension Labels on Boundary Edges */}
            {/* North Edge */}
            <text x="285" y="86" fill="#15803d" fontSize="11" fontWeight="800" textAnchor="middle">
              १०२.४ मी (102.4m)
            </text>
            {/* East Edge */}
            <text x="405" y="165" fill="#15803d" fontSize="11" fontWeight="800">
              ७८.२ मी (78.2m)
            </text>
            {/* South Edge */}
            <text x="270" y="228" fill="#15803d" fontSize="11" fontWeight="800" textAnchor="middle">
              १०८.६ मी (108.6m)
            </text>
            {/* West Edge */}
            <text x="142" y="165" fill="#15803d" fontSize="11" fontWeight="800" textAnchor="end">
              ७५.० मी (75.0m)
            </text>

            {/* Parcel Center Text */}
            <rect x="230" y="135" width="110" height="42" rx="6" fill="#ffffff" stroke="#15803d" strokeWidth="1.5" />
            <text x="285" y="152" fill="#064e3b" fontSize="14" fontWeight="900" textAnchor="middle">
              गट क्र. ४२
            </text>
            <text x="285" y="168" fill="#15803d" fontSize="11" fontWeight="700" textAnchor="middle">
              १ हेक्टर ४५ आर
            </text>

            {/* Boundary Stones (Corner Pegs / Shew) */}
            <circle cx="170" cy="95" r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <circle cx="400" cy="90" r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <circle cx="390" cy="230" r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <circle cx="150" cy="235" r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />

            {/* Well Symbol in Farm */}
            <circle cx="210" cy="180" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <text x="222" y="184" fill="#0369a1" fontSize="9" fontWeight="700">विहीर</text>
          </svg>
        </div>

        {/* Adjoining Properties & Boundary Ledger */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            fontSize: '0.78rem',
            marginBottom: '1rem',
          }}
        >
          <div><strong>उत्तर (North):</strong> गट क्र. ४५ (सुनिता कुलकर्णी)</div>
          <div><strong>दक्षिण (South):</strong> शेत रस्ता (६ मी. पांदण रस्ता)</div>
          <div><strong>पूर्व (East):</strong> गट क्र. ४३ (दिलीप पाटील)</div>
          <div><strong>पश्चिम (West):</strong> नैसर्गिक ओढा / नाला</div>
        </div>

        {/* Legal Certification Block & Digital QR */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '2px solid #0f172a',
            paddingTop: '0.75rem',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
              }}
            >
              <QrCode size={52} color="#064e3b" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#064e3b' }}>डिजिटल स्वाक्षरीत अधिकृत भूकर प्रत</div>
              <div style={{ color: '#64748b' }}>तपासणी कोड: <code>MH-BHUNAKSHA-2026-992140</code></div>
              <div style={{ color: '#16a34a', fontWeight: 700 }}>✓ e-Mojani Geo-Referenced Verification Active</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800 }}>तलाठी / भूमी अभिलेख अधिकारी</div>
            <div style={{ color: '#64748b' }}>संजय देशमुख, तहसीलदार हवेली, पुणे</div>
            <div style={{ fontSize: '0.7rem', color: '#15803d', fontFamily: 'monospace' }}>
              Class-3 DSC Token Verified (SHA-256)
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MapReportModal;
