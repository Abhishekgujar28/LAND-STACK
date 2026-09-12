/**
 * GIS_mapping/components/ParcelInfoPanel.jsx
 *
 * Right-side parcel information panel for the citizen GIS dashboard.
 * Matches SIH_26014 Version 2 specifications and reference screenshot:
 * - Header: Selected Parcel, Share/Favorite/Close icons, ULPIN, Gat/Survey, Location, CLEAR status badge
 * - Tabs: Overview, Ownership, Documents, Nearby
 * - Overview Table: Survey No, Gat No, Area, Land Use, Classification, Circle Rate, Khatadar Type, Admin Hierarchy
 * - Action buttons:
 *     1. View Official RoR (7/12 & 8A) [Dark green]
 *     2. Download Parcel Map [White outline]
 *     3. Apply for Resurvey [Bright orange]
 *     4. Row: [Add to Watchlist] | [Report Issue]
 */

import React, { useState } from 'react';
import {
  X,
  Share2,
  Heart,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Edit3,
  Bookmark,
  Flag,
  User,
  FileCheck,
  Navigation,
  Info,
} from 'lucide-react';
import {
  ownershipRecords,
  parcelDocuments,
  nearbyFeatures,
  prototypeWatchlist,
} from '../data/citizenData.js';
import { downloadParcelMap } from './DownloadParcelMap.js';

const TABS = ['Overview', 'Ownership', 'Documents', 'Nearby'];

const NearbyIcon = ({ type }) => {
  const icons = {
    road: '🛣️',
    water: '💧',
    village: '🏘️',
    ward: '🗺️',
    school: '🏫',
    hospital: '🏥',
  };
  return <span aria-hidden="true">{icons[type] || '📍'}</span>;
};

