import { useState, useEffect } from 'react';
import AuthRequired from '../components/AuthRequired';
import AppLayout from '../components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { UserData, UserFormValues } from '@/types/user';
import { UserPermission } from '@/types/auth';
import { Role } from '@/types/role';
import { userService } from '@/services/users';

// Components
import UserHeader from '@/components/users/UserHeader';
import UserSearch from '@/components/users/UserSearch';
import UserTable from '@/components/users/UserTable';
import UserFormDialog from '@/components/users/UserFormDialog';
import UserPermissionsModal from '@/components/users/UserPermissionsModal';
import { Rack } from '@/types/warehouse';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<(UserFormValues & { id: string }) | null>(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user: UserData | null;
    action: 'activate' | 'inactivate';
  }>({ open: false, user: null, action: 'activate' });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const params = {
        take: 10,
        page: currentPage,
        active: showActive,
        name: searchTerm || undefined,
      };

      const res = await userService.getAll(params);

      const mappedData = res.map(user => ({
        ...user,
        role: user.cargo || user.role,
        lastAccess: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR') : 'Não disponível',
        permissions: user.permissions || [],
        permission: user.permission || '',
        roles: user.roles || []
      }));
      setUsers(mappedData);
    } catch (error) {
      toast({
        title: "Erro ao buscar usuários",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, showActive, searchTerm]);

  const handleShowActiveChange = (value: boolean) => {
    setShowActive(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.cargo || user.role,
    });
    setOpenDialog(true);
  };

  const handleToggleActive = async (user: UserData) => {
    setConfirmDialog({
      open: true,
      user,
      action: user.active ? 'inactivate' : 'activate'
    });
  };

  const confirmToggleActive = async () => {
    const { user, action } = confirmDialog;
    if (!user) return;

    try {
      await handleDeleteUser(user.id, user.active);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setConfirmDialog({ open: false, user: null, action: 'activate' });
    }
  };

  const handleDeleteUser = async (userId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await userService.inactivate(userId);
      } else {
        await userService.reactivate(userId);
      }
      toast({
        title: "Sucesso",
        description: "Status do usuário alterado com sucesso.",
      });

      await fetchUsers();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao alterar usuário do rack. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleOpenPermissions = (user: UserData) => {
    setSelectedUser(user);
    setPermissionsModalOpen(true);
  };

  const handleSaveRoles = async (roles: Role[]) => {
    if (selectedUser) {
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            roles
          };
        }
        return user;
      }));

      toast({
        title: "Funções atualizadas",
        description: "As funções do usuário foram atualizadas com sucesso",
      });

      await fetchUsers();
    }
  };

  const handleUserFormSubmit = async (data: UserFormValues & { password: string }) => {
    try {
      if (editingUser) {
        const updatedUser = await userService.update(editingUser.id, {
          name: data.name,
          email: data.email,
          role: data.role,
          password: data.password,
        });

        toast({
          title: "Usuário atualizado",
          description: "As informações do usuário foram atualizadas com sucesso",
        });
      } else {
        const newUser = await userService.create({
          name: data.name,
          email: data.email,
          role: data.role,
          password: data.password,
        });

        toast({
          title: "Usuário adicionado",
          description: "Novo usuário foi adicionado com sucesso",
        });
      }
      setOpenDialog(false);

      await fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      toast({
        title: "Erro ao salvar usuário",
        description: "Não foi possível salvar as informações do usuário",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthRequired>
      <AppLayout>
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <UserHeader onAddUser={handleAddUser} />

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <UserSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                showActive={showActive}
                onShowActiveChange={handleShowActiveChange}
              />

              <UserTable
                users={users}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                searchTerm={searchTerm}
                showActive={showActive}
                onEdit={handleEditUser}
                onDelete={handleToggleActive}
                onManagePermissions={handleOpenPermissions}
                isLoading={isLoading}
              />

              <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja {confirmDialog.action === 'activate' ? 'ativar' : 'inativar'} o usuario "{confirmDialog.user?.name}"?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmToggleActive}>
                      {confirmDialog.action === 'activate' ? 'Ativar' : 'Inativar'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        </ResponsiveContainer>
      </AppLayout>

      <UserFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        editingUser={editingUser}
        onSubmit={handleUserFormSubmit}
      />

      {selectedUser && (
        <UserPermissionsModal
          open={permissionsModalOpen}
          onOpenChange={setPermissionsModalOpen}
          userName={selectedUser.name}
          userId={selectedUser.id}
          initialRoles={selectedUser.roles}
          onSave={handleSaveRoles}
        />
      )}
    </AuthRequired>
  );
};

export default Users;
