
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserFormValues, UserData } from '@/types/user';

export const userFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  role: z.string().min(1, { message: 'Selecione um cargo' }),
  department: z.string().min(1, { message: 'Selecione um departamento' }),
  permission: z.enum(['initial', 'second', 'manager'], { 
    required_error: 'Selecione um nível de permissão' 
  }),
});

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: (UserFormValues & { id: string }) | null;
  onSubmit: (data: UserFormValues) => void;
}

const UserFormDialog = ({ 
  open, 
  onOpenChange, 
  editingUser, 
  onSubmit 
}: UserFormDialogProps) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      department: '',
      permission: 'initial',
    }
  });

  // Reset form when editing user changes
  useState(() => {
    if (open && editingUser) {
      form.reset({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        department: editingUser.department,
        permission: editingUser.permission,
      });
    } else if (open && !editingUser) {
      form.reset({
        name: '',
        email: '',
        role: '',
        department: '',
        permission: 'initial',
      });
    }
  });

  const handleSubmit = (data: UserFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {editingUser 
              ? 'Edite as informações do usuário abaixo.' 
              : 'Preencha os campos abaixo para adicionar um novo usuário.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Operador">Operador</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Logística">Logística</SelectItem>
                        <SelectItem value="Operações">Operações</SelectItem>
                        <SelectItem value="Estoque">Estoque</SelectItem>
                        <SelectItem value="Expedição">Expedição</SelectItem>
                        <SelectItem value="Diretoria">Diretoria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="permission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Permissão</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um nível" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="initial">Básico (Visualização)</SelectItem>
                      <SelectItem value="second">Intermediário (Edição)</SelectItem>
                      <SelectItem value="manager">Administrador (Total)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">
                <Shield className="mr-2 h-4 w-4" />
                {editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