const ParcelInfoPanel = ({
  parcel,
  onClose,
  onOpenDetailPopup = null,
  onOpenRor,
  onApplyResurvey,
  onReportIssue,
}) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [watchlisted, setWatchlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!parcel) return null;

  const p = parcel.properties || parcel;
  const ulpin = p.ulpin || 'ULPIN-MH-PUN-000001';

  const ownership =
    ownershipRecords.find((o) => o.parcel_ulpin === ulpin) ||
    ownershipRecords[0];
  const docs =
    parcelDocuments[ulpin] || parcelDocuments['ULPIN-MH-PUN-000001'] || [];
  const nearby =
    nearbyFeatures[ulpin] || nearbyFeatures['ULPIN-MH-PUN-000001'];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2800);
  };

  const handleWatchlist = () => {
    if (watchlisted) {
      prototypeWatchlist.remove(ulpin);
      setWatchlisted(false);
      showToast('Removed from Watchlist');
    } else {
      prototypeWatchlist.add(ulpin);
      setWatchlisted(true);
      showToast('✓ Added to Land Watchlist');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/citizen/mapping?ulpin=${ulpin}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      showToast('✓ Share link copied to clipboard');
    } else {
      showToast(`Link: ${shareUrl}`);
    }
  };

  return (
    <aside
      className="parcel-info-panel"
      aria-label="Selected parcel information"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* ── Panel Header ─────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '16px 18px 12px',
          borderBottom: '1px solid #f1f5f9',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#64748b',
            }}
          >
            SELECTED PARCEL
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={handleShare}
              title="Share Parcel"
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              <Share2 size={15} />
            </button>
            <button
              type="button"
              onClick={handleWatchlist}
              title={watchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              style={{
                background: 'none',
                border: 'none',
                color: watchlisted ? '#dc2626' : '#64748b',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              <Heart size={15} fill={watchlisted ? '#dc2626' : 'none'} />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close"
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ULPIN & Gat / Survey */}
        <div
          style={{
            fontSize: '11.5px',
            fontFamily: 'monospace',
            fontWeight: 700,
            color: '#334155',
            marginTop: '2px',
          }}
        >
          {ulpin}
        </div>

        <div
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            marginTop: '2px',
          }}
        >
          Gat No. {p.gat_number || '42'}{' '}
          <span
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#64748b',
            }}
          >
            (Survey {p.survey_number || '104'})
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: '#64748b',
            marginTop: '4px',
          }}
        >
          <MapPin size={12} color="#0f766e" />
          <span>
            {p.village_name || 'Wagholi'}, {p.tehsil || 'Haveli'},{' '}
            {p.district || 'Pune'}, {p.state || 'Maharashtra'}
          </span>
        </div>

        {/* Status Badge */}
        <div style={{ marginTop: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: '#dcfce7',
              color: '#15803d',
              border: '1px solid #bbf7d0',
            }}
          >
            <CheckCircle2 size={12} />
            CLEAR
          </span>
        </div>
      </div>

      {/* ── Tabs Header ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#fafafa',
        }}
        role="tablist"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '9px 4px',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0f766e' : '#64748b',
                border: 'none',
                borderBottom: isActive ? '2px solid #0f766e' : '2px solid transparent',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '14px 18px',
          flex: 1,
          overflowY: 'auto',
          fontSize: '12.5px',
        }}
      >
        {activeTab === 'Overview' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['Survey Number', p.survey_number || '104'],
                ['Gat Number', p.gat_number || '42'],
                ['Area (as per record)', `${p.area || '1.45'} Hectare (${p.area_local || '58 Guntha'})`],
                ['Land Use', p.land_use || 'Agricultural'],
                ['Classification', p.classification || 'Jirayat'],
                ['Circle Rate (Indicative)', p.circle_rate || '₹ 4.64 Cr'],
                ['Khatadar Type', p.khatadar_type || 'Government / Municipal Record'],
                [
                  'Administrative Hierarchy',
                  p.admin_hierarchy ||
                    `${p.village_name || 'Wagholi'} > ${p.tehsil || 'Haveli'} > ${p.district || 'Pune'} > ${p.state || 'Maharashtra'}`,
                ],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ color: '#64748b', fontWeight: 500 }}>
                    {label}
                  </span>
                  <span
                    style={{
                      color: '#1e293b',
                      fontWeight: 600,
                      textAlign: 'right',
                      maxWidth: '60%',
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: '10px',
                color: '#94a3b8',
                marginTop: '12px',
                fontStyle: 'italic',
                lineHeight: 1.4,
              }}
            >
              * Prototype demonstration data. Does not constitute a legal title guarantee or official revenue certificate.
            </p>
          </div>
        )}

        {activeTab === 'Ownership' && (
          <div>
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#0f766e',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {ownership.owner_name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {ownership.owner_name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {ownership.owner_local_name}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Share</span>
                  <strong>{ownership.share}% ({ownership.relation})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Identity Status</span>
                  <strong style={{ color: '#15803d' }}>✓ {ownership.aadhaar_status}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>KYC Status</span>
                  <strong style={{ color: '#15803d' }}>✓ {ownership.kyc_status}</strong>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '10px', color: '#94a3b8' }}>
              Note: Aadhaar numbers and sensitive identifiers are masked for citizen privacy per DoLR guidelines.
            </p>
          </div>
        )}

        {activeTab === 'Documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {docs.map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck size={16} color="#0f766e" />
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>
                      {doc.title}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                      {doc.status} &bull; {doc.date}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Downloading ${doc.title} (Demo)`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0f766e',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  title="Download Document"
                >
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Nearby' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {nearby &&
              Object.entries(nearby).map(([k, item]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <NearbyIcon type={item.icon} />
                    <span style={{ fontWeight: 500, color: '#334155' }}>
                      {item.label}
                    </span>
                  </div>
                  <strong style={{ color: '#0f766e', fontSize: '11px' }}>
                    {item.distance}
                  </strong>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ── Action Buttons Stack ─────────────────────────────────────────── */}
      <div
        style={{
          padding: '14px 18px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Button 0: View Land Details Pop-up */}
        {onOpenDetailPopup && (
          <button
            type="button"
            onClick={() => onOpenDetailPopup(parcel)}
            style={{
              width: '100%',
              padding: '9px 12px',
              backgroundColor: '#0f766e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(15, 118, 110, 0.25)',
            }}
          >
            <Info size={15} />
            <span>भूखंड तपशील पॉप-अप (Details Pop-up)</span>
          </button>
        )}

        {/* Button 1: View Official RoR (7/12 & 8A) */}
        <button
          type="button"
          onClick={() => onOpenRor?.(parcel)}
          style={{
            width: '100%',
            padding: '9px 12px',
            backgroundColor: '#064e3b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.825rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(6, 78, 59, 0.2)',
          }}
        >
          <FileText size={15} />
          <span>View Official RoR (7/12 &amp; 8A)</span>
        </button>

        {/* Button 2: Download Parcel Map */}
        <button
          type="button"
          onClick={() => downloadParcelMap(parcel)}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: '#ffffff',
            color: '#334155',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Download size={14} />
          <span>Download Parcel Map</span>
        </button>

        {/* Button 3: Apply for Resurvey */}
        <button
          type="button"
          onClick={() => onApplyResurvey?.(parcel)}
          style={{
            width: '100%',
            padding: '9px 12px',
            backgroundColor: '#ea580c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.825rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(234, 88, 12, 0.25)',
          }}
        >
          <Edit3 size={15} />
          <span>Apply for Resurvey</span>
        </button>

        {/* Bottom Row: Add to Watchlist | Report Issue */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px' }}>
          <button
            type="button"
            onClick={handleWatchlist}
            style={{
              padding: '7px 8px',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <Bookmark size={13} color="#0f766e" />
            <span>Add to Watchlist</span>
          </button>

          <button
            type="button"
            onClick={() => onReportIssue?.(parcel)}
            style={{
              padding: '7px 8px',
              backgroundColor: '#ffffff',
              color: '#dc2626',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <Flag size={13} color="#dc2626" />
            <span>Report Issue</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            zIndex: 100,
            whiteSpace: 'nowrap',
          }}
        >
          {toastMessage}
        </div>
      )}
    </aside>
  );
};

export default ParcelInfoPanel;
