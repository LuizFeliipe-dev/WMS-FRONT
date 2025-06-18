
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { ApiResponse } from '@/types/pagination';
import { getAuthHeader } from '@/utils/auth';

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

export interface LoadPackage {
  quantity: number;
  height: number;
  width: number;
  length: number;
  weight: number;
  productId: number;
}

export interface CreateLoadData {
  supplierId: string;
  documentNumber: string;
  value: number;
  package: LoadPackage[];
}

export interface Load {
  id: string;
  supplierId: string;
  documentNumber: string;
  value: number;
  status: string;
  accessLogId: string;
  createdAt: string;
  updatedAt: string;
  package: Package[];
}

export const loadService = {
  // Create a new load
  create: async (loadData: CreateLoadData): Promise<Load> => {
    try {
      const response = await fetch(`${API_BASE_URL}/load`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loadData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar carga');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating load:', error);
      throw error;
    }
  },

  getAll: async (): Promise<ApiResponse<Load>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/load`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter cargas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching loads:', error);
      throw error;
    }
  },

  // Update load status
  updateStatus: async (loadId: string, status: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/load/status?loadId=${loadId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar status da carga');
      }
    } catch (error) {
      console.error('Error updating load status:', error);
      throw error;
    }
  },
};
