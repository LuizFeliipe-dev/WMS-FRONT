import { useState } from 'react';
import { useZones } from '../pages/zone/hooks/useZones';
import { IZone } from '@/types/zone';

export const useZonesWithFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    zones,
    isLoading,
    fetchZones: baseFetchZones,
    createZone,
    updateZone,
    toggleZoneActive,
    totalPages,
  } = useZones();

  const fetchZones = async () => {
    const params = {
      search: searchTerm,
      active: showActive,
      page: currentPage,
    };

    await baseFetchZones(params);
  };

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
    totalPages,
    createZone,
    updateZone,
    toggleZoneStatus,
    fetchZones,
  };
};
