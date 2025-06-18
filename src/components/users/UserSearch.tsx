
import { useIsMobile } from '@/hooks/use-mobile';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showActive: boolean;
  onShowActiveChange: (value: boolean) => void;
}

const UserSearch = ({ 
  searchTerm, 
  onSearchChange, 
  showActive, 
  onShowActiveChange
}: UserSearchProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="p-4 border-b">
      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-3'}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar usuários..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Ativos</span>
          <Switch
            checked={showActive}
            onCheckedChange={onShowActiveChange}
          />
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
