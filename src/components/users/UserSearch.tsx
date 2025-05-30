
import { useIsMobile } from '@/hooks/use-mobile';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const UserSearch = ({ searchTerm, onSearchChange }: UserSearchProps) => {
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
        
        <div className={isMobile ? "w-full" : "w-[200px]"}>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os departamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os departamentos</SelectItem>
              <SelectItem value="logistica">Logística</SelectItem>
              <SelectItem value="operacoes">Operações</SelectItem>
              <SelectItem value="estoque">Estoque</SelectItem>
              <SelectItem value="expedicao">Expedição</SelectItem>
              <SelectItem value="diretoria">Diretoria</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
