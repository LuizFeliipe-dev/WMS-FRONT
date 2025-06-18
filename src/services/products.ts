
import { ApiResponse } from '@/types/pagination';
import { getAuthHeader } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Item {
  id: string;
  name: string;
  description: string;
  measurementUnit: string;
  productGroupId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  accessLogId: string;
  group: {
    name: string;
  };
}

interface GetProductsParams {
  take?: number;
  page?: number;
  active?: boolean;
  name?: string;
  groupId?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  measurementUnit: string;
  productGroupId: string;
  active: boolean;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  measurementUnit: string;
  productGroupId: string;
  active: boolean;
}

export const productService = {
  // Get all products with pagination and filters
  getAll: async (params?: GetProductsParams): Promise<Item[]> => {
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

      const url = `${API_BASE_URL}/product${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

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
          throw new Error(errorData.message || 'Falha ao obter produtos');
        } else {
          throw new Error(`Falha ao obter produtos: ${response.status}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return [];
      }

      const apiResponse: ApiResponse<Item> = await response.json();
      return apiResponse.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Create new product
  create: async (productData: CreateProductRequest): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar produto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update existing product
  update: async (id: string, productData: UpdateProductRequest): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar produto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Inactivate product
  inactivate: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/inactivate/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao inativar produto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error inactivating product:', error);
      throw error;
    }
  },

  // Reactivate product
  reactivate: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/reactivate/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao reativar produto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error reactivating product:', error);
      throw error;
    }
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir produto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};
