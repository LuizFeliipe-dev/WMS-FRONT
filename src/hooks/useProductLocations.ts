
import { useState, useEffect } from 'react';
import { getAuthHeader } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ProductLocation {
  id: string;
  shelfId: string;
  quantity: number;
  product: {
    name: string;
  };
  shelf: {
    position: string;
    rack: {
      name: string;
    };
  };
  load: {
    createdAt: string;
    documentNumber: string;
  };
  accessLog: {
    user: {
      id: string;
      name: string;
    };
  };
}

export const useProductLocations = (productId: string | null) => {
  const [locations, setLocations] = useState<ProductLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLocations([]);
      return;
    }

    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/product/location?productId=${productId}`, {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao obter localizações do produto');
        }

        const data = await response.json();

        if (Array.isArray(data.data)) {
          setLocations(data.data);
        } else {
          console.error('Expected array but got:', typeof data, data);
          setLocations([]);
        }
      } catch (error) {
        console.error('Error fetching product locations:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [productId]);

  return {
    locations,
    isLoading,
    error
  };
};
