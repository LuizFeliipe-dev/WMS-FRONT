
import { useState } from 'react';
import { Corridor } from '@/types/warehouse';

// Initial mock data
const initialCorridors: Corridor[] = [
  {
    id: 1,
    code: 'C01',
    name: 'Corredor 1',
    description: 'Corredor principal',
    warehouseId: '1',
  },
  {
    id: 2,
    code: 'C02',
    name: 'Corredor 2',
    description: 'Corredor secundário',
    warehouseId: '1',
  },
  {
    id: 3,
    code: 'C03',
    name: 'Corredor 3',
    description: 'Corredor auxiliar',
    warehouseId: '1',
  },
  {
    id: 4,
    code: 'C04',
    name: 'Corredor 1',
    description: 'Corredor principal',
    warehouseId: '2',
  },
  {
    id: 5,
    code: 'C05',
    name: 'Corredor 2',
    description: 'Corredor secundário',
    warehouseId: '2',
  },
];

export const useCorridors = () => {
  const [corridors, setCorridors] = useState<Corridor[]>(initialCorridors);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCorridors = corridors.filter(corridor => 
    corridor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    corridor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCorridor = (corridor: Omit<Corridor, 'id'>) => {
    const newCorridor = {
      ...corridor,
      id: corridors.length + 1,
    };
    setCorridors([...corridors, newCorridor]);
  };

  const updateCorridor = (id: number, corridor: Partial<Corridor>) => {
    setCorridors(
      corridors.map(c => (c.id === id ? { ...c, ...corridor } : c))
    );
  };

  const deleteCorridor = (id: number) => {
    setCorridors(corridors.filter(c => c.id !== id));
  };

  return {
    corridors,
    filteredCorridors,
    searchTerm,
    setSearchTerm,
    addCorridor,
    updateCorridor,
    deleteCorridor
  };
};
