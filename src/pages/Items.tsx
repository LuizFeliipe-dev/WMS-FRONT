
import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import ItemFormDialog from '../components/items/ItemFormDialog';
import { useItems, suppliers, groups } from '../hooks/useItems';
import ItemsPageContent from '../components/items/ItemsPageContent';
import { Item } from '@/types/item';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

const Items = () => {
  const {
    items,
    filteredItems,
    searchTerm,
    setSearchTerm,
    filterGroup,
    setFilterGroup,
    openDialog,
    setOpenDialog,
    editingItem,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    onSubmitItem
  } = useItems();

  const [statusFilter, setStatusFilter] = useState('all');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { toast } = useToast();

  const handleToggleItemStatus = (item: Item) => {
    setSelectedItem(item);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (selectedItem) {
      // In a real app, you would update the item in the database
      // Here we're just showing the toast notification
      toast({
        title: selectedItem.active ? "Item inativado" : "Item ativado",
        description: `O item ${selectedItem.name} foi ${selectedItem.active ? "inativado" : "ativado"} com sucesso.`,
      });
      setStatusDialogOpen(false);
      setSelectedItem(null);
    }
  };

  // Apply status filter in addition to the existing filters
  const applyStatusFilter = (items: Item[]) => {
    if (statusFilter === 'all') return items;
    
    return items.filter(item => {
      if (statusFilter === 'active') return item.active;
      if (statusFilter === 'inactive') return !item.active;
      return true;
    });
  };

  const statusFilteredItems = applyStatusFilter(filteredItems);

  return (
    <AuthRequired>
      <div className="min-h-screen flex flex-col">
        <Sidebar />
        <ResponsiveContainer>
          <ItemsPageContent
            filteredItems={statusFilteredItems}
            items={items}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterGroup={filterGroup}
            setFilterGroup={setFilterGroup}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            handleAddItem={handleAddItem}
            handleEditItem={handleEditItem}
            handleToggleItemStatus={handleToggleItemStatus}
          />
        </ResponsiveContainer>
      </div>

      <ItemFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        editingItem={editingItem}
        onSubmit={onSubmitItem}
        suppliers={suppliers}
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
    </AuthRequired>
  );
};

export default Items;
