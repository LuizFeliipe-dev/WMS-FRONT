
const API_BASE_URL = 'https://33kg2j8r-3000.brs.devtunnels.ms';
import { getAuthHeader } from '@/utils/auth';

export interface ShelfType {
  id: number;
  name: string;
  height: number;
  width: number;
  depth: number;
  maxWeight: number;
  canStack: boolean;
}

export const shelfTypeService = {
  // Get all shelf types
  getAll: async (): Promise<ShelfType[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shelf/type`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter tipos de prateleiras');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching shelf types:', error);
      throw error;
    }
  },

  // Get shelf type by ID
  getById: async (id: number): Promise<ShelfType> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shelf/type/${id}`, {
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
  create: async (shelfTypeData: Omit<ShelfType, 'id'>): Promise<ShelfType> => {
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
  update: async (id: number, shelfTypeData: Partial<ShelfType>): Promise<ShelfType> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shelf/type/${id}`, {
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

  // Delete shelf type
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shelf/type/${id}`, {
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
