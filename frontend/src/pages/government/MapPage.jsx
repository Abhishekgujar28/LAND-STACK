import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthorityGisMap from '../../components/government/AuthorityGisMap';
import { ROLES } from '../../config/roles';
import { useAuth } from '../../hooks/useAuth';

/**
 * MapPage - Fullscreen GIS Cadastral Map Explorer for Official Workspaces
 * Clean, edge-to-edge spatial viewer layout across all official logins without visual collisions.
 */
export const MapPage = () => {
  const { role: userRole } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedUlpin, setSelectedUlpin] = useState(() => searchParams.get('ulpin') || null);
  const [activeAuthorityRole, setActiveAuthorityRole] = useState(userRole || ROLES.TEHSILDAR);

  useEffect(() => {
    if (userRole) {
      setActiveAuthorityRole(userRole);
    }
  }, [userRole]);

  return (
    <div
      className="page-map-explorer-fullscreen"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        margin: 0,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        backgroundColor: '#0f172a',
      }}
    >
      {/* Main Interactive Authority GIS Map (Full Viewport Canvas) */}
      <AuthorityGisMap
        authorityRole={activeAuthorityRole}
        onAuthorityRoleChange={setActiveAuthorityRole}
        showAuthoritySwitcher={true}
        height="100%"
        selectedUlpin={selectedUlpin}
        onSelectParcel={(plot) => setSelectedUlpin(plot.ulpin)}
      />
    </div>
  );
};

export default MapPage;
