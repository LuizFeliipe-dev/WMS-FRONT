import { useState, useEffect } from 'react';
import { ShelfType, shelfTypeService } from '@/services/shelfTypes';
import { useToast } from './use-toast';

export const useShelfTypesWithFilters = () => {
  const [shelfTypes, setShelfTypes] = useState<ShelfType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showActive, setShowActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch shelf types when component loads or filters change
  useEffect(() => {
    loadShelfTypes();
  }, [currentPage, showActive, searchTerm]);

  const loadShelfTypes = async () => {
    try {
      setIsLoading(true);
      const params = {
        take: 10,
        page: currentPage,
        active: showActive,
        name: searchTerm
      };
      const res = await shelfTypeService.getAll(params);
      setShelfTypes(res);
    } catch (error) {
      console.error('Error loading shelf types:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar tipos de prateleiras. Tente novamente.",
        variant: "destructive",
      });
      setShelfTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createShelfType = async (shelfTypeData: {
    name: string;
    height: number;
    width: number;
    depth: number;
    maxWeight: number;
    stackable: boolean;
  }) => {
    try {
      const newShelfType = await shelfTypeService.create(shelfTypeData);
      toast({
        title: "Sucesso",
        description: "Tipo de prateleira criado com sucesso.",
      });
      // Reload shelf types after creating
      await loadShelfTypes();
      return newShelfType;
    } catch (error) {
      console.error('Error creating shelf type:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar tipo de prateleira. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateShelfType = async (id: string, shelfTypeData: {
    name: string;
    height: number;
    width: number;
    depth: number;
    maxWeight: number;
    stackable: boolean;
  }) => {
    try {
      const updatedShelfType = await shelfTypeService.update(id, shelfTypeData);
      toast({
        title: "Sucesso",
        description: "Tipo de prateleira atualizado com sucesso.",
      });
      // Reload shelf types after updating
      await loadShelfTypes();
      return updatedShelfType;
    } catch (error) {
      console.error('Error updating shelf type:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar tipo de prateleira. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const toggleShelfTypeActive = async (shelfType: ShelfType) => {
    try {
      if (shelfType.active) {
        await shelfTypeService.toggleInactive(shelfType.id);
      } else {
        await shelfTypeService.toggleActive(shelfType.id);
      }
      toast({
        title: "Sucesso",
        description: "Status do tipo de prateleira alterado com sucesso.",
      });
      // Reload shelf types after status change
      await loadShelfTypes();
    } catch (error) {

      throw error;
    }
  };

  const handleShowActiveChange = (value: boolean) => {
    setShowActive(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  return {
    shelfTypes,
    isLoading,
    currentPage,
    setCurrentPage,
    showActive,
    setShowActive: handleShowActiveChange,
    searchTerm,
    setSearchTerm: handleSearchChange,
    loadShelfTypes,
    createShelfType,
    updateShelfType,
    toggleShelfTypeActive
  };
};
