
import { useState } from 'react';
import { WarehouseLocation } from '@/types/warehouse';

// Initial mock data
const initialLocations: WarehouseLocation[] = [
  {
    id: 1,
    code: 'L01',
    name: 'Nível Superior',
    description: 'Nível superior da prateleira',
    rackId: '1',
  },
  {
    id: 2,
    code: 'L02',
    name: 'Nível Médio',
    description: 'Nível médio da prateleira',
    rackId: '1',
  },
  {
    id: 3,
    code: 'L03',
    name: 'Nível Inferior',
    description: 'Nível inferior da prateleira',
    rackId: '1',
  },
  {
    id: 4,
    code: 'L04',
    name: 'Nível Superior',
    description: 'Nível superior da prateleira',
    rackId: '2',
  },
  {
    id: 5,
    code: 'L05',
    name: 'Nível Médio',
    description: 'Nível médio da prateleira',
    rackId: '2',
  },
];

export const useLocations = () => {
  const [locations, setLocations] = useState<WarehouseLocation[]>(initialLocations);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations.filter(location => 
    location.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addLocation = (location: Omit<WarehouseLocation, 'id'>) => {
    const newLocation = {
      ...location,
      id: locations.length + 1,
    };
    setLocations([...locations, newLocation]);
  };

  const updateLocation = (id: number, location: Partial<WarehouseLocation>) => {
    setLocations(
      locations.map(loc => (loc.id === id ? { ...loc, ...location } : loc))
    );
  };

  const deleteLocation = (id: number) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  return {
    locations,
    filteredLocations,
    searchTerm,
    setSearchTerm,
    addLocation,
    updateLocation,
    deleteLocation
  };
};
