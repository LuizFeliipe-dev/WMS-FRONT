import { useState, useEffect } from 'react';
import { supplierService, Supplier } from '@/services/suppliers';
import { useToast } from './use-toast';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showActive, setShowActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadSuppliers();
  }, [currentPage, showActive, searchTerm]);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const params = {
        take: 10,
        page: currentPage,
        active: showActive,
        name: searchTerm
      };
      const res = await supplierService.getAll(params);
      setSuppliers(res);
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

  const createSupplier = async (supplierData: { name: string }) => {
    try {
      const newSupplier = await supplierService.create(supplierData);
      toast({
        title: "Sucesso",
        description: "Fornecedor criado com sucesso.",
      });
      await loadSuppliers();
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

  const updateSupplier = async (id: string, supplierData: { name: string }) => {
    try {
      const updatedSupplier = await supplierService.update(id, supplierData);
      toast({
        title: "Sucesso",
        description: "Fornecedor atualizado com sucesso.",
      });

      await loadSuppliers();
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

  const toggleSupplierStatus = async (supplier: Supplier) => {
    try {
      await supplierService.toggleStatus(supplier);
      toast({
        title: "Sucesso",
        description: "Status do fornecedor alterado com sucesso.",
      });
      await loadSuppliers();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao alterar status do fornecedor. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addContacts = async (supplierId: string, contacts: any[]) => {
    try {
      await supplierService.addContacts(supplierId, contacts);
      toast({
        title: "Sucesso",
        description: "Contatos adicionados com sucesso.",
      });
    } catch (error) {
      console.error('Error adding contacts:', error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar contatos. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleShowActiveChange = (value: boolean) => {
    setShowActive(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  return {
    suppliers,
    isLoading,
    currentPage,
    setCurrentPage,
    showActive,
    setShowActive: handleShowActiveChange,
    searchTerm,
    setSearchTerm: handleSearchChange,
    loadSuppliers,
    createSupplier,
    updateSupplier,
    toggleSupplierStatus,
    addContacts
  };
};
