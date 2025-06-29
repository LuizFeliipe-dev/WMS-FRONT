
import { useState } from 'react';

// Define the entry type (mantido para compatibilidade)
export interface Entry {
  id: string;
  orderNumber: string;
  date: string;
  supplier: string;
  items: number;
  status: 'pending' | 'processing' | 'allocated' | 'completed' | 'received' | 'inspection' | 'awaiting storage' | 'in storage process';
  priority: 'Alta' | 'Média' | 'Baixa';
}

// Initial mock data for entries (mantido para compatibilidade com dashboard)
const initialEntries: Entry[] = [
  {
    id: '1',
    orderNumber: '10001',
    date: 'Hoje, 14:30',
    supplier: 'Fornecedor XYZ',
    items: 5,
    status: 'received',
    priority: 'Alta'
  },
  {
    id: '2',
    orderNumber: '10002',
    date: 'Amanhã, 09:00',
    supplier: 'Fornecedor ABC',
    items: 3,
    status: 'inspection',
    priority: 'Média'
  },
  {
    id: '3',
    orderNumber: '10003',
    date: '29/08, 11:00',
    supplier: 'Fornecedor DEF',
    items: 7,
    status: 'allocated',
    priority: 'Baixa'
  },
  {
    id: '4',
    orderNumber: '10004',
    date: '30/08, 15:45',
    supplier: 'Fornecedor GHI',
    items: 2,
    status: 'awaiting storage',
    priority: 'Alta'
  },
  {
    id: '5',
    orderNumber: '10005',
    date: '01/09, 10:30',
    supplier: 'Fornecedor JKL',
    items: 4,
    status: 'in storage process',
    priority: 'Média'
  }
];

export const useEntries = () => {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);

  const addEntry = (entry: Omit<Entry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setEntries([...entries, newEntry]);
  };

  const updateEntryStatus = (id: string, status: Entry['status']) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, status } : entry
    ));
  };

  return {
    entries,
    addEntry,
    updateEntryStatus
  };
};
