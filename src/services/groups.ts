
const API_BASE_URL = 'https://33kg2j8r-3000.brs.devtunnels.ms';
import { getAuthHeader } from '@/utils/auth';

export interface Group {
  id: string;
  name: string;
  code: string;
  description: string;
  parentId?: string;
  zoneId?: string;
  itemCount?: number;
  children?: Group[];
}

export const groupService = {
  // Get all groups
  getAll: async (): Promise<Group[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/productGroup`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter categorias');
      }

      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse groups data:', e);
        throw new Error('Erro ao processar dados das categorias');
      }
      
      return data.map((group: any) => ({
        ...group,
        children: group.children || []
      }));
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  // Get group by ID
  getById: async (id: string): Promise<Group> => {
    try {
      const response = await fetch(`${API_BASE_URL}/productGroup/${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter categoria');
      }

      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse group data:', e);
        throw new Error('Erro ao processar dados da categoria');
      }
      
      return {
        ...data,
        children: data.children || []
      };
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
      throw error;
    }
  },

  // Create new group
  create: async (groupData: Omit<Group, 'id'>): Promise<Group> => {
    try {
      const response = await fetch(`${API_BASE_URL}/productGroup`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar categoria');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  // Update group
  update: async (id: string, groupData: Partial<Group>): Promise<Group> => {
    try {
      const response = await fetch(`${API_BASE_URL}/productGroup/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar categoria');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating group ${id}:`, error);
      throw error;
    }
  },
};
