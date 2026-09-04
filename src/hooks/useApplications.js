import { useState, useEffect } from 'react';
import applicationService from '../services/applicationService';

/**
 * Hook to manage citizen applications
 */
export const useApplications = (citizenId = null) => {
  const [applications, setApplications] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [apps, appTypes] = await Promise.all([
          citizenId
            ? applicationService.getApplicationsByCitizen(citizenId)
            : applicationService.getApplications(),
          applicationService.getApplicationTypes(),
        ]);
        setApplications(apps);
        setTypes(appTypes);
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [citizenId]);

  return {
    applications,
    types,
    loading,
  };
};

export default useApplications;
