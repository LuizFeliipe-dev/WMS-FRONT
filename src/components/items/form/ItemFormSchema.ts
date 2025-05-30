
import * as z from 'zod';

export const itemFormSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  group: z.string().min(1, 'Grupo é obrigatório'),
  supplier: z.string().min(1, 'Fornecedor é obrigatório'),
  minStock: z.number().min(0, 'Estoque mínimo deve ser maior ou igual a 0'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  active: z.boolean().default(true),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;
