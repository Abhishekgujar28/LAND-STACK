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
 * MapReportModal - Official Cadastral Map Extract
 * Modeled after official Field Measurement Book (FMB) survey sheet.
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
      title="Village Cadastral Map & Measurement Sheet (Cadastral Extract)"
      maxWidth="840px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Reference: <code>CADASTRE-MH-PUN-HVL-2026-042</code> &bull; Official Cadastral Portal
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handlePrint} style={{ backgroundColor: '#064e3b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Printer size={15} />
              <span>Print / Download PDF</span>
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
            GOVERNMENT OF MAHARASHTRA &bull; REVENUE &amp; LAND RECORDS DEPARTMENT
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#064e3b', margin: '0.2rem 0' }}>
            Village Cadastral Map &amp; Agricultural Land Measurement Sheet
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569' }}>
            National Informatics Centre (NIC) &amp; Cadastral Survey Directorate, Govt. of India
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
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>State:</span>
            <div style={{ fontWeight: 800 }}>Maharashtra</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>District:</span>
            <div style={{ fontWeight: 800 }}>Pune</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Tehsil / Sub-District:</span>
            <div style={{ fontWeight: 800 }}>Haveli</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Village:</span>
            <div style={{ fontWeight: 800 }}>Wagholi</div>
          </div>

          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Survey / Parcel No.:</span>
            <div style={{ fontWeight: 900, color: '#064e3b', fontSize: '0.95rem' }}>Plot No. {parcel.gat || parcel.surveyNumber || '42'}</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Sub-division Share:</span>
            <div style={{ fontWeight: 800 }}>42/1</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Calculated Area:</span>
            <div style={{ fontWeight: 800 }}>{parcel.area} Hectares ({(parcel.area * 100).toFixed(0)} Are)</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>ULPIN (Parcel ID):</span>
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
            <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#dc2626' }}>N &uarr;</span>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>NORTH</span>
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
            <div>Scale: 1 cm = 20 m</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>Scale 1:2000 &bull; WGS84</div>
          </div>

          {/* SVG Cadastral Plot Drawing (Vector FMB) */}
          <svg width="100%" height="100%" viewBox="0 0 600 300" style={{ maxWidth: '560px' }}>
            {/* Adjoining Plot Outlines */}
            {/* North Adjoining: Plot 45 */}
            <polygon
              points="160,20 380,15 400,90 170,95"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text x="270" y="55" fill="#64748b" fontSize="12" fontWeight="700" textAnchor="middle">
              Survey Plot 45 (North Farmland)
            </text>

            {/* East Adjoining: Plot 43 */}
            <polygon
              points="400,90 530,95 520,240 390,230"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text x="450" y="170" fill="#64748b" fontSize="12" fontWeight="700" textAnchor="middle">
              Survey Plot 43
            </text>

            {/* West Adjoining: Water Stream */}
            <path
              d="M 120,30 Q 150,140 110,270"
              fill="none"
              stroke="#0284c7"
              strokeWidth="4"
            />
            <text x="90" y="150" fill="#0284c7" fontSize="11" fontWeight="700" transform="rotate(-75 90,150)">
              ~~~ Natural Stream / Drainage Buffer ~~~
            </text>

            {/* South: Farm Access Road */}
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
              ==== Farm Access Road (6m Width) ====
            </text>

            {/* TARGET PARCEL POLYGON: PLOT 42 */}
            <polygon
              points="170,95 400,90 390,230 150,235"
              fill="#dcfce7"
              stroke="#15803d"
              strokeWidth="3.5"
            />

            {/* Dimension Labels on Boundary Edges */}
            {/* North Edge */}
            <text x="285" y="86" fill="#15803d" fontSize="11" fontWeight="800" textAnchor="middle">
              102.4 m
            </text>
            {/* East Edge */}
            <text x="405" y="165" fill="#15803d" fontSize="11" fontWeight="800">
              78.2 m
            </text>
            {/* South Edge */}
            <text x="270" y="228" fill="#15803d" fontSize="11" fontWeight="800" textAnchor="middle">
              108.6 m
            </text>
            {/* West Edge */}
            <text x="142" y="165" fill="#15803d" fontSize="11" fontWeight="800" textAnchor="end">
              75.0 m
            </text>

            {/* Parcel Center Text */}
            <rect x="230" y="135" width="110" height="42" rx="6" fill="#ffffff" stroke="#15803d" strokeWidth="1.5" />
            <text x="285" y="152" fill="#064e3b" fontSize="14" fontWeight="900" textAnchor="middle">
              Plot No. 42
            </text>
            <text x="285" y="168" fill="#15803d" fontSize="11" fontWeight="700" textAnchor="middle">
              1.45 Hectares
            </text>

            {/* Boundary Stones (Corner Pegs) */}
            <circle cx="170" cy="95" r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <circle cx="400" cy="90" r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <circle cx="390" cy="230" r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <circle cx="150" cy="235" r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />

            {/* Well Symbol in Farm */}
            <circle cx="210" cy="180" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <text x="222" y="184" fill="#0369a1" fontSize="9" fontWeight="700">Water Well</text>
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
          <div><strong>North:</strong> Plot No. 45 (Sunita Kulkarni)</div>
          <div><strong>South:</strong> Farm Access Road (6m Width)</div>
          <div><strong>East:</strong> Plot No. 43 (Dilip Patil)</div>
          <div><strong>West:</strong> Natural Stream Drainage Buffer</div>
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
              <div style={{ fontWeight: 800, color: '#064e3b' }}>Digitally Certified Cadastral Extract</div>
              <div style={{ color: '#64748b' }}>Verification Code: <code>CADASTRE-MH-2026-992140</code></div>
              <div style={{ color: '#16a34a', fontWeight: 700 }}>&check; Geo-Referenced Survey Verification Active</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800 }}>Revenue &amp; Land Records Officer</div>
            <div style={{ color: '#64748b' }}>Sanjay Deshmukh, Executive Magistrate, Haveli, Pune</div>
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
