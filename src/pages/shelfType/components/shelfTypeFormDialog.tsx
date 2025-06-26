import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IShelfType } from '@/types/shelf';
import { useEffect } from 'react';

const shelfTypeFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  height: z.coerce.number().positive(),
  width: z.coerce.number().positive(),
  depth: z.coerce.number().positive(),
  maxWeight: z.coerce.number().positive(),
  stackable: z.boolean().default(false),
});

type FormValues = z.infer<typeof shelfTypeFormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => void;
  initialData: IShelfType | null;
}

const ShelfTypeFormDialog = ({ open, onOpenChange, onSubmit, initialData }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(shelfTypeFormSchema),
    defaultValues: {
      name: '', height: 0, width: 0, depth: 0, maxWeight: 0, stackable: false,
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        height: initialData.height,
        width: initialData.width,
        depth: initialData.depth,
        maxWeight: initialData.maxWeight,
        stackable: initialData.stackable,
      });
    } else {
      form.reset({
        name: '', height: 0, width: 0, depth: 0, maxWeight: 0, stackable: false,
      });
    }
  }, [initialData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Tipo de Prateleira' : 'Novo Tipo de Prateleira'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Atualize as informações desejadas abaixo.'
              : 'Preencha os dados para criar um novo tipo de prateleira.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input {...field} placeholder="Nome" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Altura (cm)', 'Largura (cm)', 'Profundidade (cm)'].map((dim) => (
                <FormField
                  key={dim}
                  name={dim as keyof FormValues}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dim[0].toUpperCase() + dim.slice(1)} (cm)</FormLabel>
                      <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        value={typeof field.value === 'number' ? field.value : ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <FormField name="maxWeight" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Peso Máximo (kg)</FormLabel>
                <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="stackable" control={form.control} render={({ field }) => (
              <FormItem className="flex items-center justify-between border p-4 rounded-md">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Empilhável</FormLabel>
                  <FormDescription>
                    Pode ter outras prateleiras em cima?
                  </FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="submit">{initialData ? 'Salvar Alterações' : 'Adicionar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ShelfTypeFormDialog;
