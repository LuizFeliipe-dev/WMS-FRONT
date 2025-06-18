const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { ApiResponse } from '@/types/pagination';
import { getAuthHeader } from '@/utils/auth';
import { ISupplier } from '@/types/supplier';

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  active: boolean;
  accessLogId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface GetSuppliersParams {
  take?: number;
  page?: number;
  active?: boolean;
  name?: string;
}

export const supplierService = {
  // Get all suppliers with pagination and filters
  getAll: async (params?: GetSuppliersParams): Promise<Supplier[]> => {
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

      const url = `${API_BASE_URL}/supplier${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

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
          throw new Error(errorData.message || 'Falha ao obter fornecedores');
        } else {
          throw new Error(`Falha ao obter fornecedores: ${response.status}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return [];
      }

      const apiResponse: ApiResponse<Supplier> = await response.json();
      return apiResponse.data || [];
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  // Get supplier by ID
  getById: async (id: string): Promise<Supplier> => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/${id}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter fornecedor');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching supplier ${id}:`, error);
      throw error;
    }
  },

  // Create new supplier
  create: async (supplierData: { name: string }): Promise<Supplier> => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar fornecedor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  // Update supplier
  update: async (id: string, supplierData: { name: string }): Promise<Supplier> => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier?supplierId=${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar fornecedor');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating supplier ${id}:`, error);
      throw error;
    }
  },

  toggleStatus: async (supplier: ISupplier): Promise<Supplier> => {
    try {
      if (supplier.active) {
        return await supplierService.inactivate(supplier.id);
      } else {
        return await supplierService.reactivate(supplier.id);
      }
    } catch (error) {
      console.error('Error toggling supplier status:', error);
      throw error;
    }
  },

  inactivate: async (id: string): Promise<Supplier> => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/inactivate?supplierId=${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao inativar fornecedor');
      }

      return;
    } catch (error) {
      console.error('Error inactivating supplier:', error);
      throw error;
    }
  },

  reactivate: async (id: string): Promise<Supplier> => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/reactivate?supplierId=${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao reativar fornecedor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error reactivating supplier:', error);
      throw error;
    }
  },

  // Add contacts to supplier
  addContacts: async (supplierId: string, contacts: any[]): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/supplier/contact`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplierId,
          contacts
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao adicionar contatos');
      }
    } catch (error) {
      console.error('Error adding contacts:', error);
      throw error;
    }
  },
};
