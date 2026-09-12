/**
 * GIS_mapping/components/LandDetailPopup.jsx
 *
 * Comprehensive Land Parcel Detail Pop-up Modal.
 * Appears when a citizen clicks on any land parcel on the Cadastral GIS map.
 * Displays:
 *  - Official Maharashtra Cadastre & Bhu-Naksha header
 *  - ULPIN with one-click copy and verified badge
 *  - Gat No., Survey No., Khatadar (Owner) name in English & Marathi
 *  - Accurate area breakdown (Hectare, Guntha, Sq. Meters, Acres)
 *  - Land Use, Soil Classification, Govt Circle Rate / Valuation
 *  - Interactive tabs:
 *      1. विहंगावलोकन (Overview & Ownership)
 *      2. नकाशा व सीमा (GIS & Boundaries)
 *      3. कायदेशीर स्थिती (Legal Status & Encumbrances)
 *      4. अधिकृत सेवा (Official Services)
 *  - Direct actions: View 7/12 (RoR), View FMB Map, Apply for Resurvey, Report Issue
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Share2,
  Copy,
  Check,
  Compass,
  Layers,
  ShieldCheck,
  Printer,
  RefreshCw,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { downloadParcelMap } from './DownloadParcelMap.js';

const TABS = [
  { id: 'overview', label: 'विहंगावलोकन (Overview)', icon: Info },
  { id: 'gis', label: 'नकाशा व सीमा (GIS & Boundaries)', icon: Compass },
  { id: 'legal', label: 'कायदेशीर स्थिती (Legal & Title)', icon: ShieldCheck },
  { id: 'services', label: 'शासकीय सेवा (Services)', icon: Layers },
];

const LandDetailPopup = ({
  isOpen,
  onClose,
  parcel,
  onOpenRor = null,
  onOpenMapReport = null,
  onApplyResurvey = null,
  onReportIssue = null,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !parcel) return null;

  const p = parcel.properties || parcel;

  const ulpin = p.ulpin || 'ULPIN-MH-PUN-000001';
  const surveyNumber = p.survey_number || p.surveyNumber || '104';
  const gatNumber = p.gat_number || p.gatNumber || '42';
  const villageName = p.village_name || p.village || 'Wagholi';
  const tehsil = p.tehsil || p.taluka || 'Haveli';
  const district = p.district || 'Pune';
  const state = p.state || 'Maharashtra';
  const areaHa = p.area || 1.45;
  const areaLocal = p.area_local || `${Math.round(areaHa * 40)} Guntha`;
  const landUse = p.land_use || p.landUse || 'Agricultural';
  const classification = p.classification || 'Jirayat';
  const status = p.status || 'CLEAR';
  const ownerName = p.owner_name || p.owner || 'Aarav Patil';
  const ownerLocal = p.owner_local || 'आरव पाटील';
  const circleRate = p.circle_rate || p.circleRate || '₹ 4.64 Cr';
  const khatadarType =
    p.khatadar_type || p.khatadarType || 'Individual Private Ownership';
  const adminHierarchy =
    p.admin_hierarchy ||
    p.adminHierarchy ||
    `${villageName} › ${tehsil} › ${district} › ${state}`;

  const centroid = p.centroid || [18.5793, 73.9812];
  const latStr = Array.isArray(centroid)
    ? centroid[0]?.toFixed(4)
    : centroid.lat?.toFixed(4) || '18.5793';
  const lngStr = Array.isArray(centroid)
    ? centroid[1]?.toFixed(4)
    : centroid.lng?.toFixed(4) || '73.9812';

  // Area conversions
  const areaGuntha = Math.round(Number(areaHa) * 40);
  const areaSqMt = (Number(areaHa) * 10000).toLocaleString('en-IN');
  const areaAcres = (Number(areaHa) * 2.47105).toFixed(2);

  const handleCopyUlpin = () => {
    navigator.clipboard?.writeText(ulpin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/citizen/mapping?ulpin=${encodeURIComponent(
      ulpin
    )}`;
    navigator.clipboard?.writeText(url);
    setShareFeedback('लिंक कॉपी झाली! (Link copied)');
    setTimeout(() => setShareFeedback(''), 2500);
  };

  return (
    <div
      className="modal-overlay land-detail-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="land-detail-popup-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'modal-fade 0.2s ease',
      }}
    >
      <div
        className="modal-sheet land-detail-modal"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          border: '1px solid #cbd5e1',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modal-slide 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* ─── Header: Official Government Cadastre Emblem & Title ─── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #0f766e 100%)',
            color: '#ffffff',
            padding: '16px 20px 14px',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  color: '#a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '3px',
                }}
              >
                <MapPin size={12} color="#a7f3d0" />
                <span>महाराष्ट्र शासन • भू-अभिलेख व कॅडस्ट्रल नोंद</span>
              </div>
              <h2
                id="land-detail-popup-title"
                style={{
                  margin: 0,
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span>गट क्र. {gatNumber}</span>
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#ccfbf1',
                  }}
                >
                  (सर्व्हे क्र. {surveyNumber})
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#e2e8f0',
                  }}
                >
                  • गाव {villageName}
                </span>
              </h2>
            </div>

            {/* Quick Header Actions: Share + Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={handleShare}
                title="Share Parcel Details"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <Share2 size={15} />
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Pop-up"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {shareFeedback && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '90px',
                background: '#ffffff',
                color: '#064e3b',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {shareFeedback}
            </div>
          )}

          {/* ULPIN & Status Bar */}
          <div
            style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* ULPIN copy badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.22)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#a7f3d0',
                  textTransform: 'uppercase',
                }}
              >
                ULPIN:
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                {ulpin}
              </span>
              <button
                type="button"
                onClick={handleCopyUlpin}
                title="Copy ULPIN"
                style={{
                  background: 'none',
                  border: 'none',
                  color: copied ? '#6ee7b7' : '#e2e8f0',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
              {copied && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: '#6ee7b7',
                    fontWeight: 700,
                  }}
                >
                  Copied!
                </span>
              )}
            </div>

            {/* Status Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#10b981',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }}
              >
                <CheckCircle2 size={12} />
                <span>{status === 'CLEAR' ? 'CLEAR / निर्विवाद' : status}</span>
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: '#ccfbf1',
                  fontWeight: 600,
                }}
              >
                Digitally Verified
              </span>
            </div>
          </div>
        </div>

        {/* ─── 4 Quick Metric Cards ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            padding: '14px 20px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          {/* 1. Total Area */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 10px',
            }}
          >
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              एकूण क्षेत्र (Area)
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#064e3b',
                marginTop: '2px',
              }}
            >
              {areaHa} Ha
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#0f766e',
              }}
            >
              {areaLocal}
            </div>
          </div>

          {/* 2. Owner */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 10px',
            }}
          >
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              खातेदार (Owner)
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#1e293b',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {ownerName}
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: '#64748b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {ownerLocal}
            </div>
          </div>

          {/* 3. Land Use */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 10px',
            }}
          >
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              भूवापर (Land Use)
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#1e293b',
                marginTop: '2px',
              }}
            >
              {landUse}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {classification}
            </div>
          </div>

          {/* 4. Circle Rate */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 10px',
            }}
          >
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              मूल्यांकन (Rate)
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#b45309',
                marginTop: '2px',
              }}
            >
              {circleRate}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Ready Reckoner
            </div>
          </div>
        </div>

        {/* ─── Tabs Navigation ─── */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '0 16px',
            overflowX: 'auto',
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '11px 14px',
                  border: 'none',
                  borderBottom: isTabActive
                    ? '2.5px solid #0f766e'
                    : '2.5px solid transparent',
                  backgroundColor: 'transparent',
                  color: isTabActive ? '#0f766e' : '#64748b',
                  fontSize: '0.8rem',
                  fontWeight: isTabActive ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── Tab Content (Scrollable Body) ─── */}
        <div
          style={{
            padding: '16px 20px',
            overflowY: 'auto',
            flex: 1,
            backgroundColor: '#ffffff',
          }}
        >
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {/* Detailed Property Parameters Grid */}
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '8px 14px',
                    borderBottom: '1px solid #e2e8f0',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#334155',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  मालमत्ता व महसुली तपशील (Land Record Specification)
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    fontSize: '0.825rem',
                  }}
                >
                  <div
                    style={{
                      padding: '8px 14px',
                      borderBottom: '1px solid #f1f5f9',
                      borderRight: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>गट क्रमांक (Gat No):</span>{' '}
                    <strong style={{ color: '#1e293b' }}>{gatNumber}</strong>
                  </div>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>सर्व्हे क्र (Survey No):</span>{' '}
                    <strong style={{ color: '#1e293b' }}>{surveyNumber}</strong>
                  </div>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderBottom: '1px solid #f1f5f9',
                      borderRight: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>गाव (Village):</span>{' '}
                    <strong style={{ color: '#1e293b' }}>{villageName}</strong>
                  </div>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>तालुका व जिल्हा:</span>{' '}
                    <strong style={{ color: '#1e293b' }}>
                      {tehsil}, {district}
                    </strong>
                  </div>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderBottom: '1px solid #f1f5f9',
                      borderRight: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>खाते प्रकार (Type):</span>{' '}
                    <span style={{ color: '#334155' }}>{khatadarType}</span>
                  </div>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>प्रतवारी (Class):</span>{' '}
                    <span style={{ color: '#334155' }}>{classification} (Jirayat)</span>
                  </div>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderRight: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>प्रशासन क्रम:</span>{' '}
                    <span style={{ color: '#334155', fontSize: '0.78rem' }}>
                      {adminHierarchy}
                    </span>
                  </div>
                  <div style={{ padding: '8px 14px' }}>
                    <span style={{ color: '#64748b' }}>अंतिम फेरफार:</span>{' '}
                    <strong style={{ color: '#0f766e' }}>
                      MUT-HAV-2018-00234
                    </strong>
                  </div>
                </div>
              </div>

              {/* Area Conversions Card */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '12px 16px',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#166534',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>प्रमाणित क्षेत्र परिमाणे (Certified Area Conversions)</span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      background: '#ffffff',
                      padding: '6px',
                      borderRadius: '6px',
                      border: '1px solid #dcfce7',
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      हेक्टर (Hectare)
                    </div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#15803d',
                        fontSize: '0.9rem',
                      }}
                    >
                      {areaHa} Ha
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#ffffff',
                      padding: '6px',
                      borderRadius: '6px',
                      border: '1px solid #dcfce7',
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      गुंठे (Guntha)
                    </div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#15803d',
                        fontSize: '0.9rem',
                      }}
                    >
                      {areaGuntha} Guntha
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#ffffff',
                      padding: '6px',
                      borderRadius: '6px',
                      border: '1px solid #dcfce7',
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      चौरस मीटर (Sq.M)
                    </div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#15803d',
                        fontSize: '0.85rem',
                      }}
                    >
                      {areaSqMt} m²
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#ffffff',
                      padding: '6px',
                      borderRadius: '6px',
                      border: '1px solid #dcfce7',
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      एकर (Acres)
                    </div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#15803d',
                        fontSize: '0.9rem',
                      }}
                    >
                      {areaAcres} Ac
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GIS & BOUNDARIES */}
          {activeTab === 'gis' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {/* Coordinates Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                    }}
                  >
                    भूखंड मध्यबिंदू निर्देशक (Centroid GPS Coordinates)
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0f766e',
                      marginTop: '2px',
                    }}
                  >
                    {latStr}° N, {lngStr}° E
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 700,
                  }}
                >
                  EPSG:4326 (WGS84)
                </span>
              </div>

              {/* Boundary / Direction Compass Chart */}
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#1e293b',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Compass size={14} color="#0f766e" />
                  <span>चतुःसीमा तपशील (Four Cadastral Boundaries / Limits)</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      borderLeft: '3px solid #0f766e',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#64748b',
                      }}
                    >
                      उत्तर (North)
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '0.85rem',
                      }}
                    >
                      वाघोली पांदण रस्ता (6m Farm Road)
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      borderLeft: '3px solid #0f766e',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#64748b',
                      }}
                    >
                      पूर्व (East)
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '0.85rem',
                      }}
                    >
                      गट क्रमांक ४३ (Survey 105)
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      borderLeft: '3px solid #0f766e',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#64748b',
                      }}
                    >
                      दक्षिण (South)
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '0.85rem',
                      }}
                    >
                      गट क्रमांक ४४ (Survey 106)
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      borderLeft: '3px solid #0f766e',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#64748b',
                      }}
                    >
                      पश्चिम (West)
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '0.85rem',
                      }}
                    >
                      गट क्रमांक ४१ (Survey 103)
                    </div>
                  </div>
                </div>
              </div>

              {/* Landmark proximity */}
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: '#1e40af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <MapPin size={16} />
                <span>
                  समीप जलस्रोत: <strong>वाघोली तलाव (Wagholi Lake)</strong> —
                  पश्चिमेस ३०० मीटर अंतरावर स्थित आहे.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: LEGAL STATUS & TITLE */}
          {activeTab === 'legal' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '8px 14px',
                    borderBottom: '1px solid #e2e8f0',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#334155',
                    textTransform: 'uppercase',
                  }}
                >
                  कायदेशीर पडताळणी स्थिती (Legal Due-Diligence Checklist)
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '0.825rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <span>न्यायालयीन दावा / वाद (Court Litigation):</span>
                    <span
                      style={{
                        color: '#166534',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={13} /> कोणताही वाद नाही (NIL)
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <span>बँक बोजा / कर्ज नोंद (Bank Encumbrance / Charge):</span>
                    <span
                      style={{
                        color: '#166534',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={13} /> निरंक (No Mortgage)
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <span>शासकीय भूसंपादन (Land Acquisition Notice):</span>
                    <span
                      style={{
                        color: '#166534',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={13} /> भूसंपादनात नाही (Clear)
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                    }}
                  >
                    <span>आधार ई-केवायसी पडताळणी (Aadhaar KYC Match):</span>
                    <span
                      style={{
                        color: '#166534',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={13} /> १००% प्रमाणित (Verified)
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  हे विवरण प्रोटोटाईप प्रात्यक्षिक डेटावर आधारित आहे. अधिकृत महसुली
                  कार्यासाठी ई-हक्क किंवा आपले सरकार पोर्टलवरून डिजिटल स्वाक्षरी
                  उतारा वापरावा.
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIAL SERVICES */}
          {activeTab === 'services' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  marginBottom: '2px',
                }}
              >
                या भूखंडासाठी थेट उपलब्ध डिजिटल सेवा (Instant Services)
              </div>

              {/* Service 1: View 7/12 */}
              <div
                onClick={() => onOpenRor && onOpenRor(parcel)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  cursor: onOpenRor ? 'pointer' : 'default',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#0f766e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileText size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      गाव नमुना ७/१२ व ८अ उतारा (Official RoR)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      महसूल विभागाचा अधिकृत हक्क नोंदणी दस्तऐवज
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#064e3b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  पहा (View)
                </button>
              </div>

              {/* Service 2: FMB Map Report */}
              <div
                onClick={() => {
                  if (onOpenMapReport) onOpenMapReport(parcel);
                  else downloadParcelMap(parcel);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#0f766e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Printer size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      कॅडस्ट्रल नकाशा प्रत (FMB Cadastral Map Extract)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      सीमांकन व मोजणी नकाशा पीडीएफ डाऊनलोड करा
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f1f5f9',
                    color: '#1e293b',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  नकाशा प्रत
                </button>
              </div>

              {/* Service 3: Resurvey Request */}
              <div
                onClick={() => onApplyResurvey && onApplyResurvey(parcel)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  cursor: onApplyResurvey ? 'pointer' : 'default',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#f59e0b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RefreshCw size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      पुनर्मोजणी अर्ज (Apply for Resurvey)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      हद्दी वाद किंवा क्षेत्र दुरुस्तीसाठी अधिकृत पुनर्मोजणी
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#d97706',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  अर्ज करा
                </button>
              </div>

              {/* Service 4: Report Issue */}
              <div
                onClick={() => onReportIssue && onReportIssue(parcel)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  cursor: onReportIssue ? 'pointer' : 'default',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      तक्रार नोंदणी (Report Map Issue / Dispute)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      नकाशा किंवा नोंदणी विसंगतीबाबत तक्रार दाखल करा
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  तक्रार
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Footer Action Bar ─── */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>अधिकृत भू-नकाशा प्रमाणक SIH 26014</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onOpenRor && (
              <button
                type="button"
                onClick={() => onOpenRor(parcel)}
                style={{
                  padding: '7px 14px',
                  backgroundColor: '#064e3b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '7px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 1px 3px rgba(6,78,59,0.3)',
                }}
              >
                <FileText size={14} />
                <span>७/१२ उतारा (RoR)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onOpenMapReport) onOpenMapReport(parcel);
                else downloadParcelMap(parcel);
              }}
              style={{
                padding: '7px 14px',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                border: '1px solid #cbd5e1',
                borderRadius: '7px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Printer size={14} />
              <span>नकाशा प्रत</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '7px 14px',
                backgroundColor: '#e2e8f0',
                color: '#334155',
                border: 'none',
                borderRadius: '7px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              बंद करा (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandDetailPopup;
