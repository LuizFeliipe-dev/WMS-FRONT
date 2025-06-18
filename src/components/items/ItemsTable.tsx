
import { Item } from "@/types/item";
import { Button } from "@/components/ui/button";
import { Edit, ToggleLeft, Loader2, Pencil, Power, PowerOff } from "lucide-react";
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
  filteredCount: number;
  totalCount: number;
}

const ItemsTable = ({
  items,
  isLoading = false,
  onEdit,
  onToggleStatus,
  filteredCount,
  totalCount,
}: ItemsTableProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              {!isMobile && <TableHead>Unidade de Medida</TableHead>}
              {!isMobile && <TableHead>Categoria</TableHead>}
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
                    <span>Carregando produtos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 4 : 6}
                  className="h-24 text-center"
                >
                  Nenhum produto encontrado.
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
                  {!isMobile && <TableCell>{item.group.name}</TableCell>}
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
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleStatus(item)}
                        title={item.active ? "Desativar" : "Ativar"}
                      >
                        {item.active ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
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
          Exibindo {filteredCount} de {totalCount} produtos
        </div>
      </div>
    </>
  );
};

export default ItemsTable;
