
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { UserPermissionModule, PermissionData } from "@/types/auth";
import PermissionsTable from "./permissions/PermissionsTable";

interface UserPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  initialPermissions?: PermissionData[];
  onSave: (permissions: PermissionData[]) => void;
}

const defaultModules: UserPermissionModule[] = [
  'USUARIO',
  'ARMAZEM',
  'INVENTARIO',
  'RELATORIO'
];

const UserPermissionsModal = ({
  open,
  onOpenChange,
  userName,
  initialPermissions,
  onSave
}: UserPermissionsModalProps) => {
  const [currentPermissions, setCurrentPermissions] = useState<PermissionData[]>([]);

  const handlePermissionsChange = (permissions: PermissionData[]) => {
    setCurrentPermissions(permissions);
  };

  const handleSave = () => {
    onSave(currentPermissions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Permissões do Usuário
          </DialogTitle>
          <DialogDescription>
            Configure as permissões de acesso para {userName}.
          </DialogDescription>
        </DialogHeader>

        <PermissionsTable
          initialPermissions={initialPermissions}
          defaultModules={defaultModules}
          onChange={handlePermissionsChange}
        />

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Shield className="mr-2 h-4 w-4" />
            Salvar Permissões
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsModal;
