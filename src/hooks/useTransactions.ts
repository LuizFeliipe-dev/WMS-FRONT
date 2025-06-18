
import { useState, useEffect } from 'react';
import { transactionService } from '@/services/transactions';

export interface Transaction {
  id: string;
  orderNumber: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  items: number;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Mock data for display compatibility
const mockTransactions: Transaction[] = [
  {
    id: '1',
    orderNumber: '#20001',
    date: new Date(Date.now() - 0 * 86400000).toISOString(),
    fromLocation: 'A-1-1',
    toLocation: 'B-2-3',
    items: 3,
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    orderNumber: '#20002',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    fromLocation: 'B-1-2',
    toLocation: 'C-1-1',
    items: 5,
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    orderNumber: '#20003',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    fromLocation: 'C-2-1',
    toLocation: 'A-3-2',
    items: 2,
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    orderNumber: '#20004',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    fromLocation: 'A-2-3',
    toLocation: 'B-1-1',
    items: 7,
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    orderNumber: '#20005',
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    fromLocation: 'B-3-2',
    toLocation: 'C-2-3',
    items: 4,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useTransactions = (page: number = 1, take: number = 10) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simular API call com delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Por enquanto usar dados mock, mas preparado para usar o serviço real
        // const result = await transactionService.getAll(page, take);
        
        // Simular paginação
        const startIndex = (page - 1) * take;
        const endIndex = startIndex + take;
        const paginatedTransactions = mockTransactions.slice(startIndex, endIndex);
        
        setTransactions(paginatedTransactions);
        setTotal(mockTransactions.length);
      } catch (err) {
        setError('Erro ao carregar as transações');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, take]);

  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    setTransactions(prevTransactions => 
      prevTransactions.map(transaction => 
        transaction.id === id ? { ...transaction, status } : transaction
      )
    );
  };

  return {
    transactions,
    total,
    isLoading,
    error,
    updateTransactionStatus
  };
};
