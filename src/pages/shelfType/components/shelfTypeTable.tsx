// 📁 app/(dashboard)/shelf-types/ShelfTypeTable.tsx
import { Check, Loader2, Pencil, Power, PowerOff, Search, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { IShelfType } from '@/types/shelf';

interface Props {
  data: IShelfType[];
  isLoading: boolean;
  onEdit: (item: IShelfType) => void;
  onToggleStatus: (item: IShelfType) => void;
}

const ShelfTypeTable = ({
  data,
  isLoading,
  onEdit,
  onToggleStatus,
}: Props) => {
  return (
    <div className="responsive-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Dimensões (cm)</TableHead>
            <TableHead>Peso Máx.</TableHead>
            <TableHead>Empilhável</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <div className="flex justify-center items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Carregando...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.height} × {item.width} × {item.depth}</TableCell>
                <TableCell>{item.maxWeight}</TableCell>
                <TableCell>
                  {item.stackable ? (
                    <span className="inline-flex items-center text-green-600">
                      <Check className="w-4 h-4 mr-1" /> Sim
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-600">
                      <X className="w-4 h-4 mr-1" /> Não
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.active ? 'default' : 'outline'}
                    className={item.active
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'}
                  >
                    {item.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title={item.active ? 'Inativar' : 'Ativar'}
                      onClick={() => onToggleStatus(item)}
                    >
                      {item.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShelfTypeTable;
