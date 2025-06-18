
import { useState } from 'react';
import { Rack } from '@/types/warehouse';

// Initial mock data
const initialRacks: Rack[] = [
  {
    id: '1',
    code: 'R01',
    name: 'Prateleira A',
    description: 'Prateleira para produtos eletrônicos',
    corridorId: '1',
    shelfTypeId: '1',
    zoneId: '1',
    verticalShelves: 3,
    horizontalShelves: 5,
    rows: 3,
    columns: 5,
    active: true,
    accessLogId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    shelfType: {
      id: '1',
      name: 'Prateleira Pequena',
      height: 1,
      width: 0.8,
      depth: 0.5,
      maxWeight: 50,
      stackable: true,
      active: true,
    },
  },
  {
    id: '2',
    code: 'R02',
    name: 'Prateleira B',
    description: 'Prateleira para produtos alimentícios',
    corridorId: '1',
    shelfTypeId: '2',
    zoneId: '1',
    verticalShelves: 2,
    horizontalShelves: 4,
    rows: 2,
    columns: 4,
    active: true,
    accessLogId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    shelfType: {
      id: '2',
      name: 'Prateleira Média',
      height: 1.5,
      width: 1,
      depth: 0.8,
      maxWeight: 100,
      stackable: true,
      active: true,
    },
  },
  {
    id: '3',
    code: 'R03',
    name: 'Prateleira C',
    description: 'Prateleira para produtos de higiene',
    corridorId: '2',
    shelfTypeId: '3',
    zoneId: '2',
    verticalShelves: 4,
    horizontalShelves: 3,
    rows: 4,
    columns: 3,
    active: true,
    accessLogId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    shelfType: {
      id: '3',
      name: 'Prateleira Grande',
      height: 2,
      width: 1.2,
      depth: 1,
      maxWeight: 200,
      stackable: true,
      active: true,
    },
  },
  {
    id: '4',
    code: 'R04',
    name: 'Prateleira D',
    description: 'Prateleira para produtos de limpeza',
    corridorId: '2',
    shelfTypeId: '1',
    zoneId: '2',
    verticalShelves: 2,
    horizontalShelves: 6,
    rows: 2,
    columns: 6,
    active: true,
    accessLogId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    shelfType: {
      id: '1',
      name: 'Prateleira Pequena',
      height: 1,
      width: 0.8,
      depth: 0.5,
      maxWeight: 50,
      stackable: true,
      active: true,
    },
  },
  {
    id: '5',
    code: 'R05',
    name: 'Prateleira E',
    description: 'Prateleira para produtos diversos',
    corridorId: '3',
    shelfTypeId: '2',
    zoneId: '3',
    verticalShelves: 3,
    horizontalShelves: 4,
    rows: 3,
    columns: 4,
    active: true,
    accessLogId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    shelfType: {
      id: '2',
      name: 'Prateleira Média',
      height: 1.5,
      width: 1,
      depth: 0.8,
      maxWeight: 100,
      stackable: true,
      active: true,
    },
  },
];

export const useRacks = () => {
  const [racks, setRacks] = useState<Rack[]>(initialRacks);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRacks = racks.filter(rack => 
    rack.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rack.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addRack = (rack: Omit<Rack, 'id'>) => {
    const newRack = {
      ...rack,
      id: String(racks.length + 1),
    };
    setRacks([...racks, newRack]);
  };

  const updateRack = (id: string, rack: Partial<Rack>) => {
    setRacks(
      racks.map(r => (r.id === id ? { ...r, ...rack } : r))
    );
  };

  const deleteRack = (id: string) => {
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
