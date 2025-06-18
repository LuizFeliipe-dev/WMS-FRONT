
import React from 'react';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ItemsHeaderProps {
  onAddItem: () => void;
}

const ItemsHeader = ({ onAddItem }: ItemsHeaderProps) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-semibold flex items-center">
          <Package className="mr-3 h-8 w-8 text-primary" />
          Cadastro de Produtos
        </h1>
        <p className="text-gray-500 mt-1">
          Gerencie os produtos disponíveis no sistema
        </p>
      </div>
      
      <Button onClick={onAddItem}>
        <Plus className="mr-2 h-5 w-5" />
        Novo Produto
      </Button>
    </header>
  );
};

export default ItemsHeader;
