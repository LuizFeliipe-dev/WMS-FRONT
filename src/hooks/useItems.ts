
import { useState } from 'react';
import { ItemFormValues } from '@/types/item';

// Mock data for the groups
export const groups = [
  { id: '1', name: 'Eletrônicos' },
  { id: '2', name: 'Móveis' },
  { id: '3', name: 'Utensílios' },
  { id: '4', name: 'Papelaria' },
  { id: '5', name: 'Insumos' },
];

// Mock data for the suppliers
export const suppliers = [
  { id: '1', name: 'Dell Computadores' },
  { id: '2', name: 'LG Brasil' },
  { id: '3', name: 'MobiliaCorp' },
  { id: '4', name: 'Logitech Brasil' },
  { id: '5', name: 'Café Especial SA' },
];

// Mock data for items
const mockItems = [
  {
    id: 1,
    code: 'ITM001',
    name: 'Notebook Dell Inspiron',
    description: 'Notebook Dell Inspiron 15" 8GB RAM 256GB SSD',
    group: '1',
    groupName: 'Eletrônicos',
    supplier: '1',
    supplierName: 'Dell Computadores',
    stock: 23,
    minStock: 5,
    price: 3499.99,
    active: true,
  },
  {
    id: 2,
    code: 'ITM002',
    name: 'Monitor LG UltraWide',
    description: 'Monitor LG UltraWide 29" IPS HDR',
    group: '1',
    groupName: 'Eletrônicos',
    supplier: '2',
    supplierName: 'LG Brasil',
    stock: 15,
    minStock: 3,
    price: 1899.99,
    active: true,
  },
  {
    id: 3,
    code: 'ITM003',
    name: 'Mesa de Escritório',
    description: 'Mesa para escritório com gavetas 120x60cm',
    group: '2',
    groupName: 'Móveis',
    supplier: '3',
    supplierName: 'MobiliaCorp',
    stock: 7,
    minStock: 2,
    price: 799.99,
    active: false,
  },
  {
    id: 4,
    code: 'ITM004',
    name: 'Mouse sem Fio Logitech',
    description: 'Mouse sem fio Logitech M170',
    group: '1',
    groupName: 'Eletrônicos',
    supplier: '4',
    supplierName: 'Logitech Brasil',
    stock: 42,
    minStock: 10,
    price: 79.99,
    active: true,
  },
  {
    id: 5,
    code: 'ITM005',
    name: 'Café em Grãos Premium',
    description: 'Café em grãos especiais 1kg',
    group: '5',
    groupName: 'Insumos',
    supplier: '5',
    supplierName: 'Café Especial SA',
    stock: 30,
    minStock: 5,
    price: 49.99,
    active: true,
  },
];

export const useItems = () => {
  const [items, setItems] = useState(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormValues | null>(null);

  // Filter items based on search term and group filter
  const filteredItems = items.filter(item => {
    // Text search
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Group filter
    let matchesGroup = true;
    if (filterGroup !== 'all') {
      matchesGroup = item.group === filterGroup;
    }
    
    return matchesSearch && matchesGroup;
  });

  // Add new item
  const handleAddItem = () => {
    setEditingItem(null);
    setOpenDialog(true);
  };

  // Edit existing item
  const handleEditItem = (item: any) => {
    setEditingItem({
      code: item.code,
      name: item.name,
      description: item.description || '',
      group: item.group,
      supplier: item.supplier,
      minStock: item.minStock,
      price: item.price,
      active: item.active
    });
    setOpenDialog(true);
  };

  // Delete item
  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Submit form handler (add/edit)
  const onSubmitItem = (data: ItemFormValues) => {
    if (editingItem) {
      // Edit existing item
      setItems(items.map(item => 
        item.code === editingItem.code 
          ? { 
              ...item, 
              name: data.name,
              description: data.description,
              group: data.group,
              groupName: groups.find(g => g.id === data.group)?.name || '',
              supplier: data.supplier,
              supplierName: suppliers.find(s => s.id === data.supplier)?.name || '',
              minStock: data.minStock,
              price: data.price,
              active: data.active
            } 
          : item
      ));
    } else {
      // Add new item
      const newItem = {
        id: items.length + 1,
        code: data.code,
        name: data.name,
        description: data.description,
        group: data.group,
        groupName: groups.find(g => g.id === data.group)?.name || '',
        supplier: data.supplier,
        supplierName: suppliers.find(s => s.id === data.supplier)?.name || '',
        stock: 0,
        minStock: data.minStock,
        price: data.price,
        active: data.active
      };
      setItems([...items, newItem]);
    }
    setOpenDialog(false);
  };

  return {
    items,
    filteredItems,
    searchTerm,
    setSearchTerm,
    filterGroup,
    setFilterGroup,
    openDialog,
    setOpenDialog,
    editingItem,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    onSubmitItem
  };
};
