
import { z } from 'zod';
import { itemFormSchema } from '@/components/items/form/ItemFormSchema';

export type ItemFormValues = z.infer<typeof itemFormSchema>;

export interface Item {
  id: number;
  code: string;
  name: string;
  description?: string;
  group: string;
  groupName: string;
  supplier: string;
  supplierName: string;
  stock: number;
  minStock: number;
  price: number;
  active: boolean;
}
