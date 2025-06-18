
import { motion } from 'framer-motion';
import { Item } from '@/types/item';
import ItemsHeader from './ItemsHeader';
import ItemFilters from './ItemFilters';
import ItemsTable from './ItemsTable';
import { groups } from '@/hooks/useItems';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface ItemsPageContentProps {
  filteredItems: Item[];
  items: Item[];
  isLoading?: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterGroup: string;
  setFilterGroup: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  showActive: boolean;
  onShowActiveChange: (value: boolean) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  handleAddItem: () => void;
  handleEditItem: (item: Item) => void;
  handleToggleItemStatus: (item: Item) => void;
}

const ItemsPageContent = ({
  filteredItems,
  items,
  isLoading = false,
  searchTerm,
  setSearchTerm,
  filterGroup,
  setFilterGroup,
  statusFilter,
  setStatusFilter,
  showActive,
  onShowActiveChange,
  currentPage = 1,
  onPageChange,
  handleAddItem,
  handleEditItem,
  handleToggleItemStatus
}: ItemsPageContentProps) => {
  // Transform groups to match expected format
  const transformedGroups = groups.map(group => ({
    value: group.id,
    label: group.name
  }));

  return (
    <AppLayout>
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <ItemsHeader onAddItem={handleAddItem} />
          
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
            <ItemFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterGroup={filterGroup}
              setFilterGroup={setFilterGroup}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              showActive={showActive}
              onShowActiveChange={onShowActiveChange}
              groups={transformedGroups}
            />
            
            <ItemsTable 
              items={filteredItems}
              isLoading={isLoading}
              onEdit={handleEditItem}
              onToggleStatus={handleToggleItemStatus}
              filteredCount={filteredItems.length}
              totalCount={items.length}
            />

            {onPageChange && (
              <div className="p-4 border-t flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(5)].map((_, i) => {
                      const page = Math.max(1, currentPage - 2) + i;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => onPageChange(page)}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => onPageChange(currentPage + 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </motion.div>
      </ResponsiveContainer>
    </AppLayout>
  );
};

export default ItemsPageContent;
