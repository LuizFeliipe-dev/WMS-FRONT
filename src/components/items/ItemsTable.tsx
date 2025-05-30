
import { Item } from "@/types/item";
import { Button } from "@/components/ui/button";
import { Edit, ToggleLeft } from "lucide-react";
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

interface ItemsTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onToggleStatus: (item: Item) => void;
  filteredCount: number;
  totalCount: number;
}

const ItemsTable = ({
  items,
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
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Nome</TableHead>
              {!isMobile && <TableHead>Grupo</TableHead>}
              {!isMobile && <TableHead>Fornecedor</TableHead>}
              <TableHead>Estoque</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 5 : 7}
                  className="h-24 text-center"
                >
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{item.code}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.name}
                  </TableCell>
                  {!isMobile && <TableCell>{item.groupName}</TableCell>}
                  {!isMobile && <TableCell>{item.supplierName}</TableCell>}
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    {typeof item.price === "number"
                      ? `R$ ${item.price.toFixed(2)}`
                      : item.price}
                  </TableCell>
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
