
import { Rack } from '../types/warehouse';

const API_BASE_URL = 'https://33kg2j8r-3000.brs.devtunnels.ms';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('malldre_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const rackService = {
  // Get all racks
  getAll: async (): Promise<Rack[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rack`, {
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
      const response = await fetch(`${API_BASE_URL}/rack/${id}`, {
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
  create: async (rackData: Partial<Rack>): Promise<Rack> => {
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
  update: async (id: string, rackData: Partial<Rack>): Promise<Rack> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rack/${id}`, {
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
};
