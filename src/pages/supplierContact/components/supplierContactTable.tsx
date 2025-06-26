import { Pencil, Power, PowerOff, Loader2, Contact } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ISupplierContact } from '@/types/supplier';

interface SupplierContactTableProps {
  isMobile: boolean;
  selectedSupplierId: string;
  contacts: ISupplierContact[];
  isLoading: boolean;
  onEdit: (contact: ISupplierContact) => void;
  onToggleStatus: (contact: ISupplierContact) => void;
}

export const SupplierContactTable = ({
  isMobile,
  selectedSupplierId,
  contacts,
  isLoading,
  onEdit,
  onToggleStatus,
}: SupplierContactTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedSupplierId) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Contact className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>Selecione um fornecedor para visualizar os contatos</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            {!isMobile && <TableHead>Criado em</TableHead>}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 5 : 6} className="text-center py-6">
                <div className="flex justify-center items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span>Carregando contatos...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 5 : 6} className="text-center py-6 text-muted-foreground">
                Nenhum contato encontrado.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    contact.active
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}>
                    {contact.active ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                {!isMobile && (
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(contact.createdAt)}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex space-x-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(contact)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onToggleStatus(contact)}>
                      {contact.active ? (
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
  );
};
