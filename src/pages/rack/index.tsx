import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { IShelfType } from '@/types/shelf';
import { shelfTypeService } from '@/services/shelfTypes';
import { Rack } from '@/types/warehouse';
import ConfirmStatusDialog from '@/components/changeStatusDialog';
import HeaderComponent from '@/components/headerComponent';
import PaginationComponent from '@/components/paginationComponent';
import RackFormDialog from './components/rackFormDialog';
import RackTable from './components/rackTable';
import { useRackActions } from './hooks/useRackActions';
import { useRackList } from './hooks/useRackList';
import { useZonesWithFilters } from '@/hooks/useZonesWithFilters';

const RacksPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const { zones, fetchZones } = useZonesWithFilters();

  useEffect(() => {
    fetchZones();
  }, []);

  const [shelfTypes, setShelfTypes] = useState<IShelfType[]>([]);
  const [editingRack, setEditingRack] = useState<Rack | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    rack: null as Rack | null,
    action: 'activate' as 'activate' | 'inactivate'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    racks,
    isLoading,
    totalPages,
    refetch,
  } = useRackList({
    take: 10,
    page: currentPage,
    name: searchTerm,
    active: showActive,
  });

  const { createRack, updateRack, toggleRackStatus } = useRackActions(refetch);

  useEffect(() => {
    shelfTypeService.getAll()
      .then((res) => setShelfTypes(res.data))
      .catch(() => setShelfTypes([]));
  }, []);

  const handleSubmit = async (data: any) => {
    const payload = {
      name: data.name,
      shelfTypeId: data.shelfTypeId,
      zoneId: data.zoneId,
      columns: data.horizontalShelves,
      rows: data.verticalShelves,
    };

    if (editingRack) {
      await updateRack(editingRack.id, payload);
    } else {
      await createRack(payload);
    }

    setFormOpen(false);
    setEditingRack(null);
  };

  return (
    <AppLayout>
      <ResponsiveContainer>
        <HeaderComponent
          url="/rack"
          name="Racks"
          description="Gerencie os racks do armazém"
          setFormOpen={setFormOpen}
        />

        <RackTable
          racks={racks}
          isLoading={isLoading}
          isMobile={isMobile}
          onEdit={(rack) => {
            setEditingRack(rack);
            setFormOpen(true);
          }}
          onToggleActive={(rack) => {
            setConfirmDialog({ open: true, rack, action: rack.active ? 'inactivate' : 'activate' });
          }}
        />

        <PaginationComponent
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />

        <RackFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          initialData={editingRack}
          onSubmit={handleSubmit}
          shelfTypes={shelfTypes}
          zones={zones}
          zonesLoading={isLoading}
        />

        <ConfirmStatusDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
          entityName={confirmDialog.rack?.name}
          action={confirmDialog.action}
          onConfirm={async () => {
            if (confirmDialog.rack) {
              await toggleRackStatus(confirmDialog.rack);
              setConfirmDialog({ open: false, rack: null, action: 'activate' });
            }
          }}
        />
      </ResponsiveContainer>
    </AppLayout>
  );
};

export default RacksPage;
