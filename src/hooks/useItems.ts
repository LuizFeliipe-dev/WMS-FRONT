import { useState, useEffect, useCallback } from 'react';
import { Item, ItemFormValues } from '../types/item';
import { useToast } from './use-toast';
import { productService } from '@/services/products';

// Start with empty arrays that will be populated from API
export let groups: { id: string; name: string }[] = [];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { getAuthHeader } from '@/utils/auth';

export const useItems = (take?: number) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormValues | null>(null);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch items when filters change
  useEffect(() => {
    fetchItems();
  }, [searchTerm, filterGroup, showActive, currentPage]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Load categories
      const categoriesData = await loadCategories();
      groups.length = 0;
      groups.push(...categoriesData.data.map(g => ({ id: g.id, name: g.name })));

      // Initial items load will be handled by the useEffect above
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const fetchItems = async () => {
    try {
      setIsLoading(true);

      const params = {
        take: take || 10,
        page: currentPage,
        active: showActive,
        ...(searchTerm && { name: searchTerm }),
        ...(filterGroup && filterGroup !== 'all' && { groupId: filterGroup })
      };

      const itemsData = await productService.getAll(params);
      setItems(itemsData);
    } catch (error) {
      console.error("Error loading items:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar produtos. Tente novamente.",
        variant: "destructive",
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/group`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao obter categorias');
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  };

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

  const handleShowActiveChange = (value: boolean) => {
    setShowActive(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

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
          // For creation, we don't need to include the group property
          // as it will be populated by the server based on productGroupId
          const newItemData = {
            name: data.name,
            description: data.description,
            measurementUnit: data.measurementUnit,
            productGroupId: data.productGroupId,
            active: data.active,
          };

          await productService.create(newItemData);
          await fetchItems(); // Reload to respect current filters
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
    filteredItems: items, // Items are now filtered server-side
    isLoading,
    searchTerm,
    setSearchTerm,
    filterGroup,
    setFilterGroup,
    statusFilter: 'all', // Keeping for compatibility
    setStatusFilter: () => {}, // Keeping for compatibility
    showActive,
    setShowActive: handleShowActiveChange,
    currentPage,
    setCurrentPage,
    openDialog,
    setOpenDialog,
    editingItem,
    handleAddItem,
    handleEditItem,
    onSubmitItem,
    setItems
  };
};
