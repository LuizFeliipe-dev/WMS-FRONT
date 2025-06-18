import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Layers,
  Plus,
  Search,
  Edit,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  PowerOff,
  Pencil,
  Power
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
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
import { ShelfType } from '@/services/shelfTypes';
import { useShelfTypesWithFilters } from '@/hooks/useShelfTypesWithFilters';
import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const shelfTypeFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  height: z.coerce.number().positive({ message: 'A altura deve ser maior que 0' }),
  width: z.coerce.number().positive({ message: 'A largura deve ser maior que 0' }),
  depth: z.coerce.number().positive({ message: 'A profundidade deve ser maior que 0' }),
  maxWeight: z.coerce.number().positive({ message: 'O peso máximo deve ser maior que 0' }),
  stackable: z.boolean().default(false),
});

type ShelfTypeFormValues = z.infer<typeof shelfTypeFormSchema>;

const ShelfTypes = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShelfType, setEditingShelfType] = useState<ShelfType | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    shelfType: ShelfType | null;
    action: 'activate' | 'inactivate';
  }>({ open: false, shelfType: null, action: 'activate' });
  const isMobile = useIsMobile();
  const {
    shelfTypes,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    showActive,
    setShowActive,
    createShelfType,
    updateShelfType,
    toggleShelfTypeActive
  } = useShelfTypesWithFilters();

  const form = useForm<ShelfTypeFormValues>({
    resolver: zodResolver(shelfTypeFormSchema),
    defaultValues: {
      name: '',
      height: 0,
      width: 0,
      depth: 0,
      maxWeight: 0,
      stackable: false,
    }
  });

  const handleAddShelfType = () => {
    setEditingShelfType(null);
    form.reset({
      name: '',
      height: 0,
      width: 0,
      depth: 0,
      maxWeight: 0,
      stackable: false,
    });
    setOpenDialog(true);
  };

  const handleEditShelfType = (shelfType: ShelfType) => {
    setEditingShelfType(shelfType);
    form.reset({
      name: shelfType.name,
      height: shelfType.height,
      width: shelfType.width,
      depth: shelfType.depth,
      maxWeight: shelfType.maxWeight,
      stackable: shelfType.stackable,
    });
    setOpenDialog(true);
  };

  const handleToggleActive = async (shelfType: ShelfType) => {
    setConfirmDialog({
      open: true,
      shelfType,
      action: shelfType.active ? 'inactivate' : 'activate'
    });
  };

  const confirmToggleActive = async () => {
    const { shelfType, action } = confirmDialog;
    if (!shelfType) return;

    try {
      await toggleShelfTypeActive(shelfType);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setConfirmDialog({ open: false, shelfType: null, action: 'activate' });
    }
  };

  const onSubmit = async (data: ShelfTypeFormValues) => {
    try {
      const requestData = {
        name: data.name,
        height: data.height,
        width: data.width,
        depth: data.depth,
        maxWeight: data.maxWeight,
        stackable: data.stackable
      };

      if (editingShelfType) {
        await updateShelfType(editingShelfType.id, requestData);
      } else {
        await createShelfType(requestData);
      }
      setOpenDialog(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <AppLayout>
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <header className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Layers className="mr-3 h-6 w-6 text-primary" />
                Tipos de Prateleiras
              </h1>
              <p className="text-gray-500 mt-1">
                Gerencie os tipos de prateleiras utilizados nos armazéns
              </p>
            </div>

            <Button onClick={handleAddShelfType}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo de Prateleira
            </Button>
          </header>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
            <div className="p-4 border-b">
              <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-3'}`}>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Ativos</span>
                  <Switch
                    checked={showActive}
                    onCheckedChange={setShowActive}
                  />
                </div>
              </div>
            </div>

            <div className="responsive-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Dimensões (cm)</TableHead>
                    <TableHead>Peso Máx. (kg)</TableHead>
                    {!isMobile && <TableHead>Empilhável</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 5 : 6} className="text-center py-6">
                        <div className="flex justify-center items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <span>Carregando tipos de prateleiras...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : shelfTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 5 : 6} className="text-center py-6 text-muted-foreground">
                        {searchTerm ? "Nenhum tipo de prateleira encontrado com este termo." : "Nenhum tipo de prateleira cadastrado."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    shelfTypes.map((shelfType) => (
                      <TableRow key={shelfType.id}>
                        <TableCell className="font-medium">{shelfType.name}</TableCell>
                        <TableCell>{shelfType.height} × {shelfType.width} × {shelfType.depth}</TableCell>
                        <TableCell>{shelfType.maxWeight}</TableCell>
                        {!isMobile && (
                          <TableCell>
                            {shelfType.stackable ? (
                              <span className="inline-flex items-center text-green-600">
                                <Check className="h-4 w-4 mr-1" />
                                Sim
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-red-600">
                                <X className="h-4 w-4 mr-1" />
                                Não
                              </span>
                            )}
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge
                            variant={shelfType.active ? "default" : "outline"}
                            className={shelfType.active
                              ? "bg-green-100 hover:bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 hover:bg-gray-100 text-gray-800 border-gray-200"}
                          >
                            {shelfType.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditShelfType(shelfType)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(shelfType)}
                              title={shelfType.active ? 'Inativar tipo de prateleira' : 'Ativar tipo de prateleira'}
                            >
                              {shelfType.active ? (
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingShelfType ? 'Editar Tipo de Prateleira' : 'Adicionar Novo Tipo de Prateleira'}</DialogTitle>
            <DialogDescription>
              {editingShelfType
                ? 'Edite as informações do tipo de prateleira abaixo.'
                : 'Preencha os campos abaixo para adicionar um novo tipo de prateleira.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do tipo de prateleira" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Largura (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profundidade (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="maxWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Máximo (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stackable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Empilhável</FormLabel>
                      <FormDescription>
                        Pode ter outras prateleiras em cima?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">
                  {editingShelfType ? 'Salvar Alterações' : 'Adicionar Tipo de Prateleira'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {confirmDialog.action === 'activate' ? 'ativar' : 'inativar'} o tipo de prateleira "{confirmDialog.shelfType?.name}"?
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
    </AppLayout>
  );
};

export default ShelfTypes;
