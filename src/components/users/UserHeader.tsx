
import { UserPlus, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserHeaderProps {
  onAddUser: () => void;
}

const UserHeader = ({ onAddUser }: UserHeaderProps) => {
  return (
    <header className="flex flex-wrap gap-4 justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <UsersIcon className="mr-3 h-6 w-6 text-primary" />
          Usuários
        </h1>
        <p className="text-gray-500 mt-1">
          Gerencie os usuários do sistema
        </p>
      </div>
      
      <Button onClick={onAddUser}>
        <UserPlus className="mr-2 h-5 w-5" />
        Novo Usuário
      </Button>
    </header>
  );
};

export default UserHeader;
