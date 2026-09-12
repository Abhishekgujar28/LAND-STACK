/**
 * GIS_mapping/components/DownloadParcelMap.js
 *
 * Canvas-based parcel map export utility.
 * Generates a clean printable PNG with government branding, parcel details,
 * north arrow, scale bar, legend and a "PROTOTYPE / DEMONSTRATION DATA" watermark.
 *
 * Usage: downloadParcelMap(parcel)
 */

/**
 * Draw a north arrow at given canvas position.
 */
function drawNorthArrow(ctx, x, y, size = 32) {
  ctx.save();
  ctx.translate(x, y);

  // Arrow body
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.3, size * 0.4);
  ctx.lineTo(0, size * 0.2);
  ctx.lineTo(-size * 0.3, size * 0.4);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, -size, 0, size * 0.4);
  grad.addColorStop(0, '#1B4D3E');
  grad.addColorStop(1, '#ffffff');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#1B4D3E';
  ctx.lineWidth = 1;
  ctx.stroke();

  // "N" label
  ctx.fillStyle = '#1B4D3E';
  ctx.font = `bold ${size * 0.45}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('N', 0, -size - 10);

  ctx.restore();
}

/**
 * Draw a simple scale bar.
 */
function drawScaleBar(ctx, x, y, widthPx = 120, label = '0      50     100 m') {
  ctx.save();
  ctx.translate(x, y);

  // Outer bar
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, 8);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, widthPx, 8);

  // Alternating ticks
  const sections = 4;
  for (let i = 0; i < sections; i++) {
    const w = widthPx / sections;
    ctx.fillStyle = i % 2 === 0 ? '#1B4D3E' : '#ffffff';
    ctx.fillRect(i * w, 0, w, 8);
  }

  ctx.fillStyle = '#334155';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(label, widthPx / 2, 12);

  ctx.restore();
}

/**
 * Draw a polygon on canvas from an array of [lat, lng] coordinates.
 * Requires a coordinate-to-pixel transform function.
 */
function drawPolygon(ctx, coords, toPixel, fillColor, strokeColor, lineWidth = 2) {
  if (!coords || coords.length < 3) return;
  ctx.beginPath();
  coords.forEach(([lng, lat], i) => {
    const [px, py] = toPixel(lat, lng);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

/**
 * Main export function.
 * @param {Object} parcel - Parcel feature (GeoJSON Feature with properties)
 */
export function downloadParcelMap(parcel) {
  if (!parcel) return;

  const props = parcel.properties || parcel || {};
  const ulpin = props.ulpin || props.ulpin || 'ULPIN-MH-PUN-000001';
  const surveyNo = props.survey_number || props.surveyNumber || '104';
  const gatNo = props.gat_number || props.gatNumber || '42';
  const village = props.village_name || props.village || 'Wagholi';
  const area = props.area ? `${props.area} Hectare` : '1.45 Hectare';

  const W = 800;
  const H = 600;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ── Background ───────────────────────────────────────────────────────────────
  ctx.fillStyle = '#f7faf8';
  ctx.fillRect(0, 0, W, H);

  // ── Government Header Bar ─────────────────────────────────────────────────
  const headerGrad = ctx.createLinearGradient(0, 0, W, 0);
  headerGrad.addColorStop(0, '#064e3b');
  headerGrad.addColorStop(1, '#065f46');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, W, 70);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('भूमि संसाधन विभाग — Department of Land Resources', 20, 24);
  ctx.font = '12px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('BharatBhumi — National Land Portal | Government of India', 20, 44);
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('PROTOTYPE / DEMONSTRATION DATA', 20, 62);

  // Right side: date
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }), W - 20, 44);

  // ── Title Section ─────────────────────────────────────────────────────────
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Cadastral Parcel Map', 24, 102);

  ctx.fillStyle = '#475569';
  ctx.font = '12px Inter, sans-serif';
  ctx.fillText(`${village}, Haveli, Pune, Maharashtra`, 24, 120);

  // ── Parcel Detail Box ─────────────────────────────────────────────────────
  const boxX = W - 240;
  const boxY = 80;
  const boxW = 220;
  const boxH = 155;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 6);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#064e3b';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PARCEL DETAILS', boxX + 12, boxY + 16);

  const details = [
    ['ULPIN', ulpin],
    ['Survey No.', surveyNo],
    ['Gat No.', gatNo],
    ['Village', village],
    ['Area', area],
    ['Status', props.status || 'CLEAR'],
  ];
  ctx.font = '10px Inter, sans-serif';
  details.forEach(([k, v], i) => {
    const y = boxY + 30 + i * 20;
    ctx.fillStyle = '#64748b';
    ctx.fillText(k, boxX + 12, y);
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText(String(v), boxX + boxW - 12, y);
    ctx.textAlign = 'left';
    // Divider
    if (i < details.length - 1) {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(boxX + 8, y + 7);
      ctx.lineTo(boxX + boxW - 8, y + 7);
      ctx.stroke();
    }
  });

  // ── Map area ──────────────────────────────────────────────────────────────
  const mapX = 20;
  const mapY = 135;
  const mapW = W - 260;
  const mapH = H - 200;

  ctx.fillStyle = '#e0f2fe'; // Light blue "map" background
  ctx.beginPath();
  ctx.roundRect(mapX, mapY, mapW, mapH, 4);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ── Draw synthetic parcel grid ────────────────────────────────────────────
  // Use the geometry if available, else draw a placeholder rectangle
  const coords = parcel?.geometry?.coordinates?.[0];

  if (coords && coords.length >= 3) {
    // Find bounding box
    const lats = coords.map(([lng, lat]) => lat);
    const lngs = coords.map(([lng, lat]) => lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const pad = 0.0025;
    const latRange = maxLat - minLat + pad * 2;
    const lngRange = maxLng - minLng + pad * 2;

    const toPixel = (lat, lng) => [
      mapX + ((lng - minLng + pad) / lngRange) * mapW,
      mapY + mapH - ((lat - minLat + pad) / latRange) * mapH,
    ];

    // Draw parcel
    drawPolygon(ctx, coords, toPixel, 'rgba(22, 163, 74, 0.3)', '#15803d', 2.5);

    // Centroid label
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const [cx, cy] = toPixel(avgLat, avgLng);
    ctx.fillStyle = '#14532d';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Gat ${gatNo}`, cx, cy - 6);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#166534';
    ctx.fillText(`Survey ${surveyNo}`, cx, cy + 10);
  } else {
    // Fallback: simple placeholder
    const px = mapX + mapW * 0.3;
    const py = mapY + mapH * 0.25;
    const pw = mapW * 0.4;
    const ph = mapH * 0.5;
    ctx.fillStyle = 'rgba(22, 163, 74, 0.25)';
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#14532d';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Gat ${gatNo} — Survey ${surveyNo}`, mapX + mapW / 2, mapY + mapH / 2);
  }

  // ── North Arrow ───────────────────────────────────────────────────────────
  drawNorthArrow(ctx, mapX + mapW - 36, mapY + 50, 24);

  // ── Scale Bar ─────────────────────────────────────────────────────────────
  drawScaleBar(ctx, mapX + 12, mapY + mapH - 30, 120);

  // ── Legend ────────────────────────────────────────────────────────────────
  const legX = W - 240;
  const legY = 248;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(legX, legY, 220, 90, 6);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#064e3b';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('LEGEND', legX + 12, legY + 14);

  const legendItems = [
    { color: 'rgba(22,163,74,0.35)', border: '#15803d', label: 'Selected Parcel (CLEAR)' },
    { color: 'rgba(255,255,255,0)', border: '#64748b', label: 'Other Parcels' },
    { color: 'rgba(245,158,11,0.35)', border: '#d97706', label: 'Pending Mutation' },
  ];
  legendItems.forEach(({ color, border, label }, i) => {
    const ly = legY + 28 + i * 20;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(legX + 12, ly - 7, 14, 10, 2);
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#334155';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(label, legX + 32, ly);
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, H - 55, W, 55);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, H - 55);
  ctx.lineTo(W, H - 55);
  ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Source: Bharat Maps (NIC) + Cadastral Prototype Synthetic Data', 20, H - 36);
  ctx.fillStyle = '#e65100';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.fillText('⚠ PROTOTYPE / DEMONSTRATION DATA — Not an official government cadastral record.', 20, H - 20);

  ctx.fillStyle = '#64748b';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`CRS: EPSG:4326 / WGS 84  |  Generated: ${new Date().toLocaleString('en-IN')}`, W - 20, H - 20);

  // ── Trigger download ──────────────────────────────────────────────────────
  const link = document.createElement('a');
  link.download = `parcel-map-${ulpin}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export default downloadParcelMap;
