import { useState, useEffect } from 'react';
import mutationService from '../services/mutationService';

/**
 * Hook to manage e-Ferfar mutations and timelines
 */
export const useMutations = (parcelId = null) => {
  const [mutations, setMutations] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = parcelId
          ? await mutationService.getMutationsByParcel(parcelId)
          : await mutationService.getMutations();
        setMutations(data);
      } catch (err) {
        console.error('Failed to load mutations', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [parcelId]);

  const loadTimeline = async (mutationId) => {
    try {
      const steps = await mutationService.getMutationTimeline(mutationId);
      setSelectedTimeline(steps);
      return steps;
    } catch (err) {
      console.error('Failed to load timeline', err);
      return [];
    }
  };

  return {
    mutations,
    selectedTimeline,
    loading,
    loadTimeline,
  };
};

export default useMutations;
