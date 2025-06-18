
import { z } from 'zod';
import { itemFormSchema } from '@/components/items/form/ItemFormSchema';

export type ItemFormValues = z.infer<typeof itemFormSchema> & {
  id?: string;
};

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
