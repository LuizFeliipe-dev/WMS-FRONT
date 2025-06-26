import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductFormValues } from '@/types/product';
import ProductForm from './form/productForm';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: ProductFormValues | null;
  onSubmit: (data: ProductFormValues) => void;
  groups: { id: string; name: string }[];
}

const ProductFormDialog = ({
  open,
  onOpenChange,
  editingProduct,
  onSubmit,
  groups,
}: ProductFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? 'Editar Item' : 'Adicionar Novo Item'}
          </DialogTitle>
          <DialogDescription>
            {editingProduct
              ? 'Edite as informações do item abaixo.'
              : 'Preencha os campos abaixo para adicionar um novo item.'}
          </DialogDescription>
        </DialogHeader>

        <ProductForm
          initialData={editingProduct}
          onSubmit={onSubmit}
          groups={groups}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
