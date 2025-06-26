import { useEffect, useState } from 'react';
import { rackService } from '@/services/racks';
import { useToast } from '@/hooks/use-toast';
import { Rack } from '@/types/warehouse';

interface RackFilters {
  take?: number;
  page: number;
  name: string;
  active: boolean;
}

export const useRackList = (filters: RackFilters) => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchRacks = async () => {
    try {
      setIsLoading(true);
      const res = await rackService.getAll(filters);
      setRacks(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (error) {
      toast({
        title: 'Erro ao carregar racks',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
      setRacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRacks();
  }, [filters.page, filters.name, filters.active]);

  return {
    racks,
    isLoading,
    totalPages,
    refetch: fetchRacks,
  };
};
