
import { useState, useEffect } from 'react';
import { shelfTypeService, ShelfType } from '@/services/shelfTypes';
import { useToast } from './use-toast';

export const useShelfTypes = () => {
  const [shelfTypes, setShelfTypes] = useState<ShelfType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadShelfTypes();
  }, []);

  const loadShelfTypes = async () => {
    try {
      setIsLoading(true);
      const data = await shelfTypeService.getAll();
      setShelfTypes(data);
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
      setShelfTypes(prev => [...prev, newShelfType]);
      toast({
        title: "Sucesso",
        description: "Tipo de prateleira criado com sucesso.",
      });
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
      setShelfTypes(prev => prev.map(shelfType =>
        shelfType.id === id ? updatedShelfType : shelfType
      ));
      toast({
        title: "Sucesso",
        description: "Tipo de prateleira atualizado com sucesso.",
      });
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

  const toggleShelfTypeActive = async (id: string) => {
    try {
      const updatedShelfType = await shelfTypeService.toggleInactive(id);
      setShelfTypes(prev => prev.map(shelfType =>
        shelfType.id === id ? updatedShelfType : shelfType
      ));
      toast({
        title: "Sucesso",
        description: `Tipo de prateleira ${updatedShelfType.active ? 'ativado' : 'inativado'} com sucesso.`,
      });
      return updatedShelfType;
    } catch (error) {
      console.error('Error toggling shelf type status:', error);
      toast({
        title: "Erro",
        description: "Falha ao alterar status do tipo de prateleira. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteShelfType = async (id: string) => {
    try {
      await shelfTypeService.delete(id);
      setShelfTypes(prev => prev.filter(shelfType => shelfType.id !== id));
      toast({
        title: "Sucesso",
        description: "Tipo de prateleira excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting shelf type:', error);
      toast({
        title: "Erro",
        description: "Falha ao excluir tipo de prateleira. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    shelfTypes,
    isLoading,
    loadShelfTypes,
    createShelfType,
    updateShelfType,
    toggleShelfTypeActive,
    deleteShelfType
  };
};
