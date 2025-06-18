import { ApiResponse } from '@/types/pagination';
import { getAuthHeader } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
  cargo?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: any[];
  permission?: string;
  roles?: any[];
}

interface GetUsersParams {
  take?: number;
  page?: number;
  active?: boolean;
  name?: string;
}

export const userService = {
  // Get all users with pagination and filters
  getAll: async (params?: GetUsersParams): Promise<UserData[]> => {
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

      const url = `${API_BASE_URL}/user${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

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
          throw new Error(errorData.message || 'Falha ao obter usuários');
        } else {
          throw new Error(`Falha ao obter usuários: ${response.status}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return [];
      }

      const apiResponse: ApiResponse<UserData> = await response.json();
      return apiResponse.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<UserData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao obter usuário');
        } else {
          throw new Error(`Falha ao obter usuário: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  create: async (userData: Partial<UserData> & { password: string; role?: string }): Promise<UserData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          cargo: userData.role,
          password: userData.password,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao criar usuário');
        } else {
          throw new Error(`Falha ao criar usuário: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  update: async (id: string, userData: Partial<UserData> & { password: string; role?: string }): Promise<UserData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user?userId=${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          cargo: userData.role,
          password: userData.password,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao atualizar usuário');
        } else {
          throw new Error(`Falha ao atualizar usuário: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao excluir usuário');
        } else {
          throw new Error(`Falha ao excluir usuário: ${response.status}`);
        }
      }
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  inactivate: async (rackId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/inactivate?rackId=${rackId}`, {
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

  reactivate: async (rackId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/reactivate?rackId=${rackId}`, {
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

  saveUserRoles: async (userId: string, payload: { roles: { roleId: string; writer: boolean }[] }, method: 'POST' | 'PUT' = 'POST'): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/role?userId=${userId}`, {
        method: method,
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao salvar funções do usuário');
        } else {
          throw new Error(`Falha ao salvar funções do usuário: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error saving user roles:', error);
      throw error;
    }
  },

  deleteUserRole: async (userId: string, roleId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/role?userId=${userId}&roleId=${roleId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao excluir função do usuário');
        } else {
          throw new Error(`Falha ao excluir função do usuário: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error deleting user role:', error);
      throw error;
    }
  },
};
