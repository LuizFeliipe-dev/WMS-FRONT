import { useState } from 'react';
import { Layers, Plus } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/button';
import { IShelfType } from '@/types/shelf';
import ConfirmStatusDialog from '@/components/changeStatusDialog';
import PaginationComponent from '@/components/paginationComponent';
import ShelfTypeFormDialog from './components/shelfTypeFormDialog';
import ShelfTypeTable from './components/shelfTypeTable';
import { useShelfTypeActions } from './hooks/useShelfTypeActions';
import { useShelfTypeList } from './hooks/useShelfTypeList';
import ShelfTypeFiltersSection from './components/shelfTypeFitersSection';
import HeaderComponent from '@/components/headerComponent';

const ShelfTypes = () => {
  const [filters, setFilters] = useState({
    page: 1,
    take: 10,
    name: '',
    active: true,
  });
  const [editingShelfType, setEditingShelfType] = useState<IShelfType | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    shelfType: IShelfType | null;
    action: 'activate' | 'inactivate';
  }>({ open: false, shelfType: null, action: 'activate' });
  const [formOpen, setFormOpen] = useState(false);

  const { shelfTypes, isLoading, totalPages, refetch } = useShelfTypeList(filters);
  const { createShelfType, updateShelfType, toggleShelfTypeActive } = useShelfTypeActions();

  const handleAdd = () => {
    setEditingShelfType(null);
    setFormOpen(true);
  };

  const handleEdit = (shelfType: IShelfType) => {
    setEditingShelfType(shelfType);
    setFormOpen(true);
  };

  const handleToggleStatus = (shelfType: IShelfType) => {
    setConfirmDialog({
      open: true,
      shelfType,
      action: shelfType.active ? 'inactivate' : 'activate',
    });
  };

  const confirmToggle = async () => {
    if (!confirmDialog.shelfType) return;
    await toggleShelfTypeActive(confirmDialog.shelfType);
    setConfirmDialog({ open: false, shelfType: null, action: 'activate' });
    refetch();
  };

  const handleSave = async (data: any) => {
    console.log('aq')
    if (editingShelfType) {
      await updateShelfType(editingShelfType.id, data);
    } else {
      await createShelfType(data);
    }
    setFormOpen(false);
    refetch();
  };

  return (
    <AppLayout>
      <ResponsiveContainer>
        <HeaderComponent
          name="Tipos de Prateleiras"
          description="Gerencie os tipos de prateleiras utilizados nos armazéns"
          url="/shelf/type"
          setFormOpen={setFormOpen}
        />

        <ShelfTypeFiltersSection
          search={filters.name}
          onSearchChange={(name) => setFilters({ ...filters, name, page: 1 })}
          showActive={filters.active}
          onToggleActive={(active) => setFilters({ ...filters, active, page: 1 })}
        />

        <ShelfTypeTable
          data={shelfTypes}
          isLoading={isLoading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />

        <PaginationComponent
          currentPage={filters.page}
          setCurrentPage={(page) => setFilters({ ...filters, page })}
          totalPages={totalPages}
        />
      </ResponsiveContainer>

      <ShelfTypeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingShelfType}
        onSubmit={handleSave}
      />

      <ConfirmStatusDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        action={confirmDialog.action}
        entityName={confirmDialog.shelfType?.name}
        onConfirm={confirmToggle}
      />
    </AppLayout>
  );
};

export default ShelfTypes;
