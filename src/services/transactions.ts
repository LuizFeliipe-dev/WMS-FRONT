
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { getAuthHeader } from '@/utils/auth';

export interface CreateTransactionRequest {
  id: string;
  transactionType: 'OUTBOUND' | 'INTERNAL_TRANSFER';
  quantity: number;
  shelfFromId: string;
  shelfToId: string;
}

export const transactionService = {
  // Create new transaction
  create: async (transactionData: CreateTransactionRequest): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/transaction?transactionType=${transactionData.transactionType}`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({packages:[transactionData]}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar transação');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },
};
