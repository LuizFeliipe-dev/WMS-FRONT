
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ISupplier } from '@/types/supplier';

interface FiltersSectionProps {
  isMobile: boolean;
  suppliers: ISupplier[];
  isLoadingSuppliers: boolean;
  selectedSupplierId: string;
  setSelectedSupplierId: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showActive: boolean;
  setShowActive: (checked: boolean) => void;
}

export const SupplierContactFiltersSection = ({
  isMobile,
  suppliers,
  isLoadingSuppliers,
  selectedSupplierId,
  setSelectedSupplierId,
  searchTerm,
  setSearchTerm,
  showActive,
  setShowActive,
}: FiltersSectionProps) => {
  return (
    <div className="p-4 md:p-6 border-b">
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        <div>
          <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um fornecedor..." />
            </SelectTrigger>
            <SelectContent>
              {isLoadingSuppliers ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : (
                suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedSupplierId && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar contatos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="show-active" checked={showActive} onCheckedChange={setShowActive} />
              <label htmlFor="show-active" className="text-sm font-medium">
                Ativos
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
