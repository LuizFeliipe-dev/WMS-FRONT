import { useState } from 'react';
import { zoneService } from '@/services/zones';
import { IZone } from '@/types/zone';
import { useToast } from '@/hooks/use-toast';

export const useZones = () => {
  const [zones, setZones] = useState<IZone[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const fetchZones = async (params?: Record<string, any>) => {
    setIsLoading(true);
    try {
      const res = await zoneService.getAll(params);
      setZones(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (error) {
      console.error('Erro ao buscar zonas:', error);
      setZones([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createZone = async (zone: { name: string }) => {
    await zoneService.create(zone);
  };

  const updateZone = async (id: string, zone: { name: string }) => {
    await zoneService.update(id, zone);
  };

  const toggleZoneActive = async (id: string) => {
    const zone = zones.find((z) => z.id === id);
    if (!zone) return;

    try {
      if (zone.active) {
        await zoneService.inactivate(id);
      } else {
        await zoneService.reactivate(id);
      }

      toast({
        title: 'Sucesso',
        description: `Status de ${zone.name.toLowerCase()} alterado com sucesso.`,
      });
    } catch (error) {
      console.error('Error toggling zone status:', error);

      if (error.details === 'ZONE_HAS_ACTIVE_PRODUCT_GROUPS') {
        toast({
          title: 'Erro',
          description: `Não é possível inativar a zona ${zone.name.toLowerCase()} pois possui grupos de produtos ativos.`,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Erro',
        description: `Erro ao alterar status de ${zone.name.toLowerCase()}.`,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    zones,
    isLoading,
    fetchZones,
    createZone,
    updateZone,
    toggleZoneActive,
    totalPages,
  };
};
