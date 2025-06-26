import { useToast } from '@/hooks/use-toast';
import { rackService } from '@/services/racks';
import { Rack } from '@/types/warehouse';

interface RackPayload {
  shelfTypeId: string;
  name: string;
  columns: number;
  rows: number;
}

export const useRackActions = (refetch: () => void) => {
  const { toast } = useToast();

  const createRack = async (data: RackPayload) => {
    try {
      const newRack = await rackService.create(data);
      toast({ title: 'Sucesso', description: 'Rack criado com sucesso.' });
      refetch();
      return newRack;
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o rack.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateRack = async (id: string, data: RackPayload) => {
    try {
      const updatedRack = await rackService.update(id, data);
      toast({ title: 'Sucesso', description: 'Rack atualizado com sucesso.' });
      refetch();
      return updatedRack;
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o rack.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const toggleRackStatus = async (rack: Rack) => {
    try {
      if (rack.active) {
        await rackService.inactivate(rack.id);
      } else {
        await rackService.reactivate(rack.id);
      }
      toast({ title: 'Sucesso', description: 'Status alterado com sucesso.' });
      refetch();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return { createRack, updateRack, toggleRackStatus };
};
