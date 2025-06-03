
import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import ItemFormDialog from '../components/items/ItemFormDialog';
import { useItems, groups } from '../hooks/useItems';
import ItemsPageContent from '../components/items/ItemsPageContent';
import { Item } from '@/types/item';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { productService } from '@/services/products';

const Items = () => {
  const {
    items,
    filteredItems,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterGroup,
    setFilterGroup,
    statusFilter,
    setStatusFilter,
    openDialog,
    setOpenDialog,
    editingItem,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    onSubmitItem,
    setItems
  } = useItems();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { toast } = useToast();

  const handleToggleItemStatus = (item: Item) => {
    setSelectedItem(item);
    setStatusDialogOpen(true);
  };

  const handleDeleteItemConfirm = (item: Item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (selectedItem) {
      try {
        const updatedItem = await productService.toggleStatus(
          selectedItem.id, 
          !selectedItem.active
        );

        toast({
          title: selectedItem.active ? "Item inativado" : "Item ativado",
          description: `O item ${selectedItem.name} foi ${selectedItem.active ? "inativado" : "ativado"} com sucesso.`,
        });
        
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === selectedItem.id ? updatedItem : item
          )
        );
      } catch (error) {
        console.error("Error toggling item status:", error);
        toast({
          title: "Erro",
          description: "Não foi possível alterar o status do item",
          variant: "destructive"
        });
      } finally {
        setStatusDialogOpen(false);
        setSelectedItem(null);
      }
    }
  };

  const confirmDeleteItem = async () => {
    if (selectedItem) {
      try {
        await handleDeleteItem(selectedItem.id);
      } finally {
        setDeleteDialogOpen(false);
        setSelectedItem(null);
      }
    }
  };

  return (
    <AuthRequired>
      <ItemsPageContent
        filteredItems={filteredItems}
        items={items}
        isLoading={isLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterGroup={filterGroup}
        setFilterGroup={setFilterGroup}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleToggleItemStatus={handleToggleItemStatus}
        handleDeleteItem={handleDeleteItemConfirm}
      />

      <ItemFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        editingItem={editingItem}
        onSubmit={onSubmitItem}
        groups={groups}
      />

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.active ? "Inativar" : "Ativar"} Item
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.active
                ? "Você tem certeza que deseja inativar este item? Itens inativos não aparecem nas operações padrão."
                : "Você tem certeza que deseja ativar este item? Itens ativos aparecem em todas as operações."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant={selectedItem?.active ? "destructive" : "default"}
              onClick={confirmToggleStatus}
            >
              {selectedItem?.active ? "Sim, inativar" : "Sim, ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Item</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir o item "{selectedItem?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteItem}
            >
              Sim, excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default Items;
