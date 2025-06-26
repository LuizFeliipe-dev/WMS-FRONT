import PaginationComponent from '@/components/paginationComponent';
import { IProduct } from '@/types/product';
import ProductFilters from './productFilters';
import ProductHeader from './productHeader';
import ProductTable from './productTable';

interface ProductsPageContentProps {
  products: IProduct[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterGroup: string;
  setFilterGroup: (value: string) => void;
  showActive: boolean;
  onShowActiveChange: (value: boolean) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
  handleAddProduct: () => void;
  handleEditProduct: (Product: IProduct) => void;
  handleToggleProductStatus: (Product: IProduct) => void;
}

const ProductPageContent = ({
  products,
  isLoading,
  searchTerm,
  setSearchTerm,
  filterGroup,
  setFilterGroup,
  showActive,
  onShowActiveChange,
  currentPage,
  onPageChange,
  totalPages,
  handleAddProduct,
  handleEditProduct,
  handleToggleProductStatus
}: ProductsPageContentProps) => {
  return (
    <div className="p-4 md:p-6">
      <ProductHeader onAddProduct={handleAddProduct} />
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterGroup={filterGroup}
        setFilterGroup={setFilterGroup}
        showActive={showActive}
        onShowActiveChange={onShowActiveChange}
      />
      <ProductTable
        products={products}
        isLoading={isLoading}
        onEditProduct={handleEditProduct}
        onToggleProductStatus={handleToggleProductStatus}
      />
      <PaginationComponent
        currentPage={currentPage}
        setCurrentPage={onPageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default ProductPageContent;
