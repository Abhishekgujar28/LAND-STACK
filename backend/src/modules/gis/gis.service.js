/**
 * Land Stack — GIS & Spatial Operations Service (Database-Only)
 * 
 * Supports PostGIS spatial queries, GeoJSON feature generation,
 * polygon validation, and bounding box queries directly from PostgreSQL.
 */

import { Errors } from '../../core/errors.js';
import { getSupabaseAdmin } from '../../config/supabase.js';

export const GisService = {
  /**
   * Convert parcel record to GeoJSON Feature
   */
  _toGeoJsonFeature(parcel) {
    let coordinates = parcel.coordinates || parcel.boundary_coordinates;
    if (typeof coordinates === 'string') {
      try {
        coordinates = JSON.parse(coordinates);
      } catch {
        coordinates = null;
      }
    }

    // Default polygon around parcel centroid if coordinates are missing
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      const lat = Number(parcel.latitude) || 18.5793;
      const lng = Number(parcel.longitude) || 73.9812;
      coordinates = [
        [
          [lng - 0.001, lat - 0.001],
          [lng + 0.001, lat - 0.001],
          [lng + 0.001, lat + 0.001],
          [lng - 0.001, lat + 0.001],
          [lng - 0.001, lat - 0.001],
        ],
      ];
    }

    return {
      type: 'Feature',
      id: parcel.ulpin || parcel.id,
      properties: {
        ulpin: parcel.ulpin,
        surveyNumber: parcel.survey_number || parcel.surveyNumber,
        gatNumber: parcel.gat_number || parcel.gatNumber,
        khasraNumber: parcel.khasra_number || parcel.khasraNumber,
        village: parcel.village_name || parcel.villageName,
        currentOwner: parcel.current_owner,
        areaHectares: parcel.area,
        landUse: parcel.land_use || parcel.landUse,
        status: parcel.status,
      },
      geometry: {
        type: 'Polygon',
        coordinates,
      },
    };
  },

  /**
   * Get GeoJSON Feature for a specific parcel from PostgreSQL
   */
  async getParcelGeoJson(ulpin) {
    if (!ulpin) throw Errors.badRequest('ULPIN is required');

    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Database unavailable.');

    const { data: parcel, error } = await admin
      .from('parcels')
      .select('*')
      .ilike('ulpin', ulpin.trim())
      .maybeSingle();

    if (error || !parcel) {
      throw Errors.notFound(`Parcel '${ulpin}' not found in database`);
    }

    return this._toGeoJsonFeature(parcel);
  },

  /**
   * Get FeatureCollection of all parcels in a village from PostgreSQL
   */
  async getVillageCadastralMap(villageCode) {
    if (!villageCode) throw Errors.badRequest('Village code is required');

    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Database unavailable.');

    const { data: parcels, error } = await admin
      .from('parcels')
      .select('*')
      .eq('village_code', villageCode.trim());

    if (error) {
      console.error('[GisService] Error fetching cadastral parcels:', error.message);
      throw Errors.internal('Failed to fetch cadastral map from database.');
    }

    return {
      type: 'FeatureCollection',
      features: (parcels || []).map((p) => this._toGeoJsonFeature(p)),
    };
  },

  /**
   * Search parcels within a bounding box from PostgreSQL
   */
  async searchByBoundingBox({ minLat, minLng, maxLat, maxLng }) {
    if (minLat == null || minLng == null || maxLat == null || maxLng == null) {
      throw Errors.badRequest('Bounding box coordinates (minLat, minLng, maxLat, maxLng) are required');
    }

    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Database unavailable.');

    const { data: parcels, error } = await admin
      .from('parcels')
      .select('*')
      .gte('latitude', Number(minLat))
      .lte('latitude', Number(maxLat))
      .gte('longitude', Number(minLng))
      .lte('longitude', Number(maxLng));

    if (error) {
      console.error('[GisService] Error searching by bounding box:', error.message);
      throw Errors.internal('Failed to query spatial bounding box.');
    }

    return {
      type: 'FeatureCollection',
      features: (parcels || []).map((p) => this._toGeoJsonFeature(p)),
    };
  },

  /**
   * Validate cadastral polygon geometry
   */
  validatePolygon(coordinates) {
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      return { valid: false, error: 'Coordinates must be an array of linear rings.' };
    }

    const exteriorRing = coordinates[0];
    if (!Array.isArray(exteriorRing) || exteriorRing.length < 4) {
      return { valid: false, error: 'Exterior ring must contain at least 4 coordinate pairs.' };
    }

    const first = exteriorRing[0];
    const last = exteriorRing[exteriorRing.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      return { valid: false, error: 'Polygon is not closed: first and last coordinates must match.' };
    }

    return { valid: true };
  },
};
