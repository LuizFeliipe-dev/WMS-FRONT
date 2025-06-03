
import { motion } from 'framer-motion';
import { Item } from '@/types/item';
import ItemsHeader from './ItemsHeader';
import ItemFilters from './ItemFilters';
import ItemsTable from './ItemsTable';
import { groups } from '@/hooks/useItems';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/components/AppLayout';
import ResponsiveContainer from '@/components/ResponsiveContainer';

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
  handleAddItem: () => void;
  handleEditItem: (item: Item) => void;
  handleToggleItemStatus: (item: Item) => void;
  handleDeleteItem: (item: Item) => void;
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
  handleAddItem,
  handleEditItem,
  handleToggleItemStatus,
  handleDeleteItem
}: ItemsPageContentProps) => {
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
              groups={groups}
            />
            
            <ItemsTable 
              items={filteredItems}
              isLoading={isLoading}
              onEdit={handleEditItem}
              onToggleStatus={handleToggleItemStatus}
              onDelete={handleDeleteItem}
              filteredCount={filteredItems.length}
              totalCount={items.length}
            />
          </div>
        </motion.div>
      </ResponsiveContainer>
    </AppLayout>
  );
};

export default ItemsPageContent;
