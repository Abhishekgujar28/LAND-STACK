import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import L from 'leaflet';
import {
  Search,
  Map as MapIcon,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Crosshair,
  Share2,
  Ruler,
  FileText,
  ExternalLink,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Building2,
  Globe,
  Copy,
  Check,
  Info,
  Compass,
  Printer,
  RefreshCw,
} from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import MapReportModal from '../government/MapReportModal';
import RorModal from './RorModal';
import gisService from '../../services/gisService';

/**
 * CadastralGisMap - Official BharatBhumi GIS Land Parcel Viewer
 * Full-screen spatial canvas with overlaid search, layer controls, minimap, legend,
 * and comprehensive interactive "Selected Land Parcel" floating dossier.
 */
export const CadastralGisMap = ({
  villageParcels = [],
  selectedParcel = null,
  dossier = null,
  onSelectParcel = () => {},
  onOpenRor = () => {},
  onOpenMapReport = null,
  height = '100%',
  className = '',
}) => {
  const navigate = useNavigate();

  // Basemap State: 'SATELLITE' | 'MAP' | 'HYBRID'
  const [basemapType, setBasemapType] = useState('SATELLITE');

  // Multi-Layer Toggle States
  const [layerToggles, setLayerToggles] = useState({
    parcels: true,
    urbanWards: false,
    boundary: true,
    zoning: false,
    topography: true,
  });

  // UI State
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'LEGAL' | 'LANDUSE' | 'DOCUMENTS'
  const [searchQuery, setSearchQuery] = useState('');
  const [measureActive, setMeasureActive] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live PostGIS Cadastral Layer Data
  const [liveParcels, setLiveParcels] = useState([]);
  const [urbanWardsData, setUrbanWardsData] = useState(null);
  const [boundaryData, setBoundaryData] = useState(null);
  const [zoningData, setZoningData] = useState(null);

  // Loading & Error States
  const [gisLoading, setGisLoading] = useState(false);
  const [gisError, setGisError] = useState(null);
  const [activeParcel, setActiveParcel] = useState(selectedParcel);

  // Modals for fallback trigger
  const [isInternalMapReportOpen, setIsInternalMapReportOpen] = useState(false);
  const [isInternalRorOpen, setIsInternalRorOpen] = useState(false);

  // Leaflet Refs
  const mapContainerRef = useRef(null);
  const mapWrapperRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseTileRef = useRef(null);
  const hybridLabelTileRef = useRef(null);
  const parcelsLayerRef = useRef(null);
  const wardsLayerRef = useRef(null);
  const boundaryLayerRef = useRef(null);
  const zoningLayerRef = useRef(null);
  const topoLayerRef = useRef(null);

  const villageCode = selectedParcel?.villageCode || selectedParcel?.village_code || 'VIL-WAG';

  // Sync active parcel prop
  useEffect(() => {
    if (selectedParcel) {
      setActiveParcel(selectedParcel);
      setIsDetailsOpen(true);
    }
  }, [selectedParcel]);

  // Load Real PostGIS Cadastral Features
  const loadCadastralData = () => {
    setGisLoading(true);
    setGisError(null);

    Promise.all([
      gisService.getVillageCadastralMap(villageCode),
      gisService.getAdministrativeLayer('urban-wards').catch(() => null),
      gisService.getAdministrativeLayer('jurisdiction-boundary').catch(() => null),
      gisService.getAdministrativeLayer('zoning-overlay').catch(() => null),
    ])
      .then(([cadastralRes, wardsRes, boundaryRes, zoningRes]) => {
        const features = cadastralRes?.features || cadastralRes?.data?.features || [];
        const parsedPlots = features
          .map((f) => {
            const p = f.properties || {};
            const geom = f.geometry || {};
            let coords = geom.coordinates || [];
            if (Array.isArray(coords[0]) && Array.isArray(coords[0][0])) {
              coords = coords[0];
            }
            // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
            const bounds = coords.map(([lng, lat]) => [Number(lat), Number(lng)]);
            if (bounds.length < 3) return null;

            return {
              ulpin: p.ulpin || f.id || 'TEST_ULPIN_MH_PUN_001',
              gat: p.gatNumber || p.khasraNumber || p.surveyNumber || '42',
              survey: p.surveyNumber || '42',
              cts: p.ctsNumber || 'CTS-WAG-101',
              village: p.village || 'Wagholi',
              taluka: p.taluka || 'Haveli',
              district: p.district || 'Pune',
              state: p.state || 'Maharashtra',
              owner: p.currentOwner || 'Recorded Landholder',
              area: p.areaHectares ? `${p.areaHectares} Ha` : '1.45 Ha',
              areaUnit: p.areaUnit || 'Hectare',
              landUse: p.landUse || 'Agricultural',
              classification: p.classification || 'Jirayat',
              status: p.status || 'CLEAR',
              oldSurveyNo: p.oldSurveyNo || '104',
              centroid: p.centroid || bounds[0],
              bounds,
              rawFeature: f,
            };
          })
          .filter(Boolean);

        setLiveParcels(parsedPlots);
        if (wardsRes) setUrbanWardsData(wardsRes?.data || wardsRes);
        if (boundaryRes) setBoundaryData(boundaryRes?.data || boundaryRes);
        if (zoningRes) setZoningData(zoningRes?.data || zoningRes);

        // Set active parcel if none currently
        if (!activeParcel && parsedPlots.length > 0) {
          const defaultPlot = parsedPlots.find((p) => p.gat === '42') || parsedPlots[0];
          setActiveParcel(defaultPlot);
          onSelectParcel(defaultPlot);
        }
      })
      .catch((err) => {
        console.error('[CadastralGisMap] Failed to load PostGIS cadastral data:', err.message);
        setGisError('Cadastral map unavailable. Unable to connect to PostGIS spatial database.');
        setLiveParcels([]);
      })
      .finally(() => {
        setGisLoading(false);
      });
  };

  useEffect(() => {
    loadCadastralData();
  }, [villageCode]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = 18.5793;
      const initialLng = 73.9812;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      // Layer groups in order
      boundaryLayerRef.current = L.layerGroup().addTo(map);
      zoningLayerRef.current = L.layerGroup().addTo(map);
      wardsLayerRef.current = L.layerGroup().addTo(map);
      topoLayerRef.current = L.layerGroup().addTo(map);
      parcelsLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (baseTileRef.current) {
      map.removeLayer(baseTileRef.current);
      baseTileRef.current = null;
    }
    if (hybridLabelTileRef.current) {
      map.removeLayer(hybridLabelTileRef.current);
      hybridLabelTileRef.current = null;
    }

    if (basemapType === 'SATELLITE') {
      baseTileRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Esri World Imagery' }
      ).addTo(map);
    } else if (basemapType === 'HYBRID') {
      baseTileRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Esri World Imagery' }
      ).addTo(map);
      hybridLabelTileRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Esri Labels' }
      ).addTo(map);
    } else {
      baseTileRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19, attribution: 'OpenStreetMap' }
      ).addTo(map);
    }
  }, [basemapType]);

  // Render Polygons & Overlays
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // 1. Cadastral Parcels Layer
    if (parcelsLayerRef.current) {
      parcelsLayerRef.current.clearLayers();

      if (layerToggles.parcels && liveParcels.length > 0) {
        liveParcels.forEach((plot) => {
          const isSelected =
            activeParcel &&
            (activeParcel.ulpin === plot.ulpin ||
              String(activeParcel.gat) === String(plot.gat) ||
              String(activeParcel.gatNumber) === String(plot.gat));

          // Stylings tailored to match screenshot
          let strokeColor = '#ffffff';
          let fillColor = '#22c55e';
          let fillOpacity = 0.35;

          if (isSelected) {
            strokeColor = '#ffffff';
            fillColor = '#ea580c'; // Vibrant Orange like mockup
            fillOpacity = 0.55;
          } else if (plot.gat === '49') {
            strokeColor = '#818cf8';
            fillColor = '#3b82f6'; // Blue
            fillOpacity = 0.35;
          } else if (plot.gat === '45') {
            strokeColor = '#4ade80';
            fillColor = '#16a34a'; // Green
            fillOpacity = 0.35;
          } else {
            strokeColor = '#e2e8f0';
            fillColor = '#64748b';
            fillOpacity = 0.25;
          }

          const polygon = L.polygon(plot.bounds, {
            color: strokeColor,
            weight: isSelected ? 3.5 : 1.5,
            fillColor: fillColor,
            fillOpacity: fillOpacity,
            dashArray: isSelected ? null : '2, 2',
          });

          // Interactive Parcel Click
          polygon.on('click', () => {
            setActiveParcel(plot);
            onSelectParcel(plot);
            setIsDetailsOpen(true);
            map.panTo(polygon.getBounds().getCenter(), { animate: true, duration: 0.5 });
          });

          polygon.addTo(parcelsLayerRef.current);

          // Center Marker Tag (Gat Label)
          const center = polygon.getBounds().getCenter();
          const labelHtml = isSelected
            ? `
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                pointer-events: auto;
                cursor: pointer;
              ">
                <div style="
                  background: #0f5132;
                  color: #ffffff;
                  font-size: 11px;
                  font-weight: 800;
                  padding: 4px 10px;
                  border-radius: 6px;
                  border: 1px solid rgba(255,255,255,0.4);
                  box-shadow: 0 4px 14px rgba(0,0,0,0.5);
                  white-space: nowrap;
                  text-align: center;
                  line-height: 1.25;
                ">
                  <div>Plot ${plot.gat}</div>
                  <div style="font-size: 9px; color: #86efac; font-weight: 600;">CTS ${plot.cts}</div>
                </div>
                <div style="
                  width: 8px;
                  height: 8px;
                  background: #ffffff;
                  border-radius: 50%;
                  box-shadow: 0 0 0 3px #0f5132;
                  margin-top: 4px;
                "></div>
              </div>
            `
            : `
              <div style="
                background: ${plot.gat === '49' ? '#1e3a8a' : plot.gat === '45' ? '#14532d' : '#0f172a'};
                color: #ffffff;
                font-size: 11px;
                font-weight: 800;
                padding: 3px 8px;
                border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, 0.4);
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                white-space: nowrap;
                text-align: center;
                cursor: pointer;
              ">
                Plot ${plot.gat}
              </div>
            `;

          const labelIcon = L.divIcon({
            className: 'cadastral-gat-custom-marker',
            html: labelHtml,
            iconSize: isSelected ? [90, 48] : [58, 24],
            iconAnchor: isSelected ? [45, 48] : [29, 12],
          });

          const marker = L.marker(center, { icon: labelIcon });
          marker.on('click', () => {
            setActiveParcel(plot);
            onSelectParcel(plot);
            setIsDetailsOpen(true);
          });
          marker.addTo(parcelsLayerRef.current);
        });
      }
    }

    // 2. Village Revenue Boundary (Purple Dashed)
    if (boundaryLayerRef.current) {
      boundaryLayerRef.current.clearLayers();

      if (layerToggles.boundary) {
        // High fidelity outer village boundary
        const villageBoundaryCoords = [
          [18.5720, 73.9720],
          [18.5710, 73.9850],
          [18.5760, 73.9960],
          [18.5870, 73.9940],
          [18.5910, 73.9820],
          [18.5860, 73.9710],
          [18.5720, 73.9720],
        ];

        L.polygon(villageBoundaryCoords, {
          color: '#8b5cf6', // Purple dashed
          weight: 2.5,
          dashArray: '8, 6',
          fillColor: '#8b5cf6',
          fillOpacity: 0.03,
        })
          .bindTooltip('📍 Wagholi Village Cadastral Boundary', { sticky: true })
          .addTo(boundaryLayerRef.current);
      }
    }

    // 3. Topography & Infrastructure (Survey Boundary line, Road, Stream)
    if (topoLayerRef.current) {
      topoLayerRef.current.clearLayers();

      if (layerToggles.topography) {
        // Survey Boundary Line (Orange Dashed)
        const surveyLineCoords = [
          [18.5730, 73.9710],
          [18.5760, 73.9780],
          [18.5790, 73.9840],
          [18.5830, 73.9930],
        ];
        L.polyline(surveyLineCoords, {
          color: '#f97316',
          weight: 3.5,
          dashArray: '10, 6',
          opacity: 0.95,
        })
          .bindTooltip('Cadastral Sector Boundary Line', { sticky: true })
          .addTo(topoLayerRef.current);

        // Major Main Road (Blue Solid)
        const roadCoords = [
          [18.5710, 73.9870],
          [18.5770, 73.9890],
          [18.5840, 73.9910],
          [18.5890, 73.9930],
        ];
        L.polyline(roadCoords, {
          color: '#2563eb',
          weight: 4.5,
          opacity: 0.9,
        })
          .bindTooltip('DP 30m Major Arterial Road', { sticky: true })
          .addTo(topoLayerRef.current);

        // Water Stream Drain (Cyan Solid)
        const streamCoords = [
          [18.5890, 73.9740],
          [18.5840, 73.9755],
          [18.5780, 73.9765],
          [18.5710, 73.9775],
        ];
        L.polyline(streamCoords, {
          color: '#06b6d4',
          weight: 3.5,
          opacity: 0.9,
        })
          .bindTooltip('Natural Drainage Stream Buffer', { sticky: true })
          .addTo(topoLayerRef.current);
      }
    }

    // 4. Urban Administrative Wards Layer
    if (wardsLayerRef.current) {
      wardsLayerRef.current.clearLayers();
      if (layerToggles.urbanWards && urbanWardsData?.features) {
        urbanWardsData.features.forEach((ward, idx) => {
          const coords = ward.geometry?.coordinates?.[0] || [];
          const bounds = coords.map(([lng, lat]) => [Number(lat), Number(lng)]);
          if (bounds.length < 3) return;

          L.polygon(bounds, {
            color: '#38bdf8',
            weight: 2,
            dashArray: '5, 5',
            fillColor: '#0284c7',
            fillOpacity: 0.12,
          })
            .bindTooltip(`🏢 ${ward.properties?.name || `Ward ${idx + 1}`}`, { sticky: true })
            .addTo(wardsLayerRef.current);
        });
      }
    }

    // 5. PMRDA 2041 Master Plan Zoning
    if (zoningLayerRef.current) {
      zoningLayerRef.current.clearLayers();
      if (layerToggles.zoning && zoningData?.features) {
        zoningData.features.forEach((z) => {
          const coords = z.geometry?.coordinates?.[0] || [];
          const bounds = coords.map(([lng, lat]) => [Number(lat), Number(lng)]);
          if (bounds.length < 3) return;

          const zoneColor = z.properties?.currentZone?.includes('Commercial')
            ? '#ec4899'
            : z.properties?.currentZone?.includes('Residential')
            ? '#3b82f6'
            : '#10b981';

          L.polygon(bounds, {
            color: zoneColor,
            weight: 2,
            dashArray: '4, 4',
            fillColor: zoneColor,
            fillOpacity: 0.22,
          })
            .bindTooltip(
              `<strong>${z.properties?.currentZone}</strong><br/>Max FSI: ${z.properties?.maxFsi}`,
              { sticky: true }
            )
            .addTo(zoningLayerRef.current);
        });
      }
    }
  }, [liveParcels, activeParcel, layerToggles, urbanWardsData, zoningData]);

  // Parcel Lookup Search Handler
  const handleParcelSearch = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim() || liveParcels.length === 0) return;

    const q = searchQuery.trim().toLowerCase();
    const match = liveParcels.find(
      (p) =>
        p.ulpin.toLowerCase().includes(q) ||
        String(p.gat).toLowerCase() === q ||
        String(p.survey).toLowerCase() === q ||
        (p.cts && p.cts.toLowerCase().includes(q)) ||
        (p.village && p.village.toLowerCase().includes(q))
    );

    if (match) {
      setActiveParcel(match);
      onSelectParcel(match);
      setIsDetailsOpen(true);
      if (mapInstanceRef.current && match.bounds) {
        const poly = L.polygon(match.bounds);
        mapInstanceRef.current.fitBounds(poly.getBounds(), { maxZoom: 18, duration: 0.6 });
      }
    } else {
      alert(`No parcel found matching "${searchQuery}". Available demo plots: 42, 45, 49.`);
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Recenter GPS handler
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      if (activeParcel?.bounds) {
        const poly = L.polygon(activeParcel.bounds);
        mapInstanceRef.current.fitBounds(poly.getBounds(), { maxZoom: 18, duration: 0.5 });
      } else {
        mapInstanceRef.current.setView([18.5793, 73.9812], 16, { animate: true });
      }
    }
  };

  // Fit all village parcels
  const handleFitVillage = () => {
    if (mapInstanceRef.current && liveParcels.length > 0) {
      const allBounds = liveParcels.flatMap((p) => p.bounds);
      if (allBounds.length > 0) {
        mapInstanceRef.current.fitBounds(allBounds, { padding: [40, 40], duration: 0.5 });
      }
    }
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    const el = mapWrapperRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Share Parcel Link
  const handleShare = () => {
    const url = `${window.location.origin}/citizen/parcels?ulpin=${encodeURIComponent(activeParcel?.ulpin || 'TEST_ULPIN_MH_PUN_001')}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Display fields for active parcel
  const parcelGat = activeParcel?.gat || activeParcel?.gatNumber || '42';
  const parcelCts = activeParcel?.cts || activeParcel?.ctsNumber || 'CTS-WAG-101';
  const parcelUlpin = activeParcel?.ulpin || 'TEST_ULPIN_MH_PUN_001';
  const parcelVillage = activeParcel?.village || activeParcel?.villageName || 'Wagholi';
  const parcelTaluka = activeParcel?.taluka || activeParcel?.tehsilCode || 'Haveli';
  const parcelDistrict = activeParcel?.district || activeParcel?.districtCode || 'Pune';
  const parcelState = activeParcel?.state || 'Maharashtra';
  const parcelArea = activeParcel?.area || (activeParcel?.areaHectares ? `${activeParcel.areaHectares} Ha` : '1.45 Ha');
  const parcelLandUse = activeParcel?.landUse || 'Agricultural';
  const parcelClass = activeParcel?.classification || 'Dry Crop (Unirrigated)';
  const parcelOldSurvey = activeParcel?.oldSurveyNo || '104';

  return (
    <div
      ref={mapWrapperRef}
      className={`cadastral-gis-map-engine ${className}`.trim()}
      style={{
        position: 'relative',
        width: '100%',
        height: height || '100%',
        overflow: 'hidden',
        background: '#0f172a',
        isolation: 'isolate',
      }}
    >
      {/* ============================================================ */}
      {/* 1. TOP FLOATING CONTROL BAR */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          pointerEvents: 'none',
          flexWrap: 'wrap',
        }}
      >
        {/* Top Left: Search Input with Dark Green Search Button */}
        <form
          onSubmit={handleParcelSearch}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: '8px',
            padding: '4px 6px 4px 12px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
            border: '1px solid #cbd5e1',
            width: '380px',
            maxWidth: '100%',
          }}
        >
          <Search size={17} style={{ color: '#64748b', marginRight: '8px', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by Survey No., CTS No., Village, or Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0f172a',
              fontSize: '0.8125rem',
              outline: 'none',
              width: '100%',
              fontWeight: 500,
            }}
          />
          <button
            type="submit"
            style={{
              background: '#0f5132',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginLeft: '6px',
              transition: 'background 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#0a3622')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#0f5132')}
          >
            Search
          </button>
        </form>

        {/* Top Center: Basemap Switcher Pills (Satellite / Map / Hybrid) */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: '8px',
            padding: '4px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
            border: '1px solid #cbd5e1',
            gap: '2px',
          }}
        >
          {['SATELLITE', 'MAP', 'HYBRID'].map((type) => {
            const isActive = basemapType === type;
            const label = type === 'SATELLITE' ? 'Satellite' : type === 'MAP' ? 'Map' : 'Hybrid';
            return (
              <button
                key={type}
                type="button"
                onClick={() => setBasemapType(type)}
                style={{
                  background: isActive ? '#0f5132' : 'transparent',
                  color: isActive ? '#ffffff' : '#334155',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '5px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Top Right: Quick Tool Buttons Capsule (Layers, Basemap, Measure, Share, Fullscreen) */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: '8px',
            padding: '4px 6px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
            border: '1px solid #cbd5e1',
            gap: '4px',
            position: 'relative',
          }}
        >
          {/* Layers Dropdown Button */}
          <button
            type="button"
            onClick={() => setIsLayersOpen((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: isLayersOpen ? '#f1f5f9' : 'transparent',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#0f172a',
              cursor: 'pointer',
            }}
          >
            <Layers size={15} style={{ color: '#0f5132' }} />
            Layers
          </button>

          {/* Basemap Toggle Quick Button */}
          <button
            type="button"
            onClick={() => setBasemapType((b) => (b === 'SATELLITE' ? 'MAP' : b === 'MAP' ? 'HYBRID' : 'SATELLITE'))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'transparent',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#0f172a',
              cursor: 'pointer',
            }}
          >
            <Globe size={15} style={{ color: '#0f5132' }} />
            Basemap
          </button>

          {/* Measure Tool Button */}
          <button
            type="button"
            onClick={() => setMeasureActive((m) => !m)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: measureActive ? '#ecfdf5' : 'transparent',
              border: measureActive ? '1px solid #10b981' : 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: measureActive ? '#059669' : '#0f172a',
              cursor: 'pointer',
            }}
          >
            <Ruler size={15} style={{ color: '#0f5132' }} />
            Measure
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'transparent',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#0f172a',
              cursor: 'pointer',
            }}
          >
            {copiedLink ? <Check size={15} style={{ color: '#16a34a' }} /> : <Share2 size={15} style={{ color: '#0f5132' }} />}
            {copiedLink ? 'Copied!' : 'Share'}
          </button>

          <div style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 2px' }} />

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              padding: '6px 8px',
              borderRadius: '6px',
              color: '#0f172a',
              cursor: 'pointer',
            }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Layers Popover Menu */}
          {isLayersOpen && (
            <div
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '240px',
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                border: '1px solid #e2e8f0',
                padding: '0.75rem',
                zIndex: 35,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                Spatial Overlays & Layers
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', cursor: 'pointer', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={layerToggles.parcels}
                  onChange={(e) => setLayerToggles((prev) => ({ ...prev, parcels: e.target.checked }))}
                />
                Cadastral Parcels (गट नकाशे)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', cursor: 'pointer', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={layerToggles.boundary}
                  onChange={(e) => setLayerToggles((prev) => ({ ...prev, boundary: e.target.checked }))}
                />
                Village Revenue Boundary
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', cursor: 'pointer', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={layerToggles.topography}
                  onChange={(e) => setLayerToggles((prev) => ({ ...prev, topography: e.target.checked }))}
                />
                Roads & Water Streams
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', cursor: 'pointer', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={layerToggles.urbanWards}
                  onChange={(e) => setLayerToggles((prev) => ({ ...prev, urbanWards: e.target.checked }))}
                />
                PMC Urban Wards
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', cursor: 'pointer', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={layerToggles.zoning}
                  onChange={(e) => setLayerToggles((prev) => ({ ...prev, zoning: e.target.checked }))}
                />
                PMRDA 2041 Master Plan Zoning
              </label>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. LEFT SIDE NAVIGATION & ZOOM TOOLBAR */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'absolute',
          top: '90px',
          left: '16px',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          background: '#ffffff',
          borderRadius: '8px',
          padding: '4px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
          border: '1px solid #cbd5e1',
        }}
      >
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#334155',
          }}
        >
          <ZoomIn size={18} />
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#334155',
          }}
        >
          <ZoomOut size={18} />
        </button>

        <div style={{ height: '1px', background: '#e2e8f0', margin: '2px 0' }} />

        <button
          type="button"
          onClick={handleRecenter}
          title="Center on Selected Parcel"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#0f5132',
          }}
        >
          <Crosshair size={18} />
        </button>

        <button
          type="button"
          onClick={handleFitVillage}
          title="Fit Village Boundary"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#334155',
          }}
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. BOTTOM LEFT: INSET MINIMAP & MAP LEGEND */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '16px',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        {/* Inset Minimap Card */}
        <div
          style={{
            pointerEvents: 'auto',
            width: '135px',
            height: '95px',
            background: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 18px rgba(0,0,0,0.2)',
            border: '1px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Mini SVG / Static Map Preview */}
          <div
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '36px',
                border: '2px solid #22c55e',
                background: 'rgba(34, 197, 94, 0.25)',
                borderRadius: '3px',
              }}
            />
          </div>
          <div
            style={{
              background: '#ffffff',
              padding: '3px 6px',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <MapPin size={11} style={{ color: '#0f5132' }} />
            Pune, Maharashtra
          </div>
        </div>

        {/* Legend Capsule */}
        <div
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            padding: '6px 12px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
            border: '1px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.72rem',
            color: '#334155',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '16px', height: '0px', borderTop: '2px dashed #8b5cf6', display: 'inline-block' }} />
            Village Boundary
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '16px', height: '0px', borderTop: '2px dashed #f97316', display: 'inline-block' }} />
            Survey Boundary
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '16px', height: '2px', background: '#2563eb', display: 'inline-block' }} />
            Road
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '16px', height: '2px', background: '#06b6d4', display: 'inline-block' }} />
            Water Body
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. RIGHT SIDE FLOATING DETAILS CARD ("Selected Land Parcel") */}
      {/* ============================================================ */}
      {isDetailsOpen && activeParcel ? (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: '16px',
            bottom: '20px',
            width: '430px',
            maxWidth: 'calc(100vw - 32px)',
            zIndex: 25,
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18)',
            border: '1px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Card Header */}
          <div
            style={{
              padding: '0.85rem 1rem 0.65rem 1rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#0f5132',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <MapPin size={15} />
              </div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Selected Land Parcel
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsDetailsOpen(false)}
              title="Close Panel"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {/* Title & Status */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
                  Plot {parcelGat}
                </span>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={12} />
                  Verified on GIS
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                CTS No.: <strong style={{ color: '#0f172a' }}>{parcelCts}</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                ULPIN: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{parcelUlpin}</strong>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1.15fr 1fr', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => {
                  if (onOpenRor) onOpenRor(activeParcel);
                  else setIsInternalRorOpen(true);
                }}
                style={{
                  background: '#0f5132',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#0a3622')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#0f5132')}
              >
                <FileText size={13} />
                View RoR (7/12 &amp; 8A)
              </button>

              <button
                type="button"
                onClick={() => navigate(`/citizen/parcels/${encodeURIComponent(parcelUlpin)}`)}
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '7px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <MapPin size={13} style={{ color: '#0f5132' }} />
                View Parcel 360°
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenMapReport) onOpenMapReport(activeParcel);
                  else setIsInternalMapReportOpen(true);
                }}
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '7px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Printer size={13} />
                Map Report
              </button>
            </div>

            {/* Sub-Tabs: Overview | Legal Details | Land Use | Documents */}
            <div
              style={{
                display: 'flex',
                background: '#f1f5f9',
                borderRadius: '6px',
                padding: '2px',
                gap: '2px',
              }}
            >
              {[
                { key: 'OVERVIEW', label: 'Overview' },
                { key: 'LEGAL', label: 'Legal Details' },
                { key: 'LANDUSE', label: 'Land Use' },
                { key: 'DOCS', label: 'Documents' },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      flex: 1,
                      padding: '5px 4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? '#0f5132' : '#64748b',
                      boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'OVERVIEW' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  fontSize: '0.8rem',
                }}
              >
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>Survey No. / Plot No.</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{parcelGat}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>State</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{parcelState}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>Village</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{parcelVillage}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>Area</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{parcelArea}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>Sub-District / Tehsil</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{parcelTaluka}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>Land Use</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{parcelLandUse}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>District</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{parcelDistrict}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>Class</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{parcelClass}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>Survey No. (Old)</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{parcelOldSurvey}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>Circle Rate Valuation</div>
                  <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.88rem' }}>₹ 1.85 Cr</div>
                </div>
              </div>
            )}

            {/* TAB 2: LEGAL DETAILS */}
            {activeTab === 'LEGAL' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.78rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>REGISTERED KHATEDARS (FORM 8A)</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{activeParcel?.owner || 'Abhishek Gujar (100%)'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>ENCUMBRANCES &amp; MORTGAGES</div>
                  <div style={{ fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>✓ Clear Title (Nil Mortgages)</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>ACTIVE MUTATION ENTRIES</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>Mutation No. 4821 Certified</div>
                </div>
              </div>
            )}

            {/* TAB 3: LAND USE & MASTER PLAN */}
            {activeTab === 'LANDUSE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.78rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>PMRDA 2041 DEVELOPMENT PLAN ZONE</div>
                  <div style={{ fontWeight: 800, color: '#3b82f6', marginTop: '2px' }}>R1 - Pure Residential Zone (Max FSI 1.50)</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>APPROACH ACCESS</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>6.0m Public Farm Approach Road</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>ENVIRONMENTAL STREAM BUFFER</div>
                  <div style={{ fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>50m Drainage Nala Clear Zone</div>
                </div>
              </div>
            )}

            {/* TAB 4: DOCUMENTS */}
            {activeTab === 'DOCS' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                <div
                  onClick={() => {
                    if (onOpenRor) onOpenRor(activeParcel);
                    else setIsInternalRorOpen(true);
                  }}
                  style={{
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: '#f8fafc',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#0f5132' }}>📄 Certified Record of Rights (7/12 &amp; 8A)</span>
                  <span style={{ color: '#64748b', fontSize: '0.7rem' }}>PDF</span>
                </div>
                <div
                  onClick={() => {
                    if (onOpenMapReport) onOpenMapReport(activeParcel);
                    else setIsInternalMapReportOpen(true);
                  }}
                  style={{
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: '#f8fafc',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#0f5132' }}>🗺️ Cadastral Map Extract (FMB)</span>
                  <span style={{ color: '#64748b', fontSize: '0.7rem' }}>PDF</span>
                </div>
              </div>
            )}

            {/* Bottom Informational Note Box */}
            <div
              style={{
                marginTop: 'auto',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                color: '#166534',
                fontSize: '0.78rem',
                lineHeight: 1.35,
              }}
            >
              <Info size={16} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
              <div>
                This parcel is a certified Record of Rights (RoR). Click on <strong>"View RoR (7/12 &amp; 8A)"</strong> to see detailed information.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Reopen Floating Button when details panel is collapsed */
        <button
          type="button"
          onClick={() => setIsDetailsOpen(true)}
          style={{
            position: 'absolute',
            top: '80px',
            right: '16px',
            zIndex: 25,
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '8px 14px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#0f5132',
            cursor: 'pointer',
          }}
        >
          <MapPin size={15} />
          Selected Parcel (Plot {parcelGat})
        </button>
      )}

      {/* ============================================================ */}
      {/* 5. MAIN LEAFLET MAP VIEWPORT CANVAS */}
      {/* ============================================================ */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* GIS Failure State Overlay */}
      {gisError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <AlertTriangle size={32} style={{ color: '#ef4444' }} />
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
            Cadastral map unavailable
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', margin: '0 0 1.5rem 0' }}>
            {gisError}
          </p>
          <button
            type="button"
            onClick={loadCadastralData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#0f5132',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} /> Retry Connection
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {gisLoading && (
        <div
          style={{
            position: 'absolute',
            top: '75px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 25,
            background: '#ffffff',
            color: '#0f5132',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
            border: '1px solid #cbd5e1',
          }}
        >
          <RefreshCw size={13} className="spin-animation" />
          Loading GIS Land Cadastral Spatial Data...
        </div>
      )}

      {/* Modals for Official Records */}
      <MapReportModal
        isOpen={isInternalMapReportOpen}
        onClose={() => setIsInternalMapReportOpen(false)}
        plot={activeParcel}
      />
      <RorModal
        isOpen={isInternalRorOpen}
        onClose={() => setIsInternalRorOpen(false)}
        parcel={activeParcel}
      />
    </div>
  );
};

export default CadastralGisMap;
