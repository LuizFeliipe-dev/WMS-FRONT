import { IProduct } from '@/types/product';
import { Pencil, Power } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductTableProps {
  products: IProduct[];
  isLoading: boolean;
  onEditProduct: (item: IProduct) => void;
  onToggleProductStatus: (item: IProduct) => void;
}

const ProductTable = ({ products, isLoading, onEditProduct, onToggleProductStatus }: ProductTableProps) => {
  if (isLoading) {
    return (
      <div className="p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px] ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="p-4 text-sm text-gray-500">Nenhum item encontrado.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 font-medium text-gray-700">Nome</th>
            <th className="px-4 py-2 font-medium text-gray-700">Descrição</th>
            <th className="px-4 py-2 font-medium text-gray-700">Unidade</th>
            <th className="px-4 py-2 font-medium text-gray-700">Grupo</th>
            <th className="px-4 py-2 font-medium text-gray-700 text-center">Status</th>
            <th className="px-4 py-2 font-medium text-gray-700 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2 max-w-[250px] truncate" title={item.description}>{item.description}</td>
              <td className="px-4 py-2">{item.measurementUnit}</td>
              <td className="px-4 py-2">{item.group?.name || '-'}</td>
              <td className="px-4 py-2 text-center">
                <Badge variant={item.active ? 'default' : 'destructive'}>
                  {item.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </td>
              <td className="px-4 py-2 text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProduct(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleProductStatus(item)}
                >
                  <Power className="w-4 h-4 text-muted-foreground" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
