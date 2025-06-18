
import { ApiResponse } from '@/types/pagination';
import { Rack } from '../types/warehouse';
import { getAuthHeader } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const rackService = {
  // Get all racks with pagination and filters
  getAll: async (params?: {
    take?: number;
    page?: number;
    active?: boolean;
    name?: string;
  }): Promise<ApiResponse<Rack>> => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.take) {
        queryParams.append('take', params.take.toString());
      }

      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      if (params?.active !== undefined) {
        queryParams.append('active', params.active.toString());
      }

      if (params?.name && params.name.trim()) {
        queryParams.append('name', params.name.trim());
      }

      const url = `${API_BASE_URL}/rack${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter prateleiras');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching racks:', error);
      throw error;
    }
  },

  // Get rack by ID
  getById: async (id: string): Promise<Rack> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rack?rackId=${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter prateleira');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching rack ${id}:`, error);
      throw error;
    }
  },

  // Create new rack
  create: async (rackData: {
    shelfTypeId: string;
    name: string;
    columns: number;
    rows: number;
  }): Promise<Rack> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rack`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rackData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar prateleira');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating rack:', error);
      throw error;
    }
  },

  // Update rack
  update: async (id: string, rackData: {
    shelfTypeId: string;
    name: string;
    columns: number;
    rows: number;
  }): Promise<Rack> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rack?rackId=${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rackData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar prateleira');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating rack ${id}:`, error);
      throw error;
    }
  },

  inactivate: async (rackId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rack/inactivate?rackId=${rackId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao inativar prateleira');
      }
    } catch (error) {
      console.error(`Error inactivating rack ${rackId}:`, error);
      throw error;
    }
  },

  // Reactivate rack
  reactivate: async (rackId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rack/reactivate?rackId=${rackId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao reativar prateleira');
      }
    } catch (error) {
      console.error(`Error reactivating rack ${rackId}:`, error);
      throw error;
    }
  },
};
