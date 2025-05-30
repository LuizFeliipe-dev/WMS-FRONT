
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Pencil, 
  Trash2,
  KeyRound
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
}

const UserTable = ({ 
  users, 
  searchTerm, 
  onEdit, 
  onDelete, 
  onManagePermissions 
}: UserTableProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="responsive-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            {!isMobile && <TableHead>Cargo</TableHead>}
            {!isMobile && <TableHead>Departamento</TableHead>}
            <TableHead>Acesso</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 4 : 6} className="text-center py-6 text-muted-foreground">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="max-w-[140px] truncate">{user.email}</TableCell>
                {!isMobile && <TableCell>{user.role}</TableCell>}
                {!isMobile && <TableCell>{user.department}</TableCell>}
                <TableCell className="text-sm">{user.lastAccess}</TableCell>
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
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Anterior</Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm">Próxima</Button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
