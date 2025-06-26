import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const GroupFiltersSection = ({ searchTerm, setSearchTerm, showActive, setShowActive }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 mb-6 bg-muted/40">
      <div className="relative w-full md:max-w-xs mb-3 md:mb-0">
        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="search"
          placeholder="Buscar categoria..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="active" checked={showActive} onCheckedChange={setShowActive} />
        <label htmlFor="active" className="text-sm font-medium">Mostrar Ativos</label>
      </div>
    </div>
  );
};

export default GroupFiltersSection;
