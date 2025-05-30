
import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { UserData, UserFormValues } from '@/types/user';
import { UserPermission, PermissionData } from '@/types/auth';

// Components
import UserHeader from '@/components/users/UserHeader';
import UserSearch from '@/components/users/UserSearch';
import UserTable from '@/components/users/UserTable';
import UserFormDialog from '@/components/users/UserFormDialog';
import UserPermissionsModal from '@/components/users/UserPermissionsModal';

// Mock data
const mockUsers: UserData[] = [
  { 
    id: '1', 
    name: 'Usuário Básico', 
    email: 'basic@malldre.com', 
    role: 'Operador',
    department: 'Logística',
    permission: 'initial',
    lastAccess: '2023-08-15 14:30',
    permissions: [
      { module: 'USUARIO', read: true, write: false },
      { module: 'ARMAZEM', read: true, write: false },
      { module: 'INVENTARIO', read: true, write: false },
      { module: 'RELATORIO', read: true, write: false }
    ]
  },
  { 
    id: '2', 
    name: 'Usuário Intermediário', 
    email: 'mid@malldre.com', 
    role: 'Supervisor',
    department: 'Operações',
    permission: 'second',
    lastAccess: '2023-08-16 09:45',
    permissions: [
      { module: 'USUARIO', read: true, write: true },
      { module: 'ARMAZEM', read: true, write: true },
      { module: 'INVENTARIO', read: true, write: false },
      { module: 'RELATORIO', read: true, write: false }
    ]
  },
  { 
    id: '3', 
    name: 'Gerente', 
    email: 'manager@malldre.com', 
    role: 'Administrador',
    department: 'Diretoria',
    permission: 'manager',
    lastAccess: '2023-08-16 11:20',
    permissions: [
      { module: 'USUARIO', read: true, write: true },
      { module: 'ARMAZEM', read: true, write: true },
      { module: 'INVENTARIO', read: true, write: true },
      { module: 'RELATORIO', read: true, write: true }
    ]
  },
  { 
    id: '4', 
    name: 'Ana Silva', 
    email: 'ana.silva@malldre.com', 
    role: 'Operador',
    department: 'Estoque',
    permission: 'initial',
    lastAccess: '2023-08-14 16:05',
    permissions: [
      { module: 'USUARIO', read: false, write: false },
      { module: 'ARMAZEM', read: true, write: false },
      { module: 'INVENTARIO', read: true, write: false },
      { module: 'RELATORIO', read: true, write: false }
    ]
  },
  { 
    id: '5', 
    name: 'Roberto Santos', 
    email: 'roberto.santos@malldre.com', 
    role: 'Supervisor',
    department: 'Expedição',
    permission: 'second',
    lastAccess: '2023-08-15 10:30',
    permissions: [
      { module: 'USUARIO', read: true, write: false },
      { module: 'ARMAZEM', read: true, write: true },
      { module: 'INVENTARIO', read: true, write: true },
      { module: 'RELATORIO', read: true, write: false }
    ]
  },
];

const Users = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<(UserFormValues & { id: string }) | null>(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const { toast } = useToast();

  const handleAddUser = () => {
    setEditingUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      permission: user.permission as UserPermission,
    });
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuário excluído",
      description: "O usuário foi removido com sucesso",
    });
  };

  const handleOpenPermissions = (user: UserData) => {
    setSelectedUser(user);
    setPermissionsModalOpen(true);
  };

  const handleSavePermissions = (permissions: PermissionData[]) => {
    if (selectedUser) {
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            permissions
          };
        }
        return user;
      }));
      
      toast({
        title: "Permissões atualizadas",
        description: "As permissões do usuário foram atualizadas com sucesso",
      });
    }
  };

  const handleUserFormSubmit = (data: UserFormValues) => {
    if (editingUser) {
      setUsers(users.map(user => {
        if (user.id === editingUser.id) {
          return {
            ...user,
            name: data.name,
            email: data.email,
            role: data.role,
            department: data.department,
            permission: data.permission,
          };
        }
        return user;
      }));
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso",
      });
    } else {
      const newUser: UserData = {
        id: (users.length + 1).toString(),
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        permission: data.permission,
        lastAccess: 'Nunca acessou',
        permissions: [
          { module: 'USUARIO', read: false, write: false },
          { module: 'ARMAZEM', read: false, write: false },
          { module: 'INVENTARIO', read: false, write: false },
          { module: 'RELATORIO', read: false, write: false }
        ]
      };
      setUsers([...users, newUser]);
      toast({
        title: "Usuário adicionado",
        description: "Novo usuário foi adicionado com sucesso",
      });
    }
    setOpenDialog(false);
  };

  return (
    <AuthRequired>
      <div className="min-h-screen flex flex-col">
        <Sidebar />
        
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
              />
            </div>
          </motion.div>
        </ResponsiveContainer>
      </div>

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
          initialPermissions={selectedUser.permissions}
          onSave={handleSavePermissions}
        />
      )}
    </AuthRequired>
  );
};

export default Users;
