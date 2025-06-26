import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import AuthRequired from '@/components/AuthRequired';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { ISupplier } from '@/types/supplier';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import ConfirmStatusDialog from '@/components/changeStatusDialog';
import PaginationComponent from '@/components/paginationComponent';
import SupplierDialogForm from './components/supplierDialogForm';
import SupplierFilters from './components/supplierFillters';
import SupplierTable from './components/supplierTable';
import { useSuppliers } from './hooks/useSuppliers';
import HeaderComponent from '@/components/headerComponent';

const Suppliers = () => {
  const navigate = useNavigate();
  const { hasWriteAccess } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<ISupplier | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    supplier: null as ISupplier | null,
    action: 'activate' as 'activate' | 'inactivate',
  });

  const {
    suppliers,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    showActive,
    setShowActive,
    searchTerm,
    setSearchTerm,
    createSupplier,
    updateSupplier,
    toggleSupplierStatus,
  } = useSuppliers();

  const canWriteSuppliers = hasWriteAccess('/supplier');

  const handleOpenDialog = () => {
    if (!canWriteSuppliers) return;
    setEditingSupplier(null);
    setDialogOpen(true);
  };

  const handleEditSupplier = (supplier: ISupplier) => {
    if (!canWriteSuppliers) return;
    setEditingSupplier(supplier);
    setDialogOpen(true);
  };

  const handleViewContacts = (id: string) => {
    navigate(`/supplier-contacts?supplierId=${id}`);
  };

  const handleToggleActive = (supplier: ISupplier) => {
    setConfirmDialog({
      open: true,
      supplier,
      action: supplier.active ? 'inactivate' : 'activate',
    });
  };

  const handleConfirmToggle = async () => {
    const { supplier } = confirmDialog;
    if (!supplier) return;
    await toggleSupplierStatus(supplier);
    setConfirmDialog({ open: false, supplier: null, action: 'activate' });
  };

  const handleSubmitForm = async (values: { name: string }) => {
    if (editingSupplier) {
      await updateSupplier(editingSupplier.id, values);
    } else {
      await createSupplier(values);
    }
    setDialogOpen(false);
  };

  return (
    <AuthRequired requiredRoute="/supplier">
      <AppLayout>
        <ResponsiveContainer>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <HeaderComponent
              name="Fornecedores"
              description="Gerencie seus fornecedores"
              url="/supplier"
              setFormOpen={handleOpenDialog}
            />

            <SupplierFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              showActive={showActive}
              onShowActiveChange={setShowActive}
            />

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
              <SupplierTable
                suppliers={suppliers}
                isLoading={isLoading}
                canWrite={canWriteSuppliers}
                onEdit={handleEditSupplier}
                onViewContacts={handleViewContacts}
                onToggleStatus={handleToggleActive}
              />

              <PaginationComponent
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </motion.div>
        </ResponsiveContainer>

        <SupplierDialogForm
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSubmitForm}
          editingSupplier={editingSupplier}
        />

        <ConfirmStatusDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
          action={confirmDialog.action}
          entityName={confirmDialog.supplier?.name}
          onConfirm={handleConfirmToggle}
        />
      </AppLayout>
    </AuthRequired>
  );
};

export default Suppliers;
