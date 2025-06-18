import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Role } from "@/types/role";
import { Checkbox } from "@/components/ui/checkbox";
import { roleService } from '@/services/roles';
import { userService } from '@/services/users';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface UserRole {
  role: Role;
  read: boolean;
  writer: boolean;
}

interface UserPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userId: string;
  initialRoles?: Role[];
  onSave: (roles: Role[]) => void;
}

const UserPermissionsModal = ({
  open,
  onOpenChange,
  userName,
  userId,
  initialRoles = [],
  onSave
}: UserPermissionsModalProps) => {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [initialUserRoles, setInitialUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        const roles = await roleService.getAll();
        const activeRoles = roles.filter(role => role.active);
        setAvailableRoles(activeRoles);

        const initialUserRoles = activeRoles.map(role => {
          const hasRole = initialRoles.some(userRole => userRole.id === role.id);
          const writer = initialRoles.some(userRole => { if (userRole.id === role.id) return userRole.writer; });

          return {
            role,
            read: hasRole,
            writer: writer
          };
        });

        setUserRoles(initialUserRoles);
        setInitialUserRoles(initialUserRoles);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        toast({
          title: "Erro ao buscar funções",
          description: "Não foi possível carregar as funções disponíveis",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchRoles();
    }
  }, [open, initialRoles, toast]);

  const handleReadChange = (roleIndex: number, checked: boolean) => {
    setUserRoles(prev => {
      const updated = [...prev];
      updated[roleIndex] = {
        ...updated[roleIndex],
        read: checked,
        writer: checked ? updated[roleIndex].writer : false
      };
      return updated;
    });
  };

  const handleWriteChange = (roleIndex: number, checked: boolean) => {
    setUserRoles(prev => {
      const updated = [...prev];
      updated[roleIndex] = {
        ...updated[roleIndex],
        read: checked ? true : updated[roleIndex].read,
        writer: checked
      };
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const operations = [];

      for (let i = 0; i < userRoles.length; i++) {
        const currentRole = userRoles[i];
        const initialRole = initialUserRoles[i];

        const hadPermission = initialRole.read;
        const hasPermission = currentRole.read;
        const writerChanged = initialRole.writer !== currentRole.writer;

        if (!hadPermission && hasPermission) {
          operations.push({
            type: 'POST',
            roleId: currentRole.role.id,
            writer: currentRole.writer
          });
        } else if (hadPermission && hasPermission && writerChanged) {
          operations.push({
            type: 'PUT',
            roleId: currentRole.role.id,
            writer: currentRole.writer
          });
        } else if (hadPermission && !hasPermission) {
          operations.push({
            type: 'DELETE',
            roleId: currentRole.role.id
          });
        }
      }

      for (const operation of operations) {
        if (operation.type === 'POST') {
          await userService.saveUserRoles(userId, {
            roles: [{ roleId: operation.roleId, writer: operation.writer }]
          }, 'POST');
        } else if (operation.type === 'PUT') {
          await userService.saveUserRoles(userId, {
            roles: [{ roleId: operation.roleId, writer: operation.writer }]
          }, 'PUT');
        } else if (operation.type === 'DELETE') {
          await userService.deleteUserRole(userId, operation.roleId);
        }
      }

      // Update parent component
      const activeUserRoles = userRoles.filter(userRole => userRole.read);
      const rolesToSave = activeUserRoles.map(userRole => userRole.role);
      onSave(rolesToSave);

      toast({
        title: "Funções atualizadas",
        description: "As funções do usuário foram atualizadas com sucesso",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save user roles:', error);
      toast({
        title: "Erro ao atualizar funções",
        description: "Não foi possível atualizar as funções do usuário",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando funções...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Funções do Usuário
          </DialogTitle>
          <DialogDescription>
            Configure as funções de acesso para {userName}.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="grid grid-cols-[40px_1fr_120px] font-medium text-sm mb-2 px-4 py-2 bg-gray-50 rounded-lg">
            <div></div> {/* Empty header for read column */}
            <div>Função</div>
            <div className="text-center">Edição</div>
          </div>

          <div className="space-y-3 mt-3">
            {userRoles.map((userRole, index) => (
              <div key={userRole.role.id} className="grid grid-cols-[40px_1fr_120px] items-center px-4 py-3 border rounded-md">
                <div className="flex justify-center">
                  <Checkbox
                    id={`read-${userRole.role.id}`}
                    checked={userRole.read}
                    onCheckedChange={(checked) => handleReadChange(index, checked as boolean)}
                  />
                </div>
                <div className="font-medium">{userRole.role.name}</div>
                <div className="flex justify-center">
                  <Checkbox
                    id={`write-${userRole.role.id}`}
                    checked={userRole.writer}
                    onCheckedChange={(checked) => handleWriteChange(index, checked as boolean)}
                  />
                </div>
              </div>
            ))}
          </div>

          {userRoles.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              Nenhuma função disponível encontrada.
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Salvar Funções
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsModal;
