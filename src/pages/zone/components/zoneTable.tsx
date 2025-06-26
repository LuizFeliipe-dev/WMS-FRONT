import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Power, PowerOff, Pencil, Loader2 } from 'lucide-react';
import { IZone } from '@/types/zone';
import PaginationComponent from '@/components/paginationComponent';

interface Props {
  zones: IZone[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onEdit: (zone: IZone) => void;
  onToggleStatus: (zone: IZone) => void;
  totalPages: number;
}

const ZoneTable = ({
  zones,
  isLoading,
  currentPage,
  setCurrentPage,
  onEdit,
  onToggleStatus,
  totalPages
}: Props) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Carregando zonas...</span>
      </div>
    );
  }

  if (!zones.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Nenhuma zona encontrada.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {zones.map((zone) => (
            <TableRow key={zone.id}>
              <TableCell>{zone.name}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${zone.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {zone.active ? 'Ativo' : 'Inativo'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(zone)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onToggleStatus(zone)}>
                    {zone.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center py-4">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ZoneTable;
