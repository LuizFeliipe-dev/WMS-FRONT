import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface ItemFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterGroup: string;
  setFilterGroup: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  groups: { id: string; name: string }[];
}

const ItemFilters = ({
  searchTerm,
  setSearchTerm,
  filterGroup,
  setFilterGroup,
  statusFilter,
  setStatusFilter,
  groups,
}: ItemFiltersProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="p-4 border-b">
      <div
        className={`grid gap-4 ${
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
        }`}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar item por código ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger>
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

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ItemFilters;
