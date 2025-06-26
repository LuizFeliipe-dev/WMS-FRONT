
import { z } from 'zod';
import { productFormSchema } from '@/pages/product/components/form/productFormSchema';

export type ProductFormValues = z.infer<typeof productFormSchema> & {
  id?: string;
};

export interface IProduct {
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


export interface ApiProductRequest {
  name: string;
  description: string;
  measurementUnit: string;
  productGroupId: string;
  active: boolean;
}
