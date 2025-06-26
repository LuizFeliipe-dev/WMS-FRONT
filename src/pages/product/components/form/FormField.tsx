
import React from 'react';
import {
  FormControl,
  FormField as UIFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '@/types/product';

interface FormFieldProps {
  form: UseFormReturn<ProductFormValues>;
  name: keyof ProductFormValues;
  label: string;
  children: React.ReactNode;
}

const FormField = ({ form, name, label, children }: FormFieldProps) => {
  return (
    <UIFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {React.isValidElement(children)
              ? React.cloneElement(children, { ...field })
              : children}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
