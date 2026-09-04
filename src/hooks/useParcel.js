import { useState, useEffect } from 'react';
import parcelService from '../services/parcelService';

/**
 * Hook to manage parcel queries and 360 title dossier
 */
export const useParcel = (initialUlpin = null) => {
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialUlpin) {
      loadParcel360(initialUlpin);
    } else {
      loadAllParcels();
    }
  }, [initialUlpin]);

  const loadAllParcels = async () => {
    setLoading(true);
    try {
      const data = await parcelService.getParcels();
      setParcels(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadParcel360 = async (ulpin) => {
    setLoading(true);
    try {
      const dossier = await parcelService.getParcel360(ulpin);
      setSelectedParcel(dossier);
      return dossier;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const search = async (query) => {
    setLoading(true);
    try {
      const results = await parcelService.searchParcels(query);
      setParcels(results);
      return results;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    parcels,
    selectedParcel,
    loading,
    error,
    search,
    loadParcel360,
    loadAllParcels,
  };
};

export default useParcel;
