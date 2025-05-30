
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { ItemFormValues } from '@/types/item';
import { itemFormSchema } from './items/form/ItemFormSchema';
import InputField from './items/form/InputField';
import TextAreaField from './items/form/TextAreaField';
import SelectField from './items/form/SelectField';
import { Switch } from '@/components/ui/switch';

interface ItemFormProps {
  initialData?: ItemFormValues | null;
  onSubmit: (data: ItemFormValues) => void;
  suppliers: { id: string; name: string }[];
  groups: { id: string; name: string }[];
}

const ItemForm = ({
  initialData,
  onSubmit,
  suppliers,
  groups
}: ItemFormProps) => {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: initialData || {
      code: '',
      name: '',
      description: '',
      group: '',
      supplier: '',
      minStock: 0,
      price: 0,
      active: true,
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            form={form}
            name="code"
            label="Código"
            placeholder="ITM001"
          />
          
          <div className="md:col-span-2">
            <InputField
              form={form}
              name="name"
              label="Nome do Item"
              placeholder="Nome do item"
            />
          </div>
        </div>
        
        <TextAreaField
          form={form}
          name="description"
          label="Descrição"
          placeholder="Descrição detalhada do item"
          className="min-h-[100px]"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            form={form}
            name="group"
            label="Grupo"
            options={groups}
            placeholder="Selecione um grupo"
          />
          
          <SelectField
            form={form}
            name="supplier"
            label="Fornecedor"
            options={suppliers}
            placeholder="Selecione um fornecedor"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            form={form}
            name="minStock"
            label="Estoque Mínimo"
            type="number"
            min="0"
          />
          
          <InputField
            form={form}
            name="price"
            label="Preço Unitário (R$)"
            type="number"
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch 
            id="active" 
            checked={form.watch("active")} 
            onCheckedChange={(checked) => form.setValue("active", checked)}
          />
          <label htmlFor="active" className="cursor-pointer">
            Item Ativo
          </label>
        </div>
        
        <Button type="submit" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {initialData ? 'Salvar Alterações' : 'Cadastrar Item'}
        </Button>
      </form>
    </Form>
  );
};

export default ItemForm;
