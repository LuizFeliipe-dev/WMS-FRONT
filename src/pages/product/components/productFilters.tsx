import { useIsMobile } from '@/hooks/use-mobile';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { groups } from '@/pages/product/hooks/useProducts';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterGroup: string;
  setFilterGroup: (value: string) => void;
  showActive: boolean;
  onShowActiveChange: (value: boolean) => void;
}

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  filterGroup,
  setFilterGroup,
  showActive,
  onShowActiveChange,
}: ProductFiltersProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="p-4 border-b">
      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-3'}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar itens..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={isMobile ? "w-full" : "w-[200px]"}>
          <Select value={filterGroup} onValueChange={setFilterGroup}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os grupos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os grupos</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

export default ProductFilters;
