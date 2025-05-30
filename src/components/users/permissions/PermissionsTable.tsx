
import { useState, useEffect } from 'react';
import { UserPermissionModule, PermissionData } from "@/types/auth";
import PermissionRow from "./PermissionRow";

interface PermissionsTableProps {
  initialPermissions?: PermissionData[];
  defaultModules: UserPermissionModule[];
  onChange: (permissions: PermissionData[]) => void;
}

const PermissionsTable = ({
  initialPermissions,
  defaultModules,
  onChange
}: PermissionsTableProps) => {
  const [permissions, setPermissions] = useState<PermissionData[]>([]);

  useEffect(() => {
    // Initialize permissions with defaults or provided data
    if (initialPermissions && initialPermissions.length > 0) {
      setPermissions(initialPermissions);
    } else {
      setPermissions(defaultModules.map(module => ({
        module,
        read: false,
        write: false
      })));
    }
  }, [initialPermissions, defaultModules]);

  useEffect(() => {
    // Notify parent component when permissions change
    onChange(permissions);
  }, [permissions, onChange]);

  const handleReadChange = (moduleIndex: number, checked: boolean) => {
    setPermissions(prev => {
      const updated = [...prev];
      updated[moduleIndex] = {
        ...updated[moduleIndex],
        read: checked,
        // If read is unchecked, write must also be unchecked
        write: checked ? updated[moduleIndex].write : false
      };
      return updated;
    });
  };

  const handleWriteChange = (moduleIndex: number, checked: boolean) => {
    setPermissions(prev => {
      const updated = [...prev];
      updated[moduleIndex] = {
        ...updated[moduleIndex],
        // If write is checked, read must also be checked
        read: checked ? true : updated[moduleIndex].read,
        write: checked
      };
      return updated;
    });
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 font-medium text-sm mb-2 px-4 py-2 bg-gray-50 rounded-lg">
        <div>Módulo</div>
        <div className="text-center">Leitura</div>
        <div className="text-center">Escrita</div>
      </div>

      <div className="space-y-3 mt-3">
        {permissions.map((permission, index) => (
          <PermissionRow
            key={permission.module}
            module={permission.module}
            read={permission.read}
            write={permission.write}
            onReadChange={(checked) => handleReadChange(index, checked)}
            onWriteChange={(checked) => handleWriteChange(index, checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default PermissionsTable;
