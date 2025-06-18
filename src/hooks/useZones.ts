
import { useState, useEffect } from 'react';
import { Zone, zoneService } from '@/services/zones';
import { useToast } from './use-toast';

export const useZones = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setIsLoading(true);
      const data = await zoneService.getAll();
      setZones(data);
    } catch (error) {
      console.error("Error fetching zones:", error);
      toast({
        title: "Erro ao carregar zonas",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      setZones([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createZone = async (zoneData: { name: string }) => {
    try {
      const newZone = await zoneService.create(zoneData);
      setZones([...zones, newZone]);
      toast({
        title: "Zona criada",
        description: "Nova zona foi criada com sucesso",
      });
      return newZone;
    } catch (error) {
      console.error("Error creating zone:", error);
      toast({
        title: "Erro ao criar zona",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateZone = async (id: string, zoneData: { name: string }) => {
    try {
      const updatedZone = await zoneService.update(id, zoneData);
      setZones(zones.map(zone => zone.id === id ? updatedZone : zone));
      toast({
        title: "Zona atualizada",
        description: "Zona foi atualizada com sucesso",
      });
      return updatedZone;
    } catch (error) {
      console.error("Error updating zone:", error);
      toast({
        title: "Erro ao atualizar zona",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      throw error;
    }
  };

  const toggleZoneActive = async (id: string) => {
    try {
      const updatedZone = await zoneService.toggleInactive(id);
      setZones(zones.map(zone => zone.id === id ? updatedZone : zone));
      toast({
        title: updatedZone.active ? "Zona ativada" : "Zona inativada",
        description: `Zona foi ${updatedZone.active ? 'ativada' : 'inativada'} com sucesso`,
      });
      return updatedZone;
    } catch (error) {
      console.error("Error toggling zone status:", error);
      toast({
        title: "Erro ao alterar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteZone = async (id: string) => {
    try {
      await zoneService.delete(id);
      setZones(zones.filter(zone => zone.id !== id));
      toast({
        title: "Zona excluída",
        description: "Zona foi excluída com sucesso",
      });
    } catch (error) {
      console.error("Error deleting zone:", error);
      toast({
        title: "Erro ao excluir zona",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
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
    deleteZone
  };
};
