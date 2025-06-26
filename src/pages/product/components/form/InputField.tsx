
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '@/types/product';
import { Input } from '@/components/ui/input';
import FormField from './FormField';

interface InputFieldProps {
  form: UseFormReturn<ProductFormValues>;
  name: keyof ProductFormValues;
  label: string;
  placeholder?: string;
  type?: string;
  min?: string;
  step?: string;
}

const InputField = ({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  min,
  step
}: InputFieldProps) => {
  return (
    <FormField form={form} name={name} label={label}>
      <Input
        placeholder={placeholder}
        type={type}
        min={min}
        step={step}
      />
    </FormField>
  );
};

export default InputField;
