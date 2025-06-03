import { Role } from '@/types/role';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('malldre_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const roleService = {
  // Get all roles
  getAll: async (): Promise<Role[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/role`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter funções');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Get role by ID
  getById: async (id: string): Promise<Role> => {
    try {
      const response = await fetch(`${API_BASE_URL}/role/${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter função');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching role ${id}:`, error);
      throw error;
    }
  },

  // Create new role
  create: async (roleData: Partial<Role>): Promise<Role> => {
    try {
      const response = await fetch(`${API_BASE_URL}/role`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar função');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  // Update role
  update: async (id: string, roleData: Partial<Role>): Promise<Role> => {
    try {
      const response = await fetch(`${API_BASE_URL}/role/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar função');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating role ${id}:`, error);
      throw error;
    }
  },
};
