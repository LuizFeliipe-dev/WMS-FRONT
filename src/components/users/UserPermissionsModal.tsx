
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Role } from "@/types/role";
import RoleSelector from "./permissions/RoleSelector";

interface UserPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  initialRoles?: Role[];
  onSave: (roles: Role[]) => void;
}

const UserPermissionsModal = ({
  open,
  onOpenChange,
  userName,
  initialRoles = [],
  onSave
}: UserPermissionsModalProps) => {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(initialRoles);

  const handleRolesChange = (roles: Role[]) => {
    setSelectedRoles(roles);
  };

  const handleSave = () => {
    onSave(selectedRoles);
    onOpenChange(false);
  };

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

        <RoleSelector
          selectedRoles={selectedRoles}
          onChange={handleRolesChange}
        />

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Shield className="mr-2 h-4 w-4" />
            Salvar Funções
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsModal;
