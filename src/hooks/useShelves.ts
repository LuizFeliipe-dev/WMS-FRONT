
import { useQuery } from '@tanstack/react-query';
import { useRacks } from './useRacks';

// Interface para prateleira baseada em rack
interface Shelf {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export const useShelves = () => {
  const { racks } = useRacks();
  
  const { data: shelves = [], isLoading, error } = useQuery({
    queryKey: ['shelves'],
    queryFn: async () => {
      // Simula prateleiras baseadas nos racks
      const mockShelves: Shelf[] = racks.flatMap(rack => [
        {
          id: `${rack.id}_A1`,
          code: `${rack.code}-A1`,
          name: `${rack.name} - Prateleira A1`,
          description: `Prateleira superior do rack ${rack.name}`
        },
        {
          id: `${rack.id}_A2`,
          code: `${rack.code}-A2`,
          name: `${rack.name} - Prateleira A2`,
          description: `Prateleira inferior do rack ${rack.name}`
        }
      ]);
      
      return mockShelves;
    },
    enabled: racks.length > 0
  });

  return {
    locations: shelves, // Mantém o nome 'locations' para compatibilidade
    shelves,
    isLoading,
    error
  };
};
