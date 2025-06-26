import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { IZone } from '@/types/zone';
import { useEffect } from 'react';

const zoneFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres')
});

type ZoneFormValues = z.infer<typeof zoneFormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone: IZone | null;
  onSave: (name: string) => void;
}

const ZoneFormDialog = ({ open, onOpenChange, zone, onSave }: Props) => {
  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneFormSchema),
    defaultValues: { name: zone?.name || '' }
  });

   useEffect(() => {
      if (zone) {
        form.reset({
          name: zone.name,
        });
      } else {
        form.reset({
          name: '',
        });
      }
    }, [zone, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{zone ? 'Editar Zona' : 'Nova Zona'}</DialogTitle>
          <DialogDescription>
            {zone ? 'Edite o nome da zona abaixo' : 'Preencha o nome da nova zona'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(({ name }) => onSave(name))} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da zona" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {zone ? 'Salvar Alterações' : 'Cadastrar Zona'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ZoneFormDialog;
