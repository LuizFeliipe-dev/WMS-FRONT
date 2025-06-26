import { useState, useEffect, useCallback } from 'react';
import { supplierService } from '@/services/suppliers';
import { useToast } from '../../../hooks/use-toast';
import { ISupplier } from '@/types/supplier';
import { useToggleStatus } from '@/hooks/useToggleStatus';
import { supplierContactService } from '@/services/supplierContact';

export const  useSuppliers = (initialTake = 10) => {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showActive, setShowActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [take] = useState(initialTake);
  const { toast } = useToast();

  const loadSuppliers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        take,
        page: currentPage,
        active: showActive,
        name: searchTerm,
      };
      const { data, meta } = await supplierService.getAll(params);
      setSuppliers(data);
      setTotalPages(meta?.totalPages || 1);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar fornecedores. Tente novamente.',
        variant: 'destructive',
      });
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, showActive, searchTerm, toast, take]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const createSupplier = async (supplierData: { name: string }) => {
    try {
      const newSupplier = await supplierService.create(supplierData);
      toast({
        title: 'Sucesso',
        description: 'Fornecedor criado com sucesso.',
      });
      await loadSuppliers();
      return newSupplier;
    } catch (error) {
      console.error('Error creating supplier:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao criar fornecedor. Tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateSupplier = async (id: string, supplierData: { name: string }) => {
    try {
      const updatedSupplier = await supplierService.update(id, supplierData);
      toast({
        title: 'Sucesso',
        description: 'Fornecedor atualizado com sucesso.',
      });
      await loadSuppliers();
      return updatedSupplier;
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar fornecedor. Tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const { handleToggleStatus } = useToggleStatus<ISupplier>({
    inactivateFn: supplierService.inactivate,
    reactivateFn: supplierService.reactivate,
    refreshFn: loadSuppliers,
    entityLabelSingular: 'Fornecedor',
  });

  const toggleSupplierStatus = async (supplier: ISupplier) => {
    await handleToggleStatus(supplier);
  };

  const addContacts = async (supplierId: string, contacts: any[]) => {
    try {
      await supplierContactService.addContacts(supplierId, contacts);
      toast({
        title: 'Sucesso',
        description: 'Contatos adicionados com sucesso.',
      });
    } catch (error) {
      console.error('Error adding contacts:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao adicionar contatos. Tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleShowActiveChange = (value: boolean) => {
    setShowActive(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    suppliers,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    showActive,
    setShowActive: handleShowActiveChange,
    searchTerm,
    setSearchTerm: handleSearchChange,
    loadSuppliers,
    createSupplier,
    updateSupplier,
    toggleSupplierStatus,
    addContacts,
  };
};
