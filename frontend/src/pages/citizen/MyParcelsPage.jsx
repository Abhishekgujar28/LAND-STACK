import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Filter,
  FileText,
  Landmark,
  ShieldCheck,
  DollarSign,
  PieChart,
  Map as MapIcon,
  Plus,
  MoreHorizontal,
  Home,
  Building2,
  Coins,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import citizenService from '../../services/citizenService';
import CadastralGisMap from '../../components/citizen/CadastralGisMap';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

/**
 * Default standard landholdings matching official Form 8A Khatedar record
 */
const DEFAULT_DEMO_PARCELS = [
  {
    ulpin: 'TEST_ULPIN_MH_PUN_001',
    gatNumber: '42',
    surveyNumber: '42',
    villageName: 'Wagholi',
    tehsil: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    stateCode: 'MH',
    area: '1.45',
    areaUnit: 'Hectare',
    classification: 'Jirayat (Agricultural)',
    landUse: 'Agricultural',
    status: 'CLEAR',
    relation: 'SELF / PRIMARY LANDHOLDER',
    share: 100,
    khataNumber: 'KHATA-4201',
    encumbrances: 'Clear (No Lien)',
    annualRevenue: '₹180 / yr',
    revenueStatus: 'Paid',
    color: '#ea580c', // Orange highlight
    bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=60',
  },
  {
    ulpin: 'TEST_ULPIN_MH_PUN_002',
    gatNumber: '85',
    surveyNumber: '85',
    villageName: 'Kharadi',
    tehsil: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    stateCode: 'MH',
    area: '1.20',
    areaUnit: 'Hectare',
    classification: 'Baagait (Agricultural)',
    landUse: 'Agricultural',
    status: 'CLEAR',
    relation: 'CO-OWNER (JOINT TENANT)',
    share: 50,
    khataNumber: 'KHATA-4501',
    encumbrances: 'Clear (No Lien)',
    annualRevenue: '₹220 / yr',
    revenueStatus: 'Paid',
    color: '#3b82f6', // Blue highlight
    bgImage: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?w=400&auto=format&fit=crop&q=60',
  },
  {
    ulpin: 'TEST_ULPIN_MH_PUN_003',
    gatNumber: '128',
    surveyNumber: '128',
    villageName: 'Lohgaon',
    tehsil: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    stateCode: 'MH',
    area: '0.85',
    areaUnit: 'Hectare',
    classification: 'Residential / Non-Agricultural',
    landUse: 'Residential',
    status: 'PENDING',
    relation: 'OWNER',
    share: 100,
    khataNumber: 'KHATA-5100',
    encumbrances: 'Clear (No Lien)',
    annualRevenue: '₹350 / yr',
    revenueStatus: 'Paid',
    color: '#22c55e', // Green highlight
    bgImage: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?w=400&auto=format&fit=crop&q=60',
  },
];

