import AppLayout from '@/components/AppLayout';
import AuthRequired from '@/components/AuthRequired';
import ConfirmStatusDialog from '@/components/changeStatusDialog';
import { useProducts } from '@/pages/product/hooks/useProducts';
import ProductPageContent from './components/productPageContent';
import ProductFormDialog from './components/productFormDialog';

const Product = () => {
  const {
    products,
    groups,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterGroup,
    setFilterGroup,
    showActive,
    setShowActive,
    currentPage,
    setCurrentPage,
    totalPages,
    openDialog,
    setOpenDialog,
    editingProduct,
    handleAddProduct,
    handleEditProduct,
    onSubmitProduct,
    handleToggleProductStatus,
    statusDialogOpen,
    selectedProduct,
    setStatusDialogOpen,
    confirmToggleStatus,
  } = useProducts();

  return (
    <AuthRequired>
      <AppLayout>
        <ProductPageContent
          products={products}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterGroup={filterGroup}
          setFilterGroup={setFilterGroup}
          showActive={showActive}
          onShowActiveChange={setShowActive}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
          handleAddProduct={handleAddProduct}
          handleEditProduct={handleEditProduct}
          handleToggleProductStatus={handleToggleProductStatus}
        />

        <ProductFormDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          editingProduct={editingProduct}
          onSubmit={onSubmitProduct}
          groups={groups}
        />

        <ConfirmStatusDialog
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          action={selectedProduct?.active ? 'inactivate' : 'activate'}
          entityName={selectedProduct?.name}
          onConfirm={confirmToggleStatus}
        />
      </AppLayout>
    </AuthRequired>
  );
};

export default Product;
