
import { useState } from 'react';
import { Rack } from '@/types/warehouse';

// Initial mock data
const initialRacks: Rack[] = [
  {
    id: 1,
    code: 'R01',
    name: 'Prateleira A',
    description: 'Prateleira para produtos eletrônicos',
    corridorId: '1',
    shelfTypeId: '1',
    zoneId: '1',
    verticalShelves: 3,
    horizontalShelves: 5,
  },
  {
    id: 2,
    code: 'R02',
    name: 'Prateleira B',
    description: 'Prateleira para produtos alimentícios',
    corridorId: '1',
    shelfTypeId: '2',
    zoneId: '1',
    verticalShelves: 2,
    horizontalShelves: 4,
  },
  {
    id: 3,
    code: 'R03',
    name: 'Prateleira C',
    description: 'Prateleira para produtos de higiene',
    corridorId: '2',
    shelfTypeId: '3',
    zoneId: '2',
    verticalShelves: 4,
    horizontalShelves: 3,
  },
  {
    id: 4,
    code: 'R04',
    name: 'Prateleira D',
    description: 'Prateleira para produtos de limpeza',
    corridorId: '2',
    shelfTypeId: '1',
    zoneId: '2',
    verticalShelves: 2,
    horizontalShelves: 6,
  },
  {
    id: 5,
    code: 'R05',
    name: 'Prateleira E',
    description: 'Prateleira para produtos diversos',
    corridorId: '3',
    shelfTypeId: '2',
    zoneId: '3',
    verticalShelves: 3,
    horizontalShelves: 4,
  },
];

export const useRacks = () => {
  const [racks, setRacks] = useState<Rack[]>(initialRacks);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRacks = racks.filter(rack => 
    rack.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rack.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addRack = (rack: Omit<Rack, 'id'>) => {
    const newRack = {
      ...rack,
      id: racks.length + 1,
    };
    setRacks([...racks, newRack]);
  };

  const updateRack = (id: number, rack: Partial<Rack>) => {
    setRacks(
      racks.map(r => (r.id === id ? { ...r, ...rack } : r))
    );
  };

  const deleteRack = (id: number) => {
    setRacks(racks.filter(r => r.id !== id));
  };

  return {
    racks,
    filteredRacks,
    searchTerm,
    setSearchTerm,
    addRack,
    updateRack,
    deleteRack
  };
};
