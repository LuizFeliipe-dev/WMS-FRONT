import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IShelfType } from '@/types/shelf';
import { Rack } from '@/types/warehouse';
import { IZone } from '@/types/zone';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  shelfTypeId: z.string().min(1, 'Tipo de prateleira é obrigatório'),
  zoneId: z.string().min(1, 'Zona é obrigatória'),
  verticalShelves: z.coerce.number().min(1, 'Mínimo de 1 prateleira vertical'),
  horizontalShelves: z.coerce.number().min(1, 'Mínimo de 1 prateleira horizontal'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Rack | null;
  onSubmit: (values: FormValues) => void;
  shelfTypes: IShelfType[];
  zones: IZone[];
}

const RackFormDialog = ({ open, onOpenChange, initialData, onSubmit, shelfTypes, zones }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          shelfTypeId: initialData.shelfTypeId,
          zoneId: initialData.zoneId || '',
          verticalShelves: initialData.rows,
          horizontalShelves: initialData.columns,
        }
      : {
          name: '',
          shelfTypeId: '',
          zoneId: '',
          verticalShelves: 1,
          horizontalShelves: 1,
        },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Rack' : 'Adicionar Rack'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Atualize os dados do rack abaixo.' : 'Preencha os dados para criar um novo rack.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do rack" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shelfTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Prateleira</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shelfTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zoneId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a zona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {zones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="verticalShelves"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prateleiras Verticais</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormDescription>Número de prateleiras para cima</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="horizontalShelves"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prateleiras Horizontais</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormDescription>Número de prateleiras para o lado</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">{initialData ? 'Salvar' : 'Criar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RackFormDialog;
