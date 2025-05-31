
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
  groups: { id: string; name: string }[];
}

const ItemForm = ({
  initialData,
  onSubmit,
  groups
}: ItemFormProps) => {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      measurementUnit: '',
      productGroupId: '',
      active: true,
    }
  });

  const measurementUnits = [
    { id: 'UN', name: 'Unidade (UN)' },
    { id: 'KG', name: 'Quilograma (KG)' },
    { id: 'G', name: 'Grama (G)' },
    { id: 'L', name: 'Litro (L)' },
    { id: 'ML', name: 'Mililitro (ML)' },
    { id: 'M', name: 'Metro (M)' },
    { id: 'CM', name: 'Centímetro (CM)' },
    { id: 'PC', name: 'Peça (PC)' },
    { id: 'CX', name: 'Caixa (CX)' },
    { id: 'PCT', name: 'Pacote (PCT)' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          form={form}
          name="name"
          label="Nome do Item"
          placeholder="Nome do item"
        />
        
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
            name="measurementUnit"
            label="Unidade de Medida"
            options={measurementUnits}
            placeholder="Selecione a unidade"
          />
          
          <SelectField
            form={form}
            name="productGroupId"
            label="Grupo"
            options={groups}
            placeholder="Selecione um grupo"
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
