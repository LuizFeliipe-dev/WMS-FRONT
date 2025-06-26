import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductHeaderProps {
  onAddProduct: () => void;
}

const ProductHeader = ({ onAddProduct }: ProductHeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center">
          <Package className="mr-2 h-7 w-7 text-primary" />
          Cadastro de Produtos
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Gerencie os produtos disponíveis no sistema.
        </p>
      </div>

      <Button onClick={onAddProduct} className="self-end md:self-auto">
        <Plus className="mr-2 h-5 w-5" />
        Novo Produto
      </Button>
    </header>
  );
};

export default ProductHeader;
