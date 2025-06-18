
import { useState, useEffect, useMemo } from 'react';
import { Zone } from '@/services/zones';
import { useZones } from './useZones';

export interface IZone {
  id: string;
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  accessLogId?: string;
}

export const useZonesWithFilters = () => {
  const {
    zones: allZones,
    isLoading,
    createZone,
    updateZone,
    toggleZoneActive,
    deleteZone
  } = useZones();

  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Convert Zone to IZone format
  const convertZoneToIZone = (zone: Zone): IZone => ({
    id: zone.id,
    name: zone.name,
    active: zone.active,
    createdAt: new Date(zone.createdAt),
    updatedAt: new Date(zone.updatedAt),
    accessLogId: undefined
  });

  // Filter and paginate zones
  const zones = useMemo(() => {
    let filtered = allZones
      .filter(zone => showActive ? zone.active : !zone.active)
      .filter(zone => 
        zone.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Convert to IZone format
    return filtered.map(convertZoneToIZone);
  }, [allZones, searchTerm, showActive]);

  // Wrapper functions to handle the Zone/IZone conversion
  const toggleZoneStatus = async (zone: IZone) => {
    await toggleZoneActive(zone.id);
  };

  return {
    zones,
    isLoading,
    searchTerm,
    setSearchTerm,
    showActive,
    setShowActive,
    currentPage,
    setCurrentPage,
    createZone,
    updateZone,
    toggleZoneStatus
  };
};
