
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

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<(UserFormValues & { id: string }) | null>(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await userService.getAll();
        // Map cargo to role for backwards compatibility
        const mappedData = data.map(user => ({
          ...user,
          role: user.cargo || user.role,
          lastAccess: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR') : 'Não disponível'
        }));
        setUsers(mappedData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: "Erro ao buscar usuários",
          description: "Não foi possível carregar a lista de usuários",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

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
      department: user.department,
      permission: user.permission as UserPermission,
    });
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.delete(userId);
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso",
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: "Não foi possível remover o usuário",
        variant: "destructive"
      });
    }
  };

  const handleOpenPermissions = (user: UserData) => {
    setSelectedUser(user);
    setPermissionsModalOpen(true);
  };

  const handleSaveRoles = async (roles: Role[]) => {
    if (selectedUser) {
      try {
        await userService.update(selectedUser.id, {
          ...selectedUser,
          roles
        });

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
      } catch (error) {
        console.error('Failed to update roles:', error);
        toast({
          title: "Erro ao atualizar funções",
          description: "Não foi possível atualizar as funções do usuário",
          variant: "destructive"
        });
      }
    }
  };

  const handleUserFormSubmit = async (data: UserFormValues) => {
    try {
      if (editingUser) {
        const updatedUser = await userService.update(editingUser.id, {
          name: data.name,
          email: data.email,
          role: data.role,
          department: data.department,
          permission: data.permission,
        });
        
        // Map response data for display
        const mappedUser = {
          ...updatedUser,
          role: updatedUser.cargo || updatedUser.role,
          lastAccess: updatedUser.updatedAt ? new Date(updatedUser.updatedAt).toLocaleDateString('pt-BR') : 'Não disponível'
        };
        
        setUsers(users.map(user => {
          if (user.id === editingUser.id) {
            return mappedUser;
          }
          return user;
        }));
        
        toast({
          title: "Usuário atualizado",
          description: "As informações do usuário foram atualizadas com sucesso",
        });
      } else {
        const newUser = await userService.create({
          name: data.name,
          email: data.email,
          role: data.role,
          department: data.department,
          permission: data.permission,
        });
        
        // Map response data for display
        const mappedUser = {
          ...newUser,
          role: newUser.cargo || newUser.role,
          lastAccess: newUser.updatedAt ? new Date(newUser.updatedAt).toLocaleDateString('pt-BR') : 'Não disponível'
        };
        
        setUsers([...users, mappedUser]);
        
        toast({
          title: "Usuário adicionado",
          description: "Novo usuário foi adicionado com sucesso",
        });
      }
      setOpenDialog(false);
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
            {/* Header */}
            <UserHeader onAddUser={handleAddUser} />
            
            {/* Main content */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              {/* Search and filters */}
              <UserSearch 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
              />
              
              {/* User table */}
              <UserTable 
                users={users}
                searchTerm={searchTerm}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onManagePermissions={handleOpenPermissions}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        </ResponsiveContainer>
      </AppLayout>

      {/* User Form Dialog */}
      <UserFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        editingUser={editingUser}
        onSubmit={handleUserFormSubmit}
      />

      {/* Permissions Modal */}
      {selectedUser && (
        <UserPermissionsModal
          open={permissionsModalOpen}
          onOpenChange={setPermissionsModalOpen}
          userName={selectedUser.name}
          initialRoles={selectedUser.roles}
          onSave={handleSaveRoles}
        />
      )}
    </AuthRequired>
  );
};

export default Users;
