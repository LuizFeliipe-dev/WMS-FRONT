
import { Item } from "@/types/item";
import { Button } from "@/components/ui/button";
import { Edit, ToggleLeft, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { groups } from "@/hooks/useItems";

interface ItemsTableProps {
  items: Item[];
  isLoading?: boolean;
  onEdit: (item: Item) => void;
  onToggleStatus: (item: Item) => void;
  onDelete: (item: Item) => void;
  filteredCount: number;
  totalCount: number;
}

const ItemsTable = ({
  items,
  isLoading = false,
  onEdit,
  onToggleStatus,
  onDelete,
  filteredCount,
  totalCount,
}: ItemsTableProps) => {
  const isMobile = useIsMobile();

  const getGroupName = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    return group?.name || 'Grupo não encontrado';
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              {!isMobile && <TableHead>Unidade</TableHead>}
              {!isMobile && <TableHead>Grupo</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 4 : 6}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Carregando itens...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 4 : 6}
                  className="h-24 text-center"
                >
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {item.name}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.description}
                  </TableCell>
                  {!isMobile && <TableCell>{item.measurementUnit}</TableCell>}
                  {!isMobile && <TableCell>{getGroupName(item.productGroupId)}</TableCell>}
                  <TableCell>
                    <Badge 
                      variant={item.active ? "default" : "outline"}
                      className={item.active 
                        ? "bg-green-100 hover:bg-green-100 text-green-800 border-green-200" 
                        : "bg-gray-100 hover:bg-gray-100 text-gray-800 border-gray-200"}
                    >
                      {item.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEdit(item)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => onToggleStatus(item)}
                        title={item.active ? "Desativar" : "Ativar"}
                      >
                        <ToggleLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(item)}
                        title="Excluir"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Exibindo {filteredCount} de {totalCount} itens
        </div>
      </div>
    </>
  );
};

export default ItemsTable;
