
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '@/types/product';
import { Textarea } from '@/components/ui/textarea';
import FormField from './FormField';

interface TextAreaFieldProps {
  form: UseFormReturn<ProductFormValues>;
  name: keyof ProductFormValues;
  label: string;
  placeholder?: string;
  className?: string;
}

const TextAreaField = ({
  form,
  name,
  label,
  placeholder,
  className
}: TextAreaFieldProps) => {
  return (
    <FormField form={form} name={name} label={label}>
      <Textarea
        placeholder={placeholder}
        className={className}
      />
    </FormField>
  );
};

export default TextAreaField;
