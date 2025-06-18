
import { useState, useEffect } from 'react';
import { getAuthHeader } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ShelfFromRack {
  id: string;
  position: string;
  rackId: string;
}

export const useShelvesFromRack = (rackId: string | null) => {
  const [shelves, setShelves] = useState<ShelfFromRack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rackId) {
      setShelves([]);
      return;
    }

    const fetchShelves = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/shelf?rackId=${rackId}`, {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao obter prateleiras do rack');
        }

        const data = await response.json();
        console.log('Shelves from rack data:', data);
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setShelves(data);
        } else if (data.data && Array.isArray(data.data)) {
          setShelves(data.data);
        } else {
          console.error('Expected array but got:', typeof data, data);
          setShelves([]);
        }
      } catch (error) {
        console.error('Error fetching shelves from rack:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
        setShelves([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShelves();
  }, [rackId]);

  return {
    shelves,
    isLoading,
    error
  };
};
