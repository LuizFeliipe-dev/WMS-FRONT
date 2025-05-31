
import { useState, useEffect } from 'react';
import { supplierService, Supplier } from '@/services/suppliers';
import { useToast } from './use-toast';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar fornecedores. Tente novamente.",
        variant: "destructive",
      });
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createSupplier = async (supplierData: Pick<Supplier, 'name' | 'active'>) => {
    try {
      const newSupplier = await supplierService.create(supplierData);
      setSuppliers(prev => [...prev, newSupplier]);
      toast({
        title: "Sucesso",
        description: "Fornecedor criado com sucesso.",
      });
      return newSupplier;
    } catch (error) {
      console.error('Error creating supplier:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar fornecedor. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSupplier = async (id: string, supplierData: Partial<Pick<Supplier, 'name' | 'active'>>) => {
    try {
      const updatedSupplier = await supplierService.update(id, supplierData);
      setSuppliers(prev => prev.map(supplier => 
        supplier.id === id ? updatedSupplier : supplier
      ));
      toast({
        title: "Sucesso",
        description: "Fornecedor atualizado com sucesso.",
      });
      return updatedSupplier;
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar fornecedor. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    suppliers,
    isLoading,
    loadSuppliers,
    createSupplier,
    updateSupplier
  };
};
