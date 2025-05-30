
import { UserPermissionModule } from "@/types/auth";
import { Checkbox } from "@/components/ui/checkbox";

interface PermissionRowProps {
  module: UserPermissionModule;
  read: boolean;
  write: boolean;
  onReadChange: (checked: boolean) => void;
  onWriteChange: (checked: boolean) => void;
}

const PermissionRow = ({
  module,
  read,
  write,
  onReadChange,
  onWriteChange
}: PermissionRowProps) => {
  return (
    <div className="grid grid-cols-3 items-center px-4 py-3 border rounded-md">
      <div className="font-medium">{module}</div>
      <div className="flex justify-center">
        <Checkbox 
          id={`read-${module}`}
          checked={read}
          onCheckedChange={(checked) => onReadChange(checked as boolean)}
        />
      </div>
      <div className="flex justify-center">
        <Checkbox 
          id={`write-${module}`}
          checked={write}
          onCheckedChange={(checked) => onWriteChange(checked as boolean)}
        />
      </div>
    </div>
  );
};

export default PermissionRow;
