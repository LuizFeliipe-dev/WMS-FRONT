
import { useState, useEffect } from 'react';
import { loadService } from '@/services/loads';
import type { Load } from '@/services/loads';

export interface Product {
  id: string;
  name: string;
  description: string;
}

export interface Package {
  id: string;
  quantity: number;
  height: number;
  width: number;
  length: number;
  weight: number;
  packageType: string;
  product: Product;
}

export type { Load } from '@/services/loads';

export const useLoads = (page: number = 1, take: number = 10) => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoads = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await loadService.getAll();

      setLoads(res.data);
      setTotal(res.meta.totalPages);
    } catch (err) {
      setError('Erro ao carregar as cargas');
      setLoads([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, [page, take]);

  const updateLoadStatus = async (id: string, status: string) => {
    try {
      console.log('Updating load status:', { id, status });

      // Call the API to update the status
      await loadService.updateStatus(id, status);

      // Update local state
      setLoads(prevLoads =>
        prevLoads.map(load =>
          load.id === id ? { ...load, status } : load
        )
      );
    } catch (error) {
      console.error('Error updating load status:', error);
      throw error;
    }
  };

  return {
    loads,
    total,
    isLoading,
    error,
    updateLoadStatus,
    fetchLoads
  };
};
