import { useToast } from '@/hooks/use-toast';
import { shelfTypeService } from '@/services/shelfTypes';
import { IShelfType } from '@/types/shelf';

interface ShelfTypePayload {
  name: string;
  height: number;
  width: number;
  depth: number;
  maxWeight: number;
  stackable: boolean;
}

export const useShelfTypeActions = () => {
  const { toast } = useToast();

  const createShelfType = async (payload: ShelfTypePayload) => {
    try {
      const newShelfType = await shelfTypeService.create(payload);
      toast({
        title: 'Sucesso',
        description: 'Tipo de prateleira criado com sucesso.',
      });
      return newShelfType;
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao criar tipo de prateleira. Tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateShelfType = async (id: string, payload: ShelfTypePayload) => {
    try {
      const updatedShelfType = await shelfTypeService.update(id, payload);
      toast({
        title: 'Sucesso',
        description: 'Tipo de prateleira atualizado com sucesso.',
      });
      return updatedShelfType;
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar tipo de prateleira. Tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const toggleShelfTypeActive = async (shelfType: IShelfType) => {
    try {
      const updated = shelfType.active
        ? await shelfTypeService.inactivate(shelfType.id)
        : await shelfTypeService.reactivate(shelfType.id);

      toast({
        title: 'Sucesso',
        description: 'Status do tipo de prateleira alterado com sucesso.',
      });
      return updated;
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao alterar status.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return { createShelfType, updateShelfType, toggleShelfTypeActive };
};
