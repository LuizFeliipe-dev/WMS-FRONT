import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';

import { useZonesWithFilters } from '@/pages/zone/hooks/useZonesWithFilters';
import { IZone } from '@/types/zone';
import ConfirmStatusDialog from '@/components/changeStatusDialog';
import ZoneFormDialog from './components/zoneFormDialog';
import ZoneTable from './components/zoneTable';
import ZoneFiltersSection from './components/zoneFiltersSection';
import AuthRequired from '@/components/AuthRequired';
import HeaderComponent from '@/components/headerComponent';

const Zones = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingZone, setEditingZone] = useState<IZone | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    zone: null as IZone | null,
    action: 'activate' as 'activate' | 'inactivate',
  });

  const {
    zones,
    isLoading,
    searchTerm,
    setSearchTerm,
    showActive,
    setShowActive,
    currentPage,
    setCurrentPage,
    totalPages,
    createZone,
    updateZone,
    toggleZoneStatus,
    fetchZones
  } = useZonesWithFilters();

  useEffect(() => {
    fetchZones();
  }, [currentPage, searchTerm, showActive]);

  const handleAddZone = () => {
    setEditingZone(null);
    setOpenDialog(true);
  };

  const handleEditZone = (zone: IZone) => {
    setEditingZone(zone);
    setOpenDialog(true);
  };

  const handleToggleStatus = (zone: IZone) => {
    setConfirmDialog({
      open: true,
      zone,
      action: zone.active ? 'inactivate' : 'activate',
    });
  };

  const handleConfirmToggle = async () => {
    if (!confirmDialog.zone) return;
    await toggleZoneStatus(confirmDialog.zone);
    await fetchZones();
    setConfirmDialog({ open: false, zone: null, action: 'activate' });
  };

  return (
    <AuthRequired requiredRoute="/zone">
      <AppLayout>
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <HeaderComponent
              name="Zonas"
              description="Gerencie as zonas do armazém"
              url="/zone"
              setFormOpen={handleAddZone}
            />

            <ZoneFiltersSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showActive={showActive}
              setShowActive={setShowActive}
            />

            <ZoneTable
              zones={zones}
              isLoading={isLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onEdit={handleEditZone}
              onToggleStatus={handleToggleStatus}
              totalPages={totalPages}
            />
          </motion.div>
        </ResponsiveContainer>

        <ConfirmStatusDialog
          open={confirmDialog.open}
          onOpenChange={(open) =>
            setConfirmDialog((prev) => ({ ...prev, open }))
          }
          action={confirmDialog.action}
          entityName={confirmDialog.zone?.name}
          onConfirm={handleConfirmToggle}
        />

        <ZoneFormDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          zone={editingZone}
          onSave={async (name) => {
            if (editingZone) {
              await updateZone(editingZone.id, { name });
            } else {
              await createZone({ name });
            }
            await fetchZones();
            setOpenDialog(false);
          }}
        />
      </AppLayout>
    </AuthRequired>
  );
};

export default Zones;
