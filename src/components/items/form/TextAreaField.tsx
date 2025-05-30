
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ItemFormValues } from '@/types/item';
import { Textarea } from '@/components/ui/textarea';
import FormField from './FormField';

interface TextAreaFieldProps {
  form: UseFormReturn<ItemFormValues>;
  name: keyof ItemFormValues;
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
