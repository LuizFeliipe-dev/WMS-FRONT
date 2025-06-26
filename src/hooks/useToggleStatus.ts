import { useCallback } from 'react';
import { useToast } from './use-toast';

interface UseToggleStatusProps<T> {
  inactivateFn: (id: string) => Promise<any>;
  reactivateFn: (id: string) => Promise<any>;
  refreshFn: () => Promise<void>;
  entityLabelSingular: string;
}

export const useToggleStatus = <T extends { id: string; active: boolean }>({
  inactivateFn,
  reactivateFn,
  refreshFn,
  entityLabelSingular,
}: UseToggleStatusProps<T>) => {
  const { toast } = useToast();

  const handleToggleStatus = useCallback(
    async (entity: T) => {
      try {
        if (entity.active) {
          await inactivateFn(entity.id);
        } else {
          await reactivateFn(entity.id);
        }

        await refreshFn();

        toast({
          title: 'Sucesso',
          description: `Status de ${entityLabelSingular.toLowerCase()} alterado com sucesso.`,
        });
      } catch (error) {
        toast({
          title: 'Erro',
          description: `Erro ao alterar status de ${entityLabelSingular.toLowerCase()}.`,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [inactivateFn, reactivateFn, refreshFn, entityLabelSingular, toast]
  );

  return { handleToggleStatus };
};
