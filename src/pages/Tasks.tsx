
import React, { useState, useEffect } from 'react';
import { useEntries, Entry } from '@/hooks/useEntries';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import TaskItem from '@/components/dashboard/TaskItem';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const Tasks = () => {
  const { entries, updateEntryStatus } = useEntries();
  const { toast } = useToast();
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Entry['status'] | ''>('');
  
  // Filter entries that don't have "allocated" status
  const pendingEntries = entries.filter(entry => entry.status !== 'allocated');

  const handleOpenTaskModal = (entry: Entry) => {
    setSelectedEntry(entry);
    setSelectedStatus(entry.status);
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
    setSelectedStatus('');
  };

  const handleSaveStatus = () => {
    if (selectedEntry && selectedStatus) {
      updateEntryStatus(selectedEntry.id, selectedStatus);
      toast({
        title: "Status atualizado",
        description: `O status da entrada #${selectedEntry.orderNumber} foi atualizado com sucesso.`
      });
      handleCloseModal();
    }
  };

  // Create a handler that explicitly handles the type conversion
  const handleStatusChange = (value: string) => {
    // Explicitly cast the value to the Entry['status'] type
    setSelectedStatus(value as Entry['status']);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold">Tarefas Pendentes</h1>
            <p className="text-gray-500 mt-1">
              Gerencie suas tarefas pendentes no sistema
            </p>
          </header>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="space-y-3">
              {pendingEntries.length > 0 ? (
                pendingEntries.map(entry => (
                  <TaskItem 
                    key={entry.id}
                    title={`Entrada de mercadorias - Pedido #${entry.orderNumber}`}
                    dueDate={entry.date}
                    status={entry.status}
                    to={`/entry?order=${entry.orderNumber}`}
                    onClick={() => handleOpenTaskModal(entry)}
                  />
                ))
              ) : (
                <div className="text-gray-500 py-6 text-center">
                  Não há tarefas pendentes no momento
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </ResponsiveContainer>

      {/* Enhanced Task Detail Modal */}
      <Dialog open={!!selectedEntry} onOpenChange={() => handleCloseModal()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Detalhes da Tarefa</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-grow pr-4 max-h-[calc(80vh-120px)] overflow-y-auto">
            {selectedEntry && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Pedido</Label>
                    <div className="font-medium">#{selectedEntry.orderNumber}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Fornecedor</Label>
                    <div className="font-medium">{selectedEntry.supplier}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Itens</Label>
                    <div className="font-medium">{selectedEntry.items}</div>
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
                        <SelectItem value="received">Recebido</SelectItem>
                        <SelectItem value="inspection">Inspeção</SelectItem>
                        <SelectItem value="awaiting storage">Aguardando Armazenamento</SelectItem>
                        <SelectItem value="in storage process">Em Processo de Armazenamento</SelectItem>
                        <SelectItem value="allocated">Alocado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Products Section (Similar to Entry Modal) */}
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Produtos</h3>
                  
                  <div className="space-y-4">
                    {/* Mock product data - these would come from the Entry data in a real system */}
                    {[1, 2].map((index) => (
                      <div 
                        key={index} 
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-md"
                      >
                        <div className="space-y-1">
                          <Label>Item</Label>
                          <div className="font-medium">Produto {index}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label>Quantidade</Label>
                          <div className="font-medium">{5 * index}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label>Tipo do Pacote</Label>
                          <div className="font-medium">{index === 1 ? "Caixa" : "Palete"}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label>Prateleira</Label>
                          <div className="font-medium">A{index}01</div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label>Empilhamento Máx</Label>
                          <div className="font-medium">{index}</div>
                        </div>
                        
                        <div className="md:col-span-2 grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label>Largura (cm)</Label>
                            <div className="font-medium">{10 * index}</div>
                          </div>
                          
                          <div className="space-y-1">
                            <Label>Comprimento (cm)</Label>
                            <div className="font-medium">{20 * index}</div>
                          </div>
                          
                          <div className="space-y-1">
                            <Label>Altura (cm)</Label>
                            <div className="font-medium">{5 * index}</div>
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
            <Button onClick={handleSaveStatus}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
