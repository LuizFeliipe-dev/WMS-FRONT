import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IProductGroup } from '@/types/group';
import { IZone } from '@/types/zone';
import { useEffect } from 'react';

const groupSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  parentId: z.string().nullable(),
  zoneId: z.string().nullable(),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

interface GroupFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GroupFormValues) => void;
  editingGroup: IProductGroup | null;
  selectedParentId: string;
  groups: IProductGroup[];
  zones: IZone[];
}

export const GroupFormDialog = ({
  open,
  onClose,
  onSubmit,
  editingGroup,
  selectedParentId,
  groups,
  zones,
}: GroupFormDialogProps) => {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: editingGroup?.name || '',
      parentId: editingGroup?.parentId || (selectedParentId !== 'none' ? selectedParentId : null),
      zoneId: editingGroup?.zoneId || null,
    },
  });

  useEffect(() => {
    form.reset({
      name: editingGroup?.name || '',
      parentId: editingGroup?.parentId || (selectedParentId !== 'none' ? selectedParentId : null),
      zoneId: editingGroup?.zoneId || null,
    });
  }, [editingGroup, selectedParentId]);

  const isEditing = !!editingGroup;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? 'Editar Categoria'
              : selectedParentId !== 'none'
              ? 'Adicionar Subcategoria'
              : 'Adicionar Nova Categoria'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite os dados da categoria abaixo.'
              : 'Preencha os dados para criar uma nova categoria.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              onSubmit({
                name: data.name,
                parentId: data.parentId || null,
                zoneId: data.zoneId || null,
              })
            )}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria Pai</FormLabel>
                  <Select
                    value={field.value || 'none'}
                    onValueChange={(value) =>
                      field.onChange(value === 'none' ? null : value)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
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
                  <Select
                    value={field.value || 'none'}
                    onValueChange={(value) =>
                      field.onChange(value === 'none' ? null : value)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
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

            <Button type="submit" className="w-full">
              {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
