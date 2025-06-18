
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { ApiResponse } from '@/types/pagination';
import { getAuthHeader } from '@/utils/auth';

export interface ShelfType {
  id: string;
  name: string;
  height: number;
  width: number;
  depth: number;
  maxWeight: number;
  stackable: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  accessLogId: string;
}

export const shelfTypeService = {
  // Get all shelf types with pagination and filters
  getAll: async (params?: {
    take?: number;
    page?: number;
    active?: boolean;
    name?: string;
  }): Promise<ShelfType[]> => {
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

      const url = `${API_BASE_URL}/shelf/type${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter tipos de prateleiras');
      }

      const apiResponse: ApiResponse<ShelfType> = await response.json();
      return apiResponse.data || [];
    } catch (error) {
      console.error('Error fetching shelf types:', error);
      throw error;
    }
  },

  // Get shelf type by ID
  getById: async (id: string): Promise<ShelfType> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shelf/type?shelfTypeId=${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter tipo de prateleira');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching shelf type ${id}:`, error);
      throw error;
    }
  },

  // Create new shelf type
  create: async (shelfTypeData: {
    name: string;
    height: number;
    width: number;
    depth: number;
    maxWeight: number;
    stackable: boolean;
  }): Promise<ShelfType> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shelf/type`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shelfTypeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar tipo de prateleira');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating shelf type:', error);
      throw error;
    }
  },

  // Update shelf type
  update: async (id: string, shelfTypeData: {
    name: string;
    height: number;
    width: number;
    depth: number;
    maxWeight: number;
    stackable: boolean;
  }): Promise<ShelfType> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shelf/type?shelfTypeId=${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shelfTypeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar tipo de prateleira');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating shelf type ${id}:`, error);
      throw error;
    }
  },

  toggleActive: async (id: string): Promise<ShelfType> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shelf/type/reactivate?shelfTypeId=${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao alterar status do tipo de prateleira');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling shelf type status:', error);
      throw error;
    }
  },

  toggleInactive: async (id: string): Promise<ShelfType> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shelf/type/inactivate?shelfTypeId=${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao alterar status do tipo de prateleira');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling shelf type status:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shelf/type?shelfTypeId=${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir tipo de prateleira');
      }
    } catch (error) {
      console.error(`Error deleting shelf type ${id}:`, error);
      throw error;
    }
  },
};
