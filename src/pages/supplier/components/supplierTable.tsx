import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ISupplier } from '@/types/supplier';
import { Button } from '@/components/ui/button';
import { Pencil, Power, PowerOff, Contact, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SupplierTableProps {
  suppliers: ISupplier[];
  isLoading: boolean;
  canWrite: boolean;
  onEdit: (supplier: ISupplier) => void;
  onViewContacts: (id: string) => void;
  onToggleStatus: (supplier: ISupplier) => void;
}

const SupplierTable = ({
  suppliers,
  isLoading,
  canWrite,
  onEdit,
  onViewContacts,
  onToggleStatus,
}: SupplierTableProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="animate-spin w-5 h-5 mr-2" /> Carregando fornecedores...
      </div>
    );
  }

  if (!suppliers.length) {
    return <div className="text-center py-6 text-muted-foreground">Nenhum fornecedor encontrado.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          {!isMobile && <TableHead>Criado em</TableHead>}
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell>{supplier.name}</TableCell>
            <TableCell>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                supplier.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {supplier.active ? 'Ativo' : 'Inativo'}
              </span>
            </TableCell>
            {!isMobile && <TableCell>{new Date(supplier.createdAt).toLocaleDateString()}</TableCell>}
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                {canWrite && (
                  <Button size="icon" variant="ghost" onClick={() => onEdit(supplier)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => onViewContacts(supplier.id)}>
                  <Contact className="w-4 h-4" />
                </Button>
                {canWrite && (
                  <Button size="icon" variant="ghost" onClick={() => onToggleStatus(supplier)}>
                    {supplier.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SupplierTable;
