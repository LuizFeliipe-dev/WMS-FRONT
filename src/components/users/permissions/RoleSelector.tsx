
import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { roleService } from '@/services/roles';
import { IRole } from '@/types/role';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface RoleSelectorProps {
  selectedRoles: IRole[];
  onChange: (roles: IRole[]) => void;
}

const RoleSelector = ({ selectedRoles, onChange }: RoleSelectorProps) => {
  const [availableRoles, setAvailableRoles] = useState<IRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        const roles = await roleService.getAll();
        setAvailableRoles(roles.filter(role => role.active));
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

    fetchRoles();
  }, [toast]);

  const handleRoleChange = (role: IRole, checked: boolean) => {
    if (checked) {
      onChange([...selectedRoles, role]);
    } else {
      onChange(selectedRoles.filter(r => r.id !== role.id));
    }
  };

  const isRoleSelected = (roleId: string) => {
    return selectedRoles.some(role => role.id === roleId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Carregando funções...</span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="font-medium text-sm mb-4 px-4 py-2 bg-gray-50 rounded-lg">
        Selecione as funções do usuário
      </div>

      <div className="space-y-3 mt-3">
        {availableRoles.map((role) => (
          <div key={role.id} className="flex items-center space-x-3 px-4 py-3 border rounded-md">
            <Checkbox
              id={`role-${role.id}`}
              checked={isRoleSelected(role.id)}
              onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
            />
            <label
              htmlFor={`role-${role.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
            >
              {role.name}
            </label>
          </div>
        ))}
      </div>

      {availableRoles.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          Nenhuma função disponível encontrada.
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
