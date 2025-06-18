import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Target,
  Plus,
  Search,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  Power,
  PowerOff,
  Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
import { useZonesWithFilters } from '@/hooks/useZonesWithFilters';
import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { IZone } from '@/types/zone';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


const zoneFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
});

type ZoneFormValues = z.infer<typeof zoneFormSchema>;

const Zones = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);
  const isMobile = useIsMobile();
  const {
    zones,
    isLoading,
    searchTerm,
    setSearchTerm,
    showActive,
    setShowActive,
    currentPage,
    setCurrentPage,
    createZone,
    updateZone,
    toggleZoneStatus
  } = useZonesWithFilters();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    zone: IZone | null;
    action: 'activate' | 'inactivate';
  }>({ open: false, zone: null, action: 'activate' });
  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneFormSchema),
    defaultValues: {
      name: '',
    }
  });

  const handleAddZone = () => {
    setEditingZone(null);
    form.reset({
      name: '',
    });
    setOpenDialog(true);
  };

  const handleEditZone = (zone: any) => {
    setEditingZone(zone);
    form.reset({
      name: zone.name,
    });
    setOpenDialog(true);
  };

  const handleToggleActive = async (zone: IZone) => {
    setConfirmDialog({
      open: true,
      zone,
      action: zone.active ? 'inactivate' : 'activate'
    });
  };

  const confirmToggleActive = async () => {
    const { zone, action } = confirmDialog;
    if (!zone) return;

    try {
      await toggleZoneStatus(zone);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setConfirmDialog({ open: false, zone: null, action: 'activate' });
    }
  };

  const onSubmit = async (data: ZoneFormValues) => {
    try {
      if (editingZone) {
        await updateZone(editingZone.id, {
          name: data.name,
        });
      } else {
        await createZone({
          name: data.name,
        });
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
                <Target className="mr-3 h-6 w-6 text-primary" />
                Zonas
              </h1>
              <p className="text-gray-500 mt-1">
                Gerencie as zonas do armazém
              </p>
            </div>

            <Button onClick={handleAddZone}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Zona
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
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>Carregando zonas...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : zones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                        {searchTerm ?
                          "Nenhuma zona encontrada com os filtros aplicados." :
                          "Nenhuma zona encontrada."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    zones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            zone.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {zone.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditZone(zone)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(zone)}
                              title={zone.active ? 'Inativar zona' : 'Ativar zona'}
                            >
                              {zone.active ? (
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

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {confirmDialog.action === 'activate' ? 'ativar' : 'inativar'} a zona "{confirmDialog.zone?.name}"?
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingZone ? 'Editar Zona' : 'Adicionar Nova Zona'}</DialogTitle>
            <DialogDescription>
              {editingZone
                ? 'Edite as informações da zona abaixo.'
                : 'Preencha os campos abaixo para adicionar uma nova zona.'}
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
                      <Input placeholder="Nome da zona" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">
                  {editingZone ? 'Salvar Alterações' : 'Cadastrar Zona'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Zones;
