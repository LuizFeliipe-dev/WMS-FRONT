
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserFormValues, IUser } from '@/types/user';

const createUserSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  role: z.string().min(1, { message: 'Digite um cargo' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string().min(1, { message: 'Confirme a senha' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const editUserSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  role: z.string().min(1, { message: 'Digite um cargo' }),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Se uma senha foi fornecida, ela deve ter pelo menos 6 caracteres
  if (data.password && data.password.length > 0) {
    return data.password.length >= 6;
  }
  return true;
}, {
  message: "Senha deve ter pelo menos 6 caracteres",
  path: ["password"],
}).refine((data) => {
  // Se uma senha foi fornecida, a confirmação deve coincidir
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  // Se não há senha, não precisa de confirmação
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: (UserFormValues & { id: string }) | null;
  onSubmit: (data: UserFormValues & { password: string }) => void;
}

const UserFormDialog = ({
  open,
  onOpenChange,
  editingUser,
  onSubmit
}: UserFormDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = editingUser ? editUserSchema : createUserSchema;

  const form = useForm<UserFormValues & { password: string; confirmPassword: string }>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
    }
  });

  useEffect(() => {
    if (open && editingUser) {
      form.reset({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        password: '',
        confirmPassword: '',
      });
    } else if (open && !editingUser) {
      form.reset({
        name: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [open, editingUser, form]);

  const handleSubmit = (data: UserFormValues & { password: string; confirmPassword: string }) => {
    onSubmit({
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password || '',
    });
  };

  const watchedPassword = form.watch('password');
  const watchedConfirmPassword = form.watch('confirmPassword');

  const isFormValid = editingUser
    ? form.formState.isValid
    : form.formState.isValid && watchedPassword.length >= 6 && watchedPassword === watchedConfirmPassword;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {editingUser
              ? 'Edite as informações do usuário abaixo. A senha é opcional.'
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

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o cargo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Senha {editingUser && <span className="text-gray-500 text-sm">(opcional)</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={editingUser ? "Deixe em branco para manter a senha atual" : "Digite a senha"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirmar Senha {editingUser && <span className="text-gray-500 text-sm">(opcional)</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={editingUser ? "Confirme apenas se alterou a senha" : "Confirme a senha"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={!isFormValid}>
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
