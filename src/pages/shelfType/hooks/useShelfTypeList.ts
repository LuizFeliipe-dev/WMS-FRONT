import { useEffect, useState } from 'react';
import { shelfTypeService } from '@/services/shelfTypes';
import { useToast } from '@/hooks/use-toast';
import { IShelfType } from '@/types/shelf';

interface ShelfTypeFilters {
  take?: number;
  active: boolean;
  page: number;
  name: string;
}

export const useShelfTypeList = (filters: ShelfTypeFilters) => {
  const [shelfTypes, setShelfTypes] = useState<IShelfType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchShelfTypes = async () => {
    try {
      setIsLoading(true);
      const res = await shelfTypeService.getAll(filters);
      setShelfTypes(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (error) {
      toast({
        title: 'Erro ao buscar tipos de prateleira',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
      setShelfTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShelfTypes();
  }, [filters]);

  return {
    shelfTypes,
    isLoading,
    totalPages,
    refetch: fetchShelfTypes,
  };
};
