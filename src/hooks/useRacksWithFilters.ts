
import { useState, useEffect } from 'react';
import { Rack } from '@/types/warehouse';
import { rackService } from '@/services/racks';
import { useToast } from './use-toast';

export const useRacksWithFilters = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showActive, setShowActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch racks when component loads or filters change
  useEffect(() => {
    loadRacks();
  }, [currentPage, showActive, searchTerm]);

  const loadRacks = async () => {
    try {
      setIsLoading(true);
      const params = {
        take: 10,
        page: currentPage,
        active: showActive,
        name: searchTerm
      };
      const res = await rackService.getAll(params);
      setRacks(res.data);
    } catch (error) {
      console.error('Error loading racks:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar racks. Tente novamente.",
        variant: "destructive",
      });
      setRacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createRack = async (rackData: {
    shelfTypeId: string;
    name: string;
    columns: number;
    rows: number;
  }) => {
    try {
      const newRack = await rackService.create(rackData);
      toast({
        title: "Sucesso",
        description: "Rack criado com sucesso.",
      });
      // Reload racks after creating
      await loadRacks();
      return newRack;
    } catch (error) {
      console.error('Error creating rack:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar rack. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateRack = async (id: string, rackData: {
    shelfTypeId: string;
    name: string;
    columns: number;
    rows: number;
  }) => {
    try {
      const updatedRack = await rackService.update(id, rackData);
      toast({
        title: "Sucesso",
        description: "Rack atualizado com sucesso.",
      });
      // Reload racks after updating
      await loadRacks();
      return updatedRack;
    } catch (error) {
      console.error('Error updating rack:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar rack. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const toggleRackStatus = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await rackService.inactivate(id);
      } else {
        await rackService.reactivate(id);
      }
      toast({
        title: "Sucesso",
        description: "Status do rack alterado com sucesso.",
      });
      // Reload racks after status change
      await loadRacks();
    } catch (error) {
      console.error('Error toggling rack status:', error);
      toast({
        title: "Erro",
        description: "Falha ao alterar status do rack. Tente novamente.",
        variant: "destructive",
      });
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
    racks,
    isLoading,
    currentPage,
    setCurrentPage,
    showActive,
    setShowActive: handleShowActiveChange,
    searchTerm,
    setSearchTerm: handleSearchChange,
    loadRacks,
    createRack,
    updateRack,
    toggleRackStatus
  };
};
