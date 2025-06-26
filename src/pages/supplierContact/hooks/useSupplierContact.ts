import { useEffect, useState, useRef } from 'react';
import { ISupplierContact } from '@/types/supplier';
import { useToast } from '@/hooks/use-toast';
import { supplierContactService } from '@/services/supplierContact';
import { set } from 'date-fns';

interface UseSupplierContactsProps {
  supplierId: string;
  showActive: boolean;
}

export const useSupplierContacts = ({ supplierId, showActive }: UseSupplierContactsProps) => {
  const [contacts, setContacts] = useState<ISupplierContact[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchContacts = async () => {
    if (!supplierId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const response = await supplierContactService.getBySupplierId(supplierId);
      setContacts(response.data);
    } catch (error: any) {
      if (error.name === 'AbortError') return;

      if (error?.details === 'SUPPLIERS_CONTACTS_NOT_FOUND') {
        setContacts([]);
        return;
      }

      toast({
        title: 'Erro ao buscar contatos',
        description: 'Não foi possível buscar os contatos do fornecedor.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [supplierId, showActive]);

  const toggleStatus = async (contact: ISupplierContact) => {
    try {
      if (contact.active) {
        await supplierContactService.inactivate(contact.id);
      } else {
        await supplierContactService.reactivate(contact.id);
      }
      toast({
        title: contact.active ? 'Contato inativado' : 'Contato ativado',
        description: `O contato ${contact.name} foi ${contact.active ? 'inativado' : 'ativado'} com sucesso.`,
      });
      fetchContacts();
    } catch (error) {
      toast({
        title: 'Erro ao alterar status',
        description: 'Não foi possível alterar o status do contato.',
        variant: 'destructive',
      });
    }
  };

   const createSupplierContact = async (supplierId: string, supplierContact) => {
      try {
        const newSupplierContact = await supplierContactService.addContacts(supplierId, supplierContact);
        toast({
          title: 'Sucesso',
          description: 'Contato criado com sucesso.',
        });
        await fetchContacts();
        return newSupplierContact;
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Falha ao criar contato. Tente novamente.',
          variant: 'destructive',
        });
        throw error;
      }
    };

    const updateSupplierContact = async (supplierId: string, supplierContact) => {
      try {
        const updatedSupplierContact = await supplierContactService.update(supplierId, supplierContact);
        toast({
          title: 'Sucesso',
          description: 'Contato atualizado com sucesso.',
        });
        await fetchContacts();
        return updatedSupplierContact;
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Falha ao atualizar contato. Tente novamente.',
          variant: 'destructive',
        });
        throw error;
      }
    };

  return {
    contacts,
    loading,
    fetchContacts,
    toggleStatus,
    createSupplierContact,
    updateSupplierContact,
  };
};
