
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Pencil, 
  Trash2,
  KeyRound,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserData } from '@/types/user';

interface UserTableProps {
  users: UserData[];
  searchTerm: string;
  onEdit: (user: UserData) => void;
  onDelete: (userId: string) => void;
  onManagePermissions: (user: UserData) => void;
  isLoading?: boolean;
}

const UserTable = ({ 
  users, 
  searchTerm, 
  onEdit, 
  onDelete, 
  onManagePermissions,
  isLoading = false
}: UserTableProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cargo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="responsive-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cargo</TableHead>
            {!isMobile && <TableHead>Departamento</TableHead>}
            {!isMobile && <TableHead>Status</TableHead>}
            {!isMobile && <TableHead>Criado em</TableHead>}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 4 : 7} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Carregando usuários...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 4 : 7} className="text-center py-6 text-muted-foreground">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="max-w-[140px] truncate">{user.email}</TableCell>
                <TableCell>{user.cargo || user.role}</TableCell>
                {!isMobile && <TableCell>{user.department}</TableCell>}
                {!isMobile && (
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                )}
                {!isMobile && <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onManagePermissions(user)}
                      title="Gerenciar permissões"
                    >
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <div className="p-4 border-t flex flex-wrap justify-between items-center gap-3">
        <div className="text-sm text-gray-500">
          Exibindo {filteredUsers.length} de {users.length} usuários
        </div>
      </div>
    </div>
  );
};

export default UserTable;
