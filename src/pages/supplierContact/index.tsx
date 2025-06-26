import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import AuthRequired from '@/components/AuthRequired';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ISupplierContact } from '@/types/supplier';
import { useSupplierContacts } from './hooks/useSupplierContact';
import { SupplierContactFiltersSection } from './components/supplierContactFiltersSection';
import { SupplierContactTable } from './components/supplierContactTable';
import { SupplierContactFormDialog } from './components/supplierContactFormDialog';
import { useSuppliers } from '../supplier/hooks/useSuppliers';
import ConfirmStatusDialog from '@/components/changeStatusDialog';
import HeaderComponent from '@/components/headerComponent';

const SupplierContact = () => {
  const [supplierId, setSupplierId] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ISupplierContact | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    supplierContact: null as ISupplierContact | null,
    action: 'activate' as 'activate' | 'inactivate',
  });

  const isMobile = useIsMobile();
  const {
    contacts,
    loading,
    toggleStatus,
    createSupplierContact,
    updateSupplierContact,
  } = useSupplierContacts({ supplierId, showActive });

  const { suppliers } = useSuppliers();

  const handleAdd = () => {
    setEditingContact(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (contact: ISupplierContact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };


  const handleSubmitForm = async (values) => {
    if (editingContact) await updateSupplierContact(supplierId, {
      ...editingContact,
      ...values,
    });
    else await createSupplierContact(supplierId, values);

    setIsDialogOpen(false);
  };

  const handleToggleActive = (supplierContact: ISupplierContact) => {
    setConfirmDialog({
      open: true,
      supplierContact,
      action: supplierContact.active ? 'inactivate' : 'activate',
    });
  };

  const handleConfirmToggle = async () => {
    const { supplierContact } = confirmDialog;
    if (!supplierContact) return;
    await toggleStatus(supplierContact);
    setConfirmDialog({ open: false, supplierContact: null, action: 'activate' });
  };

  return (
    <AuthRequired>
      <AppLayout>
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <HeaderComponent
              name=" Contato de Fornecedores"
              description="Gerencie os contatos dos fornecedores"
              url="/supplier/contact"
              setFormOpen={handleAdd}
            />

            <SupplierContactFiltersSection
              supplierId={supplierId}
              selectedSupplierId={supplierId}
              setSelectedSupplierId={setSupplierId}
              suppliers={suppliers}
              onSupplierChange={setSupplierId}
              showActive={showActive}
              onToggleActive={setShowActive}
            />

            <SupplierContactTable
              contacts={contacts}
              isLoading={loading}
              onEdit={handleEdit}
              onToggleStatus={handleToggleActive}
              isMobile={false}
              selectedSupplierId={supplierId}
            />
          </motion.div>
        </ResponsiveContainer>

        <SupplierContactFormDialog
          editingContact={editingContact}
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmitForm}
          onOpenChange={setIsDialogOpen}
          supplierId={supplierId}
        />

        <ConfirmStatusDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
          action={confirmDialog.action}
          entityName={confirmDialog.supplierContact?.name}
          onConfirm={handleConfirmToggle}
        />
      </AppLayout>
    </AuthRequired>
  );
};

export default SupplierContact;
