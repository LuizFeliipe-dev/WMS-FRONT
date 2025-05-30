
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ItemFormValues } from '@/types/item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FormField from './FormField';

interface Option {
  id: string;
  name: string;
}

interface SelectFieldProps {
  form: UseFormReturn<ItemFormValues>;
  name: keyof ItemFormValues;
  label: string;
  options: Option[];
  placeholder?: string;
}

const SelectField = ({ 
  form, 
  name, 
  label, 
  options, 
  placeholder = 'Selecione...'
}: SelectFieldProps) => {
  return (
    <FormField form={form} name={name} label={label}>
      <Select 
        onValueChange={value => form.setValue(name, value)}
        value={form.watch(name)?.toString() || undefined}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
};

export default SelectField;
