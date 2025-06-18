
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
    showActive,
    setShowActive,
    currentPage,
    setCurrentPage,
    openDialog,
    setOpenDialog,
    editingItem,
    handleAddItem,
    handleEditItem,
    onSubmitItem,
    setItems
  } = useItems();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { toast } = useToast();

  const handleToggleItemStatus = (item: Item) => {
    setSelectedItem(item);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (selectedItem) {
      try {
        let updatedItem: Item;
        
        if (selectedItem.active) {
          updatedItem = await productService.inactivate(selectedItem.id);
        } else {
          updatedItem = await productService.reactivate(selectedItem.id);
        }

        toast({
          title: selectedItem.active ? "Produto inativado" : "Produto ativado",
          description: `O produto ${selectedItem.name} foi ${selectedItem.active ? "inativado" : "ativado"} com sucesso.`,
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
          description: "Não foi possível alterar o status do produto",
          variant: "destructive"
        });
      } finally {
        setStatusDialogOpen(false);
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
        showActive={showActive}
        onShowActiveChange={setShowActive}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleToggleItemStatus={handleToggleItemStatus}
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
              {selectedItem?.active ? "Inativar" : "Ativar"} Produto
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.active
                ? "Você tem certeza que deseja inativar este produto? Produtos inativos não aparecem nas operações padrão."
                : "Você tem certeza que deseja ativar este produto? Produtos ativos aparecem em todas as operações."}
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
    </AuthRequired>
  );
};

export default Items;
