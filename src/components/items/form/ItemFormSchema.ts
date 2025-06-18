
import * as z from 'zod';

export const itemFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  measurementUnit: z.string().min(1, 'Unidade de medida é obrigatória'),
  productGroupId: z.string().min(1, 'Categoria é obrigatória'),
  active: z.boolean().default(true),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;
