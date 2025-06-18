
import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import AppLayout from '@/components/AppLayout';
import { motion } from 'framer-motion';
import { useGroups } from '@/hooks/useGroups';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useZones } from '@/hooks/useZones';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, Edit, ChevronRight, ChevronDown, Package, Power, PowerOff } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { IProductGroup } from '@/types/group';

const groupFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  parentId: z.string().optional(),
  zoneId: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

const Groups = () => {
  const {
    groups,
    filteredGroups,
    isLoading,
    searchTerm,
    setSearchTerm,
    showActive,
    setShowActive,
    currentPage,
    setCurrentPage,
    openDialog,
    setOpenDialog,
    editingGroup,
    expandedGroups,
    handleAddGroup,
    handleEditGroup,
    handleDeleteGroup,
    handleToggleActiveGroup,
    toggleExpanded,
    onSubmitGroup
  } = useGroups();

  const { zones } = useZones();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    group: IProductGroup | null;
    action: 'activate' | 'inactivate';
  }>({ open: false, group: null, action: 'activate' });

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: '',
      parentId: 'none',
      zoneId: 'none',
    },
  });

  const handleAddSubCategory = (parentGroup: any) => {
    setSelectedParentId(parentGroup.id);
    setOpenDialog(true);
    form.reset({
      name: '',
      parentId: parentGroup.id,
      zoneId: parentGroup.zoneId,
    });
  };

  const handleAddGroupClick = () => {
    setSelectedParentId(null);
    handleAddGroup();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedParentId(null);
    form.reset({
      name: '',
      parentId: 'none',
      zoneId: 'none',
    });
  };

  const handleToggleActive = async (group: IProductGroup) => {
    setConfirmDialog({
      open: true,
      group,
      action: group.active ? 'inactivate' : 'activate'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AuthRequired>
      <AppLayout>
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold flex items-center">
                  <Package className="mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
                  Categorias de Produtos
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie as categorias de produtos do sistema
                </p>
              </div>

              <Button onClick={handleAddGroupClick} className={isMobile ? "w-full mt-4 md:mt-0" : ""}>
                <Plus className="mr-2 h-5 w-5" />
                Nova Categoria
              </Button>
            </header>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 border-b">
                <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-3'}`}>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Buscar categorias..."
                      className="pl-10"
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

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Atualizado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          Carregando categorias...
                        </TableCell>
                      </TableRow>
                    ) : filteredGroups.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          Nenhuma categoria encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {group.children && group.children.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="mr-2"
                                  onClick={() => toggleExpanded(group.id)}
                                >
                                  {expandedGroups[group.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </Button>
                              )}
                              {group.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              group.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {group.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">{formatDate(group.createdAt!)}</TableCell>
                          <TableCell className="text-sm text-gray-500">{formatDate(group.updatedAt!)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex space-x-2 justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleAddSubCategory(group)}
                                title="Adicionar subcategoria"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditGroup(group)}
                                title="Editar categoria"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleActive(group)}
                                title={group.active ? "Inativar categoria" : "Ativar categoria"}
                              >
                                {group.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
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
      </AppLayout>

      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? 'Editar Categoria' : selectedParentId ? 'Adicionar Subcategoria' : 'Adicionar Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              {editingGroup
                ? 'Edite as informações da categoria abaixo.'
                : selectedParentId
                ? 'Preencha os campos abaixo para adicionar uma nova subcategoria.'
                : 'Preencha os campos abaixo para adicionar uma nova categoria.'
              }
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitGroup)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria Pai</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Nenhuma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
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
                          <SelectValue placeholder="Nenhuma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        {zones?.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingGroup ? 'Salvar Alterações' : 'Cadastrar Categoria'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

       <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {confirmDialog.action === 'activate' ? 'ativar' : 'inativar'} a categoria de produto "{confirmDialog.group?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleToggleActiveGroup(confirmDialog.group)}>
              {confirmDialog.action === 'activate' ? 'Ativar' : 'Inativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthRequired>
  );
};

export default Groups;
