import { CreateTransactionRequest } from '@/types/transaction';
import { request } from './httpService';

export const transactionService = {
  create: (transactionData: CreateTransactionRequest): Promise<any> => {
    return request<any>(
      'post',
      '/transaction',
      { packages: [transactionData] },
      {
        params: {
          transactionType: transactionData.transactionType,
        },
      }
    );
  },
};
