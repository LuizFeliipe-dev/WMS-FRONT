
const API_BASE_URL = 'https://33kg2j8r-3000.brs.devtunnels.ms';
import { getAuthHeader } from '@/utils/auth';
import { Item } from '@/types/item';

export const productService = {
  // Get all products
  getAll: async (): Promise<Item[]> => {
    const response = await fetch(`${API_BASE_URL}/product`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao obter itens');
    }

    return await response.json();
  },

  // Get product by ID
  getById: async (id: string): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao obter item');
    }

    return await response.json();
  },

  // Create new product
  create: async (productData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'accessLogId'>): Promise<Item> => {
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
      throw new Error(errorData.message || 'Falha ao criar item');
    }

    return await response.json();
  },

  // Update product
  update: async (id: string, productData: Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'accessLogId'>>): Promise<Item> => {
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
      throw new Error(errorData.message || 'Falha ao atualizar item');
    }

    return await response.json();
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao excluir item');
    }
  },

  // Toggle product status (active/inactive)
  toggleStatus: async (id: string, active: boolean): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao atualizar status do item');
    }

    return await response.json();
  },
};
