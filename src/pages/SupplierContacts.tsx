import { useState, useEffect } from 'react';
import AuthRequired from '../components/AuthRequired';
import AppLayout from '@/components/AppLayout';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Contact,
  Plus,
  Search,
  Pencil,
  ToggleLeft,
  Loader2,
  Power,
  PowerOff
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Supplier, supplierService } from '@/services/suppliers';
import { getAuthHeader } from '@/utils/auth';

interface SupplierContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  supplierId: string;
  createdAt: string;
  updatedAt: string;
}

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 caracteres' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const SupplierContacts = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [contacts, setContacts] = useState<SupplierContact[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [editingContact, setEditingContact] = useState<SupplierContact | null>(null);
  const [selectedContact, setSelectedContact] = useState<SupplierContact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (selectedSupplierId) {
      fetchContacts();
    } else {
      setContacts([]);
    }
  }, [selectedSupplierId, showActive]);

  const fetchSuppliers = async () => {
    try {
      setIsLoadingSuppliers(true);
      const res = await supplierService.getAll();
      setSuppliers(res.filter(supplier => supplier.active));
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      toast({
        title: "Erro ao carregar fornecedores",
        description: "Não foi possível obter a lista de fornecedores",
        variant: "destructive"
      });
      setSuppliers([]);
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  const fetchContacts = async () => {
    if (!selectedSupplierId) return;

    try {
      setIsLoading(true);
      let url = `${import.meta.env.VITE_API_BASE_URL}/supplier/contact?supplierId=${selectedSupplierId}`;

      if (!showActive) {
        url += '&active=false';
      }

      const response = await fetch(url, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar contatos');
      }

      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast({
        title: "Erro ao carregar contatos",
        description: "Não foi possível obter a lista de contatos",
        variant: "destructive"
      });
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    if (!selectedSupplierId) {
      toast({
        title: "Erro",
        description: "Selecione um fornecedor primeiro",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingContact) {
        // Update contact
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/supplier/contact?contactId=${editingContact.id}`, {
          method: 'PUT',
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Falha ao atualizar contato');
        }

        toast({
          title: "Contato atualizado",
          description: "As informações do contato foram atualizadas com sucesso",
        });
      } else {
        // Create contact
        await supplierService.addContacts(selectedSupplierId, [data]);

        toast({
          title: "Contato adicionado",
          description: "Novo contato foi adicionado com sucesso",
        });
      }

      setOpenDialog(false);
      form.reset();
      setEditingContact(null);
      fetchContacts();
    } catch (error) {
      console.error('Failed to save contact:', error);
      toast({
        title: "Erro ao salvar contato",
        description: "Não foi possível salvar as informações do contato",
        variant: "destructive"
      });
    }
  };

  const handleAddContact = () => {
    if (!selectedSupplierId) {
      toast({
        title: "Erro",
        description: "Selecione um fornecedor primeiro",
        variant: "destructive"
      });
      return;
    }

    setEditingContact(null);
    form.reset({
      name: '',
      email: '',
      phone: '',
    });
    setOpenDialog(true);
  };

  const handleEditContact = (contact: SupplierContact) => {
    setEditingContact(contact);
    form.reset({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
    setOpenDialog(true);
  };

  const handleToggleContactStatus = (contact: SupplierContact) => {
    setSelectedContact(contact);
    setConfirmDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedContact) return;

    try {
      const endpoint = selectedContact.active
        ? `${import.meta.env.VITE_API_BASE_URL}/supplier/contact/inactivate?contactId=${selectedContact.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/supplier/contact/reactivate?contactId=${selectedContact.id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao alterar status do contato');
      }

      toast({
        title: selectedContact.active ? "Contato inativado" : "Contato ativado",
        description: `O contato ${selectedContact.name} foi ${selectedContact.active ? "inativado" : "ativado"} com sucesso.`,
      });

      fetchContacts();
    } catch (error) {
      console.error('Failed to toggle contact status:', error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do contato",
        variant: "destructive"
      });
    } finally {
      setConfirmDialogOpen(false);
      setSelectedContact(null);
    }
  };

  // Apply filters
  const filteredContacts = contacts.filter(contact => {
    return contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.phone.includes(searchTerm);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectedSupplierName = suppliers.find(s => s.id === selectedSupplierId)?.name || '';

  return (
    <AuthRequired>
      <AppLayout>
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold flex items-center">
                  <Contact className="mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
                  Contato de Fornecedores
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie os contatos dos fornecedores
                </p>
              </div>

              <Button onClick={handleAddContact} className={isMobile ? "w-full mt-4 md:mt-0" : ""}>
                <Plus className="mr-2 h-5 w-5" />
                Novo Contato
              </Button>
            </header>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 md:p-6 border-b">
                <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                  <div>
                    <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fornecedor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingSuppliers ? (
                          <SelectItem value="loading" disabled>Carregando...</SelectItem>
                        ) : (
                          suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSupplierId && (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          type="text"
                          placeholder="Buscar contatos..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch
                          id="show-active"
                          checked={showActive}
                          onCheckedChange={setShowActive}
                        />
                        <label htmlFor="show-active" className="text-sm font-medium">
                          Ativos
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedSupplierId ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Status</TableHead>
                        {!isMobile && <TableHead>Criado em</TableHead>}
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={isMobile ? 5 : 6} className="text-center py-6">
                            <div className="flex justify-center items-center space-x-2">
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                              <span>Carregando contatos...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredContacts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={isMobile ? 5 : 6} className="text-center py-6 text-muted-foreground">
                            {searchTerm ?
                              "Nenhum contato encontrado com os filtros aplicados." :
                              "Nenhum contato cadastrado para este fornecedor."}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredContacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.phone}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                contact.active
                                  ? 'bg-green-50 text-green-600 border border-green-200'
                                  : 'bg-gray-50 text-gray-600 border border-gray-200'
                              }`}>
                                {contact.active ? 'Ativo' : 'Inativo'}
                              </span>
                            </TableCell>
                            {!isMobile && <TableCell className="text-sm text-gray-500">{formatDate(contact.createdAt)}</TableCell>}
                            <TableCell className="text-right">
                              <div className="flex space-x-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditContact(contact)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleContactStatus(contact)}
                                >
                                  {contact.active ? (
                                    <PowerOff className="h-4 w-4" />
                                  ) : (
                                    <Power className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Contact className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Selecione um fornecedor para visualizar os contatos</p>
                </div>
              )}
            </div>
          </motion.div>
        </ResponsiveContainer>
      </AppLayout>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? 'Editar Contato' : 'Adicionar Novo Contato'}
            </DialogTitle>
            <DialogDescription>
              {editingContact
                ? 'Edite as informações do contato abaixo.'
                : `Preencha os campos abaixo para adicionar um novo contato para ${selectedSupplierName}.`}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 9 9999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingContact ? 'Salvar Alterações' : 'Cadastrar Contato'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedContact?.active ? "Inativar" : "Ativar"} Contato
            </DialogTitle>
            <DialogDescription>
              {selectedContact?.active
                ? "Você tem certeza que deseja inativar este contato?"
                : "Você tem certeza que deseja ativar este contato?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant={selectedContact?.active ? "destructive" : "default"}
              onClick={confirmToggleStatus}
            >
              {selectedContact?.active ? "Sim, inativar" : "Sim, ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default SupplierContacts;
