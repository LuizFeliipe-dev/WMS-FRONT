
import React, { useState } from 'react';
import { useLoads, Load } from '@/hooks/useLoads';
import { motion } from 'framer-motion';
import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { EntrySectionStatusBgEnum, EntrySectionStatusColorEnum, EntrySectionStatusEnum } from '@/types/entrySection';

const Tasks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const { loads, total, isLoading, updateLoadStatus } = useLoads(currentPage, pageSize);
  const { toast } = useToast();
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const pendingTasks = loads.filter(load =>
    load.status === 'Received' || load.status === 'Processing'
  );

  const totalPages = Math.ceil(total / pageSize);

  const handleOpenTaskModal = (load: Load) => {
    setSelectedLoad(load);
    setSelectedStatus(load.status);
  };

  const handleCloseModal = () => {
    setSelectedLoad(null);
    setSelectedStatus('');
  };

  const handleSaveStatus = async () => {
    if (selectedLoad && selectedStatus) {
      try {
        setIsUpdating(true);
        await updateLoadStatus(selectedLoad.id, selectedStatus);

        toast({
          title: "Status atualizado",
          description: `O status da carga ${selectedLoad.documentNumber} foi atualizado com sucesso.`
        });

        handleCloseModal();
      } catch (error) {
        console.error('Error updating load status:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar o status da carga. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  return (
    <AppLayout>
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold">Tarefas Pendentes</h1>
            <p className="text-gray-500 mt-1">
              Gerencie as tarefas pendentes (Recebido e Processando) no sistema
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Tarefas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="text-gray-500">Carregando tarefas...</div>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Documento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Pacotes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingTasks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            Não há tarefas pendentes (Recebido/Processando) no momento.
                          </TableCell>
                        </TableRow>
                      ) : (
                        pendingTasks.map((load) => (
                          <TableRow key={load.id}>
                            <TableCell className="font-medium">
                              {load.documentNumber}
                            </TableCell>
                            <TableCell>
                              R$ {load.value.toLocaleString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              {load.package.length} {load.package.length === 1 ? 'pacote' : 'pacotes'}
                            </TableCell>
                            <TableCell>
                              <span className='px-2 py-1 rounded-full text-xs bg-green-50 border' style={{ color: EntrySectionStatusColorEnum[load.status], borderColor: EntrySectionStatusBgEnum[load.status] }}>
                                {EntrySectionStatusEnum[load.status]}
                              </span>
                            </TableCell>
                            <TableCell>
                              {new Date(load.createdAt).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenTaskModal(load)}
                              >
                                Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) {
                                  setCurrentPage(currentPage - 1);
                                }
                              }}
                              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>

                          {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                  isActive={page === currentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) {
                                  setCurrentPage(currentPage + 1);
                                }
                              }}
                              className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </ResponsiveContainer>

      {/* Modal de detalhes da carga */}
      <Dialog open={!!selectedLoad} onOpenChange={() => handleCloseModal()}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Detalhes da Tarefa</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-grow pr-4 max-h-[calc(80vh-120px)] overflow-y-auto">
            {selectedLoad && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>Documento</Label>
                    <div className="font-medium">{selectedLoad.documentNumber}</div>
                  </div>

                  <div className="space-y-1">
                    <Label>Valor</Label>
                    <div className="font-medium">R$ {selectedLoad.value.toLocaleString('pt-BR')}</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={selectedStatus}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Received">Recebido</SelectItem>
                        <SelectItem value="Processing">Processando</SelectItem>
                        <SelectItem value="Pending">Pendente</SelectItem>
                        <SelectItem value="Allocated">Alocado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Seção de Pacotes */}
                <Separator className="my-4" />

                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Pacotes ({selectedLoad.package.length})</h3>

                  <div className="space-y-4">
                    {selectedLoad.package.map((pkg, index) => (
                      <div
                        key={pkg.id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-md"
                      >
                        <div className="space-y-1">
                          <Label>Produto</Label>
                          <div className="font-medium">{pkg.product.name}</div>
                        </div>

                        <div className="space-y-1">
                          <Label>Quantidade</Label>
                          <div className="font-medium">{pkg.quantity}</div>
                        </div>

                        <div className="space-y-1">
                          <Label>Peso (kg)</Label>
                          <div className="font-medium">{pkg.weight}</div>
                        </div>

                        <div className="space-y-1">
                          <Label>Tipo de Embalagem</Label>
                          <div className="font-medium">{pkg.packageType}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 md:col-span-2">
                          <div className="space-y-1">
                            <Label>Largura (cm)</Label>
                            <div className="font-medium">{pkg.width}</div>
                          </div>

                          <div className="space-y-1">
                            <Label>Comprimento (cm)</Label>
                            <div className="font-medium">{pkg.length}</div>
                          </div>

                          <div className="space-y-1">
                            <Label>Altura (cm)</Label>
                            <div className="font-medium">{pkg.height}</div>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <div className="space-y-1">
                            <Label>Descrição</Label>
                            <div className="text-sm text-gray-600">{pkg.product.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="pt-4 border-t mt-4">
            <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleSaveStatus} disabled={isUpdating}>
              {isUpdating ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Tasks;
