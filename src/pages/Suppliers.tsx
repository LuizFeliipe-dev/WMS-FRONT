
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthRequired from '../components/AuthRequired';
import AppLayout from '@/components/AppLayout';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Search,
  Pencil,
  ToggleLeft,
  Loader2,
  Contact,
  Power,
  PowerOff
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSuppliers } from '@/hooks/useSuppliers';
import { ISupplier } from '@/types/supplier';
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { supplierService } from '@/services/suppliers';


const supplierFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

const Suppliers = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const { hasWriteAccess } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    supplier: ISupplier | null;
    action: 'activate' | 'inactivate';
  }>({ open: false, supplier: null, action: 'activate' });

  const {
    suppliers,
    isLoading,
    currentPage,
    setCurrentPage,
    showActive,
    setShowActive,
    searchTerm,
    setSearchTerm,
    createSupplier,
    updateSupplier,
    toggleSupplierStatus,
    loadSuppliers,
  } = useSuppliers();

  const canWriteSuppliers = hasWriteAccess('/supplier');

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleOpenDialog = () => {
    if (!canWriteSuppliers) {
      return;
    }
    setEditingSupplier(null);
    form.reset();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditSupplier = (supplier: any) => {
    if (!canWriteSuppliers) {
      return;
    }
    setEditingSupplier(supplier);
    form.setValue('name', supplier.name);
    setOpenDialog(true);
  };

  const onSubmit = async (values: SupplierFormValues) => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, { name: values.name });
      } else {
        await createSupplier({ name: values.name });
      }
      handleCloseDialog();
      form.reset();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleToggleActive = async (supplier: ISupplier) => {
    setConfirmDialog({
      open: true,
      supplier,
      action: supplier.active ? 'inactivate' : 'activate'
    });
  };

  const confirmToggleActive = async () => {
    const { supplier, action } = confirmDialog;
    if (!supplier) return;
    try {
      await handleConfirmToggleStatus(supplier);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setConfirmDialog({ open: false, supplier: null, action: 'activate' });
    }
  };

  const handleConfirmToggleStatus = async (supplier: ISupplier) => {
    try {
      await toggleSupplierStatus(supplier);
    } catch (error) {

      throw error;
    }
  };

  const handleViewContacts = (supplierId: string) => {
    navigate(`/supplier-contacts?supplierId=${supplierId}`);
  };

  return (
    <AuthRequired requiredRoute="/supplier">
      <AppLayout>
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="mb-6 md:mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-semibold">Fornecedores</h1>
                {canWriteSuppliers && (
                  <Button onClick={handleOpenDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Fornecedor
                  </Button>
                )}
              </div>
              <p className="text-gray-500 mt-1">
                Gerencie seus fornecedores
              </p>
            </header>

            <Form {...form}>
              <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingSupplier ? 'Editar Fornecedor' : 'Criar Fornecedor'}</DialogTitle>
                    <DialogDescription>
                      {editingSupplier ? 'Edite o nome do fornecedor.' : 'Digite o nome para criar um novo fornecedor.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do fornecedor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">{editingSupplier ? 'Atualizar' : 'Salvar'}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </Form>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="flex items-center justify-between p-4 md:p-6 border-b">
                <h2 className="text-lg font-semibold">Lista de Fornecedores</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Buscar fornecedor..."
                      className="pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="active" checked={showActive} onCheckedChange={setShowActive} />
                    <label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Mostrar Ativos
                    </label>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 4} className="text-center py-4">
                          <div className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Carregando fornecedores...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : suppliers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 4} className="text-center py-4">
                          Nenhum fornecedor encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      suppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${supplier.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {supplier.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              {new Date(supplier.createdAt).toLocaleDateString()}
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            <div className="flex space-x-2 justify-end">
                              {canWriteSuppliers && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditSupplier(supplier)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewContacts(supplier.id)}
                                title="Ver contatos"
                              >
                                <Contact className="h-4 w-4" />
                              </Button>
                              {canWriteSuppliers && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleActive(supplier as any as ISupplier)}
                                >
                                  {supplier.active ? (
                                    <PowerOff className="h-4 w-4" />
                                  ) : (
                                    <Power className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink isActive>
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </motion.div>
        </ResponsiveContainer>
      </AppLayout>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {confirmDialog.action === 'activate' ? 'ativar' : 'inativar'} o fornecedor "{confirmDialog.supplier?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleActive}>
              {confirmDialog.action === 'activate' ? 'Ativar' : 'Inativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthRequired>
  );
};

export default Suppliers;
