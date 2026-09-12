/**
 * GIS_mapping/services/polygonGenerator.js
 *
 * Deterministic synthetic cadastral polygon generator.
 * Converts a center coordinate + area (ha) into a realistic GeoJSON polygon.
 * Uses a seeded PRNG so output is stable across page refreshes.
 *
 * Output format: array of [lat, lng] pairs (closed ring).
 */

// ─── Seeded PRNG (Mulberry32) ─────────────────────────────────────────────────
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a roughly-rectangular cadastral polygon with slight organic distortion.
 *
 * @param {number} centerLat  - Center latitude (WGS-84)
 * @param {number} centerLng  - Center longitude (WGS-84)
 * @param {number} areaHa     - Parcel area in hectares
 * @param {number} seed       - Integer seed for deterministic output
 * @param {number} [sides=4]  - Number of polygon vertices (4–7)
 * @returns {Array<[number,number]>} - Closed ring of [lat, lng] pairs
 */
export function generateParcelPolygon(centerLat, centerLng, areaHa, seed = 0, sides = 4) {
  const rand = mulberry32(seed + 42);

  // ── Convert area (ha) to approximate radius in degrees ──────────────────────
  // 1 degree lat ≈ 111,000 m; 1 ha = 10,000 m²
  // For a circle: area = π r² → r = sqrt(area / π)
  const areaM2 = areaHa * 10000;
  const radiusM = Math.sqrt(areaM2 / Math.PI);
  const radiusLat = radiusM / 111000;
  const radiusLng = radiusM / (111000 * Math.cos((centerLat * Math.PI) / 180));

  // ── Generate vertices ────────────────────────────────────────────────────────
  const actualSides = Math.max(4, Math.min(sides, 7));
  const angleStep = (2 * Math.PI) / actualSides;
  // Slight rotation offset for realism
  const rotationOffset = (rand() - 0.5) * 0.5;

  const ring = [];
  for (let i = 0; i < actualSides; i++) {
    const angle = i * angleStep + rotationOffset;
    // Add ±15% organic noise to each vertex
    const noiseFactor = 0.85 + rand() * 0.30;
    const lat = centerLat + Math.sin(angle) * radiusLat * noiseFactor;
    const lng = centerLng + Math.cos(angle) * radiusLng * noiseFactor;
    ring.push([lat, lng]);
  }

  // Close the ring
  ring.push(ring[0]);
  return ring;
}

/**
 * Convenience wrapper for neighbor parcels — slightly smaller than focal parcel.
 */
export function generateNeighborPolygon(centerLat, centerLng, areaHa, seed) {
  // Randomly pick 4 or 5 sides for variety
  const rand = mulberry32(seed + 7);
  const sides = rand() > 0.6 ? 5 : 4;
  return generateParcelPolygon(centerLat, centerLng, areaHa, seed, sides);
}

/**
 * Compute the centroid of a ring of [lat, lng] pairs.
 */
export function computeCentroid(ring) {
  // Exclude the closing duplicate point
  const pts = ring.slice(0, -1);
  const lat = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const lng = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return { lat, lng };
}

export default generateParcelPolygon;
