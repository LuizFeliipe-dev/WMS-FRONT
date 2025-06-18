import { ApiResponse } from '@/types/pagination';
import { getAuthHeader } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Zone {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetZonesParams {
  take?: number;
  page?: number;
  active?: boolean;
  name?: string;
}

export const zoneService = {
  // Get all zones with pagination and filters
  getAll: async (params?: GetZonesParams): Promise<Zone[]> => {
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

      const url = `${API_BASE_URL}/zone${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter zonas');
      }

      const apiResponse: ApiResponse<Zone> = await response.json();
      return apiResponse.data || [];
    } catch (error) {
      console.error('Error fetching zones:', error);
      throw error;
    }
  },

  // Get zone by ID
  getById: async (id: string): Promise<Zone> => {
    try {
      const response = await fetch(`${API_BASE_URL}/zone/${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter zona');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching zone ${id}:`, error);
      throw error;
    }
  },

  // Create new zone
  create: async (zoneData: { name: string }): Promise<Zone> => {
    try {
      const response = await fetch(`${API_BASE_URL}/zone`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zoneData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar zona');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating zone:', error);
      throw error;
    }
  },

  // Update zone
  update: async (id: string, zoneData: { name: string }): Promise<Zone> => {
    try {
      const response = await fetch(`${API_BASE_URL}/zone/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zoneData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar zona');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating zone ${id}:`, error);
      throw error;
    }
  },

  // Toggle zone status to inactive
  toggleInactive: async (id: string): Promise<Zone> => {
    try {
      const response = await fetch(`${API_BASE_URL}/zone/inactivate?zoneId=${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao inativar zona');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error inactivating zone ${id}:`, error);
      throw error;
    }
  },

  // Delete zone
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/zone/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir zona');
      }
    } catch (error) {
      console.error(`Error deleting zone ${id}:`, error);
      throw error;
    }
  },
};
