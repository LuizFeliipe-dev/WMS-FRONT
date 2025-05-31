
import React from 'react';
import { ItemFormValues } from '@/types/item';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import ItemForm from '../ItemForm';

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: ItemFormValues | null;
  onSubmit: (data: ItemFormValues) => void;
  groups: { id: string; name: string }[];
}

const ItemFormDialog = ({
  open,
  onOpenChange,
  editingItem,
  onSubmit,
  groups
}: ItemFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Editar Item' : 'Adicionar Novo Item'}</DialogTitle>
          <DialogDescription>
            {editingItem 
              ? 'Edite as informações do item abaixo.' 
              : 'Preencha os campos abaixo para adicionar um novo item.'}
          </DialogDescription>
        </DialogHeader>
        
        <ItemForm
          initialData={editingItem}
          onSubmit={onSubmit}
          groups={groups}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormDialog;