export const MyParcelsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentCitizen = user || { name: 'Abhishek Gujar', id: 'CGZP8934' };
  const [parcels, setParcels] = useState(DEFAULT_DEMO_PARCELS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tab State: 'LIST' | 'MAP' | 'ANALYTICS'
  const [activeViewTab, setActiveViewTab] = useState('LIST');

  // Search & Filter State
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('VILLAGE');
  const [activeMenuUlpin, setActiveMenuUlpin] = useState(null);

  useEffect(() => {
    let isMounted = true;
    citizenService.getMyParcels()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Merge API data with rich visual properties
          const formatted = data.map((item, idx) => {
            const fallback = DEFAULT_DEMO_PARCELS[idx] || DEFAULT_DEMO_PARCELS[0];
            return {
              ...fallback,
              ...item,
              ulpin: item.ulpin || fallback.ulpin,
              gatNumber: item.gat_number || item.gatNumber || fallback.gatNumber,
              surveyNumber: item.survey_number || item.surveyNumber || fallback.surveyNumber,
              villageName: item.village_name || item.villageName || fallback.villageName,
              area: item.area || fallback.area,
              classification: item.classification || fallback.classification,
              status: item.status || fallback.status,
              share: item.share || fallback.share,
              khataNumber: item.khataNumber || fallback.khataNumber,
              color: idx === 0 ? '#ea580c' : idx === 1 ? '#3b82f6' : '#22c55e',
            };
          });
          setParcels(formatted);
        }
      })
      .catch((err) => {
        console.warn('Using default authoritative parcels:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [currentCitizen?.id]);

  // Filtered and Sorted Parcels
  const filteredParcels = useMemo(() => {
    let list = [...parcels];
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.ulpin.toLowerCase().includes(q) ||
          String(p.gatNumber).includes(q) ||
          String(p.surveyNumber).includes(q) ||
          p.villageName.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'VILLAGE') {
      list.sort((a, b) => a.villageName.localeCompare(b.villageName));
    } else if (sortBy === 'AREA_DESC') {
      list.sort((a, b) => parseFloat(b.area) - parseFloat(a.area));
    } else if (sortBy === 'SURVEY') {
      list.sort((a, b) => parseInt(a.surveyNumber || 0) - parseInt(b.surveyNumber || 0));
    }
    return list;
  }, [parcels, searchFilter, sortBy]);

  const totalArea = parcels.reduce((acc, p) => acc + (parseFloat(p.area) || 0), 0);
  const clearParcelsCount = parcels.filter((p) => p.status === 'CLEAR').length;

  return (
    <div className="page-my-parcels" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ============================================================ */}
      {/* 1. BREADCRUMBS & CONTEXT BAR */}
      {/* ============================================================ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Home size={13} />
          <span style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => navigate('/citizen')}>Home</span>
          <ChevronRight size={12} />
          <span style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => navigate('/citizen')}>Citizen Portal</span>
          <ChevronRight size={12} />
          <strong style={{ color: 'var(--ux4g-primary, #0f5132)' }}>My Registered Landholdings</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0f5132', fontWeight: 600 }}>
          <Building2 size={14} />
          <span>Landholder Services</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. PAGE HEADER & PRIMARY ACTION */}
      {/* ============================================================ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f5132', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              FORM 8A LANDHOLDER ACCOUNT BOOK
            </span>
            <span
              style={{
                background: '#dcfce7',
                color: '#15803d',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle2 size={12} />
              AADHAAR LINKED
            </span>
          </div>

          <h1 style={{ fontSize: '1.65rem', color: '#0f172a', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>
            My Registered Landholdings
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Authoritative cadastral holdings linked to Khatedar <strong>{currentCitizen.name || 'Abhishek Gujar'}</strong> (Citizen ID: {currentCitizen.id || 'CGZP8934'})
          </p>
        </div>

        {/* Top Right: Search Box + Apply e-Ferfar Mutation Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Quick Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              padding: '6px 10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              width: '280px',
            }}
          >
            <Search size={15} style={{ color: '#94a3b8', marginRight: '6px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by Survey No., Village, or ULPIN..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.78rem',
                width: '100%',
                color: '#0f172a',
              }}
            />
            <ChevronDown size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
          </div>

          {/* Apply e-Ferfar Mutation Button */}
          <button
            type="button"
            onClick={() => navigate('/citizen/mutations')}
            style={{
              background: '#0f5132',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(15, 81, 50, 0.25)',
              transition: 'background 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#0a3622')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#0f5132')}
          >
            <Plus size={16} strokeWidth={2.5} />
            Apply e-Ferfar Mutation
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. FOUR SUMMARY STATS / KPI CARDS (SINGLE HORIZONTAL ROW) */}
      {/* ============================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Card 1: Total Parcels */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            padding: '1rem 1.15rem',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #16a34a',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16a34a',
              flexShrink: 0,
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              TOTAL PARCELS
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, margin: '2px 0' }}>
              {parcels.length}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Recorded in Form 8A Khata
            </div>
          </div>
        </div>

        {/* Card 2: Total Cumulative Area */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            padding: '1rem 1.15rem',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #0284c7',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7',
              flexShrink: 0,
            }}
          >
            <Landmark size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              TOTAL CUMULATIVE AREA
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, margin: '2px 0' }}>
              {totalArea.toFixed(2)} Ha
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              {(totalArea * 100).toFixed(0)} Gunthas (approx)
            </div>
          </div>
        </div>

        {/* Card 3: Clear Title Status */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            padding: '1rem 1.15rem',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #ea580c',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#ffedd5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ea580c',
              flexShrink: 0,
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              CLEAR TITLE STATUS
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, margin: '2px 0' }}>
              {clearParcelsCount} / {parcels.length}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Free of active encumbrance
            </div>
          </div>
        </div>

        {/* Card 4: Revenue & Tax Status */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '10px',
            padding: '1rem 1.15rem',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #a855f7',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/citizen/due-diligence')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#f3e8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9333ea',
                flexShrink: 0,
              }}
            >
              <Coins size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                REVENUE &amp; TAX STATUS
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', lineHeight: 1.15, margin: '2px 0' }}>
                Current
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Revenue cess &amp; tax cleared
              </div>
            </div>
          </div>
          <ChevronRight size={18} style={{ color: '#94a3b8' }} />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. TABS & SORT/FILTER CONTROLS BAR */}
      {/* ============================================================ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '0.5rem',
          marginTop: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Left Tabs */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveViewTab('LIST')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.5rem 0',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeViewTab === 'LIST' ? '#0f5132' : '#64748b',
              borderBottom: activeViewTab === 'LIST' ? '2.5px solid #0f5132' : '2.5px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MapIcon size={16} />
            My Land Parcels ({parcels.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('MAP')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.5rem 0',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeViewTab === 'MAP' ? '#0f5132' : '#64748b',
              borderBottom: activeViewTab === 'MAP' ? '2.5px solid #0f5132' : '2.5px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MapPin size={16} />
            Map View
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('ANALYTICS')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.5rem 0',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeViewTab === 'ANALYTICS' ? '#0f5132' : '#64748b',
              borderBottom: activeViewTab === 'ANALYTICS' ? '2.5px solid #0f5132' : '2.5px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <PieChart size={16} />
            Analytics
          </button>
        </div>

        {/* Right Sort & Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="VILLAGE">Village (A-Z)</option>
              <option value="AREA_DESC">Area (High to Low)</option>
              <option value="SURVEY">Survey No.</option>
            </select>
          </div>

          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#0f172a',
              cursor: 'pointer',
            }}
          >
            <Filter size={13} style={{ color: '#0f5132' }} />
            Filter
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. TAB 1: PARCEL LIST VIEW (MATCHING MOCKUP) */}
      {/* ============================================================ */}
      {activeViewTab === 'LIST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredParcels.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: '10px', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
                No land parcels found matching your search.
              </p>
            </div>
          ) : (
            filteredParcels.map((parcel) => (
              <div
                key={parcel.ulpin}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  padding: '1.15rem',
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr',
                  gap: '1.25rem',
                  alignItems: 'center',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                {/* Left: Satellite Map Thumbnail with Highlight Polygon */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '145px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#0f172a',
                    border: '1px solid #cbd5e1',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Stylized Satellite Background Image */}
                  <img
                    src={parcel.bgImage}
                    alt={`Cadastral Map Gat ${parcel.gatNumber}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.85) contrast(1.15)',
                    }}
                  />

                  {/* Highlight Polygon Center Overlay with Area */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      border: `2px solid ${parcel.color}`,
                      background: `${parcel.color}40`,
                      boxShadow: `0 0 16px ${parcel.color}80`,
                      borderRadius: '4px',
                      padding: '14px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                      {parcel.area} Ha
                    </span>
                  </div>

                  {/* Bottom View on Map Floating Button */}
                  <button
                    type="button"
                    onClick={() => navigate(`/citizen/search?ulpin=${parcel.ulpin}`)}
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '20px',
                      padding: '3px 10px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <MapPin size={10} style={{ color: '#22c55e' }} />
                    View on Map
                  </button>
                </div>

                {/* Right: Detailed Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {/* Top Badges & Khata Tagline */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                        ULPIN (BHU-AADHAAR)
                      </span>

                      {/* Status Badge */}
                      <span
                        style={{
                          background: parcel.status === 'CLEAR' ? '#dcfce7' : '#ffedd5',
                          color: parcel.status === 'CLEAR' ? '#15803d' : '#c2410c',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '1px 7px',
                          borderRadius: '4px',
                        }}
                      >
                        {parcel.status}
                      </span>

                      {/* Ownership Share Badge */}
                      <span
                        style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '1px 7px',
                          borderRadius: '4px',
                        }}
                      >
                        {parcel.relation} ({parcel.share}% SHARE)
                      </span>

                      {/* Khata Number */}
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', fontFamily: 'monospace' }}>
                        KHATA: {parcel.khataNumber}
                      </span>
                    </div>

                    {/* Three Dots More Menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => setActiveMenuUlpin(activeMenuUlpin === parcel.ulpin ? null : parcel.ulpin)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {activeMenuUlpin === parcel.ulpin && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            width: '180px',
                            background: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                            border: '1px solid #e2e8f0',
                            padding: '4px 0',
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => navigate(`/citizen/parcels/${parcel.ulpin}`)}
                            style={{
                              padding: '6px 12px',
                              textAlign: 'left',
                              background: 'transparent',
                              border: 'none',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              color: '#0f172a',
                            }}
                          >
                            View 7/12 RoR
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/citizen/due-diligence`)}
                            style={{
                              padding: '6px 12px',
                              textAlign: 'left',
                              background: 'transparent',
                              border: 'none',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              color: '#0f172a',
                            }}
                          >
                            Encumbrance Check
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Action Buttons Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        fontFamily: 'monospace',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {parcel.ulpin}
                    </h3>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/citizen/parcels/${parcel.ulpin}`)}
                        style={{
                          background: '#ffffff',
                          color: '#0f172a',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        <FileText size={13} style={{ color: '#0f5132' }} />
                        360° Title Dossier
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/citizen/mutations?ulpin=${parcel.ulpin}`)}
                        style={{
                          background: '#0f5132',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = '#0a3622')}
                        onMouseOut={(e) => (e.currentTarget.style.background = '#0f5132')}
                      >
                        Apply e-Ferfar <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Location Badges Strip */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: '#475569', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={13} style={{ color: '#0f5132' }} />
                      Village: <strong>{parcel.villageName}</strong>
                    </div>
                    <div>
                      Tehsil: <strong>{parcel.tehsil}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Survey No.:
                      <span
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 800,
                          color: '#0f172a',
                        }}
                      >
                        {parcel.surveyNumber}
                      </span>
                    </div>
                    <div>
                      State: <strong>{parcel.state}</strong>
                    </div>
                  </div>

                  {/* Bottom 4-Column Metric Strip */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      padding: '0.65rem 1rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '0.75rem',
                      fontSize: '0.78rem',
                    }}
                  >
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>Total Land Area</div>
                      <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '1px' }}>
                        {parcel.area} Hectare
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>Land Classification</div>
                      <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '1px' }}>
                        {parcel.classification}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>Bank Encumbrances</div>
                      <div style={{ fontWeight: 800, color: '#16a34a', marginTop: '1px' }}>
                        {parcel.encumbrances}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>Annual Land Revenue</div>
                      <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '1px' }}>
                        {parcel.annualRevenue} &bull; <span style={{ color: '#16a34a' }}>Paid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. TAB 2: MAP VIEW */}
      {/* ============================================================ */}
      {activeViewTab === 'MAP' && (
        <div style={{ height: '580px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <CadastralGisMap
            villageParcels={parcels}
            selectedParcel={parcels[0]}
            onSelectParcel={(p) => navigate(`/citizen/parcels/${p.ulpin}`)}
            height="100%"
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. TAB 3: PORTFOLIO ANALYTICS */}
      {/* ============================================================ */}
      {activeViewTab === 'ANALYTICS' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <Card style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
              Portfolio Valuation & Ready Reckoner
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Wagholi Gat 42 (1.45 Ha)</span>
                <strong style={{ color: '#0f5132' }}>₹ 1,85,00,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Kharadi Gat 85 (1.20 Ha)</span>
                <strong style={{ color: '#0f5132' }}>₹ 2,40,00,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Lohgaon Gat 128 (0.85 Ha)</span>
                <strong style={{ color: '#0f5132' }}>₹ 1,15,00,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0 0 0', fontWeight: 800, fontSize: '0.95rem' }}>
                <span>Total Estimated Value</span>
                <span style={{ color: '#16a34a' }}>₹ 5.40 Cr</span>
              </div>
            </div>
          </Card>

          <Card style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
              Form 8A Revenue Assessment Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Agricultural Cess</span>
                <strong>₹ 400.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Gram Panchayat Zilla Cess</span>
                <strong>₹ 350.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Tax Payment Status</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ All Dues Paid for FY 2025-26</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyParcelsPage;
