import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Loader2, Power, PowerOff, Pencil } from 'lucide-react';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import AppLayout from '@/components/AppLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useZones } from '@/hooks/useZones';
import { useRacksWithFilters } from '@/hooks/useRacksWithFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Rack } from '@/types/warehouse';
import { shelfTypeService, ShelfType } from '@/services/shelfTypes';
import { useToast } from '@/hooks/use-toast';

const rackFormSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  shelfTypeId: z.string().min(1, { message: 'Selecione um tipo de prateleira' }),
  zoneId: z.string().min(1, { message: 'Selecione uma zona' }),
  verticalShelves: z.coerce.number().int().min(1, { message: 'Deve ter pelo menos 1 prateleira para cima' }),
  horizontalShelves: z.coerce.number().int().min(1, { message: 'Deve ter pelo menos 1 prateleira para o lado' }),
});

type RackFormValues = z.infer<typeof rackFormSchema>;

const RacksPage = () => {
  const [shelfTypes, setShelfTypes] = useState<ShelfType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRack, setEditingRack] = useState<Rack | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    rack: Rack | null;
    action: 'activate' | 'inactivate';
  }>({ open: false, rack: null, action: 'activate' });
  const isMobile = useIsMobile();
  const { zones, isLoading: zonesLoading } = useZones();
  const { toast } = useToast();

  const {
    racks,
    isLoading,
    currentPage,
    setCurrentPage,
    showActive,
    setShowActive,
    searchTerm,
    setSearchTerm,
    createRack,
    updateRack,
    toggleRackStatus
  } = useRacksWithFilters();

  const form = useForm<RackFormValues>({
    resolver: zodResolver(rackFormSchema),
    defaultValues: {
      name: '',
      shelfTypeId: '',
      zoneId: '',
      verticalShelves: 1,
      horizontalShelves: 1,
    }
  });

  useEffect(() => {
    const fetchShelfTypes = async () => {
      try {
        const shelfTypesData = await shelfTypeService.getAll();
        setShelfTypes(shelfTypesData);
      } catch (error) {
        console.error('Failed to fetch shelf types:', error);
      }
    };

    fetchShelfTypes();
  }, []);

  const onSubmit = async (data: RackFormValues) => {
    try {
      const requestData = {
        shelfTypeId: data.shelfTypeId,
        name: data.name,
        columns: data.horizontalShelves,
        rows: data.verticalShelves,
      };

      if (editingRack) {
        await updateRack(editingRack.id, requestData);
      } else {
        await createRack(requestData);
      }

      setOpenDialog(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAddRack = () => {
    setEditingRack(null);
    form.reset({
      name: '',
      shelfTypeId: '',
      zoneId: '',
      verticalShelves: 1,
      horizontalShelves: 1,
    });
    setOpenDialog(true);
  };

  const handleEditRack = (rack: Rack) => {
    console.log('Editing rack:', rack);
    setEditingRack(rack);
    form.reset({
      name: rack.name,
      shelfTypeId: rack.shelfTypeId,
      zoneId: rack.zoneId || '',
      verticalShelves: rack.rows,
      horizontalShelves: rack.columns,
    });
    setOpenDialog(true);
  };

  const handleToggleActive = async (rack: Rack) => {
    setConfirmDialog({
      open: true,
      rack,
      action: rack.active ? 'inactivate' : 'activate'
    });
  };

  const confirmToggleActive = async () => {
    const { rack, action } = confirmDialog;
    if (!rack) return;

    try {
      await toggleRackStatus(rack.id, rack.active);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setConfirmDialog({ open: false, rack: null, action: 'activate' });
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
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Racks</h1>
            <Button onClick={handleAddRack}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Rack
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Lista de Racks</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nome..."
                    className="pl-8"
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
            </CardHeader>
            <CardContent>
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 4 : 5} className="text-center py-8">
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Carregando racks...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : racks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 4 : 5} className="text-center py-6 text-muted-foreground">
                          Nenhum rack encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      racks.map((rack) => (
                        <TableRow key={rack.id}>
                          <TableCell className="font-medium">{rack.name}</TableCell>
                          <TableCell>{rack.shelfType?.name || 'Não definido'}</TableCell>
                          <TableCell>{rack.columns} × {rack.rows}</TableCell>
                          {!isMobile && (
                            <TableCell>
                              <Badge
                                variant={rack.active ? "default" : "outline"}
                                className={rack.active
                                  ? "bg-green-100 hover:bg-green-100 text-green-800 border-green-200"
                                  : "bg-gray-100 hover:bg-gray-100 text-gray-800 border-gray-200"}
                              >
                                {rack.active ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRack(rack)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleActive(rack)}
                              >
                                {rack.active ? (
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
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editingRack ? 'Editar Rack' : 'Adicionar Novo Rack'}
              </DialogTitle>
              <DialogDescription>
                {editingRack
                  ? 'Edite as informações do rack abaixo.'
                  : 'Preencha os campos abaixo para adicionar um novo rack.'}
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
                        <Input placeholder="Nome do rack" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shelfTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Prateleira</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shelfTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zoneId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zona</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a zona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {zonesLoading ? (
                              <SelectItem value="" disabled>
                                Carregando zonas...
                              </SelectItem>
                            ) : (
                              zones.map((zone) => (
                                <SelectItem key={zone.id} value={zone.id}>
                                  {zone.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="verticalShelves"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prateleiras Verticais</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Número de prateleiras para cima
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="horizontalShelves"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prateleiras Horizontais</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Número de prateleiras para o lado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {editingRack ? 'Salvar Alterações' : 'Adicionar Rack'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja {confirmDialog.action === 'activate' ? 'ativar' : 'inativar'} o rack "{confirmDialog.rack?.name}"?
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
      </ResponsiveContainer>
    </AppLayout>
  );
};

export default RacksPage;
