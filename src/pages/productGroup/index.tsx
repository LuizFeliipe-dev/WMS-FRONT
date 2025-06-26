import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import AuthRequired from '@/components/AuthRequired';
import ConfirmStatusDialog from '@/components/changeStatusDialog';
import PaginationComponent from '@/components/paginationComponent';
import { useZonesWithFilters } from '@/hooks/useZonesWithFilters';
import { useEffect } from 'react';
import GroupFiltersSection from './components/groupFiltersSection';
import { GroupFormDialog } from './components/groupFormDialog';
import { GroupTable } from './components/groupTable';
import { useGroups } from './hooks/useGroups';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';

const Group = () => {
  const { hasWriteAccess } = useAuth();

  const canWriteProductGroup = hasWriteAccess('/product/group');

  const {
    flatGroups,
    expandedGroups,
    toggleExpanded,
    handleAddSubCategory,
    handleEditGroup,
    handleToggleActive,
    handleCloseDialog,
    handleConfirmToggle,
    setCurrentPage,
    currentPage,
    totalPages,
    confirmDialog,
    formDialog,
    handleSubmitGroup,
    setFormDialog,
    setConfirmDialog,
    isVisible,
    searchTerm,
    setSearchTerm,
    showActive,
    setShowActive,
    groups,
    hasChildrenMap
  } = useGroups();

  const { zones, fetchZones } = useZonesWithFilters();

  useEffect(() => {
    fetchZones();
  }, []);

  const selectedParentId = formDialog.selectedParentId ?? 'none';
  const editingGroup = formDialog.editingGroup ?? null;

  return (
    <AuthRequired requiredRoute="/product/group">
      <AppLayout>
        <ResponsiveContainer>
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Categorias de Produtos</h1>
              <p className="text-gray-500">Gerencie as categorias de produtos do sistema</p>
            </div>
            {canWriteProductGroup && (
              <Button onClick={() => setFormDialog({ open: true, editingGroup: null, selectedParentId: null })}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            )}
          </header>


          <GroupFiltersSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showActive={showActive}
            setShowActive={setShowActive}
            groups={groups}
          />
          <GroupTable
            groups={groups}
            flatGroups={flatGroups}
            isVisible={isVisible}
            expandedGroups={expandedGroups}
            toggleExpanded={toggleExpanded}
            handleAddSubCategory={handleAddSubCategory}
            handleEditGroup={handleEditGroup}
            handleToggleActive={handleToggleActive}
            hasChildrenMap={hasChildrenMap}
          />
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </ResponsiveContainer>

        <GroupFormDialog
          open={formDialog.open}
          onClose={handleCloseDialog}
          editingGroup={editingGroup}
          selectedParentId={selectedParentId}
          onSubmit={handleSubmitGroup}
          groups={groups}
          zones={zones}
        />

        <ConfirmStatusDialog
          open={confirmDialog.open}
          onOpenChange={(open) =>
            setConfirmDialog((prev) => ({ ...prev, open }))
          }
          action={confirmDialog.group?.active ? 'inactivate' : 'activate'}
          entityName={confirmDialog.group?.name}
          onConfirm={() => confirmDialog.group && handleConfirmToggle(confirmDialog.group)}
        />
      </AppLayout>
    </AuthRequired>
  );
};

export default Group;
