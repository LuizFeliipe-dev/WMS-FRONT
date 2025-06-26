import { Pencil, Power, PowerOff } from 'lucide-react';
import { Rack } from '@/types/warehouse';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Props {
  racks: Rack[];
  isLoading: boolean;
  isMobile: boolean;
  onEdit: (rack: Rack) => void;
  onToggleActive: (rack: Rack) => void;
}

const RackTable = ({ racks, isLoading, isMobile, onEdit, onToggleActive }: Props) => {
  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Carregando racks...
      </div>
    );
  }

  if (racks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        Nenhum rack encontrado.
      </div>
    );
  }

  return (
    <div className="responsive-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo de Prateleira</TableHead>
            <TableHead>Dimensões (cm)</TableHead>
            {!isMobile && <TableHead>Status</TableHead>}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {racks.map((rack) => (
            <TableRow key={rack.id}>
              <TableCell>{rack.name}</TableCell>
              <TableCell>{rack.shelfType?.name || '-'}</TableCell>
              <TableCell>{rack.columns} × {rack.rows}</TableCell>
              {!isMobile && (
                <TableCell>
                  <Badge
                    variant={rack.active ? 'default' : 'outline'}
                    className={rack.active
                      ? 'bg-green-100 hover:bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 hover:bg-gray-100 text-gray-800 border-gray-200'}
                  >
                    {rack.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* <Button variant="ghost" size="sm" onClick={() => onEdit(rack)}>
                    <Pencil className="h-4 w-4" />
                  </Button> */}
                  <Button variant="ghost" size="sm" onClick={() => onToggleActive(rack)}>
                    {rack.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RackTable;
