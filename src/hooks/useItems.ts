
import { useState, useEffect, useCallback } from 'react';
import { Item, ItemFormValues } from '../types/item';
import { useToast } from './use-toast';
import { productService } from '@/services/products';
import { groupService } from '@/services/groups';

// Start with empty arrays that will be populated from API
export let groups: { id: string; name: string }[] = [];

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormValues | null>(null);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Load items and groups in parallel
      const [itemsData, groupsData] = await Promise.all([
        productService.getAll(),
        groupService.getAll().catch(err => {
          console.error('Error loading groups:', err);
          return [];
        })
      ]);

      // Update the exported arrays
      groups.length = 0;
      groups.push(...groupsData.map(g => ({ id: g.id, name: g.name })));

      setItems(itemsData);
      setFilteredItems(itemsData);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados. Tente novamente.",
        variant: "destructive",
      });
      setItems([]);
      setFilteredItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let results = items;
    
    if (searchTerm) {
      results = results.filter(
        item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterGroup) {
      results = results.filter(item => item.productGroupId === filterGroup);
    }
    
    if (statusFilter === 'active') {
      results = results.filter(item => item.active);
    } else if (statusFilter === 'inactive') {
      results = results.filter(item => !item.active);
    }
    
    setFilteredItems(results);
  }, [items, searchTerm, filterGroup, statusFilter]);

  const handleAddItem = () => {
    setEditingItem(null);
    setOpenDialog(true);
  };

  const handleEditItem = (item: Item) => {
    const itemForm: ItemFormValues = {
      id: item.id,
      name: item.name,
      description: item.description,
      measurementUnit: item.measurementUnit,
      productGroupId: item.productGroupId,
      active: item.active,
    };
    
    setEditingItem(itemForm);
    setOpenDialog(true);
  };

  const handleDeleteItem = useCallback(async (id: string) => {
    try {
      await productService.delete(id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      toast({
        title: "Sucesso",
        description: "Item excluído com sucesso",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir item",
        variant: "destructive",
      });
    }
  }, [toast]);

  const onSubmitItem = useCallback(
    async (data: ItemFormValues) => {
      try {
        if (data.id) {
          const updatedItem = await productService.update(data.id, {
            name: data.name,
            description: data.description,
            measurementUnit: data.measurementUnit,
            productGroupId: data.productGroupId,
            active: data.active,
          });
          setItems(prevItems =>
            prevItems.map(item => (item.id === data.id ? updatedItem : item))
          );
          toast({
            title: "Sucesso",
            description: "Item atualizado com sucesso",
          });
        } else {
          const newItemData = {
            name: data.name,
            description: data.description,
            measurementUnit: data.measurementUnit,
            productGroupId: data.productGroupId,
            active: data.active,
          };
          
          const newItem = await productService.create(newItemData);
          setItems(prevItems => [...prevItems, newItem]);
          toast({
            title: "Sucesso",
            description: "Novo item criado com sucesso",
          });
        }
        setOpenDialog(false);
      } catch (error) {
        console.error("Error saving item:", error);
        toast({
          title: "Erro",
          description: "Falha ao salvar item",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  return {
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
  };
};
