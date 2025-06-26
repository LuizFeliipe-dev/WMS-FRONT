import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showActive: boolean;
  setShowActive: (value: boolean) => void;
}

const ZoneFiltersSection = ({
  searchTerm,
  setSearchTerm,
  showActive,
  setShowActive,
}: Props) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div className={`flex-1 flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-3'}`}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Ativos</span>
          <Switch checked={showActive} onCheckedChange={setShowActive} />
        </div>
      </div>
    </div>
  );
};

export default ZoneFiltersSection;
