/**
 * GIS_mapping/components/CitizenMappingMap.jsx
 *
 * Citizen-focused Cadastral GIS Map built on Leaflet per SIH_26014 Version 2.
 * Design principle: Authentic village cadastral land record GIS (Bhu-Naksha style),
 * clean, spacious, and uncluttered.
 *
 * Primary Mode: 'Cadastral Map' (default)
 * Secondary Mode: 'Satellite Reference'
 *
 * Controls:
 * - Top-left: Mode Dropdown ('Cadastral Map' | 'Satellite Reference')
 * - Right toolbar: Zoom in (+), Zoom out (-), Locate / Recenter (⌖), Fullscreen (⛶)
 * - Bottom-left: Scale bar (0 - 50 - 100m) & Centroid coordinates (18.5793° N, 73.9812° E)
 * - Bottom-right: Administrative badge: Village: Wagholi | Tehsil: Haveli | District: Pune
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  Maximize2,
  ChevronDown,
  AlertCircle,
  FileText,
  Printer,
  Info,
} from 'lucide-react';
import { VIEW_MODES, mapProvider } from '../services/mapProviderAdapter.js';
import {
  cadastralFeatureCollection,
  wagholiLakeFeature,
  wagholiRoadFeature,
  settlementFeatures,
  WAGHOLI_CENTER,
} from '../data/cadastralParcels.js';

const CitizenMappingMap = ({
  selectedParcel,
  onSelectParcel,
  onOpenRor = null,
  onOpenMapReport = null,
  onOpenDetailPopup = null,
  height = '540px',
}) => {
  const [viewMode, setViewMode] = useState(VIEW_MODES.CADASTRAL);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState({
    lat: 18.5793,
    lng: 73.9812,
  });

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const cadastralLayerGroupRef = useRef(null);
  const referenceLayerGroupRef = useRef(null);

  // ─── Initialize Leaflet Map ─────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [WAGHOLI_CENTER.lat, WAGHOLI_CENTER.lng],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 20,
      minZoom: 14,
    });

    // Tile layer setup
    const tileConf = mapProvider.getTileConfig(VIEW_MODES.CADASTRAL);
    const tile = L.tileLayer(tileConf.url, {
      maxZoom: tileConf.maxZoom,
      subdomains: tileConf.subdomains || 'abc',
    }).addTo(map);

    tileLayerRef.current = tile;
    referenceLayerGroupRef.current = L.layerGroup().addTo(map);
    cadastralLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Track coordinates on move
    map.on('moveend', () => {
      const c = map.getCenter();
      setCurrentCoordinates({
        lat: parseFloat(c.lat.toFixed(4)),
        lng: parseFloat(c.lng.toFixed(4)),
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ─── Switch Base Tiles (Cadastral vs Satellite Reference) ───────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const map = mapInstanceRef.current;
    map.removeLayer(tileLayerRef.current);

    const tileConf = mapProvider.getTileConfig(viewMode);
    const newTile = L.tileLayer(tileConf.url, {
      maxZoom: tileConf.maxZoom,
      subdomains: tileConf.subdomains || 'abc',
    }).addTo(map);

    // Keep tiles below vector layers
    newTile.bringToBack();
    tileLayerRef.current = newTile;
  }, [viewMode]);

  // ─── Render Reference Geography & Cadastral Parcels ─────────────────────────
  const renderLayers = useCallback(() => {
    if (
      !mapInstanceRef.current ||
      !cadastralLayerGroupRef.current ||
      !referenceLayerGroupRef.current
    )
      return;

    const refGroup = referenceLayerGroupRef.current;
    const cadGroup = cadastralLayerGroupRef.current;

    refGroup.clearLayers();
    cadGroup.clearLayers();

    const isCadastralMode = viewMode === VIEW_MODES.CADASTRAL;

    // 1. Render Wagholi Lake
    const lakeCoords = wagholiLakeFeature.geometry.coordinates[0].map(
      ([lng, lat]) => [lat, lng]
    );
    const lake = L.polygon(lakeCoords, {
      color: '#90cdf4',
      weight: 1.5,
      fillColor: isCadastralMode ? '#bfe2f7' : '#3182ce',
      fillOpacity: isCadastralMode ? 0.75 : 0.45,
    });
    refGroup.addLayer(lake);

    // Lake label
    const lakeLabel = L.marker([18.5796, 73.9742], {
      icon: L.divIcon({
        className: 'cadastral-lake-label',
        html: `<div style="color: #2b6cb0; font-size: 11px; font-weight: 700; text-align: center; text-shadow: 0 1px 2px rgba(255,255,255,0.9); pointer-events: none;">Wagholi Lake</div>`,
        iconSize: [90, 20],
        iconAnchor: [45, 10],
      }),
    });
    refGroup.addLayer(lakeLabel);

    // 2. Render Wagholi Road (Double line casing)
    const roadCoords = wagholiRoadFeature.geometry.coordinates.map(
      ([lng, lat]) => [lat, lng]
    );
    // Outer casing
    const roadCasing = L.polyline(roadCoords, {
      color: isCadastralMode ? '#94a3b8' : '#e2e8f0',
      weight: 9,
      opacity: 0.9,
      lineCap: 'round',
    });
    // Inner fill
    const roadInner = L.polyline(roadCoords, {
      color: isCadastralMode ? '#ffffff' : '#475569',
      weight: 5,
      opacity: 1,
      lineCap: 'round',
    });
    refGroup.addLayer(roadCasing);
    refGroup.addLayer(roadInner);

    // Road label
    const roadLabel = L.marker([18.5806, 73.9805], {
      icon: L.divIcon({
        className: 'cadastral-road-label',
        html: `<div style="background: rgba(255,255,255,0.92); border: 1px solid #cbd5e1; border-radius: 4px; padding: 1px 6px; font-size: 9px; font-weight: 700; color: #334155; white-space: nowrap; transform: rotate(4deg); box-shadow: 0 1px 3px rgba(0,0,0,0.1); pointer-events: none;">Wagholi Road</div>`,
        iconSize: [80, 16],
        iconAnchor: [40, 8],
      }),
    });
    refGroup.addLayer(roadLabel);

    // 3. Render Settlement Footprints (Houses)
    settlementFeatures.forEach((feat) => {
      const bCoords = feat.geometry.coordinates[0].map(([lng, lat]) => [
        lat,
        lng,
      ]);
      const building = L.polygon(bCoords, {
        color: isCadastralMode ? '#64748b' : '#f8fafc',
        weight: 1,
        fillColor: isCadastralMode ? '#94a3b8' : '#cbd5e1',
        fillOpacity: 0.55,
      });
      refGroup.addLayer(building);
    });

    // 4. Render Cadastral Parcels
    const currentSelectedULPIN =
      selectedParcel?.properties?.ulpin ||
      selectedParcel?.ulpin ||
      'ULPIN-MH-PUN-000001';

    cadastralFeatureCollection.features.forEach((feature) => {
      const props = feature.properties;
      const isSelected = props.ulpin === currentSelectedULPIN;
      const coords = feature.geometry.coordinates[0].map(([lng, lat]) => [
        lat,
        lng,
      ]);

      // Styling
      let strokeColor = isCadastralMode ? '#64748b' : '#ffffff';
      let strokeWidth = 1.4;
      let fillColor = isCadastralMode ? '#fdfcf7' : '#ffffff';
      let fillOpacity = isCadastralMode ? 0.35 : 0.08;

      if (isSelected) {
        strokeColor = '#10b981'; // Vibrant Cadastral Green
        strokeWidth = 3.2;
        fillColor = '#10b981';
        fillOpacity = isCadastralMode ? 0.28 : 0.38;
      }

      const polygon = L.polygon(coords, {
        color: strokeColor,
        weight: strokeWidth,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
      });

      // Hover and Click interactions
      polygon.on('click', () => {
        if (onSelectParcel) onSelectParcel(feature);
        if (onOpenDetailPopup) onOpenDetailPopup(feature);
      });

      // Build interactive Leaflet HTML popup element
      const popupContainer = document.createElement('div');
      popupContainer.className = 'cadastral-popup-inner';
      popupContainer.style.fontFamily =
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      popupContainer.style.minWidth = '260px';

      popupContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, #064e3b 0%, #0f766e 100%); color: #ffffff; padding: 10px 14px; position: relative;">
          <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #a7f3d0; margin-bottom: 2px;">
            महाराष्ट्र शासन • भूखंड तपशील
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px;">
            <div style="font-size: 15px; font-weight: 800; color: #ffffff;">
              गट क्र. ${props.gat_number}
              <span style="font-size: 11.5px; font-weight: 600; color: #ccfbf1; margin-left: 4px;">
                (सर्व्हे ${props.survey_number})
              </span>
            </div>
            <span style="background: #10b981; color: #ffffff; font-size: 9.5px; font-weight: 800; padding: 2px 7px; border-radius: 9999px;">
              ${props.status || 'CLEAR'}
            </span>
          </div>
        </div>

        <div style="padding: 12px 14px; background: #ffffff; font-size: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
            <div>
              <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">खातेदार / Owner</div>
              <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${props.owner_name || 'Aarav Patil'}
              </div>
              <div style="font-size: 10px; color: #64748b;">
                ${props.owner_local || 'आरव पाटील'}
              </div>
            </div>
            <div>
              <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">क्षेत्र / Area</div>
              <div style="font-size: 12px; font-weight: 800; color: #0f766e; margin-top: 1px;">
                ${props.area} Ha
              </div>
              <div style="font-size: 10px; color: #64748b;">
                ${props.area_local || '58 Guntha'}
              </div>
            </div>
            <div>
              <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">भूवापर / Land Use</div>
              <div style="font-size: 11.5px; font-weight: 600; color: #334155; margin-top: 1px;">
                ${props.land_use || 'Agricultural'}
              </div>
            </div>
            <div>
              <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">गाव / Village</div>
              <div style="font-size: 11.5px; font-weight: 600; color: #334155; margin-top: 1px;">
                Wagholi, Haveli
              </div>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 10.5px;">
            <span style="color: #64748b; font-weight: 700;">ULPIN:</span>
            <span style="font-family: monospace; font-weight: 700; color: #0f766e; font-size: 10.5px;">${props.ulpin}</span>
          </div>

          <div style="display: flex; gap: 6px;">
            <button class="cadastral-popup-btn-detail" style="flex: 1.3; padding: 6px 8px; background: #064e3b; color: #ffffff; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 1px 3px rgba(6,78,59,0.25);">
              <span>📋 तपशील (Details)</span>
            </button>
            <button class="cadastral-popup-btn-ror" style="flex: 0.85; padding: 6px 8px; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
              ७/१२
            </button>
            <button class="cadastral-popup-btn-map" style="flex: 0.85; padding: 6px 8px; background: #f8fafc; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
              नकाशा
            </button>
          </div>
        </div>
      `;

      const btnDetail = popupContainer.querySelector('.cadastral-popup-btn-detail');
      if (btnDetail) {
        btnDetail.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onSelectParcel) onSelectParcel(feature);
          if (onOpenDetailPopup) onOpenDetailPopup(feature);
        });
      }
      const btnRor = popupContainer.querySelector('.cadastral-popup-btn-ror');
      if (btnRor) {
        btnRor.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onOpenRor) onOpenRor(feature);
        });
      }
      const btnMap = popupContainer.querySelector('.cadastral-popup-btn-map');
      if (btnMap) {
        btnMap.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onOpenMapReport) onOpenMapReport(feature);
        });
      }

      polygon.bindPopup(popupContainer, {
        maxWidth: 290,
        minWidth: 260,
        className: 'cadastral-leaflet-popup',
        offset: [0, -6],
      });

      polygon.on('mouseover', () => {
        if (!isSelected) {
          polygon.setStyle({
            weight: 2.2,
            color: '#059669',
            fillOpacity: 0.22,
          });
        }
      });

      polygon.on('mouseout', () => {
        if (!isSelected) {
          polygon.setStyle({
            weight: strokeWidth,
            color: strokeColor,
            fillOpacity: fillOpacity,
          });
        }
      });

      cadGroup.addLayer(polygon);

      // Centered Label (Survey No. & Gat No. badge for selected)
      const center = props.centroid || coords[0];

      if (isSelected) {
        // Selected parcel label with badge
        const selectedLabel = L.marker(center, {
          icon: L.divIcon({
            className: 'cadastral-selected-label',
            html: `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
                <span style="font-size: 13px; font-weight: 800; color: #0f172a; text-shadow: 0 0 4px #ffffff, 0 0 2px #ffffff;">
                  ${props.survey_number}
                </span>
                <span style="background: #0f172a; color: #ffffff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0,0,0,0.25); white-space: nowrap; margin-top: 2px;">
                  Gat ${props.gat_number}
                </span>
              </div>
            `,
            iconSize: [60, 36],
            iconAnchor: [30, 18],
          }),
        });
        cadGroup.addLayer(selectedLabel);
      } else {
        // Subtle survey number label
        const surveyLabel = L.marker(center, {
          icon: L.divIcon({
            className: 'cadastral-survey-label',
            html: `
              <div style="font-size: 11px; font-weight: 700; color: ${
                isCadastralMode ? '#475569' : '#ffffff'
              }; text-shadow: 0 0 3px rgba(255,255,255,0.9); text-align: center; pointer-events: none;">
                ${props.survey_number}
              </div>
            `,
            iconSize: [30, 16],
            iconAnchor: [15, 8],
          }),
        });
        cadGroup.addLayer(surveyLabel);
      }
    });
  }, [selectedParcel, viewMode, onSelectParcel, onOpenDetailPopup, onOpenRor, onOpenMapReport]);

  useEffect(() => {
    renderLayers();
  }, [renderLayers]);

  // ─── Recenter to selected parcel ────────────────────────────────────────────
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const center =
      selectedParcel?.properties?.centroid ||
      selectedParcel?.centroid || [WAGHOLI_CENTER.lat, WAGHOLI_CENTER.lng];
    mapInstanceRef.current.flyTo(center, 17, { duration: 0.8 });
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!isFullscreen) {
      if (mapContainerRef.current.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={mapContainerRef}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0',
        backgroundColor: '#f8f6f0',
      }}
      className="citizen-cadastral-map-wrapper"
    >
      {/* ─── Top-Left: Mode Switcher Dropdown ────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          zIndex: 1000,
        }}
      >
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#1e293b',
              cursor: 'pointer',
              outline: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>
              {viewMode === VIEW_MODES.CADASTRAL
                ? 'Cadastral Map'
                : 'Satellite Reference'}
            </span>
            <ChevronDown size={14} color="#64748b" />
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                width: '180px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                zIndex: 1001,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setViewMode(VIEW_MODES.CADASTRAL);
                  setIsDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor:
                    viewMode === VIEW_MODES.CADASTRAL
                      ? '#f1f5f9'
                      : 'transparent',
                  color:
                    viewMode === VIEW_MODES.CADASTRAL ? '#0f766e' : '#334155',
                  fontWeight: viewMode === VIEW_MODES.CADASTRAL ? 700 : 500,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Cadastral Map</span>
                {viewMode === VIEW_MODES.CADASTRAL && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#0f766e',
                    }}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode(VIEW_MODES.SATELLITE);
                  setIsDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  textAlign: 'left',
                  border: 'none',
                  borderTop: '1px solid #f1f5f9',
                  backgroundColor:
                    viewMode === VIEW_MODES.SATELLITE
                      ? '#f1f5f9'
                      : 'transparent',
                  color:
                    viewMode === VIEW_MODES.SATELLITE ? '#0f766e' : '#334155',
                  fontWeight: viewMode === VIEW_MODES.SATELLITE ? 700 : 500,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Satellite Reference</span>
                {viewMode === VIEW_MODES.SATELLITE && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#0f766e',
                    }}
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Top-Center: Context Banner (when in Satellite Reference mode) ─── */}
      {viewMode === VIEW_MODES.SATELLITE && (
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <AlertCircle size={13} color="#facc15" />
          <span>Reference Only — Not Official Legal Cadastre</span>
        </div>
      )}

      {/* ─── Right: Vertical Tool Controls ──────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          style={{
            width: '34px',
            height: '34px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e293b',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <ZoomIn size={16} />
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          style={{
            width: '34px',
            height: '34px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e293b',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <ZoomOut size={16} />
        </button>

        <button
          type="button"
          onClick={handleRecenter}
          title="Locate / Center Selected Land"
          style={{
            width: '34px',
            height: '34px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f766e',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <Crosshair size={16} />
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          style={{
            width: '34px',
            height: '34px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e293b',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <Maximize2 size={15} />
        </button>
      </div>

      {/* ─── Bottom-Left: Scale Bar & Coordinate Tag ─────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(4px)',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '4px 8px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '9px',
            color: '#475569',
            fontWeight: 700,
          }}
        >
          <span>0</span>
          <div
            style={{
              width: '40px',
              height: '3px',
              backgroundColor: '#475569',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '-3px',
                width: '1px',
                height: '7px',
                backgroundColor: '#475569',
              }}
            />
          </div>
          <span>50</span>
          <div
            style={{
              width: '40px',
              height: '3px',
              backgroundColor: '#475569',
            }}
          />
          <span>100 m</span>
        </div>
        <div
          style={{
            fontSize: '9.5px',
            fontFamily: 'monospace',
            color: '#334155',
            fontWeight: 600,
          }}
        >
          {currentCoordinates.lat.toFixed(4)}° N,{' '}
          {currentCoordinates.lng.toFixed(4)}° E
        </div>
      </div>

      {/* ─── Bottom-Right: Administrative Hierarchy Badge ───────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '14px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(4px)',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '4px 10px',
          fontSize: '10px',
          fontWeight: 600,
          color: '#334155',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>
          Village: <strong>Wagholi</strong>
        </span>
        <span style={{ color: '#94a3b8' }}>|</span>
        <span>
          Tehsil: <strong>Haveli</strong>
        </span>
        <span style={{ color: '#94a3b8' }}>|</span>
        <span>
          District: <strong>Pune</strong>
        </span>
      </div>

      {/* ─── Bottom-Center: Action Buttons (RoR / FMB / Details) ─────────── */}
      {selectedParcel && (onOpenRor || onOpenMapReport || onOpenDetailPopup) && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            gap: '6px',
          }}
        >
          {onOpenDetailPopup && (
            <button
              type="button"
              onClick={() => onOpenDetailPopup(selectedParcel)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                background: '#064e3b',
                border: '1px solid #064e3b',
                borderRadius: '7px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(6,78,59,0.3)',
                transition: 'background 0.15s',
              }}
              title="भूखंड तपशील पॉप-अप (View Land Details Pop-up)"
            >
              <Info size={13} />
              <span>भूखंड तपशील</span>
            </button>
          )}
          {onOpenMapReport && (
            <button
              type="button"
              onClick={() => onOpenMapReport(selectedParcel)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(4px)',
                border: '1px solid #cbd5e1',
                borderRadius: '7px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1e293b',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'background 0.15s',
              }}
              title="गाव नमुना नकाशा प्रत (FMB Map Report)"
            >
              <Printer size={13} />
              <span>नकाशा प्रत (FMB)</span>
            </button>
          )}
          {onOpenRor && (
            <button
              type="button"
              onClick={() => onOpenRor(selectedParcel)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                background: '#0f766e',
                border: '1px solid #0d6460',
                borderRadius: '7px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(15,118,110,0.35)',
                transition: 'background 0.15s',
              }}
              title="गाव नमुना ७/१२ (Record of Rights)"
            >
              <FileText size={13} />
              <span>७/१२ (RoR)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CitizenMappingMap;
