
import { ApiResponse } from '@/types/pagination';
import { getAuthHeader } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Group {
  id: string;
  name: string;
  parentId?: string;
  zoneId?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  children?: Group[];
}

interface GetGroupsParams {
  take?: number;
  page?: number;
  active?: boolean;
}

export const groupService = {
  // Get all groups with pagination and filters
  getAll: async (params?: GetGroupsParams): Promise<Group[]> => {
    try {
      const queryParams = new URLSearchParams();

      // Always add pagination
      queryParams.append('take', (params?.take || 10).toString());
      queryParams.append('page', (params?.page || 1).toString());

      // Add active filter
      if (params?.active !== undefined) {
        queryParams.append('active', params.active.toString());
      }

      const url = `${API_BASE_URL}/product/group?${queryParams.toString()}`;
      console.log('Making request to:', url);

      const response = await fetch(url, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao obter categorias');
        } else {
          throw new Error(`Falha ao obter categorias: ${response.status}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return [];
      }

      const apiResponse: ApiResponse<Group> = await response.json();
      return apiResponse.data || [];
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  // Get group by ID
  getById: async (id: string): Promise<Group> => {
    const response = await fetch(`${API_BASE_URL}/product/group/${id}`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao obter categoria');
    }

    return await response.json();
  },

  // Create new group
  create: async (groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<Group> => {
    const response = await fetch(`${API_BASE_URL}/product/group`, {
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
  },

  // Update group
  update: async (id: string, groupData: Partial<Omit<Group, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Group> => {
    const response = await fetch(`${API_BASE_URL}/product/group?productGroupId=${id}`, {
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
  },

  // Delete group
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/product/group/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao excluir categoria');
    }
  },

  // Inactivate group
  inactivate: async (id: string): Promise<Group> => {
    const response = await fetch(`${API_BASE_URL}/product/group/inactivate?productGroupId=${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao inativar categoria');
    }

    return await response.json();
  },

  // Reactivate group
  reactivate: async (id: string): Promise<Group> => {
    const response = await fetch(`${API_BASE_URL}/product/group/reactivate?productGroupId=${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao reativar categoria');
    }

    return await response.json();
  },
};
