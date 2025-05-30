
import { motion } from 'framer-motion';
import { Item } from '@/types/item';
import ItemsHeader from './ItemsHeader';
import ItemFilters from './ItemFilters';
import ItemsTable from './ItemsTable';
import { groups } from '@/hooks/useItems';
import { useIsMobile } from '@/hooks/use-mobile';

interface ItemsPageContentProps {
  filteredItems: Item[];
  items: Item[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterGroup: string;
  setFilterGroup: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  handleAddItem: () => void;
  handleEditItem: (item: Item) => void;
  handleToggleItemStatus: (item: Item) => void;
}

const ItemsPageContent = ({
  filteredItems,
  items,
  searchTerm,
  setSearchTerm,
  filterGroup,
  setFilterGroup,
  statusFilter,
  setStatusFilter,
  handleAddItem,
  handleEditItem,
  handleToggleItemStatus
}: ItemsPageContentProps) => {
  const isMobile = useIsMobile();
  
  return (
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
          onEdit={handleEditItem}
          onToggleStatus={handleToggleItemStatus}
          filteredCount={filteredItems.length}
          totalCount={items.length}
        />
      </div>
    </motion.div>
  );
};

export default ItemsPageContent;
