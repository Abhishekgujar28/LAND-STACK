/**
 * GIS_mapping/services/parcelResolver.js
 *
 * Canonical ULPIN resolver for the citizen search experience.
 * Accepts free-text input and resolves to the matching parcel feature.
 *
 * Resolution priority:
 *  1. ULPIN exact match
 *  2. Survey number match  (e.g. "104", "Survey 104", "Survey No. 104")
 *  3. Gat number match     (e.g. "42", "Gat 42", "Gat No. 42")
 *  4. Village name match   (returns all parcels in that village)
 *  5. Generic keyword match on any string property
 */

import { getAllParcels, getParcelByULPIN, getParcelBySurvey, getParcelByGat } from '../data/cadastralParcels.js';

// ─── Normalize query helpers ──────────────────────────────────────────────────
function extractNumber(str) {
  const m = str.match(/\d+/);
  return m ? m[0] : null;
}

function normalizeQuery(raw) {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ');
}

// ─── Result cache (simple memoization) ───────────────────────────────────────
const _cache = new Map();

/**
 * Resolve a citizen search query to matching parcel features.
 *
 * @param {string} query - Raw search input
 * @returns {{ parcels: Feature[], mode: string, query: string }}
 */
export function resolveParcelSearch(query) {
  if (!query || !query.trim()) {
    return { parcels: [], mode: 'EMPTY', query };
  }

  const cacheKey = query.trim().toLowerCase();
  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  const q = normalizeQuery(query);

  // ── 1. ULPIN exact match ──────────────────────────────────────────────────
  if (/^ulpin-/i.test(q)) {
    const match = getParcelByULPIN(query.trim().toUpperCase());
    if (match) {
      const result = { parcels: [match], mode: 'ULPIN', query };
      _cache.set(cacheKey, result);
      return result;
    }
  }

  // ── 2. Survey number match ────────────────────────────────────────────────
  if (/survey/i.test(q)) {
    const num = extractNumber(q);
    if (num) {
      const match = getParcelBySurvey(num);
      if (match) {
        const result = { parcels: [match], mode: 'SURVEY', query };
        _cache.set(cacheKey, result);
        return result;
      }
    }
  }

  // ── 3. Gat number match ───────────────────────────────────────────────────
  if (/gat/i.test(q)) {
    const num = extractNumber(q);
    if (num) {
      const match = getParcelByGat(num);
      if (match) {
        const result = { parcels: [match], mode: 'GAT', query };
        _cache.set(cacheKey, result);
        return result;
      }
    }
  }

  // ── 4. Pure numeric — try survey then gat ─────────────────────────────────
  if (/^\d+$/.test(q)) {
    const bySurvey = getParcelBySurvey(q);
    if (bySurvey) {
      const result = { parcels: [bySurvey], mode: 'SURVEY', query };
      _cache.set(cacheKey, result);
      return result;
    }
    const byGat = getParcelByGat(q);
    if (byGat) {
      const result = { parcels: [byGat], mode: 'GAT', query };
      _cache.set(cacheKey, result);
      return result;
    }
  }

  // ── 5. Village / location match ───────────────────────────────────────────
  const all = getAllParcels();
  const villageMatches = all.filter((f) =>
    f.properties.village_name.toLowerCase().includes(q) ||
    f.properties.tehsil.toLowerCase().includes(q) ||
    f.properties.district.toLowerCase().includes(q)
  );
  if (villageMatches.length > 0) {
    const result = { parcels: villageMatches, mode: 'VILLAGE', query };
    _cache.set(cacheKey, result);
    return result;
  }

  // ── 6. Full-text scan on properties ──────────────────────────────────────
  const textMatches = all.filter((f) => {
    const props = f.properties;
    return (
      props.ulpin.toLowerCase().includes(q) ||
      props.survey_number.includes(q) ||
      props.gat_number.includes(q)
    );
  });

  const result = { parcels: textMatches, mode: textMatches.length > 0 ? 'TEXT' : 'NO_MATCH', query };
  _cache.set(cacheKey, result);
  return result;
}

/**
 * Get the focal citizen parcel (CIT-001 / ULPIN-MH-PUN-000001).
 */
export function getMyLandParcels(citizenId = 'CIT-001') {
  if (citizenId === 'CIT-001') {
    const f = getParcelByULPIN('ULPIN-MH-PUN-000001');
    return f ? [f] : [];
  }
  return [];
}

/**
 * Clear the resolver cache.
 */
export function clearResolverCache() {
  _cache.clear();
}

export default resolveParcelSearch;
